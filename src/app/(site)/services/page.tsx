import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { CtaBand, PageHero, SectionHeading, ServiceCard } from "@/components/sections";
import { getServices } from "@/lib/data";
import { engagementModels, engagementSteps } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: "Auditable AI, intelligent process automation, data and analytics, quality assurance and delivery leadership from one team.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="AI, automation and data, delivered as one accountable team."
        lead="Each practice stands on its own. Together they are what it takes to put AI into a controlled business process and keep it there."
      />
      <section className="bg-grid-light bg-mist py-20">
        <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 80}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Engagement models" title="Buy an outcome, a team or a service." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {engagementModels.map((m, i) => (
              <Reveal key={m.title} delay={i * 80}>
                <div className="card h-full p-6">
                  <h3 className="text-lg font-semibold text-ink">{m.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-slate">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-24">
        <div className="container-x">
          <SectionHeading eyebrow="How delivery runs" title="Assess, decide, build, support." />
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {engagementSteps.map((s) => (
              <li key={s.step} className="border-t-2 border-brand pt-5">
                <span className="font-display text-sm font-semibold text-brand-600">{s.step}</span>
                <h3 className="mt-2 text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-slate">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
