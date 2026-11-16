import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Clock, MapPin } from "lucide-react";
import { ApplyForm } from "@/components/forms";
import { Markdown } from "@/components/markdown";
import { getJob } from "@/lib/data";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return {};
  return { title: `${job.title} | Careers`, description: job.summary, alternates: { canonical: `/careers/${slug}` } };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    datePosted: job.createdAt.toISOString(),
    employmentType: job.type === "Full-time" ? "FULL_TIME" : "OTHER",
    hiringOrganization: { "@type": "Organization", name: site.legalName, sameAs: site.url },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } },
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="container-x relative py-16">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All roles
          </Link>
          <p className="eyebrow mt-8 !text-brand">{job.department}</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">{job.title}</h1>
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-white/75">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{job.location}</span>
            <span className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4" aria-hidden="true" />{job.experience}</span>
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" />{job.type}</span>
          </p>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xl leading-relaxed text-ink">{job.summary}</p>
            <Markdown className="mt-6">{job.description}</Markdown>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-7 sm:p-8">
              <h2 className="text-xl font-semibold text-ink">Apply for this role</h2>
              <div className="mt-5">
                <ApplyForm jobId={job.id} jobTitle={job.title} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
