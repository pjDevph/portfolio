import { createHash } from "node:crypto";
import type { ProjectDoc } from "@/data/docs";

/** Fingerprint of a document's content. The PDF manifest stores it so CI can tell when a PDF is stale. */
export const docHash = (doc: ProjectDoc) => createHash("sha256").update(JSON.stringify(doc)).digest("hex").slice(0, 16);
