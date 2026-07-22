import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Sysnettech Solutions Ltd accessibility commitment, supported features and contact information.",
};

export default function AccessibilityStatementPage() {
  return (
    <>
      <PageHero
        eyebrow="Accessibility"
        title="A website designed for more people."
        description="We aim to provide an inclusive digital experience that is perceivable, operable, understandable and robust."
      />
      <section className="section-block">
        <div className="container-site max-w-4xl space-y-8">
          <article>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">Our commitment</h2>
            <p className="mt-3 leading-8">
              Sysnettech Solutions Ltd works toward WCAG 2.2 Level AA. The website supports keyboard
              navigation, visible focus states, semantic landmarks, descriptive image alternatives, responsive
              zoom and reduced-motion preferences.
            </p>
          </article>
          <article>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Accessibility controls
            </h2>
            <p className="mt-3 leading-8">
              Use the accessibility button at the bottom-left of any page to adjust text size, line height,
              alignment, contrast, motion, images, link visibility, focus outlines and the reading mask. Your
              preferences remain on your device until reset.
            </p>
          </article>
          <article>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Need assistance?
            </h2>
            <p className="mt-3 leading-8">
              If you encounter an accessibility barrier, tell us which page and what happened. We will provide
              the information through an accessible alternative and investigate the issue.
            </p>
            <Link href="/contact" className="btn-primary mt-5">
              Contact our team
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
