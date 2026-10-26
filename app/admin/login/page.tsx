"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, LogIn, RefreshCw, ShieldCheck, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { adminApi, type SetupStatus } from "@/lib/adminClient";
import { useContent } from "@/context/ContentContext";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { SchemaSetup } from "@/components/admin/SchemaSetup";
import { Alert, Button, Field, Input, Loading, errorMessage } from "@/components/admin/ui";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginScreen />
    </Suspense>
  );
}

function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const session = useAdminSession();
  const { settings } = useContent();

  const [setup, setSetup] = useState<SetupStatus | null>(null);
  const [setupError, setSetupError] = useState("");
  const [checking, setChecking] = useState(true);

  const loadStatus = async () => {
    setChecking(true);
    setSetupError("");
    try {
      setSetup(await adminApi.setupStatus());
    } catch (err) {
      setSetupError(errorMessage(err));
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  useEffect(() => {
    if (session.status === "ready") router.replace(next);
  }, [session.status, router, next]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[radial-gradient(ellipse_at_top,rgba(0,163,224,0.12),transparent_55%)]">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <img src={settings.logo} alt="Tawasul" className="mx-auto h-14 w-auto rounded-xl bg-white p-1.5 shadow-sm object-contain" />
          <h1 className="mt-4 text-2xl font-black text-slate-900 font-brand">لوحة تحكم تواصل</h1>
          <p className="mt-1 text-sm text-slate-500">إدارة محتوى الموقع والرسائل والتبرعات</p>
        </div>

        {checking && !setup ? (
          <Loading label="جارٍ فحص الإعداد..." />
        ) : setupError ? (
          <Alert tone="error" title="تعذر الاتصال بالخادم" actions={<Button size="sm" variant="outline" icon={RefreshCw} onClick={loadStatus}>إعادة المحاولة</Button>}>
            {setupError}
          </Alert>
        ) : (
          <>
            {setup && !setup.tablesReady && <SchemaSetup sqlEditorUrl={setup.sqlEditorUrl} onRecheck={loadStatus} checking={checking} />}
            {setup && !setup.hasAdmin ? <FirstAdminSetup onDone={() => router.replace("/admin")} /> : <LoginForm next={next} />}
          </>
        )}

        <p className="text-center text-[11px] text-slate-400">
          <ShieldCheck className="inline w-3.5 h-3.5 me-1 align-text-bottom" />
          الدخول محمي بـ Supabase Auth؛ كل عملية تُسجَّل في سجل النشاط.
        </p>
      </div>
    </div>
  );
}

/* No admin account exists yet. */
function FirstAdminSetup({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("كلمة المرور يجب ألا تقل عن 8 أحرف");
    if (password !== confirm) return setError("كلمتا المرور غير متطابقتين");
    setBusy(true);
    try {
      await adminApi.bootstrap(email.trim(), password);
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw signInError;
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <UserPlus className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">إنشاء حساب المدير الأول</h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">لا يوجد مدير بعد. هذا الحساب سيملك كل الصلاحيات ويستطيع إضافة محررين لاحقاً.</p>
        </div>
      </div>

      <Field label="البريد الإلكتروني" required>
        <Input type="email" dir="ltr" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.org" />
      </Field>
      <Field label="كلمة المرور" required hint="8 أحرف على الأقل">
        <Input type="password" dir="ltr" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      <Field label="تأكيد كلمة المرور" required>
        <Input type="password" dir="ltr" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </Field>

      {error && <Alert tone="error">{error}</Alert>}

      <Button type="submit" className="w-full" size="lg" icon={KeyRound} loading={busy}>
        إنشاء الحساب والدخول
      </Button>
    </form>
  );
}

/* The usual sign-in. */
function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw new Error(/invalid/i.test(signInError.message) ? "البريد أو كلمة المرور غير صحيحة" : signInError.message);
      router.replace(next);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" data-testid="login-form">
      <Field label="البريد الإلكتروني" required>
        <Input type="email" dir="ltr" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.org" />
      </Field>
      <Field label="كلمة المرور" required>
        <Input type="password" dir="ltr" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>

      {error && <Alert tone="error">{error}</Alert>}

      <Button type="submit" className="w-full" size="lg" icon={LogIn} loading={busy}>
        تسجيل الدخول
      </Button>
    </form>
  );
}
