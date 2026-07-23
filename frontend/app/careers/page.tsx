import type { Metadata } from "next";
import { Briefcase, GraduationCap, Heart, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { LeadForm } from "@/components/forms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore jobs and internships at Sysnettech Solutions Ltd and help build better business technology in Kenya.",
};

type Career = {
  id: number;
  title: string;
  excerpt?: string;
  body?: string;
  data?: {
    employment_type?: string;
    location?: string;
  };
};

async function getCareers(): Promise<Career[]> {
  const apiUrl =
    process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
  try {
    const response = await fetch(`${apiUrl}/content/careers`, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    return payload.data ?? [];
  } catch {
    return [];
  }
}

export default async function Careers() {
  const careers = await getCareers();
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Do meaningful work with technology."
        description="Join a collaborative Kenyan team solving real operational challenges for growing organisations."
      />
      <section className="py-20">
        <div className="container-site">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                Heart,
                "Work that matters",
                "Deliver systems that help local businesses operate, protect and grow.",
              ],
              [
                GraduationCap,
                "Keep learning",
                "Build depth across modern platforms, products and industries.",
              ],
              [
                Briefcase,
                "Own the outcome",
                "Take responsibility, share ideas and see your work in production.",
              ],
            ].map(([Icon, t, c]) => {
              const I = Icon as typeof Heart;
              return (
                <div className="card" key={t as string}>
                  <I className="text-brand-teal" />
                  <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">{t as string}</h2>
                  <p className="mt-3 leading-7">{c as string}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-20">
            <p className="eyebrow">Open roles</p>
            <h2 className="heading">Current opportunities</h2>
            <div className="mt-10 space-y-4">
              {careers.map((career) => (
                <div
                  key={career.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-6 sm:flex-row sm:items-center dark:border-slate-800"
                >
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                      {career.title}
                    </h3>
                    <p className="mt-2 flex gap-4 text-sm">
                      <span>{career.data?.employment_type ?? "Opportunity"}</span>
                      <span className="flex gap-1">
                        <MapPin size={15} />
                        {career.data?.location ?? "Kenya"}
                      </span>
                    </p>
                    {career.excerpt && <p className="mt-4 max-w-3xl leading-7">{career.excerpt}</p>}
                    {career.body && career.body !== career.excerpt && (
                      <details className="mt-4 text-sm">
                        <summary className="cursor-pointer font-bold text-brand-navy dark:text-teal-300">
                          View role details
                        </summary>
                        <p className="mt-3 whitespace-pre-line leading-7">{career.body}</p>
                      </details>
                    )}
                  </div>
                  <a href="#apply" className="btn-primary">
                    Apply now
                  </a>
                </div>
              ))}
              {!careers.length && (
                <div className="rounded-2xl border border-slate-200 p-8 text-center dark:border-slate-800">
                  <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                    No current openings
                  </h3>
                  <p className="mt-2">Please check back soon or send us your CV for future opportunities.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section id="apply" className="scroll-mt-24 bg-slate-50 py-20 dark:bg-slate-900/50">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Apply online</p>
            <h2 className="heading">Bring your skills and curiosity.</h2>
            <p className="mt-5 text-lg leading-8">
              Upload your CV and tell us where you can make a difference. If there is a fit, our team will be
              in touch.
            </p>
          </div>
          <div className="card">
            <LeadForm kind="applications" />
          </div>
        </div>
      </section>
    </>
  );
}
