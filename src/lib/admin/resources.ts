import { asc, desc, type SQL } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import { schema } from "@/lib/db";
import { iconNames } from "@/components/icons";

export type FieldType = "text" | "textarea" | "markdown" | "bool" | "list" | "number" | "date" | "select" | "image";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: string[];
  rows?: number;
};

export type Resource = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: PgTableWithColumns<any>;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  columns: Array<{ name: string; label: string }>;
  orderBy: SQL[];
  hasSlug: boolean;
  publicPath?: (row: Record<string, unknown>) => string;
  fields: Field[];
};

const slugField: Field = {
  name: "slug",
  label: "URL slug",
  type: "text",
  help: "Leave blank to generate from the title. Changing it later breaks existing links.",
};
const publishedField: Field = { name: "published", label: "Published (visible on the website)", type: "bool" };
const orderField: Field = { name: "order", label: "Display order", type: "number", help: "Lower numbers appear first." };

export const resources: Record<string, Resource> = {
  posts: {
    table: schema.posts,
    label: "Insights",
    singular: "article",
    description: "Blog articles shown under Insights.",
    titleField: "title",
    columns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "publishedAt", label: "Date" },
      { name: "published", label: "Status" },
    ],
    orderBy: [desc(schema.posts.publishedAt), desc(schema.posts.createdAt)],
    hasSlug: true,
    publicPath: (r) => `/insights/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      slugField,
      { name: "category", label: "Category", type: "text", required: true, help: "For example: Auditable AI, Intelligent Process Automation, Quality Assurance." },
      { name: "author", label: "Author", type: "text", required: true },
      { name: "excerpt", label: "Summary", type: "textarea", required: true, rows: 3, help: "One or two sentences. Shown on cards and in search results." },
      { name: "body", label: "Article", type: "markdown", required: true, rows: 22 },
      { name: "publishedAt", label: "Publish date", type: "date", help: "Defaults to today when first published." },
      publishedField,
    ],
  },
  "case-studies": {
    table: schema.caseStudies,
    label: "Case studies",
    singular: "case study",
    description: "Client work. Keep client names out unless you have written permission.",
    titleField: "title",
    columns: [
      { name: "title", label: "Title" },
      { name: "clientLabel", label: "Client" },
      { name: "service", label: "Practice" },
      { name: "featured", label: "Home" },
      { name: "published", label: "Status" },
    ],
    orderBy: [asc(schema.caseStudies.order), desc(schema.caseStudies.createdAt)],
    hasSlug: true,
    publicPath: (r) => `/case-studies/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      slugField,
      { name: "clientLabel", label: "Client description", type: "text", required: true, help: "Anonymised, for example: A global FMCG company." },
      { name: "industry", label: "Industry", type: "text", required: true },
      { name: "service", label: "Practice", type: "text", required: true, help: "Use the exact service title so the case study appears on that service page." },
      { name: "summary", label: "Summary", type: "textarea", required: true, rows: 3 },
      { name: "challenge", label: "The challenge", type: "markdown", required: true, rows: 8 },
      { name: "approach", label: "What we did", type: "markdown", required: true, rows: 10 },
      { name: "outcome", label: "The result", type: "markdown", required: true, rows: 6 },
      { name: "highlights", label: "At a glance", type: "list", help: "One per line. Up to three show on cards. Put approved metrics here." },
      { name: "stack", label: "Technology", type: "list", help: "One per line." },
      { name: "featured", label: "Feature on the homepage", type: "bool" },
      orderField,
      publishedField,
    ],
  },
  services: {
    table: schema.services,
    label: "Services",
    singular: "service",
    description: "Practice pages under Services.",
    titleField: "title",
    columns: [
      { name: "title", label: "Title" },
      { name: "tagline", label: "Tagline" },
      { name: "order", label: "Order" },
      { name: "published", label: "Status" },
    ],
    orderBy: [asc(schema.services.order), asc(schema.services.title)],
    hasSlug: true,
    publicPath: (r) => `/services/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      slugField,
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true, rows: 3 },
      { name: "body", label: "Page content", type: "markdown", required: true, rows: 18 },
      { name: "capabilities", label: "What we deliver", type: "list", help: "One per line." },
      { name: "tools", label: "Platforms and tools", type: "list", help: "One per line." },
      { name: "icon", label: "Icon", type: "select", options: iconNames },
      orderField,
      publishedField,
    ],
  },
  clients: {
    table: schema.clients,
    label: "Clients",
    singular: "client",
    description: "Names and logos in the homepage strip. Publish only where you have permission to show the name.",
    titleField: "name",
    columns: [
      { name: "name", label: "Name" },
      { name: "logoType", label: "Logo" },
      { name: "order", label: "Order" },
      { name: "published", label: "Status" },
    ],
    orderBy: [asc(schema.clients.order), asc(schema.clients.name)],
    hasSlug: false,
    fields: [
      { name: "name", label: "Client name", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image", help: "PNG, JPG or WebP, up to 500 KB. Transparent PNG works best. Without a logo the name is shown as text." },
      orderField,
      publishedField,
    ],
  },
  jobs: {
    table: schema.jobs,
    label: "Jobs",
    singular: "job",
    description: "Open roles on the Careers page.",
    titleField: "title",
    columns: [
      { name: "title", label: "Title" },
      { name: "department", label: "Department" },
      { name: "location", label: "Location" },
      { name: "published", label: "Status" },
    ],
    orderBy: [desc(schema.jobs.createdAt)],
    hasSlug: true,
    publicPath: (r) => `/careers/${r.slug}`,
    fields: [
      { name: "title", label: "Job title", type: "text", required: true },
      slugField,
      { name: "department", label: "Department", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: ["Full-time", "Contract", "Internship", "Part-time"] },
      { name: "experience", label: "Experience", type: "text", required: true, help: "For example: 3+ years." },
      { name: "summary", label: "Summary", type: "textarea", required: true, rows: 2 },
      { name: "description", label: "Description", type: "markdown", required: true, rows: 16 },
      publishedField,
    ],
  },
};

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Won", "Closed"];
export const APPLICATION_STATUSES = ["New", "Shortlisted", "Interview", "Offer", "Rejected"];
