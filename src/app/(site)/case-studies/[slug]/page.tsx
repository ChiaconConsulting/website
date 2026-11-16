import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { CtaBand } from "@/components/sections";
import { getCaseStudy } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  return { title: study.title, description: study.summary, alternates: { canonical: `/case-studies/${slug}` } };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="container-x relative py-16 sm:py-20">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All case studies
          </Link>
          <p className="eyebrow mt-8 !text-brand">{study.service}</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">{study.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{study.summary}</p>
          <dl className="mt-10 grid max-w-3xl gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div><dt className="text-xs uppercase tracking-wider text-white/50">Client</dt><dd className="mt-1 font-medium">{study.clientLabel}</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-white/50">Industry</dt><dd className="mt-1 font-medium">{study.industry}</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-white/50">Practice</dt><dd className="mt-1 font-medium">{study.service}</dd></div>
          </dl>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-14">
            {[
              ["The challenge", study.challenge],
              ["What we did", study.approach],
              ["The result", study.outcome],
            ].map(([heading, body]) => (
              <div key={heading}>
                <h2 className="text-2xl font-semibold text-ink">{heading}</h2>
                <Markdown className="mt-4">{body}</Markdown>
              </div>
            ))}
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {study.highlights.length ? (
              <div className="rounded-2xl bg-ink p-7 text-white">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-brand">At a glance</h2>
                <ul className="mt-5 space-y-4">
                  {study.highlights.map((h) => (
                    <li key={h} className="border-l-2 border-brand pl-4 font-display text-lg font-medium leading-snug">{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {study.stack.length ? (
              <div className="card p-7">
                <h2 className="text-lg font-semibold text-ink">Technology</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {study.stack.map((t) => (
                    <li key={t} className="chip">{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
      <CtaBand title="Facing something similar?" />
    </>
  );
}
