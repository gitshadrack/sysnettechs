import type { Metadata } from "next";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { LeadForm } from "@/components/forms";
import { company } from "@/lib/data";
import { getPublicSiteSettings } from "@/lib/site-settings";
export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Sysnettech Solutions in Nairobi for POS, CCTV, web development, biometric and networking solutions.",
};
export default async function Contact() {
  const settings = await getPublicSiteSettings();
  const socials = [
    { Icon: Facebook, label: "Facebook", url: settings.facebook_url },
    { Icon: Instagram, label: "Instagram", url: settings.instagram_url },
    { Icon: Linkedin, label: "LinkedIn", url: settings.linkedin_url },
  ].filter(({ url }) => Boolean(url));
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s solve your next technology challenge."
        description="Talk to a knowledgeable team. We’ll listen first, then recommend a clear way forward."
      />
      <section className="section-block">
        <div className="container-site grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <section aria-labelledby="contact-details">
            <h2
              id="contact-details"
              className="font-display text-2xl font-bold text-slate-950 dark:text-white"
            >
              Connect with us
            </h2>
            <address className="mt-8 space-y-6 not-italic">
              {[
                [MapPin, "Office", company.address],
                [Phone, "Phone", company.phone],
                [Mail, "Email", company.email],
                [Clock, "Office hours", "Mon–Fri, 8:00 AM–5:30 PM · Sat, 9:00 AM–1:00 PM"],
              ].map(([Icon, l, v]) => {
                const I = Icon as typeof MapPin;
                return (
                  <div className="flex gap-4" key={l as string}>
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-brand-teal-aa dark:bg-teal-950/40 dark:text-teal-300"
                    >
                      <I size={20} />
                    </span>
                    <div>
                      <b className="block text-sm text-slate-950 dark:text-white">{l as string}</b>
                      <span className="text-sm">{v as string}</span>
                    </div>
                  </div>
                );
              })}
            </address>
            <nav aria-label="Social media" className="mt-8 flex gap-3">
              {socials.map(({ Icon, label, url }) => (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  key={label}
                  aria-label={`Sysnettech on ${label}`}
                  className="grid h-10 w-10 place-items-center rounded-full border hover:border-brand-teal-aa hover:text-brand-teal-aa dark:hover:text-teal-300"
                >
                  <Icon aria-hidden="true" size={17} />
                </a>
              ))}
            </nav>
            <a
              href="/company-profile.pdf"
              download
              className="mt-8 inline-block text-sm font-bold text-brand-navy underline underline-offset-4 dark:text-teal-300"
            >
              Download company profile (PDF)
            </a>
          </section>
          <section aria-labelledby="contact-form-title" className="card">
            <h2
              id="contact-form-title"
              className="mb-7 font-display text-2xl font-bold text-slate-950 dark:text-white"
            >
              Send us a message
            </h2>
            <LeadForm />
          </section>
        </div>
      </section>
      <section aria-label="Office location map" className="h-[430px] w-full bg-slate-100">
        <iframe
          title="Map showing Sysnettech Solutions in Nairobi, Kenya"
          src="https://www.google.com/maps?q=Nairobi%2C%20Kenya&output=embed"
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
        />
      </section>
    </>
  );
}
