// Optional Cloudflare Turnstile. Enabled only when TURNSTILE_SECRET_KEY is set
// (and NEXT_PUBLIC_TURNSTILE_SITE_KEY for the browser widget). When it is on,
// verification fails closed: no valid token, no answer.

export const turnstileEnabled = () => Boolean(process.env.TURNSTILE_SECRET_KEY);

export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== "string" || !token || token.length > 2048) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") form.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return false;
    return ((await res.json()) as { success?: boolean }).success === true;
  } catch (err) {
    console.error("turnstile: verification request failed", err instanceof Error ? err.message : err);
    return false;
  }
}
