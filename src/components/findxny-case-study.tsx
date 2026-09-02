import { Container, Header, Footer, SectionLabel } from "@/components/site";
import { ProductComposition } from "@/components/poster-placeholder";
import type { Project } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Github,
  Monitor,
  Smartphone,
  ShieldCheck,
  Cloud,
  WifiOff,
  CreditCard,
  ReceiptText,
} from "lucide-react";

const GITHUB_URL = "https://github.com/pjDevph/findxny-os-showcase";

const SUBNAV = [
  ["overview", "Overview"],
  ["product", "Product"],
  ["pos", "POS & Admin"],
  ["architecture", "Architecture"],
  ["offline", "Engineering"],
  ["decisions", "Decisions"],
  ["repo", "Repository"],
];

const PRODUCT_SURFACES = [
  {
    icon: Monitor,
    name: "Customer Web",
    tag: "Next.js",
    desc: "Public storefront for a FINDXNY tenant — menu browsing, cart, staycation booking, and an order/booking tracker.",
    points: ["(customer) route group in the Next.js app", "Menu, staycation booking, order tracking pages", "Tenant-branded deployment (mugthemug.ph)"],
  },
  {
    icon: ShieldCheck,
    name: "Admin Web",
    tag: "Next.js · role-gated",
    desc: "A separate (admin) route group in the same Next.js app for catalog, staff, reports, and workspace settings.",
    points: ["Product/catalog, inventory & costing management", "Staff, roles, and audit log views", "Sales reports and Z-report review"],
  },
  {
    icon: Smartphone,
    name: "POS + Kitchen App",
    tag: "Expo · React Native",
    desc: "The terminal cashiers and kitchen staff use — order entry, kitchen tickets, shifts, and hardware I/O, in one app.",
    points: ["Offline-first checkout via a local SQLite queue", "ESC/POS + IMIN thermal printing, physical cash drawer", "Shift management, kitchen ticket board, secondary display"],
  },
  {
    icon: Cloud,
    name: "Backend Platform",
    tag: "Supabase · Deno",
    desc: "The shared core every client calls into: auth, tenant-isolated Postgres data, pricing, and payment webhooks.",
    points: ["114 Deno Edge Functions across 10 domains", "PostgreSQL — 56 tables, 121 foreign keys, RLS", "Xendit webhook processing with dedup"],
  },
];

const STACK_GROUPS = [
  { label: "Web", items: ["Next.js 14", "React 18", "Tailwind CSS 4"] },
  { label: "POS Client", items: ["Expo (React Native 0.83)", "expo-router", "expo-sqlite"] },
  { label: "Backend", items: ["Deno Edge Functions", "Supabase"] },
  { label: "Data & Auth", items: ["PostgreSQL", "Row-Level Security", "Supabase Auth"] },
  { label: "Payments", items: ["Xendit Invoice API", "Webhooks"] },
  { label: "Testing & Delivery", items: ["Vitest", "Playwright", "EAS Build/Update"] },
  { label: "POS Hardware", items: ["ESC/POS (USB/Bluetooth)", "IMIN thermal SDK", "Native cash drawer"] },
];

const FEATURE_GROUPS = [
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
];

const OFFLINE_FLOW = [
  "Cashier checks out; order and payment bodies are written to local SQLite tables first",
  "If offline, the operation queues with a generated idempotency key",
  "A background sync service replays the queue on reconnect — orders, payments, then shift actions",
  "The server validates each idempotency key before applying it, so a resent order can't double-post",
  "An order that fails 8 times surfaces to the cashier as \"stuck\" instead of retrying forever",
];

const PAYMENT_FLOW = [
  "payments-create-intent computes the total server-side and opens a Xendit Invoice (or routes to the cash-at-counter flow)",
  "Xendit hosts checkout across GCash, Maya, card, and QRPh behind one invoice",
  "Xendit calls payments-webhook on completion",
  "The handler inserts into webhook_events first — a unique constraint on (invoice, status) lets exactly one delivery win and silently drops retries",
  "payment_intents, then the order or booking, are updated — paid orders auto-spawn a kitchen ticket for kitchen-required items",
  "A transaction + receipt row is recorded, and a booking receipt is emailed automatically when a guest email is on file",
];

const SCHEMA_DOMAINS = [
  { name: "WORKSPACE & ACCESS", tables: ["workspaces", "branches", "workspace_members", "profiles", "pos_devices"] },
  { name: "ORDERS & KITCHEN", tables: ["orders", "order_items", "order_charges", "kitchen_tickets", "receipts"] },
  { name: "PAYMENTS & TRANSACTIONS", tables: ["payment_intents", "payments", "transactions", "refunds"] },
  { name: "BOOKINGS & RESOURCES", tables: ["bookings", "bookable_resources", "resource_blocks"] },
  { name: "SHIFTS & CASH MANAGEMENT", tables: ["shifts", "shift_events", "cash_drawer_events", "z_reports"] },
  { name: "CATALOG & INVENTORY", tables: ["products", "product_variants", "inventory_items", "stock_movements"] },
];

function ShotFrame({ src, alt, caption, ratio = "aspect-[4/3]" }: { src: string; alt: string; caption: string; ratio?: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className={`relative ${ratio}`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
      </div>
      <figcaption className="border-t border-line px-3 py-2.5 text-xs leading-5 text-muted-bright">{caption}</figcaption>
    </figure>
  );
}

function SubNav() {
  return (
    <div className="sticky top-16 z-40 border-b border-white/5 bg-ink">
      <Container className="scrollbar-none flex gap-2 overflow-x-auto py-3">
        {SUBNAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="subnav-link">{label}</a>
        ))}
      </Container>
    </div>
  );
}

export function FindxnyCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <Header />
      <main>
        <section className="grid-bg border-b border-white/5 py-20">
          <Container>
            <Link href="/#work" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
              <ArrowLeft size={15} />Back to work
            </Link>
            <div className="mt-12 max-w-5xl">
              <div className="font-mono text-xs tracking-[.16em] text-cyan">{project.index} / {project.eyebrow}</div>
              <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">{project.name}</h1>
              <p className="mt-6 max-w-3xl text-xl leading-8 text-muted">{project.summary}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href="https://mugthemug.ph" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-text px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5">
                  Visit live storefront <ArrowUpRight size={15} />
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:border-cyan/70 hover:text-cyan">
                  <Github size={14} />View on GitHub
                </a>
                <a href="#architecture" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:border-cyan/70 hover:text-cyan">
                  Jump to architecture
                </a>
              </div>

              <div className="mt-8 grid gap-5 border-y border-line py-6 sm:grid-cols-3">
                <div><div className="font-mono text-xs text-dim">ROLE</div><div className="mt-1">{project.role}</div></div>
                <div><div className="font-mono text-xs text-dim">PERIOD</div><div className="mt-1">{project.period}</div></div>
                <div><div className="font-mono text-xs text-dim">PLATFORM</div><div className="mt-1">Web · POS · Backend · Hardware</div></div>
              </div>
            </div>
            <ProductComposition slug="findxny-os" name={project.name} className="mt-10 overflow-hidden rounded-2xl border border-line" />
          </Container>
        </section>

        <SubNav />

        <section id="overview" className="section-anchor py-20">
          <Container>
            <div className="font-mono text-xs uppercase tracking-[.18em] text-dim">The project in 30 seconds</div>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {[
                { n: "01", label: "Problem", text: "Restaurants and cafés still need to sell when the internet drops, and one platform has to run more than one tenant business." },
                { n: "02", label: "Product", text: "A multi-tenant web storefront, admin back office, Expo POS/kitchen app, and shared Supabase/Postgres backend." },
                { n: "03", label: "My role", text: "Offline sync, payment webhooks, tenant/role access boundaries, and POS hardware integrations." },
                { n: "04", label: "Result", text: "Cashiers keep transacting offline and reconcile safely on reconnect — running a real business today." },
              ].map((s, i) => (
                <div key={s.n} className={`lg:pr-8 ${i > 0 ? "lg:border-l lg:border-white/5 lg:pl-8" : ""}`}>
                  <div className="font-mono text-sm text-cyan">{s.n}</div>
                  <div className="mt-2 text-lg font-semibold">{s.label}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-bright">{s.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-y border-white/5 bg-ink/40 py-10">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">My ownership — what I personally built</div>
                <div className="mt-4">
                  {(project.ownership ?? []).map((o) => (
                    <div key={o} className="border-b border-white/5 py-2.5 text-sm text-muted-bright last:border-b-0">{o}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[.18em] text-dim">System scale — quantitative</div>
                <div className="mt-4 space-y-2.5">
                  {project.metrics.map((m) => (
                    <div key={m} className="text-lg font-semibold tracking-tight text-text/90">{m}</div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <h2 className="text-3xl font-bold">What I worked on</h2>
                <p className="mt-4 text-sm leading-6 text-muted-bright">
                  FINDXNY OS is a monorepo: a Next.js web app (customer storefront + admin back office), an Expo
                  POS/kitchen app, a shared Supabase/Postgres backend, and a shared API-client package — built to run
                  more than one tenant business on the same infrastructure.
                </p>
              </div>
              <ul className="space-y-4 text-muted">
                {project.highlights.map((h) => <li key={h} className="rounded-xl border border-line bg-panel p-5">{h}</li>)}
              </ul>
            </div>
          </Container>
        </section>

        <section id="product" className="border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <SectionLabel>Product surfaces</SectionLabel>
            <h2 className="text-3xl font-bold">One monorepo, four surfaces</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {PRODUCT_SURFACES.map((s) => (
                <div key={s.name} className="rounded-2xl border border-line bg-panel p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold"><s.icon size={16} className="text-cyan" />{s.name}</div>
                    <span className="font-mono text-[10px] text-dim">{s.tag}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-bright">{s.desc}</p>
                  <ul className="mt-4 space-y-1.5 text-xs text-muted">
                    {s.points.map((p) => <li key={p}>· {p}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <SectionLabel>Production implementation</SectionLabel>
            <h2 className="text-3xl font-bold">Mugthemug — a live FINDXNY tenant</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">
              Mugthemug is a 24/7 café, restaurant, and staycation lounge in Angono, Rizal, running on the customer
              (customer) surface of this platform. Its footer reads &ldquo;Powered by FINDXNY.&rdquo;
            </p>
            <div className="mt-8">
              <ShotFrame ratio="aspect-[16/9]" src="/projects/findxny-os/storefront.jpg" alt="Mugthemug storefront signage, powered by FINDXNY" caption="Storefront — the FINDXNY tenant behind the counter" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <ShotFrame src="/projects/findxny-os/order-menu.jpg" alt="Mugthemug menu ordering interface" caption="Menu & ordering" />
              <ShotFrame src="/projects/findxny-os/staycation.jpg" alt="Mugthemug staycation lofts" caption="Staycation booking" />
              <ShotFrame src="/projects/findxny-os/order-tracker.jpg" alt="Mugthemug order and booking tracker" caption="Order & booking tracker" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-panel p-5">
                <div className="font-mono text-xs text-cyan">CURRENT STATUS</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">
                  Online food ordering and staycation booking are currently paused on the live site — customers
                  message or call to inquire. The order/booking tracker stays available.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-panel p-5">
                <div className="font-mono text-xs text-cyan">WHY IT MATTERS</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">
                  This isn&apos;t a demo tenant — it&apos;s a real business running its storefront and order/booking
                  tracking on infrastructure this project built.
                </p>
              </div>
            </div>
            <a href="https://mugthemug.ph" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold transition hover:border-cyan/70 hover:text-cyan">
              Visit mugthemug.ph <ExternalLink size={15} />
            </a>
          </Container>
        </section>

        <section id="pos" className="section-anchor border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <SectionLabel>POS & admin snapshots</SectionLabel>
            <h2 className="text-3xl font-bold">The cashier and back-office side, in action</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">
              Screens from a live tablet session on the Expo POS/kitchen app — order entry, the owner dashboard,
              checkout, and the kitchen prep board.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-panel">
              <video
                className="aspect-[8/5] w-full bg-black"
                src="/projects/findxny-os/pos-walkthrough.mp4"
                poster="/projects/findxny-os/pos-walkthrough-poster.jpg"
                controls
                muted
                playsInline
                preload="metadata"
              />
              <div className="border-t border-line px-4 py-3 text-xs leading-5 text-muted-bright">
                Live walkthrough — order entry, offline mode, checkout, and the kitchen prep board on the actual tablet build.
              </div>
            </div>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Supporting screens</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ShotFrame ratio="aspect-[8/5]" src="/projects/findxny-os/pos-order-offline.jpg" alt="POS order screen with offline banner: product orders queued, bookings disabled" caption="Order entry — offline" />
              <ShotFrame ratio="aspect-[8/5]" src="/projects/findxny-os/pos-dashboard.jpg" alt="Mugthemug POS owner dashboard with live orders, bookings, and payment split" caption="Owner dashboard" />
              <ShotFrame ratio="aspect-[8/5]" src="/projects/findxny-os/pos-payment.jpg" alt="POS checkout screen with Cash, GCash, Maya, Card, QRPh, and Bank options" caption="Checkout" />
              <ShotFrame ratio="aspect-[8/5]" src="/projects/findxny-os/pos-kitchen-display.jpg" alt="Kitchen prep display with New, Preparing, and Ready columns" caption="Kitchen prep display" />
            </div>
          </Container>
        </section>

        <section id="architecture" className="section-anchor border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <SectionLabel>System architecture</SectionLabel>
            <h2 className="text-3xl font-bold">How the pieces talk to each other</h2>
            <div className="mt-8 space-y-3">
              <div className="arch-tier">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Client surfaces</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="arch-node">Customer Web (Next.js)</div>
                  <div className="arch-node">Admin Web (Next.js)</div>
                  <div className="arch-node">POS + Kitchen (Expo)</div>
                </div>
              </div>
              <div className="arch-arrow py-1">↓ business rules never run on the client</div>
              <div className="arch-tier">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Application layer</div>
                <div className="arch-node cyan">114 Deno Edge Functions — auth · catalog · orders · bookings · payments · staff · reports</div>
              </div>
              <div className="arch-arrow py-1">↓</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="arch-tier">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Data & auth</div>
                  <div className="space-y-2">
                    <div className="arch-node">Supabase Auth</div>
                    <div className="arch-node">PostgreSQL — 56 tables, RLS</div>
                  </div>
                </div>
                <div className="arch-tier">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">External & hardware</div>
                  <div className="space-y-2">
                    <div className="arch-node">Xendit Invoice API + webhooks</div>
                    <div className="arch-node">ESC/POS · IMIN printer · cash drawer</div>
                  </div>
                </div>
              </div>
              <div className="arch-tier">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Offline layer (POS only)</div>
                <div className="arch-node">Local SQLite queue (orders/payments/shift actions) → idempotency key → server reconciliation</div>
              </div>
            </div>
            <p className="mt-4 text-xs text-dim">There is no local Supabase/Docker stack — dev, staging, and production are all real deployed Supabase projects (per the repo README).</p>
          </Container>
        </section>

        <section id="stack" className="py-20">
          <Container>
            <SectionLabel>Technology stack</SectionLabel>
            <h2 className="text-3xl font-bold">Grouped by where it sits in the system</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {STACK_GROUPS.map((g) => (
                <div key={g.label} className="rounded-2xl border border-line bg-panel p-6">
                  <h3 className="font-mono text-xs uppercase tracking-[.16em] text-cyan">{g.label}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((s) => <span key={s} className="rounded-full border border-line bg-panel2 px-3 py-1.5 font-mono text-xs text-muted-bright">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="features" className="border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <SectionLabel>Feature matrix</SectionLabel>
            <h2 className="text-3xl font-bold">Organized by surface, not a flat list</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {FEATURE_GROUPS.map((g) => (
                <div key={g.label} className="rounded-2xl border border-line bg-panel p-6">
                  <h3 className="text-sm font-semibold text-text">{g.label}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted-bright">
                    {g.items.map((i) => <li key={i}>· {i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="data" className="py-20">
          <Container>
            <SectionLabel>Selected data model</SectionLabel>
            <h2 className="text-3xl font-bold">56 tables across 10 domains</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">
              The production schema has 56 tables and 121 foreign keys, organized into 10 domains (Workspace &amp;
              Access, Catalog &amp; Inventory, Orders &amp; Kitchen, Payments &amp; Transactions, Bookings &amp;
              Resources, Shifts &amp; Cash Management, Customers &amp; Loyalty, Tasks &amp; Checklists, Menu Book,
              Expenses). Below is a representative slice — not the full public schema.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SCHEMA_DOMAINS.map((d) => (
                <div key={d.name} className="erd-entity">
                  <div className="erd-entity-name">{d.name}</div>
                  <div className="mt-3 space-y-1 font-mono text-[11px] text-muted">
                    {d.tables.map((t) => <div key={t}>{t}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="offline" className="border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-[8/5] w-full overflow-hidden rounded-2xl border border-line">
                <Image src="/projects/findxny-os/pos-order-offline.jpg" alt="POS order screen with offline banner active" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
              <div>
                <div className="flex items-center gap-2"><WifiOff size={16} className="text-cyan" /><SectionLabel>Offline-first architecture</SectionLabel></div>
                <h2 className="text-3xl font-bold">Cashiers keep working when the network doesn&apos;t</h2>
                <div className="mt-6 space-y-3">
                  {OFFLINE_FLOW.map((step, i) => (
                    <div key={step} className="flow-step">
                      <div className="flow-step-index">{String(i + 1).padStart(2, "0")}</div>
                      <div className="mt-1.5 text-sm leading-5 text-muted-bright">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="payments" className="py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="lg:order-2 relative aspect-[8/5] w-full overflow-hidden rounded-2xl border border-line">
                <Image src="/projects/findxny-os/pos-payment.jpg" alt="POS checkout screen with payment method options" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
              <div className="lg:order-1">
                <div className="flex items-center gap-2"><CreditCard size={16} className="text-cyan" /><SectionLabel>Payments & webhooks</SectionLabel></div>
                <h2 className="text-3xl font-bold">Server-authoritative, idempotent by design</h2>
                <div className="mt-6 space-y-3">
                  {PAYMENT_FLOW.map((step, i) => (
                    <div key={step} className="flow-step">
                      <div className="flow-step-index">{String(i + 1).padStart(2, "0")}</div>
                      <div className="mt-1.5 text-sm leading-5 text-muted-bright">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="hardware" className="border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <div className="flex items-center gap-2"><ReceiptText size={16} className="text-cyan" /><SectionLabel>Hardware integration</SectionLabel></div>
            <h2 className="text-3xl font-bold">The POS talks to physical devices</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-panel p-6">
                <div className="text-sm font-semibold">ESC/POS + IMIN thermal printing</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">A native Expo module supports generic ESC/POS printers over USB and Bluetooth, and detects IMIN built-in terminal printers to use their structured SDK calls instead of raw byte injection, which testing showed was unreliable on that hardware.</p>
              </div>
              <div className="rounded-2xl border border-line bg-panel p-6">
                <div className="text-sm font-semibold">Physical cash drawer + secondary display</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">The same module opens the physical cash drawer (via the IMIN SDK or a native fallback), while a separate customer-display module drives a secondary screen for the customer-facing order summary.</p>
              </div>
            </div>
          </Container>
        </section>

        <section id="decisions" className="py-20">
          <Container>
            <SectionLabel>Engineering decisions</SectionLabel>
            <div className="space-y-6">
              {project.decisions.map((d) => (
                <article key={d.title} className="rounded-2xl border border-line bg-panel p-7">
                  <h3 className="text-2xl font-semibold">{d.title}</h3>
                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <div><div className="font-mono text-xs text-cyan">PROBLEM</div><p className="mt-2 text-sm leading-6 text-muted">{d.problem}</p></div>
                    <div><div className="font-mono text-xs text-cyan">DECISION</div><p className="mt-2 text-sm leading-6 text-muted">{d.decision}</p></div>
                    <div><div className="font-mono text-xs text-cyan">IMPACT</div><p className="mt-2 text-sm leading-6 text-muted">{d.why}</p></div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section id="repo" className="border-t border-white/5 py-20">
          <Container>
            <SectionLabel>Repository & evidence</SectionLabel>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-line bg-panel p-6">
                <div className="flex items-center gap-2 text-sm font-semibold"><Github size={15} className="text-dim" />Source code</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">A public, redacted snapshot is on GitHub — real code, migrations, and Edge Functions, minus secrets and internal ops docs.</p>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">View repository ↗</a>
              </div>
              <div className="rounded-2xl border border-line bg-panel p-6">
                <div className="flex items-center gap-2 text-sm font-semibold"><ExternalLink size={15} className="text-dim" />Live storefront</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">A production tenant is public at mugthemug.ph.</p>
                <a href="https://mugthemug.ph" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">Visit ↗</a>
              </div>
              <div className="rounded-2xl border border-line bg-panel p-6">
                <div className="text-sm font-semibold">What I owned</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">As {project.role.toLowerCase()} ({project.period}), I worked across the offline sync layer, tenant/role access model, payment webhooks, and POS hardware integrations described above.</p>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-white/5 py-16">
          <Container>
            <Link href="/projects/lalaba" className="group flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-[.18em] text-dim">Next case study</div>
                <div className="mt-2 text-2xl font-bold sm:text-3xl">Lalaba</div>
                <p className="mt-1 text-sm text-muted-bright">Multi-role marketplace infrastructure across customer, partner, and admin surfaces.</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan transition group-hover:gap-3">View Lalaba <ArrowUpRight size={16} /></span>
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
