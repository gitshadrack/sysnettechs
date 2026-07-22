import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { company, featuredServices } from "@/lib/data";
import { getPublicSiteSettings } from "@/lib/site-settings";
import { Logo } from "./logo";
export async function Footer() {
  const settings = await getPublicSiteSettings();
  const socials = [
    { Icon: Facebook, label: "Facebook", url: settings.facebook_url },
    { Icon: Instagram, label: "Instagram", url: settings.instagram_url },
    { Icon: Linkedin, label: "LinkedIn", url: settings.linkedin_url },
  ].filter(({ url }) => Boolean(url));
  return (
    <footer className="bg-brand-ink text-slate-300">
      <div className="container-site grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <section aria-label="About Sysnettech">
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-7 text-slate-300">
            Innovative ICT solutions for modern businesses. Designed, delivered and supported in Kenya.
          </p>
          <nav aria-label="Social media" className="mt-5 flex gap-3">
            {socials.map(({ Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Sysnettech on ${label}`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-brand-teal-aa focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Icon aria-hidden="true" size={16} />
              </a>
            ))}
          </nav>
        </section>
        <nav aria-label="Solutions">
          <h2 className="mb-5 font-display font-bold text-white">Solutions</h2>
          {featuredServices.map((s) => (
            <Link
              className="mb-3 block text-sm hover:text-teal-300"
              href={`/services#${s.slug}`}
              key={s.slug}
            >
              {s.title}
            </Link>
          ))}
          <Link className="mt-5 block text-sm font-bold text-teal-300 hover:text-white" href="/services">
            View all solutions →
          </Link>
        </nav>
        <nav aria-label="Company">
          <h2 className="mb-5 font-display font-bold text-white">Company</h2>
          {[
            ["About us", "/about"],
            ["Our work", "/portfolio"],
            ["Insights", "/blog"],
            ["Careers", "/careers"],
            ["Contact", "/contact"],
          ].map(([a, b]) => (
            <Link key={b} className="mb-3 block text-sm hover:text-teal-300" href={b}>
              {a}
            </Link>
          ))}
        </nav>
        <address className="not-italic">
          <h2 className="mb-5 font-display font-bold text-white">Contact</h2>
          <p className="mb-4 flex gap-3 text-sm">
            <MapPin aria-hidden="true" size={18} className="shrink-0 text-teal-300" />
            {company.address}
          </p>
          <a className="mb-4 flex gap-3 text-sm hover:text-teal-300" href={`tel:${company.phone}`}>
            <Phone aria-hidden="true" size={18} className="text-teal-300" />
            {company.phone}
          </a>
          <a className="flex gap-3 text-sm hover:text-teal-300" href={`mailto:${company.email}`}>
            <Mail aria-hidden="true" size={18} className="text-teal-300" />
            {company.email}
          </a>
        </address>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sysnettech Solutions Ltd. All rights reserved.</p>
          <nav aria-label="Legal" className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/accessibility">Accessibility</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
