import Link from "next/link";
import { ArrowRight, Award, X } from "lucide-react";
import { ClientStrip } from "@/components/client-strip";
import { EvidenceCard } from "@/components/evidence-card";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { CaseCard, CtaBand, PostCard, SectionHeading, ServiceCard } from "@/components/sections";
import { getCaseStudies, getClients, getPosts, getServices } from "@/lib/data";
import { credentials, engagementSteps, failureModes, industries, pillars, stats } from "@/lib/site";

export default async function HomePage() {
  const [clients, services, studies, posts] = await Promise.all([
    getClients(),
    getServices(),
    getCaseStudies({ featured: true, limit: 3 }),
    getPosts(3),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap text-white/85 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
              Auditable AI and intelligent automation
            </p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl lg:text-[4.1rem]">
              AI your auditors can <span className="text-gradient">sign off on.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Chiacon builds AI and automation for process-heavy enterprises, where every answer traces to a source,
              every number reconciles and every decision has an owner.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book an assessment call <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#approach" className="btn-ghost">How we make AI auditable</Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                ["ISO 27001", "and ISO 9001 certified"],
                ["UiPath", "Authorized Partner"],
                ["India + UAE", "delivery and client teams"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-display text-base font-semibold text-white sm:text-lg">{k}</dt>
                  <dd className="mt-1 text-xs leading-snug text-white/60">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <EvidenceCard />
        </div>
      </section>

      <ClientStrip clients={clients} />

      {/* Problem */}
      <section className="bg-white py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="The problem"
              title="Most enterprise AI stalls in the same place: the audit."
              lead="The demo goes well. Then finance, compliance or internal audit asks three questions the pilot cannot answer."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {failureModes.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="h-full rounded-2xl border border-line bg-mist p-7">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-red-100 text-red-700">
                    <X className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-slate">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section id="approach" className="relative overflow-hidden bg-ink py-24 text-white">
        <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow !text-brand">Our approach</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-[2.5rem]">
                Four design rules that make AI defensible.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                We apply the same rules whether we are building a new assistant or repairing one that stalled in pilot.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className="bg-ink">
                <div className="h-full p-8 transition-colors hover:bg-white/[0.03]">
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <span className="font-display text-sm font-semibold text-white/40">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/70">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-grid-light bg-mist py-24">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="What we do"
                title="One team for the AI, the automation and the data underneath."
                lead="Auditable AI only works when the processes and data behind it are sound. We deliver all three."
              />
              <Link href="/services" className="btn-outline shrink-0">All services <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 80}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
            <Reveal delay={160}>
              <div className="flex h-full flex-col justify-between rounded-2xl bg-navy p-7 text-white">
                <div>
                  <h3 className="text-xl font-semibold">Have an AI or automation pilot that stalled?</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-white/75">
                    A two to four week assessment tells you whether to enhance, re-engineer or rebuild, with scope and price.
                  </p>
                </div>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Ask for an assessment <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Engagement */}
      <section className="bg-white py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="How we engage"
              title="Assess first. Build only what is signed off."
              lead="No build commitment until scope, architecture and price are agreed in writing by business and IT."
            />
          </Reveal>
          <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {engagementSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 90}>
                <li className="relative h-full border-t-2 border-navy/15 pt-6">
                  <span className="absolute -top-[2px] left-0 h-[2px] w-12 bg-brand" aria-hidden="true" />
                  <span className="font-display text-sm font-semibold text-brand-600">{s.step}</span>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate">{s.duration}</p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-slate">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Case studies */}
      {studies.length ? (
        <section className="bg-mist py-24">
          <div className="container-x">
            <Reveal>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeading eyebrow="Our work" title="Delivered inside real finance, supply chain and engineering teams." />
                <Link href="/case-studies" className="btn-outline shrink-0">All case studies <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {studies.map((s, i) => (
                <Reveal key={s.id} delay={i * 90}>
                  <CaseCard study={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Industries + credentials */}
      <section className="bg-white py-24">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Industries" title="Where process volume and scrutiny are both high." />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {industries.map((i) => (
                <li key={i} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink shadow-card">{i}</li>
              ))}
            </ul>
            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-4xl font-semibold text-navy">{s.value}</dt>
                  <dd className="mt-1 text-sm text-slate">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={120}>
            <div className="card h-full p-8">
              <p className="eyebrow">Credentials</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">Certified, partnered and recognised.</h2>
              <ul className="mt-6 divide-y divide-line">
                {credentials.map((c) => (
                  <li key={c.title} className="flex items-start gap-4 py-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand-600">
                      <Award className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{c.title}</p>
                      <p className="text-sm text-slate">{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Insights */}
      {posts.length ? (
        <section className="border-t border-line bg-mist py-24">
          <div className="container-x">
            <Reveal>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeading eyebrow="Insights" title="What we have learned building this." />
                <Link href="/insights" className="btn-outline shrink-0">All insights <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
