import { Suspense } from "react";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { ProjectsUpdates } from "@/components/projects/ProjectsUpdates";
import { ProjectsCta } from "@/components/projects/ProjectsCta";

/**
 * Unified projects page. The status filter reads ?status=active|completed, the
 * targets of the redirects in app/projects/active and app/projects/completed;
 * ?sector= and ?country= let other pages deep-link into a filtered list.
 */
export default function ProjectsPage() {
  return (
    <div>
      <ProjectsHero />
      {/* useSearchParams needs a Suspense boundary during static rendering. */}
      <Suspense fallback={<section className="min-h-[480px] bg-white" />}>
        <ProjectsExplorer />
      </Suspense>
      <ProjectsUpdates />
      <ProjectsCta />
    </div>
  );
}
