"use client";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { projects } from "@/lib/data";
export function ProjectGrid({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const visible = (filter === "All" ? projects : projects.filter((p) => p.category === filter)).slice(
    0,
    limit,
  );
  return (
    <>
      <nav aria-label="Filter projects by category" className="mb-10 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${filter === c ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"}`}
          >
            {c}
          </button>
        ))}
      </nav>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <article
            key={p.title}
            className={`group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br ${p.tone} p-7 text-white`}
          >
            <span
              aria-hidden="true"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/20"
            >
              <ArrowUpRight />
            </span>
            <span aria-hidden="true" className="absolute inset-0 bg-grid bg-[size:36px_36px] opacity-30" />
            <div className="relative">
              <small className="font-bold uppercase tracking-widest text-white/80">{p.category}</small>
              <h3 className="mt-2 font-display text-2xl font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-white/80">{p.client}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
