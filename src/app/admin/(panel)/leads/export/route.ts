import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { csvCell } from "@/lib/utils";

export async function GET() {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const leads = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));
  // Column names match Zoho CRM's Leads import so the file maps without manual work.
  const header = ["Last Name", "Email", "Company", "Phone", "Lead Source", "Lead Status", "Interest", "Description", "Created Time"];
  const lines = [
    header.map(csvCell).join(","),
    ...leads.map((l) =>
      [l.name, l.email, l.company, l.phone, `Website (${l.source})`, l.status, l.interest, l.message, l.createdAt.toISOString()].map(csvCell).join(","),
    ),
  ];
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="chiacon-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
