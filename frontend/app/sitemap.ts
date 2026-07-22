import type { MetadataRoute } from "next";
import { posts } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "about",
    "services",
    "products",
    "portfolio",
    "blog",
    "careers",
    "contact",
    "quote",
    "accessibility",
  ];
  const staticPages: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `https://sysnettechs.co.ke/${p}`,
    lastModified: new Date(),
    changeFrequency: p === "blog" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.8,
  }));

  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://sysnettechs.co.ke/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticPages, ...articles];
}
