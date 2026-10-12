import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { StatusPill } from "@/components/status-pill";
import { DocLink } from "@/components/doc-link";
import type { Automation } from "@/data/automations";

export function AutomationCard({ a }: { a: Automation }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line/60 bg-panel shadow-soft">
      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        <div className="p-7 sm:p-9 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="font-mono text-xs tracking-[.16em] text-cyan">{a.eyebrow}</div>
            <StatusPill status={a.status} />
          </div>
          <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{a.name}</h3>
          <p className="mt-4 leading-7 text-muted-bright">{a.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {a.stack.slice(0, 4).map((t) => <span key={t} className="rounded-full border border-line bg-panel2 px-3 py-1 font-mono text-[11px] text-muted-bright">{t}</span>)}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-cyan transition hover:gap-3" href={`/automations/${a.slug}`}>View case study <ArrowRight size={16} /></Link>
            <DocLink slug={a.slug} variant="inline" />
            {a.demo && <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted-bright transition hover:text-text" href={`/automations/${a.slug}#demo`}>Try it live <ArrowUpRight size={15} /></Link>}
          </div>
        </div>
        <div className="border-t border-line/60 bg-panel2/40 p-7 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
          <div className="font-mono text-[10px] uppercase tracking-[.18em] text-dim">Workflow</div>
          <ol className="mt-4 space-y-2.5">
            {a.flow.map((s, i) => (
              <li key={s.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3.5 py-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 font-mono text-[11px] text-cyan" aria-hidden="true">{i + 1}</span>
                <span className="text-sm font-medium">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
