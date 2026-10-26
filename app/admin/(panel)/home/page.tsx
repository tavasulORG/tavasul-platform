"use client";

import { useEffect, useMemo, useState } from "react";
import type { HomeContent, SiteSettings } from "@/types";
import { AdminApiError, adminApi, type Row } from "@/lib/adminClient";
import { rowsToHome, rowsToSettings } from "@/lib/contentMappers";
import { useContent } from "@/context/ContentContext";
import { useDonation } from "@/context/DonationContext";
import { EditorLayout } from "@/components/admin/EditorLayout";
import { FileField, ImageField } from "@/components/admin/fields";
import { EMPTY_LOCALIZED, SchemaForm, localizedTitle, type FieldSchema } from "@/components/admin/SchemaForm";
import { useDraft } from "@/components/admin/useDraft";
import { Alert, Card, Loading, errorMessage, useToast } from "@/components/admin/ui";

/* ----------------------------------------------------------------------------
 * Home page editor: the opening video and poster (site_settings.general) and the
 * impact-story section (site_settings.home). Section titles live in site texts.
 * ------------------------------------------------------------------------- */

interface HomeDraft {
  home: HomeContent;
  heroVideo: string;
  heroPoster: string;
}

export default function AdminHomePage() {
  const { toast } = useToast();
  const { refresh } = useContent();
  const { projects } = useDonation();
  const [saved, setSaved] = useState<HomeDraft | null>(null);
  const [general, setGeneral] = useState<Partial<SiteSettings>>({});
  const [error, setError] = useState("");
  const [schemaMissing, setSchemaMissing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .list<{ key: string; data: unknown }>("site_settings")
      .then(({ data }) => {
        const settings = rowsToSettings(data);
        setGeneral((data.find((r) => r.key === "general")?.data as Partial<SiteSettings>) ?? {});
        setSaved({ home: rowsToHome(data), heroVideo: settings.heroVideo, heroPoster: settings.heroPoster });
      })
      .catch((err) => {
        if (err instanceof AdminApiError && err.status === 503) {
          setSchemaMissing(true);
          const settings = rowsToSettings([]);
          setSaved({ home: rowsToHome([]), heroVideo: settings.heroVideo, heroPoster: settings.heroPoster });
        } else setError(errorMessage(err));
      });
  }, []);

  const draft = useDraft<HomeDraft>("site_settings:home", saved, () => void save());

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      await adminApi.upsertMany(
        "site_settings",
        [
          { key: "home", data: draft.draft.home },
          { key: "general", data: { ...general, heroVideo: draft.draft.heroVideo, heroPoster: draft.draft.heroPoster } },
        ],
        "حفظ محتوى الصفحة الرئيسية"
      );
      setGeneral((g) => ({ ...g, heroVideo: draft.draft.heroVideo, heroPoster: draft.draft.heroPoster }));
      draft.markSaved();
      toast({ tone: "success", title: "تم حفظ الصفحة الرئيسية" });
      void refresh();
    } catch (err) {
      toast({ tone: "error", title: "تعذر الحفظ", description: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  const storySchema = useMemo<FieldSchema[]>(
    () => [
      { type: "localized", key: "impactHeadline", label: "الفقرة التعريفية فوق القصص", multiline: true, rows: 3 },
      {
        type: "list",
        key: "impactStories",
        label: "قصص الأثر",
        addLabel: "إضافة قصة",
        hint: "تتبدل تلقائياً كل بضع ثوانٍ؛ يُنصح بثلاث إلى خمس قصص.",
        newItem: () => ({
          id: `story-${Date.now()}`,
          projectSlug: projects[0]?.slug ?? "",
          iconName: "Droplets",
          title: EMPTY_LOCALIZED(),
          description: EMPTY_LOCALIZED(),
          image: "",
          gaugeHeader: EMPTY_LOCALIZED(),
          gaugeValue: EMPTY_LOCALIZED(),
          gaugeSub: EMPTY_LOCALIZED(),
          gaugeProgress: 0.8,
          gaugeFootnote: EMPTY_LOCALIZED(),
        }),
        itemTitle: (item) => localizedTitle(item.title, "قصة جديدة"),
        item: [
          { type: "localized", key: "title", label: "العنوان" },
          { type: "localized", key: "description", label: "الوصف", multiline: true, rows: 2 },
          { type: "image", key: "image", label: "الصورة" },
          {
            type: "select",
            key: "projectSlug",
            label: "المشروع المرتبط",
            width: "half",
            options: projects.map((p) => ({ value: p.slug, label: p.title.ar })),
          },
          { type: "icon", key: "iconName", label: "الأيقونة", width: "half" },
          { type: "localized", key: "gaugeHeader", label: "عنوان المؤشر" },
          { type: "localized", key: "gaugeValue", label: "قيمة المؤشر (مثل +32K)" },
          { type: "localized", key: "gaugeSub", label: "وصف القيمة" },
          { type: "number", key: "gaugeProgress", label: "نسبة امتلاء المؤشر (0 إلى 1)", min: 0, max: 1, step: 0.01, width: "half" },
          { type: "localized", key: "gaugeFootnote", label: "ملاحظة أسفل المؤشر", multiline: true, rows: 2 },
        ],
      },
    ],
    [projects]
  );

  if (error) return <Alert tone="error" title="تعذر تحميل البيانات">{error}</Alert>;
  if (!saved) return <Loading />;

  const previewSettings = { ...rowsToSettings([{ key: "general", data: general }]), heroVideo: draft.draft.heroVideo, heroPoster: draft.draft.heroPoster };

  return (
    <EditorLayout
      title="الصفحة الرئيسية"
      description="الفيديو الافتتاحي وقصص الأثر. بقية نصوص الصفحة (العناوين والأزرار) تُعدَّل من «نصوص الموقع»."
      draft={draft}
      saving={saving}
      onSave={save}
      preview={{ path: "/", overrides: { home: draft.draft.home, settings: previewSettings } }}
    >
      {schemaMissing && (
        <Alert tone="warning" title="قاعدة البيانات غير مهيأة بعد">
          تُعرض القيم الافتراضية من ملفات الموقع. شغّل ملف supabase/schema.sql (التعليمات في صفحة الدخول) ليعمل الحفظ.
        </Alert>
      )}
      <Card title="الواجهة الافتتاحية" description="فيديو الخلفية والصورة التي تظهر قبل تشغيله.">
        <div className="space-y-5">
          <FileField label="فيديو الخلفية (MP4 أو WebM)" folder="videos" value={draft.draft.heroVideo} onChange={(url) => draft.setDraft((d) => ({ ...d, heroVideo: url }))} />
          <ImageField label="صورة الغلاف (تظهر قبل تحميل الفيديو)" aspect="wide" value={draft.draft.heroPoster} onChange={(url) => draft.setDraft((d) => ({ ...d, heroPoster: url }))} />
        </div>
      </Card>

      <Card title="قصة الأثر" description="القسم التفاعلي الذي يعرض قصص المشاريع ومؤشراتها.">
        <SchemaForm schema={storySchema} value={draft.draft.home as unknown as Row} onChange={(next) => draft.setDraft((d) => ({ ...d, home: next as unknown as HomeContent }))} />
      </Card>
    </EditorLayout>
  );
}
