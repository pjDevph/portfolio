import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { automations } from "@/data/automations";
import { siteUrl } from "@/lib/site";
const base = siteUrl;
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: base, lastModified: new Date() }, ...projects.map(p=>({ url: `${base}/projects/${p.slug}`, lastModified: new Date() })), { url: `${base}/automations`, lastModified: new Date() }, ...automations.map(a=>({ url: `${base}/automations/${a.slug}`, lastModified: new Date() }))];
}
