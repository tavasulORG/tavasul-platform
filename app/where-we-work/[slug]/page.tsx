import { redirect } from "next/navigation";

/**
 * The former per-country pages now live as sections of the unified /where-we-work page.
 * Regions are managed in the admin, so any slug redirects to its anchor; an unknown
 * anchor simply lands at the top of the page.
 */
export default async function RegionRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(/^[a-z0-9-]+$/i.test(slug) ? `/where-we-work#${slug}` : "/where-we-work");
}
