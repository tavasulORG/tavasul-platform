"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ListOptions, Row } from "@/lib/adminClient";
import { adminApi } from "@/lib/adminClient";
import { useContent } from "@/context/ContentContext";
import type { CountryRegion, Sector } from "@/types";
import type { PreviewTarget } from "./PreviewFrame";
import { EditorLayout } from "./EditorLayout";
import { SchemaForm, type FieldSchema } from "./SchemaForm";
import { useDraft } from "./useDraft";
import { useAdminList, useAdminRecord } from "./useRecords";
import { Alert, Card, EmptyState, Loading, errorMessage, useToast } from "./ui";

/* ----------------------------------------------------------------------------
 * Generic editor of one record (sector, region, project, bank account): loads
 * the row, keeps a draft, previews the real page with the draft injected, and
 * saves through the admin API.
 * ------------------------------------------------------------------------- */

/** Site content the schema may need for select options. */
export interface EditorContext {
  sectors: Sector[];
  regions: CountryRegion[];
}

export interface RecordEditorConfig<T extends { id: string }> {
  table: string;
  /** Order of the saved list used for previews and sort numbers. */
  listOptions?: ListOptions;
  /** Singular label, e.g. "المجال". */
  label: string;
  listHref: string;
  fromRow: (row: Row) => T;
  toRow: (model: T, sortOrder: number) => Row;
  /** Sort order column read from the raw row (new records go last). */
  sortOrderOf: (row: Row) => number;
  create: () => T;
  schema: FieldSchema[] | ((context: EditorContext) => FieldSchema[]);
  /** Last chance to derive fields before the row is written. */
  beforeSave?: (draft: T, context: EditorContext) => T;
  titleOf: (model: T) => string;
  /** Page and overrides to preview the draft; `all` is the saved list with the draft merged in. */
  preview: (draft: T, all: T[]) => PreviewTarget;
  /** Returns an error message, or null when the draft can be saved. */
  validate?: (draft: T, others: T[]) => string | null;
  /** Called after a successful save or delete. */
  afterSave?: () => void;
}

export function RecordEditor<T extends { id: string }>({ config, id }: { config: RecordEditorConfig<T>; id: string }) {
  const isNew = id === "new";
  const router = useRouter();
  const { toast } = useToast();
  const { refresh, sectors, regions } = useContent();
  const context = useMemo<EditorContext>(() => ({ sectors, regions }), [sectors, regions]);
  const schema = useMemo(() => (typeof config.schema === "function" ? config.schema(context) : config.schema), [config, context]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fromRow = config.fromRow;
  const { rows, items: all, loading: listLoading, reload: reloadList } = useAdminList<T>(config.table, fromRow, config.listOptions);
  const { record, loading, error } = useAdminRecord<T>(config.table, isNew ? null : id, fromRow);

  const fresh = useMemo(() => (isNew ? config.create() : null), [isNew, config]);
  const saved: T | null = isNew ? fresh : record ?? null;

  const draft = useDraft<T>(`${config.table}:${id}`, saved, () => void doSave());

  const others = useMemo(() => all.filter((item) => item.id !== draft.draft.id), [all, draft.draft.id]);

  async function doSave() {
    if (saving) return;
    const prepared = config.beforeSave ? config.beforeSave(draft.draft, context) : draft.draft;
    if (prepared !== draft.draft) draft.setDraft(prepared);
    const problem = config.validate?.(prepared, others);
    if (problem) {
      toast({ tone: "error", title: "تحقق من الحقول", description: problem });
      return;
    }
    setSaving(true);
    try {
      const existingRow = rows.find((r) => String(r.id) === prepared.id);
      const sortOrder = existingRow ? config.sortOrderOf(existingRow) : Math.max(0, ...rows.map(config.sortOrderOf)) + 1;
      await adminApi.upsert(config.table, config.toRow(prepared, sortOrder), `${isNew ? "إضافة" : "تعديل"} ${config.label}: ${config.titleOf(prepared)}`);
      draft.reset(prepared);
      toast({ tone: "success", title: "تم الحفظ", description: config.titleOf(prepared) });
      void refresh();
      void reloadList();
      config.afterSave?.();
      if (isNew) router.replace(`${config.listHref}/${draft.draft.id}`);
    } catch (err) {
      toast({ tone: "error", title: "تعذر الحفظ", description: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    setDeleting(true);
    try {
      await adminApi.remove(config.table, draft.draft.id, `حذف ${config.label}: ${config.titleOf(draft.draft)}`);
      toast({ tone: "success", title: "تم الحذف" });
      draft.markSaved();
      void refresh();
      config.afterSave?.();
      router.push(config.listHref);
    } catch (err) {
      toast({ tone: "error", title: "تعذر الحذف", description: errorMessage(err) });
    } finally {
      setDeleting(false);
    }
  }


  if (!isNew && (loading || listLoading)) return <Loading />;
  if (error) return <Alert tone="error" title="تعذر تحميل السجل">{error}</Alert>;
  if (!isNew && record === undefined) {
    return <EmptyState title="السجل غير موجود" description="ربما حُذف أو أن الرابط غير صحيح." />;
  }

  const merged = [...others, draft.draft];
  const preview = config.preview(draft.draft, merged);

  return (
    <EditorLayout
      title={isNew ? `إضافة ${config.label}` : config.titleOf(draft.draft) || config.label}
      back={{ href: config.listHref, label: "العودة إلى القائمة" }}
      draft={draft}
      saving={saving}
      onSave={doSave}
      onDelete={isNew ? undefined : doDelete}
      deleting={deleting}
      deleteLabel={`حذف ${config.label}`}
      preview={preview}
    >
      <Card>
        <SchemaForm schema={schema} value={draft.draft as unknown as Row} onChange={(next) => draft.setDraft(next as unknown as T)} />
      </Card>
    </EditorLayout>
  );
}
