import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, LayoutGrid } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CtaBand, PageHero } from "@/components/sections";
import { accelerators } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Quick Deployable Bots and Power Platform apps from Chiacon: pre-built automations configured to your systems in days.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Pre-built, so you are live in days and not months."
        lead="Automations and business apps we have built before, configured to your systems and controls."
      />
      {accelerators.map((group, gi) => (
        <section key={group.group} className={gi % 2 ? "bg-white py-20" : "bg-mist py-20"}>
          <div className="container-x">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy text-white">
                {gi === 0 ? <Bot className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} /> : <LayoutGrid className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />}
              </span>
              <div>
                <h2 className="h-section !text-3xl">{group.group}</h2>
                <p className="lead mt-2 max-w-2xl">{group.intro}</p>
              </div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <Reveal key={item.name} delay={(i % 3) * 80}>
                  <div className="card flex h-full flex-col p-7">
                    <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
                    <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-slate">{item.body}</p>
                    <Link href="/contact" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:underline">
                      Ask for a demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
      <CtaBand title="Need something that is not on this list?" lead="Most of our work is built to a client's process. Tell us what you want to automate and we will tell you how we would approach it." />
    </>
  );
}
