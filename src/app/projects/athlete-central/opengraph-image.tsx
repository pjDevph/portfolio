import { renderOg, ogSize } from "@/lib/og";

export const alt = "Athlete Central case study — sports booking platform";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Case study · Sports & booking", title: "Athlete Central", summary: "Multi-facility booking with shared scheduling and pricing.", image: "projects/athlete-central/poster.jpg" });
}
