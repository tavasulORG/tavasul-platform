"use client";

import { useState, type ReactNode } from "react";
import { Eye, EyeOff, History, RotateCcw, Save, Trash2 } from "lucide-react";
import { PreviewFrame, type PreviewTarget } from "./PreviewFrame";
import type { Draft } from "./useDraft";
import { Alert, Badge, Button, ConfirmDialog, PageHeader, cn } from "./ui";

/* ----------------------------------------------------------------------------
 * Two-pane editor: the form on one side, the live preview of the real page on
 * the other, with save / discard / delete and the unsaved-draft backup banner.
 * ------------------------------------------------------------------------- */

interface EditorLayoutProps<T> {
  title: ReactNode;
  description?: ReactNode;
  back?: { href: string; label: string };
  draft: Draft<T>;
  saving: boolean;
  onSave: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  deleteLabel?: string;
  deleteMessage?: ReactNode;
  deleting?: boolean;
  /** Null hides the preview pane (e.g. for settings with nothing to show). */
  preview: PreviewTarget | null;
  children: ReactNode;
  /** Extra buttons in the header. */
  actions?: ReactNode;
  /** Short status chips (e.g. "7 حقول معدّلة"). */
  status?: ReactNode;
}

export function EditorLayout<T>({
  title,
  description,
  back,
  draft,
  saving,
  onSave,
  onDelete,
  deleteLabel = "حذف",
  deleteMessage,
  deleting,
  preview,
  children,
  actions,
  status,
}: EditorLayoutProps<T>) {
  const [showPreview, setShowPreview] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const previewVisible = preview !== null && showPreview;

  return (
    <div className="space-y-5">
      <PageHeader
        title={title}
        description={description}
        back={back}
        actions={
          <>
            {status}
            {draft.dirty ? <Badge tone="amber">غير محفوظ</Badge> : <Badge tone="green">محفوظ</Badge>}
            {actions}
            {preview && (
              <Button variant="ghost" icon={showPreview ? EyeOff : Eye} onClick={() => setShowPreview((v) => !v)} className="hidden lg:inline-flex">
                {showPreview ? "إخفاء المعاينة" : "إظهار المعاينة"}
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" icon={Trash2} onClick={() => setConfirmDelete(true)} className="text-red-600 hover:text-red-700 hover:border-red-300">
                {deleteLabel}
              </Button>
            )}
            <Button variant="outline" icon={RotateCcw} disabled={!draft.dirty || saving} onClick={() => setConfirmDiscard(true)}>
              تجاهل
            </Button>
            <Button icon={Save} loading={saving} disabled={!draft.dirty} onClick={() => onSave()} title="Ctrl+S">
              حفظ التغييرات
            </Button>
          </>
        }
      />

      {draft.backup && (
        <Alert
          tone="warning"
          title="توجد مسودة لم تُحفظ من جلسة سابقة"
          actions={
            <>
              <Button size="sm" icon={History} onClick={draft.restoreBackup}>
                استعادة المسودة
              </Button>
              <Button size="sm" variant="ghost" onClick={draft.dropBackup}>
                تجاهلها
              </Button>
            </>
          }
        >
          أُغلقت الصفحة قبل الحفظ. يمكنك استعادة ما كتبته أو الاستمرار من النسخة المحفوظة.
        </Alert>
      )}

      <div className={cn("grid gap-5", previewVisible && "lg:grid-cols-12")}>
        <div className={cn("min-w-0 space-y-5", previewVisible && "lg:col-span-7")}>{children}</div>
        {previewVisible && (
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-20">
              <PreviewFrame target={preview} heightClassName="h-[60vh] lg:h-[calc(100vh-8rem)]" />
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDiscard}
        title="تجاهل التعديلات؟"
        message="ستعود كل الحقول إلى آخر نسخة محفوظة."
        confirmLabel="تجاهل التعديلات"
        danger
        onCancel={() => setConfirmDiscard(false)}
        onConfirm={() => {
          draft.discard();
          setConfirmDiscard(false);
        }}
      />
      {onDelete && (
        <ConfirmDialog
          open={confirmDelete}
          title={`${deleteLabel}؟`}
          message={deleteMessage ?? "لا يمكن التراجع عن الحذف."}
          confirmLabel={deleteLabel}
          danger
          loading={deleting}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            await onDelete();
            setConfirmDelete(false);
          }}
        />
      )}
    </div>
  );
}
