"use client";

import type { ReactNode } from "react";
import { Wand2 } from "lucide-react";
import type { LocalizedString } from "@/types";
import { slugify } from "@/lib/adminClient";
import { ColorField, FileField, GalleryField, IconField, ImageField, ListField, LocalizedField } from "./fields";
import { Button, Field, Input, Select, Switch, Textarea, cn } from "./ui";

/* ----------------------------------------------------------------------------
 * Schema-driven form. Each editor declares its fields once; the form renders
 * them, keeps the value object updated and stays agnostic of the content type.
 * ------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

type Width = "full" | "half" | "third";

interface Base {
  key: string;
  label: string;
  hint?: string;
  required?: boolean;
  width?: Width;
}

export type FieldSchema =
  | (Base & { type: "text"; placeholder?: string; dir?: "ltr" | "rtl"; mono?: boolean })
  | (Base & { type: "textarea"; rows?: number; placeholder?: string; dir?: "ltr" | "rtl" })
  | (Base & { type: "number"; min?: number; max?: number; step?: number })
  | (Base & { type: "slug"; /** Key of a text or localized field to derive the slug from. */ source?: string })
  | (Base & { type: "date" })
  | (Base & { type: "boolean" })
  | (Base & { type: "select"; options: { value: string; label: string }[] })
  | (Base & { type: "localized"; multiline?: boolean; rows?: number; placeholder?: string })
  | (Base & { type: "image"; aspect?: "video" | "square" | "wide" | "portrait" })
  | (Base & { type: "file"; folder?: "documents" | "videos"; /** Key that receives the uploaded file's size label, e.g. "3.4 MB". */ sizeKey?: string })
  | (Base & { type: "gallery" })
  | (Base & { type: "icon" })
  | (Base & { type: "color" })
  | (Base & { type: "group"; fields: FieldSchema[] })
  | (Base & {
      type: "list";
      /** Fields of each item; ignored when itemKind is "localized". */
      item?: FieldSchema[];
      /** "localized": each item is itself a three-language string. */
      itemKind?: "object" | "localized";
      multiline?: boolean;
      newItem?: () => Row;
      itemTitle?: (item: Row, index: number) => string;
      addLabel?: string;
      max?: number;
    })
  | { type: "section"; key: string; label: string; description?: string; fields: FieldSchema[] };

const WIDTH: Record<Width, string> = { full: "md:col-span-6", half: "md:col-span-3", third: "md:col-span-2" };

interface SchemaFormProps {
  schema: FieldSchema[];
  value: Row;
  onChange: (next: Row) => void;
  className?: string;
}

export function SchemaForm({ schema, value, onChange, className }: SchemaFormProps) {

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-5", className)}>
      {schema.map((field) => (
        <div key={field.key} className={cn("min-w-0", field.type === "section" ? "md:col-span-6" : WIDTH[field.width ?? "full"])}>
          {renderField(field, value, onChange)}
        </div>
      ))}
    </div>
  );
}

function textOf(source: unknown): string {
  if (typeof source === "string") return source;
  if (source && typeof source === "object") {
    const l = source as Partial<LocalizedString>;
    return l.en || l.tr || l.ar || "";
  }
  return "";
}

function renderField(field: FieldSchema, row: Row, replace: (next: Row) => void): ReactNode {
  const set = (key: string, fieldValue: unknown) => replace({ ...row, [key]: fieldValue });

  switch (field.type) {
    case "section":
      return (
        <fieldset className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
          <legend className="px-2 text-sm font-extrabold text-slate-900">{field.label}</legend>
          {field.description && <p className="-mt-1 mb-4 px-2 text-xs text-slate-500 leading-relaxed">{field.description}</p>}
          <SchemaForm schema={field.fields} value={row} onChange={replace} />
        </fieldset>
      );

    case "group": {
      const inner: Row = (row[field.key] as Row) ?? {};
      return (
        <Field label={field.label} hint={field.hint}>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <SchemaForm schema={field.fields} value={inner} onChange={(next) => set(field.key, next)} />
          </div>
        </Field>
      );
    }

    case "text":
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Input
            dir={field.dir}
            value={row[field.key] ?? ""}
            onChange={(e) => set(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={cn((field.mono || field.dir === "ltr") && "font-latin")}
          />
        </Field>
      );

    case "textarea":
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Textarea dir={field.dir} rows={field.rows ?? 4} value={row[field.key] ?? ""} onChange={(e) => set(field.key, e.target.value)} placeholder={field.placeholder} />
        </Field>
      );

    case "number":
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Input
            type="number"
            dir="ltr"
            min={field.min}
            max={field.max}
            step={field.step}
            value={row[field.key] ?? ""}
            onChange={(e) => set(field.key, e.target.value === "" ? 0 : Number(e.target.value))}
            className="font-latin"
          />
        </Field>
      );

    case "slug":
      return (
        <Field label={field.label} hint={field.hint ?? "جزء الرابط بالإنجليزية: أحرف صغيرة وأرقام وشرطات فقط."} required={field.required}>
          <div className="flex gap-2">
            <Input
              dir="ltr"
              value={row[field.key] ?? ""}
              onChange={(e) => set(field.key, e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              className="font-latin"
            />
            {field.source && (
              <Button variant="outline" icon={Wand2} title="توليد من العنوان" onClick={() => set(field.key, slugify(textOf(row[field.source!])))}>
                توليد
              </Button>
            )}
          </div>
        </Field>
      );

    case "date":
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Input type="date" dir="ltr" value={(row[field.key] ?? "").slice(0, 10)} onChange={(e) => set(field.key, e.target.value)} className="font-latin" />
        </Field>
      );

    case "boolean":
      return (
        <div className="pt-1">
          <Switch checked={Boolean(row[field.key])} onChange={(checked) => set(field.key, checked)} label={field.label} description={field.hint} />
        </div>
      );

    case "select":
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Select value={row[field.key] ?? ""} onChange={(e) => set(field.key, e.target.value)}>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      );

    case "localized":
      return (
        <LocalizedField
          label={field.label}
          hint={field.hint}
          required={field.required}
          multiline={field.multiline}
          rows={field.rows}
          placeholder={field.placeholder}
          value={row[field.key]}
          onChange={(next) => set(field.key, next)}
        />
      );

    case "image":
      return <ImageField label={field.label} hint={field.hint} required={field.required} aspect={field.aspect} value={row[field.key]} onChange={(url) => set(field.key, url)} />;

    case "file":
      return (
        <FileField
          label={field.label}
          hint={field.hint}
          folder={field.folder}
          value={row[field.key]}
          onChange={(url, meta) => {
            if (field.sizeKey && meta) {
              const mb = meta.size / 1024 / 1024;
              const size = mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(meta.size / 1024))} KB`;
              replace({ ...row, [field.key]: url, [field.sizeKey]: size });
            } else {
              set(field.key, url);
            }
          }}
        />
      );

    case "gallery":
      return <GalleryField label={field.label} hint={field.hint} value={row[field.key]} onChange={(urls) => set(field.key, urls)} />;

    case "icon":
      return <IconField label={field.label} hint={field.hint} value={row[field.key]} onChange={(name) => set(field.key, name)} />;

    case "color":
      return <ColorField label={field.label} hint={field.hint} value={row[field.key]} onChange={(hex) => set(field.key, hex)} />;

    case "list": {
      const localizedItems = field.itemKind === "localized";
      return (
        <ListField<Row>
          label={field.label}
          hint={field.hint}
          value={row[field.key]}
          onChange={(items) => set(field.key, items)}
          newItem={field.newItem ?? (localizedItems ? () => EMPTY_LOCALIZED() : () => ({}))}
          itemTitle={field.itemTitle ?? (localizedItems ? (item, index) => localizedTitle(item, `عنصر ${index + 1}`) : undefined)}
          addLabel={field.addLabel}
          max={field.max}
          collapsible={!localizedItems}
          renderItem={(item, update) =>
            localizedItems ? (
              <LocalizedField label="النص" multiline={field.multiline} rows={2} value={item as LocalizedString} onChange={(next) => update(next as unknown as Row)} />
            ) : (
              <SchemaForm schema={field.item ?? []} value={item} onChange={update} />
            )
          }
        />
      );
    }

    default:
      return null;
  }
}

/** First non-empty language of a localized value, for list item titles. */
export function localizedTitle(value: unknown, fallback = ""): string {
  if (value && typeof value === "object") {
    const l = value as Partial<LocalizedString>;
    return l.ar || l.en || l.tr || fallback;
  }
  return typeof value === "string" && value ? value : fallback;
}

export const EMPTY_LOCALIZED = (): LocalizedString => ({ ar: "", tr: "", en: "" });
