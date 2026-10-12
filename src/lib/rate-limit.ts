// Fixed-window rate limiter. With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
// set, counts live in Redis and are shared across serverless instances. Without
// them (or if Redis errors or times out) it falls back to per-instance memory,
// which only slows bursts. Pair either with a spend limit on the provider key.

export type Limiter = (key: string) => Promise<boolean>;

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_TIMEOUT_MS = 1500;

export const persistentLimitsEnabled = () => Boolean(REDIS_URL && REDIS_TOKEN);

// Visitors' IPs are hashed before they reach Redis so the store holds no raw addresses.
async function hashKey(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
}

type RedisReply = { result?: unknown; error?: string };

/** Runs commands in one Upstash REST pipeline call. Throws on transport or command errors. */
export async function redisPipeline(commands: (string | number)[][]): Promise<RedisReply[]> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands.map((c) => c.map(String))),
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const data = (await res.json()) as RedisReply[];
  const failed = data.find((d) => d.error);
  if (failed) throw new Error(failed.error);
  return data;
}

async function redisCount(redisKey: string, windowMs: number): Promise<number> {
  const data = await redisPipeline([["INCR", redisKey], ["PEXPIRE", redisKey, windowMs * 2]]);
  if (typeof data[0]?.result !== "number") throw new Error("Bad Redis reply");
  return data[0].result;
}

export function createRateLimiter(max: number, windowMs: number, name = "rl"): Limiter {
  const hits = new Map<string, number[]>();

  function memoryLimited(key: string): boolean {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    hits.set(key, recent);
    // Keep the map from growing without bound on a long-lived instance.
    if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    return false;
  }

  return async function limited(key: string): Promise<boolean> {
    if (persistentLimitsEnabled()) {
      try {
        const bucket = Math.floor(Date.now() / windowMs);
        return (await redisCount(`${name}:${await hashKey(key)}:${bucket}`, windowMs)) > max;
      } catch (err) {
        console.error(`rate-limit(${name}): Redis unavailable, using memory`, err instanceof Error ? err.message : err);
      }
    }
    return memoryLimited(key);
  };
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
