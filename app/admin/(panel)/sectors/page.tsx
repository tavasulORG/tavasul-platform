"use client";

import { RecordList } from "@/components/admin/RecordList";
import { sectorList } from "@/components/admin/editors/sectors";

export default function AdminSectorsPage() {
  return <RecordList config={sectorList} />;
}
