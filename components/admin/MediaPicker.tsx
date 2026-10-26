"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileText, Film, Image as ImageIcon, Search, Upload } from "lucide-react";
import type { MediaItem } from "@/types";
import { adminApi, type MediaFolder } from "@/lib/adminClient";
import { Button, EmptyState, Input, Loading, Modal, cn, errorMessage, fmtBytes, useToast } from "./ui";

export const FOLDER_ACCEPT: Record<MediaFolder, string> = {
  images: "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif",
  documents: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,application/pdf",
  videos: "video/mp4,video/webm",
};

export const FOLDER_LABEL: Record<MediaFolder, string> = { images: "الصور", documents: "المستندات", videos: "الفيديو" };

/** Uploads several files in sequence and reports each result. */
export async function uploadFiles(
  files: File[],
  folder: MediaFolder,
  onProgress?: (index: number, fraction: number) => void
) {
  const results: Awaited<ReturnType<typeof adminApi.upload>>[] = [];
  for (let i = 0; i < files.length; i++) {
    results.push(await adminApi.upload(files[i], folder, (fraction) => onProgress?.(i, fraction)));
  }
  return results;
}

export function MediaThumb({ item, className }: { item: MediaItem; className?: string }) {
  const isImage = item.mimeType.startsWith("image/") || /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(item.name);
  const isVideo = item.mimeType.startsWith("video/") || /\.(mp4|webm)$/i.test(item.name);
  if (isImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.url} alt={item.name} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  }
  return (
    <div className={cn("flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 text-slate-500", className)}>
      {isVideo ? <Film className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
      <span className="px-2 text-[10px] font-latin truncate max-w-full" dir="ltr">
        {item.name.split(".").pop()?.toUpperCase()}
      </span>
    </div>
  );
}

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  folder: MediaFolder;
}

/** Browse the media library or upload, then pick one file. */
export function MediaPicker({ open, onClose, onSelect, folder }: MediaPickerProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.media.list(folder);
      setItems(data);
    } catch (err) {
      toast({ tone: "error", title: "تعذر تحميل المكتبة", description: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [folder, toast]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((item) => item.name.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const onFiles = async (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (files.length === 0) return;
    setUploading(0);
    try {
      const results = await uploadFiles(files, folder, (index, fraction) => setUploading((index + fraction) / files.length));
      toast({ tone: "success", title: files.length === 1 ? "تم رفع الملف" : `تم رفع ${files.length} ملفات` });
      await load();
      if (results.length === 1) {
        const r = results[0];
        onSelect({ path: r.path, name: r.name, url: r.url, size: r.size, mimeType: r.mimeType, createdAt: new Date().toISOString() });
        onClose();
      }
    } catch (err) {
      toast({ tone: "error", title: "فشل الرفع", description: errorMessage(err) });
    } finally {
      setUploading(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={`مكتبة الوسائط · ${FOLDER_LABEL[folder]}`}
      description="اختر ملفاً مرفوعاً سابقاً أو ارفع ملفاً جديداً من جهازك."
      footer={
        <Button variant="ghost" onClick={onClose}>
          إغلاق
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <label className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث باسم الملف..." className="ps-9" />
        </label>
        <input ref={inputRef} type="file" multiple accept={FOLDER_ACCEPT[folder]} className="hidden" onChange={(e) => onFiles(e.target.files)} />
        <Button icon={Upload} onClick={() => inputRef.current?.click()} loading={uploading !== null}>
          {uploading !== null ? `جارٍ الرفع ${Math.round(uploading * 100)}%` : "رفع من الجهاز"}
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={items.length === 0 ? "المكتبة فارغة" : "لا نتائج"}
          description={items.length === 0 ? "ارفع أول ملف من زر «رفع من الجهاز»." : "جرّب كلمة بحث أخرى."}
        />
      ) : (
        <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="group block w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-start transition-colors hover:border-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                <div className="aspect-square overflow-hidden">
                  <MediaThumb item={item} className="transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="px-2 py-1.5">
                  <div className="truncate text-[11px] font-semibold text-slate-700 font-latin" dir="ltr" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-latin">{fmtBytes(item.size)}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
