import { AthleteCentralCaseStudy } from "@/components/athlete-central-case-study";
import type { Metadata } from "next";
import { projects } from "@/data/projects";

const project = projects.find((x) => x.slug === "athlete-central")!;
export const metadata: Metadata = {
  title: project.name,
  description: project.summary,
  alternates: { canonical: "/projects/athlete-central" },
  openGraph: { title: `${project.name} — Case study`, description: project.summary, type: "article", url: "/projects/athlete-central" },
};
export default function Page(){ const p = projects.find(x=>x.slug==="athlete-central")!; return <AthleteCentralCaseStudy project={p}/>; }
