"use client";

import { RecordList } from "@/components/admin/RecordList";
import { bankList } from "@/components/admin/editors/banks";

export default function AdminBanksPage() {
  return <RecordList config={bankList} />;
}
