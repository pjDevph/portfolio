import { Container, Header, Footer, SectionLabel } from "@/components/site";
import { CaseSubNav } from "@/components/case-subnav";
import { StatusPill, STATUS_STYLE, type Status } from "@/components/status-pill";
import { AssistantChat } from "@/components/assistant-chat";
import { ShotGallery } from "@/components/lightbox";
import { DocLink } from "@/components/doc-link";
import type { Automation } from "@/data/automations";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Zap } from "lucide-react";

export function AutomationCaseStudy({ automation: a }: { automation: Automation }) {
  const subnav = [["overview", "Overview"], ["workflow", "Workflow"], ...(a.screens ? [["screens", "Screens"]] : []), ...(a.capabilities ? [["capabilities", "Capabilities"]] : []), ...(a.demo ? [["demo", "Live demo"]] : []), ["safeguards", "Safeguards"], ["outcomes", "Outcomes"]];
  return (
    <>
      <Header />
      <main>
        <section className="grid-bg border-b border-white/5 py-20">
          <Container>
            <Link href="/automations" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
              <ArrowLeft size={15} />Back to automations
            </Link>
            <div className="mt-12 max-w-5xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="font-mono text-xs tracking-[.16em] text-cyan">{a.eyebrow}</div>
                <StatusPill status={a.status} />
              </div>
              <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">{a.name}</h1>
              <p className="mt-6 max-w-3xl text-xl leading-8 text-muted">{a.summary}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {a.demo && (
                  <a href="#demo" className="inline-flex items-center gap-2 rounded-full bg-text px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5">
                    Try it live <ArrowUpRight size={15} />
                  </a>
                )}
                <a href="#workflow" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:border-cyan/70 hover:text-cyan">See the workflow</a>
                <DocLink slug={a.slug} />
              </div>
              <div className="mt-8 grid gap-5 border-y border-line py-6 sm:grid-cols-3">
                <div><div className="font-mono text-xs text-dim">ROLE</div><div className="mt-1">{a.roleShort}</div></div>
                <div><div className="font-mono text-xs text-dim">BUILT</div><div className="mt-1">{a.built}</div></div>
                <div><div className="font-mono text-xs text-dim">STATUS</div><div className="mt-1">{a.statusNote}</div></div>
              </div>
            </div>
          </Container>
        </section>

        <CaseSubNav items={subnav} />

        <section id="overview" className="section-anchor py-20">
          <Container>
            <div className="font-mono text-xs uppercase tracking-[.18em] text-dim">The automation in 30 seconds</div>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {a.overview.map((c, i) => ({ n: String(i + 1).padStart(2, "0"), label: c.label, text: c.text })).map((s, i) => (
                <div key={s.n} className={`lg:pr-8 ${i > 0 ? "lg:border-l lg:border-white/5 lg:pl-8" : ""}`}>
                  <div className="font-mono text-sm text-cyan">{s.n}</div>
                  <div className="mt-2 text-lg font-semibold">{s.label}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-bright">{s.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 max-w-3xl text-sm leading-6 text-muted-bright"><span className="font-semibold text-text">My role:</span> {a.role}</p>
            {a.contributions && (
              <div className="mt-6 max-w-3xl">
                <div className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">What I built</div>
                <ul className="mt-3">
                  {a.contributions.map((c) => <li key={c} className="border-b border-white/5 py-2.5 text-sm leading-6 text-muted-bright last:border-b-0">{c}</li>)}
                </ul>
              </div>
            )}
            {a.evidence && <p className="mt-6 max-w-3xl text-xs leading-5 text-dim">{a.evidence}</p>}
          </Container>
        </section>

        <section id="workflow" className="section-anchor border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <SectionLabel>Workflow</SectionLabel>
            <h2 className="text-3xl font-bold">How it works, step by step</h2>
            {a.dataflow && (
              <figure className="mt-8" aria-label={`Data flow: ${a.dataflow.sources.join(", ")} feed ${a.dataflow.engine.join(", ")}, which produce ${a.dataflow.outputs.join(", ")}.`}>
                <div className="space-y-3">
                  {([["Sources", a.dataflow.sources, false], ["Automation engine", a.dataflow.engine, true], ["Outputs", a.dataflow.outputs, false]] as const).map(([title, nodes, accent], i) => (
                    <div key={title}>
                      {i > 0 && <div className="arch-arrow pb-3" aria-hidden="true">↓</div>}
                      <div className="arch-tier">
                        <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">{title}</div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {nodes.map((n) => <div key={n} className={`arch-node ${accent ? "cyan" : ""}`}>{n}</div>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </figure>
            )}
            <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {a.flow.map((s, i) => (
                <li key={s.label} className="arch-tier">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 font-mono text-[11px] text-cyan" aria-hidden="true">{i + 1}</span>
                    <span className="text-sm font-semibold">{s.label}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-bright">{s.detail}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-2">
              {a.stack.map((t) => <span key={t} className="rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-xs text-muted">{t}</span>)}
            </div>
          </Container>
        </section>

        {a.screens && (
          <section id="screens" className="section-anchor py-20">
            <Container>
              <SectionLabel>Screens</SectionLabel>
              <h2 className="text-3xl font-bold">The workbook it keeps up to date</h2>
              {a.screensNote && <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-bright">{a.screensNote}</p>}
              <ShotGallery ratio="aspect-[16/10]" className="mt-8 grid gap-4 sm:grid-cols-2" shots={a.screens} />
            </Container>
          </section>
        )}

        {a.capabilities && (
          <section id="capabilities" className="section-anchor py-20">
            <Container>
              <SectionLabel>Capabilities &amp; status</SectionLabel>
              <h2 className="text-3xl font-bold">What it does, labelled by status</h2>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-bright">
                <span>Status key:</span>
                {(Object.keys(STATUS_STYLE) as Status[]).map((k) => <StatusPill key={k} status={k} />)}
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {a.capabilities.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-line bg-panel p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-semibold">{c.title}</div>
                      <StatusPill status={c.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-bright">{c.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-dim">Only capabilities that are documented are listed.{!a.capabilities.some((c) => c.status === "planned") && " No planned work is documented, so none is shown."}</p>
            </Container>
          </section>
        )}

        {a.demo && (
          <section id="demo" className="section-anchor py-20">
            <Container>
              <SectionLabel>Live demo</SectionLabel>
              <h2 className="text-3xl font-bold">Ask it something</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">This is the same assistant as the floating chat. Try a scope question, such as &ldquo;what did Prince personally own on Lalaba?&rdquo;, or something it can&apos;t know, to see the hand-off.</p>
              <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-panel">
                <div className="flex items-center gap-2 border-b border-line px-4 py-3 text-sm font-semibold"><Zap size={15} className="text-cyan" aria-hidden="true" />Portfolio Assistant</div>
                <AssistantChat className="h-[32rem]" />
              </div>
            </Container>
          </section>
        )}

        <section id="safeguards" className="section-anchor border-y border-white/5 bg-panel/40 py-20">
          <Container>
            <SectionLabel>Safeguards &amp; exception handling</SectionLabel>
            <h2 className="text-3xl font-bold">What keeps it honest and contained</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {a.safeguards.map((s) => (
                <div key={s.title} className="rounded-2xl border border-line bg-panel p-6">
                  <div className="text-sm font-semibold">{s.title}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-bright">{s.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="outcomes" className="section-anchor py-20">
          <Container>
            <SectionLabel>Outcomes &amp; limits</SectionLabel>
            <h2 className="text-3xl font-bold">What exists, and what it can&apos;t do</h2>
            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Verified</div>
                <ul className="mt-4 space-y-3">
                  {a.outcomes.map((o) => <li key={o} className="rounded-xl border border-line bg-panel p-5 text-sm leading-6 text-muted-bright">{o}</li>)}
                </ul>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[.18em] text-dim">Known limits</div>
                <ul className="mt-4 space-y-3">
                  {a.limits.map((o) => <li key={o} className="rounded-xl border border-line bg-panel p-5 text-sm leading-6 text-muted-bright">{o}</li>)}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-white/5 py-16">
          <Container>
            <Link href="/#work" className="group flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-[.18em] text-dim">Keep exploring</div>
                <div className="mt-2 text-2xl font-bold sm:text-3xl">Software products</div>
                <p className="mt-1 text-sm text-muted-bright">FINDXNY OS, Lalaba, and Athlete Central.</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan transition group-hover:gap-3">View work <ArrowUpRight size={16} /></span>
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
