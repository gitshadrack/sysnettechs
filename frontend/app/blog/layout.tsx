import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";
const description = "Practical ICT tips, security guidance and technology news for organisations in Kenya.";
export const metadata = createPageMetadata({
  title: "ICT Insights and Technology News",
  description,
  path: "/blog",
});
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={pageSchema("Blog", "Sysnettech ICT Insights", description, "/blog")} />
    </>
  );
}
