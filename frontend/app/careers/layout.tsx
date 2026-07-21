import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, pageSchema } from "@/lib/seo";
const description = "Explore technology jobs and internships at Sysnettech Solutions Ltd in Nairobi, Kenya.";
export const metadata = createPageMetadata({
  title: "Technology Careers and Internships",
  description,
  path: "/careers",
});
export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={pageSchema("CollectionPage", "Careers at Sysnettech Solutions", description, "/careers", {
          mainEntity: {
            "@type": "ItemList",
            name: "Current opportunities",
            itemListElement: [
              "ICT Support Engineer",
              "Business Development Executive",
              "Software Developer Intern",
            ].map((name, index) => ({ "@type": "ListItem", position: index + 1, name })),
          },
        })}
      />
    </>
  );
}
