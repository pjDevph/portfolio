import type { Status } from "@/components/status-pill";

export type Automation = {
  slug: string;
  kind: "AI" | "Deterministic";
  name: string;
  eyebrow: string;
  summary: string;
  status: Status;
  statusNote: string;
  /** Four short cells shown side by side under "The automation in 30 seconds". */
  overview: { label: string; text: string }[];
  role: string;
  roleShort: string;
  /** Concrete, checkable things the person did. Omit rather than pad. */
  contributions?: string[];
  /** Where the claims on the page come from. */
  evidence?: string;
  built: string;
  /** Sources -> processing -> outputs, drawn as three tiers. */
  dataflow?: { sources: string[]; engine: string[]; outputs: string[] };
  flow: { label: string; detail: string }[];
  capabilities?: { title: string; text: string; status: Status }[];
  /** Real screenshots. Anything showing business figures must be redacted before it is added here. */
  screens?: { src: string; alt: string; caption: string; width: number; height: number }[];
  screensNote?: string;
  safeguards: { title: string; text: string }[];
  stack: string[];
  outcomes: string[];
  limits: string[];
  demo?: boolean;
};

// Add an automation here only once it exists and its claims are backed by code,
// a running system, or another checkable source. Keep `status` honest: concepts
// belong at "planned" and must not read as finished work. Never add time-saved,
// adoption, or financial figures that were not measured.
export const automations: Automation[] = [
  {
    slug: "findxny-sheets-reporting",
    kind: "Deterministic",
    name: "POS-to-Google-Sheets Reporting",
    eyebrow: "DETERMINISTIC AUTOMATION · REPORTING",
    summary: "A backend job in FINDXNY OS that updates a Google Sheets income workbook straight from live POS transactions, replacing the manual export-and-import step: daily gross sales by kitchen and bar across three shift windows, plus an item-level sales history, kept correct by idempotent rewrites.",
    status: "implemented",
    statusNote: "Implemented in the FINDXNY OS backend",
    overview: [
      { label: "Problem", text: "Staff had to open the web admin, export the data, and import or copy it into another sheet by hand. Daily income also has to match the POS orders, split by kitchen vs. bar and by shift, and stay correct as late orders, refunds and corrections arrive." },
      { label: "Manual process replaced", text: "Export from the web admin, then import or copy into another sheet. Now the workbook is updated directly from the POS: once a transaction is recorded there, it is tallied in the sheet. The workbook's own formulas and the separately maintained Expenses column are left alone." },
      { label: "Triggers", text: "A database scheduler every 15 minutes, a best-effort sync when a shift closes, and an on-demand backfill for historical dates." },
      { label: "Solution", text: "A server-side module computes the numbers from authoritative order data and writes them through the Google Sheets API." },
    ],
    role: "Built and maintained the reporting module in the FINDXNY OS backend.",
    roleShort: "Solo build",
    contributions: [
      "Wrote a Google service-account client with JWT signing on Web Crypto and raw Sheets calls, because the Deno edge runtime can't use the Node Google client.",
      "Designed the daily aggregation by area (kitchen vs. bar) and three fixed clock windows.",
      "Moved the sync into an existing edge function and re-pointed its scheduler, to stay under the platform's function-count limit.",
      "Replaced item-price summing with allocation of each order's real total by item mix after it under-counted revenue.",
      "Added the monthly item summary, and item reporting on shift close with a sync at close.",
    ],
    evidence: "Based on the FINDXNY OS backend source and its git history. All five commits on this module are authored as \"PJ\", from Sep 12 to Oct 10, 2026. Workbook screenshots are from the working income tracker, with all figures redacted.",
    built: "Sep – Oct 2026",
    dataflow: {
      sources: ["POS orders and order items", "Product catalog (kitchen vs. bar)", "Business calendar (Asia/Manila time)"],
      engine: ["Scheduler, shift-close and backfill triggers", "Aggregate by area and shift window", "Idempotent rewrite of item history"],
      outputs: ["Daily income cells by area and shift", "POS item sales history", "Item summary, catalog and dashboard tabs"],
    },
    flow: [
      { label: "Trigger", detail: "pg_cron calls the reports function every 15 minutes with a shared-secret header. Closing a shift also starts a background sync, and a manual resource backfills up to 31 days." },
      { label: "Collect", detail: "Reads the day's non-refunded orders and their items and add-ons in bounded, chunked queries." },
      { label: "Attribute", detail: "Splits each order's actual total between kitchen and bar in proportion to its item mix, then assigns it to one of three fixed windows (morning, mid, graveyard)." },
      { label: "Re-sync the window", detail: "Refreshes yesterday as well as today, because the overnight window stays open until 6 am." },
      { label: "Write", detail: "Authenticates as a Google service account and writes only the backend-owned input cells and the item-history tab, in batched calls." },
      { label: "Rebuild views", detail: "Regenerates the item summary, catalog and dashboard category helpers from the canonical item rows." },
    ],
    capabilities: [
      { title: "Daily gross sales by area and shift", text: "Kitchen and bar totals for morning, mid and graveyard windows, written to the matching day's input cells.", status: "implemented" },
      { title: "Order-total allocation by item mix", text: "Each order's actual total is divided by item mix, add-ons included, instead of summing item prices. The fix's commit notes record that it reconciles with order totals.", status: "implemented" },
      { title: "Item-level sales history", text: "A backend-managed tab of business date, shift, area, category, item, variant, quantity and gross sales, rewritten idempotently for yesterday and today.", status: "implemented" },
      { title: "Monthly item summary, catalog and dashboard helpers", text: "Derived tabs and category helper cells rebuilt from the item history.", status: "implemented" },
      { title: "Historical backfill", text: "Re-computes a date range of up to 31 business dates per request and is safe to re-run.", status: "implemented" },
      { title: "Sync when a shift closes", text: "Pushes the closed shift's items without waiting for the next cycle. It is best effort and never blocks the shift close.", status: "implemented" },
    ],
    screens: [
      { src: "/projects/sheets-reporting/annual-summary.jpg", alt: "Annual Summary tab of the income tracker workbook, with figures redacted", caption: "Annual Summary: yearly KPIs (gross income, expenses, net income, daily gross target, target-hit rate), a month-by-month table split into kitchen and bar, and two charts. Kitchen and bar totals come from the daily inputs the automation writes.", width: 2000, height: 1271 },
      { src: "/projects/sheets-reporting/monthly-item-sales.jpg", alt: "Monthly Item Sales tab with year and month selectors, figures redacted", caption: "Monthly Item Sales: per-item sales for the selected year and month, with morning, midshift and graveyard quantities, total sales, rank, average sale per item and sales share. Raw source: the POS Item Sales tab.", width: 2000, height: 1151 },
      { src: "/projects/sheets-reporting/category-sales.jpg", alt: "Category Sales tab for the selected month, figures redacted", caption: "Category Sales: sales and quantity contribution by category for the selected month, with kitchen and bar sales and quantity and sales ranks.", width: 2000, height: 1151 },
      { src: "/projects/sheets-reporting/annual-item-sales.jpg", alt: "Annual Item Sales tab with monthly totals and two charts, figures redacted", caption: "Annual Item Sales: month-by-month totals for the year, split by shift and by kitchen vs. bar, with monthly sales and quantity charts.", width: 2000, height: 1151 },
    ],
    screensNote: "These are screenshots of the real workbook with every figure redacted (numbers, percentages and chart scales). Tabs, headers, selectors and layout are unchanged. The workbook also has Item Sales Dashboard and Item Sales Detail tabs and a tab per month.",
    safeguards: [
      { title: "Idempotent by design", text: "Each run reads the item history, removes the dates it is about to refresh, and rewrites them from database state, so the 15-minute job and corrections never create duplicate rows." },
      { title: "Never overwrites the workbook's formulas", text: "Only six backend-owned input cells per day are written. Formula columns and the separately maintained Expenses column are never touched." },
      { title: "Time-based windows, not shift records", text: "Staff sometimes leave shifts open, in some cases for weeks, so attributing sales by shift lifecycle would silently drop revenue. Fixed clock windows don't." },
      { title: "Overnight attribution", text: "The graveyard window (10 pm to 6 am) belongs entirely to the day it started, matching how the business accounts for the shift." },
      { title: "Refunds and add-ons", text: "Refunded orders are excluded; add-ons inherit their parent item's area and allocation weight without inflating the base quantity sold." },
      { title: "Failure isolation", text: "A Sheets failure after a shift closes is logged and never fails the close. Backfill dates are calendar-validated and capped at 31 per request." },
      { title: "Credentials and access", text: "The scheduled entry point is gated by a shared secret, and the Google credentials and target workbook come from environment configuration, with explicit errors when any are missing." },
    ],
    stack: ["Supabase Edge Functions (Deno)", "PostgreSQL + pg_cron", "Google Sheets API v4", "Service-account OAuth (JWT, Web Crypto)", "TypeScript"],
    outcomes: [
      "Implemented in the FINDXNY OS backend with a scheduled trigger, a shift-close trigger and a manual backfill.",
      "The export-and-import step is gone: POS transactions are tallied in the workbook automatically, every 15 minutes and right after a shift closes.",
      "Corrected a revenue-accuracy defect: an early version summed item prices and missed order-level charges and discounts, and the current version allocates each order's actual total.",
      "Re-running the job or a backfill rewrites the same dates instead of duplicating rows.",
      "No time-saved, adoption or financial figures are claimed. None were measured for this page.",
    ],
    limits: [
      "No automated tests for this module were found in the repository.",
      "It writes to one configured workspace and workbook, not a general report builder.",
      "The workbook layout is fixed (month tabs, one row per day, specific columns), so layout changes need code changes.",
      "A single day's order query is capped at 10,000 orders.",
      "Failed syncs are logged, but this module has no dedicated alerting.",
      "Expenses are maintained by a separate process and are outside this automation.",
    ],
  },
  {
    slug: "portfolio-assistant",
    kind: "AI",
    name: "Portfolio Assistant",
    eyebrow: "AI ASSISTANT · INQUIRY AUTOMATION",
    summary: "A chatbot that answers recruiter and client questions about my projects, ownership, and availability, grounded in the same data that powers this site, and hands off to the contact form when it can't answer.",
    status: "implemented",
    statusNote: "Built into this site",
    overview: [
      { label: "Problem", text: "Visitors skim. The questions that matter, such as what I personally owned, whether something is live, and whether I'm available, are spread across several pages or only answered by email." },
      { label: "Manual process replaced", text: "A visitor reads multiple case studies or emails me, and I answer repeat questions by hand." },
      { label: "Trigger", text: "A visitor opens the chat and asks a question." },
      { label: "Solution", text: "A streaming assistant that answers from a verified knowledge base, separates platform scale from my own contribution, and points to the contact form instead of guessing." },
    ],
    role: "Designed and built end to end: knowledge base, guardrails, API route, streaming UI, and this case study.",
    roleShort: "Solo build",
    built: "Oct 2026",
    flow: [
      { label: "Question", detail: "Visitor asks in the chat or taps a suggested prompt. Common questions (contact, skills, projects, availability, technologies) are answered instantly from a built-in FAQ, for free." },
      { label: "Guardrails", detail: "Validates length and history, checks the request origin, applies per-visitor and daily rate limits, and can require a Cloudflare Turnstile check." },
      { label: "Grounding", detail: "The system prompt is built from the same project, experience and automation data the site renders, so there is one source of truth." },
      { label: "Claude", detail: "Open-ended questions go to Claude Haiku 5.5 under strict rules at low effort; the knowledge base prefix is cached. A monthly budget is reserved before each call." },
      { label: "Streamed answer", detail: "Text streams to the page as it is generated." },
      { label: "Hand-off", detail: "Unknown or hiring questions are routed to the contact form or email." },
    ],
    safeguards: [
      { title: "Grounded answers only", text: "Rules require answering only from the knowledge base, never inventing employers, dates, metrics, or links, and saying so when it doesn't know." },
      { title: "Scope vs. ownership", text: "Platform counts (for example 115 Edge Functions) are described as platform scale; my own contributions come from the listed areas of ownership." },
      { title: "Untrusted input", text: "Visitor text can't change the rules, roles are validated server-side, and only user and assistant turns are accepted from the browser." },
      { title: "Abuse and cost limits", text: "Messages are capped at 600 characters and 12 turns, with per-visitor and daily limits, a hard monthly spend budget enforced in code, an optional Redis-backed store so limits hold across servers, an optional Turnstile check, and a same-site origin check." },
      { title: "Answer-first FAQ and free fallback", text: "Common questions are answered from a built-in rule-based FAQ built from the same site data before any AI call. The same FAQ takes over when the monthly budget is spent, the API key is missing, or the provider fails, and the chat says so. It costs nothing and cannot invent facts, but it only covers common questions." },
      { title: "Hard monthly budget", text: "Before each model call a worst-case cost is reserved against a monthly budget (default $2). If it would be exceeded, the visitor gets the free FAQ instead. Actual cost replaces the reservation afterwards, and failed calls release it." },
      { title: "Graceful failure", text: "Refusals, rate limits, and mid-answer failures each show a clear message with a link to the contact form." },
      { title: "Privacy and logging", text: "This site doesn't store conversations. Logs hold token counts and estimated cost only, never message text or IP addresses. Messages are processed by the model provider's API to produce a reply." },
    ],
    stack: ["Next.js route handler", "Anthropic TypeScript SDK", "Claude (claude-haiku-5-5, configurable)", "Streaming NDJSON", "TypeScript", "Tailwind CSS"],
    outcomes: [
      "Implemented as a floating assistant on every page and an embedded demo on this page.",
      "Streaming, validation, rate limiting, refusal handling, and error paths were verified against a stand-in model server.",
      "The free FAQ answers 98.7% of 776 generated recruiter phrasings correctly in an offline test, with no AI call. Answer quality, grounding and real cost of the model path have not been measured against the live API yet. A repeatable evaluation suite is included for that.",
      "No usage, conversion, or time-saved figures are claimed. The site doesn't collect them.",
    ],
    limits: [
      "Answers can be wrong or incomplete; it only knows what is on this portfolio.",
      "Prompt-injection defenses reduce risk but can't remove it.",
      "Without the optional Redis store, rate limits and the monthly budget counter are per server instance, so they slow abuse rather than guarantee a hard cap. A spend limit on the provider key is the final backstop.",
      "The built-in FAQ only covers common questions and tested phrasings; unusual wording falls through to the model, or to a polite \"I don't have that\" when the model is off.",
      "No memory between visits and no human-handoff inbox beyond the contact form.",
    ],
    demo: true,
  },
];
