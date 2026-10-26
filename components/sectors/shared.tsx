"use client";

import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { AlertTriangle, Droplets, GraduationCap, HeartPulse, Home, TrendingUp, Users } from "lucide-react";
import clsx from "clsx";

export { EASE, fadeUp, stagger, viewportOnce } from "@/components/about/shared";

/** Icons keyed by the `iconName` field in data/sectors.ts. */
const ICONS: Record<string, ComponentType<LucideProps>> = {
  GraduationCap,
  HeartPulse,
  AlertTriangle,
  TrendingUp,
  Users,
  Droplets,
  Home,
};

export function SectorIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Users;
  return <Icon className={className} />;
}

export const numberFormat = new Intl.NumberFormat("en-US");

/** "01", "02", ... from a zero-based index. */
export function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Totals across the sectors shown; see sectorTotalsOf in context/ContentContext.tsx. */
export { sectorTotalsOf } from "@/context/ContentContext";

interface HeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  tone?: "dark" | "light";
}

/** Eyebrow with a short leading line, then the title: the template's slide-title style. */
export function SectorsHeading({ eyebrow, title, description, align = "start", tone = "dark" }: HeadingProps) {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <div className={clsx("space-y-3", centered && "text-center max-w-2xl mx-auto")}>
      {eyebrow && (
        <span
          className={clsx(
            "inline-flex items-center gap-3 text-xs font-bold",
            dark ? "text-primary-600" : "text-primary-300"
          )}
        >
          <span aria-hidden className={clsx("h-[3px] w-8", dark ? "bg-primary-500" : "bg-primary-400")} />
          {eyebrow}
          {centered && <span aria-hidden className={clsx("h-[3px] w-8", dark ? "bg-primary-500" : "bg-primary-400")} />}
        </span>
      )}
      <h2
        className={clsx(
          "font-brand text-2xl sm:text-3xl lg:text-[2.125rem] font-extrabold leading-tight",
          dark ? "text-slate-900" : "text-white"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={clsx("text-sm sm:text-base leading-relaxed", dark ? "text-slate-500" : "text-slate-300")}>
          {description}
        </p>
      )}
    </div>
  );
}

interface CornerFrameProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

/** The cover slide's bracket frame: an L at the top-start corner and an L at the bottom-end corner. */
export function CornerFrame({ children, className, color = "border-primary-500" }: CornerFrameProps) {
  return (
    <div className={clsx("relative", className)}>
      <span aria-hidden className={clsx("absolute top-0 start-0 w-2/5 h-14 sm:h-20 border-t-[3px] border-s-[3px]", color)} />
      <span aria-hidden className={clsx("absolute bottom-0 end-0 w-2/5 h-14 sm:h-20 border-b-[3px] border-e-[3px]", color)} />
      {children}
    </div>
  );
}
