import "server-only";
import { headers } from "next/headers";

// In-memory sliding window. Good for a single instance; on serverless or multi-instance
// hosting, back this with Redis/Upstash or put the forms behind a WAF / Turnstile.
const hits = new Map<string, number[]>();

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function rateLimit(bucket: string, limit: number, windowMs: number) {
  const key = `${bucket}:${await clientIp()}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}
