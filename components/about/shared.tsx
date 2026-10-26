"use client";

import type { ReactNode } from "react";
import type { Variants } from "framer-motion";
import clsx from "clsx";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Single fade-up on first scroll into view. No loops, no springs. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const viewportOnce = { once: true, amount: 0.15 } as const;

interface SectionHeadingProps {
  index?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  tone?: "dark" | "light";
}

/** Section index, title and a short bar: the template's "INFORMATION" heading. */
export function SectionHeading({ index, title, subtitle, align = "start", tone = "dark" }: SectionHeadingProps) {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <div className={clsx("space-y-3", centered && "text-center max-w-2xl mx-auto")}>
      {index && (
        <span
          className={clsx(
            "block font-latin text-xs font-bold tracking-[0.35em]",
            dark ? "text-primary-500" : "text-primary-300"
          )}
        >
          {index}
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
      <span
        aria-hidden
        className={clsx("block h-1 w-12 rounded-full", dark ? "bg-primary-500" : "bg-primary-400", centered && "mx-auto")}
      />
      {subtitle && (
        <p className={clsx("text-sm sm:text-base leading-relaxed", dark ? "text-slate-500" : "text-slate-300")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface DecorProps {
  className?: string;
  size?: number;
}

/** Solid pale circle, the template's background motif. Position it with absolute utilities. */
export function PaleCircle({ className, size = 200 }: DecorProps) {
  return (
    <div
      aria-hidden
      className={clsx("pointer-events-none absolute rounded-full bg-primary-100/70", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** Dashed ring. With `size` it stands alone; without it, use inset utilities to wrap a sibling. */
export function DashedRing({ className, size }: DecorProps) {
  return (
    <div
      aria-hidden
      className={clsx("pointer-events-none absolute rounded-full border-2 border-dashed border-primary-300", className)}
      style={size ? { width: size, height: size } : undefined}
    />
  );
}

/** Sub-heading with a small tinted icon circle, used inside a section. */
export function SubHeading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-3 font-brand text-lg sm:text-xl font-extrabold text-slate-900">
      <span className="w-10 h-10 shrink-0 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
        {icon}
      </span>
      {children}
    </h3>
  );
}
