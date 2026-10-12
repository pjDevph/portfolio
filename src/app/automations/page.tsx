import type { Metadata } from "next";
import { Container, Header, Footer, SectionLabel } from "@/components/site";
import { AutomationCard } from "@/components/automation-card";
import { automations } from "@/data/automations";

export const metadata: Metadata = {
  title: "Automations",
  description: "Automation case studies: an AI portfolio assistant and a POS-to-Google-Sheets reporting pipeline, each documented with its workflow, safeguards, and honest status.",
  alternates: { canonical: "/automations" },
  openGraph: { title: "Automations — Prince John Gandollas", description: "AI and deterministic automations, documented by workflow, safeguards, and real status.", type: "website", url: "/automations" },
};

export default function AutomationsIndex() {
  const ai = automations.filter((a) => a.kind === "AI");
  const det = automations.filter((a) => a.kind === "Deterministic");
  const groups = [
    { title: "Deterministic automation", note: "Scheduled, rule-based data pipelines: the same input always gives the same output.", items: det },
    { title: "AI automation", note: "LLM-powered workflows with guardrails, grounding, and a human hand-off.", items: ai },
  ].filter((g) => g.items.length > 0);
  return (
    <>
      <Header />
      <main>
        <section className="grid-bg border-b border-white/5 py-20">
          <Container>
            <SectionLabel>Automations</SectionLabel>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">Automating the work around the product.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Each case study documents the trigger, workflow, safeguards, limits, and what is actually implemented, with no invented savings or adoption numbers.</p>
          </Container>
        </section>
        <section className="py-16 sm:py-20">
          <Container className="space-y-16">
            {groups.map((g) => (
              <div key={g.title}>
                <h2 className="text-2xl font-bold tracking-tight">{g.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-bright">{g.note}</p>
                <div className="mt-6 space-y-6">
                  {g.items.map((a) => <AutomationCard key={a.slug} a={a} />)}
                </div>
              </div>
            ))}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
