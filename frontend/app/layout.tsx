import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingTools } from "@/components/floating-tools";
import { CookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, siteUrl } from "@/lib/seo";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta", display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...createPageMetadata({
    title: "Sysnettech Solutions Ltd | ICT Solutions Kenya",
    description:
      "Leading ICT solutions provider in Kenya for POS systems, CCTV, web development, biometric systems and secure computer networks.",
    path: "/",
  }),
  title: { default: "Sysnettech Solutions Ltd | ICT Solutions Kenya", template: "%s | Sysnettech Solutions" },
  keywords: [
    "ICT company Kenya",
    "POS systems Kenya",
    "CCTV installation Nairobi",
    "web development Kenya",
    "biometric systems Kenya",
    "networking company Nairobi",
  ],
};
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
        <FloatingTools />
        <CookieConsent />
        <Analytics />
        <JsonLd data={schema} />
      </body>
    </html>
  );
}
