"use client";

import { useContent } from "@/context/ContentContext";
import { WhereHero } from "@/components/where-we-work/WhereHero";
import { WhereCountryRow } from "@/components/where-we-work/WhereCountryRow";
import { WhereMap } from "@/components/where-we-work/WhereMap";
import { WhereProjects } from "@/components/where-we-work/WhereProjects";
import { WhereRegionSection } from "@/components/where-we-work/WhereRegionSection";
import { WhereCta } from "@/components/where-we-work/WhereCta";

/**
 * Unified where-we-work page. Each region renders as a section whose id is its slug
 * (#turkey, #yemen, ...), the target of app/where-we-work/[slug]/page.tsx redirects,
 * the footer links and the region cards on the home page. Regions come from the content
 * context (Supabase, edited in the admin) with data/regions.ts as the fallback.
 */
export default function WhereWeWorkPage() {
  const { regions } = useContent();

  return (
    <div>
      <WhereHero />
      <WhereCountryRow />
      <WhereMap />
      <WhereProjects />
      {regions.map((region, i) => (
        <WhereRegionSection key={region.id} region={region} index={i} flip={i % 2 === 1} />
      ))}
      <WhereCta />
    </div>
  );
}
