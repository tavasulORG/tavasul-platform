"use client";

import { use } from "react";
import { RecordEditor } from "@/components/admin/RecordEditor";
import { regionEditor } from "@/components/admin/editors/regions";

export default function AdminRegionEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RecordEditor config={regionEditor} id={id} />;
}
