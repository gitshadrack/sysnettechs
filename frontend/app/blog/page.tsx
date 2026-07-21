import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { posts } from "@/lib/data";

export const metadata: Metadata = {
  title: "ICT Insights & News",
  description:
    "Practical ICT tips, technology news and business guidance from the Sysnettech Solutions team.",
};

export default function Blog() {
  const featured = posts[0];

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Clear thinking for better technology decisions."
        description="Practical guides, security updates and ideas for ambitious organisations."
      />
      <section className="section-block">
        <div className="container-site">
          <article className="mb-8 grid overflow-hidden rounded-3xl bg-brand-navy text-white lg:grid-cols-2">
            <div aria-hidden="true" className="grid min-h-72 place-items-center bg-grid bg-[size:42px_42px]">
              <BookOpen size={80} className="text-teal-300" />
            </div>
            <div className="p-8 sm:p-12">
              <p className="font-bold uppercase tracking-widest text-teal-300">Featured guide</p>
              <h2 className="mt-5 font-display text-3xl font-bold">{featured.title}</h2>
              <p className="mt-5 leading-7 text-white/80">{featured.excerpt}</p>
              <Link href={`/blog/${featured.slug}`} className="btn-secondary mt-7">
                Read the guide <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </article>
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.map((post) => (
              <article className="card" key={post.slug}>
                <div
                  aria-hidden="true"
                  className="mb-6 grid aspect-video place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800"
                >
                  <BookOpen className="text-brand-teal-aa dark:text-teal-300" size={38} />
                </div>
                <p className="text-sm font-bold text-brand-teal-aa dark:text-teal-300">
                  {post.category} · <time dateTime={post.publishedAt}>{post.date}</time>
                </p>
                <h2 className="mt-4 font-display text-xl font-bold text-slate-950 dark:text-white">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-6">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex gap-2 text-sm font-bold text-brand-navy dark:text-teal-300"
                >
                  Read article <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
