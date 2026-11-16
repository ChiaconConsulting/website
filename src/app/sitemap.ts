import type { MetadataRoute } from "next";
import { getCaseStudies, getJobs, getPosts, getServices } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, studies, posts, jobs] = await Promise.all([getServices(), getCaseStudies(), getPosts(), getJobs()]);
  const u = (path: string, lastModified?: Date) => ({ url: `${site.url}${path}`, lastModified });
  return [
    u("/"),
    ...["/services", "/solutions", "/case-studies", "/insights", "/about", "/careers", "/contact", "/privacy"].map((p) => u(p)),
    ...services.map((s) => u(`/services/${s.slug}`, s.updatedAt)),
    ...studies.map((s) => u(`/case-studies/${s.slug}`, s.updatedAt)),
    ...posts.map((p) => u(`/insights/${p.slug}`, p.updatedAt)),
    ...jobs.map((j) => u(`/careers/${j.slug}`, j.updatedAt)),
  ];
}
