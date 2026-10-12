import Link from "next/link";
import { FileText } from "lucide-react";

/** Goes to the documentation PREVIEW page; the PDF is downloaded from there. */
export function DocLink({ slug, variant = "button" }: { slug: string; variant?: "button" | "inline" }) {
  if (variant === "inline") {
    return (
      <Link href={`/docs/${slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-bright transition hover:text-text">
        <FileText size={14} aria-hidden="true" />Documentation (PDF)
      </Link>
    );
  }
  return (
    <Link href={`/docs/${slug}`} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:border-cyan/70 hover:text-cyan">
      <FileText size={14} aria-hidden="true" />Documentation (PDF)
    </Link>
  );
}
