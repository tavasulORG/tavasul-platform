import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#00A3E0", // Tawasul Brand Cyan
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          DEFAULT: "#00A3E0",
        },
        brand: {
          cyan: "#00A3E0",
          cyanDark: "#0284c7",
          cyanLight: "#e0f7fc",
          gray: "#707070",
          dark: "#1e293b",
          light: "#f8fafc",
          gold: "#f59e0b",
          emerald: "#10b981",
          // Light surface palette (replaces near-black / navy panels)
          sky: "#EAF7FB",
          mist: "#F0FBFF",
          tint: "#D9F3FB",
          ink: "#0F172A",
          body: "#334155",
          muted: "#475569",
          line: "#E2E8F0",
        },
      },
      boxShadow: {
        "brand-soft": "0 12px 32px -14px rgba(0, 163, 224, 0.28), 0 2px 6px -2px rgba(15, 23, 42, 0.06)",
      },
      fontFamily: {
        sans: [
          "Bahij TheSansArabic",
          "Noto Kufi Arabic",
          "Alexandria",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        brand: [
          "BigVesta Arabic Beta",
          "Bahij TheSansArabic",
          "Noto Kufi Arabic",
          "Alexandria",
          "system-ui",
          "sans-serif",
        ],
        latin: ["Trajan Sans Pro", "Cinzel", "Palatino Linotype", "Georgia", "serif"],
        arabic: [
          "Bahij TheSansArabic",
          "Noto Kufi Arabic",
          "Alexandria",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

