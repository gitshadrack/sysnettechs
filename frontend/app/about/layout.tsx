import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";
export const metadata = createPageMetadata({
  title: "About Sysnettech Solutions",
  description:
    "Learn about Sysnettech Solutions Ltd, our mission, vision, values and commitment to dependable ICT services in Kenya.",
  path: "/about",
});
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={pageSchema(
          "AboutPage",
          "About Sysnettech Solutions",
          "Our story, mission, values and technology expertise.",
          "/about",
        )}
      />
    </>
  );
}
