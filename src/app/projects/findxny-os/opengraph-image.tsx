import { renderOg, ogSize } from "@/lib/og";

export const alt = "FINDXNY OS case study — offline-first POS platform";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Case study · POS & operations", title: "FINDXNY OS", summary: "Offline-first POS, payments, multi-tenant access, and hardware integration.", image: "projects/findxny-os/poster.jpg" });
}
