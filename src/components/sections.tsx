import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CaseStudy, Post, Service } from "@/db/schema";
import { Icon } from "@/components/icons";
import { cn, formatDate, readMinutes } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div className="container-x relative py-20 sm:py-24">
        <p className="eyebrow !text-brand">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] sm:text-5xl">{title}</h1>
        {lead ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  center,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="h-section mt-3">{title}</h2>
      {lead ? <p className="lead mt-4">{lead}</p> : null}
    </div>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card group relative flex h-full flex-col p-7 transition duration-300 hover:-translate-y-1 hover:border-navy/30 hover:shadow-lift"
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy/[0.07] text-navy transition-colors group-hover:bg-navy group-hover:text-white">
        <Icon name={service.icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-xl font-semibold text-ink">{service.title}</h3>
      <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-slate">{service.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
        Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function CaseCard({ study, large }: { study: CaseStudy; large?: boolean }) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-navy/30 hover:shadow-lift"
    >
      <div className="relative bg-ink px-7 py-6 text-white">
        <div className="bg-grid-dark absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative flex items-center justify-between gap-4">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">{study.service}</span>
          <ArrowUpRight className="h-5 w-5 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </div>
        <p className="relative mt-5 text-sm text-white/65">{study.clientLabel}</p>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className={cn("font-semibold leading-snug text-ink", large ? "text-2xl" : "text-xl")}>{study.title}</h3>
        <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-slate">{study.summary}</p>
        {study.highlights.length ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {study.highlights.slice(0, 3).map((h) => (
              <li key={h} className="chip">{h}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </Link>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="card group flex h-full flex-col p-7 transition duration-300 hover:-translate-y-1 hover:border-navy/30 hover:shadow-lift"
    >
      <p className="flex items-center gap-3 text-xs font-medium text-slate">
        <span className="rounded-full bg-brand/10 px-2.5 py-1 font-semibold text-brand-600">{post.category}</span>
        <span>{formatDate(post.publishedAt)}</span>
      </p>
      <h3 className="mt-4 text-xl font-semibold leading-snug text-ink group-hover:text-navy">{post.title}</h3>
      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-slate">{post.excerpt}</p>
      <span className="mt-5 text-sm font-medium text-slate">{readMinutes(post.body)} min read</span>
    </Link>
  );
}

export function CtaBand({
  title = "Let's talk about the problem worth solving.",
  lead = "Tell us where a process is slow, manual or stuck in pilot. We will come back within one business day with a view on what to do next.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="bg-white py-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-7 py-14 text-white sm:px-14 sm:py-16">
          <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/75">{lead}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book a conversation <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/case-studies" className="btn-ghost">See our work</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
