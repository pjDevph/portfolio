import { Container, Header, Footer, SectionLabel } from "@/components/site";
import { ProjectPoster } from "@/components/poster-placeholder";
import type { Project } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Monitor,
  Smartphone,
  Globe,
  Cloud,
  ShieldCheck,
  Wallet,
  Users,
} from "lucide-react";

const REPOS = [
  { name: "Backend", url: "https://github.com/pjDevph/lalaba-backend-showcase" },
  { name: "Customer app", url: "https://github.com/pjDevph/lalaba-customer-showcase" },
  { name: "Partner app", url: "https://github.com/pjDevph/lalaba-partner-showcase" },
  { name: "Admin panel", url: "https://github.com/pjDevph/lalaba-admin-showcase" },
  { name: "Website", url: "https://github.com/pjDevph/lalaba-website-showcase" },
];

const SUBNAV = [
  ["overview", "Overview"],
  ["product", "Product"],
  ["preview", "Admin Preview"],
  ["architecture", "Architecture"],
  ["devices", "Engineering"],
  ["decisions", "Decisions"],
  ["repo", "Repository"],
];

const PRODUCT_SURFACES = [
  {
    icon: Smartphone,
    name: "Customer App",
    tag: "Expo · React Native",
    desc: "The app end customers use to find laundry providers, book pickup/delivery, and pay from an in-app wallet.",
    points: ["Firebase Auth (JS SDK) + App Check", "Google Maps for provider discovery", "Custom fetch-based GraphQL client — no Apollo/codegen"],
    image: "/projects/lalaba/customer-app.jpg",
  },
  {
    icon: Smartphone,
    name: "Partner App",
    tag: "Expo · React Native",
    desc: "The app laundromats, home washers, and staff use — bookings, verification, and device-gated access.",
    points: ["Camera + face detection + biometrics for verification/KYC", "Branch-scoped staff device approval", "QR-code support for pickup/handoff flows"],
    image: "/projects/lalaba/partner-app.jpg",
  },
  {
    icon: Monitor,
    name: "Admin Panel",
    tag: "Next.js",
    desc: "Internal operations console — 29 feature routes mirroring the backend's own module boundaries.",
    points: ["Merchants, orders, wallets, promotions, campaigns, booking-policy", "Hand-written GraphQL query/mutation layer (no client library)", "Role/permission management UI"],
    image: "/projects/lalaba/admin-panel.jpg",
  },
  {
    icon: Globe,
    name: "Marketing Website",
    tag: "Next.js",
    desc: "A standalone public-facing site — intentionally has no live connection to the backend.",
    points: ["Static marketing content only", "No auth, API, or payment logic", "Separate repo, separate deploy"],
    image: null,
  },
  {
    icon: Cloud,
    name: "Backend Platform",
    tag: "NestJS · Apollo GraphQL",
    desc: "The shared API every client talks to — one backend behind both mobile apps and the admin panel.",
    points: ["187 module directories, 57 GraphQL resolvers, 68 Mongoose schemas", "MongoDB + Redis (rate limiting/caching)", "Xendit wallet webhook, Firebase Admin SDK"],
    image: null,
  },
];

const STACK_GROUPS = [
  { label: "Mobile", items: ["Expo (React Native 0.83)", "expo-router", "react-native-maps"] },
  { label: "Web", items: ["Next.js (admin + website)", "React 19"] },
  { label: "Backend", items: ["NestJS 11", "Apollo Server / GraphQL", "Mongoose 9"] },
  { label: "Data & Cache", items: ["MongoDB", "Redis (ioredis)"] },
  { label: "Auth & Trust", items: ["Firebase Auth (JS SDK)", "Firebase App Check", "Firebase Cloud Messaging"] },
  { label: "Payments", items: ["Xendit (invoice + webhook)"] },
  { label: "Verification", items: ["react-native-vision-camera", "Face detection", "Biometrics"] },
  { label: "Delivery", items: ["EAS Build/Update (dev/preview/production)"] },
];

const FEATURE_GROUPS = [
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
];

const DEVICE_FLOW = [
  "A staff device registers itself against a specific branch",
  "An owner/admin approves or blocks it — status lives on the device record, not the client",
  "Each authorization check is cached for 5 minutes to avoid hammering the DB on every request",
  "A device is gated to a single active session — deactivating it can't be silently bypassed by the app still holding an old token",
  "A backfill routine (onModuleInit) normalizes devices created before the status/session fields existed, so old rows don't fall through the gate unprotected",
];

const PAYMENT_FLOW = [
  "Client requests a wallet top-up; a pending top-up intent is recorded with its own external ID",
  "Xendit hosts the actual invoice/payment collection",
  "Xendit calls back to POST /webhooks/xendit with an x-callback-token header",
  "The token is compared with SHA-256 + a timing-safe comparison — no early-exit string compare that could leak timing information",
  "On PAID/SETTLED, the amount and currency are validated against the stored intent before anything is credited",
  "The credit itself goes through one transactional path guarded by a unique ledger index, so a retried Xendit callback returns \"already posted\" instead of crediting twice",
];

function SubNav() {
  return (
    <div className="sticky top-16 z-40 border-b border-white/5 bg-ink/92 backdrop-blur-xl">
      <Container className="scrollbar-none flex gap-2 overflow-x-auto py-3">
        {SUBNAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="subnav-link">{label}</a>
        ))}
      </Container>
    </div>
  );
}

export function LalabaCaseStudy({ project }: { project: Project }) {
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
                <a href={REPOS[0].url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-text px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5">
                  <Github size={15} />View on GitHub
                </a>
                <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted">
                  <Users size={14} />Built with a small engineering team
                </span>
                <a href="#architecture" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:border-cyan/70 hover:text-cyan">
                  Jump to architecture
                </a>
              </div>

              <div className="mt-8 grid gap-5 border-y border-line py-6 sm:grid-cols-3">
                <div><div className="font-mono text-xs text-dim">ROLE</div><div className="mt-1">{project.role}</div></div>
                <div><div className="font-mono text-xs text-dim">PERIOD</div><div className="mt-1">{project.period}</div></div>
                <div><div className="font-mono text-xs text-dim">PLATFORM</div><div className="mt-1">Web · Mobile · Backend</div></div>
              </div>
            </div>
            <ProjectPoster slug="lalaba" name={project.name} className="mt-10" />
          </Container>
        </section>

        <SubNav />

        <section id="overview" className="section-anchor py-20">
          <Container>
            <div className="font-mono text-xs uppercase tracking-[.18em] text-dim">The project in 30 seconds</div>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {[
                { n: "01", label: "Problem", text: "A laundry marketplace needs customers, providers, and staff to trust the same pricing, capacity, and access rules across separate apps." },
                { n: "02", label: "Product", text: "A NestJS/GraphQL backend behind a Customer app, Partner app, admin panel, and marketing site — 5 repos, one API." },
                { n: "03", label: "My role", text: "Branch-scoped device approval, wallet webhook idempotency, and server-authoritative pricing/permissions." },
                { n: "04", label: "Result", text: "A device can't stay authorized after deactivation, and a retried payment callback can't double-credit a wallet." },
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
                  Lalaba is a laundry marketplace spread across 5 separate repositories: a NestJS/GraphQL backend,
                  Customer and Partner Expo apps, a Next.js admin panel, and a standalone marketing site. It&apos;s
                  in active development, built alongside a small engineering team rather than solo.
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
            <h2 className="text-3xl font-bold">An ecosystem, not a single app</h2>
            <div className="mt-8 flex flex-col items-center">
              <div className="grid w-full max-w-lg grid-cols-3 gap-3">
                <div className="arch-node">Customer</div>
                <div className="arch-node">Partner</div>
                <div className="arch-node">Admin</div>
              </div>
              <span className="flow-connector my-1" />
              <div className="arch-node cyan w-full max-w-xs text-center">Lalaba — NestJS / GraphQL</div>
              <span className="flow-connector my-1" />
              <div className="arch-node w-full max-w-xs text-center">MongoDB + Redis</div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {PRODUCT_SURFACES.map((s) => (
                <div key={s.name} className="overflow-hidden rounded-2xl border border-line bg-panel">
                  {s.image && (
                    <div className="relative aspect-[16/9] w-full border-b border-line">
                      <Image src={s.image} alt={`${s.name} preview`} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold"><s.icon size={16} className="text-cyan" />{s.name}</div>
                      <span className="font-mono text-[10px] text-dim">{s.tag}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-bright">{s.desc}</p>
                    <ul className="mt-4 space-y-1.5 text-xs text-muted">
                      {s.points.map((p) => <li key={p}>· {p}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="preview" className="section-anchor py-20">
          <Container>
            <SectionLabel>Admin panel preview</SectionLabel>
            <h2 className="text-3xl font-bold">A walkthrough of the real console</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">
              Live screen recording of the admin panel — the 29 feature routes covering merchants, orders, wallets,
              promotions, and booking-policy, all backed by the real GraphQL layer.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-panel">
              <video
                className="aspect-[8/5] w-full bg-black"
                src="/projects/lalaba/admin-walkthrough.mp4"
                poster="/projects/lalaba/admin-walkthrough-poster.jpg"
                controls
                muted
                playsInline
                preload="metadata"
              />
              <div className="border-t border-line px-4 py-3 text-xs leading-5 text-muted-bright">
                Admin panel walkthrough on the actual Next.js build — see the <a href="https://github.com/pjDevph/lalaba-admin-showcase" target="_blank" rel="noreferrer" className="text-cyan hover:underline">source ↗</a>.
              </div>
            </div>
          </Container>
        </section>

        <section id="architecture" className="section-anchor py-20">
          <Container>
            <SectionLabel>System architecture</SectionLabel>
            <h2 className="text-3xl font-bold">One backend behind every client</h2>
            <div className="mt-8 space-y-3">
              <div className="arch-tier">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Client surfaces</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="arch-node">Customer App (Expo)</div>
                  <div className="arch-node">Partner App (Expo)</div>
                  <div className="arch-node">Admin Panel (Next.js)</div>
                </div>
              </div>
              <div className="arch-arrow py-1">↓ GraphQL</div>
              <div className="arch-tier">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Application layer</div>
                <div className="arch-node cyan">NestJS + Apollo GraphQL — 187 modules, 57 resolvers</div>
              </div>
              <div className="arch-arrow py-1">↓</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="arch-tier">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Data & cache</div>
                  <div className="space-y-2">
                    <div className="arch-node">MongoDB — 68 Mongoose schemas</div>
                    <div className="arch-node">Redis (ioredis) — rate limiting</div>
                  </div>
                </div>
                <div className="arch-tier">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">External</div>
                  <div className="space-y-2">
                    <div className="arch-node">Firebase Auth / App Check / Messaging</div>
                    <div className="arch-node">Xendit invoice + webhook</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-dim">The marketing website is deliberately unwired — its own repo, no API/auth/payment connection to the platform above.</p>
          </Container>
        </section>

        <section id="stack" className="border-y border-white/5 bg-panel/40 py-20">
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

        <section id="features" className="py-20">
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

        <section id="devices" className="border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-cyan" /><SectionLabel>Branch-scoped device approval</SectionLabel></div>
            <h2 className="text-3xl font-bold">A device is either approved, or it isn&apos;t — no in-between</h2>
            <div className="mt-8 flex flex-wrap items-stretch gap-3">
              {DEVICE_FLOW.map((step, i) => (
                <div key={step} className="flow-step">
                  <div className="flow-step-index">{String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-1.5 text-sm leading-5 text-muted-bright">{step}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="payments" className="py-20">
          <Container>
            <div className="flex items-center gap-2"><Wallet size={16} className="text-cyan" /><SectionLabel>Wallet & payments</SectionLabel></div>
            <h2 className="text-3xl font-bold">A webhook that can only ever credit once</h2>
            <div className="mt-8 flex flex-wrap items-stretch gap-3">
              {PAYMENT_FLOW.map((step, i) => (
                <div key={step} className="flow-step">
                  <div className="flow-step-index">{String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-1.5 text-sm leading-5 text-muted-bright">{step}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="decisions" className="border-y border-white/5 bg-panel/40 py-20">
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

        <section id="repo" className="py-20">
          <Container>
            <SectionLabel>Repository & status</SectionLabel>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-line bg-panel p-6 md:col-span-2">
                <div className="flex items-center gap-2 text-sm font-semibold"><Github size={15} className="text-dim" />Source code — 5 public showcase repos</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">Redacted public snapshots, one per app — real code and architecture, secrets and internal docs stripped before publishing.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {REPOS.map((r) => (
                    <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel2 px-3 py-1.5 text-xs font-semibold text-muted-bright transition hover:border-cyan/70 hover:text-cyan">
                      {r.name} <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-panel p-6">
                <div className="flex items-center gap-2 text-sm font-semibold"><Users size={15} className="text-dim" />Team & status</div>
                <p className="mt-2 text-sm leading-6 text-muted-bright">Built collaboratively with a small engineering team, not solo. In active development — no public production deployment yet.</p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
