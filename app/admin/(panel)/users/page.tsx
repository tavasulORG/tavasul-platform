"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { KeyRound, Shield, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import type { AdminRole, AdminUser } from "@/types";
import { adminApi } from "@/lib/adminClient";
import { ROLE_LABEL } from "@/lib/adminShared";
import { useAdminShell } from "@/components/admin/AdminShell";
import { hasRole } from "@/components/admin/useAdminSession";
import { Alert, Badge, Button, Card, ConfirmDialog, EmptyState, Field, Input, Loading, Modal, PageHeader, Select, Table, Td, Th, errorMessage, fmtDate, useToast } from "@/components/admin/ui";

const ROLE_HINT: Record<AdminRole, string> = {
  admin: "كل الصلاحيات: المحتوى، الإعدادات، المستخدمون، الاستيراد.",
  editor: "تعديل المحتوى والوسائط والرسائل فقط؛ لا يصل إلى الإعدادات والمستخدمين.",
};

export default function AdminUsersPage() {
  const { session } = useAdminShell();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [passwordFor, setPasswordFor] = useState<AdminUser | null>(null);
  const [deleteFor, setDeleteFor] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminApi.users.list();
      setUsers(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const changeRole = async (user: AdminUser, role: AdminRole) => {
    setBusy(true);
    try {
      await adminApi.users.update(user.id, { role });
      setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, role } : u)));
      toast({ tone: "success", title: `أصبح ${user.email} ${ROLE_LABEL[role]}` });
    } catch (err) {
      toast({ tone: "error", title: "تعذر تغيير الدور", description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!deleteFor) return;
    setBusy(true);
    try {
      await adminApi.users.remove(deleteFor.id);
      setUsers((list) => list.filter((u) => u.id !== deleteFor.id));
      toast({ tone: "success", title: "تم حذف الحساب" });
      setDeleteFor(null);
    } catch (err) {
      toast({ tone: "error", title: "تعذر الحذف", description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  if (!hasRole(session.role, "admin")) return <Alert tone="warning" title="هذه الصفحة للمدير فقط" />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="المستخدمون والصلاحيات"
        description="حسابات الدخول إلى لوحة التحكم. المدير يرى كل شيء؛ المحرر يعدّل المحتوى فقط."
        actions={
          <Button icon={UserPlus} onClick={() => setCreateOpen(true)}>
            إضافة حساب
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {(["admin", "editor"] as AdminRole[]).map((role) => (
          <div key={role} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              {role === "admin" ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            </span>
            <div>
              <div className="text-sm font-extrabold text-slate-900">{ROLE_LABEL[role]}</div>
              <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{ROLE_HINT[role]}</p>
            </div>
          </div>
        ))}
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <Loading />
      ) : users.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="لا حسابات" />
        </Card>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>الحساب</Th>
              <Th>الدور</Th>
              <Th>آخر دخول</Th>
              <Th>أُنشئ في</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const self = user.id === session.userId;
              return (
                <tr key={user.id} className="hover:bg-slate-50/70">
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white font-latin font-bold text-xs">{user.email.charAt(0).toUpperCase()}</span>
                      <div>
                        <div className="font-latin font-bold text-slate-900" dir="ltr">
                          {user.email}
                        </div>
                        {self && <Badge tone="cyan">أنت</Badge>}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Select value={user.role} disabled={busy || self} onChange={(e) => changeRole(user, e.target.value as AdminRole)} className="w-auto">
                      <option value="admin">مدير</option>
                      <option value="editor">محرر</option>
                    </Select>
                  </Td>
                  <Td className="text-xs whitespace-nowrap">{fmtDate(user.lastSignInAt)}</Td>
                  <Td className="text-xs whitespace-nowrap">{fmtDate(user.createdAt, false)}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" icon={KeyRound} onClick={() => setPasswordFor(user)}>
                        كلمة المرور
                      </Button>
                      {!self && (
                        <Button size="sm" variant="ghost" icon={Trash2} className="text-red-600" onClick={() => setDeleteFor(user)}>
                          حذف
                        </Button>
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={(user) => setUsers((list) => [...list, user])} />
      <PasswordModal user={passwordFor} onClose={() => setPasswordFor(null)} />
      <ConfirmDialog
        open={deleteFor !== null}
        title={`حذف ${deleteFor?.email ?? ""}؟`}
        message="لن يستطيع هذا الحساب الدخول بعد الآن."
        confirmLabel="حذف الحساب"
        danger
        loading={busy}
        onCancel={() => setDeleteFor(null)}
        onConfirm={remove}
      />
    </div>
  );
}

function CreateUserModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (user: AdminUser) => void }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await adminApi.users.create(email.trim(), password, role);
      onCreated(data);
      toast({ tone: "success", title: "تمت إضافة الحساب", description: `${data.email} يستطيع الدخول الآن بكلمة المرور التي حددتها.` });
      setEmail("");
      setPassword("");
      setRole("editor");
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="إضافة حساب"
      description="يُفعَّل الحساب مباشرة دون رسالة تأكيد؛ شارك كلمة المرور مع صاحبه بطريقة آمنة."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            إلغاء
          </Button>
          <Button type="submit" form="create-user" loading={busy} icon={UserPlus}>
            إضافة
          </Button>
        </>
      }
    >
      <form id="create-user" onSubmit={submit} className="space-y-4">
        <Field label="البريد الإلكتروني" required>
          <Input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} required className="font-latin" />
        </Field>
        <Field label="كلمة المرور" required hint="8 أحرف على الأقل">
          <Input type="text" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="font-latin" autoComplete="off" />
        </Field>
        <Field label="الدور" hint={ROLE_HINT[role]}>
          <Select value={role} onChange={(e) => setRole(e.target.value as AdminRole)}>
            <option value="editor">محرر</option>
            <option value="admin">مدير</option>
          </Select>
        </Field>
        {error && <Alert tone="error">{error}</Alert>}
      </form>
    </Modal>
  );
}

function PasswordModal({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setError("");
    setBusy(true);
    try {
      await adminApi.users.update(user.id, { password });
      toast({ tone: "success", title: "تم تغيير كلمة المرور", description: user.email });
      setPassword("");
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={user !== null}
      onClose={onClose}
      title="تغيير كلمة المرور"
      description={user?.email}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            إلغاء
          </Button>
          <Button type="submit" form="change-password" loading={busy} icon={KeyRound}>
            حفظ
          </Button>
        </>
      }
    >
      <form id="change-password" onSubmit={submit} className="space-y-4">
        <Field label="كلمة المرور الجديدة" required hint="8 أحرف على الأقل">
          <Input type="text" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="font-latin" autoComplete="off" />
        </Field>
        {error && <Alert tone="error">{error}</Alert>}
      </form>
    </Modal>
  );
}
