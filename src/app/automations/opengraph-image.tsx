import { renderOg, ogSize } from "@/lib/og";
import { automations } from "@/data/automations";

export const alt = "Automations — Prince John Gandollas";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Automations",
    title: "Automating the work around the product",
    summary: "AI and deterministic automations, documented by workflow, safeguards, and real status.",
    steps: automations.map((a) => a.name),
  });
}
