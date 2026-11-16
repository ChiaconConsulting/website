import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { resources } from "@/lib/admin/resources";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ resource: string }>; searchParams: Promise<{ saved?: string; deleted?: string }> };

function cell(value: unknown, name: string) {
  if (name === "published") {
    return value ? (
      <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand-600">Published</span>
    ) : (
      <span className="rounded-full bg-amber/10 px-2.5 py-1 text-xs font-semibold text-amber">Draft</span>
    );
  }
  if (name === "logoType") return value ? "Uploaded" : "Text only";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return formatDate(value);
  if (value == null || value === "") return <span className="text-slate/60">None</span>;
  return String(value);
}

export default async function ResourceList({ params, searchParams }: Props) {
  const { resource: key } = await params;
  const { saved, deleted } = await searchParams;
  const resource = resources[key];
  if (!resource) notFound();

  // Select only the columns the list needs, so binary columns are never loaded here.
  const wanted = Array.from(new Set(["id", resource.titleField, ...(resource.hasSlug ? ["slug"] : []), ...resource.columns.map((c) => c.name)]));
  const selection = Object.fromEntries(wanted.map((name) => [name, resource.table[name]]));
  const rows = (await db.select(selection).from(resource.table).orderBy(...resource.orderBy)) as Record<string, unknown>[];

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">{resource.label}</h1>
          <p className="mt-2 max-w-xl text-slate">{resource.description}</p>
        </div>
        <Link href={`/admin/${key}/new`} className="btn-dark shrink-0"><Plus className="h-4 w-4" aria-hidden="true" />New {resource.singular}</Link>
      </div>

      {saved || deleted ? (
        <p role="status" className="mt-6 rounded-xl border border-brand/30 bg-brand/[0.07] px-4 py-3 text-sm font-medium text-brand-600">
          {saved ? "Saved. The website is updated." : "Deleted."}
        </p>
      ) : null}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-slate">
              {resource.columns.map((c) => (
                <th key={c.name} scope="col" className="px-5 py-3 font-semibold">{c.label}</th>
              ))}
              <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={String(row.id)} className="hover:bg-mist/60">
                {resource.columns.map((c, i) => (
                  <td key={c.name} className="max-w-xs px-5 py-3.5 align-middle">
                    {i === 0 ? (
                      <Link href={`/admin/${key}/${row.id}`} className="font-semibold text-ink hover:text-navy">{cell(row[c.name], c.name)}</Link>
                    ) : (
                      <span className="line-clamp-1 text-body">{cell(row[c.name], c.name)}</span>
                    )}
                  </td>
                ))}
                <td className="whitespace-nowrap px-5 py-3.5 text-right">
                  {resource.publicPath && row.published ? (
                    <Link href={resource.publicPath(row)} target="_blank" className="mr-4 inline-flex items-center gap-1 text-slate hover:text-navy">
                      View <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  ) : null}
                  <Link href={`/admin/${key}/${row.id}`} className="font-semibold text-navy">Edit</Link>
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr><td colSpan={resource.columns.length + 1} className="px-5 py-10 text-center text-slate">Nothing here yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
