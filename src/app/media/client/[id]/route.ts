import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db
    .select({ data: schema.clients.logoData, type: schema.clients.logoType })
    .from(schema.clients)
    .where(and(eq(schema.clients.id, id), eq(schema.clients.published, true)))
    .limit(1);
  if (!row?.data || !row.type || !ALLOWED.has(row.type)) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.type,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
