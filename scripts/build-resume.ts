// Renders /resume/print to public/Prince_John_Gandollas_Resume.pdf (one A4 page).
// Needs a production build and Google Chrome:   npm run build && npm run build:resume
// Use --base=http://localhost:3000 to render from a server that is already running (e.g. `npm run dev`).
import { spawn } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const out = path.resolve("public/Prince_John_Gandollas_Resume.pdf");
const baseArg = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1];
const PORT = process.env.RESUME_PORT || "3197";
const base = baseArg ?? `http://localhost:${PORT}`;

let server: ReturnType<typeof spawn> | null = null;
if (!baseArg) {
  if (!existsSync(".next/BUILD_ID")) throw new Error("No production build found. Run `npm run build` first.");
  server = spawn("npx", ["next", "start", "-p", PORT], { stdio: "ignore" });
}
const stop = () => { try { server?.kill("SIGTERM"); } catch { /* already gone */ } };
process.on("exit", stop);

async function waitReady() {
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(base + "/robots.txt")).ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start");
}

async function main() {
  await waitReady();
  const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" }));
  const page = await browser.newPage();
  await page.goto(`${base}/resume/print`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: "11mm", bottom: "10mm", left: "12mm", right: "12mm" } });
  await browser.close();
  writeFileSync(out, pdf);
  const pages = (Buffer.from(pdf).toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`Wrote ${path.relative(process.cwd(), out)}: ${pages} page(s), ${Math.round(pdf.length / 1024)} KB`);
  if (pages > 1) console.warn("Warning: the résumé runs past one page. Trim src/data/resume.ts.");
}

main().then(stop, (err) => { console.error(err); stop(); process.exit(1); });
