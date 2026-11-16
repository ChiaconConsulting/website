import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Icon } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import { CaseCard, CtaBand, PageHero } from "@/components/sections";
import { getCaseStudies, getService, getServices } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary, alternates: { canonical: `/services/${slug}` } };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();
  const [all, studies] = await Promise.all([getServices(), getCaseStudies()]);
  const related = studies.filter((s) => s.service === service.title).slice(0, 2);
  const others = all.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero eyebrow="Services" title={service.title} lead={service.tagline}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">Discuss your case <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </PageHero>

      <section className="bg-white py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-xl leading-relaxed text-ink">{service.summary}</p>
            <Markdown className="mt-8">{service.body}</Markdown>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="card p-7">
              <h2 className="text-lg font-semibold text-ink">What we deliver</h2>
              <ul className="mt-5 space-y-3">
                {service.capabilities.map((c) => (
                  <li key={c} className="flex gap-3 text-[0.95rem] leading-snug text-body">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" strokeWidth={2.5} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            {service.tools.length ? (
              <div className="card p-7">
                <h2 className="text-lg font-semibold text-ink">Platforms and tools</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.tools.map((t) => (
                    <li key={t} className="chip">{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {related.length ? (
        <section className="bg-mist py-20">
          <div className="container-x">
            <h2 className="h-section">Related work</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {related.map((s) => (
                <CaseCard key={s.id} study={s} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-line bg-white py-16">
        <div className="container-x">
          <h2 className="text-xl font-semibold text-ink">Other services</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.slug}`} className="group flex items-center gap-3 rounded-xl border border-line px-4 py-3.5 text-sm font-semibold text-ink transition hover:border-navy hover:text-navy">
                  <Icon name={s.icon} className="h-5 w-5 text-navy" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
