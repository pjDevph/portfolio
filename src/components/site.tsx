import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Download,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { projects } from "@/data/projects";
import { HomeCardVisual } from "@/components/poster-placeholder";
import { ProductCarousel } from "@/components/product-carousel";
import { LALABA_SLIDES } from "@/data/lalaba-slides";

export const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>
);

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/88 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight" aria-label="Prince John Gandollas home">
          PJ<span className="text-cyan">.</span>
        </Link>
        <nav className="hidden gap-7 text-sm text-muted md:flex" aria-label="Primary navigation">
          <Link href="/#work" className="nav-link">Work</Link>
          <Link href="/#capabilities" className="nav-link">Capabilities</Link>
          <Link href="/#experience" className="nav-link">Experience</Link>
          <Link href="/#contact" className="nav-link">Contact</Link>
        </nav>
        <Link href="/resume" className="rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-cyan/70 hover:text-cyan">
          Resume
        </Link>
      </Container>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 text-sm text-muted">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-semibold text-text">Prince John Gandollas</span>
          <br />
          Full-Stack Engineer
        </div>
        <div className="flex flex-wrap gap-5">
          <a className="hover:text-text" href="https://github.com/pjDevph" target="_blank" rel="noreferrer">GitHub</a>
          <a className="hover:text-text" href="https://linkedin.com/in/pjdevph" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="hover:text-text" href="mailto:pgandollas@gmail.com">Email</a>
        </div>
        <div>© 2026 Prince John Gandollas</div>
      </Container>
    </footer>
  );
}

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 font-mono text-xs uppercase tracking-[.2em] text-cyan">{children}</div>
);

function HeroSystemVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,.12),transparent_62%)] blur-2xl" />
      <div className="rounded-3xl border border-line bg-panel/90 p-8 shadow-soft sm:p-10">
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex gap-2.5">
            <div className="flow-tier-chip">Web</div>
            <div className="flow-tier-chip">Mobile</div>
          </div>
          <span className="flow-connector" />
          <div className="flow-tier-chip flow-tier-chip--accent">API</div>
          <span className="flow-connector" />
          <div className="flow-tier-chip">Data + Auth</div>
          <span className="flow-connector" />
          <div className="flex flex-wrap justify-center gap-2.5">
            <div className="flow-tier-chip flow-tier-chip--small">Payments</div>
            <div className="flow-tier-chip flow-tier-chip--small">Offline</div>
            <div className="flow-tier-chip flow-tier-chip--small">POS</div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-5 text-center font-mono text-[10px] uppercase tracking-[.18em] text-dim">
          Full-stack product systems
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="grid-bg border-b border-white/5 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3 py-1.5 text-xs font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success" />Available for engineering opportunities
            </div>
            <h1 className="max-w-4xl text-5xl font-bold tracking-[-.045em] sm:text-6xl lg:text-7xl xl:text-[5.35rem] xl:leading-[.95]">
              Prince John Gandollas
            </h1>
            <p className="mt-6 max-w-3xl text-2xl font-medium leading-[1.12] text-text/95 sm:text-3xl lg:text-[2.05rem]">
              Full-Stack Engineer building production web, mobile, backend, and offline systems.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-bright sm:text-lg">
              I build reliable product systems across web, mobile, and backend — with experience in offline POS, payments, multi-tenant architecture, and operational software.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#work" className="inline-flex items-center gap-2 rounded-full bg-text px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:opacity-95">
                View selected work <ArrowUpRight size={16} />
              </a>
              <a href="/Prince_John_Gandollas_Resume.pdf" download className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-cyan/70 hover:text-cyan">
                <Download size={16} /> Download résumé
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-bright">
              <a className="flex items-center gap-2 hover:text-text" href="mailto:pgandollas@gmail.com"><Mail size={16} />Email</a>
              <a className="flex items-center gap-2 hover:text-text" href="https://github.com/pjDevph" target="_blank" rel="noreferrer"><Github size={16} />GitHub</a>
              <a className="flex items-center gap-2 hover:text-text" href="https://linkedin.com/in/pjdevph" target="_blank" rel="noreferrer"><Linkedin size={16} />LinkedIn</a>
              <span className="flex items-center gap-2"><MapPin size={16} />Binangonan, Rizal · Philippines</span>
            </div>
          </div>
          <HeroSystemVisual />
        </div>
      </Container>
    </section>
  );
}

export function Snapshot() {
  const items = [
    ["3", "Production platforms"],
    ["114", "Edge Functions on FINDXNY OS"],
    ["119", "Database migrations"],
    ["Web · Mobile · POS", "Plus payments & hardware"],
  ];
  return (
    <section className="border-b border-white/5 bg-ink/40">
      <Container className="pt-5">
        <div className="font-mono text-[10px] uppercase tracking-[.18em] text-dim">Production footprint</div>
      </Container>
      <Container className="grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([a, b], index) => (
          <div key={a} className={`py-6 sm:px-6 lg:py-7 ${index > 0 ? "sm:border-l sm:border-white/5" : ""} ${index === 2 ? "sm:border-l-0 lg:border-l" : ""}`}>
            <div className="text-xl font-semibold tracking-tight">{a}</div>
            <div className="mt-1 text-sm text-muted-bright">{b}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}

export function SelectedWork() {
  const featured = projects.filter((p) => p.slug !== "athlete-central");
  const additional = projects.filter((p) => p.slug === "athlete-central");
  return (
    <section id="work" className="section-anchor py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionLabel>Selected work</SectionLabel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Production systems, not demo projects.</h2>
          <p className="max-w-xl text-sm leading-6 text-muted-bright lg:text-right">Each project highlights the operating problem, system boundaries, and engineering decisions—not just the framework list.</p>
        </div>
        <div className="mt-14 space-y-16 sm:mt-16 sm:space-y-[4.5rem]">
          {featured.map((p, i) => {
            const isFeatured = i === 0;
            const textBlock = (
              <div className="flex flex-col justify-center p-7 sm:p-9 lg:h-full lg:p-12 xl:p-14">
                <div className="font-mono text-xs tracking-[.16em] text-cyan">{p.index} / {p.eyebrow}</div>
                <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{p.name}</h3>
                <p className="mt-4 max-w-2xl leading-7 text-muted-bright">{p.summary}</p>
                {p.ownership && (
                  <div className="mt-6">
                    <div className="font-mono text-[10px] uppercase tracking-[.18em] text-dim">My ownership</div>
                    <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                      {p.ownership.map((o) => (
                        <div key={o} className="flex items-baseline gap-2 text-sm text-muted-bright">
                          <span className="text-dim">↳</span>{o}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-8">
                  <Link className="inline-flex items-center gap-2 text-sm font-semibold text-cyan transition group-hover:gap-3" href={`/projects/${p.slug}`}>Explore case study <ArrowRight size={16} /></Link>
                </div>
              </div>
            );
            const visual = p.slug === "lalaba" ? (
              <div className="flex items-center bg-panel2/40 p-4 sm:p-6 lg:h-full">
                <ProductCarousel slides={LALABA_SLIDES} compact autoplaySeconds={5} className="w-full" />
              </div>
            ) : (
              <HomeCardVisual slug={p.slug} className="lg:h-full" />
            );
            return (
              <article key={p.slug} className="group overflow-hidden rounded-2xl border border-line/60 bg-panel shadow-soft transition duration-300 hover:-translate-y-1 hover:border-slate-500/60">
                {isFeatured && (
                  <div className="border-b border-line/60 bg-cyan/5 px-7 py-2.5 font-mono text-[10px] uppercase tracking-[.18em] text-cyan sm:px-9 lg:px-10">
                    Featured case study
                  </div>
                )}
                <div className={`grid lg:grid-cols-[1fr_1.5fr] ${isFeatured ? "lg:h-[620px]" : "lg:h-[580px]"}`}>
                  {textBlock}
                  {visual}
                </div>
              </article>
            );
          })}
        </div>

        {additional.length > 0 && (
          <div className="mt-14">
            <div className="font-mono text-xs uppercase tracking-[.18em] text-dim">Additional engineering work</div>
            <div className="mt-4 space-y-3">
              {additional.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="group flex flex-col gap-2 rounded-2xl border border-line bg-panel/60 p-5 transition hover:border-slate-500/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <div>
                    <div className="text-base font-semibold">{p.name}</div>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-muted-bright">{p.summary}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan transition group-hover:gap-3">View case study <ArrowRight size={16} /></span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

export function Capabilities() {
  const groups = [
    { name: "Product Engineering", statement: "Web and mobile interfaces built around actual operational workflows, not demo UI.", tech: ["Next.js", "React Native", "Expo"] },
    { name: "Backend & Data", statement: "APIs, data boundaries, and server-authoritative business rules — clients never compute what matters.", tech: ["NestJS", "PostgreSQL", "MongoDB"] },
    { name: "Reliability", statement: "Offline operation, idempotency, and payment-safe transaction processing under real network failure.", tech: ["SQLite", "Webhooks", "RLS"] },
    { name: "Hardware & Delivery", statement: "Deployment pipelines and physical POS integration, from EAS builds to thermal printers.", tech: ["EAS", "Vercel", "ESC/POS"] },
  ];
  return (
    <section id="capabilities" className="section-anchor border-y border-white/5 bg-panel/40 py-20 sm:py-24">
      <Container>
        <SectionLabel>Engineering capabilities</SectionLabel>
        <div className="mb-8 grid gap-4 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Capabilities shaped by production constraints.</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-bright lg:justify-self-end">Focused on full-stack delivery, data boundaries, offline reliability, and operational integrations across web and mobile clients.</p>
        </div>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.name} className="border-t border-white/5 pt-5">
              <h3 className="text-xl font-semibold">{g.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-bright">{g.statement}</p>
              <div className="mt-4 font-mono text-xs text-dim">{g.tech.join(" · ")}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Experience() {
  const items = [
    {
      date: "May 2025 – Jul 2026",
      org: "FINDXNY",
      role: "Junior Full-Stack Engineer",
      projects: [
        { name: "FINDXNY OS", period: "May 2026 – Jul 2026" },
        { name: "Lalaba", period: "Oct 2025 – Aug 2026" },
        { name: "Athlete Central", period: "May 2025 – Sept 2025" },
      ],
    },
    { date: "Apr 2021 – Apr 2025", org: "Department of Education", role: "Special Science Teacher I", projects: null },
    { date: "Dec 2019 – Mar 2021", org: "Iraseth Pharma Inc.", role: "Biomedical Engineer", projects: null },
  ];
  return (
    <section id="experience" className="section-anchor py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionLabel>Experience</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
          <div>
            <h2 className="max-w-md text-4xl font-bold tracking-tight">Software, teaching, and engineering troubleshooting.</h2>
            <p className="mt-5 max-w-lg leading-7 text-muted-bright">My background spans production software, electronics, technical instruction, and biomedical equipment—useful experience for understanding systems, failure modes, and technical communication.</p>
          </div>
          <div className="border-l border-line">
            {items.map((item) => (
              <div key={item.org} className="relative border-b border-line py-5 pl-7 last:border-b-0">
                <span className="absolute -left-[5px] top-7 h-2.5 w-2.5 rounded-full bg-cyan" />
                <div className="font-mono text-xs text-dim">{item.date}</div>
                <div className="mt-1 text-lg font-semibold">{item.org}</div>
                <div className="text-sm text-muted-bright">{item.role}</div>
                {item.projects && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.projects.map((p) => (
                      <span key={p.name} className="rounded-full border border-line bg-panel2 px-3 py-1 font-mono text-xs text-muted-bright" title={p.period}>{p.name}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section-anchor border-t border-white/5 py-20 sm:py-24">
      <Container>
        <div className="grid gap-8 rounded-3xl border border-line bg-panel p-7 sm:p-9 lg:grid-cols-[1.35fr_.65fr] lg:p-10">
          <div>
            <SectionLabel>Contact</SectionLabel>
            <h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Open to Full-Stack, Backend, and Product Engineering opportunities.</h2>
            <p className="mt-4 max-w-2xl text-muted-bright">For engineering roles, project discussions, or technical collaboration, email is the fastest way to reach me.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="mailto:pgandollas@gmail.com?subject=Engineering%20Opportunity" className="inline-flex items-center gap-2 rounded-full bg-text px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5"><Mail size={16} />Email Prince</a>
              <a href="https://linkedin.com/in/pjdevph" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold transition hover:border-cyan/70 hover:text-cyan">LinkedIn <ExternalLink size={15} /></a>
              <a href="https://github.com/pjDevph" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold transition hover:border-cyan/70 hover:text-cyan">GitHub <ExternalLink size={15} /></a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 lg:self-end">
            <div className="font-mono text-[11px] uppercase tracking-[.16em] text-dim">Availability</div>
            <div className="mt-4 space-y-4 text-sm">
              <div><div className="text-dim">Location</div><div className="mt-1 text-muted-bright">Binangonan, Rizal, Philippines</div></div>
              <div><div className="text-dim">Preferred contact</div><div className="mt-1 text-muted-bright">Email · LinkedIn</div></div>
              <div><div className="text-dim">Focus</div><div className="mt-1 text-muted-bright">Full-Stack · Backend · Product Engineering</div></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
