import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingTools } from "@/components/floating-tools";
import { AccessibilityWidget } from "@/components/accessibility-widget";
import { CookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, siteUrl } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/site-settings";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta", display: "swap" });
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const page = createPageMetadata({
    title: settings.site_title,
    description: settings.meta_description,
    path: "/",
  });
  return {
    metadataBase: new URL(siteUrl),
    ...page,
    title: { default: settings.site_title, template: "%s | Sysnettech Solutions" },
    openGraph: {
      ...page.openGraph,
      images: [{ url: settings.og_image, alt: "Sysnettech Solutions ICT services in Kenya" }],
    },
    keywords: [
      "ICT company Kenya",
      "POS systems Kenya",
      "CCTV installation Nairobi",
      "web development Kenya",
      "biometric systems Kenya",
      "networking company Nairobi",
    ],
    icons: {
      icon: [{ url: "/images/sysnettech-icon-refined-v2.svg", type: "image/svg+xml" }],
      shortcut: "/images/sysnettech-icon-refined-v2.svg",
    },
  };
}
const schema = [
  {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: "Sysnettech Solutions Ltd",
    url: siteUrl,
    email: "info@sysnettechs.co.ke",
    telephone: "+254700000000",
    image: `${siteUrl}/images/hero-ict.png`,
    logo: `${siteUrl}/images/sysnettech-logo-refined-v2.svg`,
    address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
    areaServed: { "@type": "Country", name: "Kenya" },
    description: "Innovative ICT Solutions for Modern Businesses.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Sysnettech Solutions Ltd",
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-KE",
  },
];
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${jakarta.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:p-3 focus:text-brand-navy focus:shadow-lg"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <AccessibilityWidget />
        <FloatingTools />
        <CookieConsent />
        <Analytics />
        <JsonLd data={schema} />
      </body>
    </html>
  );
}
