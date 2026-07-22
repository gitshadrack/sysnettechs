import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { serviceGroups, services } from "@/lib/data";
import { LeadForm } from "@/components/forms";
export const metadata: Metadata = {
  title: "ICT Services",
  description:
    "Scalable business systems, security, infrastructure and digital services in Nairobi and across Kenya.",
};
export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="One partner for your complete ICT environment."
        description="From the cable in the wall to the software your customers use, our solutions are engineered to work together."
      />
      <section className="border-b border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-900/50">
        <nav className="container-site" aria-label="Service categories">
          <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-slate-500 dark:text-slate-400">
            Explore by capability
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceGroups.map((group) => (
              <Link
                key={group.id}
                href={`#${group.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-teal-aa hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-brand-teal-aa dark:bg-teal-950/50 dark:text-teal-300">
                  <Layers3 aria-hidden="true" size={21} />
                </span>
                <span>
                  <b className="block text-sm text-slate-950 dark:text-white">{group.title}</b>
                  <small className="text-slate-500 dark:text-slate-400">
                    {group.services.length} {group.services.length === 1 ? "solution" : "solutions"}
                  </small>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  size={17}
                  className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-teal-aa"
                />
              </Link>
            ))}
          </div>
        </nav>
      </section>
      <section className="section-block">
        <div className="container-site space-y-20">
          {serviceGroups.map((group) => (
            <section id={group.id} key={group.id} className="scroll-mt-28">
              <header className="mb-8 grid gap-4 border-b border-slate-200 pb-7 dark:border-slate-800 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
                <div>
                  <p className="eyebrow">Solution category</p>
                  <h2 className="heading mt-2">{group.title}</h2>
                </div>
                <p className="max-w-2xl text-lg leading-8 lg:justify-self-end">{group.summary}</p>
              </header>
              <div className="space-y-8">
                {group.services.map((s) => {
                  const serviceNumber = services.findIndex((service) => service.slug === s.slug) + 1;
                  return (
                    <article
                      id={s.slug}
                      key={s.slug}
                      className="scroll-mt-28 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[.65fr_1.35fr]"
                    >
                      <header
                        className={`${serviceNumber % 2 === 0 ? "bg-brand-teal-aa" : "bg-brand-navy"} p-8 text-white sm:p-10`}
                      >
                        <s.icon aria-hidden="true" size={42} />
                        <p className="mt-12 text-xs font-bold uppercase tracking-widest text-white/80">
                          Solution {String(serviceNumber).padStart(2, "0")}
                        </p>
                        <h3 className="mt-2 font-display text-3xl font-bold">{s.title}</h3>
                        <p className="mt-4 leading-7 text-white/90">{s.summary}</p>
                        <Link href={`/quote?service=${s.slug}`} className="btn-secondary mt-7">
                          Request this service <ArrowRight aria-hidden="true" size={17} />
                        </Link>
                      </header>
                      <section aria-label={`${s.title} capabilities`} className="p-8 sm:p-10">
                        <h4 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                          Capabilities
                        </h4>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                          {s.items.map((item) => (
                            <span key={item} className="flex items-center gap-3">
                              <CheckCircle2
                                aria-hidden="true"
                                size={18}
                                className="shrink-0 text-brand-teal-aa dark:text-teal-300"
                              />
                              {item}
                            </span>
                          ))}
                        </div>
                      </section>
                    </article>
                  );
                })}
              </div>
            </section>
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
