// Runs the question set through the real /api/chat route and reports pass/fail,
// latency, tokens and estimated cost. Needs a running server with a REAL key:
//   ANTHROPIC_API_KEY=... EXPOSE_USAGE=1 npm run dev     (terminal 1)
//   npm run assistant:eval                               (terminal 2)
// Flags: --base=http://localhost:3000  --only=<category|id>  --out=<dir>
// Turnstile must be off for local evals (leave TURNSTILE_SECRET_KEY unset).
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { checkAnswer } from "./check.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;
const base = arg("base", "http://localhost:3000");
const only = arg("only", "");
const allowFree = process.argv.includes("--allow-free");
const outDir = arg("out", path.join(here, "results"));
const questions = JSON.parse(readFileSync(path.join(here, "questions.json"), "utf8")).filter((q) => !only || q.category === only || q.id === only);

async function ask(q, n) {
  const started = Date.now();
  // Distinct client address per question so the per-visitor rate limit doesn't throttle the run.
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.99.${Math.floor(n / 250)}.${n % 250}` },
    body: JSON.stringify({ messages: [{ role: "user", content: q.q }] }),
  });
  if (!res.ok) return { text: "", error: `HTTP ${res.status}: ${(await res.text()).slice(0, 120)}`, ms: Date.now() - started };
  let text = "", error = null, usage = null, firstMs = null, buffer = "", notice = null;
  const reader = res.body.getReader(), dec = new TextDecoder();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const raw = buffer.slice(0, nl).trim(); buffer = buffer.slice(nl + 1);
      if (!raw) continue;
      const e = JSON.parse(raw);
      if (e.t === "delta") { firstMs ??= Date.now() - started; text += e.v; }
      else if (e.t === "notice") notice = e.v;
      else if (e.t === "error") error = e.v;
      else if (e.t === "done" && e.usage) usage = e.usage;
    }
  }
  return { text, error, usage, notice, firstMs, ms: Date.now() - started };
}

const results = [];
let n = 0;
for (const q of questions) {
  const r = await ask(q, n++);
  const free = Boolean(r.notice);
  // Free FAQ answers are checked too, but they are reported separately: the point of this suite is the MODEL.
  const failures = r.error ? [`request error: ${r.error}`] : checkAnswer(q, r.text);
  if (free && !allowFree) failures.push("answered by the free FAQ, not the model (use --allow-free to evaluate those too)");
  results.push({ id: q.id, category: q.category, question: q.q, answer: r.text, pass: failures.length === 0, failures, usage: r.usage?.mode === "faq" ? null : r.usage, free, topic: r.usage?.topic ?? null, firstTokenMs: r.firstMs, totalMs: r.ms });
  console.log(`${failures.length ? "FAIL" : "pass"}  [${q.category}] ${q.id}${failures.length ? "\n      - " + failures.join("\n      - ") : ""}`);
}

const passed = results.filter((r) => r.pass).length;
const byCat = {};
for (const r of results) {
  byCat[r.category] ??= { pass: 0, total: 0 };
  byCat[r.category].total++;
  if (r.pass) byCat[r.category].pass++;
}
const used = results.filter((r) => r.usage);
const freeCount = results.filter((r) => r.free).length;
const sum = (k) => used.reduce((a, r) => a + (r.usage[k] ?? 0), 0);
console.log("\n=== Summary");
console.log(`Passed ${passed}/${results.length}  (${freeCount} answered free by the built-in FAQ, ${results.length - freeCount} by the model)`);
for (const [c, v] of Object.entries(byCat)) console.log(`  ${c.padEnd(14)} ${v.pass}/${v.total}`);
if (used.length) {
  const cost = used.reduce((a, r) => a + (r.usage.est_cost_usd ?? 0), 0);
  console.log(`Tokens: input ${sum("input_tokens")}, cache read ${sum("cache_read_input_tokens")}, cache write ${sum("cache_creation_input_tokens")}, output ${sum("output_tokens")}`);
  console.log(`Estimated cost: $${cost.toFixed(4)} total, $${(cost / used.length).toFixed(4)} per answer (list-price estimate)`);
  const ms = results.map((r) => r.totalMs).sort((a, b) => a - b);
  console.log(`Latency: median ${ms[Math.floor(ms.length / 2)]} ms, max ${ms.at(-1)} ms`);
} else {
  console.log("No usage data returned. Start the server with EXPOSE_USAGE=1 to measure tokens and cost.");
}
mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `eval-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
writeFileSync(file, JSON.stringify({ base, model: used[0]?.usage.model ?? null, passed, total: results.length, results }, null, 2));
console.log(`Transcripts saved to ${file}. Read them: passing checks do not prove an answer is good.`);
process.exit(passed === results.length ? 0 : 1);
