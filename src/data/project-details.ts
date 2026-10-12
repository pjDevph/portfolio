import type { Status } from "@/components/status-pill";

// Detailed project content shared by the case-study pages and the downloadable documentation PDFs.
// Edit here once: both the page and the PDF read from this file. Everything in it is already public on the site.

export const FINDXNY_DETAILS = {
  // Flip `live` back to true when the public storefront is reachable again; every page, the PDF and the chatbot follow.
  storefront: { url: "https://mugthemug.ph", live: false },
  surfaces: [
    {
      name: "Customer Web",
      tag: "Next.js",
      desc: "Public storefront for a FINDXNY tenant — menu browsing, cart, staycation booking, and an order/booking tracker.",
      points: ["(customer) route group in the Next.js app", "Menu, staycation booking, order tracking pages", "Tenant-branded deployment (mugthemug.ph)"],
    },
    {
      name: "Admin Web",
      tag: "Next.js · role-gated",
      desc: "A separate (admin) route group in the same Next.js app for catalog, staff, reports, and workspace settings.",
      points: ["Product/catalog, inventory & costing management", "Staff, roles, and audit log views", "Sales reports and Z-report review"],
    },
    {
      name: "POS + Kitchen App",
      tag: "Expo · React Native",
      desc: "The terminal cashiers and kitchen staff use — order entry, kitchen tickets, shifts, and hardware I/O, in one app.",
      points: ["Offline-first checkout via a local SQLite queue", "ESC/POS + IMIN thermal printing, physical cash drawer", "Shift management, kitchen ticket board, secondary display"],
    },
    {
      name: "Backend Platform",
      tag: "Supabase · Deno",
      desc: "The shared core every client calls into: auth, tenant-isolated Postgres data, pricing, and payment webhooks.",
      points: ["115 Deno Edge Functions across 10 domains", "PostgreSQL — 56 tables, 121 foreign keys, RLS", "Xendit webhook processing with dedup"],
    },
  ],
  stackGroups: [
    { label: "Web", items: ["Next.js 14", "React 18", "Tailwind CSS 4"] },
    { label: "POS Client", items: ["Expo (React Native 0.83)", "expo-router", "expo-sqlite"] },
    { label: "Backend", items: ["Deno Edge Functions", "Supabase"] },
    { label: "Data & Auth", items: ["PostgreSQL", "Row-Level Security", "Supabase Auth"] },
    { label: "Payments", items: ["Xendit Invoice API", "Webhooks"] },
    { label: "Testing & Delivery", items: ["Vitest", "Playwright", "EAS Build/Update"] },
    { label: "POS Hardware", items: ["ESC/POS (USB/Bluetooth)", "IMIN thermal SDK", "Native cash drawer"] },
  ],
  featureGroups: [
    {
      label: "Customer & Booking",
      items: [
        "Public storefront, menu, and cart per tenant (e.g. mugthemug.ph)",
        "Staycation/resource booking with holds, check-in/out, and reschedule",
        "Order & booking tracker by order number + mobile number",
      ],
    },
    {
      label: "POS & Kitchen",
      items: [
        "Order entry, per-item kitchen routing, and a live kitchen ticket board",
        "Shift open/close, clock-in/out, and per-shift cash-drawer reconciliation",
        "Loyalty points, vouchers, and manager-approval overrides for voids/refunds",
      ],
    },
    {
      label: "Platform & Access",
      items: [
        "Multi-tenant workspace → branch model enforced by PostgreSQL RLS",
        "Owner / admin / manager / cashier / kitchen roles via named permission groups",
        "PIN-based staff login with rate-limited auth attempts (no plaintext PINs stored)",
      ],
    },
    {
      label: "Payments & Operations",
      items: [
        "Xendit Invoice checkout (GCash, Maya, card, QRPh) plus a separate pay-at-counter cash flow",
        "Idempotency-Key handling on mutating endpoints, with request-hash collision detection",
        "Z-reports, sales analytics, inventory/stock adjustments, and expense tracking",
      ],
    },
  ],
  offlineFlow: [
    "Cashier checks out; order and payment bodies are written to local SQLite tables first",
    "If offline, the operation queues with a generated idempotency key",
    "A background sync service replays the queue on reconnect — orders, payments, then shift actions",
    "The server validates each idempotency key before applying it, so a resent order can't double-post",
    "An order that fails 8 times surfaces to the cashier as \"stuck\" instead of retrying forever",
  ],
  paymentFlow: [
    "payments-create-intent computes the total server-side and opens a Xendit Invoice (or routes to the cash-at-counter flow)",
    "Xendit hosts checkout across GCash, Maya, card, and QRPh behind one invoice",
    "Xendit calls payments-webhook on completion",
    "The handler inserts into webhook_events first — a unique constraint on (invoice, status) lets exactly one delivery win and silently drops retries",
    "payment_intents, then the order or booking, are updated — paid orders auto-spawn a kitchen ticket for kitchen-required items",
    "A transaction + receipt row is recorded, and a booking receipt is emailed automatically when a guest email is on file",
  ],
  schemaDomains: [
    { name: "WORKSPACE & ACCESS", tables: ["workspaces", "branches", "workspace_members", "profiles", "pos_devices"] },
    { name: "ORDERS & KITCHEN", tables: ["orders", "order_items", "order_charges", "kitchen_tickets", "receipts"] },
    { name: "PAYMENTS & TRANSACTIONS", tables: ["payment_intents", "payments", "transactions", "refunds"] },
    { name: "BOOKINGS & RESOURCES", tables: ["bookings", "bookable_resources", "resource_blocks"] },
    { name: "SHIFTS & CASH MANAGEMENT", tables: ["shifts", "shift_events", "cash_drawer_events", "z_reports"] },
    { name: "CATALOG & INVENTORY", tables: ["products", "product_variants", "inventory_items", "stock_movements"] },
  ],
};

export const LALABA_DETAILS = {
  repos: [
    { name: "Backend", url: "https://github.com/pjDevph/lalaba-backend-showcase" },
    { name: "Customer app", url: "https://github.com/pjDevph/lalaba-customer-showcase" },
    { name: "Partner app", url: "https://github.com/pjDevph/lalaba-partner-showcase" },
    { name: "Admin panel", url: "https://github.com/pjDevph/lalaba-admin-showcase" },
    { name: "Website", url: "https://github.com/pjDevph/lalaba-website-showcase" },
  ],
  surfaces: [
    {
      name: "Customer App",
      tag: "Expo · React Native",
      desc: "The app end customers use to find laundry providers, book pickup/delivery, and pay from an in-app wallet.",
      points: ["Firebase Auth (JS SDK) + App Check", "Google Maps for provider discovery", "Custom fetch-based GraphQL client — no Apollo/codegen"],
      image: "/projects/lalaba/customer-app.jpg",
    },
    {
      name: "Partner App",
      tag: "Expo · React Native",
      desc: "The app laundromats, home washers, and staff use — bookings, verification, and device-gated access.",
      points: ["Camera + face detection + biometrics for verification/KYC", "Branch-scoped staff device approval", "QR-code support for pickup/handoff flows"],
      image: "/projects/lalaba/partner-app.jpg",
    },
    {
      name: "Admin Panel",
      tag: "Next.js",
      desc: "Internal operations console — 29 feature routes mirroring the backend's own module boundaries.",
      points: ["Merchants, orders, wallets, promotions, campaigns, booking-policy", "Hand-written GraphQL query/mutation layer (no client library)", "Role/permission management UI"],
      image: "/projects/lalaba/admin-panel.jpg",
    },
    {
      name: "Marketing Website",
      tag: "Next.js",
      desc: "A standalone public-facing site — intentionally has no live connection to the backend.",
      points: ["Static marketing content only", "No auth, API, or payment logic", "Separate repo, separate deploy"],
      image: null,
    },
    {
      name: "Backend Platform",
      tag: "NestJS · Apollo GraphQL",
      desc: "The shared API every client talks to — one backend behind both mobile apps and the admin panel.",
      points: ["187 module directories, 57 GraphQL resolvers, 68 Mongoose schemas", "MongoDB + Redis (rate limiting/caching)", "Xendit wallet webhook, Firebase Admin SDK"],
      image: null,
    },
  ],
  stackGroups: [
    { label: "Mobile", items: ["Expo (React Native 0.83)", "expo-router", "react-native-maps"] },
    { label: "Web", items: ["Next.js (admin + website)", "React 19"] },
    { label: "Backend", items: ["NestJS 11", "Apollo Server / GraphQL", "Mongoose 9"] },
    { label: "Data & Cache", items: ["MongoDB", "Redis (ioredis)"] },
    { label: "Auth & Trust", items: ["Firebase Auth (JS SDK)", "Firebase App Check", "Firebase Cloud Messaging"] },
    { label: "Payments", items: ["Xendit (invoice + webhook)"] },
    { label: "Verification", items: ["react-native-vision-camera", "Face detection", "Biometrics"] },
    { label: "Delivery", items: ["EAS Build/Update (dev/preview/production)"] },
  ],
  featureGroups: [
    {
      label: "Customer",
      items: [
        "Provider discovery on a map, booking, and order tracking",
        "In-app wallet with Xendit-backed top-ups",
        "Push notifications via Firebase Cloud Messaging",
      ],
    },
    {
      label: "Partner / Provider",
      items: [
        "Branch-scoped staff device registration and approval",
        "Camera-based verification (face detection, biometrics) for KYC",
        "Booking, POS, and online-order handling modules",
      ],
    },
    {
      label: "Platform & Access",
      items: [
        "Server-authoritative platform-fee, booking-availability, and booking-policy modules",
        "Permission/role modules enforced at the API layer, not just the UI",
        "Promotions and voucher redemption as first-class backend modules",
      ],
    },
    {
      label: "Admin Operations",
      items: [
        "29 admin routes mirroring backend module boundaries (merchants, orders, wallets, promotions, campaigns)",
        "Booking-policy and platform-fee configuration UI",
        "Wallet and KYC review tooling",
      ],
    },
  ],
  deviceFlow: [
    "A staff device registers itself against a specific branch",
    "An owner/admin approves or blocks it — status lives on the device record, not the client",
    "Each authorization check is cached for 5 minutes to avoid hammering the DB on every request",
    "A device is gated to a single active session — deactivating it can't be silently bypassed by the app still holding an old token",
    "A backfill routine (onModuleInit) normalizes devices created before the status/session fields existed, so old rows don't fall through the gate unprotected",
  ],
  paymentFlow: [
    "Client requests a wallet top-up; a pending top-up intent is recorded with its own external ID",
    "Xendit hosts the actual invoice/payment collection",
    "Xendit calls back to POST /webhooks/xendit with an x-callback-token header",
    "The token is compared with SHA-256 + a timing-safe comparison — no early-exit string compare that could leak timing information",
    "On PAID/SETTLED, the amount and currency are validated against the stored intent before anything is credited",
    "The credit itself goes through one transactional path guarded by a unique ledger index, so a retried Xendit callback returns \"already posted\" instead of crediting twice",
  ],
};

export type ArchTier = { title: string; nodes: string[]; arrowAfter?: string };

// Architecture diagrams, as the case-study pages draw them (top to bottom).
export const FINDXNY_ARCHITECTURE: { tiers: ArchTier[]; note: string } = {
  tiers: [
    { title: "Client surfaces", nodes: ["Customer Web (Next.js)", "Admin Web (Next.js)", "POS + Kitchen (Expo)"], arrowAfter: "business rules never run on the client" },
    { title: "Application layer", nodes: ["115 Deno Edge Functions — auth · catalog · orders · bookings · payments · staff · reports"] },
    { title: "Data & auth", nodes: ["Supabase Auth", "PostgreSQL — 56 tables, RLS"] },
    { title: "External & hardware", nodes: ["Xendit Invoice API + webhooks", "ESC/POS · IMIN printer · cash drawer"] },
    { title: "Offline layer (POS only)", nodes: ["Local SQLite queue (orders/payments/shift actions) → idempotency key → server reconciliation"] },
  ],
  note: "There is no local Supabase/Docker stack: development, staging, and production are all real deployed Supabase projects (per the repository README).",
};

export const LALABA_ARCHITECTURE: { tiers: ArchTier[]; note: string } = {
  tiers: [
    { title: "Client surfaces", nodes: ["Customer App (Expo)", "Partner App (Expo)", "Admin Panel (Next.js)"], arrowAfter: "GraphQL" },
    { title: "Application layer", nodes: ["NestJS + Apollo GraphQL — 187 modules, 57 resolvers"] },
    { title: "Data & cache", nodes: ["MongoDB — 68 Mongoose schemas", "Redis (ioredis) — rate limiting"] },
    { title: "External", nodes: ["Firebase Auth / App Check / Messaging", "Xendit invoice + webhook"] },
  ],
  note: "The marketing website is deliberately unwired: its own repository, with no API, auth or payment connection to the platform above.",
};

export const ATHLETE_ARCHITECTURE: { tiers: ArchTier[]; note: string } = {
  tiers: [
    { title: "Client applications", nodes: ["Customer Web (Next.js)", "Customer Mobile (React Native)", "Android POS", "Admin Desktop (Electron)"], arrowAfter: "every client calls the same functions" },
    { title: "Shared booking backend · Firebase Cloud Functions", nodes: ["Availability & slot rules", "Pricing rules", "Booking lifecycle", "Payment lifecycle"], arrowAfter: "booking and payment state are modeled separately, then linked explicitly" },
    { title: "Identity and data", nodes: ["Firebase Auth", "Firestore"] },
  ],
  note: "Architecture as described in the project record. Per-client feature depth is not itemized.",
};

export const ATHLETE_DETAILS = {
  clients: [
    { name: "Customer Web", tag: "Next.js" },
    { name: "Customer Mobile", tag: "React Native" },
    { name: "Android POS", tag: "Android" },
    { name: "Admin Desktop", tag: "Electron" },
  ],
  featureGroups: [
    {
      name: "Booking",
      items: [
        { title: "Multi-facility, multi-date cart", text: "A customer assembles reservations across several facilities and dates in a single cart.", status: "implemented" },
        { title: "Continuous time-slot merging", text: "Adjacent slots are merged into one continuous booking, governed by availability rules.", status: "implemented" },
        { title: "Live availability", text: "Availability rules are evaluated by the shared backend rather than by each client.", status: "implemented" },
      ],
    },
    {
      name: "Pricing",
      items: [
        { title: "Centralized pricing rules", text: "Standard, peak, weekend, holiday, entrance-fee, and promotional pricing live in one place.", status: "implemented" },
      ],
    },
    {
      name: "Lifecycle & platform",
      items: [
        { title: "Booking and payment lifecycles kept separate", text: "Reservation state and payment state are modeled independently and connected explicitly.", status: "implemented" },
        { title: "Shared Firebase Cloud Functions backend", text: "One backend serves customer web and mobile, the Android POS, and the Electron admin client.", status: "implemented" },
      ],
    },
  ] as { name: string; items: { title: string; text: string; status: Status }[] }[],
  challenges: [
    {
      title: "Many carts, many dates, one booking",
      problem: "Customers reserve several facilities across several dates, and neighbouring slots need to behave as one continuous reservation.",
      approach: "Built a multi-facility, multi-date booking cart that merges continuous time slots and applies availability rules.",
      outcome: "Cart behaviour follows availability rules instead of per-screen logic.",
    },
    {
      title: "Pricing that varies by day and promotion",
      problem: "Standard, peak, weekend, holiday, entrance-fee, and promotional pricing all apply to the same booking.",
      approach: "Centralized every pricing variant behind one set of backend rules.",
      outcome: "Each client reads the same price from the same place.",
    },
  ],
};
