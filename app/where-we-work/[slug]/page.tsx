import { redirect } from "next/navigation";
import { regionsData } from "@/data/regions";

/** The former per-country pages now live as sections of the unified /where-we-work page. */
export default async function RegionRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exists = regionsData.some((region) => region.slug === slug);
  redirect(exists ? `/where-we-work#${slug}` : "/where-we-work");
}
