import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { services } from "@/lib/data";
import { LeadForm } from "@/components/forms";
export const metadata: Metadata = {
  title: "ICT Services",
  description:
    "POS systems, CCTV, web development, biometrics and computer networking services in Nairobi and across Kenya.",
};
export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="One partner for your complete ICT environment."
        description="From the cable in the wall to the software your customers use, our solutions are engineered to work together."
      />
      <section className="section-block">
        <div className="container-site space-y-8">
          {services.map((s, i) => (
            <article
              id={s.slug}
              key={s.slug}
              className="scroll-mt-28 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[.65fr_1.35fr]"
            >
              <header className={`${i % 2 ? "bg-brand-teal-aa" : "bg-brand-navy"} p-8 text-white sm:p-10`}>
                <s.icon aria-hidden="true" size={42} />
                <p className="mt-12 text-xs font-bold uppercase tracking-widest text-white/80">
                  Solution 0{i + 1}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold">{s.title}</h2>
                <p className="mt-4 leading-7 text-white/90">{s.summary}</p>
                <Link href={`/quote?service=${s.slug}`} className="btn-secondary mt-7">
                  Request this service <ArrowRight aria-hidden="true" size={17} />
                </Link>
              </header>
              <section aria-label={`${s.title} capabilities`} className="p-8 sm:p-10">
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Capabilities
                </h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {s.items.map((x) => (
                    <span key={x} className="flex items-center gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        size={18}
                        className="shrink-0 text-brand-teal-aa dark:text-teal-300"
                      />
                      {x}
                    </span>
                  ))}
                </div>
              </section>
            </article>
          ))}
        </div>
      </section>
      <section className="section-block bg-slate-50 dark:bg-slate-900/50">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <header>
            <p className="eyebrow">Service request</p>
            <h2 className="heading">Need technical help or an on-site assessment?</h2>
            <p className="mt-5 text-lg leading-8">
              Share a few details and our solutions team will recommend the right next step.
            </p>
          </header>
          <div className="card">
            <LeadForm kind="service-requests" compact />
          </div>
        </div>
      </section>
    </>
  );
}
