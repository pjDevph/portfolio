// Fails when a documentation PDF is missing, not a real PDF, or older than the content it was built from.
// Fix: npm run build && npm run build:docs   (then commit public/docs).
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { DOC_SLUGS, buildDoc, docFile } from "../src/data/docs";
import { docHash } from "../src/lib/doc-hash";

const dir = path.resolve("public/docs");
const manifestPath = path.join(dir, "manifest.json");
const problems: string[] = [];
const manifest = existsSync(manifestPath) ? (JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, { hash: string }>) : null;
if (!manifest) problems.push("public/docs/manifest.json is missing");
for (const slug of DOC_SLUGS) {
  const file = path.join(dir, docFile(slug));
  if (!existsSync(file)) { problems.push(`${docFile(slug)} is missing`); continue; }
  if (readFileSync(file).subarray(0, 5).toString() !== "%PDF-") problems.push(`${docFile(slug)} is not a PDF`);
  if (manifest && manifest[slug]?.hash !== docHash(buildDoc(slug))) problems.push(`${docFile(slug)} is out of date (site content changed)`);
}
if (problems.length) {
  console.error("check-docs: " + problems.length + " problem(s):\n  - " + problems.join("\n  - ") + "\nRun: npm run build && npm run build:docs");
  process.exit(1);
}
console.log(`check-docs: OK, ${DOC_SLUGS.length} PDFs are present and match the current content.`);
