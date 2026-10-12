import { Container, Header, Footer, SectionLabel } from "@/components/site";
import { ProjectPoster } from "@/components/poster-placeholder";
import { ProductCarousel } from "@/components/product-carousel";
import { DocLink } from "@/components/doc-link";
import { LALABA_DETAILS } from "@/data/project-details";
import { LALABA_SLIDES } from "@/data/lalaba-slides";
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
  Globe,
  Cloud,
  ShieldCheck,
  Wallet,
  Users,
} from "lucide-react";

const REPOS = LALABA_DETAILS.repos;

const SUBNAV = [
  ["overview", "Overview"],
  ["ecosystem", "Ecosystem"],
  ["product", "Product"],
  ["preview", "Admin Preview"],
  ["architecture", "Architecture"],
  ["devices", "Engineering"],
  ["decisions", "Decisions"],
  ["repo", "Repository"],
];

const SURFACE_ICONS = { "Customer App": Smartphone, "Partner App": Smartphone, "Admin Panel": Monitor, "Marketing Website": Globe, "Backend Platform": Cloud } as Record<string, typeof Monitor>;
const PRODUCT_SURFACES = LALABA_DETAILS.surfaces.map((s) => ({ ...s, icon: SURFACE_ICONS[s.name] }));

const STACK_GROUPS = LALABA_DETAILS.stackGroups;

const FEATURE_GROUPS = LALABA_DETAILS.featureGroups;

const DEVICE_FLOW = LALABA_DETAILS.deviceFlow;

const PAYMENT_FLOW = LALABA_DETAILS.paymentFlow;

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
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
              <div>
                <div className="font-mono text-xs tracking-[.16em] text-cyan">{project.index} / {project.eyebrow}</div>
                <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">{project.name}</h1>
                <p className="mt-6 max-w-xl text-xl leading-8 text-muted">{project.summary}</p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={REPOS[0].url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-text px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5">
                    <Github size={15} />View on GitHub
                  </a>
                  <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted">
                    <Users size={14} />Built with a small engineering team
                  </span>
                  <DocLink slug="lalaba" />
                </div>

                <div className="mt-8 grid gap-5 border-y border-line py-6 sm:grid-cols-3">
                  <div><div className="font-mono text-xs text-dim">ROLE</div><div className="mt-1">{project.role}</div></div>
                  <div><div className="font-mono text-xs text-dim">PERIOD</div><div className="mt-1">{project.period}</div></div>
                  <div><div className="font-mono text-xs text-dim">PLATFORM</div><div className="mt-1">Web · Mobile · Backend</div></div>
                </div>
              </div>
              <ProjectPoster slug="lalaba" name={project.name} className="rounded-2xl border border-line" />
            </div>
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

        <section id="ecosystem" className="section-anchor border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <SectionLabel>Product ecosystem</SectionLabel>
            <h2 className="text-3xl font-bold">Customer App · Partner App · Admin Panel</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">
              Three different human roles, one platform. The active screenshot below rotates automatically —
              click a thumbnail to jump to it.
            </p>
            <ProductCarousel slides={LALABA_SLIDES} fit="contain" autoplaySeconds={6} className="mx-auto mt-8 max-w-4xl" />
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
            <h2 className="text-3xl font-bold">Five repos, one backend</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">Each surface in detail — see the ecosystem carousel above for the three primary product surfaces at a glance.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {PRODUCT_SURFACES.map((s) => (
                <div key={s.name} className="overflow-hidden rounded-2xl border border-line bg-panel">
                  {s.image && (
                    <div className="relative aspect-[16/9] w-full border-b border-line bg-ink">
                      <Image src={s.image} alt={`${s.name} preview`} fill className="object-contain" sizes="(min-width: 768px) 50vw, 100vw" />
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
                Admin panel walkthrough on the actual Next.js build — see the <a href="https://github.com/pjDevph/lalaba-admin-showcase" target="_blank" rel="noreferrer" className="text-cyan underline underline-offset-2">source ↗</a>.
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

        <section className="border-t border-white/5 py-16">
          <Container>
            <Link href="/projects/findxny-os" className="group flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-[.18em] text-dim">Featured project</div>
                <div className="mt-2 text-2xl font-bold sm:text-3xl">FINDXNY OS</div>
                <p className="mt-1 text-sm text-muted-bright">Multi-tenant POS and booking infrastructure — offline POS, payments, hardware.</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan transition group-hover:gap-3">View FINDXNY <ArrowUpRight size={16} /></span>
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
