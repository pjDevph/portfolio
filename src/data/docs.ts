// Builds the content of each downloadable documentation PDF from the same data the site uses.
// Nothing here is hand-written per project except short framing text; every fact comes from
// projects.ts, automations.ts, project-details.ts or profile.ts, so the PDFs cannot drift from the site.
import { PROFILE, PUBLIC_SITE_URL } from "@/data/profile";
import { projects } from "@/data/projects";
import { automations } from "@/data/automations";
import {
  ATHLETE_ARCHITECTURE, ATHLETE_DETAILS, FINDXNY_ARCHITECTURE, FINDXNY_DETAILS, LALABA_ARCHITECTURE, LALABA_DETAILS,
  type ArchTier,
} from "@/data/project-details";
import type { Status } from "@/components/status-pill";

export type DocBlock =
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "kv"; rows: [string, string][] }
  | { type: "cards"; items: { title: string; tag?: string; text?: string; points?: string[] }[] }
  | { type: "tiers"; tiers: ArchTier[]; note?: string }
  | { type: "triples"; items: { title: string; cols: [string, string][] }[] }
  | { type: "status"; items: { title: string; text: string; status: Status }[] }
  | { type: "images"; items: { src: string; caption: string }[] }
  | { type: "note"; text: string };

export type DocSection = { title: string; blocks: DocBlock[] };
export type ProjectDoc = {
  slug: string;
  file: string;
  title: string;
  subtitle: string;
  kind: "Software product" | "Automation";
  meta: [string, string][];
  summary: string;
  caseStudyPath: string;
  sections: DocSection[];
};

export const DOC_SLUGS = ["findxny-os", "lalaba", "athlete-central", "findxny-sheets-reporting", "portfolio-assistant"] as const;
export type DocSlug = (typeof DOC_SLUGS)[number];

/** Public path of the PDF for a document. */
export const docFile = (slug: string) => `${slug}-documentation.pdf`;
export const docPdfPath = (slug: string) => `/docs/${docFile(slug)}`;
export const isDocSlug = (s: string): s is DocSlug => (DOC_SLUGS as readonly string[]).includes(s);

const SCOPE_NOTE =
  "Counts such as \"114 Edge Functions\" describe the whole platform, not only Prince's own work. His own contributions are the areas of ownership listed in this section.";
// "POS & OPERATIONS PLATFORM" -> "POS & operations platform": keep short acronyms, lowercase the rest.
const sentenceCase = (s: string) => {
  const out = s.split(" ").map((w) => (/^[A-Z&·]{1,4}$/.test(w) ? w : w.toLowerCase())).join(" ");
  return out.charAt(0).toUpperCase() + out.slice(1);
};
const SAFE_NOTE = "This document describes architecture and behaviour only. It contains no credentials, internal endpoints or customer data.";

// ---- Software products -------------------------------------------------------------------------

type ProductExtras = {
  platform: string;
  teamNote?: string;
  architecture: { tiers: ArchTier[]; note: string };
  surfaces?: { name: string; tag: string; desc: string; points: string[] }[];
  stackGroups?: { label: string; items: string[] }[];
  featureGroups?: { label: string; items: string[] }[];
  flows?: { title: string; steps: string[] }[];
  extraTables?: DocSection[];
  limits: string[];
  sources: string[];
};

function productDoc(slug: "findxny-os" | "lalaba" | "athlete-central", x: ProductExtras): ProjectDoc {
  const p = projects.find((q) => q.slug === slug)!;
  const sections: DocSection[] = [];

  sections.push({
    title: "Overview",
    blocks: [
      { type: "p", text: p.summary },
      { type: "kv", rows: [["Project", p.name], ["Type", sentenceCase(p.eyebrow)], ["Role", p.role], ["Period", p.period], ["Platforms", x.platform], ...(x.teamNote ? ([["Team", x.teamNote]] as [string, string][]) : [])] },
    ],
  });

  sections.push({
    title: "Scope and personal contribution",
    blocks: [
      { type: "note", text: SCOPE_NOTE },
      p.ownership
        ? { type: "list", items: p.ownership }
        : { type: "p", text: `Documented as built: ${p.highlights.join(" ")}` },
      ...(p.ownership ? ([{ type: "p", text: "What was built, in detail:" }, { type: "list", items: p.highlights }] as DocBlock[]) : []),
    ],
  });

  if (x.surfaces) {
    sections.push({
      title: "Product surfaces",
      blocks: [{ type: "cards", items: x.surfaces.map((s) => ({ title: s.name, tag: s.tag, text: s.desc, points: s.points })) }],
    });
  }

  sections.push({ title: "System architecture", blocks: [{ type: "tiers", tiers: x.architecture.tiers, note: x.architecture.note }] });

  sections.push({
    title: "Technology stack",
    blocks: x.stackGroups
      ? [{ type: "table", head: ["Area", "Technologies"], rows: x.stackGroups.map((g) => [g.label, g.items.join(", ")]) }]
      : [{ type: "p", text: p.stack.join(", ") + "." }],
  });

  if (x.featureGroups) {
    sections.push({ title: "Capabilities", blocks: [{ type: "cards", items: x.featureGroups.map((g) => ({ title: g.label, points: g.items })) }] });
  }

  if (x.flows?.length) {
    sections.push({
      title: "Engineering deep dives",
      blocks: x.flows.flatMap((f) => [{ type: "h3", text: f.title } as DocBlock, { type: "list", ordered: true, items: f.steps } as DocBlock]),
    });
  }

  for (const extra of x.extraTables ?? []) sections.push(extra);

  sections.push({
    title: "Engineering decisions",
    blocks: [
      {
        type: "triples",
        items: p.decisions.map((d) => ({ title: d.title, cols: [["Problem", d.problem], ["Decision", d.decision], ["Impact", d.why]] as [string, string][] })),
      },
    ],
  });

  sections.push({
    title: "System scale",
    blocks: [{ type: "list", items: p.metrics }, { type: "note", text: "These figures describe the whole system. " + SCOPE_NOTE.split(". ").slice(1).join(". ") }],
  });

  sections.push({
    title: "Evidence, status and limitations",
    blocks: [
      { type: "list", items: [SAFE_NOTE, "No performance, revenue or user-count figures are published for this project.", ...x.limits] },
      { type: "p", text: "Sources:" },
      { type: "list", items: x.sources },
    ],
  });

  return {
    slug,
    file: docFile(slug),
    title: p.name,
    subtitle: sentenceCase(p.eyebrow),
    kind: "Software product",
    meta: [["Role", p.role], ["Period", p.period], ["Platforms", x.platform]],
    summary: p.summary,
    caseStudyPath: `/projects/${slug}`,
    sections,
  };
}

function findxnyDoc() {
  const d = FINDXNY_DETAILS;
  return productDoc("findxny-os", {
    platform: "Web · POS · Backend · Hardware",
    architecture: FINDXNY_ARCHITECTURE,
    surfaces: d.surfaces,
    stackGroups: d.stackGroups,
    featureGroups: d.featureGroups,
    flows: [
      { title: "Offline-first checkout: how an order survives a network failure", steps: d.offlineFlow },
      { title: "Payments: how a payment is confirmed exactly once", steps: d.paymentFlow },
    ],
    extraTables: [
      { title: "Data model", blocks: [{ type: "p", text: "Selected tables, grouped by domain (the full schema has 56 tables):" }, { type: "table", head: ["Domain", "Tables"], rows: d.schemaDomains.map((s) => [s.name, s.tables.join(", ")]) }] },
    ],
    limits: [
      FINDXNY_DETAILS.storefront.live
        ? "The platform has run a public tenant storefront (mugthemug.ph). Online food ordering and staycation booking were described as paused, and the storefront's current availability is not guaranteed. Check it directly."
        : "The platform's public tenant storefront is temporarily offline, so its link is not shown. Online food ordering and staycation booking had been paused.",
      "Screenshots and a walkthrough video are on the case-study page.",
    ],
    sources: [`Case study: ${PUBLIC_SITE_URL}/projects/findxny-os`, `Redacted code showcase: ${PROFILE.github}/findxny-os-showcase`],
  });
}

function lalabaDoc() {
  const d = LALABA_DETAILS;
  return productDoc("lalaba", {
    platform: "Web · Mobile · Backend",
    teamNote: "Built as part of a small engineering team",
    architecture: LALABA_ARCHITECTURE,
    surfaces: d.surfaces,
    stackGroups: d.stackGroups,
    featureGroups: d.featureGroups,
    flows: [
      { title: "Staff device approval: how access is gated per branch", steps: d.deviceFlow },
      { title: "Wallet top-up: how a payment callback credits exactly once", steps: d.paymentFlow },
    ],
    extraTables: [{ title: "Repositories", blocks: [{ type: "p", text: "Public, redacted showcases of each part of the system:" }, { type: "table", head: ["Part", "Repository"], rows: d.repos.map((r) => [r.name, r.url]) }] }],
    limits: ["The system is a small-team project; the system counts above describe the whole backend."],
    sources: [`Case study: ${PUBLIC_SITE_URL}/projects/lalaba`, ...d.repos.map((r) => `${r.name}: ${r.url}`)],
  });
}

function athleteDoc() {
  const d = ATHLETE_DETAILS;
  const doc = productDoc("athlete-central", {
    platform: "Web · Mobile · POS · Admin",
    architecture: ATHLETE_ARCHITECTURE,
    surfaces: d.clients.map((c) => ({ name: c.name, tag: c.tag, desc: "A client of the shared Firebase Cloud Functions backend.", points: [] })),
    limits: [
      "Only the capabilities labelled Implemented below are documented. No in-progress or planned items are documented for this project.",
      "Product screenshots are not published yet; the case study shows a project poster only.",
    ],
    sources: [`Case study: ${PUBLIC_SITE_URL}/projects/athlete-central`],
  });
  // Athlete Central has labelled capabilities and "challenges" instead of long flows.
  const at = doc.sections.findIndex((s) => s.title === "System architecture");
  doc.sections.splice(at + 1, 0,
    { title: "Features and status", blocks: [{ type: "p", text: "Capabilities are labelled by what the project record supports." }, ...d.featureGroups.flatMap((g) => [{ type: "h3", text: g.name } as DocBlock, { type: "status", items: g.items } as DocBlock])] },
    { title: "Engineering challenges", blocks: [{ type: "triples", items: d.challenges.map((c) => ({ title: c.title, cols: [["Problem", c.problem], ["Approach", c.approach], ["Impact", c.outcome]] as [string, string][] })) }] },
  );
  return doc;
}

// ---- Automations -------------------------------------------------------------------------------

function automationDoc(slug: "findxny-sheets-reporting" | "portfolio-assistant"): ProjectDoc {
  const a = automations.find((q) => q.slug === slug)!;
  const sections: DocSection[] = [];
  sections.push({
    title: "Overview",
    blocks: [
      { type: "p", text: a.summary },
      { type: "kv", rows: [["Automation", a.name], ["Type", `${a.kind === "AI" ? "AI" : "Deterministic"} automation`], ["Status", `${a.status} (${a.statusNote})`], ["Role", a.roleShort], ["Built", a.built]] },
      { type: "kv", rows: a.overview.map((o) => [o.label, o.text] as [string, string]) },
    ],
  });
  sections.push({
    title: "My contribution",
    blocks: [{ type: "p", text: a.role }, ...(a.contributions ? ([{ type: "list", items: a.contributions }] as DocBlock[]) : []), ...(a.evidence ? ([{ type: "note", text: a.evidence }] as DocBlock[]) : [])],
  });
  if (a.dataflow) {
    sections.push({
      title: "Data flow",
      blocks: [{ type: "tiers", tiers: [{ title: "Sources", nodes: a.dataflow.sources, arrowAfter: "" }, { title: "Automation engine", nodes: a.dataflow.engine, arrowAfter: "" }, { title: "Outputs", nodes: a.dataflow.outputs }] }],
    });
  }
  sections.push({ title: "Workflow, step by step", blocks: [{ type: "table", head: ["#", "Step", "What happens"], rows: a.flow.map((f, i) => [String(i + 1), f.label, f.detail]) }] });
  if (a.screens) {
    sections.push({ title: "Screens", blocks: [...(a.screensNote ? ([{ type: "note", text: a.screensNote }] as DocBlock[]) : []), { type: "images", items: a.screens.map((s) => ({ src: s.src, caption: s.caption })) }] });
  }
  if (a.capabilities) sections.push({ title: "Capabilities and status", blocks: [{ type: "status", items: a.capabilities }] });
  sections.push({ title: "Safeguards and exception handling", blocks: [{ type: "cards", items: a.safeguards.map((s) => ({ title: s.title, text: s.text })) }] });
  sections.push({ title: "Technology stack", blocks: [{ type: "list", items: a.stack }] });
  sections.push({ title: "Outcomes", blocks: [{ type: "list", items: a.outcomes }] });
  sections.push({ title: "Known limits", blocks: [{ type: "list", items: a.limits }, { type: "note", text: SAFE_NOTE }] });
  return {
    slug,
    file: docFile(slug),
    title: a.name,
    subtitle: sentenceCase(a.eyebrow),
    kind: "Automation",
    meta: [["Role", a.roleShort], ["Built", a.built], ["Status", a.statusNote]],
    summary: a.summary,
    caseStudyPath: `/automations/${slug}`,
    sections,
  };
}

export function buildDoc(slug: DocSlug): ProjectDoc {
  switch (slug) {
    case "findxny-os": return findxnyDoc();
    case "lalaba": return lalabaDoc();
    case "athlete-central": return athleteDoc();
    default: return automationDoc(slug);
  }
}

