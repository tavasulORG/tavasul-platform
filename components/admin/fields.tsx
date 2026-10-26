"use client";

import { useRef, useState, type DragEvent, type ReactNode } from "react";
import {
  AlertTriangle,
  Baby,
  Building2,
  ChevronDown,
  ChevronUp,
  Droplets,
  FileText,
  FolderOpen,
  GraduationCap,
  HandHeart,
  Heart,
  HeartPulse,
  Home,
  Image as ImageIcon,
  Link2,
  Plus,
  Stethoscope,
  Tent,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  Wheat,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Language, LocalizedString } from "@/types";
import { adminApi, type MediaFolder, type UploadResult } from "@/lib/adminClient";
import { FOLDER_ACCEPT, MediaPicker } from "./MediaPicker";
import { Button, Field, Input, Textarea, cn, errorMessage, fmtBytes, useToast } from "./ui";

/* ----------------------------------------------------------------------------
 * Form fields shared by every editor: three-language text, file pickers that
 * upload from the device, sortable lists, icon and colour pickers.
 * ------------------------------------------------------------------------- */

export const LANGS: { id: Language; label: string; dir: "rtl" | "ltr" }[] = [
  { id: "ar", label: "العربية", dir: "rtl" },
  { id: "tr", label: "Türkçe", dir: "ltr" },
  { id: "en", label: "English", dir: "ltr" },
];

function LangBadge({ lang }: { lang: Language }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 font-latin uppercase">
      {lang}
    </span>
  );
}

/* Localized text */

interface LocalizedFieldProps {
  label: ReactNode;
  value: LocalizedString | undefined;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
  rows?: number;
  hint?: ReactNode;
  required?: boolean;
  placeholder?: string;
}

export function LocalizedField({ label, value, onChange, multiline, rows = 3, hint, required, placeholder }: LocalizedFieldProps) {
  const current: LocalizedString = { ar: value?.ar ?? "", tr: value?.tr ?? "", en: value?.en ?? "" };
  const set = (lang: Language, text: string) => onChange({ ...current, [lang]: text });

  return (
    <Field label={label} hint={hint} required={required}>
      <div className="grid grid-cols-1 gap-2">
        {LANGS.map((lang) => (
          <div key={lang.id} className="relative">
            <span className={cn("absolute top-2 z-10", lang.dir === "ltr" ? "right-2" : "left-2")}>
              <LangBadge lang={lang.id} />
            </span>
            {multiline ? (
              <Textarea
                dir={lang.dir}
                rows={rows}
                value={current[lang.id]}
                onChange={(e) => set(lang.id, e.target.value)}
                placeholder={placeholder ?? lang.label}
                className={cn(lang.dir === "ltr" ? "pr-12 font-latin" : "pl-12")}
              />
            ) : (
              <Input
                dir={lang.dir}
                value={current[lang.id]}
                onChange={(e) => set(lang.id, e.target.value)}
                placeholder={placeholder ?? lang.label}
                className={cn(lang.dir === "ltr" ? "pr-12 font-latin" : "pl-12")}
              />
            )}
          </div>
        ))}
      </div>
    </Field>
  );
}

/* Uploads */

interface UploadBoxProps {
  folder: MediaFolder;
  onUploaded: (result: UploadResult) => void;
  multiple?: boolean;
  children?: ReactNode;
  className?: string;
  compact?: boolean;
}

/** Click-to-choose and drag-and-drop area that uploads straight to the media bucket. */
export function UploadBox({ folder, onUploaded, multiple, children, className, compact }: UploadBoxProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const handleFiles = async (list: FileList | File[] | null) => {
    const files = Array.from(list ?? []);
    if (files.length === 0) return;
    const batch = multiple ? files : files.slice(0, 1);
    setProgress(0);
    try {
      for (let i = 0; i < batch.length; i++) {
        const result = await adminApi.upload(batch[i], folder, (fraction) => setProgress((i + fraction) / batch.length));
        onUploaded(result);
      }
      toast({ tone: "success", title: batch.length === 1 ? "تم رفع الملف" : `تم رفع ${batch.length} ملفات` });
    } catch (err) {
      toast({ tone: "error", title: "فشل الرفع", description: errorMessage(err) });
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    void handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-colors",
        dragging ? "border-primary-500 bg-primary-50" : "border-slate-300 bg-slate-50 hover:border-primary-400",
        className
      )}
    >
      <input ref={inputRef} type="file" multiple={multiple} accept={FOLDER_ACCEPT[folder]} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn("flex w-full flex-col items-center justify-center gap-1.5 text-center", compact ? "px-3 py-3" : "px-4 py-6")}
      >
        <Upload className={cn("text-primary-500", compact ? "w-4 h-4" : "w-6 h-6")} />
        {children ?? (
          <>
            <span className="text-xs font-bold text-slate-700">اختر ملفاً من جهازك أو اسحبه هنا</span>
            {!compact && <span className="text-[11px] text-slate-500">سيُرفع مباشرة إلى مكتبة الوسائط</span>}
          </>
        )}
      </button>
      {progress !== null && (
        <div className="absolute inset-x-0 bottom-0 h-1.5 overflow-hidden rounded-b-xl bg-slate-200">
          <div className="h-full bg-primary-500 transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      )}
    </div>
  );
}

interface ImageFieldProps {
  label: ReactNode;
  value: string | undefined;
  onChange: (url: string) => void;
  hint?: ReactNode;
  required?: boolean;
  /** Preview box shape. */
  aspect?: "video" | "square" | "wide" | "portrait";
  folder?: MediaFolder;
}

const ASPECT: Record<NonNullable<ImageFieldProps["aspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  portrait: "aspect-[3/4]",
};

/** Image chosen from the device (upload) or from the media library; a pasted URL is a fallback. */
export function ImageField({ label, value, onChange, hint, required, aspect = "video", folder = "images" }: ImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [urlMode, setUrlMode] = useState(false);

  return (
    <Field label={label} hint={hint} required={required}>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,220px)_1fr]">
        <div className={cn("relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100", ASPECT[aspect])}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              title="إزالة الصورة"
              className="absolute top-2 end-2 rounded-lg bg-white/90 p-1.5 text-red-600 shadow hover:bg-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          <UploadBox folder={folder} onUploaded={(result) => onChange(result.url)} compact>
            <span className="text-xs font-bold text-slate-700">اختر صورة من جهازك أو اسحبها هنا</span>
          </UploadBox>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" icon={FolderOpen} onClick={() => setPickerOpen(true)}>
              من المكتبة
            </Button>
            <Button size="sm" variant="ghost" icon={Link2} onClick={() => setUrlMode((v) => !v)}>
              رابط خارجي
            </Button>
          </div>
          {urlMode && (
            <Input dir="ltr" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className="font-latin text-xs" />
          )}
        </div>
      </div>
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} folder={folder} onSelect={(item) => onChange(item.url)} />
    </Field>
  );
}

interface FileFieldProps {
  label: ReactNode;
  value: string | undefined;
  onChange: (url: string, meta?: UploadResult) => void;
  hint?: ReactNode;
  folder?: MediaFolder;
}

/** Document or video chosen from the device or the library. */
export function FileField({ label, value, onChange, hint, folder = "documents" }: FileFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const name = value ? decodeURIComponent(value.split("/").pop() ?? value) : "";

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {value ? (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <FileText className="w-4 h-4" />
            </span>
            <a href={value} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-xs font-semibold text-primary-700 font-latin hover:underline" dir="ltr">
              {name}
            </a>
            <button type="button" onClick={() => onChange("")} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="إزالة">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : null}
        <UploadBox folder={folder} onUploaded={(result) => onChange(result.url, result)} compact>
          <span className="text-xs font-bold text-slate-700">{value ? "استبدال الملف من جهازك" : "اختر ملفاً من جهازك أو اسحبه هنا"}</span>
        </UploadBox>
        <Button size="sm" variant="outline" icon={FolderOpen} onClick={() => setPickerOpen(true)}>
          من المكتبة
        </Button>
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        folder={folder}
        onSelect={(item) => onChange(item.url, { url: item.url, path: item.path, name: item.name, size: item.size, mimeType: item.mimeType })}
      />
    </Field>
  );
}

interface GalleryFieldProps {
  label: ReactNode;
  value: string[] | undefined;
  onChange: (urls: string[]) => void;
  hint?: ReactNode;
}

/** Several images with reorder and remove; uploads from the device add to the end. */
export function GalleryField({ label, value, onChange, hint }: GalleryFieldProps) {
  const urls = value ?? [];
  const [pickerOpen, setPickerOpen] = useState(false);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= urls.length) return;
    const next = [...urls];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {urls.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {urls.map((url, index) => (
              <li key={`${url}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-slate-900/80 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(index, index - 1)} className="rounded-md bg-white/90 p-1 text-slate-700 hover:bg-white" title="قبل">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => move(index, index + 1)} className="rounded-md bg-white/90 p-1 text-slate-700 hover:bg-white" title="بعد">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange(urls.filter((_, i) => i !== index))}
                    className="rounded-md bg-white/90 p-1 text-red-600 hover:bg-white"
                    title="إزالة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="absolute top-1.5 start-1.5 rounded-md bg-white/90 px-1.5 text-[10px] font-bold font-latin text-slate-700">{index + 1}</span>
              </li>
            ))}
          </ul>
        )}
        <UploadBox folder="images" multiple onUploaded={(result) => onChange([...(value ?? []), result.url])} compact>
          <span className="text-xs font-bold text-slate-700">أضف صوراً من جهازك (يمكن اختيار عدة صور)</span>
        </UploadBox>
        <Button size="sm" variant="outline" icon={FolderOpen} onClick={() => setPickerOpen(true)}>
          إضافة من المكتبة
        </Button>
      </div>
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} folder="images" onSelect={(item) => onChange([...(value ?? []), item.url])} />
    </Field>
  );
}

/* Lists */

interface ListFieldProps<T> {
  label: ReactNode;
  value: T[] | undefined;
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (next: T) => void, index: number) => ReactNode;
  itemTitle?: (item: T, index: number) => string;
  addLabel?: string;
  hint?: ReactNode;
  max?: number;
  /** Items start collapsed; the title row expands them. */
  collapsible?: boolean;
}

/** Ordered list of sub-forms with add, remove and move up/down. */
export function ListField<T>({ label, value, onChange, newItem, renderItem, itemTitle, addLabel = "إضافة عنصر", hint, max, collapsible = true }: ListFieldProps<T>) {
  const items = value ?? [];
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const update = (index: number, next: T) => onChange(items.map((item, i) => (i === index ? next : item)));
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {items.map((item, index) => {
          const expanded = !collapsible || open[index] !== false;
          const title = itemTitle?.(item, index) || `عنصر ${index + 1}`;
          return (
            <div key={index} className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold font-latin text-primary-700">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => collapsible && setOpen((o) => ({ ...o, [index]: !expanded }))}
                  className="min-w-0 flex-1 truncate text-start text-xs font-bold text-slate-800"
                >
                  {title}
                </button>
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" title="تحريك لأعلى">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => move(index, index + 1)} disabled={index === items.length - 1} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" title="تحريك لأسفل">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => remove(index)} className="rounded-md p-1 text-red-600 hover:bg-red-50" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {expanded && <div className="space-y-4 border-t border-slate-100 px-3 py-3">{renderItem(item, (next) => update(index, next), index)}</div>}
            </div>
          );
        })}
        {(max === undefined || items.length < max) && (
          <Button
            size="sm"
            variant="outline"
            icon={Plus}
            onClick={() => {
              onChange([...items, newItem()]);
              setOpen((o) => ({ ...o, [items.length]: true }));
            }}
          >
            {addLabel}
          </Button>
        )}
      </div>
    </Field>
  );
}

/* Icons */

export const ICON_CHOICES: Record<string, LucideIcon> = {
  GraduationCap,
  HeartPulse,
  AlertTriangle,
  TrendingUp,
  Users,
  Droplets,
  Home,
  Tent,
  HandHeart,
  Stethoscope,
  Wheat,
  Baby,
  Building2,
  Heart,
};

export function IconPreview({ name, className }: { name: string | undefined; className?: string }) {
  const Icon = (name && ICON_CHOICES[name]) || Users;
  return <Icon className={className} />;
}

export function IconField({ label, value, onChange, hint }: { label: ReactNode; value: string | undefined; onChange: (name: string) => void; hint?: ReactNode }) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap gap-2">
        {Object.entries(ICON_CHOICES).map(([name, Icon]) => {
          const active = value === name;
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onChange(name)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
                active ? "border-primary-500 bg-primary-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700"
              )}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </Field>
  );
}

/* Colour */

export function ColorField({ label, value, onChange, hint }: { label: ReactNode; value: string | undefined; onChange: (hex: string) => void; hint?: ReactNode }) {
  const hex = value && /^#[0-9a-f]{6}$/i.test(value) ? value : "#0284c7";
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 bg-white p-1" />
        <Input dir="ltr" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="#0284c7" className="font-latin max-w-[140px]" />
      </div>
    </Field>
  );
}

/* Small helpers reused by editors */

export function sizeLabel(result?: UploadResult): string {
  return result ? fmtBytes(result.size) : "";
}
