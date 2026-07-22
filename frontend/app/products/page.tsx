import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Storefront } from "@/components/store/storefront";
export const metadata: Metadata = {
  title: "ICT Products",
  description:
    "Business-grade POS, CCTV, biometric and networking equipment supplied and supported in Kenya.",
};
export default function Products() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Business-grade equipment, selected for reliability."
        description="Genuine hardware, professional installation and local after-sales support in one straightforward package."
      />
      <Storefront />
    </>
  );
}
