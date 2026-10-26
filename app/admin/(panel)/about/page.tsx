"use client";

import { useEffect, useMemo, useState } from "react";
import type { OrganizationInfo } from "@/types";
import { AdminApiError, adminApi, type Row } from "@/lib/adminClient";
import { aboutToRows, rowsToAbout } from "@/lib/contentMappers";
import { useContent } from "@/context/ContentContext";
import { EditorLayout } from "@/components/admin/EditorLayout";
import { EMPTY_LOCALIZED, SchemaForm, type FieldSchema } from "@/components/admin/SchemaForm";
import { useDraft } from "@/components/admin/useDraft";
import { Alert, Card, Loading, Tabs, errorMessage, useToast } from "@/components/admin/ui";

/* ----------------------------------------------------------------------------
 * About page editor: one tab per section of /about, each previewed at its anchor.
 * ------------------------------------------------------------------------- */

const PARTNER_TYPES = [
  "International Fund",
  "Governmental / Humanitarian",
  "UN Agency",
  "Philanthropic Endowment",
  "International NGO",
  "Field Implementation Partner",
  "Healthcare Partner",
  "Regional Partner",
].map((value) => ({ value, label: value }));

const copyGroup = (lang: "ar" | "tr" | "en", label: string, fields: FieldSchema[]): FieldSchema => ({ type: "group", key: lang, label, fields });

const WHO_FIELDS: FieldSchema[] = [
  { type: "text", key: "title", label: "العنوان" },
  { type: "textarea", key: "content", label: "النص", rows: 6 },
];
const STORY_FIELDS: FieldSchema[] = [
  { type: "text", key: "title", label: "العنوان" },
  { type: "textarea", key: "lead", label: "المقدمة", rows: 3 },
  { type: "textarea", key: "body", label: "النص", rows: 6 },
];

const partnerFields: FieldSchema[] = [
  { type: "text", key: "name", label: "الاسم", hint: "الصيغة: الاسم العربي (الاسم اللاتيني)" },
  { type: "select", key: "type", label: "النوع", options: PARTNER_TYPES, width: "half" },
  { type: "text", key: "website", label: "الموقع الإلكتروني", dir: "ltr", width: "half" },
  { type: "image", key: "logo", label: "الشعار (اختياري)", aspect: "square" },
];

interface Section {
  id: string;
  label: string;
  anchor: string;
  /** Key of the draft edited by the tab; "root" edits top-level fields. */
  scope: keyof OrganizationInfo | "root";
  schema: FieldSchema[];
}

const SECTIONS: Section[] = [
  {
    id: "general",
    label: "بيانات عامة",
    anchor: "",
    scope: "root",
    schema: [
      { type: "text", key: "licenseNumber", label: "رقم الترخيص", dir: "ltr", width: "half" },
      { type: "number", key: "foundedYear", label: "سنة التأسيس", width: "half", min: 1900, max: 2100 },
      { type: "text", key: "foundationCity", label: "مدينة التأسيس" },
      { type: "text", key: "originHeritage", label: "الجذور والخبرة" },
    ],
  },
  {
    id: "who",
    label: "من نحن",
    anchor: "who-we-are",
    scope: "whoWeAre",
    schema: [copyGroup("ar", "العربية", WHO_FIELDS), copyGroup("tr", "Türkçe", WHO_FIELDS), copyGroup("en", "English", WHO_FIELDS)],
  },
  {
    id: "story",
    label: "قصتنا",
    anchor: "story",
    scope: "ourStory",
    schema: [copyGroup("ar", "العربية", STORY_FIELDS), copyGroup("tr", "Türkçe", STORY_FIELDS), copyGroup("en", "English", STORY_FIELDS)],
  },
  {
    id: "vision",
    label: "الرؤية والرسالة",
    anchor: "vision",
    scope: "root",
    schema: [
      { type: "localized", key: "vision", label: "الرؤية", multiline: true, rows: 3 },
      { type: "localized", key: "mission", label: "الرسالة", multiline: true, rows: 3 },
    ],
  },
  {
    id: "goals",
    label: "الأهداف",
    anchor: "goals",
    scope: "root",
    schema: [
      {
        type: "list",
        key: "goals",
        label: "الأهداف الاستراتيجية",
        addLabel: "إضافة هدف",
        newItem: () => ({ id: `goal-${Date.now()}`, ar: "", tr: "", en: "" }),
        itemTitle: (item) => item.ar || item.en || "هدف جديد",
        item: [
          { type: "textarea", key: "ar", label: "العربية", rows: 2 },
          { type: "textarea", key: "tr", label: "Türkçe", rows: 2, dir: "ltr" },
          { type: "textarea", key: "en", label: "English", rows: 2, dir: "ltr" },
        ],
      },
    ],
  },
  {
    id: "values",
    label: "القيم",
    anchor: "values",
    scope: "root",
    schema: [
      {
        type: "list",
        key: "values",
        label: "القيم المؤسسية",
        addLabel: "إضافة قيمة",
        newItem: () => ({ id: `val-${Date.now()}`, number: "", ar: "", tr: "", en: "", desc: EMPTY_LOCALIZED() }),
        itemTitle: (item) => `${item.number ? `${item.number} · ` : ""}${item.ar || item.en || "قيمة جديدة"}`,
        item: [
          { type: "text", key: "number", label: "الرقم", dir: "ltr", width: "third", placeholder: "01" },
          { type: "text", key: "ar", label: "الاسم بالعربية", width: "third" },
          { type: "text", key: "en", label: "Name (English)", dir: "ltr", width: "third" },
          { type: "text", key: "tr", label: "Ad (Türkçe)", dir: "ltr" },
          { type: "localized", key: "desc", label: "الوصف", multiline: true, rows: 2 },
        ],
      },
    ],
  },
  {
    id: "target",
    label: "الفئات المستهدفة",
    anchor: "target-groups",
    scope: "root",
    schema: [
      {
        type: "list",
        key: "targetGroups",
        label: "الفئات",
        addLabel: "إضافة فئة",
        newItem: () => ({ number: 0, ar: "", tr: "", en: "" }),
        itemTitle: (item) => item.ar || item.en || "فئة جديدة",
        item: [
          { type: "number", key: "number", label: "الرقم", width: "third", min: 1, hint: "يحدد الأيقونة والترتيب (1 إلى 9)." },
          { type: "text", key: "ar", label: "العربية", width: "third" },
          { type: "text", key: "en", label: "English", dir: "ltr", width: "third" },
          { type: "text", key: "tr", label: "Türkçe", dir: "ltr" },
        ],
      },
    ],
  },
  {
    id: "governance",
    label: "الحوكمة والتقارير",
    anchor: "governance",
    scope: "governance",
    schema: [
      {
        type: "list",
        key: "boardOfDirectors",
        label: "مجلس الإدارة",
        addLabel: "إضافة عضو",
        newItem: () => ({ name: "", roleAr: "", roleTr: "", roleEn: "", photo: "" }),
        itemTitle: (item) => item.name || "عضو جديد",
        item: [
          { type: "text", key: "name", label: "الاسم" },
          { type: "text", key: "roleAr", label: "المنصب بالعربية", width: "third" },
          { type: "text", key: "roleTr", label: "Görev (Türkçe)", dir: "ltr", width: "third" },
          { type: "text", key: "roleEn", label: "Role (English)", dir: "ltr", width: "third" },
          { type: "image", key: "photo", label: "الصورة الشخصية (اختياري)", aspect: "square" },
        ],
      },
      {
        type: "list",
        key: "reports",
        label: "التقارير المالية والسنوية",
        addLabel: "إضافة تقرير",
        newItem: () => ({ year: String(new Date().getFullYear()), titleAr: "", titleTr: "", titleEn: "", size: "", url: "" }),
        itemTitle: (item) => `${item.year} · ${item.titleAr || item.titleEn || "تقرير جديد"}`,
        item: [
          { type: "text", key: "year", label: "السنة", dir: "ltr", width: "half" },
          { type: "text", key: "size", label: "الحجم", dir: "ltr", width: "half", hint: "يُملأ تلقائياً عند رفع الملف." },
          { type: "text", key: "titleAr", label: "العنوان بالعربية" },
          { type: "text", key: "titleTr", label: "Başlık (Türkçe)", dir: "ltr" },
          { type: "text", key: "titleEn", label: "Title (English)", dir: "ltr" },
          { type: "file", key: "url", label: "ملف التقرير (PDF)", sizeKey: "size" },
        ],
      },
    ],
  },
  {
    id: "partners",
    label: "الشركاء",
    anchor: "partners",
    scope: "partners",
    schema: [
      {
        type: "list",
        key: "funding",
        label: "الشركاء المانحون",
        addLabel: "إضافة شريك",
        newItem: () => ({ name: "", type: "International Fund", logo: "", website: "" }),
        itemTitle: (item) => item.name || "شريك جديد",
        item: partnerFields,
      },
      {
        type: "list",
        key: "implementing",
        label: "شركاء التنفيذ",
        addLabel: "إضافة شريك",
        newItem: () => ({ name: "", type: "Field Implementation Partner", logo: "", website: "" }),
        itemTitle: (item) => item.name || "شريك جديد",
        item: partnerFields,
      },
    ],
  },
];

export default function AdminAboutPage() {
  const { toast } = useToast();
  const { refresh } = useContent();
  const [saved, setSaved] = useState<OrganizationInfo | null>(null);
  const [error, setError] = useState("");
  const [schemaMissing, setSchemaMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState(SECTIONS[0].id);

  useEffect(() => {
    adminApi
      .list<{ key: string; data: unknown }>("organization_info")
      .then(({ data }) => setSaved(rowsToAbout(data)))
      .catch((err) => {
        if (err instanceof AdminApiError && err.status === 503) {
          setSchemaMissing(true);
          setSaved(rowsToAbout([]));
        } else setError(errorMessage(err));
      });
  }, []);

  const draft = useDraft<OrganizationInfo>("organization_info:all", saved, () => void save());

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      await adminApi.upsertMany("organization_info", aboutToRows(draft.draft), "حفظ صفحة عن تواصل");
      draft.markSaved();
      toast({ tone: "success", title: "تم حفظ صفحة عن تواصل" });
      void refresh();
    } catch (err) {
      toast({ tone: "error", title: "تعذر الحفظ", description: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  const section = SECTIONS.find((s) => s.id === tab) ?? SECTIONS[0];
  const preview = useMemo(
    () => ({ path: section.anchor ? `/about#${section.anchor}` : "/about", overrides: { about: draft.draft } }),
    [section.anchor, draft.draft]
  );

  if (error) return <Alert tone="error" title="تعذر تحميل البيانات">{error}</Alert>;
  if (!saved) return <Loading />;

  const value: Row = section.scope === "root" ? (draft.draft as unknown as Row) : ((draft.draft[section.scope] as unknown as Row) ?? {});
  const onChange = (next: Row) =>
    draft.setDraft((current) =>
      section.scope === "root" ? (next as unknown as OrganizationInfo) : { ...current, [section.scope]: next }
    );

  return (
    <EditorLayout
      title="صفحة عن تواصل"
      description="القصة والرؤية والقيم ومجلس الإدارة والتقارير والشركاء. اختر القسم من الأعلى؛ المعاينة تنتقل إليه مباشرة."
      draft={draft}
      saving={saving}
      onSave={save}
      preview={preview}
    >
      {schemaMissing && (
        <Alert tone="warning" title="قاعدة البيانات غير مهيأة بعد">
          تُعرض القيم الافتراضية من ملفات الموقع. شغّل ملف supabase/schema.sql (التعليمات في صفحة الدخول) ليعمل الحفظ.
        </Alert>
      )}
      <Tabs tabs={SECTIONS.map((s) => ({ id: s.id, label: s.label }))} value={tab} onChange={setTab} />
      <Card title={section.label} description={`يظهر في /about${section.anchor ? `#${section.anchor}` : ""}`}>
        <SchemaForm key={section.id} schema={section.schema} value={value} onChange={onChange} />
      </Card>
      <p className="text-[11px] text-slate-400">عناوين الأقسام نفسها (مثل «رؤيتنا ورسالتنا») تُعدَّل من صفحة نصوص الموقع ضمن مجموعة «صفحة عن تواصل».</p>
    </EditorLayout>
  );
}
