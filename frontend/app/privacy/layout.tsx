import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";

const description =
  "Read how Sysnettech Solutions Ltd collects, uses, protects, and manages personal information.";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description,
  path: "/privacy",
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={pageSchema("WebPage", "Sysnettech Solutions Privacy Policy", description, "/privacy")} />
    </>
  );
}
