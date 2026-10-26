"use client";

import { use } from "react";
import { RecordEditor } from "@/components/admin/RecordEditor";
import { sectorEditor } from "@/components/admin/editors/sectors";

export default function AdminSectorEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RecordEditor config={sectorEditor} id={id} />;
}
