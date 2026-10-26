import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

/** Every admin page except /admin/login renders inside the signed-in shell. */
export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
