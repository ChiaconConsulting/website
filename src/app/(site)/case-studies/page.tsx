import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { CaseCard, CtaBand, PageHero } from "@/components/sections";
import { getCaseStudies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Case studies",
  description: "How Chiacon has delivered auditable AI, automation, analytics and QA for enterprise clients.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Work we can stand behind."
        lead="Client names are withheld under confidentiality. The problems and how we approached them are real."
      />
      <section className="bg-mist py-20">
        <div className="container-x">
          {studies.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {studies.map((s, i) => (
                <Reveal key={s.id} delay={(i % 2) * 90}>
                  <CaseCard study={s} large />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="lead">Case studies are being prepared. Contact us for references.</p>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
