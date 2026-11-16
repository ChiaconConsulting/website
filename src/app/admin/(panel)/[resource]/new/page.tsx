import Link from "next/link";
import { notFound } from "next/navigation";
import { RecordForm } from "@/components/admin/record-form";
import { resources } from "@/lib/admin/resources";

export default async function NewRecord({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: key } = await params;
  const resource = resources[key];
  if (!resource) notFound();
  return (
    <>
      <Link href={`/admin/${key}`} className="text-sm font-medium text-slate hover:text-navy">← {resource.label}</Link>
      <h1 className="mt-3 text-3xl font-semibold text-ink">New {resource.singular}</h1>
      <RecordForm resourceKey={key} id={null} fields={resource.fields} values={{}} />
    </>
  );
}
