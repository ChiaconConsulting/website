import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db, schema } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  const a = schema.applications;
  const [row] = await db.select({ name: a.cvName, type: a.cvType, data: a.cvData }).from(a).where(eq(a.id, id)).limit(1);
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.type,
      // Always download; never render an uploaded file inside the admin origin.
      "Content-Disposition": `attachment; filename="${row.name.replace(/["\\\r\n]/g, "_")}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
