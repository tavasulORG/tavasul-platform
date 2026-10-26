"use client";

import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { Building2, Droplets, HandHeart, Sun, Tent } from "lucide-react";
import clsx from "clsx";
import type { CountrySlug } from "@/types";
import { MAP_VIEWBOX, mapCountries, regionCountryCodes, regionPins } from "@/data/regionMap";

export { EASE, PaleCircle, fadeUp, stagger, viewportOnce } from "@/components/about/shared";

/** One pictogram per region, hinting at its main intervention, as the template's audience circles do. */
const REGION_ICONS: Record<string, ComponentType<LucideProps>> = {
  turkey: Building2,
  yemen: Droplets,
  syria: Tent,
  palestine: HandHeart,
  africa: Sun,
};

export function RegionIcon({ slug, className }: { slug: CountrySlug; className?: string }) {
  const Icon = REGION_ICONS[slug] ?? HandHeart;
  return <Icon className={className} />;
}

export const numberFormat = new Intl.NumberFormat("en-US");

/** Totals across the regions shown; see regionTotalsOf in context/ContentContext.tsx. */
export { regionTotalsOf } from "@/context/ContentContext";

interface HeadingProps {
  title: string;
  eyebrow?: string;
  tone?: "dark" | "light";
  className?: string;
}

/** Title first, then a small brand-coloured label under it: the template's "Explorez le territoire" heading. */
export function WhereHeading({ title, eyebrow, tone = "dark", className }: HeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={clsx("space-y-2", className)}>
      <h2
        className={clsx(
          "font-brand text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold leading-tight",
          dark ? "text-slate-900" : "text-white"
        )}
      >
        {title}
      </h2>
      {eyebrow && (
        <span className={clsx("block text-[11px] sm:text-xs font-bold tracking-wide", dark ? "text-primary-600" : "text-primary-200")}>
          {eyebrow}
        </span>
      )}
    </div>
  );
}

interface WaveEdgeProps {
  className?: string;
  /** Tailwind fill class of the wave body: the background of the section it leads into. */
  fill?: string;
  /** Point the crests downwards (for the top edge of a section). */
  flip?: boolean;
}

/** Two soft crests with a thinner tinted crest behind them, as under the template's hero photo. */
export function WaveEdge({ className, fill = "fill-white", flip = false }: WaveEdgeProps) {
  const d = "M0,46 C220,104 430,-4 720,44 C1010,92 1210,4 1440,40 L1440,110 L0,110 Z";
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 110"
      preserveAspectRatio="none"
      className={clsx("block w-full h-12 sm:h-16 lg:h-24", flip && "rotate-180", className)}
    >
      <path d={d} transform="translate(60,-16)" className="fill-primary-300/45" />
      <path d={d} className={fill} />
    </svg>
  );
}

interface LocatorProps {
  slug: CountrySlug;
  className?: string;
  /** Fill classes for the quiet countries and the region's countries. */
  quiet?: string;
  active?: string;
}

/**
 * The whole map at thumbnail size with one region's countries and pin picked out.
 * The pin keeps small regions (Palestine) visible at this scale.
 */
export function LocatorMap({ slug, className, quiet = "fill-primary-100", active = "fill-primary-600" }: LocatorProps) {
  // Regions added in the admin have no map data yet: draw the quiet map with no pin.
  const codes = regionCountryCodes[slug] ?? [];
  const pin = regionPins[slug];
  return (
    <svg aria-hidden viewBox={MAP_VIEWBOX} className={className}>
      {mapCountries.map((country) => (
        <path
          key={country.code}
          d={country.d}
          fillRule="evenodd"
          className={clsx(codes.includes(country.code) ? active : quiet, "stroke-white")}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      ))}
      {pin && <circle cx={pin.x} cy={pin.y} r={30} className="fill-primary-600 stroke-white" strokeWidth={10} />}
    </svg>
  );
}
