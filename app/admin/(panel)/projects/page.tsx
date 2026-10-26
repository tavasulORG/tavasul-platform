"use client";

import { RecordList } from "@/components/admin/RecordList";
import { projectList } from "@/components/admin/editors/projects";

export default function AdminProjectsPage() {
  return <RecordList config={projectList} />;
}
