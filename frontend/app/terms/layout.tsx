import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";

const description = "Review the terms governing use of the Sysnettech Solutions Ltd website and its content.";

export const metadata = createPageMetadata({
  title: "Website Terms",
  description,
  path: "/terms",
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={pageSchema("WebPage", "Sysnettech Solutions Website Terms", description, "/terms")} />
    </>
  );
}
