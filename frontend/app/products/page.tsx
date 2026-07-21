import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Box, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { products } from "@/lib/data";
export const metadata: Metadata = {
  title: "ICT Products",
  description:
    "Business-grade POS, CCTV, biometric and networking equipment supplied and supported in Kenya.",
};
export default function Products() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Business-grade equipment, selected for reliability."
        description="Genuine hardware, professional installation and local after-sales support in one straightforward package."
      />
      <section className="py-20">
        <div className="container-site">
          <div className="mb-10 flex flex-wrap gap-3">
            {["All products", "POS", "Security", "Biometric", "Networking"].map((x, i) => (
              <span
                key={x}
                className={`rounded-full px-4 py-2 text-sm font-bold ${i === 0 ? "bg-brand-navy text-white" : "bg-slate-100 dark:bg-slate-800"}`}
              >
                {x}
              </span>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <article className="card group p-0 overflow-hidden" key={p.name}>
                <div className="relative grid aspect-[4/3] place-items-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  <div className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-navy shadow">
                    {p.category}
                  </div>
                  <Box
                    size={74}
                    className="text-brand-navy/25 transition group-hover:scale-110 group-hover:text-brand-teal dark:text-white/20"
                  />
                </div>
                <div className="p-7">
                  <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">{p.name}</h2>
                  <p className="mt-3 leading-7">{p.desc}</p>
                  <div className="mt-4 flex gap-4 text-xs text-slate-500">
                    <span className="flex gap-1">
                      <Check size={14} className="text-brand-teal" />
                      Warranty
                    </span>
                    <span className="flex gap-1">
                      <Check size={14} className="text-brand-teal" />
                      Installation
                    </span>
                  </div>
                  <Link
                    href={`/quote?product=${encodeURIComponent(p.name)}`}
                    className="btn-primary mt-6 w-full"
                  >
                    Request quote <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
