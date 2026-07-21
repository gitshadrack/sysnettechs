import type { Metadata } from "next";

export const siteUrl = "https://sysnettechs.co.ke";
export const defaultOgImage = "/images/hero-ict.png";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function createPageMetadata({ title, description, path, noIndex = false }: PageMetadata): Metadata {
  const canonical = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: "Sysnettech Solutions Ltd",
      title,
      description,
      url: canonical,
      images: [
        {
          url: defaultOgImage,
          width: 1829,
          height: 860,
          alt: "Sysnettech Solutions connected ICT infrastructure in Nairobi",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
  };
}

export function pageSchema(
  type: string,
  name: string,
  description: string,
  path: string,
  extra: Record<string, unknown> = {},
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: new URL(path, siteUrl).toString(),
    isPartOf: { "@type": "WebSite", name: "Sysnettech Solutions Ltd", url: siteUrl },
    provider: { "@type": "Organization", name: "Sysnettech Solutions Ltd", url: siteUrl },
    inLanguage: "en-KE",
    ...extra,
  };
}
