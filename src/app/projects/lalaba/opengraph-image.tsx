import { renderOg, ogSize } from "@/lib/og";

export const alt = "Lalaba case study — multi-role laundry marketplace";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Case study · Marketplace", title: "Lalaba", summary: "Customer, partner, and admin apps on one shared backend.", image: "projects/lalaba/poster.jpg" });
}
