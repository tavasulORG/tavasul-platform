import { redirect } from "next/navigation";

/**
 * The former per-sector pages now live as sections of the unified /sectors page.
 * Sectors are managed in the admin, so any slug redirects to its anchor; an unknown
 * anchor simply lands at the top of the page.
 */
export default async function SectorRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(/^[a-z0-9-]+$/i.test(slug) ? `/sectors#${slug}` : "/sectors");
}
