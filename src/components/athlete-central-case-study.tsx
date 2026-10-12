import { Container, Header, Footer, SectionLabel } from "@/components/site";
import { ShotGallery } from "@/components/lightbox";
import { CaseSubNav } from "@/components/case-subnav";
import { DocLink } from "@/components/doc-link";
import { StatusPill, STATUS_STYLE, type Status } from "@/components/status-pill";
import type { Project } from "@/data/projects";
import { ATHLETE_DETAILS } from "@/data/project-details";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Monitor, Smartphone, Store, LayoutDashboard } from "lucide-react";

const SUBNAV = [
  ["overview", "Overview"],
  ["features", "Features"],
  ["architecture", "Architecture"],
  ["challenges", "Challenges"],
  ["results", "Results"],
];

// Only capabilities backed by the project record belong here. Add "In progress"
// or "Planned" items to FEATURE_GROUPS (or the roadmap) once they are confirmed.

const FEATURE_GROUPS = ATHLETE_DETAILS.featureGroups;

const CLIENT_ICONS: Record<string, typeof Monitor> = { "Customer Web": Monitor, "Customer Mobile": Smartphone, "Android POS": Store, "Admin Desktop": LayoutDashboard };
const CLIENTS = ATHLETE_DETAILS.clients.map((c) => ({ ...c, icon: CLIENT_ICONS[c.name] }));

const CHALLENGES = ATHLETE_DETAILS.challenges;

const ROADMAP_NOTE = "In-progress and planned work will be listed here once confirmed. Nothing is claimed beyond the implemented items above.";

export function AthleteCentralCaseStudy({ project }: { project: Project }) {
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
                <a href="#architecture" className="inline-flex items-center gap-2 rounded-full bg-text px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5">
                  See the architecture <ArrowUpRight size={15} />
                </a>
                <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:border-cyan/70 hover:text-cyan">
                  Features &amp; status
                </a>
                <DocLink slug="athlete-central" />
              </div>
              <div className="mt-8 grid gap-5 border-y border-line py-6 sm:grid-cols-3">
                <div><div className="font-mono text-xs text-dim">ROLE</div><div className="mt-1">{project.role}</div></div>
                <div><div className="font-mono text-xs text-dim">PERIOD</div><div className="mt-1">{project.period}</div></div>
                <div><div className="font-mono text-xs text-dim">PLATFORM</div><div className="mt-1">Web · Mobile · POS · Admin</div></div>
              </div>
            </div>
            <ShotGallery
              ratio="aspect-[16/9]"
              className="mt-10 grid grid-cols-1"
              shots={[{ src: "/projects/athlete-central/poster.jpg", alt: "Athlete Central project poster", caption: "Project poster. Product screenshots are not published yet.", width: 1400, height: 781 }]}
            />
          </Container>
        </section>

        <CaseSubNav items={SUBNAV} />

        <section id="overview" className="section-anchor py-20">
          <Container>
            <div className="font-mono text-xs uppercase tracking-[.18em] text-dim">The project in 30 seconds</div>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {[
                { n: "01", label: "Problem", text: "Web, mobile, POS, and admin clients all need identical scheduling and pricing behaviour for the same facilities." },
                { n: "02", label: "Product", text: "A multi-facility sports booking platform: customer web and mobile, an Android POS, and an Electron admin client on one backend." },
                { n: "03", label: "My role", text: "Shared booking domain, multi-date cart, centralized pricing, and the booking/payment lifecycle split." },
                { n: "04", label: "Result", text: "Every client consumes one scheduling and pricing source of truth through shared Cloud Functions." },
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

        <section id="features" className="section-anchor border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <SectionLabel>Features &amp; status</SectionLabel>
            <h2 className="text-3xl font-bold">What was built, labelled honestly</h2>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-bright">
              <span>Status key:</span>
              {(Object.keys(STATUS_STYLE) as Status[]).map((k) => <StatusPill key={k} status={k} />)}
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {FEATURE_GROUPS.map((g) => (
                <div key={g.name} className="rounded-2xl border border-line bg-panel p-6">
                  <div className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">{g.name}</div>
                  <ul className="mt-4 space-y-5">
                    {g.items.map((it) => (
                      <li key={it.title}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-sm font-semibold">{it.title}</div>
                          <StatusPill status={it.status} />
                        </div>
                        <p className="mt-1.5 text-sm leading-6 text-muted-bright">{it.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-dim">{ROADMAP_NOTE}</p>
          </Container>
        </section>

        <section id="architecture" className="section-anchor py-20">
          <Container>
            <SectionLabel>System architecture</SectionLabel>
            <h2 className="text-3xl font-bold">Four clients, one booking backend</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">
              The shared Cloud Functions layer owns booking, availability, and pricing rules, so no client re-implements them.
            </p>
            <figure className="mt-8" aria-label="Architecture diagram: four client applications call shared Firebase Cloud Functions, which read and write Firestore and use Firebase Auth.">
              <div className="space-y-3">
                <div className="arch-tier">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Client applications</div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {CLIENTS.map((c) => (
                      <div key={c.name} className="arch-node flex flex-col items-center gap-1.5">
                        <c.icon size={16} className="text-cyan" aria-hidden="true" />
                        <span className="font-medium">{c.name}</span>
                        <span className="font-mono text-[10px] text-dim">{c.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="arch-arrow py-1">↓ every client calls the same functions</div>
                <div className="arch-tier">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Shared booking backend · Firebase Cloud Functions</div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="arch-node cyan">Availability &amp; slot rules</div>
                    <div className="arch-node cyan">Pricing rules</div>
                    <div className="arch-node cyan">Booking lifecycle</div>
                    <div className="arch-node cyan">Payment lifecycle</div>
                  </div>
                  <p className="mt-3 text-center font-mono text-[10px] text-dim">booking and payment state are modeled separately, then linked explicitly</p>
                </div>
                <div className="arch-arrow py-1">↓</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="arch-tier"><div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Identity</div><div className="arch-node">Firebase Auth</div></div>
                  <div className="arch-tier"><div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">Data</div><div className="arch-node">Firestore</div></div>
                </div>
              </div>
              <figcaption className="mt-4 text-xs text-dim">Architecture as described in the project record. Per-client feature depth is not itemized on this page.</figcaption>
            </figure>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-xs text-muted">{s}</span>
              ))}
            </div>
          </Container>
        </section>

        <section id="challenges" className="section-anchor border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <SectionLabel>Engineering challenges</SectionLabel>
            <h2 className="text-3xl font-bold">Decisions that kept four clients consistent</h2>
            <div className="mt-8 space-y-6">
              {[
                ...project.decisions.map((d) => ({ title: d.title, problem: d.problem, approach: d.decision, outcome: d.why })),
                ...CHALLENGES,
              ].map((d) => (
                <article key={d.title} className="rounded-2xl border border-line bg-panel p-7">
                  <h3 className="text-2xl font-semibold">{d.title}</h3>
                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <div><div className="font-mono text-xs text-cyan">PROBLEM</div><p className="mt-2 text-sm leading-6 text-muted">{d.problem}</p></div>
                    <div><div className="font-mono text-xs text-cyan">APPROACH</div><p className="mt-2 text-sm leading-6 text-muted">{d.approach}</p></div>
                    <div><div className="font-mono text-xs text-cyan">IMPACT</div><p className="mt-2 text-sm leading-6 text-muted">{d.outcome}</p></div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section id="results" className="section-anchor py-20">
          <Container>
            <SectionLabel>Results</SectionLabel>
            <h2 className="text-3xl font-bold">Verified milestones, no invented metrics</h2>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
              <ul className="space-y-3">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 rounded-xl border border-line bg-panel p-5 text-sm leading-6 text-muted-bright">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />{h}
                  </li>
                ))}
              </ul>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[.18em] text-dim">Delivered scope</div>
                <div className="mt-4 space-y-2.5">
                  {project.metrics.map((m) => <div key={m} className="text-lg font-semibold tracking-tight text-text/90">{m}</div>)}
                </div>
                <p className="mt-5 text-xs leading-5 text-dim">No traffic, revenue, or performance figures are claimed for this project.</p>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-white/5 py-16">
          <Container>
            <Link href="/#work" className="group flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-[.18em] text-dim">Keep exploring</div>
                <div className="mt-2 text-2xl font-bold sm:text-3xl">Back to selected work</div>
                <p className="mt-1 text-sm text-muted-bright">FINDXNY OS and Lalaba, the two other production case studies.</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan transition group-hover:gap-3">All work <ArrowUpRight size={16} /></span>
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
