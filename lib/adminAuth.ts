import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { AdminRole } from "@/types";
import { AdminError, hasRole } from "@/lib/adminShared";

export { AdminError, ROLE_LABEL, ROLE_RANK, SCHEMA_MISSING_MESSAGE, hasRole, isMissingTable } from "@/lib/adminShared";

/**
 * Server-side guard for the admin API routes. SERVER ONLY: this module imports the
 * service-role client; browser code takes the role helpers from lib/adminShared.ts.
 *
 * The admin signs in with Supabase Auth in the browser; every API call carries the
 * session's access token as a Bearer header. The route verifies the token with the
 * service role client and reads the role from the user's app_metadata (set when the
 * account is created in /admin/users or by the first-run setup).
 */

export interface AdminIdentity {
  id: string;
  email: string;
  role: AdminRole;
}

export function roleOf(user: Pick<User, "email" | "app_metadata">): AdminRole | null {
  const role = user.app_metadata?.role;
  if (role === "admin" || role === "editor") return role;
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (user.email && allow.includes(user.email.toLowerCase())) return "admin";
  return null;
}

export function bearerToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

export async function requireAdmin(request: Request, minRole: AdminRole = "editor"): Promise<AdminIdentity> {
  const token = bearerToken(request);
  if (!token) throw new AdminError(401, "يجب تسجيل الدخول أولاً");

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) throw new AdminError(401, "انتهت الجلسة، سجّل الدخول مجدداً");

  const role = roleOf(data.user);
  if (!role) throw new AdminError(403, "هذا الحساب لا يملك صلاحية الدخول إلى لوحة التحكم");
  if (!hasRole(role, minRole)) throw new AdminError(403, "هذه العملية تتطلب صلاحية مدير");

  return { id: data.user.id, email: data.user.email ?? "", role };
}

export function errorResponse(err: unknown): Response {
  if (err instanceof AdminError) return Response.json({ error: err.message }, { status: err.status });
  const message = err instanceof Error ? err.message : "خطأ غير متوقع";
  return Response.json({ error: message }, { status: 500 });
}

interface AuditInput {
  action: "create" | "update" | "delete" | "upload" | "seed" | "login" | "user";
  table: string;
  recordId?: string | null;
  summary?: string;
}

/** Records an admin action; never throws so a failed log cannot block the action itself. */
export async function logAudit(actor: AdminIdentity, entry: AuditInput): Promise<void> {
  try {
    await supabaseAdmin.from("admin_audit_log").insert({
      actor_id: actor.id,
      actor_email: actor.email,
      action: entry.action,
      table_name: entry.table,
      record_id: entry.recordId ?? null,
      summary: entry.summary ?? null,
    });
  } catch {
    // The audit table may not exist yet; the action itself already succeeded.
  }
}
