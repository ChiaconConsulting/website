import { desc } from "drizzle-orm";
import { Download } from "lucide-react";
import { deleteApplication, setApplicationStatus } from "@/app/admin/actions";
import { db, schema } from "@/lib/db";
import { APPLICATION_STATUSES } from "@/lib/admin/resources";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Applications" };

export default async function ApplicationsPage() {
  const a = schema.applications;
  // The CV bytes are not selected here; they are streamed from the download route.
  const rows = await db
    .select({ id: a.id, jobTitle: a.jobTitle, name: a.name, email: a.email, phone: a.phone, linkedin: a.linkedin, note: a.note, cvName: a.cvName, status: a.status, createdAt: a.createdAt })
    .from(a)
    .orderBy(desc(a.createdAt))
    .limit(500);

  return (
    <>
      <h1 className="text-3xl font-semibold text-ink">Applications</h1>
      <p className="mt-2 text-slate">Job applications submitted through the Careers pages.</p>
      <ul className="mt-8 space-y-4">
        {rows.map((r) => (
          <li key={r.id} className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{r.jobTitle}</p>
                <p className="mt-1 font-display text-lg font-semibold text-ink">{r.name}</p>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <a href={`mailto:${r.email}`} className="text-navy hover:underline">{r.email}</a>
                  <a href={`tel:${r.phone}`} className="text-navy hover:underline">{r.phone}</a>
                  {r.linkedin?.startsWith("https://") ? <a href={r.linkedin} target="_blank" rel="noopener noreferrer" className="text-navy hover:underline">LinkedIn</a> : null}
                  <span className="text-slate">{formatDate(r.createdAt)}</span>
                </p>
              </div>
              <form action={setApplicationStatus.bind(null, r.id)} className="flex shrink-0 items-center gap-2">
                <label className="sr-only" htmlFor={`status-${r.id}`}>Status</label>
                <select id={`status-${r.id}`} name="status" defaultValue={r.status} className="field !w-auto !py-2 text-sm">
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" className="btn-outline !px-4 !py-2">Update</button>
              </form>
            </div>
            {r.note ? <p className="mt-4 whitespace-pre-wrap rounded-xl bg-mist p-4 text-[0.95rem] leading-relaxed text-body">{r.note}</p> : null}
            <div className="mt-4 flex items-center justify-between">
              <a href={`/admin/applications/${r.id}/cv`} className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
                <Download className="h-4 w-4" aria-hidden="true" /> {r.cvName}
              </a>
              <form action={deleteApplication.bind(null, r.id)}>
                <button type="submit" className="text-xs font-medium text-slate hover:text-red-700">Delete</button>
              </form>
            </div>
          </li>
        ))}
        {!rows.length ? <li className="card p-10 text-center text-slate">No applications yet.</li> : null}
      </ul>
    </>
  );
}
