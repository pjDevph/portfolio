import { notFound } from "next/navigation";
import { renderOg, ogSize } from "@/lib/og";
import { automations } from "@/data/automations";

export const alt = "Automation case study";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = automations.find((x) => x.slug === slug);
  if (!a) notFound();
  return renderOg({
    eyebrow: `Automation · ${a.kind === "AI" ? "AI assistant" : "Reporting"}`,
    title: a.name,
    summary: a.summary.length > 110 ? a.summary.slice(0, a.summary.lastIndexOf(" ", 107)) + "…" : a.summary,
    steps: a.flow.map((s) => s.label),
  });
}
