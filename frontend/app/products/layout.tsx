import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";
const description =
  "Business-grade POS, CCTV, biometric and networking equipment supplied, installed and supported in Kenya.";
export const metadata = createPageMetadata({
  title: "ICT Products and Equipment",
  description,
  path: "/products",
});
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={pageSchema("CollectionPage", "ICT Products and Equipment", description, "/products")} />
    </>
  );
}
