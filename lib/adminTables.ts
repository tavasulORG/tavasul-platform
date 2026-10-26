import type { AdminRole } from "@/types";
import { AdminError } from "@/lib/adminShared";

/**
 * Tables the generic admin data route may touch, with the role each needs and the
 * columns a partial update may change. Anything not listed here is rejected.
 */

export const ADMIN_TABLES = {
  translations: { pk: "id", minRole: "editor", order: { column: "id", ascending: true } },
  organization_info: { pk: "key", minRole: "editor", order: { column: "key", ascending: true } },
  sectors: { pk: "id", minRole: "editor", order: { column: "sort_order", ascending: true } },
  regions: { pk: "id", minRole: "editor", order: { column: "sort_order", ascending: true } },
  projects: { pk: "id", minRole: "editor", order: { column: "created_at", ascending: false } },
  bank_accounts: { pk: "id", minRole: "editor", order: { column: "sort_order", ascending: true } },
  // Editors may save the "home" row (stories); the settings page itself is admin-only in the UI.
  site_settings: { pk: "key", minRole: "editor", order: { column: "key", ascending: true } },
  donations: { pk: "id", minRole: "editor", readOnly: true, order: { column: "created_at", ascending: false } },
  contact_messages: {
    pk: "id",
    minRole: "editor",
    editableColumns: ["status", "notes"],
    deletable: true,
    order: { column: "created_at", ascending: false },
  },
  admin_audit_log: { pk: "id", minRole: "editor", readOnly: true, order: { column: "created_at", ascending: false } },
} as const satisfies Record<string, TableConfig>;

export type AdminTable = keyof typeof ADMIN_TABLES;

export interface TableConfig {
  pk: string;
  minRole: AdminRole;
  /** list/get only. */
  readOnly?: boolean;
  /** When set, upsert is refused and update may only touch these columns. */
  editableColumns?: readonly string[];
  /** Allows delete on a table that has editableColumns. */
  deletable?: boolean;
  order: { column: string; ascending: boolean };
}

export function isAdminTable(name: unknown): name is AdminTable {
  return typeof name === "string" && Object.prototype.hasOwnProperty.call(ADMIN_TABLES, name);
}

export function tableConfig(name: unknown): TableConfig & { name: AdminTable } {
  if (!isAdminTable(name)) throw new AdminError(400, `الجدول غير مسموح: ${String(name)}`);
  return { name, ...(ADMIN_TABLES[name] as TableConfig) };
}
