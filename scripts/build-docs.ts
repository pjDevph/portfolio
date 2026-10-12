// Renders each /docs/[slug] page to a PDF in public/docs and writes public/docs/manifest.json.
// Needs a production build and Google Chrome:   npm run build && npm run build:docs
// Use --base=http://localhost:3000 to render from a server that is already running (e.g. `npm run dev`).
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { DOC_SLUGS, buildDoc, docFile } from "../src/data/docs";
import { docHash } from "../src/lib/doc-hash";

const outDir = path.resolve("public/docs");
mkdirSync(outDir, { recursive: true });
const baseArg = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1];
const PORT = process.env.DOCS_PORT || "3198";
const base = baseArg ?? `http://localhost:${PORT}`;
const today = new Date().toISOString().slice(0, 10);

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

const footer = (title: string) => `
  <div style="font-family: Helvetica, Arial, sans-serif; font-size: 7.5px; color: #64748b; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between;">
    <span>${title} · Documentation · Prince John Gandollas</span>
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
  </div>`;

async function main() {
  await waitReady();
  const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" }));
  const manifest: Record<string, { file: string; hash: string; pages: number; kb: number; generated: string }> = {};
  for (const slug of DOC_SLUGS) {
    const doc = buildDoc(slug);
    const page = await browser.newPage();
    await page.goto(`${base}/docs/${slug}?generated=${today}`, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    const pdf = await page.pdf({ format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: footer(doc.title), margin: { top: "16mm", bottom: "20mm", left: "14mm", right: "14mm" } });
    writeFileSync(path.join(outDir, docFile(slug)), pdf);
    const pages = (Buffer.from(pdf).toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    manifest[slug] = { file: docFile(slug), hash: docHash(doc), pages, kb: Math.round(pdf.length / 1024), generated: today };
    console.log(`${slug.padEnd(26)} ${String(pages).padStart(2)} pages  ${String(manifest[slug].kb).padStart(5)} KB`);
    await page.close();
  }
  await browser.close();
  writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Wrote ${DOC_SLUGS.length} PDFs and manifest.json to public/docs`);
}

main().then(stop, (err) => { console.error(err); stop(); process.exit(1); });
