import { redirect } from "next/navigation";

/** Ongoing projects are now a status filter on the unified /projects page. */
export default function ActiveProjectsRedirectPage() {
  redirect("/projects?status=active");
}
