import { desc } from "drizzle-orm";
import { Download } from "lucide-react";
import { deleteLead, setLeadStatus } from "@/app/admin/actions";
import { db, schema } from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/admin/resources";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const leads = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(500);
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Leads</h1>
          <p className="mt-2 text-slate">Enquiries from the website contact form. Export as CSV to import into Zoho CRM.</p>
        </div>
        {/* File download from a route handler, so a plain anchor is correct here. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/admin/leads/export" className="btn-outline shrink-0"><Download className="h-4 w-4" aria-hidden="true" />Export CSV</a>
      </div>

      <ul className="mt-8 space-y-4">
        {leads.map((l) => (
          <li key={l.id} className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-ink">{l.name}{l.company ? <span className="font-sans text-base font-normal text-slate"> · {l.company}</span> : null}</p>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <a href={`mailto:${l.email}`} className="text-navy hover:underline">{l.email}</a>
                  {l.phone ? <a href={`tel:${l.phone}`} className="text-navy hover:underline">{l.phone}</a> : null}
                  <span className="text-slate">{formatDate(l.createdAt)}</span>
                </p>
                {l.interest ? <p className="mt-3"><span className="chip">{l.interest}</span></p> : null}
              </div>
              <form action={setLeadStatus.bind(null, l.id)} className="flex shrink-0 items-center gap-2">
                <label className="sr-only" htmlFor={`status-${l.id}`}>Status</label>
                <select id={`status-${l.id}`} name="status" defaultValue={l.status} className="field !w-auto !py-2 text-sm">
                  {LEAD_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" className="btn-outline !px-4 !py-2">Update</button>
              </form>
            </div>
            <p className="mt-4 whitespace-pre-wrap rounded-xl bg-mist p-4 text-[0.95rem] leading-relaxed text-body">{l.message}</p>
            <form action={deleteLead.bind(null, l.id)} className="mt-3 text-right">
              <button type="submit" className="text-xs font-medium text-slate hover:text-red-700">Delete</button>
            </form>
          </li>
        ))}
        {!leads.length ? <li className="card p-10 text-center text-slate">No enquiries yet.</li> : null}
      </ul>
    </>
  );
}
