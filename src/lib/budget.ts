// Monthly spend guard for the AI assistant, enforced in code.
// Before each model call we atomically RESERVE a worst-case cost; if that would push the
// month's total past MONTHLY_BUDGET_USD the reservation is rolled back and the caller uses the
// free FAQ fallback instead. After the call we settle the reservation to the real cost.
// With Upstash Redis configured the counter is shared by every server; without it (or if Redis
// errors) it is per instance, so also set a spend limit in the Anthropic console as the hard stop.
import { persistentLimitsEnabled, redisPipeline } from "@/lib/rate-limit";

const MICRO = 1_000_000;
const DEFAULT_BUDGET_USD = 2;

export function monthlyBudgetUsd(): number {
  const raw = process.env.MONTHLY_BUDGET_USD;
  if (raw === undefined || raw.trim() === "") return DEFAULT_BUDGET_USD;
  const v = Number(raw);
  return Number.isFinite(v) && v >= 0 ? v : DEFAULT_BUDGET_USD;
}

export const monthKey = (d = new Date()) => `assistant:spend:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

const memory = new Map<string, number>();

async function add(key: string, deltaMicro: number): Promise<number> {
  if (persistentLimitsEnabled()) {
    try {
      const data = await redisPipeline([["INCRBY", key, deltaMicro], ["PEXPIRE", key, 45 * 24 * 3600 * 1000]]);
      return Number(data[0].result);
    } catch (err) {
      console.error(JSON.stringify({ event: "budget_redis_error", message: err instanceof Error ? err.message : "unknown" }));
    }
  }
  const next = (memory.get(key) ?? 0) + deltaMicro;
  memory.set(key, next);
  return next;
}

export type Reservation = { ok: true; settle: (actualUsd: number | null, keepReserved?: boolean) => Promise<void> } | { ok: false };

export async function reserveBudget(worstCaseUsd: number): Promise<Reservation> {
  const budgetMicro = Math.round(monthlyBudgetUsd() * MICRO);
  const reserveMicro = Math.max(1, Math.ceil(worstCaseUsd * MICRO));
  if (budgetMicro === 0) return { ok: false };
  const key = monthKey();
  const total = await add(key, reserveMicro);
  if (total > budgetMicro) {
    await add(key, -reserveMicro);
    return { ok: false };
  }
  let settled = false;
  return {
    ok: true,
    async settle(actualUsd, keepReserved = false) {
      if (settled) return;
      settled = true;
      if (keepReserved) return; // unknown outcome after output started: stay conservative
      const actualMicro = actualUsd === null ? 0 : Math.round(actualUsd * MICRO);
      const delta = actualMicro - reserveMicro;
      if (delta !== 0) await add(key, delta);
    },
  };
}

/** For logs and tests only. */
export async function spentUsd(): Promise<number> {
  return (await add(monthKey(), 0)) / MICRO;
}
