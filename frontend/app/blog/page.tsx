import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { posts as fallbackPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ICT Insights & News",
  description:
    "Practical ICT tips, technology news and business guidance from the Sysnettech Solutions team.",
};

type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  publishedAt: string;
  excerpt: string;
};

type CmsPost = {
  slug: string;
  title: string;
  excerpt?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  data?: { category?: string } | null;
};

function formatPostDate(value?: string | null) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime())
    ? { date: "Recently published", publishedAt: "" }
    : {
        date: new Intl.DateTimeFormat("en-KE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date),
        publishedAt: date.toISOString(),
      };
}

async function getPosts(): Promise<BlogPost[] | null> {
  const apiUrl =
    process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

  try {
    const response = await fetch(`${apiUrl}/content/posts`, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json();
    return (payload.data ?? []).map((post: CmsPost) => {
      const fallback = fallbackPosts.find((item) => item.slug === post.slug);
      const dates = formatPostDate(post.published_at ?? post.created_at ?? fallback?.publishedAt);
      return {
        slug: post.slug,
        title: post.title,
        category: post.data?.category || fallback?.category || "ICT Insights",
        excerpt: post.excerpt || fallback?.excerpt || "Read the latest insight from Sysnettech Solutions.",
        ...dates,
      };
    });
  } catch {
    return null;
  }
}

export default async function Blog() {
  const cmsPosts = await getPosts();
  const posts = cmsPosts ?? fallbackPosts;
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
          {!featured && <p className="card text-center">No blog articles are currently published.</p>}
          {featured && (
            <article className="mb-8 grid overflow-hidden rounded-3xl bg-brand-navy text-white lg:grid-cols-2">
              <div
                aria-hidden="true"
                className="grid min-h-72 place-items-center bg-grid bg-[size:42px_42px]"
              >
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
          )}
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
