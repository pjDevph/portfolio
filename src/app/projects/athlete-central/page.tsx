import { ProjectPage } from "@/components/project-page";
import { projects } from "@/data/projects";
export default function Page(){ const p = projects.find(x=>x.slug==="athlete-central")!; return <ProjectPage project={p}/>; }
