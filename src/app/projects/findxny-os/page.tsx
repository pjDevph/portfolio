import { FindxnyCaseStudy } from "@/components/findxny-case-study";
import { projects } from "@/data/projects";
export default function Page(){ const p = projects.find(x=>x.slug==="findxny-os")!; return <FindxnyCaseStudy project={p}/>; }
