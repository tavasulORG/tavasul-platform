"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, DatabaseZap, FolderHeart, HandCoins, Inbox, Layers, MapPin, RefreshCw, Target } from "lucide-react";
import { adminApi, type DashboardStats, type SetupStatus } from "@/lib/adminClient";
import { useContent } from "@/context/ContentContext";
import { ADMIN_NAV } from "@/components/admin/nav";
import { useAdminShell } from "@/components/admin/AdminShell";
import { hasRole } from "@/components/admin/useAdminSession";
import { SchemaSetup } from "@/components/admin/SchemaSetup";
import { Alert, Badge, Button, Card, ConfirmDialog, Loading, PageHeader, Stat, cn, errorMessage, fmtDate, fmtMoney, fmtNumber, useToast } from "@/components/admin/ui";

const TOPIC_LABEL: Record<string, string> = {
  donation: "تبرع",
  project: "مشروع",
  partnership: "شراكة",
  volunteer: "تطوع",
  media: "إعلام",
  other: "أخرى",
};

const ACTION_LABEL: Record<string, string> = {
  create: "إضافة",
  update: "تعديل",
  delete: "حذف",
  upload: "رفع ملف",
  seed: "استيراد",
  login: "دخول",
  user: "مستخدمون",
};

export default function AdminDashboardPage() {
  const { session } = useAdminShell();
  const { toast } = useToast();
  const { refresh } = useContent();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [setup, setSetup] = useState<SetupStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [seedOpen, setSeedOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, st] = await Promise.all([adminApi.stats(), adminApi.setupStatus()]);
      setStats(s);
      setSetup(st);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const seed = async () => {
    setSeeding(true);
    try {
      const { data } = await adminApi.seed(false);
      const written = Object.values(data).reduce((n, r) => n + r.written, 0);
      toast({ tone: "success", title: "تم استيراد المحتوى الافتراضي", description: `${written} سجلاً أُضيف إلى قاعدة البيانات.` });
      setSeedOpen(false);
      void refresh();
      void load();
    } catch (err) {
      toast({ tone: "error", title: "تعذر الاستيراد", description: errorMessage(err) });
    } finally {
      setSeeding(false);
    }
  };

  const isAdmin = hasRole(session.role, "admin");
  const quickLinks = ADMIN_NAV.filter((item) => item.href !== "/admin" && hasRole(session.role, item.minRole));

  return (
    <div className="space-y-6">
      <PageHeader
        title="مرحباً بك"
        description="نظرة سريعة على المحتوى والتبرعات والرسائل. كل تعديل تقوم به يظهر في الموقع فور الحفظ."
        actions={
          <Button variant="outline" icon={RefreshCw} onClick={load} loading={loading}>
            تحديث
          </Button>
        }
      />

      {error && <Alert tone="error" title="تعذر تحميل البيانات">{error}</Alert>}

      {setup && (!setup.tablesReady || !setup.contentSeeded) && (
        <Card title="إكمال الإعداد" description="خطوتان تجهّزان لوحة التحكم للعمل الكامل." icon={DatabaseZap}>
          <ol className="space-y-3">
            <SetupStep
              done={setup.tablesReady}
              title="إنشاء جداول قاعدة البيانات"
              detail="شغّل ملف supabase/schema.sql في محرر SQL الخاص بمشروع Supabase (مرة واحدة فقط)."
              action={<SchemaSetup compact sqlEditorUrl={setup.sqlEditorUrl} onRecheck={load} checking={loading} />}
            />
            <SetupStep
              done={setup.contentSeeded}
              title="استيراد محتوى الموقع الحالي"
              detail="ينسخ النصوص والمجالات والمناطق والمشاريع والحسابات البنكية الموجودة في الموقع إلى قاعدة البيانات لتبدأ التعديل عليها."
              action={
                setup.tablesReady && isAdmin ? (
                  <Button size="sm" icon={DatabaseZap} onClick={() => setSeedOpen(true)}>
                    استيراد المحتوى الافتراضي
                  </Button>
                ) : null
              }
            />
          </ol>
        </Card>
      )}

      {loading && !stats ? (
        <Loading />
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="المشاريع" value={fmtNumber(stats.projects.total)} hint={`${stats.projects.urgent} عاجل · ${stats.projects.active} جارٍ · ${stats.projects.completed} مكتمل`} icon={FolderHeart} />
            <Stat label="إجمالي ما جُمع" value={fmtMoney(stats.projects.raised)} hint={`من هدف ${fmtMoney(stats.projects.goal)}`} icon={Target} tone="green" />
            <Stat label="تبرعات آخر 30 يوماً" value={fmtMoney(stats.donations.last30Usd)} hint={`${fmtNumber(stats.donations.last30Count)} عملية · الإجمالي ${fmtNumber(stats.donations.count)}`} icon={HandCoins} tone="amber" />
            <Stat label="رسائل جديدة" value={fmtNumber(stats.messages.unread)} hint={`من أصل ${fmtNumber(stats.messages.total)} رسالة`} icon={Inbox} tone={stats.messages.unread > 0 ? "red" : "slate"} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card title="آخر الرسائل" icon={Inbox} actions={<Link href="/admin/messages" className="text-xs font-bold text-primary-600 hover:underline">الكل</Link>} bodyClassName="p-0">
              {stats.messages.recent.length === 0 ? (
                <p className="px-5 py-8 text-center text-xs text-slate-500">لا رسائل بعد.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {stats.messages.recent.map((m) => (
                    <li key={m.id}>
                      <Link href={`/admin/messages?id=${m.id}`} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50">
                        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", m.status === "new" ? "bg-primary-500" : "bg-slate-300")} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-bold text-slate-800">{m.name}</span>
                            <Badge>{TOPIC_LABEL[m.topic] ?? m.topic}</Badge>
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-slate-500">{m.message}</span>
                          <span className="mt-1 block text-[10px] text-slate-400">{fmtDate(m.created_at)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="آخر التبرعات" icon={HandCoins} actions={<Link href="/admin/donations" className="text-xs font-bold text-primary-600 hover:underline">الكل</Link>} bodyClassName="p-0">
              {stats.donations.recent.length === 0 ? (
                <p className="px-5 py-8 text-center text-xs text-slate-500">لا تبرعات مسجلة بعد.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {stats.donations.recent.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-800">{d.is_anonymous ? "فاعل خير" : d.donor_name}</span>
                        <span className="block truncate text-xs text-slate-500">{d.project_title ?? "صندوق التبرع العام"}</span>
                      </span>
                      <span className="text-end">
                        <span className="block text-sm font-black text-slate-900 font-latin" dir="ltr">
                          {fmtNumber(d.amount)} {d.currency}
                        </span>
                        <span className="block text-[10px] text-slate-400">{fmtDate(d.created_at)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="آخر النشاط" icon={Layers} actions={<Link href="/admin/activity" className="text-xs font-bold text-primary-600 hover:underline">السجل</Link>} bodyClassName="p-0">
              {stats.activity.length === 0 ? (
                <p className="px-5 py-8 text-center text-xs text-slate-500">لا نشاط مسجل بعد.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {stats.activity.map((a) => (
                    <li key={a.id} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="min-w-0 flex-1 truncate text-xs font-bold text-slate-800">{a.summary ?? a.action}</span>
                        <Badge tone="cyan">{ACTION_LABEL[a.action] ?? a.action}</Badge>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                        <bdi dir="ltr" className="font-latin truncate">{a.actor_email}</bdi>
                        <span>{fmtDate(a.created_at)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat icon={Layers} label="مجالات العمل" value={stats.counts.sectors} href="/admin/sectors" />
            <MiniStat icon={MapPin} label="المناطق" value={stats.counts.regions} href="/admin/regions" />
            <MiniStat icon={HandCoins} label="الحسابات البنكية" value={stats.counts.bankAccounts} href="/admin/banks" />
            <MiniStat icon={FolderHeart} label="مشاريع مميزة" value={stats.projects.featured} href="/admin/projects" />
          </div>
        </>
      ) : null}

      <div>
        <h2 className="mb-3 text-sm font-extrabold text-slate-900">الوصول السريع</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-primary-400">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <item.icon className="w-5 h-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-900">{item.label}</span>
                <span className="block truncate text-[11px] text-slate-500">{item.hint}</span>
              </span>
              <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-primary-500" />
            </Link>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={seedOpen}
        title="استيراد المحتوى الافتراضي"
        message="سيُنسخ محتوى الموقع الحالي (النصوص، المجالات، المناطق، المشاريع، الحسابات البنكية، الإعدادات) إلى قاعدة البيانات. السجلات الموجودة مسبقاً لن تُستبدل."
        confirmLabel="استيراد"
        loading={seeding}
        onCancel={() => setSeedOpen(false)}
        onConfirm={seed}
      />
    </div>
  );
}

function SetupStep({ done, title, detail, action }: { done: boolean; title: string; detail: string; action?: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      {done ? <CheckCircle2 className="mt-0.5 w-5 h-5 shrink-0 text-emerald-500" /> : <Circle className="mt-0.5 w-5 h-5 shrink-0 text-slate-300" />}
      <div className="min-w-0 flex-1">
        <div className={cn("text-sm font-bold", done ? "text-slate-500 line-through" : "text-slate-900")}>{title}</div>
        {!done && <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{detail}</p>}
        {!done && action && <div className="mt-2">{action}</div>}
      </div>
    </li>
  );
}

function MiniStat({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:border-primary-400">
      <Icon className="w-5 h-5 text-primary-500" />
      <span className="flex-1 text-xs font-bold text-slate-600">{label}</span>
      <span className="text-lg font-black text-slate-900 font-latin">{fmtNumber(value)}</span>
    </Link>
  );
}
