import { boolean, customType, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
});

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const adminUsers = pgTable("admin_users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: createdAt(),
});

export const posts = pgTable("posts", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull().default("AI"),
  author: text("author").notNull().default("Chiacon Consulting"),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const caseStudies = pgTable("case_studies", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  clientLabel: text("client_label").notNull(),
  industry: text("industry").notNull(),
  service: text("service").notNull(),
  summary: text("summary").notNull(),
  challenge: text("challenge").notNull(),
  approach: text("approach").notNull(),
  outcome: text("outcome").notNull(),
  highlights: text("highlights").array().notNull().default([]),
  stack: text("stack").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const services = pgTable("services", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  capabilities: text("capabilities").array().notNull().default([]),
  tools: text("tools").array().notNull().default([]),
  icon: text("icon").notNull().default("sparkles"),
  published: boolean("published").notNull().default(true),
  order: integer("order").notNull().default(0),
  updatedAt: updatedAt(),
});

export const clients = pgTable("clients", {
  id: id(),
  name: text("name").notNull(),
  logoData: bytea("logo_data"),
  logoType: text("logo_type"),
  published: boolean("published").notNull().default(false),
  order: integer("order").notNull().default(0),
});

export const jobs = pgTable("jobs", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull().default("Full-time"),
  experience: text("experience").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const applications = pgTable("applications", {
  id: id(),
  jobId: text("job_id").references(() => jobs.id, { onDelete: "set null" }),
  jobTitle: text("job_title").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  linkedin: text("linkedin"),
  note: text("note"),
  cvName: text("cv_name").notNull(),
  cvType: text("cv_type").notNull(),
  cvData: bytea("cv_data").notNull(),
  status: text("status").notNull().default("New"),
  createdAt: createdAt(),
});

export const leads = pgTable("leads", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  interest: text("interest"),
  message: text("message").notNull(),
  source: text("source").notNull().default("contact"),
  status: text("status").notNull().default("New"),
  createdAt: createdAt(),
});

export type Post = typeof posts.$inferSelect;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Lead = typeof leads.$inferSelect;
