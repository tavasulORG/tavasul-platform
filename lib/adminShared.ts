import type { AdminRole } from "@/types";

/**
 * Role helpers and error types shared by the admin API routes (server) and the admin
 * UI (browser). This module must stay free of server-only imports: anything that pulls
 * in lib/supabaseAdmin.ts would ship the service role key to the browser.
 */

export const ROLE_RANK: Record<AdminRole, number> = { editor: 1, admin: 2 };

export const ROLE_LABEL: Record<AdminRole, string> = { admin: "مدير", editor: "محرر" };

export function hasRole(role: AdminRole | null | undefined, min: AdminRole): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

export class AdminError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** PostgREST answers PGRST205 while supabase/schema.sql has not been run. */
export function isMissingTable(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  return error.code === "PGRST205" || /schema cache/i.test(error.message ?? "");
}

export const SCHEMA_MISSING_MESSAGE =
  "جداول قاعدة البيانات غير موجودة بعد. شغّل ملف supabase/schema.sql في محرر SQL الخاص بمشروع Supabase ثم أعد المحاولة.";
