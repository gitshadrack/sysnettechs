import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";
const description =
  "Scalable business systems, security, infrastructure, cloud and managed technology services in Nairobi and across Kenya.";
export const metadata = createPageMetadata({
  title: "ICT Services in Kenya",
  description,
  path: "/services",
});
export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={pageSchema("CollectionPage", "ICT Services in Kenya", description, "/services", {
          mainEntity: {
            "@type": "OfferCatalog",
            name: "Sysnettech ICT Services",
            itemListElement: [
              "POS Systems",
              "CCTV & Surveillance",
              "Web Development",
              "Biometric Systems",
              "Computer Networking",
            ].map((name, position) => ({
              "@type": "Offer",
              position,
              itemOffered: { "@type": "Service", name },
            })),
          },
        })}
      />
    </>
  );
}
