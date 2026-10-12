import { Container, Header, Footer, SectionLabel } from "@/components/site";
import { ProductComposition } from "@/components/poster-placeholder";
import type { Project } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import { ShotGallery } from "@/components/lightbox";
import { DocLink } from "@/components/doc-link";
import { FINDXNY_DETAILS } from "@/data/project-details";
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

const STOREFRONT = FINDXNY_DETAILS.storefront;
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

const SURFACE_ICONS = { "Customer Web": Monitor, "Admin Web": ShieldCheck, "POS + Kitchen App": Smartphone, "Backend Platform": Cloud } as Record<string, typeof Monitor>;
const PRODUCT_SURFACES = FINDXNY_DETAILS.surfaces.map((s) => ({ ...s, icon: SURFACE_ICONS[s.name] }));

const STACK_GROUPS = FINDXNY_DETAILS.stackGroups;

const FEATURE_GROUPS = FINDXNY_DETAILS.featureGroups;

const OFFLINE_FLOW = FINDXNY_DETAILS.offlineFlow;

const PAYMENT_FLOW = FINDXNY_DETAILS.paymentFlow;

const SCHEMA_DOMAINS = FINDXNY_DETAILS.schemaDomains;

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
                {STOREFRONT.live ? (
                  <a href={STOREFRONT.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-text px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5">
                    Visit live storefront <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <span aria-disabled="true" title="The public storefront is temporarily offline" className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-line px-4 py-2.5 text-sm text-dim">
                    Live storefront: temporarily offline
                  </span>
                )}
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:border-cyan/70 hover:text-cyan">
                  <Github size={14} />View on GitHub
                </a>
                <a href="#architecture" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:border-cyan/70 hover:text-cyan">
                  Jump to architecture
                </a>
                <DocLink slug="findxny-os" />
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
                { n: "04", label: "Result", text: "Cashiers keep transacting offline and reconcile safely on reconnect — used by a real business." },
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
            <h2 className="text-3xl font-bold">{STOREFRONT.live ? "Mugthemug — a live FINDXNY tenant" : "Mugthemug — a FINDXNY tenant"}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">
              Mugthemug is a 24/7 café, restaurant, and staycation lounge in Angono, Rizal, {STOREFRONT.live ? "running" : "whose public storefront has run"} on the customer
              (customer) surface of this platform. Its footer reads &ldquo;Powered by FINDXNY.&rdquo;
            </p>
            <ShotGallery
              ratio="aspect-[4/5]"
              className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              shots={[
                { src: "/projects/findxny-os/storefront.jpg", alt: "Mugthemug storefront signage, powered by FINDXNY", caption: "Storefront — the FINDXNY tenant behind the counter", width: 800, height: 1200 },
                { src: "/projects/findxny-os/order-menu.jpg", alt: "Mugthemug menu ordering interface", caption: "Menu & ordering", width: 960, height: 1200 },
                { src: "/projects/findxny-os/staycation.jpg", alt: "Mugthemug staycation lofts", caption: "Staycation booking", width: 800, height: 1200 },
                { src: "/projects/findxny-os/order-tracker.jpg", alt: "Mugthemug order and booking tracker", caption: "Order & booking tracker", width: 1200, height: 975 },
              ]}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-panel p-5">
                <div className="font-mono text-xs text-cyan">CURRENT STATUS</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">
                  {STOREFRONT.live
                    ? "Online food ordering and staycation booking are currently paused on the live site — customers message or call to inquire. The order/booking tracker stays available."
                    : "The public storefront is temporarily offline, so the link is disabled for now. Online food ordering and staycation booking had been paused, and the screenshots above show how the storefront looked."}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-panel p-5">
                <div className="font-mono text-xs text-cyan">WHY IT MATTERS</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">
                  {STOREFRONT.live
                    ? "This isn't a demo tenant — it's a real business running its storefront and order/booking tracking on infrastructure this project built."
                    : "This was never a demo tenant: it is a real business's storefront and order/booking tracking, built on infrastructure this project provided."}
                </p>
              </div>
            </div>
            {STOREFRONT.live && (
              <a href={STOREFRONT.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold transition hover:border-cyan/70 hover:text-cyan">
                Visit mugthemug.ph <ExternalLink size={15} />
              </a>
            )}
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
            <ShotGallery
              className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              shots={[
                { src: "/projects/findxny-os/pos-order-offline.jpg", alt: "POS order screen with offline banner: product orders queued, bookings disabled", caption: "Order entry — offline", width: 1400, height: 875 },
                { src: "/projects/findxny-os/pos-dashboard.jpg", alt: "Mugthemug POS owner dashboard with live orders, bookings, and payment split", caption: "Owner dashboard", width: 1400, height: 875 },
                { src: "/projects/findxny-os/pos-payment.jpg", alt: "POS checkout screen with Cash, GCash, Maya, Card, QRPh, and Bank options", caption: "Checkout", width: 1400, height: 875 },
                { src: "/projects/findxny-os/pos-kitchen-display.jpg", alt: "Kitchen prep display with New, Preparing, and Ready columns", caption: "Kitchen prep display", width: 1400, height: 875 },
              ]}
            />
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
                <div className="arch-node cyan">115 Deno Edge Functions — auth · catalog · orders · bookings · payments · staff · reports</div>
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
                <div className="flex items-center gap-2 text-sm font-semibold"><ExternalLink size={15} className="text-dim" />{STOREFRONT.live ? "Live storefront" : "Storefront"}</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">{STOREFRONT.live ? "A production tenant is public at mugthemug.ph." : "A production tenant's public storefront. It is temporarily offline, so the link is disabled for now."}</p>
                {STOREFRONT.live && <a href={STOREFRONT.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">Visit ↗</a>}
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
