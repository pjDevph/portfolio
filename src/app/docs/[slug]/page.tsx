import { notFound } from "next/navigation";
import manifest from "../../../../public/docs/manifest.json";
import type { Metadata } from "next";
import { DocumentView } from "@/components/document-view";
import { DOC_SLUGS, buildDoc, isDocSlug } from "@/data/docs";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ generated?: string }> };

export function generateStaticParams() {
  return DOC_SLUGS.map((slug) => ({ slug }));
}

// The PDF is the deliverable; this page exists so it can be rendered and printed. Keep it out of search results.
export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { slug } = await params;
  return { title: isDocSlug(slug) ? `${buildDoc(slug).title}: Documentation` : "Documentation", robots: { index: false, follow: false } };
}

export default async function DocPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!isDocSlug(slug)) notFound();
  const { generated } = await searchParams;
  // Size and page count of the downloadable PDF, if it has been generated.
  // Imported (so it is bundled): on Vercel, files under public/ are not readable from server code.
  const entry = (manifest as Record<string, { pages: number; kb: number; generated: string } | undefined>)[slug];
  const pdf = entry ? { pages: entry.pages, kb: entry.kb, generated: entry.generated } : undefined;
  return <DocumentView doc={buildDoc(slug)} generated={generated} pdf={pdf} />;
}
