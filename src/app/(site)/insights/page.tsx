import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { CtaBand, PageHero, PostCard } from "@/components/sections";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical notes from Chiacon on auditable AI, automation, analytics and delivery.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Notes from the delivery floor."
        lead="What we have learned building AI, automation and analytics that survive contact with audit, month-end and production."
      />
      <section className="bg-mist py-20">
        <div className="container-x">
          {posts.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 80}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="lead">New articles are on the way.</p>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
