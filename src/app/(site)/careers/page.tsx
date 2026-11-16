import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Clock, MapPin } from "lucide-react";
import { ApplyForm } from "@/components/forms";
import { PageHero, SectionHeading } from "@/components/sections";
import { getJobs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at Chiacon in automation, AI, data and quality assurance.",
  alternates: { canonical: "/careers" },
};

const reasons = [
  { title: "Real ownership", body: "Small teams, direct client contact and work that goes into production." },
  { title: "Range", body: "AI, automation, analytics and QA under one roof, with room to move between them." },
  { title: "Recognition", body: "Growth is rewarded, and good work is made visible across the company." },
];

export default async function CareersPage() {
  const jobs = await getJobs();
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Do work that reaches production."
        lead="We hire people who like being close to the client and accountable for the result."
      />

      <section className="bg-white py-20">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-2xl bg-mist p-7">
              <h2 className="text-lg font-semibold text-ink">{r.title}</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-slate">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mist py-20" id="open-roles">
        <div className="container-x">
          <SectionHeading eyebrow="Open roles" title={jobs.length ? `${jobs.length} open ${jobs.length === 1 ? "position" : "positions"}` : "No open positions right now"} />
          <ul className="mt-10 space-y-4">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link href={`/careers/${job.slug}`} className="card group flex flex-col gap-4 p-6 transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-lift sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{job.department}</p>
                    <h3 className="mt-1 text-xl font-semibold text-ink group-hover:text-navy">{job.title}</h3>
                    <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden="true" />{job.location}</span>
                      <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" aria-hidden="true" />{job.experience}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" />{job.type}</span>
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy">
                    View role <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-20" id="general-application">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="General application"
            title="Do not see your role?"
            lead="Send us your CV. Our talent team reviews every application and will contact you when there is a match."
          />
          <div className="card p-7 sm:p-9">
            <ApplyForm jobTitle="General application" />
          </div>
        </div>
      </section>
    </>
  );
}
