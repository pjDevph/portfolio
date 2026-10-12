import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AutomationCaseStudy } from "@/components/automation-case-study";
import { automations } from "@/data/automations";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return automations.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = automations.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: a.name,
    description: a.summary,
    alternates: { canonical: `/automations/${a.slug}` },
    openGraph: { title: `${a.name} — Automation case study`, description: a.summary, type: "article", url: `/automations/${a.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const a = automations.find((x) => x.slug === slug);
  if (!a) notFound();
  return <AutomationCaseStudy automation={a} />;
}
