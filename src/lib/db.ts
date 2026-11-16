import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> };

function client() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  // `prepare: false` keeps this compatible with pooled connections (Neon, Supabase, PgBouncer).
  return postgres(url, { max: 10, prepare: false });
}

const pg = globalForDb.pg ?? client();
if (process.env.NODE_ENV !== "production") globalForDb.pg = pg;

export const db = drizzle(pg, { schema });
export { schema };
