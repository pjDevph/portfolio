import { Container, Footer, Header, SectionLabel } from "@/components/site";
import { Download } from "lucide-react";
import { RESUME, type ResumeRole } from "@/data/resume";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Résumé of Prince John Gandollas: Full-Stack Engineer with experience in multi-tenant POS, marketplace, booking, offline-first and payment systems.",
  alternates: { canonical: "/resume" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-t border-line py-8"><h2 className="text-xl font-semibold">{title}</h2>{children}</section>;
}

function RoleList({ items }: { items: ResumeRole[] }) {
  return (
    <div className="mt-4 space-y-4 text-sm text-muted">
      {items.map((r) => (
        <div key={r.title}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4"><strong className="text-text">{r.title} · {r.org}</strong><span className="font-mono text-xs text-dim">{r.period}</span></div>
          {r.text && <p className="mt-1 leading-6">{r.text}</p>}
        </div>
      ))}
    </div>
  );
}

export default function ResumePage() {
  const r = RESUME;
  return <><Header/><main className="py-16 sm:py-24"><Container><div className="mx-auto max-w-4xl">
    <SectionLabel>Resume</SectionLabel>
    <div className="pb-8"><div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold sm:text-5xl">{r.name}</h1>
        <p className="mt-2 text-lg text-muted">{r.title}</p>
        <p className="mt-3 text-sm text-muted">{r.location} · {r.phone} · {r.email}</p>
        <p className="mt-1 text-sm text-muted">{r.linkedin} · {r.github}</p>
      </div>
      <a href="/Prince_John_Gandollas_Resume.pdf" download className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-cyan/70 hover:text-cyan"><Download size={16}/> Download PDF</a>
    </div></div>
    <Section title="Professional Summary"><p className="mt-3 leading-7 text-muted">{r.summary}</p></Section>
    <Section title="Technical Skills">
      <div className="mt-4 grid gap-4 text-sm text-muted sm:grid-cols-2">
        {Object.entries(r.skills).map(([group, items]) => <p key={group}><strong className="text-text">{group}:</strong> {items.join(", ")}</p>)}
      </div>
    </Section>
    <Section title="Software Engineering Experience">
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4"><h3 className="text-base font-semibold text-text">{r.employer.title} · {r.employer.org}</h3><span className="font-mono text-xs text-dim">{r.employer.period}</span></div>
      <p className="mt-1 text-sm text-muted">{r.employer.text}</p>
      <div className="mt-5 space-y-6 border-l border-line pl-5 text-sm text-muted">
        {r.projects.map((p) => (
          <div key={p.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4"><h4 className="font-semibold text-text">{p.name}{p.client !== p.name && <span className="font-normal text-muted"> · client: {p.client}</span>}</h4><span className="font-mono text-xs text-dim">{p.period}</span></div>
            <p className="mt-1 font-mono text-xs text-dim">{p.stack}</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-6">{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        ))}
      </div>
    </Section>
    <Section title="Additional Experience"><RoleList items={r.additional}/></Section>
    <Section title="Education & Training"><RoleList items={r.education}/></Section>
  </div></Container></main><Footer/></>;
}
