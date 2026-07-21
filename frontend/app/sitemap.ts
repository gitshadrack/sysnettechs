import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "about", "services", "products", "portfolio", "blog", "careers", "contact", "quote"];
  return pages.map((p) => ({
    url: `https://sysnettechs.co.ke/${p}`,
    lastModified: new Date(),
    changeFrequency: p === "blog" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
}
