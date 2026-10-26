"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Archive, Inbox, Mail, MailOpen, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/types";
import { adminApi, type Row } from "@/lib/adminClient";
import { Alert, Badge, Button, Card, ConfirmDialog, EmptyState, Input, Loading, PageHeader, Tabs, Textarea, cn, errorMessage, fmtDate, useToast } from "@/components/admin/ui";

const TOPIC_LABEL: Record<string, string> = {
  donation: "تبرع",
  project: "مشروع",
  partnership: "شراكة",
  volunteer: "تطوع",
  media: "إعلام",
  other: "أخرى",
};

const STATUS_LABEL: Record<ContactMessage["status"], string> = { new: "جديدة", read: "مقروءة", archived: "مؤرشفة" };

function fromRow(row: Row): ContactMessage {
  return {
    id: String(row.id),
    reference: row.reference ?? "",
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? null,
    topic: row.topic ?? "other",
    message: row.message ?? "",
    language: row.language ?? "ar",
    status: row.status === "read" || row.status === "archived" ? row.status : "new",
    notes: row.notes ?? null,
    createdAt: row.created_at ?? "",
  };
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MessagesInbox />
    </Suspense>
  );
}

function MessagesInbox() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"inbox" | "new" | "archived">("inbox");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("id"));
  const [notes, setNotes] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminApi.list("contact_messages", { limit: 1000 });
      setItems(data.map(fromRow));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(
    () => ({
      inbox: items.filter((m) => m.status !== "archived").length,
      new: items.filter((m) => m.status === "new").length,
      archived: items.filter((m) => m.status === "archived").length,
    }),
    [items]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((m) => {
      if (filter === "inbox" && m.status === "archived") return false;
      if (filter === "new" && m.status !== "new") return false;
      if (filter === "archived" && m.status !== "archived") return false;
      if (!q) return true;
      return `${m.name} ${m.email} ${m.phone ?? ""} ${m.message} ${m.reference}`.toLowerCase().includes(q);
    });
  }, [items, filter, query]);

  const selected = items.find((m) => m.id === selectedId) ?? null;

  useEffect(() => {
    setNotes(selected?.notes ?? "");
  }, [selected?.id, selected?.notes]);

  const patch = async (id: string, changes: Partial<Pick<ContactMessage, "status" | "notes">>, summary: string) => {
    setBusy(true);
    try {
      await adminApi.update("contact_messages", id, changes, summary);
      setItems((list) => list.map((m) => (m.id === id ? { ...m, ...changes } : m)));
    } catch (err) {
      toast({ tone: "error", title: "تعذر التحديث", description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const open = (message: ContactMessage) => {
    setSelectedId(message.id);
    router.replace(`/admin/messages?id=${message.id}`);
    if (message.status === "new") void patch(message.id, { status: "read" }, `قراءة رسالة ${message.reference}`);
  };

  const remove = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await adminApi.remove("contact_messages", selected.id, `حذف رسالة ${selected.reference}`);
      setItems((list) => list.filter((m) => m.id !== selected.id));
      setSelectedId(null);
      setConfirmDelete(false);
      toast({ tone: "success", title: "تم حذف الرسالة" });
    } catch (err) {
      toast({ tone: "error", title: "تعذر الحذف", description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="الرسائل الواردة"
        description="رسائل نموذج «تواصل معنا». افتح الرسالة لقراءتها والرد عبر البريد أو واتساب."
        actions={
          <Button variant="outline" icon={RefreshCw} onClick={load} loading={loading}>
            تحديث
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          tabs={[
            { id: "inbox", label: "الوارد", icon: Inbox, count: counts.inbox },
            { id: "new", label: "جديدة", icon: Mail, count: counts.new },
            { id: "archived", label: "الأرشيف", icon: Archive, count: counts.archived },
          ]}
          value={filter}
          onChange={(id) => setFilter(id as typeof filter)}
        />
        <label className="relative block flex-1 min-w-[220px] max-w-md">
          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث بالاسم أو البريد أو النص..." className="ps-9" />
        </label>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-5" bodyClassName="p-0">
          {loading ? (
            <Loading />
          ) : visible.length === 0 ? (
            <EmptyState icon={Inbox} title="لا رسائل" description={items.length === 0 ? "عندما يرسل زائر رسالة من صفحة تواصل معنا ستظهر هنا." : "لا نتائج مطابقة."} />
          ) : (
            <ul className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
              {visible.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => open(m)}
                    className={cn("flex w-full items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-slate-50", selectedId === m.id && "bg-primary-50/60")}
                  >
                    <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", m.status === "new" ? "bg-primary-500" : "bg-transparent")} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className={cn("truncate text-sm", m.status === "new" ? "font-extrabold text-slate-900" : "font-semibold text-slate-700")}>{m.name}</span>
                        <span className="shrink-0 text-[10px] text-slate-400">{fmtDate(m.createdAt, false)}</span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-2">
                        <Badge>{TOPIC_LABEL[m.topic] ?? m.topic}</Badge>
                        <span className="truncate text-xs text-slate-500">{m.message}</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="lg:col-span-7">
          {selected ? (
            <Card
              title={selected.name}
              description={
                <span className="flex flex-wrap items-center gap-2">
                  <Badge tone="cyan">{TOPIC_LABEL[selected.topic] ?? selected.topic}</Badge>
                  <Badge tone={selected.status === "new" ? "amber" : selected.status === "archived" ? "slate" : "green"}>{STATUS_LABEL[selected.status]}</Badge>
                  <span className="font-latin text-[11px]" dir="ltr">
                    {selected.reference}
                  </span>
                  <span>{fmtDate(selected.createdAt)}</span>
                </span>
              }
              actions={
                <>
                  {selected.status === "archived" ? (
                    <Button size="sm" variant="outline" icon={MailOpen} disabled={busy} onClick={() => patch(selected.id, { status: "read" }, `إعادة رسالة ${selected.reference} إلى الوارد`)}>
                      إعادة إلى الوارد
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" icon={Archive} disabled={busy} onClick={() => patch(selected.id, { status: "archived" }, `أرشفة رسالة ${selected.reference}`)}>
                      أرشفة
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" icon={Trash2} className="text-red-600" disabled={busy} onClick={() => setConfirmDelete(true)}>
                    حذف
                  </Button>
                </>
              }
            >
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`رد على رسالتكم ${selected.reference}`)}`} className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-xs font-bold text-white hover:bg-primary-600">
                    <Mail className="w-4 h-4" />
                    الرد عبر البريد
                  </a>
                  {selected.phone && (
                    <>
                      <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-primary-400">
                        <Phone className="w-4 h-4" />
                        واتساب
                      </a>
                      <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-primary-400">
                        <Phone className="w-4 h-4" />
                        اتصال
                      </a>
                    </>
                  )}
                </div>

                <dl className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <dt className="text-slate-500">البريد الإلكتروني</dt>
                    <dd className="font-latin font-bold text-slate-800" dir="ltr">{selected.email}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">الهاتف</dt>
                    <dd className="font-latin font-bold text-slate-800" dir="ltr">{selected.phone || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">لغة الزائر</dt>
                    <dd className="font-bold text-slate-800 uppercase font-latin">{selected.language}</dd>
                  </div>
                </dl>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">{selected.message}</div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">ملاحظات داخلية</label>
                  <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="مثال: تم الرد بتاريخ ... / تحويل إلى قسم المشاريع" />
                  <Button size="sm" variant="outline" disabled={busy || notes === (selected.notes ?? "")} onClick={() => patch(selected.id, { notes }, `ملاحظة على رسالة ${selected.reference}`)}>
                    حفظ الملاحظة
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <EmptyState icon={MailOpen} title="اختر رسالة" description="تظهر تفاصيل الرسالة وأزرار الرد هنا." />
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog open={confirmDelete} title="حذف الرسالة؟" message="ستُحذف الرسالة نهائياً." confirmLabel="حذف" danger loading={busy} onCancel={() => setConfirmDelete(false)} onConfirm={remove} />
    </div>
  );
}
