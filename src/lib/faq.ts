// Free, rule-based answers for the assistant. No model, no network, no cost.
// Every answer is assembled from the same data files the site renders (profile, résumé skills,
// projects, automations), so it cannot say anything the site doesn't already say.
//
// It is used in two ways:
//  1. ANSWER-FIRST: when a question matches confidently, it is answered here and the AI budget is
//     never touched. Common recruiter questions are covered by many phrasings of ~35 topics plus a
//     per-technology answer ("Has Prince used X?") for every technology in his résumé and projects.
//  2. FALLBACK: when the monthly AI budget is spent, no key is set, or the provider fails.
import { PROFILE, EXPERIENCE, SKILLS, EDUCATION, RESUME_SUMMARY, CODE_SAMPLES } from "@/data/profile";
import { projects } from "@/data/projects";
import { automations } from "@/data/automations";
import { DOC_SLUGS, buildDoc } from "@/data/docs";
import { FINDXNY_DETAILS } from "@/data/project-details";

type Keyword = string | [string, number];
type Entry = { id: string; generic?: boolean; keywords: Keyword[]; answer: string };
export type FaqMatch = { id: string; text: string; score: number; confident: boolean };

const FORM = "the contact form on this site (/#contact)";
const ASK = `Please ask directly through ${FORM} or at ${PROFILE.email}.`;
const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0];
const project = (slug: string) => projects.find((p) => p.slug === slug)!;
const automation = (slug: string) => automations.find((a) => a.slug === slug)!;

const findxny = project("findxny-os");
const lalaba = project("lalaba");
const athlete = project("athlete-central");

const SCOPE_NOTE =
  "Numbers such as 114 Edge Functions describe the whole platform, not only Prince's own work. His own contributions are the areas of ownership listed for each project.";

function projectAnswer(slug: string) {
  const p = project(slug);
  const own = p.ownership ? `Prince's areas of ownership: ${p.ownership.join("; ")}.` : `Documented as built: ${p.highlights.join(" ")}`;
  return [`${p.name} (${p.period}): ${p.summary}`, own, `Stack: ${p.stack.join(", ")}.`, `Platform scale (whole system, not only Prince's work): ${p.metrics.join("; ")}.`, `Case study: /projects/${slug}`].join("\n\n");
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const monthIndex = (label: string) => { const m = /([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/.exec(label); return m ? Number(m[2]) * 12 + MONTHS.indexOf(m[1].toLowerCase()) : -1; };
function recentProjectAnswer() {
  const parts = projects.map((p) => { const [start, end] = p.period.split(/\s*[–-]\s*/); return { p, start: monthIndex(start), end: monthIndex(end ?? start) }; });
  const byEnd = [...parts].sort((a, b) => b.end - a.end)[0];
  const byStart = [...parts].sort((a, b) => b.start - a.start)[0];
  const autos = automations.map((a) => `${a.name} (${a.built})`).join(" and ");
  const lead = byEnd.p.slug === byStart.p.slug
    ? `His most recent project is ${byEnd.p.name} (${byEnd.p.period}).`
    : `By end date, his most recent project is ${byEnd.p.name} (${byEnd.p.period}). By start date, the newest is ${byStart.p.name} (${byStart.p.period}).`;
  return `${lead} His newest work overall is the automations: ${autos}.\n\nCase studies: /projects/${byEnd.p.slug}, /projects/${byStart.p.slug}, /automations`;
}

// ---- Project facets: "tech stack of Lalaba" should answer about Lalaba's stack, nothing else ----
const PROJECT_PATTERNS: [string, RegExp][] = [["findxny-os", /findxny|mugthemug|point of sale|\bpos (system|app|platform)\b/i], ["lalaba", /lalaba|laundry/i], ["athlete-central", /athlete|sports booking|court booking/i]];
const FACETS: [string, RegExp][] = [
  ["stack", /\b(tech(nolog\w*)?( stack)?|stack|built with|frameworks?|languages?|libraries|tools)\b/i],
  ["period", /\b(when|period|dates?|how long|duration|timeline)\b/i],
  ["ownership", /\b(own|owned|ownership|role|contribut\w*|responsib\w*|personally|did (he|prince) (build|do|work on))\b/i],
  ["scale", /\b(scale|how many|size|metrics|numbers)\b/i],
  ["features", /\b(features?|highlights?|capabilit\w+|achiev\w+)\b/i],
];
function facetAnswer(slug: string, facet: string): string {
  const p = project(slug);
  const link = `Case study: /projects/${slug}`;
  switch (facet) {
    case "stack": return `${p.name} stack: ${p.stack.join(", ")}.\nMain parts: ${p.architecture.join(", ")}.\n\n${link}`;
    case "ownership": return `${p.name}, what Prince personally worked on: ${p.ownership ? p.ownership.join("; ") + "." : p.highlights.join(" ")}\n\n${link}`;
    case "period": return `${p.name}: ${p.period}, as ${p.role}.\n\n${link}`;
    case "scale": return `${p.name} platform scale (whole system, not only Prince's work): ${p.metrics.join("; ")}.\n${SCOPE_NOTE}\n\n${link}`;
    default: return `${p.name}, what was built:\n${p.highlights.map((h) => `- ${h}`).join("\n")}\n\n${link}`;
  }
}
function projectFacet(q: string): string | null {
  const slugs = PROJECT_PATTERNS.filter(([, re]) => re.test(q)).map(([slug]) => slug);
  if (slugs.length === 0) return null;
  const facet = FACETS.find(([, re]) => re.test(q))?.[0];
  if (!facet) return null;
  return slugs.slice(0, 3).map((slug) => facetAnswer(slug, facet)).join("\n\n");
}

// ---- Technologies: aliases for everything in his résumé skills and project stacks -------------

const TECH_ALIASES: Record<string, string[]> = {
  "TypeScript": ["typescript"], "JavaScript": ["javascript", "js", "ecmascript"], "SQL": ["sql"], "HTML5": ["html", "html5"], "CSS3": ["css", "css3"],
  "React": ["react", "reactjs", "react.js"], "Next.js": ["next.js", "nextjs", "next js"], "React Native": ["react native", "react-native", "reactnative"], "Expo": ["expo"],
  "Tailwind CSS": ["tailwind", "tailwind css", "tailwindcss"], "Node.js": ["node.js", "nodejs", "node js", "node"], "Express.js": ["express.js", "expressjs", "express js"],
  "NestJS": ["nestjs", "nest.js", "nest js"], "Deno": ["deno"], "GraphQL": ["graphql", "graph ql"], "REST APIs": ["restful", "rest api", "rest apis"],
  "PostgreSQL": ["postgresql", "postgres", "psql"], "SQLite": ["sqlite"], "MongoDB": ["mongodb", "mongo"], "Supabase": ["supabase"], "Firebase": ["firebase", "firestore"],
  "Google Cloud Platform": ["google cloud", "gcp", "google cloud platform"], "Vercel": ["vercel"], "EAS Build": ["eas build", "eas"], "EAS Update": ["eas update"],
  "Git": ["git"], "GitHub Actions": ["github actions", "ci/cd", "cicd"], "Electron": ["electron"],
  "Multi-Tenant Architecture": ["multi-tenant", "multitenant", "multi tenant"], "RBAC": ["rbac", "role-based access", "role based access"], "RLS": ["rls", "row level security", "row-level security"],
  "Offline-First Sync": ["offline-first", "offline first", "offline sync"], "Webhooks": ["webhook"], "Idempotency": ["idempotency", "idempotent"], "Xendit": ["xendit"],
  "Google Maps API": ["google maps"], "ESC/POS": ["esc/pos", "escpos", "esc pos"], "Custom Expo Modules": ["expo modules", "native modules"], "Redis": ["redis"],
};

// Technologies recruiters commonly ask about that are NOT on his résumé or in his projects.
const UNLISTED_TECH = ["docker", "kubernetes", "aws", "azure", "python", "java", "c#", ".net", "php", "laravel", "django", "flask", "ruby", "rails", "golang", "rust", "vue", "angular", "svelte", "flutter", "kotlin", "mysql", "tensorflow", "pytorch", "kafka", "rabbitmq", "terraform", "jenkins", "gitlab", "c++", "scala", "elixir", "mariadb", "oracle", "sass", "bootstrap", "jquery", "wordpress", "shopify", "selenium", "cypress", "jest", "playwright", "redux", "prisma", "trpc", "nginx", "linux", "bash"];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const wordRe = (w: string) => new RegExp(`(^|[^a-z0-9.#+])${escapeRe(w)}s?(?![a-z0-9#+])`, "i");

function projectsUsing(tech: string): string[] {
  const t = tech.toLowerCase();
  return projects.filter((p) => p.stack.some((s) => s.toLowerCase() === t) || p.architecture.some((s) => s.toLowerCase().includes(t))).map((p) => p.name);
}
const skillGroup = (tech: string) => Object.entries(SKILLS).find(([, list]) => list.includes(tech))?.[0];

const CONCEPT_TECH = new Set(["Multi-Tenant Architecture", "RBAC", "RLS", "Offline-First Sync", "Webhooks", "Idempotency", "ESC/POS", "Xendit", "Google Maps API"]);
const HOW_IT_WORKS = /\b(how (does|do|is|are|did)|what happens|explain)\b/i;

function techAnswer(question: string): { text: string; score: number } | null {
  const q = question.toLowerCase();
  const found: string[] = [];
  for (const [name, aliases] of Object.entries(TECH_ALIASES)) {
    if (name === "React" && wordRe("react native").test(q) && !/react(?!\s*-?\s*native)/i.test(q)) continue;
    if (aliases.some((a) => wordRe(a).test(q))) found.push(name);
  }
  const specific = found;
  const unlisted = UNLISTED_TECH.filter((t) => wordRe(t).test(q));
  if (specific.length === 0 && unlisted.length === 0) return null;
  // Concept-type technologies double as topics; for "how does X work" questions the topic answer fits better.
  const onlyConcepts = specific.length > 0 && unlisted.length === 0 && specific.every((t) => CONCEPT_TECH.has(t));
  const lines: string[] = [];
  for (const t of specific.slice(0, 3)) {
    const used = projectsUsing(t);
    const group = skillGroup(t);
    lines.push(`Yes, ${t} is part of Prince's skills${group ? ` (${group} on his résumé)` : ""}.${used.length ? ` Projects that use it: ${used.join(", ")}.` : " No project on this portfolio is documented as using it."}`);
  }
  for (const t of unlisted.slice(0, 2)) lines.push(`${t} isn't listed on Prince's portfolio or résumé, so I can't confirm experience with it. ${ASK}`);
  return { text: lines.join("\n\n"), score: onlyConcepts && HOW_IT_WORKS.test(q) ? 2 : 6 };
}

// ---- Topic entries -----------------------------------------------------------------------------

const ENTRIES: Entry[] = [
  { id: "overview", keywords: [["who is", 3], ["about prince", 3], ["tell me about prince", 4], ["introduce", 3], "background", ["who are you", 3], ["who is he", 3], ["about him", 3], ["tell me about him", 4], ["about yourself", 3], ["tell me about yourself", 4], ["your name", 4], ["his name", 4], ["full name", 4], ["prince's name", 4]],
    answer: `${PROFILE.name} is a ${PROFILE.title} based in ${PROFILE.location}, focused on ${PROFILE.focus}. His work includes FINDXNY OS (offline-first POS), Lalaba (multi-role laundry marketplace), Athlete Central (sports booking) and two automations. You can ask about any of them, his skills, experience, or availability.` },
  { id: "projects", generic: true, keywords: [["built", 2], "build", "projects", "portfolio", "created", "developed", ["worked on", 2], ["what has", 1], "products", ["case studies", 3], ["case study", 3], ["his work", 3]],
    answer: `Prince's main projects:\n\n${projects.map((p) => `- ${p.name} (${p.period}): ${firstSentence(p.summary)}`).join("\n")}\n\nAsk about one by name for details and what he personally owned.` },
  { id: "findxny", keywords: [["findxny", 3], ["point of sale", 3], "cashier", ["mugthemug", 3], "kitchen", ["pos", 2], ["pos system", 3]], answer: projectAnswer("findxny-os") },
  { id: "lalaba", keywords: [["lalaba", 3], ["laundry", 2], ["laundromat", 2], ["marketplace", 2]], answer: projectAnswer("lalaba") },
  { id: "athlete", keywords: [["athlete", 3], "sports", "court", "facility", ["booking platform", 2]], answer: `${projectAnswer("athlete-central")}\n\nNo in-progress or planned items are documented for this project, and product screenshots aren't published yet.` },
  { id: "ownership", generic: true, keywords: [["personally", 3], ["personal", 1], ["own!", 1], ["owned", 2], "ownership", ["responsible", 3], ["contribution", 3], ["contributed", 3], ["what did prince do", 3], ["his role", 2], ["did he build", 2], ["did prince build", 2], ["did he write", 2], ["did prince write", 2]],
    answer: `${SCOPE_NOTE}\n\nAreas of ownership:\n- ${findxny.name}: ${findxny.ownership!.join("; ")}\n- ${lalaba.name}: ${lalaba.ownership!.join("; ")}\n- ${athlete.name}: ${athlete.highlights.map(firstSentence).join(" ")}` },
  { id: "platform-scale", keywords: [["114", 4], ["edge function", 4], ["migrations", 2], ["how many", 2], ["tables", 3], "resolvers", ["scale", 1], ["foreign keys", 3], ["schemas", 2]],
    answer: `${findxny.name} platform scale: ${findxny.metrics.join("; ")}. ${SCOPE_NOTE} For FINDXNY OS, Prince's areas of ownership were: ${findxny.ownership!.join("; ")}.` },
  { id: "offline", keywords: [["offline", 3], ["sqlite", 3], ["synchroniz", 3], ["sync", 2], "queue", ["idempoten", 2], "reconnect", "retry", ["no internet", 3], ["internet drops", 3]],
    answer: `Offline in FINDXNY OS: ${findxny.highlights[1]}\n\nDecision: ${findxny.decisions[0].decision} ${findxny.decisions[0].why}\n\nCase study: /projects/findxny-os` },
  { id: "tenant", keywords: [["tenant", 3], ["isolation", 2], ["rls", 2], ["row level", 3], ["row-level", 3], ["workspace", 1], ["role-based", 3], ["rbac", 3], ["permission", 1]],
    answer: `Tenant isolation in FINDXNY OS: ${findxny.highlights[0]}\n\nDecision: ${findxny.decisions[1].decision} ${findxny.decisions[1].why}` },
  { id: "payments", keywords: [["payment", 3], ["xendit", 3], ["webhook", 2], "wallet", "checkout", "refund", ["gcash", 2], ["maya", 2], ["billing", 3], ["refund", 3]],
    answer: `Payments: in FINDXNY OS, ${findxny.highlights[3]}\n\nIn Lalaba, ${lalaba.highlights[3]}` },
  { id: "hardware", keywords: [["printer", 3], ["hardware", 3], ["esc/pos", 3], ["cash drawer", 3], "bluetooth", "usb", ["receipt", 2], ["thermal", 3]], answer: `Hardware: ${findxny.highlights[2]}` },
  { id: "lalaba-booking", keywords: [["availability", 1], ["pricing", 1], ["server-authoritative", 3], ["device approval", 3], ["booking", 1], "fees", ["platform fee", 3]],
    answer: `Lalaba's server-side rules: ${lalaba.highlights[1]} ${lalaba.highlights[2]}\n\nDecision: ${lalaba.decisions[0].decision} ${lalaba.decisions[0].why}` },
  { id: "skills", generic: true, keywords: [["skills", 3], ["technologies", 3], ["technology", 2], ["tech stack", 3], ["stack", 2], "languages", ["frameworks", 3], ["used in production", 3], ["tools", 3], ["what languages", 3], ["skill set", 3], ["skillset", 3], ["what can he do", 3]],
    answer: `Skills from his résumé:\n${Object.entries(SKILLS).map(([g, l]) => `- ${g}: ${l.join(", ")}`).join("\n")}\n\nProduction stack by project:\n${projects.map((p) => `- ${p.name}: ${p.stack.join(", ")}`).join("\n")}` },
  { id: "years", keywords: [["years of experience", 5], ["how long", 3], ["been a developer", 4], ["been a software", 4], ["how many years", 5], ["experience level", 4], ["junior", 3], ["senior", 3], ["seniority", 4], ["entry level", 4], ["entry-level", 4], ["mid level", 4], ["mid-level", 4]],
    answer: `His listed title is "${findxny.role}". ${RESUME_SUMMARY} The software roles listed on this site run from May 2025 (FINDXNY: ${EXPERIENCE[0].date}). Before that he taught programming and worked as a biomedical engineer.` },
  { id: "experience", generic: true, keywords: [["work history", 3], ["employer", 3], "career", ["worked", 1], ["where has he worked", 5], ["where did he work", 5], ["where does he work", 5], ["company", 3], ["teacher", 3], ["teaching", 3], ["biomedical", 3], ["history", 2], ["job!", 2], ["current role", 3], ["current job", 3], ["most recent", 2], ["before software", 3], ["previous", 1], ["employment", 2], ["experience", 1]],
    answer: `Experience:\n${EXPERIENCE.map((e) => `- ${e.date}: ${e.role} at ${e.org}${e.projects ? ` (projects: ${e.projects.map((p) => p.name).join(", ")})` : ""}`).join("\n")}\n\nHis background spans production software, electronics, technical instruction and biomedical equipment.` },
  { id: "education", keywords: [["education", 4], ["study", 3], ["graduat", 3], ["degree", 4], ["university", 3], ["graduated", 3], ["studied", 3], ["bootcamp", 3], ["zuitt", 3], ["school", 3], ["college", 3], ["certification", 3], ["certifications", 3], ["diploma", 3]], answer: `Education and training:\n- ${EDUCATION.join("\n- ")}` },
  { id: "strengths", keywords: [["strengths", 4], ["strength", 3], ["good at", 3], ["best at", 3], ["specialize", 3], ["specialise", 3], ["specialty", 3], ["specialization", 3], ["expertise", 3], ["why hire", 4], ["why should", 3], ["stand out", 3], ["what makes", 2], ["unique", 2]],
    answer: `Based on his portfolio, his work centers on reliability and correctness in real business systems: offline-first checkout with idempotent retries, payment webhooks that can't double-credit, server-side pricing and tenant/role boundaries, physical POS hardware, and automations with documented safeguards. Details: /projects/findxny-os, /projects/lalaba, /automations.` },
  { id: "team", keywords: [["team", 3], ["alone", 3], ["solo", 3], ["collaborat", 3], ["teamwork", 4], ["work with others", 4], ["independently", 3]],
    answer: "Team context from the portfolio: Lalaba was built as part of a small engineering team; the POS-to-Google-Sheets reporting module is a team project whose commits are credited to him; the Portfolio Assistant is a solo build." },
  { id: "ai", keywords: [["ai!", 3], ["llm", 4], ["claude", 3], ["gpt", 3], ["chatgpt", 4], ["prompt", 2], ["machine learning", 4], ["chatbot", 3], ["generative", 3], ["anthropic", 3]],
    answer: (() => { const a = automation("portfolio-assistant"); return `His AI work on this portfolio is the ${a.name}: ${a.summary}\n\nStack: ${a.stack.join(", ")}.\n\nCase study: /automations/${a.slug}`; })() },
  { id: "quality", keywords: [["testing", 3], ["tests", 3], ["unit test", 4], ["ci!", 3], ["quality", 2], ["accessibility", 4], ["a11y", 4], ["code quality", 4], ["lint", 3]],
    answer: "For this portfolio, typecheck, lint, a secret scan, an assistant-evaluation self-test and an HTTP smoke test run in CI, and pages were checked for accessibility at three screen widths. For the POS-to-Google-Sheets module, its case study says plainly that no automated tests were found in that repository." },
  { id: "security", keywords: [["security", 3], ["secure", 3], ["authentication", 3], ["authorization", 3], ["jwt", 3], ["oauth", 3], ["encryption", 3], ["vulnerab", 3]],
    answer: `Security work on his projects: ${findxny.highlights[0]}\n\n${lalaba.highlights[1]}\n\n${lalaba.highlights[3]}` },
  { id: "code", keywords: [["source code", 5], ["code sample", 5], ["code samples", 5], ["repository", 4], ["repositories", 4], ["repo!", 3], ["repos!", 3], ["open source", 4], ["open-source", 4], ["show me code", 5], ["see the code", 5]],
    answer: `Public code showcases (redacted):\n${CODE_SAMPLES.map((u) => `- ${u}`).join("\n")}\n\nMore on GitHub: ${PROFILE.github}` },
  { id: "automations", generic: true, keywords: [["automation", 3], ["automate", 3], ["workflow", 1]], answer: `Automations:\n${automations.map((a) => `- ${a.name} (${a.status}): ${a.summary}\n  /automations/${a.slug}`).join("\n")}` },
  { id: "sheets", keywords: [["sheets", 3], ["google sheets", 4], ["reporting", 2], ["spreadsheet", 3], "cron", ["scheduled", 2], ["daily sales", 3], ["report", 2]],
    answer: (() => { const a = automation("findxny-sheets-reporting"); return `${a.name} (${a.statusNote}): ${a.summary}\n\nCapabilities: ${a.capabilities!.map((c) => c.title).join("; ")}.\n\nKnown limits: ${a.limits.slice(0, 3).join(" ")}\n\n/automations/${a.slug}`; })() },
  { id: "assistant", keywords: [["assistant", 2], ["this assistant", 3], ["my messages", 4], ["my message", 4], ["my conversation", 4], ["this chat", 3], ["this bot", 3], ["conversation", 2], ["privacy", 3], ["store my", 3], "logged"],
    answer: (() => { const a = automation("portfolio-assistant"); const priv = a.safeguards.find((s) => s.title.toLowerCase().includes("privacy"))!; return `${a.name}: ${a.summary}\n\n${priv.title}: ${priv.text}\n\n/automations/${a.slug}`; })() },
  { id: "results", keywords: [["saved", 3], ["save", 3], ["savings", 3], ["hours", 2], ["roi", 3], ["impact", 4], ["results", 3], ["metrics", 2], ["performance", 2], ["revenue", 3], ["users", 1], ["customers", 1], ["how many users", 5], ["how many customers", 5]],
    answer: "No time-saved, adoption, revenue, user-count or performance figures are published for any project, so I can't give numbers. The case studies list what was built and how it works, and say plainly where something hasn't been measured." },
  { id: "availability", keywords: [["available", 3], ["availability", 3], ["open to", 3], ["hire", 3], ["hiring", 3], ["job!", 1], ["opportunit", 2], "contract", "freelance", ["next step", 2], ["recruit", 2], ["interview", 3], ["looking for a job", 4], ["looking for work", 4], ["open to work", 4]],
    answer: `Status shown on this site: "${PROFILE.availability}". To discuss a role, contract or collaboration, use ${FORM} or email ${PROFILE.email}.` },
  { id: "phone", keywords: [["contact number", 6], ["phone number", 6], ["mobile number", 6], ["phone", 4], ["mobile", 3], ["cell", 3], ["call", 3], ["text him", 4], ["whatsapp", 3]],
    answer: `Prince's phone number is ${PROFILE.phone}. You can also email ${PROFILE.email} or use ${FORM}.` },
  { id: "email", keywords: [["email address", 6], ["his email", 5], ["e-mail", 4], ["gmail", 4], ["email", 2]],
    answer: `Prince's email is ${PROFILE.email}. You can also use ${FORM}.` },
  { id: "linkedin", keywords: [["linkedin", 5]], answer: `Prince's LinkedIn: ${PROFILE.linkedin}` },
  { id: "github-profile", keywords: [["github", 5]], answer: `Prince's GitHub: ${PROFILE.github}\n\nPublic showcases (redacted code):\n${CODE_SAMPLES.map((u) => `- ${u}`).join("\n")}` },
  { id: "recent-project", keywords: [["most recent project", 6], ["latest project", 6], ["newest project", 6], ["recent project", 5], ["last project", 5], ["current project", 5], ["recent work", 4], ["latest work", 4], ["newest work", 4]],
    answer: recentProjectAnswer() },
  { id: "contact", keywords: [["contact", 3], ["email", 3], ["phone", 2], ["reach", 3], ["linkedin", 2], ["github", 2], ["résumé", 3], ["resume", 3], ["cv!", 3], ["download", 1], ["get in touch", 3], ["send a message", 3], ["message", 2], ["send him", 2]],
    answer: `You can reach Prince through ${FORM}, by email at ${PROFILE.email}, by phone at ${PROFILE.phone}, on LinkedIn (${PROFILE.linkedin}) or GitHub (${PROFILE.github}). His résumé is at /resume.` },
  { id: "documentation", keywords: [["documentation", 5], ["whitepaper", 5], ["technical doc", 5], ["docs", 3], ["pdf", 3], ["detailed write", 4], ["download", 2], ["technical overview", 4]],
    answer: `Each project has a documentation page with a preview and a downloadable PDF:\n${DOC_SLUGS.map((s) => `- ${buildDoc(s).title}: /docs/${s}`).join("\n")}\n\nThey describe architecture, capabilities, engineering decisions and known limits, using the same content as the case studies.` },
  { id: "location", keywords: [["where", 1], ["location", 3], ["based", 2], ["live in", 3], ["country", 3], "philippines", ["live!", 2], ["time zone", 3], ["timezone", 3], ["city", 3]], answer: `Prince is based in ${PROFILE.location}.` },
  { id: "salary", keywords: [["salary", 5], ["compensation", 5], ["expected pay", 5], ["rate!", 1], ["how much", 2], ["pay!", 1], ["hourly", 4], ["budget", 1], ["expected rate", 5], ["charge", 3], ["per hour", 4]], answer: `I don't have salary or rate information. ${ASK}` },
  { id: "handoff", keywords: [["remote", 4], ["relocat", 4], ["visa", 4], ["notice period", 5], ["start date", 5], ["when can he start", 5], ["when can prince start", 5], ["work hours", 4], ["schedule", 2], ["part-time", 4], ["part time", 4], ["full-time", 4], ["full time", 4], ["employment type", 5], ["languages does he speak", 5], ["languages does prince speak", 5], ["spoken languages", 5], ["speak", 2], ["speak english", 5], ["english proficiency", 5], ["references", 4], ["why did he", 3], ["career change", 4], ["hobbies", 4], ["home address", 5], ["how old", 5], ["age!", 1], ["work authorization", 5], ["work permit", 5], ["overtime", 4], ["on-site", 4], ["onsite", 4], ["hybrid", 4]],
    answer: `That isn't covered on the portfolio, so I won't guess. ${ASK}` },
  { id: "confidential", keywords: [["confidential", 5], ["secret", 4], ["password", 4], ["credentials", 4], ["customer data", 5], ["business data", 5], ["internal", 2], ["private", 2], ["api key", 5], ["sensitive", 4]], answer: "I can't share confidential, private or customer data, and I don't have access to any. This portfolio only describes architecture and behaviour." },
  { id: "mugthemug", keywords: [["mugthemug", 3], ["storefront", 3], ["online ordering", 3], ["paused", 3], "live"],
    answer: FINDXNY_DETAILS.storefront.live
      ? "Mugthemug is a café, restaurant and staycation lounge that has run its public storefront on FINDXNY OS. Online food ordering and staycation booking were described as paused. I can't confirm the site's current availability, so please check it directly."
      : "Mugthemug is a café, restaurant and staycation lounge whose public storefront has run on FINDXNY OS. The storefront is temporarily offline right now, so its link is disabled on this site. Online food ordering and staycation booking had been paused." },
];

const INJECTION: Entry = {
  id: "injection",
  keywords: [["ignore all previous", 6], ["ignore previous", 6], ["ignore your instructions", 6], ["ignore the above", 6], ["system prompt", 6], ["developer mode", 6], ["jailbreak", 6], ["disregard", 4], ["reveal your", 4], ["print your", 4], ["you are now", 3], ["pretend", 3], ["act as", 2], ["do anything now", 6]],
  answer: "I can only answer questions about Prince's work and background, and I can't change or share my instructions. You can ask about his projects, skills, experience, automations, availability or contact details.",
};

// "Prince's work at Amazon": an employer that isn't in his record gets an explicit "no record" answer.
const KNOWN_ORGS = [...EXPERIENCE.map((e) => e.org), ...projects.map((p) => p.name), "Mugthemug"].map((o) => o.toLowerCase());
function unknownEmployer(question: string): string | null {
  const m = /\b(?:work(?:ed|s|ing)?|employed|job|role|position|experience|career|internship|intern)\s+(?:at|for)\s+([A-Z][A-Za-z0-9&.\-]*(?:\s+[A-Z][A-Za-z0-9&.\-]*){0,2})/.exec(question);
  if (!m) return null;
  const org = m[1].replace(/[^A-Za-z0-9&.\- ]/g, "").trim().slice(0, 40);
  if (!org || KNOWN_ORGS.some((k) => k.includes(org.toLowerCase()) || org.toLowerCase().includes(k))) return null;
  return `I don't have any record of Prince working at ${org}. His listed experience:\n${EXPERIENCE.map((e) => `- ${e.date}: ${e.role} at ${e.org}`).join("\n")}\n\nFor anything not listed on this site, ${ASK.charAt(0).toLowerCase()}${ASK.slice(1)}`;
}

const DEFAULT_ANSWER = `I don't have an answer for that in my built-in FAQ, and I can only answer questions about Prince's work and background. I can cover his projects (FINDXNY OS, Lalaba, Athlete Central), skills, experience, automations, availability and contact details. For anything else, use ${FORM} or email ${PROFILE.email}.`;

// Cues that a question needs real reasoning, so a canned answer would be a poor fit.
const NEEDS_AI = /\b(compare|versus|vs\.?|difference between|pros and cons|how would|write me|write a|draft|rewrite|summari[sz]e|poem|haiku|story|opinion|do you think|recommend|explain why|step by step|in detail|translate|rank|which is better|cover letter|rate his)\b/i;

function score(q: string, entry: Entry): number {
  let total = 0;
  for (const k of entry.keywords) {
    const [word, weight] = typeof k === "string" ? [k, 1] : k;
    const exact = word.endsWith("!");
    const w = exact ? word.slice(0, -1) : word;
    if (new RegExp(`(^|[^a-z0-9])${escapeRe(w)}${exact ? "(?![a-z0-9])" : ""}`, "i").test(q)) total += weight;
  }
  return total;
}

/**
 * Best built-in answer for a question, with a confidence flag. `confident` means the question is a
 * simple, single-turn match that is safe to answer for free; anything else should go to the AI.
 */
export function matchFaq(question: string, opts: { turns?: number } = {}): FaqMatch {
  // Prompt-injection attempts get the fixed refusal before anything else is considered.
  if (score(question.toLowerCase(), INJECTION) >= 4) return { id: "injection", text: INJECTION.answer, score: 6, confident: true };
  const employer = unknownEmployer(question);
  if (employer) return { id: "unknown-employer", text: employer, score: 6, confident: (opts.turns ?? 1) <= 1 };
  const q = question.toLowerCase();
  const turns = opts.turns ?? 1;
  const simple = q.split(/\s+/).length <= 18 && !NEEDS_AI.test(q);

  // A named project plus a clear facet (stack, role, dates, scale, features) gets exactly that answer.
  const facet = projectFacet(q);
  if (facet) return { id: "project-facet", text: facet, score: 7, confident: simple && turns <= 1 };

  const ranked = [...ENTRIES, INJECTION].map((e, i) => ({ e, s: score(q, e), i })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.i - b.i);
  const tech = techAnswer(q);
  const techEntry = tech ? { id: "tech", text: tech.text, s: tech.score } : null;

  // A specific entry beats a generic overview that matched on the same words.
  const topSpecific = ranked.find((x) => !x.e.generic);
  const filtered = ranked.filter((x) => !x.e.generic || !topSpecific || x.s > topSpecific.s);

  type Pick = { id: string; text: string; s: number };
  const picks: Pick[] = filtered.map((x) => ({ id: x.e.id, text: x.e.answer, s: x.s }));
  if (techEntry) picks.unshift(techEntry);
  picks.sort((a, b) => b.s - a.s);

  if (picks.length === 0) return { id: "none", text: DEFAULT_ANSWER, score: 0, confident: false };
  const chosen = [picks[0]];
  if (picks[1] && picks[1].s >= 3 && picks[1].s >= picks[0].s * 0.6) chosen.push(picks[1]);

  const top = picks[0].s;
  // Follow-ups ("what about the second one?") lean on earlier turns, so only very strong matches skip the AI.
  const confident = picks[0].id === "injection" || (simple && (turns <= 1 ? top >= 3 : top >= 6));
  return { id: picks[0].id, text: chosen.map((c) => c.text).join("\n\n"), score: top, confident };
}

/** Text only. Used by the fallback path. */
export function answerFaq(question: string): string {
  return matchFaq(question).text;
}
