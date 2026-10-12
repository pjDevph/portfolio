import { LalabaCaseStudy } from "@/components/lalaba-case-study";
import type { Metadata } from "next";
import { projects } from "@/data/projects";

const project = projects.find((x) => x.slug === "lalaba")!;
export const metadata: Metadata = {
  title: project.name,
  description: project.summary,
  alternates: { canonical: "/projects/lalaba" },
  openGraph: { title: `${project.name} — Case study`, description: project.summary, type: "article", url: "/projects/lalaba" },
};
export default function Page(){ const p = projects.find(x=>x.slug==="lalaba")!; return <LalabaCaseStudy project={p}/>; }
