import { redirect } from "next/navigation";
import { sectorsData } from "@/data/sectors";

/** The former per-sector pages now live as sections of the unified /sectors page. */
export default async function SectorRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exists = sectorsData.some((sector) => sector.slug === slug);
  redirect(exists ? `/sectors#${slug}` : "/sectors");
}
