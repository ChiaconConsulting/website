import "server-only";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const { posts, caseStudies, services, clients, jobs } = schema;

export const getServices = () =>
  db.select().from(services).where(eq(services.published, true)).orderBy(asc(services.order), asc(services.title));

export const getService = async (slug: string) =>
  (await db.select().from(services).where(and(eq(services.slug, slug), eq(services.published, true))).limit(1))[0];

export const getCaseStudies = (opts: { featured?: boolean; limit?: number } = {}) =>
  db
    .select()
    .from(caseStudies)
    .where(opts.featured ? and(eq(caseStudies.published, true), eq(caseStudies.featured, true)) : eq(caseStudies.published, true))
    .orderBy(asc(caseStudies.order), desc(caseStudies.createdAt))
    .limit(opts.limit ?? 100);

export const getCaseStudy = async (slug: string) =>
  (await db.select().from(caseStudies).where(and(eq(caseStudies.slug, slug), eq(caseStudies.published, true))).limit(1))[0];

export const getPosts = (limit = 100) =>
  db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt), desc(posts.createdAt)).limit(limit);

export const getPost = async (slug: string) =>
  (await db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.published, true))).limit(1))[0];

export const getOtherPosts = (slug: string, limit = 2) =>
  db
    .select()
    .from(posts)
    .where(and(eq(posts.published, true), ne(posts.slug, slug)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

/** Client names for the logo strip. Logo bytes are served separately from /media/client/[id]. */
export const getClients = () =>
  db
    .select({ id: clients.id, name: clients.name, logoType: clients.logoType })
    .from(clients)
    .where(eq(clients.published, true))
    .orderBy(asc(clients.order), asc(clients.name));

export const getJobs = () =>
  db.select().from(jobs).where(eq(jobs.published, true)).orderBy(desc(jobs.createdAt), asc(jobs.title));

export const getJob = async (slug: string) =>
  (await db.select().from(jobs).where(and(eq(jobs.slug, slug), eq(jobs.published, true))).limit(1))[0];
