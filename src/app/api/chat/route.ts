import Anthropic from "@anthropic-ai/sdk";
import { ASSISTANT_MODEL, LIMITS, SYSTEM_PROMPT, parseMessages } from "@/lib/assistant";
import { reserveBudget, monthlyBudgetUsd } from "@/lib/budget";
import { matchFaq } from "@/lib/faq";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { turnstileEnabled, verifyTurnstile } from "@/lib/turnstile";
import { costUsd, summarizeUsage, worstCaseUsd } from "@/lib/usage";

export const runtime = "nodejs";
export const maxDuration = 60;

// Per visitor: 15 questions / 10 min. Per instance: 400 questions / day.
// Shared across instances when Upstash Redis is configured; otherwise best-effort
// per instance (see lib/rate-limit.ts). Spend is capped separately by lib/budget.ts.
const perIpLimited = createRateLimiter(15, 10 * 60 * 1000, "chat-ip");
const globalLimited = createRateLimiter(400, 24 * 60 * 60 * 1000, "chat-day");

type StreamEvent = { t: "delta" | "error" | "done" | "notice"; v?: string; usage?: unknown };
const encoder = new TextEncoder();
const line = (event: StreamEvent) => encoder.encode(JSON.stringify(event) + "\n");
const json = (error: string, status: number) => Response.json({ error }, { status });
const streamHeaders = { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

/** Free answer from the built-in FAQ, streamed in the same format as a model answer. */
function faqResponse(question: string, reason: string, why: string, turns: number) {
  const m = matchFaq(question, { turns });
  console.log(JSON.stringify({ event: "assistant_free_answer", why, topic: m.id, confident: m.confident }));
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(line({ t: "notice", v: reason }));
      controller.enqueue(line({ t: "delta", v: m.text }));
      // Topic and mode are only exposed for the offline evaluation scripts (EXPOSE_USAGE=1).
      controller.enqueue(line(process.env.EXPOSE_USAGE === "1" ? { t: "done", usage: { mode: "faq", why, topic: m.id, confident: m.confident } } : { t: "done" }));
      controller.close();
    },
  });
  return new Response(body, { headers: streamHeaders });
}

export async function POST(req: Request) {
  // Browsers always send Origin on cross-site POSTs; reject ones from other sites.
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json("Forbidden.", 403);

  let body: { messages?: unknown; turnstileToken?: unknown };
  try {
    body = await req.json();
  } catch {
    return json("Invalid request.", 400);
  }
  const messages = parseMessages(body.messages);
  if (!messages) return json(`Messages must be ${LIMITS.maxMessageChars} characters or fewer, and the conversation short.`, 400);

  const ip = clientIp(req);
  if ((await perIpLimited(ip)) || (await globalLimited("all"))) {
    return json("The assistant is busy. Please try again in a few minutes, or use the contact form.", 429);
  }
  if (turnstileEnabled() && !(await verifyTurnstile(body.turnstileToken, ip))) {
    return json("Verification failed. Please refresh the page and try again, or use the contact form.", 403);
  }

  const question = messages[messages.length - 1].content;

  // 1) ANSWER-FIRST: common questions are answered from the built-in FAQ for free, so they never spend budget.
  const turns = messages.length;
  const quick = matchFaq(question, { turns });
  if (quick.confident && process.env.FAQ_FIRST !== "0") {
    return faqResponse(question, "Quick answer from the site's built-in FAQ. Ask something more specific and the AI assistant will take it.", "answer_first", turns);
  }

  // 2) Everything else needs the model: decide between it and the free fallback BEFORE spending anything.
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return faqResponse(question, "The AI assistant isn't switched on right now, so this answer comes from the site's built-in FAQ.", "no_key", turns);
  }
  const inputChars = SYSTEM_PROMPT.length + messages.reduce((n, m) => n + m.content.length, 0);
  const reservation = await reserveBudget(worstCaseUsd(ASSISTANT_MODEL, inputChars, LIMITS.maxOutputTokens));
  if (!reservation.ok) {
    return faqResponse(question, "The AI assistant has reached its monthly budget, so this answer comes from the site's built-in FAQ.", "budget_exhausted", turns);
  }

  const startedAt = Date.now();
  const stream = getClient().messages.stream(
    {
      model: ASSISTANT_MODEL,
      max_tokens: LIMITS.maxOutputTokens,
      // Short factual answers: keep reasoning light to stay fast and cheap.
      output_config: { effort: "low" },
      // The knowledge base is the large, stable prefix; cache it across visitors.
      cache_control: { type: "ephemeral" },
      system: SYSTEM_PROMPT,
      messages,
    },
    { signal: req.signal },
  );

  const body$ = new ReadableStream({
    async start(controller) {
      let sent = false;
      try {
        stream.on("text", (delta) => {
          sent = true;
          controller.enqueue(line({ t: "delta", v: delta }));
        });
        const final = await stream.finalMessage();
        const usage = summarizeUsage(final.model, final.stop_reason, final.usage, startedAt);
        await reservation.settle(costUsd(final.model, final.usage));

        if (final.stop_reason === "refusal") {
          controller.enqueue(line({ t: "error", v: "I can't help with that one. Try asking about Prince's projects, skills, or experience." }));
        } else if (!sent) {
          controller.enqueue(line({ t: "error", v: "I couldn't produce an answer. Please try rephrasing, or use the contact form." }));
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(line({ t: "delta", v: " …" }));
        }

        // Token usage and estimated cost only — never the visitor's message, the answer, or the IP.
        console.log(JSON.stringify({ event: "assistant_usage", ...usage, budget_usd: monthlyBudgetUsd() }));
        // EXPOSE_USAGE=1 lets the evaluation script read usage from the stream; leave it off in production.
        controller.enqueue(line(process.env.EXPOSE_USAGE === "1" ? { t: "done", usage } : { t: "done" }));
      } catch (err) {
        if (req.signal.aborted) {
          await reservation.settle(null, sent);
          return;
        }
        console.error(JSON.stringify({ event: "assistant_error", name: err instanceof Error ? err.name : "unknown", status: err instanceof Anthropic.APIError ? err.status : undefined }));
        if (!sent) {
          // Nothing reached the visitor yet: release the reservation and answer from the free FAQ instead.
          await reservation.settle(null);
          controller.enqueue(line({ t: "notice", v: "The AI assistant is temporarily unavailable, so this answer comes from the site's built-in FAQ." }));
          controller.enqueue(line({ t: "delta", v: matchFaq(question, { turns }).text }));
        } else {
          // Failed mid-answer: keep the reservation (cost unknown) and tell the visitor.
          await reservation.settle(null, true);
          controller.enqueue(line({ t: "error", v: "The answer was cut off. Please try again, or use the contact form." }));
        }
        controller.enqueue(line({ t: "done" }));
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed by an abort */
        }
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, { headers: streamHeaders });
}
