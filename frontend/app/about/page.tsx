import type { Metadata } from "next";
import { Download, Eye, Flag, Handshake, Lightbulb, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Sysnettech Solutions Ltd, our story, vision, mission and commitment to reliable ICT solutions in Kenya.",
};
export default function About() {
  const values = [
    [ShieldCheck, "Integrity", "We communicate honestly, protect client interests and do what we promise."],
    [Lightbulb, "Innovation", "We apply modern technology where it creates practical, lasting value."],
    [Users, "Partnership", "We listen, collaborate and build relationships beyond project handover."],
    [Flag, "Excellence", "We care about the details—from clean installations to clear documentation."],
  ];
  return (
    <>
      <PageHero
        eyebrow="About Sysnettech"
        title="Technology expertise. Business understanding. Local commitment."
        description="We help organisations across Kenya turn technology into a dependable advantage."
      />
      <section className="py-20 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Our story" title="Built to make business technology work better." />
            <div className="space-y-5 leading-8">
              <p>
                Sysnettech Solutions Ltd was founded on a simple idea: organisations deserve technology
                partners who understand operations as well as infrastructure.
              </p>
              <p>
                From our roots in ICT support, we have grown into a multidisciplinary team delivering POS,
                surveillance, software, biometric and network solutions. Today, we support businesses of every
                size with the same practical mindset—listen carefully, engineer responsibly and stay
                accountable.
              </p>
              <p>
                Our work is grounded in Kenya and informed by global standards. That balance helps clients
                adopt the right technology without unnecessary complexity.
              </p>
            </div>
          </Reveal>
          <Reveal className="grid gap-5 sm:grid-cols-2">
            <div className="card bg-brand-navy text-white dark:bg-brand-navy">
              <Eye className="text-brand-teal" />
              <h3 className="mt-8 text-xl font-bold">Our vision</h3>
              <p className="mt-3 leading-7 text-white/70">
                To be East Africa’s most trusted partner for intelligent, secure and accessible business
                technology.
              </p>
            </div>
            <div className="card">
              <Handshake className="text-brand-orange" />
              <h3 className="mt-8 text-xl font-bold text-slate-950 dark:text-white">Our mission</h3>
              <p className="mt-3 leading-7">
                To empower organisations with innovative ICT solutions, exceptional service and long-term
                technical support.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="bg-slate-50 py-20 dark:bg-slate-900/50">
        <div className="container-site">
          <SectionHeading eyebrow="What guides us" title="Values visible in every engagement." center />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map(([Icon, t, c]) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <div className="card" key={t as string}>
                  <I className="text-brand-teal" />
                  <h3 className="mt-6 text-lg font-bold text-slate-950 dark:text-white">{t as string}</h3>
                  <p className="mt-3 text-sm leading-6">{c as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container-site">
          <SectionHeading eyebrow="Why clients trust us" title="Careful engineering, clear accountability." />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Solutions scoped around genuine business needs",
              "Qualified specialists across hardware and software",
              "Transparent proposals and project milestones",
              "Clean installation, documentation and user training",
              "Security and scalability designed in from day one",
              "Responsive after-sales and maintenance support",
            ].map((x) => (
              <div
                key={x}
                className="flex gap-3 rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
              >
                <ShieldCheck className="shrink-0 text-brand-teal" />
                <b className="text-slate-950 dark:text-white">{x}</b>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section aria-labelledby="company-profile-title" className="bg-brand-ink py-20 text-white">
        <div className="container-site flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <header className="max-w-3xl">
            <p className="eyebrow text-teal-300">Company profile</p>
            <h2 id="company-profile-title" className="font-display text-3xl font-bold sm:text-4xl">
              Get a concise overview of our capabilities.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Download our company profile for an overview of Sysnettech Solutions, our services, and how we
              support organisations across Kenya.
            </p>
          </header>
          <a href="/company-profile.pdf" download className="btn-secondary shrink-0">
            <Download aria-hidden="true" size={18} /> Download Company Profile
          </a>
        </div>
      </section>
    </>
  );
}
