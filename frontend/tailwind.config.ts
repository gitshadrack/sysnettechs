import type { Config } from "tailwindcss";
export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { navy: "#0A2A66", teal: "#00A99D", "teal-aa": "#007C73", orange: "#F7941D", ink: "#07152d" },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      boxShadow: { glow: "0 24px 80px rgba(10,42,102,.18)" },
      backgroundImage: {
        grid: "linear-gradient(rgba(0,169,157,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,169,157,.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
