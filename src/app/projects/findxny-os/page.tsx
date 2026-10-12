import { FindxnyCaseStudy } from "@/components/findxny-case-study";
import type { Metadata } from "next";
import { projects } from "@/data/projects";

const project = projects.find((x) => x.slug === "findxny-os")!;
export const metadata: Metadata = {
  title: project.name,
  description: project.summary,
  alternates: { canonical: "/projects/findxny-os" },
  openGraph: { title: `${project.name} — Case study`, description: project.summary, type: "article", url: "/projects/findxny-os" },
};
export default function Page(){ const p = projects.find(x=>x.slug==="findxny-os")!; return <FindxnyCaseStudy project={p}/>; }
