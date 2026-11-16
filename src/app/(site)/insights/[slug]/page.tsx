import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { CtaBand, PostCard } from "@/components/sections";
import { getOtherPosts, getPost } from "@/lib/data";
import { site } from "@/lib/site";
import { formatDate, readMinutes } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.publishedAt?.toISOString() },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const more = await getOtherPosts(slug, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: site.legalName },
    mainEntityOfPage: `${site.url}/insights/${post.slug}`,
  };

  return (
    <>
      <article>
        <header className="border-b border-line bg-mist">
          <div className="container-x max-w-3xl py-16">
            <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-medium text-slate hover:text-navy">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All insights
            </Link>
            <p className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-600">{post.category}</span>
              <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{readMinutes(post.body)} min read</span>
            </p>
            <h1 className="mt-5 text-3xl font-semibold leading-tight text-ink sm:text-[2.75rem]">{post.title}</h1>
            <p className="mt-5 text-xl leading-relaxed text-slate">{post.excerpt}</p>
            <p className="mt-6 text-sm font-medium text-ink">By {post.author}</p>
          </div>
        </header>
        <div className="container-x max-w-3xl py-14">
          <Markdown>{post.body}</Markdown>
        </div>
      </article>

      {more.length ? (
        <section className="border-t border-line bg-mist py-16">
          <div className="container-x">
            <h2 className="text-2xl font-semibold text-ink">Keep reading</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {more.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
