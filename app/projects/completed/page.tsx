import { redirect } from "next/navigation";

/** Completed projects are now a status filter on the unified /projects page. */
export default function CompletedProjectsRedirectPage() {
  redirect("/projects?status=completed");
}
