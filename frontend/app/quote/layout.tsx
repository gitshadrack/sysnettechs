import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";
const description = "Request a free, tailored ICT solution quote from Sysnettech Solutions Ltd in Kenya.";
export const metadata = createPageMetadata({
  title: "Request a Free ICT Quote",
  description,
  path: "/quote",
});
export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={pageSchema("WebPage", "Request a Free ICT Quote", description, "/quote", {
          potentialAction: { "@type": "QuoteAction", target: "https://sysnettechs.co.ke/quote" },
        })}
      />
    </>
  );
}
