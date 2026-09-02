import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
const base = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: base, lastModified: new Date() }, ...projects.map(p=>({ url: `${base}/projects/${p.slug}`, lastModified: new Date() }))];
}
