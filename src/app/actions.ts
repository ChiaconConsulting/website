"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { notify } from "@/lib/mail";
import { rateLimit } from "@/lib/ratelimit";

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  /** Echoed back on a validation error so the form keeps what the visitor typed. */
  values?: Record<string, string>;
};

function echo(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, clean(formData.get(k))]));
}

const clean = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const leadSchema = z.object({
  name: z.string().min(2, "Enter your name").max(120),
  email: z.string().email("Enter a valid work email").max(200),
  company: z.string().max(160).optional(),
  phone: z.string().max(40).optional(),
  interest: z.string().max(80).optional(),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)").max(4000),
  source: z.string().max(60).optional(),
});

export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: real users never fill this hidden field.
  if (clean(formData.get("website"))) return { ok: true, message: "Thank you. We will be in touch shortly." };

  if (!(await rateLimit("lead", 5, 10 * 60 * 1000))) {
    return { ok: false, message: "Too many requests. Please try again in a few minutes or email us directly." };
  }

  const parsed = leadSchema.safeParse({
    name: clean(formData.get("name")),
    email: clean(formData.get("email")),
    company: clean(formData.get("company")) || undefined,
    phone: clean(formData.get("phone")) || undefined,
    interest: clean(formData.get("interest")) || undefined,
    message: clean(formData.get("message")),
    source: clean(formData.get("source")) || undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: fieldErrors(parsed.error),
      values: echo(formData, ["name", "email", "company", "phone", "interest", "message"]),
    };
  }

  const lead = parsed.data;
  try {
    await db.insert(schema.leads).values({ ...lead, source: lead.source ?? "contact" });
  } catch (err) {
    console.error("[lead] save failed", err);
    return { ok: false, message: "We could not send your message. Please email contactus@chiacon.com." };
  }

  await notify(process.env.LEADS_NOTIFY_TO, `New website enquiry: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`, [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Phone", lead.phone],
    ["Interest", lead.interest],
    ["Source", lead.source],
    ["Message", lead.message],
  ]);

  return { ok: true, message: "Thank you. We have your message and will reply within one business day." };
}

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const applicationSchema = z.object({
  name: z.string().min(2, "Enter your name").max(120),
  email: z.string().email("Enter a valid email").max(200),
  phone: z.string().min(7, "Enter a phone number").max(40),
  linkedin: z.string().url("Enter a full URL, starting with https://").max(300).optional(),
  note: z.string().max(3000).optional(),
});

export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  if (clean(formData.get("website"))) return { ok: true, message: "Thank you. Your application has been received." };

  if (!(await rateLimit("application", 4, 30 * 60 * 1000))) {
    return { ok: false, message: "Too many applications from this connection. Please try again later." };
  }

  const parsed = applicationSchema.safeParse({
    name: clean(formData.get("name")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone")),
    linkedin: clean(formData.get("linkedin")) || undefined,
    note: clean(formData.get("note")) || undefined,
  });
  const errors = parsed.success ? {} : fieldErrors(parsed.error);

  const cv = formData.get("cv");
  let cvType = "";
  if (!(cv instanceof File) || cv.size === 0) {
    errors.cv = "Attach your CV";
  } else {
    const ext = cv.name.split(".").pop()?.toLowerCase() ?? "";
    cvType = CV_TYPES[ext] ?? "";
    if (!cvType) errors.cv = "Upload a PDF, DOC or DOCX file";
    else if (cv.size > MAX_CV_BYTES) errors.cv = "The file must be 5 MB or smaller";
  }

  if (!parsed.success || Object.keys(errors).length) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors,
      values: echo(formData, ["name", "email", "phone", "linkedin", "note"]),
    };
  }

  const jobId = clean(formData.get("jobId"));
  const job = jobId
    ? (await db.select().from(schema.jobs).where(eq(schema.jobs.id, jobId)).limit(1))[0]
    : undefined;
  const file = cv as File;
  const data = parsed.data;

  try {
    await db.insert(schema.applications).values({
      ...data,
      jobId: job?.id ?? null,
      jobTitle: job?.title ?? "General application",
      cvName: file.name.replace(/[^\w.\- ()]/g, "_").slice(0, 150),
      cvType,
      cvData: Buffer.from(await file.arrayBuffer()),
    });
  } catch (err) {
    console.error("[application] save failed", err);
    return { ok: false, message: "We could not submit your application. Please email your CV to TeamHP@chiacon.com." };
  }

  await notify(process.env.CAREERS_NOTIFY_TO, `New application: ${data.name} for ${job?.title ?? "General application"}`, [
    ["Role", job?.title ?? "General application"],
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["LinkedIn", data.linkedin],
    ["Note", data.note],
    ["CV", "Download from the admin panel: /admin/applications"],
  ]);

  return { ok: true, message: "Thank you. Your application is with our talent team, who will contact you if there is a match." };
}
