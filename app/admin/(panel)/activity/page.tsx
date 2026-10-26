"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { History, RefreshCw, Search } from "lucide-react";
import { adminApi, type Row } from "@/lib/adminClient";
import { Alert, Badge, Button, Card, EmptyState, Input, Loading, PageHeader, Select, Table, Td, Th, errorMessage, fmtDate } from "@/components/admin/ui";

const ACTION_LABEL: Record<string, string> = {
  create: "إضافة",
  update: "تعديل",
  delete: "حذف",
  upload: "رفع ملف",
  seed: "استيراد",
  login: "دخول",
  user: "مستخدمون",
};

const ACTION_TONE: Record<string, "cyan" | "green" | "red" | "amber" | "violet" | "slate"> = {
  create: "green",
  update: "cyan",
  delete: "red",
  upload: "violet",
  seed: "amber",
  user: "slate",
};

const TABLE_LABEL: Record<string, string> = {
  translations: "نصوص الموقع",
  organization_info: "عن تواصل",
  sectors: "المجالات",
  regions: "أين نعمل",
  projects: "المشاريع",
  bank_accounts: "الحسابات البنكية",
  site_settings: "الإعدادات",
  contact_messages: "الرسائل",
  storage: "الوسائط",
  "auth.users": "المستخدمون",
  "*": "كل الجداول",
};

export default function AdminActivityPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("");
  const [actor, setActor] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminApi.list("admin_audit_log", { limit: 500 });
      setRows(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const actors = useMemo(() => Array.from(new Set(rows.map((r) => String(r.actor_email ?? "")).filter(Boolean))).sort(), [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (action && r.action !== action) return false;
      if (actor && r.actor_email !== actor) return false;
      if (!q) return true;
      return `${r.summary ?? ""} ${r.record_id ?? ""} ${r.table_name ?? ""}`.toLowerCase().includes(q);
    });
  }, [rows, query, action, actor]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="سجل النشاط"
        description="كل عملية حفظ أو حذف أو رفع من لوحة التحكم، مع صاحبها ووقتها."
        actions={
          <Button variant="outline" icon={RefreshCw} onClick={load} loading={loading}>
            تحديث
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block flex-1 min-w-[220px] max-w-md">
          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث في الوصف أو المعرّف..." className="ps-9" />
        </label>
        <Select value={action} onChange={(e) => setAction(e.target.value)} className="w-auto">
          <option value="">كل العمليات</option>
          {Object.entries(ACTION_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select value={actor} onChange={(e) => setActor(e.target.value)} className="w-auto font-latin">
          <option value="">كل المستخدمين</option>
          {actors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <Loading />
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState icon={History} title="لا نشاط مسجل" description={rows.length === 0 ? "ستظهر العمليات هنا بعد أول حفظ من لوحة التحكم." : "لا نتائج مطابقة."} />
        </Card>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>الوقت</Th>
              <Th>المستخدم</Th>
              <Th>العملية</Th>
              <Th>القسم</Th>
              <Th>الوصف</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70">
                <Td className="whitespace-nowrap text-xs">{fmtDate(r.created_at)}</Td>
                <Td>
                  <span className="font-latin text-xs" dir="ltr">
                    {r.actor_email}
                  </span>
                </Td>
                <Td>
                  <Badge tone={ACTION_TONE[r.action] ?? "slate"}>{ACTION_LABEL[r.action] ?? r.action}</Badge>
                </Td>
                <Td className="text-xs">{TABLE_LABEL[r.table_name] ?? r.table_name}</Td>
                <Td>
                  <div className="text-xs text-slate-800">{r.summary}</div>
                  {r.record_id && (
                    <div className="text-[10px] text-slate-400 font-latin" dir="ltr">
                      {r.record_id}
                    </div>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
