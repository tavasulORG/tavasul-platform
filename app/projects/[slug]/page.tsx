import { ProjectDetail } from "@/components/projects/ProjectDetail";

/** Project detail. The project comes from DonationContext on the client, so live funding figures show. */
export default async function SingleProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} />;
}
