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

/**
 * Real multi-screenshot composition for a project, used on case-study
 * hero sections in place of a single poster — shows actual product
 * surfaces instead of one marketing shot. Falls back to ProjectPoster
 * for any slug without a defined composition.
 */
export function ProductComposition({ slug, name, className = "" }: PosterProps) {
  if (slug === "findxny-os") {
    return (
      <div className={`grid grid-cols-3 gap-1.5 ${className}`}>
        <div className="relative col-span-2 aspect-[8/5] overflow-hidden bg-panel">
          <Image src="/projects/findxny-os/pos-order-offline.jpg" alt="FINDXNY OS POS order entry, offline mode" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 66vw" />
        </div>
        <div className="grid grid-rows-2 gap-1.5">
          <div className="relative aspect-[8/5] overflow-hidden bg-panel">
            <Image src="/projects/findxny-os/pos-dashboard.jpg" alt="FINDXNY OS owner dashboard" fill className="object-cover" sizes="(min-width: 1024px) 20vw, 33vw" />
          </div>
          <div className="relative aspect-[8/5] overflow-hidden bg-panel">
            <Image src="/projects/findxny-os/storefront.jpg" alt="Mugthemug storefront, powered by FINDXNY" fill className="object-cover" sizes="(min-width: 1024px) 20vw, 33vw" />
          </div>
        </div>
      </div>
    );
  }
  if (slug === "lalaba") {
    return (
      <div className={`grid grid-cols-2 gap-1.5 ${className}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-panel">
          <Image src="/projects/lalaba/customer-app.jpg" alt="Lalaba customer app" fill className="object-cover" sizes="(min-width: 1024px) 30vw, 50vw" />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-panel">
          <Image src="/projects/lalaba/partner-app.jpg" alt="Lalaba partner app" fill className="object-cover" sizes="(min-width: 1024px) 30vw, 50vw" />
        </div>
        <div className="relative col-span-2 aspect-[16/7] overflow-hidden bg-panel">
          <Image src="/projects/lalaba/admin-panel.jpg" alt="Lalaba admin panel" fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
        </div>
      </div>
    );
  }
  return <ProjectPoster slug={slug} name={name} className={className} rounded={false} />;
}

/**
 * Homepage "Selected work" card artwork — one dominant screenshot with a
 * smaller screenshot overlapping it as a floating card, instead of a grid
 * of equal-weight tiles or one oversized single image. Height is driven
 * by the parent grid (h-full), not by the source image's native ratio.
 */
export function HomeCardVisual({ slug, className = "" }: { slug: string; className?: string }) {
  if (slug === "findxny-os") {
    return (
      <div className={`relative h-full min-h-[320px] overflow-hidden bg-panel ${className}`}>
        <Image src="/projects/findxny-os/pos-order-offline.jpg" alt="FINDXNY OS POS order entry, offline mode" fill className="object-cover" sizes="(min-width: 1024px) 55vw, 100vw" />
        <div className="absolute bottom-4 right-4 w-[42%] max-w-[220px] overflow-hidden rounded-xl border border-white/15 shadow-soft">
          <div className="relative aspect-[8/5]">
            <Image src="/projects/findxny-os/pos-dashboard.jpg" alt="FINDXNY OS owner dashboard" fill className="object-cover" sizes="220px" />
          </div>
        </div>
      </div>
    );
  }
  if (slug === "lalaba") {
    return (
      <div className={`relative h-full min-h-[320px] overflow-hidden bg-panel ${className}`}>
        <Image src="/projects/lalaba/admin-panel.jpg" alt="Lalaba admin panel" fill className="object-cover" sizes="(min-width: 1024px) 55vw, 100vw" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="w-20 overflow-hidden rounded-lg border border-white/15 shadow-soft sm:w-24">
            <div className="relative aspect-[4/5]">
              <Image src="/projects/lalaba/customer-app.jpg" alt="Lalaba customer app" fill className="object-cover" sizes="96px" />
            </div>
          </div>
          <div className="w-20 overflow-hidden rounded-lg border border-white/15 shadow-soft sm:w-24">
            <div className="relative aspect-[4/5]">
              <Image src="/projects/lalaba/partner-app.jpg" alt="Lalaba partner app" fill className="object-cover" sizes="96px" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <ProjectPoster slug={slug} name={slug} className={`h-full min-h-[320px] ${className}`} rounded={false} />;
}
