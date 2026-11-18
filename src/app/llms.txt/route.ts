import { getCaseStudies, getPosts, getServices } from "@/lib/data";
import { site } from "@/lib/site";

// llms.txt — a curated, plain-text map of the site for large language models and AI agents.
// Spec: https://llmstxt.org/. Served at /llms.txt and regenerated from the database on request.
export const dynamic = "force-dynamic";

export async function GET() {
  const [services, posts, studies] = await Promise.all([getServices(), getPosts(50), getCaseStudies()]);
  const u = (p: string) => `${site.url}${p}`;

  const lines: string[] = [
    `# ${site.legalName}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is an IT consulting and services firm founded in ${site.founded}, headquartered in Gurugram, India, with a UAE entity in Sharjah. We deliver Robotic Process Automation (RPA), Intelligent Process Automation, Microsoft Power Platform apps, Data & Analytics on Power BI and Microsoft Fabric, Quality Assurance automation, and auditable AI assistants for process-heavy enterprises.`,
    "",
    "Principles: numbers come from your systems of record (not the language model), every answer carries its source, low-confidence cases route to a person, and every release is tested like software and logged like finance.",
    "",
    "## Services",
    ...services.map((s) => `- [${s.title}](${u(`/services/${s.slug}`)}): ${s.summary}`),
    "",
    "## Insights",
    ...posts.map((p) => `- [${p.title}](${u(`/insights/${p.slug}`)}): ${p.excerpt}`),
    "",
    "## Case studies",
    ...studies.map((s) => `- [${s.title}](${u(`/case-studies/${s.slug}`)}): ${s.summary}`),
    "",
    "## About",
    `- [About ${site.name}](${u("/about")}): who we are, founders, certifications (ISO/IEC 27001, ISO 9001) and partnerships (UiPath Authorized Partner).`,
    `- [Solutions](${u("/solutions")}): pre-built Quick Deployable Bots and Power Platform apps.`,
    `- [Careers](${u("/careers")}): open roles.`,
    "",
    "## Contact",
    `- Email: ${site.email}`,
    `- Phone: ${site.phone}`,
    `- LinkedIn: ${site.linkedin}`,
    `- Contact form: ${u("/contact")}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate" },
  });
}
