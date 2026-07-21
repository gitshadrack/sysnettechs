"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const v = localStorage.getItem("theme") === "dark";
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
  }, []);
  const toggle = () => {
    const v = !dark;
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("theme", v ? "dark" : "light");
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 hover:border-brand-teal hover:text-brand-teal dark:border-slate-700 dark:text-white"
      aria-label={dark ? "Use light mode" : "Use dark mode"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
