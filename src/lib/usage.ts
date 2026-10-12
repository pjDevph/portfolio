// Token usage and estimated cost, for logs only. Never include message text.
// Prices are USD per million tokens from Anthropic's published list prices as of
// 2026-10-06; they are estimates — check the pricing page before relying on them.

type Price = { input: number; output: number; cacheRead: number; cacheWrite: number };

const PRICES: Record<string, Price> = {
  "claude-opus-5-5": { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 },
  "claude-opus-5": { input: 5, output: 25, cacheRead: 0.25, cacheWrite: 6.25 },
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
  "claude-sonnet-5": { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
};

// Unknown/custom model ids are priced at the highest known rate so a budget can never be undercounted.
const CONSERVATIVE: Price = { input: 5, output: 25, cacheRead: 0.25, cacheWrite: 6.25 };
export const priceFor = (model: string): Price => PRICES[model] ?? CONSERVATIVE;

type RawUsage = { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null };

/** Actual cost in USD of a finished request, from its reported usage. */
export function costUsd(model: string, usage: RawUsage): number {
  const p = priceFor(model);
  return (usage.input_tokens * p.input + (usage.cache_read_input_tokens ?? 0) * p.cacheRead + (usage.cache_creation_input_tokens ?? 0) * p.cacheWrite + usage.output_tokens * p.output) / 1e6;
}

/** Upper bound for one request: every input char as 1/3 token at the uncached rate, plus a full output allowance. */
export function worstCaseUsd(model: string, inputChars: number, maxOutputTokens: number): number {
  const p = priceFor(model);
  return (Math.ceil(inputChars / 3) * p.input + maxOutputTokens * p.output) / 1e6;
}

export type UsageSummary = {
  model: string;
  stop_reason: string | null;
  input_tokens: number;
  cache_read_input_tokens: number;
  cache_creation_input_tokens: number;
  output_tokens: number;
  est_cost_usd: number;
  price_known: boolean;
  ms: number;
};

export function summarizeUsage(model: string, stopReason: string | null, usage: RawUsage, startedAt: number): UsageSummary {
  return {
    model,
    stop_reason: stopReason,
    input_tokens: usage.input_tokens,
    cache_read_input_tokens: usage.cache_read_input_tokens ?? 0,
    cache_creation_input_tokens: usage.cache_creation_input_tokens ?? 0,
    output_tokens: usage.output_tokens,
    est_cost_usd: Math.round(costUsd(model, usage) * 1e6) / 1e6,
    price_known: model in PRICES,
    ms: Date.now() - startedAt,
  };
}
