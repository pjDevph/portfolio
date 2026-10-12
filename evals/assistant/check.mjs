// Deterministic checks for one assistant answer. Pure functions, no network.
// Regexes are case-insensitive. A question may set:
//   must      every pattern must match
//   mustAny   at least one pattern must match
//   atLeast   {n, of}: at least n of the patterns must match
//   mustNot   no pattern may match
//   handoff   the answer must point to the contact form / email / LinkedIn
//   maxWords  length ceiling
const re = (p) => new RegExp(p, "i");
const HANDOFF = /contact form|contact prince|#contact|pgandollas@gmail\.com|email|linkedin|reach out|get in touch/i;

export function checkAnswer(q, text) {
  const failures = [];
  const t = text ?? "";
  if (!t.trim()) return ["empty answer"];
  for (const p of q.must ?? []) if (!re(p).test(t)) failures.push(`missing required /${p}/`);
  if (q.mustAny && !q.mustAny.some((p) => re(p).test(t))) failures.push(`none of mustAny matched (${q.mustAny.length} patterns)`);
  if (q.atLeast) {
    const hits = q.atLeast.of.filter((p) => re(p).test(t)).length;
    if (hits < q.atLeast.n) failures.push(`only ${hits}/${q.atLeast.n} expected topics mentioned`);
  }
  for (const p of q.mustNot ?? []) if (re(p).test(t)) failures.push(`forbidden pattern matched /${p}/`);
  if (q.handoff && !HANDOFF.test(t)) failures.push("no hand-off to contact form/email");
  const words = t.trim().split(/\s+/).length;
  if (q.maxWords && words > q.maxWords) failures.push(`too long (${words} > ${q.maxWords} words)`);
  return failures;
}
