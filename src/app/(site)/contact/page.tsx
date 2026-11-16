import type { Metadata } from "next";
import { ChevronDown, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LeadForm } from "@/components/forms";
import { PageHero, SectionHeading } from "@/components/sections";
import { getServices } from "@/lib/data";
import { faqs, offices, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Chiacon about auditable AI, automation, analytics or QA. We reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const services = await getServices();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about the problem worth solving."
        lead="Tell us what is slow, manual or stuck in pilot. We reply within one business day."
      />
      <section className="bg-mist py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="card p-7 sm:p-10">
            <h2 className="text-2xl font-semibold text-ink">Send us a message</h2>
            <div className="mt-6">
              <LeadForm interests={[...services.map((s) => s.title), "Technical assessment of an existing solution", "Staffing"]} />
            </div>
          </div>
          <div className="space-y-5">
            <div className="card p-7">
              <h2 className="text-lg font-semibold text-ink">Reach us directly</h2>
              <ul className="mt-5 space-y-4 text-[0.95rem]">
                <li><a href={`mailto:${site.email}`} className="flex items-center gap-3 text-ink hover:text-navy"><Mail className="h-5 w-5 text-navy" aria-hidden="true" />{site.email}</a></li>
                <li><a href={`tel:${site.phoneHref}`} className="flex items-center gap-3 text-ink hover:text-navy"><Phone className="h-5 w-5 text-navy" aria-hidden="true" />{site.phone}</a></li>
                <li><a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ink hover:text-navy"><MessageCircle className="h-5 w-5 text-navy" aria-hidden="true" />WhatsApp</a></li>
              </ul>
            </div>
            {offices.map((o) => (
              <div key={o.city} className="card p-7">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-ink"><MapPin className="h-5 w-5 text-navy" aria-hidden="true" />{o.city}, {o.country}</h2>
                <address className="mt-3 not-italic leading-relaxed text-slate">
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

      <section id="faqs" className="bg-white py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="FAQs" title="Questions we are asked most." />
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-navy transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
