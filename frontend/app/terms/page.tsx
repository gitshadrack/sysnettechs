import { PageHero } from "@/components/page-hero";
export default function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Website terms"
        description="Terms governing the use of the Sysnettech Solutions website."
      />
      <article className="container-site max-w-3xl py-16 leading-8">
        <p>
          Website content is provided for general information. Product availability, specifications, pricing
          and project timelines are confirmed in a written quotation or agreement.
        </p>
        <p className="mt-5">
          All site content is owned by or licensed to Sysnettech Solutions Ltd. Unauthorised reproduction is
          prohibited.
        </p>
      </article>
    </>
  );
}
