import type { Metadata } from "next";
import { Award, MapPin } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CtaBand, PageHero, SectionHeading } from "@/components/sections";
import { credentials, founders, offices, stats } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Chiacon is an IT consulting and services firm founded in 2020 in Gurugram, India, with a UAE entity in Sharjah.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Accountability", body: "We give a recommendation and stand behind it. If a project should not be built, we say so before you fund it." },
  { title: "Evidence over opinion", body: "Assessments, audits and test results decide what we build. The same standard applies to the AI we deliver." },
  { title: "Close to the work", body: "Clients deal with the people doing the delivery, including the founders. Decisions are made in days." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Chiacon"
        title="Enterprise outcomes. Boutique agility."
        lead="We are a consulting and engineering firm that puts AI, automation and analytics into controlled business processes, and keeps them running."
      />

      <section className="bg-white py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <SectionHeading eyebrow="Our story" title="Founded in March 2020. Built on delivery." />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate">
              <p>
                Chiacon started in Gurugram in March 2020, in the first weeks of the pandemic. The founders had spent
                their careers delivering technology programmes inside large enterprises and wanted a firm that combined
                that rigour with the speed of a small team.
              </p>
              <p>
                The name joins <strong className="font-semibold text-ink">chia</strong>, the seed known for how much it
                packs into a small size, with <strong className="font-semibold text-ink">con</strong> for consulting. It
                is still how we work: compact teams that carry a lot.
              </p>
              <p>
                Today more than fifty consultants and engineers serve clients in consumer goods, medical devices,
                manufacturing and technology across India, the GCC, Europe and North America.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <dl className="grid grid-cols-2 gap-5">
              {stats.map((s) => (
                <div key={s.label} className="card p-6">
                  <dt className="font-display text-4xl font-semibold text-navy">{s.value}</dt>
                  <dd className="mt-2 text-sm text-slate">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-24">
        <div className="container-x">
          <SectionHeading eyebrow="How we work" title="Three things clients can hold us to." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="card h-full p-7">
                  <span className="font-display text-sm font-semibold text-brand-600">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold text-ink">{v.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-slate">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Leadership" title="Founders who stay on the account." />
            <ul className="mt-10 space-y-5">
              {founders.map((f) => (
                <li key={f.name} className="card flex items-center gap-5 p-6">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-navy to-teal font-display text-xl font-semibold text-white" aria-hidden="true">
                    {f.initials}
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">{f.name}</p>
                    <p className="text-slate">{f.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Credentials" title="Certified, partnered and recognised." />
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {credentials.map((c) => (
                <li key={c.title} className="flex items-start gap-4 py-4">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" strokeWidth={1.75} />
                  <div>
                    <p className="font-semibold text-ink">{c.title}</p>
                    <p className="text-sm text-slate">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-mist py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Offices" title="India and the UAE." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {offices.map((o) => (
              <div key={o.city} className="card p-7">
                <MapPin className="h-6 w-6 text-navy" aria-hidden="true" strokeWidth={1.75} />
                <h3 className="mt-4 text-xl font-semibold text-ink">{o.city}, {o.country}</h3>
                <p className="mt-1 text-sm font-medium text-brand-600">{o.note}</p>
                <address className="mt-4 not-italic leading-relaxed text-slate">
                  <span className="font-medium text-ink">{o.entity}</span>
                  {o.lines.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </address>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
