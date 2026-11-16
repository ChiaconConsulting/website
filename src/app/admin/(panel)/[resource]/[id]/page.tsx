import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { RecordForm } from "@/components/admin/record-form";
import { db } from "@/lib/db";
import { resources } from "@/lib/admin/resources";

export default async function EditRecord({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource: key, id } = await params;
  const resource = resources[key];
  if (!resource) notFound();
  const [row] = (await db.select().from(resource.table).where(eq(resource.table.id, id)).limit(1)) as Record<string, unknown>[];
  if (!row) notFound();

  // Only plain, serialisable values go to the client form. Binary columns are reduced to a flag.
  const values: Record<string, string | boolean | number> = {};
  for (const f of resource.fields) {
    const v = row[f.name];
    if (f.type === "image") values[f.name] = Boolean(row[`${f.name}Type`]);
    else if (f.type === "list") values[f.name] = Array.isArray(v) ? v.join("\n") : "";
    else if (f.type === "date") values[f.name] = v instanceof Date ? v.toISOString().slice(0, 10) : "";
    else if (typeof v === "boolean" || typeof v === "number") values[f.name] = v;
    else values[f.name] = v == null ? "" : String(v);
  }

  return (
    <>
      <Link href={`/admin/${key}`} className="text-sm font-medium text-slate hover:text-navy">← {resource.label}</Link>
      <h1 className="mt-3 text-3xl font-semibold text-ink">Edit {resource.singular}</h1>
      <RecordForm
        resourceKey={key}
        id={id}
        fields={resource.fields}
        values={values}
        imageUrl={key === "clients" && row.logoType && row.published ? `/media/client/${id}` : undefined}
      />
    </>
  );
}
