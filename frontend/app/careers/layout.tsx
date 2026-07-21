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
          mainEntity: [
            "ICT Support Engineer",
            "Business Development Executive",
            "Software Developer Intern",
          ].map((title) => ({
            "@type": "JobPosting",
            title,
            hiringOrganization: { "@type": "Organization", name: "Sysnettech Solutions Ltd" },
            jobLocationType: title.includes("Intern") ? "TELECOMMUTE" : undefined,
            employmentType: title.includes("Intern") ? "INTERN" : "FULL_TIME",
          })),
        })}
      />
    </>
  );
}
