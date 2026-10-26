import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { AdminError, errorResponse, logAudit, requireAdmin, roleOf } from "@/lib/adminAuth";
import type { AdminRole, AdminUser } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isRole(value: unknown): value is AdminRole {
  return value === "admin" || value === "editor";
}

function toAdminUser(user: User): AdminUser | null {
  const role = roleOf(user);
  if (!role) return null;
  return {
    id: user.id,
    email: user.email ?? "",
    role,
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}

async function listAll(): Promise<User[]> {
  const users: User[] = [];
  let page = 1;
  for (;;) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new AdminError(500, error.message);
    users.push(...data.users);
    if (data.users.length < 200) break;
    page += 1;
  }
  return users;
}

function validEmail(email: unknown): email is string {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8;
}

/** GET -> admin panel accounts (users whose app_metadata.role is admin or editor). */
export async function GET(request: Request) {
  try {
    await requireAdmin(request, "admin");
    const users = (await listAll()).map(toAdminUser).filter((u): u is AdminUser => u !== null);
    return Response.json({ data: users });
  } catch (err) {
    return errorResponse(err);
  }
}

/** POST { email, password, role } -> create an account that can sign in right away. */
export async function POST(request: Request) {
  try {
    const actor = await requireAdmin(request, "admin");
    const body = (await request.json()) as { email?: unknown; password?: unknown; role?: unknown };
    if (!validEmail(body.email)) throw new AdminError(400, "البريد الإلكتروني غير صالح");
    if (!validPassword(body.password)) throw new AdminError(400, "كلمة المرور يجب ألا تقل عن 8 أحرف");
    if (!isRole(body.role)) throw new AdminError(400, "الدور غير معروف");

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      app_metadata: { role: body.role },
    });
    if (error) throw new AdminError(400, error.message);

    await logAudit(actor, { action: "user", table: "auth.users", recordId: data.user.id, summary: `إضافة ${body.email} (${body.role})` });
    return Response.json({ data: toAdminUser(data.user) });
  } catch (err) {
    return errorResponse(err);
  }
}

/** PATCH { id, role?, password? } */
export async function PATCH(request: Request) {
  try {
    const actor = await requireAdmin(request, "admin");
    const body = (await request.json()) as { id?: unknown; role?: unknown; password?: unknown };
    if (typeof body.id !== "string" || !body.id) throw new AdminError(400, "المعرّف مطلوب");

    const attributes: { app_metadata?: { role: AdminRole }; password?: string } = {};
    const changes: string[] = [];
    if (body.role !== undefined) {
      if (!isRole(body.role)) throw new AdminError(400, "الدور غير معروف");
      if (body.id === actor.id && body.role !== "admin") throw new AdminError(400, "لا يمكنك إزالة صلاحية المدير عن حسابك");
      attributes.app_metadata = { role: body.role };
      changes.push(`الدور: ${body.role}`);
    }
    if (body.password !== undefined) {
      if (!validPassword(body.password)) throw new AdminError(400, "كلمة المرور يجب ألا تقل عن 8 أحرف");
      attributes.password = body.password;
      changes.push("كلمة المرور");
    }
    if (changes.length === 0) throw new AdminError(400, "لا يوجد تغيير");

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(body.id, attributes);
    if (error) throw new AdminError(400, error.message);

    await logAudit(actor, { action: "user", table: "auth.users", recordId: body.id, summary: `تحديث ${data.user.email}: ${changes.join("، ")}` });
    return Response.json({ data: toAdminUser(data.user) });
  } catch (err) {
    return errorResponse(err);
  }
}

/** DELETE { id } */
export async function DELETE(request: Request) {
  try {
    const actor = await requireAdmin(request, "admin");
    const body = (await request.json()) as { id?: unknown };
    if (typeof body.id !== "string" || !body.id) throw new AdminError(400, "المعرّف مطلوب");
    if (body.id === actor.id) throw new AdminError(400, "لا يمكنك حذف حسابك الحالي");

    const users = await listAll();
    const target = users.find((u) => u.id === body.id);
    if (!target) throw new AdminError(404, "الحساب غير موجود");
    const admins = users.filter((u) => roleOf(u) === "admin");
    if (roleOf(target) === "admin" && admins.length <= 1) throw new AdminError(400, "يجب أن يبقى مدير واحد على الأقل");

    const { error } = await supabaseAdmin.auth.admin.deleteUser(body.id);
    if (error) throw new AdminError(400, error.message);

    await logAudit(actor, { action: "user", table: "auth.users", recordId: body.id, summary: `حذف ${target.email}` });
    return Response.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
