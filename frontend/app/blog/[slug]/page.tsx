import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { posts } from "@/lib/data";
import { createPageMetadata, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  return post
    ? createPageMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` })
    : {};
}

export default async function BlogArticle({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) notFound();

  const url = `${siteUrl}/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "Sysnettech Solutions Ltd", url: siteUrl },
    publisher: { "@type": "Organization", name: "Sysnettech Solutions Ltd", url: siteUrl },
    image: `${siteUrl}/images/hero-ict.png`,
    inLanguage: "en-KE",
  };

  return (
    <article>
      <header className="bg-brand-ink py-20 text-white sm:py-28">
        <div className="container-site max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-teal-300">
            <ArrowLeft aria-hidden="true" size={17} /> Back to insights
          </Link>
          <p className="mt-10 text-sm font-bold uppercase tracking-widest text-teal-300">{post.category}</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">{post.title}</h1>
          <p className="mt-6 text-lg text-slate-300">
            Published <time dateTime={post.publishedAt}>{post.date}</time>
          </p>
        </div>
      </header>
      <section aria-label="Article content" className="section-block">
        <div className="container-site max-w-3xl">
          <p className="text-xl font-medium leading-9 text-slate-900 dark:text-slate-100">{post.excerpt}</p>
          <div className="mt-10 space-y-7 text-lg leading-8">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="mt-12 rounded-3xl bg-slate-100 p-7 dark:bg-slate-900">
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              Need practical advice?
            </h2>
            <p className="mt-3">Our team can assess your requirements and recommend a clear next step.</p>
            <Link href="/contact" className="btn-primary mt-6">
              Talk to an ICT specialist
            </Link>
          </aside>
        </div>
      </section>
      <JsonLd data={schema} />
    </article>
  );
}
