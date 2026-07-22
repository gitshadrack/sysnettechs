"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Accessibility,
  AlignCenter,
  Eye,
  Focus,
  ImageOff,
  Link2,
  ListTree,
  Pause,
  RotateCcw,
  Type,
  X,
} from "lucide-react";

type Preferences = {
  textSize: 0 | 1 | 2;
  lineHeight: boolean;
  textAlign: "default" | "left" | "center";
  readableFont: boolean;
  grayscale: boolean;
  highContrast: boolean;
  readingMask: boolean;
  hideImages: boolean;
  pauseAnimations: boolean;
  highlightLinks: boolean;
  focusOutline: boolean;
};
type BooleanPreference = Exclude<keyof Preferences, "textSize" | "textAlign">;

const STORAGE_KEY = "sysnettech_accessibility";
const defaults: Preferences = {
  textSize: 0,
  lineHeight: false,
  textAlign: "default",
  readableFont: false,
  grayscale: false,
  highContrast: false,
  readingMask: false,
  hideImages: false,
  pauseAnimations: false,
  highlightLinks: false,
  focusOutline: false,
};
const preferenceClasses = [
  "a11y-text-large",
  "a11y-text-larger",
  "a11y-line-height",
  "a11y-align-left",
  "a11y-align-center",
  "a11y-readable-font",
  "a11y-grayscale",
  "a11y-high-contrast",
  "a11y-hide-images",
  "a11y-pause-animations",
  "a11y-highlight-links",
  "a11y-focus-outline",
];

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [maskY, setMaskY] = useState(320);
  const [showStructure, setShowStructure] = useState(false);
  const [headings, setHeadings] = useState<{ label: string; element: HTMLElement }[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPreferences({ ...defaults, ...JSON.parse(saved) });
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.classList.remove(...preferenceClasses);
    if (preferences.textSize === 1) root.classList.add("a11y-text-large");
    if (preferences.textSize === 2) root.classList.add("a11y-text-larger");
    if (preferences.lineHeight) root.classList.add("a11y-line-height");
    if (preferences.textAlign !== "default") root.classList.add(`a11y-align-${preferences.textAlign}`);
    if (preferences.readableFont) root.classList.add("a11y-readable-font");
    if (preferences.grayscale) root.classList.add("a11y-grayscale");
    if (preferences.highContrast) root.classList.add("a11y-high-contrast");
    if (preferences.hideImages) root.classList.add("a11y-hide-images");
    if (preferences.pauseAnimations) root.classList.add("a11y-pause-animations");
    if (preferences.highlightLinks) root.classList.add("a11y-highlight-links");
    if (preferences.focusOutline) root.classList.add("a11y-focus-outline");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Preferences still work for the current page when storage is unavailable.
    }
  }, [preferences, ready]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (!preferences.readingMask) return;
    const move = (event: PointerEvent) => setMaskY(event.clientY);
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, [preferences.readingMask]);

  function toggle(key: BooleanPreference) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  }

  function reset() {
    setPreferences(defaults);
    setShowStructure(false);
  }

  function pageStructure() {
    setHeadings(
      Array.from(document.querySelectorAll<HTMLElement>("main h1, main h2, main h3"))
        .map((element) => ({ label: element.textContent?.trim() ?? "Untitled section", element }))
        .filter(({ label }) => label.length > 0),
    );
    setShowStructure((value) => !value);
  }

  const controls: { key: BooleanPreference; label: string; icon: typeof Eye }[] = [
    { key: "lineHeight", label: "Increase line height", icon: Type },
    { key: "readableFont", label: "Readable font", icon: Type },
    { key: "grayscale", label: "Grayscale", icon: Eye },
    { key: "highContrast", label: "High contrast", icon: Eye },
    { key: "readingMask", label: "Reading mask", icon: Eye },
    { key: "hideImages", label: "Hide images", icon: ImageOff },
    { key: "pauseAnimations", label: "Pause animations", icon: Pause },
    { key: "highlightLinks", label: "Highlight links", icon: Link2 },
    { key: "focusOutline", label: "Strong focus outline", icon: Focus },
  ];

  return (
    <aside id="accessibility-tools" aria-label="Accessibility tools">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 left-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-brand-teal-aa text-white shadow-xl transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-orange"
        aria-label={open ? "Close accessibility menu" : "Open accessibility menu"}
        aria-expanded={open}
        aria-controls="accessibility-panel"
      >
        <Accessibility aria-hidden="true" size={30} />
      </button>

      {open && (
        <section
          id="accessibility-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="accessibility-title"
          className="fixed bottom-24 left-5 z-[60] max-h-[calc(100vh-8rem)] w-[calc(100%-2.5rem)] max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <header className="sticky top-0 flex items-center justify-between bg-brand-navy p-5 text-white">
            <div>
              <h2 id="accessibility-title" className="font-display text-xl font-bold">
                Accessibility
              </h2>
              <p className="text-xs text-white/80">Adjust this website to your needs</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="rounded-full p-2 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close accessibility menu"
            >
              <X aria-hidden="true" size={21} />
            </button>
          </header>

          <div className="grid gap-5 p-5">
            <fieldset>
              <legend className="text-sm font-bold text-slate-950 dark:text-white">Text size</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {([0, 1, 2] as const).map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setPreferences((current) => ({ ...current, textSize: size }))}
                    aria-pressed={preferences.textSize === size}
                    className={`rounded-xl border px-3 py-2 text-sm font-bold ${preferences.textSize === size ? "border-brand-teal-aa bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-white" : "border-slate-300 dark:border-slate-600"}`}
                  >
                    {size === 0 ? "Default" : size === 1 ? "Large" : "Larger"}
                  </button>
                ))}
              </div>
            </fieldset>
            <label
              className="text-sm font-bold text-slate-950 dark:text-white"
              htmlFor="accessibility-alignment"
            >
              <AlignCenter aria-hidden="true" className="mr-2 inline" size={18} />
              Text alignment
              <select
                id="accessibility-alignment"
                value={preferences.textAlign}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    textAlign: event.target.value as Preferences["textAlign"],
                  }))
                }
                className="admin-input mt-2"
              >
                <option value="default">Default</option>
                <option value="left">Left aligned</option>
                <option value="center">Centred</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {controls.map(({ key, label, icon: Icon }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggle(key)}
                  aria-pressed={Boolean(preferences[key])}
                  className={`flex min-h-20 flex-col items-start justify-between rounded-2xl border p-3 text-left text-sm font-bold transition ${preferences[key] ? "border-brand-teal-aa bg-teal-50 text-teal-950 dark:bg-teal-950 dark:text-white" : "border-slate-200 hover:border-brand-teal-aa dark:border-slate-700"}`}
                >
                  <Icon aria-hidden="true" size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={pageStructure}
              aria-expanded={showStructure}
              className="flex items-center gap-2 rounded-xl border border-slate-300 p-3 text-left text-sm font-bold dark:border-slate-600"
            >
              <ListTree aria-hidden="true" size={20} /> Page structure
            </button>
            {showStructure && (
              <nav
                aria-label="Headings on this page"
                className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950"
              >
                <p className="mb-2 text-xs font-bold uppercase tracking-wider">Page headings</p>
                <ul className="space-y-1">
                  {headings.map(({ label, element }, index) => (
                    <li key={`${label}-${index}`}>
                      <button
                        type="button"
                        onClick={() => {
                          element.scrollIntoView({
                            behavior: preferences.pauseAnimations ? "auto" : "smooth",
                            block: "start",
                          });
                          setOpen(false);
                        }}
                        className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-200 dark:hover:bg-slate-800"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
                {!headings.length && <p className="text-sm">No page headings found.</p>}
              </nav>
            )}
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy dark:text-teal-300"
              >
                <RotateCcw aria-hidden="true" size={17} /> Reset settings
              </button>
              <Link
                href="/accessibility"
                onClick={() => setOpen(false)}
                className="text-sm font-bold underline"
              >
                Accessibility statement
              </Link>
            </footer>
          </div>
        </section>
      )}

      {preferences.readingMask && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,.72) 0, rgba(0,0,0,.72) ${Math.max(0, maskY - 65)}px, transparent ${Math.max(0, maskY - 65)}px, transparent ${maskY + 65}px, rgba(0,0,0,.72) ${maskY + 65}px)`,
          }}
        />
      )}
    </aside>
  );
}
