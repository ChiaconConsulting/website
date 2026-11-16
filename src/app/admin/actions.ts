"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { APPLICATION_STATUSES, LEAD_STATUSES, resources } from "@/lib/admin/resources";
import { rateLimit } from "@/lib/ratelimit";
import { slugify } from "@/lib/utils";

export type AdminFormState = { message: string; errors?: Record<string, string>; email?: string };

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

// A valid hash of a random value, compared against when the email is unknown so that
// response time does not reveal which emails exist.
const DUMMY_HASH = "$2b$12$vHZoRHCKm0MOP27Dw8MR/eu.Oq5xdJQTeP6oGczhhGUoL.Tg9UlAa";

export async function login(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  if (!(await rateLimit("login", 8, 15 * 60 * 1000))) {
    return { message: "Too many attempts. Wait 15 minutes and try again." };
  }
  const email = str(formData.get("email")).toLowerCase();
  const password = str(formData.get("password"));
  const [user] = email
    ? await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1)
    : [];
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return { message: "Incorrect email or password.", email };

  await createSession({ id: user.id, email: user.email, name: user.name });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin();
  const current = str(formData.get("current"));
  const next = str(formData.get("next"));
  const confirm = str(formData.get("confirm"));
  if (next.length < 12) return { message: "Use at least 12 characters for the new password." };
  if (next !== confirm) return { message: "The new passwords do not match." };
  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, session.id)).limit(1);
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { message: "Current password is incorrect." };
  await db.update(schema.adminUsers).set({ passwordHash: await bcrypt.hash(next, 12) }).where(eq(schema.adminUsers.id, user.id));
  return { message: "Password updated." };
}

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function saveRecord(
  resourceKey: string,
  id: string | null,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const resource = resources[resourceKey];
  if (!resource) return { message: "Unknown content type." };

  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of resource.fields) {
    const raw = formData.get(field.name);
    switch (field.type) {
      case "bool":
        values[field.name] = raw === "on";
        break;
      case "number": {
        const n = Number(str(raw) || 0);
        values[field.name] = Number.isFinite(n) ? Math.trunc(n) : 0;
        break;
      }
      case "list":
        values[field.name] = str(raw).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        break;
      case "date": {
        const v = str(raw);
        values[field.name] = v ? new Date(`${v}T04:00:00Z`) : null;
        break;
      }
      case "image": {
        if (formData.get(`${field.name}__remove`) === "on") {
          values[`${field.name}Data`] = null;
          values[`${field.name}Type`] = null;
        } else if (raw instanceof File && raw.size > 0) {
          if (!IMAGE_TYPES.has(raw.type)) errors[field.name] = "Upload a PNG, JPG or WebP image.";
          else if (raw.size > 500 * 1024) errors[field.name] = "The image must be 500 KB or smaller.";
          else {
            values[`${field.name}Data`] = Buffer.from(await raw.arrayBuffer());
            values[`${field.name}Type`] = raw.type;
          }
        }
        break;
      }
      case "select": {
        const v = str(raw);
        values[field.name] = field.options?.includes(v) ? v : field.options?.[0];
        break;
      }
      default: {
        const v = str(raw);
        if (field.name === "slug") break;
        if (field.required && !v) errors[field.name] = `${field.label} is required.`;
        values[field.name] = v;
      }
    }
  }

  if (resource.hasSlug) {
    const slug = slugify(str(formData.get("slug")) || String(values[resource.titleField] ?? ""));
    if (!slug) errors.slug = "Enter a title or a URL slug.";
    values.slug = slug;
  }

  if (resourceKey === "posts" && values.published && !values.publishedAt) values.publishedAt = new Date();

  if (Object.keys(errors).length) return { message: "Please fix the highlighted fields.", errors };

  try {
    if (id) await db.update(resource.table).set(values).where(eq(resource.table.id, id));
    else await db.insert(resource.table).values(values);
  } catch (err) {
    // Postgres unique violation; the driver error may be wrapped, so check the cause as well.
    const e = err as { code?: string; cause?: { code?: string } };
    if (e?.code === "23505" || e?.cause?.code === "23505") {
      return { message: "That URL slug is already in use.", errors: { slug: "Choose a different slug." } };
    }
    console.error("[admin] save failed", err);
    return { message: "Could not save. Please try again." };
  }

  redirect(`/admin/${resourceKey}?saved=1`);
}

export async function deleteRecord(resourceKey: string, id: string) {
  await requireAdmin();
  const resource = resources[resourceKey];
  if (!resource) return;
  await db.delete(resource.table).where(eq(resource.table.id, id));
  redirect(`/admin/${resourceKey}?deleted=1`);
}

export async function setLeadStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = str(formData.get("status"));
  if (!LEAD_STATUSES.includes(status)) return;
  await db.update(schema.leads).set({ status }).where(eq(schema.leads.id, id));
  redirect("/admin/leads");
}

export async function deleteLead(id: string) {
  await requireAdmin();
  await db.delete(schema.leads).where(eq(schema.leads.id, id));
  redirect("/admin/leads");
}

export async function setApplicationStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = str(formData.get("status"));
  if (!APPLICATION_STATUSES.includes(status)) return;
  await db.update(schema.applications).set({ status }).where(eq(schema.applications.id, id));
  redirect("/admin/applications");
}

export async function deleteApplication(id: string) {
  await requireAdmin();
  await db.delete(schema.applications).where(eq(schema.applications.id, id));
  redirect("/admin/applications");
}
