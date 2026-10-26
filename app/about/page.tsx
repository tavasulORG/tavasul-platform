import { AboutHero } from "@/components/about/AboutHero";
import { WhoWeAre } from "@/components/about/WhoWeAre";
import { OurStory } from "@/components/about/OurStory";
import { VisionMission } from "@/components/about/VisionMission";
import { Goals } from "@/components/about/Goals";
import { Values } from "@/components/about/Values";
import { TargetGroups } from "@/components/about/TargetGroups";
import { Governance } from "@/components/about/Governance";
import { AboutCta } from "@/components/about/AboutCta";

/**
 * Unified About page. Section ids (#who-we-are, #story, #vision, #goals,
 * #values, #target-groups, #governance, #partners) are the targets of the
 * redirects in next.config.ts for the former sub-pages.
 */
export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <WhoWeAre />
      <OurStory />
      <VisionMission />
      <Goals />
      <Values />
      <TargetGroups />
      <Governance />
      <AboutCta />
    </div>
  );
}
