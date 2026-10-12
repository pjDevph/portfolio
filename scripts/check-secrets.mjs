// Fails if source, config, or built client bundles contain credential-shaped strings.
// Prints locations and types only, never the matched value.
// Usage: node scripts/check-secrets.mjs [dir ...]   (default: project source + .next/static)
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const targets = process.argv.slice(2).length
  ? process.argv.slice(2).map((d) => path.resolve(d))
  : ["src", "scripts", "evals", "public", ".github", "next.config.mjs", "package.json", ".env.example", ".next/static"].map((d) => path.join(root, d)).filter(existsSync);

const SKIP_DIRS = new Set(["node_modules", ".git", "results"]);
const SELF = path.join(here, "check-secrets.mjs");
const RULES = [
  ["Anthropic API key", /sk-ant-[A-Za-z0-9_-]{16,}/],
  ["Resend API key", /\bre_[A-Za-z0-9]{6,}_[A-Za-z0-9]{16,}\b/],
  ["Secret-style API key", /\bsk_(live|test)_[A-Za-z0-9]{16,}\b/],
  ["JWT (possible service-role or session token)", /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["Private key block", /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]{20,}/],
  ["Long hex secret next to a secret-like name", /(secret|token|api[_-]?key|password)["'\s:=]{1,6}["']?[0-9a-f]{40,}["']?/i],
  ["Cron/shared-secret header with a value", /x-cron-secret["'\s:=]{1,8}[0-9a-fA-F]{24,}/i],
  ["Database URL with password", /postgres(ql)?:\/\/[^:\s/]+:[^@\s]{3,}@/],
  ["Cloud/provider key", /\b(AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|gh[pousr]_[A-Za-z0-9]{30,})\b/],
];

function* walk(p) {
  const st = statSync(p);
  if (st.isFile()) return yield p;
  for (const name of readdirSync(p)) {
    if (SKIP_DIRS.has(name)) continue;
    yield* walk(path.join(p, name));
  }
}

const findings = [];
let scanned = 0;
for (const t of targets) {
  for (const file of walk(t)) {
    if (file === SELF || /\.(png|jpe?g|webp|ico|pdf|mp4|woff2?|map)$/i.test(file)) continue;
    let text;
    try { if (statSync(file).size > 3_000_000) continue; text = readFileSync(file, "utf8"); } catch { continue; }
    scanned++;
    for (const [name, rx] of RULES) {
      // Whole-file match so multi-line rules work; line number comes from the match offset.
      const m = rx.exec(text);
      if (m) findings.push(`${path.relative(root, file)}:${text.slice(0, m.index).split("\n").length}  ${name}`);
    }
  }
}
if (findings.length) {
  console.error(`check-secrets: ${findings.length} credential-shaped match(es) found (values hidden):`);
  for (const f of findings) console.error("  " + f);
  process.exit(1);
}
console.log(`check-secrets: OK, ${scanned} files scanned, no credential-shaped strings.`);
