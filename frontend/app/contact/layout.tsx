import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";
const description =
  "Contact Sysnettech Solutions in Nairobi for POS, CCTV, web development, biometric and networking solutions.";
export const metadata = createPageMetadata({
  title: "Contact Sysnettech Solutions",
  description,
  path: "/contact",
});
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={pageSchema("ContactPage", "Contact Sysnettech Solutions", description, "/contact", {
          mainEntity: {
            "@type": "Organization",
            name: "Sysnettech Solutions Ltd",
            telephone: "+254700000000",
            email: "info@sysnettechs.co.ke",
          },
        })}
      />
    </>
  );
}
