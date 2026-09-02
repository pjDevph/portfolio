import { LalabaCaseStudy } from "@/components/lalaba-case-study";
import { projects } from "@/data/projects";
export default function Page(){ const p = projects.find(x=>x.slug==="lalaba")!; return <LalabaCaseStudy project={p}/>; }
