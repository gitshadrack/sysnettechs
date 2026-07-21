import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";
const description =
  "Explore selected POS, CCTV, web, biometric and networking projects delivered by Sysnettech Solutions in Kenya.";
export const metadata = createPageMetadata({
  title: "ICT Project Portfolio",
  description,
  path: "/portfolio",
});
export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={pageSchema("CollectionPage", "Sysnettech ICT Project Portfolio", description, "/portfolio")}
      />
    </>
  );
}
