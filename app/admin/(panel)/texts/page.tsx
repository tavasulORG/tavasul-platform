"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import type { Language } from "@/types";
import { translations as localTranslations } from "@/data/translations";
import { TRANSLATION_GROUPS, type TranslationGroup } from "@/data/translationGroups";
import { AdminApiError, adminApi } from "@/lib/adminClient";
import { useContent } from "@/context/ContentContext";
import { EditorLayout } from "@/components/admin/EditorLayout";
import { LANGS } from "@/components/admin/fields";
import { useDraft } from "@/components/admin/useDraft";
import { Alert, Badge, Card, Input, Loading, Select, Textarea, cn, errorMessage, useToast } from "@/components/admin/ui";

type Dictionary = Record<string, string>;
type Dictionaries = Record<Language, Dictionary>;

const LOCAL: Dictionaries = { ar: localTranslations.ar, tr: localTranslations.tr, en: localTranslations.en };
const ALL_KEYS = Object.keys(LOCAL.ar);
const GROUPED = new Set(TRANSLATION_GROUPS.flatMap((g) => g.keys as string[]));
const OTHER_GROUP: TranslationGroup = {
  id: "other",
  label: "أخرى",
  path: "/",
  keys: ALL_KEYS.filter((k) => !GROUPED.has(k)) as TranslationGroup["keys"],
};
const GROUPS = OTHER_GROUP.keys.length > 0 ? [...TRANSLATION_GROUPS, OTHER_GROUP] : TRANSLATION_GROUPS;

/** Arabic reading of the key name, e.g. "heroTitle" -> "hero Title". */
function prettyKey(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function isLong(value: string): boolean {
  return value.length > 70 || value.includes("\n");
}

export default function TextsPage() {
  const { toast } = useToast();
  const { refresh } = useContent();
  const [saved, setSaved] = useState<Dictionaries | null>(null);
  const [error, setError] = useState("");
  const [schemaMissing, setSchemaMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [groupId, setGroupId] = useState(GROUPS[0].id);
  const [query, setQuery] = useState("");

  useEffect(() => {
    adminApi
      .get<{ ar: Dictionary; tr: Dictionary; en: Dictionary }>("translations", "main")
      .then(({ data }) =>
        setSaved({
          ar: { ...LOCAL.ar, ...(data?.ar ?? {}) },
          tr: { ...LOCAL.tr, ...(data?.tr ?? {}) },
          en: { ...LOCAL.en, ...(data?.en ?? {}) },
        })
      )
      .catch((err) => {
        if (err instanceof AdminApiError && err.status === 503) {
          setSchemaMissing(true);
          setSaved({ ar: { ...LOCAL.ar }, tr: { ...LOCAL.tr }, en: { ...LOCAL.en } });
        } else setError(errorMessage(err));
      });
  }, []);

  const draft = useDraft<Dictionaries>("translations:main", saved, () => void save());

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      await adminApi.upsert("translations", { id: "main", ...draft.draft }, "حفظ نصوص الموقع");
      draft.markSaved();
      toast({ tone: "success", title: "تم حفظ النصوص" });
      void refresh();
    } catch (err) {
      toast({ tone: "error", title: "تعذر الحفظ", description: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  const group = GROUPS.find((g) => g.id === groupId) ?? GROUPS[0];

  const changedCount = useMemo(() => {
    if (!saved) return 0;
    return ALL_KEYS.filter((k) => LANGS.some((l) => (draft.draft[l.id]?.[k] ?? "") !== (saved[l.id]?.[k] ?? ""))).length;
  }, [draft.draft, saved]);

  const visibleKeys = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return group.keys as string[];
    return ALL_KEYS.filter(
      (k) => k.toLowerCase().includes(q) || LANGS.some((l) => (draft.draft[l.id]?.[k] ?? "").toLowerCase().includes(q))
    );
  }, [query, group, draft.draft]);

  const setValue = (lang: Language, key: string, value: string) =>
    draft.setDraft((current) => ({ ...current, [lang]: { ...current[lang], [key]: value } }));

  if (error) return <Alert tone="error" title="تعذر تحميل النصوص">{error}</Alert>;
  if (!saved) return <Loading />;

  return (
    <EditorLayout
      title="نصوص الموقع"
      description="كل العبارات الظاهرة في الموقع بالعربية والتركية والإنجليزية، مرتبة حسب الصفحة. المعاينة تعرض الصفحة المرتبطة بالمجموعة المختارة."
      draft={draft}
      saving={saving}
      onSave={save}
      preview={{ path: group.path, overrides: { translations: draft.draft } }}
      status={changedCount > 0 ? <Badge tone="amber">{changedCount} نص معدّل</Badge> : undefined}
    >
      {schemaMissing && (
        <Alert tone="warning" title="قاعدة البيانات غير مهيأة بعد">
          تُعرض القيم الافتراضية من ملفات الموقع. شغّل ملف supabase/schema.sql (التعليمات في صفحة الدخول) ليعمل الحفظ.
        </Alert>
      )}
      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <Select
            value={query ? "" : groupId}
            onChange={(e) => {
              setGroupId(e.target.value);
              setQuery("");
            }}
          >
            {query && <option value="">نتائج البحث</option>}
            {GROUPS.map((g) => {
              const modified = saved ? g.keys.filter((k) => LANGS.some((l) => (draft.draft[l.id]?.[k] ?? "") !== (saved[l.id]?.[k] ?? ""))).length : 0;
              return (
                <option key={g.id} value={g.id}>
                  {g.label} ({g.keys.length}){modified > 0 ? ` · ${modified} معدّل` : ""}
                </option>
              );
            })}
          </Select>
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث في كل النصوص (بالمفتاح أو بالمحتوى)..." className="ps-9" />
          </label>
        </div>

        <div className="min-w-0 space-y-3">

          <Card title={query ? `نتائج البحث (${visibleKeys.length})` : group.label} description={query ? undefined : `${group.keys.length} نص · يُعاين في ${group.path}`} bodyClassName="p-0">
            {visibleKeys.length === 0 ? (
              <p className="px-5 py-10 text-center text-xs text-slate-500">لا نتائج.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {visibleKeys.map((key) => {
                  const long = LANGS.some((l) => isLong(draft.draft[l.id]?.[key] ?? ""));
                  const changedFromDefault = LANGS.some((l) => (draft.draft[l.id]?.[key] ?? "") !== (LOCAL[l.id][key] ?? ""));
                  const changedFromSaved = LANGS.some((l) => (draft.draft[l.id]?.[key] ?? "") !== (saved[l.id]?.[key] ?? ""));
                  return (
                    <li key={key} className={cn("px-5 py-4", changedFromSaved && "bg-amber-50/40")}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-500 font-latin" dir="ltr" title={key}>
                          {prettyKey(key)}
                        </span>
                        <div className="flex items-center gap-2">
                          {changedFromSaved && <Badge tone="amber">معدّل</Badge>}
                          {changedFromDefault && (
                            <button
                              type="button"
                              title="إعادة النص الافتراضي"
                              onClick={() => LANGS.forEach((l) => setValue(l.id, key, LOCAL[l.id][key] ?? ""))}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-primary-700"
                            >
                              <RotateCcw className="w-3 h-3" />
                              الافتراضي
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {LANGS.map((lang) => {
                          const value = draft.draft[lang.id]?.[key] ?? "";
                          const common = {
                            dir: lang.dir,
                            value,
                            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(lang.id, key, e.target.value),
                            placeholder: lang.label,
                            className: cn(lang.dir === "ltr" ? "pr-12 font-latin" : "pl-12"),
                          };
                          return (
                            <div key={lang.id} className="relative">
                              <span className={cn("absolute top-2 z-10 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600 font-latin", lang.dir === "ltr" ? "right-2" : "left-2")}>
                                {lang.id}
                              </span>
                              {long ? <Textarea rows={3} {...common} /> : <Input {...common} />}
                            </div>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </EditorLayout>
  );
}
