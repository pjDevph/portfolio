import { renderOg, ogSize } from "@/lib/og";

export const alt = "Prince John Gandollas — Full-Stack Engineer";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Portfolio", title: "Prince John Gandollas", summary: "Production web, mobile, backend, and offline systems.", image: "projects/findxny-os/pos-order-offline.jpg" });
}
