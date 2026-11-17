import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

type Db = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __chiaconDb?: Db };

// The connection is opened on first use, not when this file loads, so `next build`
// works on a machine (or Docker/Railway build step) that has no DATABASE_URL.
function connect(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  // `prepare: false` keeps this compatible with pooled connections (Neon, Supabase, PgBouncer).
  return drizzle(postgres(url, { max: 10, prepare: false }), { schema });
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const instance = (globalForDb.__chiaconDb ??= connect());
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
