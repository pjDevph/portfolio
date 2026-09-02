export type Project = {
  slug: string;
  index: string;
  eyebrow: string;
  name: string;
  summary: string;
  period: string;
  role: string;
  stack: string[];
  metrics: string[];
  highlights: string[];
  decisions: { title: string; problem: string; decision: string; why: string }[];
  architecture: string[];
  live?: string;
  ownership?: string[];
};

export const projects: Project[] = [
  {
    slug: "findxny-os",
    index: "01",
    eyebrow: "POS & OPERATIONS PLATFORM",
    name: "FINDXNY OS",
    summary: "A multi-tenant POS and booking platform spanning web, Expo cashier terminals, Supabase backend infrastructure, offline workflows, payments, and physical POS hardware.",
    period: "May 2026 – Jul 2026",
    role: "Junior Full-Stack Engineer",
    stack: ["Next.js", "React Native", "Expo", "Supabase", "PostgreSQL", "Deno", "Xendit", "EAS"],
    metrics: ["114 Edge Functions", "119 DB migrations", "56 tables · 121 FKs", "Offline SQLite queue", "ESC/POS + cash drawer"],
    highlights: [
      "Designed workspace-, branch-, and role-based access for owners, admins, managers, cashiers, and kitchen staff, enforced by PostgreSQL RLS and shared permission-group checks in every Edge Function.",
      "Built a SQLite-backed offline sync queue (orders, payments, shift actions) with idempotency keys, a capped retry count, and a stuck-order recovery view for unreliable connectivity.",
      "Authored native Expo modules for ESC/POS printing over USB/Bluetooth, IMIN built-in thermal printers, physical cash-drawer triggering, and a secondary customer-facing display.",
      "Implemented Xendit Invoice webhooks with a unique-constraint dedup table, request-hash idempotency on mutating endpoints, and server-side pricing so clients never compute totals."
    ],
    decisions: [
      { title: "Offline transaction durability", problem: "Cashiers still need to transact when internet access drops.", decision: "Persist pending operations in SQLite and replay them with idempotency keys when connectivity returns.", why: "Transactions survive app restarts and network interruptions without double-charging or double-posting." },
      { title: "Tenant isolation", problem: "Many businesses and branches share the same infrastructure.", decision: "Enforce tenant boundaries in PostgreSQL RLS and edge middleware instead of trusting client-side filtering.", why: "A compromised or buggy client cannot freely cross workspace boundaries." }
    ],
    architecture: ["Next.js Web", "Expo POS", "Supabase Auth", "Deno Edge Functions", "PostgreSQL + RLS", "SQLite Offline Queue", "Xendit", "ESC/POS Hardware"],
    ownership: ["Offline sync & idempotent replay", "Payment webhooks & dedup", "Tenant/role access (RLS)", "POS hardware integrations"]
  },
  {
    slug: "lalaba",
    index: "02",
    eyebrow: "MARKETPLACE",
    name: "Lalaba",
    summary: "A multi-role laundry marketplace connecting customers, laundromats, home washers, staff, fulfillment operations, and platform administration.",
    period: "Oct 2025 – Aug 2026",
    role: "Junior Full-Stack Engineer",
    stack: ["NestJS", "GraphQL", "MongoDB", "React Native", "Expo", "Next.js", "Firebase", "Redis", "Xendit"],
    metrics: ["5 independent repos", "187 backend modules", "57 GraphQL resolvers", "68 Mongoose schemas", "Multi-env EAS"],
    highlights: [
      "Built out a NestJS + Apollo GraphQL backend (187 module directories, 57 resolvers, 68 Mongoose schemas) shared by both mobile apps and the admin panel, as part of a small engineering team.",
      "Implemented branch-scoped staff device approval — single-active-session gating, a 5-minute cached auth TTL, and per-branch grants enforced server-side, not just hidden in the UI.",
      "Built server-authoritative platform-fee, booking-availability, and booking-policy modules so pricing and capacity rules can't be recomputed client-side.",
      "Implemented the Xendit wallet top-up webhook: timing-safe callback-token verification, amount/currency validation against the stored intent, and a uniquely-indexed ledger write so a retried callback can never double-credit."
    ],
    decisions: [
      { title: "Server-authoritative pricing", problem: "Different clients could otherwise compute inconsistent totals, platform fees, and booking capacity.", decision: "Centralize fee, voucher, availability, and booking-policy rules in dedicated backend modules (platform-fee, booking-availability, booking-policy).", why: "The backend is the single source of truth for money and capacity — no client can under- or over-charge by recomputing a total locally." },
      { title: "Branch-scoped device approval", problem: "Staff devices and permissions differ by branch, and a lost/shared device is a real access risk in a laundry-branch setting.", decision: "Gate each device to a single active session server-side, cache the auth check for 5 minutes, and scope grants to the approved branch.", why: "A device can't silently stay authorized after being deactivated, and permissions can't be inferred from UI state alone." }
    ],
    architecture: ["Expo Customer App", "Expo Partner App", "Next.js Admin", "Next.js Website", "NestJS GraphQL", "MongoDB", "Redis", "Firebase Auth", "Xendit"],
    ownership: ["Branch-scoped device approval", "Wallet webhook idempotency", "Server-authoritative pricing", "Permission/role enforcement"]
  },
  {
    slug: "athlete-central",
    index: "03",
    eyebrow: "SPORTS & BOOKING",
    name: "Athlete Central",
    summary: "A multi-facility sports booking platform with shared scheduling, booking, pricing, POS, web, mobile, and administration concerns.",
    period: "May 2025 – Sept 2025",
    role: "Junior Full-Stack Engineer",
    stack: ["Next.js", "React Native", "Electron", "Firebase", "TypeScript", "Tailwind CSS"],
    metrics: ["Multi-facility booking", "Multi-date cart", "Live availability", "Dynamic pricing", "Shared backend"],
    highlights: [
      "Designed a shared Firebase Cloud Functions backend across customer web/mobile, Android POS, and Electron admin clients.",
      "Built a multi-facility, multi-date booking cart with continuous time-slot merging and availability rules.",
      "Centralized standard, peak, weekend, holiday, entrance-fee, and promotional pricing.",
      "Separated booking lifecycle from payment lifecycle to keep reservation state explicit and reliable."
    ],
    decisions: [
      { title: "Shared booking domain", problem: "Multiple client applications need identical scheduling and pricing behavior.", decision: "Centralize booking rules and domain models behind shared cloud functions.", why: "Web, mobile, POS, and admin clients consume one consistent scheduling source of truth." },
      { title: "Booking/payment separation", problem: "Payment state and reservation state change independently.", decision: "Model booking and payment lifecycles separately and connect them explicitly.", why: "Failed or delayed payments do not corrupt the operational state of reservations." }
    ],
    architecture: ["Next.js Web", "React Native", "Android POS", "Electron Admin", "Firebase Auth", "Cloud Functions", "Firestore"]
  }
];
