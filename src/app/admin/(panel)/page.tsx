import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function Dashboard() {
  const [[newLeads], [allLeads], [newApps], [livePosts], [draftPosts], [liveStudies], [openJobs], recent] = await Promise.all([
    db.select({ n: count() }).from(schema.leads).where(eq(schema.leads.status, "New")),
    db.select({ n: count() }).from(schema.leads),
    db.select({ n: count() }).from(schema.applications).where(eq(schema.applications.status, "New")),
    db.select({ n: count() }).from(schema.posts).where(eq(schema.posts.published, true)),
    db.select({ n: count() }).from(schema.posts).where(eq(schema.posts.published, false)),
    db.select({ n: count() }).from(schema.caseStudies).where(eq(schema.caseStudies.published, true)),
    db.select({ n: count() }).from(schema.jobs).where(eq(schema.jobs.published, true)),
    db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(5),
  ]);

  const tiles = [
    { label: "New leads", value: newLeads.n, sub: `${allLeads.n} in total`, href: "/admin/leads" },
    { label: "New applications", value: newApps.n, sub: `${openJobs.n} open roles`, href: "/admin/applications" },
    { label: "Published articles", value: livePosts.n, sub: `${draftPosts.n} drafts`, href: "/admin/posts" },
    { label: "Published case studies", value: liveStudies.n, sub: "On the website", href: "/admin/case-studies" },
  ];

  return (
    <>
      <h1 className="text-3xl font-semibold text-ink">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="card p-5 transition hover:border-navy/40">
            <p className="text-sm text-slate">{t.label}</p>
            <p className="mt-2 font-display text-4xl font-semibold text-navy">{t.value}</p>
            <p className="mt-1 text-xs text-slate">{t.sub}</p>
          </Link>
        ))}
      </div>

      <div className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">Latest leads</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-navy">View all</Link>
        </div>
        {recent.length ? (
          <ul className="divide-y divide-line">
            {recent.map((l) => (
              <li key={l.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{l.name}{l.company ? <span className="font-normal text-slate"> · {l.company}</span> : null}</p>
                  <p className="truncate text-sm text-slate">{l.message}</p>
                </div>
                <p className="shrink-0 text-xs text-slate">{formatDate(l.createdAt)} · {l.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-sm text-slate">No enquiries yet. They will appear here as soon as someone submits the contact form.</p>
        )}
      </div>
    </>
  );
}
