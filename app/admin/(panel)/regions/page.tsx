"use client";

import { RecordList } from "@/components/admin/RecordList";
import { regionList } from "@/components/admin/editors/regions";

export default function AdminRegionsPage() {
  return <RecordList config={regionList} />;
}
