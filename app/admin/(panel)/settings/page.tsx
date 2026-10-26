"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/types";
import { AdminApiError, adminApi, type Row } from "@/lib/adminClient";
import { rowsToSettings } from "@/lib/contentMappers";
import { useContent } from "@/context/ContentContext";
import { useAdminShell } from "@/components/admin/AdminShell";
import { hasRole } from "@/components/admin/useAdminSession";
import { EditorLayout } from "@/components/admin/EditorLayout";
import { SchemaForm, type FieldSchema } from "@/components/admin/SchemaForm";
import { useDraft } from "@/components/admin/useDraft";
import { Alert, Card, Loading, Tabs, errorMessage, useToast } from "@/components/admin/ui";

/* ----------------------------------------------------------------------------
 * Site settings (site_settings.general): contact details, brand media, page
 * hero photos, social links and the demo payment switch.
 * ------------------------------------------------------------------------- */

interface Section {
  id: string;
  label: string;
  path: string;
  schema: FieldSchema[];
}

const SECTIONS: Section[] = [
  {
    id: "contact",
    label: "بيانات التواصل",
    path: "/contact",
    schema: [
      { type: "text", key: "phone", label: "رقم الهاتف", dir: "ltr", width: "half", hint: "يظهر في الشريط العلوي والتذييل وصفحة التواصل." },
      { type: "text", key: "whatsapp", label: "رقم واتساب", dir: "ltr", width: "half", hint: "بالصيغة الدولية، مثل +90 5xx xxx xx xx" },
      { type: "text", key: "email", label: "البريد الإلكتروني", dir: "ltr", width: "half" },
      { type: "text", key: "mapsQuery", label: "عنوان الخرائط", dir: "ltr", width: "half", hint: "ما يُفتح في خرائط Google عند الضغط على «الاتجاهات»." },
      {
        type: "group",
        key: "socials",
        label: "حسابات التواصل الاجتماعي (اتركها فارغة لإخفائها)",
        fields: [
          { type: "text", key: "facebook", label: "Facebook", dir: "ltr", width: "half" },
          { type: "text", key: "instagram", label: "Instagram", dir: "ltr", width: "half" },
          { type: "text", key: "x", label: "X (Twitter)", dir: "ltr", width: "half" },
          { type: "text", key: "youtube", label: "YouTube", dir: "ltr", width: "half" },
          { type: "text", key: "linkedin", label: "LinkedIn", dir: "ltr", width: "half" },
        ],
      },
    ],
  },
  {
    id: "brand",
    label: "الشعار والهوية",
    path: "/",
    schema: [
      { type: "image", key: "logo", label: "شعار الجمعية", aspect: "wide", hint: "يظهر في الشريط العلوي والتذييل ولوحة التحكم. يُفضَّل PNG بخلفية بيضاء." },
      { type: "image", key: "heroPoster", label: "صورة الواجهة الافتتاحية", aspect: "wide" },
      { type: "file", key: "heroVideo", label: "فيديو الواجهة الافتتاحية", folder: "videos" },
    ],
  },
  {
    id: "heroes",
    label: "صور الصفحات",
    path: "/about",
    schema: [
      { type: "image", key: "aboutHeroImage", label: "صفحة عن تواصل", aspect: "wide" },
      { type: "image", key: "sectorsHeroImage", label: "صفحة المجالات: الغلاف", aspect: "wide" },
      { type: "image", key: "sectorsIndexImage", label: "صفحة المجالات: صورة الفهرس", aspect: "wide" },
      { type: "image", key: "whereHeroImage", label: "صفحة أين نعمل", aspect: "wide" },
      { type: "image", key: "projectsHeroImage", label: "صفحة المشاريع", aspect: "wide" },
    ],
  },
  {
    id: "payments",
    label: "الدفع",
    path: "/projects",
    schema: [
      {
        type: "boolean",
        key: "demoPaymentMode",
        label: "وضع الدفع التجريبي",
        hint: "ما دام مفعّلاً تظهر للزوار إشارة أن التبرع تجريبي ولا يُخصم أي مبلغ. أوقفه فقط بعد ربط بوابة دفع حقيقية.",
      },
    ],
  },
];

export default function AdminSettingsPage() {
  const { session } = useAdminShell();
  const { toast } = useToast();
  const { refresh } = useContent();
  const [saved, setSaved] = useState<SiteSettings | null>(null);
  const [error, setError] = useState("");
  const [schemaMissing, setSchemaMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState(SECTIONS[0].id);

  useEffect(() => {
    adminApi
      .list<{ key: string; data: unknown }>("site_settings")
      .then(({ data }) => setSaved(rowsToSettings(data)))
      .catch((err) => {
        if (err instanceof AdminApiError && err.status === 503) {
          setSchemaMissing(true);
          setSaved(rowsToSettings([]));
        } else setError(errorMessage(err));
      });
  }, []);

  const draft = useDraft<SiteSettings>("site_settings:general", saved, () => void save());

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      await adminApi.upsert("site_settings", { key: "general", data: draft.draft }, "حفظ إعدادات الموقع");
      draft.markSaved();
      toast({ tone: "success", title: "تم حفظ الإعدادات" });
      void refresh();
    } catch (err) {
      toast({ tone: "error", title: "تعذر الحفظ", description: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  if (!hasRole(session.role, "admin")) return <Alert tone="warning" title="هذه الصفحة للمدير فقط" />;
  if (error) return <Alert tone="error" title="تعذر تحميل الإعدادات">{error}</Alert>;
  if (!saved) return <Loading />;

  const section = SECTIONS.find((s) => s.id === tab) ?? SECTIONS[0];

  return (
    <EditorLayout
      title="إعدادات الموقع"
      description="بيانات التواصل والشعار وصور الصفحات ووضع الدفع. تُطبَّق على كل الصفحات فور الحفظ."
      draft={draft}
      saving={saving}
      onSave={save}
      preview={{ path: section.path, overrides: { settings: draft.draft } }}
    >
      {schemaMissing && (
        <Alert tone="warning" title="قاعدة البيانات غير مهيأة بعد">
          تُعرض القيم الافتراضية من ملفات الموقع. شغّل ملف supabase/schema.sql (التعليمات في صفحة الدخول) ليعمل الحفظ.
        </Alert>
      )}
      <Tabs tabs={SECTIONS.map((s) => ({ id: s.id, label: s.label }))} value={tab} onChange={setTab} />
      <Card title={section.label}>
        <SchemaForm key={section.id} schema={section.schema} value={draft.draft as unknown as Row} onChange={(next) => draft.setDraft(next as unknown as SiteSettings)} />
      </Card>
    </EditorLayout>
  );
}
