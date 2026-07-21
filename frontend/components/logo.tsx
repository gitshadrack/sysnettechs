import Link from "next/link";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Sysnettech Solutions home">
      <span
        aria-hidden="true"
        className="grid h-10 w-10 place-items-center rounded-xl bg-brand-teal-aa text-lg font-black text-white shadow-lg shadow-teal-900/20"
      >
        S
      </span>
      <span>
        <b
          className={`block font-display text-lg leading-none ${light ? "text-white" : "text-brand-navy dark:text-white"}`}
        >
          SYSNETTECH
        </b>
        <small
          className={`text-[9px] font-bold tracking-[.24em] ${light ? "text-white/80" : "text-slate-600 dark:text-slate-300"}`}
        >
          SOLUTIONS LTD
        </small>
      </span>
    </Link>
  );
}
