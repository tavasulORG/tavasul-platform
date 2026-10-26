"use client";

import { use } from "react";
import { RecordEditor } from "@/components/admin/RecordEditor";
import { projectEditor } from "@/components/admin/editors/projects";

export default function AdminProjectEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RecordEditor config={projectEditor} id={id} />;
}
