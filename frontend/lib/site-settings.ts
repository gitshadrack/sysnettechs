export type PublicSiteSettings = {
  site_title: string;
  meta_description: string;
  og_image: string;
  google_analytics_id: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
};

export const defaultSiteSettings: PublicSiteSettings = {
  site_title: "Sysnettech Solutions Ltd | ICT Solutions Kenya",
  meta_description:
    "Leading ICT solutions provider in Kenya for POS systems, CCTV, web development, biometric systems and secure computer networks.",
  og_image: "/images/hero-ict.png",
  google_analytics_id: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const apiUrl =
    process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
  try {
    const response = await fetch(`${apiUrl}/settings/seo`, { next: { revalidate: 300 } });
    if (!response.ok) return defaultSiteSettings;
    return { ...defaultSiteSettings, ...(await response.json()) };
  } catch {
    return defaultSiteSettings;
  }
}
