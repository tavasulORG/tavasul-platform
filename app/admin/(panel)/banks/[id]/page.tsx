"use client";

import { use } from "react";
import { RecordEditor } from "@/components/admin/RecordEditor";
import { bankEditor } from "@/components/admin/editors/banks";

export default function AdminBankEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RecordEditor config={bankEditor} id={id} />;
}
