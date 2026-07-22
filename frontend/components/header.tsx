"use client";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { featuredServiceGroups } from "@/lib/data";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Insights" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container-site flex h-20 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map((l) =>
            l.label === "Services" ? (
              <div key={l.href} className="group relative">
                <Link
                  href={l.href}
                  className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-brand-teal-aa dark:text-slate-200 dark:hover:text-teal-300"
                >
                  Services <ChevronDown aria-hidden="true" size={14} />
                </Link>
                <section
                  aria-label="Services menu"
                  className="invisible absolute left-1/2 top-10 w-[760px] -translate-x-1/2 rounded-3xl border border-slate-200 bg-white p-6 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    {featuredServiceGroups.map((category) => (
                      <section key={category.id} aria-labelledby={`menu-${category.id}`}>
                        <h2
                          id={`menu-${category.id}`}
                          className="px-3 text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400"
                        >
                          {category.title}
                        </h2>
                        <div className="mt-2 space-y-1">
                          {category.services.map((service) => (
                            <Link
                              key={service.slug}
                              href={`/services#${service.slug}`}
                              className="flex gap-3 rounded-2xl p-3 hover:bg-slate-50 focus:bg-slate-50 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                            >
                              <service.icon
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-brand-teal-aa dark:text-teal-300"
                                size={21}
                              />
                              <span>
                                <b className="block text-sm text-slate-900 dark:text-white">
                                  {service.title}
                                </b>
                                <small className="line-clamp-1 text-slate-600 dark:text-slate-300">
                                  {service.summary}
                                </small>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  <Link
                    href="/services"
                    className="mt-5 flex items-center justify-between rounded-2xl bg-brand-navy px-5 py-4 text-sm font-bold text-white"
                  >
                    Browse the complete solutions catalog <ArrowRight aria-hidden="true" size={17} />
                  </Link>
                </section>
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-slate-700 hover:text-brand-teal-aa dark:text-slate-200 dark:hover:text-teal-300"
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/quote" className="btn-primary hidden sm:inline-flex">
            Free quote
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="container-site border-t border-slate-100 py-5 lg:hidden dark:border-slate-800"
          aria-label="Mobile navigation"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-slate-100 py-3 font-semibold dark:border-slate-800"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/quote" className="btn-primary mt-5 w-full" onClick={() => setOpen(false)}>
            Get a free quote
          </Link>
        </nav>
      )}
    </header>
  );
}
