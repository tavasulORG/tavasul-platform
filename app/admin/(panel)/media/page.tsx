"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, FileText, Film, Image as ImageIcon, Search, Trash2 } from "lucide-react";
import type { MediaItem } from "@/types";
import { adminApi, type MediaFolder } from "@/lib/adminClient";
import { FOLDER_LABEL, MediaThumb } from "@/components/admin/MediaPicker";
import { UploadBox } from "@/components/admin/fields";
import { Alert, Button, Card, ConfirmDialog, EmptyState, Input, Loading, PageHeader, Tabs, cn, errorMessage, fmtBytes, fmtDate, useToast } from "@/components/admin/ui";

const FOLDERS: { id: MediaFolder; icon: typeof ImageIcon }[] = [
  { id: "images", icon: ImageIcon },
  { id: "documents", icon: FileText },
  { id: "videos", icon: Film },
];

export default function AdminMediaPage() {
  const { toast } = useToast();
  const [folder, setFolder] = useState<MediaFolder>("images");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminApi.media.list(folder);
      setItems(data);
      setSelected(new Set());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.name.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const toggle = (path: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await adminApi.media.remove(Array.from(selected));
      toast({ tone: "success", title: `تم حذف ${selected.size} ${selected.size === 1 ? "ملف" : "ملفات"}` });
      setConfirm(false);
      await load();
    } catch (err) {
      toast({ tone: "error", title: "تعذر الحذف", description: errorMessage(err) });
    } finally {
      setDeleting(false);
    }
  };

  const totalSize = items.reduce((n, i) => n + i.size, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="مكتبة الوسائط"
        description="كل الملفات المرفوعة من لوحة التحكم. الصور المحذوفة هنا تختفي من الصفحات التي تستخدمها."
        actions={
          selected.size > 0 ? (
            <Button variant="danger" icon={Trash2} onClick={() => setConfirm(true)}>
              حذف المحدد ({selected.size})
            </Button>
          ) : undefined
        }
      />

      <Tabs tabs={FOLDERS.map((f) => ({ id: f.id, label: FOLDER_LABEL[f.id], icon: f.icon }))} value={folder} onChange={(id) => setFolder(id as MediaFolder)} className="w-fit" />

      <UploadBox folder={folder} multiple onUploaded={() => void load()} />

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block flex-1 min-w-[220px] max-w-md">
          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث باسم الملف..." className="ps-9" />
        </label>
        <span className="text-xs text-slate-500">
          {items.length} ملف · {fmtBytes(totalSize)}
        </span>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={ImageIcon} title={items.length === 0 ? "لا ملفات في هذا المجلد" : "لا نتائج"} description="ارفع ملفات من المربع أعلاه؛ تُحفظ في Supabase Storage وتصبح متاحة لكل المحررات." />
        </Card>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map((item) => {
            const isSelected = selected.has(item.path);
            return (
              <li key={item.path} className={cn("group overflow-hidden rounded-2xl border bg-white transition-colors", isSelected ? "border-primary-500 ring-2 ring-primary-200" : "border-slate-200")}>
                <button type="button" onClick={() => toggle(item.path)} className="relative block w-full aspect-square overflow-hidden text-start">
                  <MediaThumb item={item} />
                  <span className={cn("absolute top-2 start-2 flex h-6 w-6 items-center justify-center rounded-md border bg-white/95 transition-opacity", isSelected ? "border-primary-500 text-primary-600 opacity-100" : "border-slate-300 text-transparent opacity-0 group-hover:opacity-100")}>
                    <Check className="w-4 h-4" />
                  </span>
                </button>
                <div className="px-2.5 py-2">
                  <div className="truncate text-[11px] font-semibold text-slate-700 font-latin" dir="ltr" title={item.name}>
                    {item.name}
                  </div>
                  <div className="mt-0.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-latin">{fmtBytes(item.size)}</span>
                    <span>{fmtDate(item.createdAt, false)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <button type="button" onClick={() => copy(item.url)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-100">
                      {copied === item.url ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      نسخ الرابط
                    </button>
                    <a href={item.url} target="_blank" rel="noreferrer" className="ms-auto rounded-md p-1 text-slate-500 hover:bg-slate-100" title="فتح">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={confirm}
        title={`حذف ${selected.size} ${selected.size === 1 ? "ملف" : "ملفات"}؟`}
        message="أي صفحة تستخدم هذه الملفات ستفقدها. لا يمكن التراجع."
        confirmLabel="حذف"
        danger
        loading={deleting}
        onCancel={() => setConfirm(false)}
        onConfirm={remove}
      />
    </div>
  );
}
