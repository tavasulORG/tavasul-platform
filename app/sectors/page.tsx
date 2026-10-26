"use client";

import { useContent } from "@/context/ContentContext";
import { SectorsHero } from "@/components/sectors/SectorsHero";
import { SectorsIndex } from "@/components/sectors/SectorsIndex";
import { SectorsNumbers } from "@/components/sectors/SectorsNumbers";
import { SectorSection, type SectorVariant } from "@/components/sectors/SectorSection";
import { SectorsApproach } from "@/components/sectors/SectorsApproach";
import { SectorsCta } from "@/components/sectors/SectorsCta";

/** Visual treatment per sector, in data order; the visual side alternates start/end. */
const VARIANTS: SectorVariant[] = ["frame", "mosaic", "mosaic", "frame", "frame", "mosaic", "frame"];

/**
 * Unified sectors page. Each sector renders as a section whose id is its slug
 * (#education, #health, ...), the target of app/sectors/[slug]/page.tsx redirects
 * and of the sector cards on the home page. Sectors come from the content context
 * (Supabase, edited in the admin) with data/sectors.ts as the fallback.
 */
export default function SectorsPage() {
  const { sectors } = useContent();

  return (
    <div>
      <SectorsHero />
      <SectorsIndex />
      <SectorsNumbers />
      {sectors.map((sector, i) => (
        <SectorSection
          key={sector.id}
          sector={sector}
          index={i}
          variant={VARIANTS[i % VARIANTS.length]}
          flip={i % 2 === 1}
        />
      ))}
      <SectorsApproach />
      <SectorsCta />
    </div>
  );
}
