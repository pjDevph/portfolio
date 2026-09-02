import Image from "next/image";
import { ImagePlus } from "lucide-react";

type PosterProps = { slug: string; name: string; className?: string; rounded?: boolean };

export function PosterPlaceholder({ slug, name, className = "", rounded = true }: PosterProps) {
  return (
    <div className={`flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 border border-dashed border-line bg-panel/60 text-center ${rounded ? "rounded-2xl" : ""} ${className}`}>
      <ImagePlus size={28} className="text-dim" />
      <div>
        <div className="font-mono text-xs uppercase tracking-[.16em] text-dim">Poster placeholder — {name}</div>
        <div className="mt-1 font-mono text-[11px] text-dim">/public/projects/{slug}/poster.jpg</div>
      </div>
    </div>
  );
}

const HAS_POSTER: Record<string, boolean> = {
  lalaba: true,
  "findxny-os": true,
  "athlete-central": true,
};

export function ProjectPoster({ slug, name, className = "", rounded = true }: PosterProps) {
  if (HAS_POSTER[slug]) {
    return (
      <div className={`relative aspect-[16/9] w-full overflow-hidden bg-panel ${rounded ? "rounded-2xl border border-line" : ""} ${className}`}>
        <Image src={`/projects/${slug}/poster.jpg`} alt={`${name} poster`} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
      </div>
    );
  }
  return <PosterPlaceholder slug={slug} name={name} className={className} rounded={rounded} />;
}
