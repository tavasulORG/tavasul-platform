"use client";

import type { CountryRegion } from "@/types";
import { newId } from "@/lib/adminClient";
import { imageOr, regionToRow, rowToRegion } from "@/lib/contentMappers";
import type { RecordEditorConfig } from "../RecordEditor";
import type { RecordListConfig } from "../RecordList";
import { Thumb } from "../RecordList";
import { EMPTY_LOCALIZED, localizedTitle, type FieldSchema } from "../SchemaForm";
import { Badge, fmtNumber } from "../ui";

const schema: FieldSchema[] = [
  { type: "localized", key: "name", label: "اسم المنطقة / الدولة", required: true },
  { type: "slug", key: "slug", label: "المعرّف في الرابط (slug)", source: "name", width: "half", required: true, hint: "المناطق الخمس الأصلية (turkey, yemen, syria, palestine, africa) مرسومة على الخريطة؛ المناطق الجديدة تظهر بلا دبوس." },
  { type: "text", key: "flag", label: "العلم (رمز تعبيري)", width: "half", placeholder: "🇹🇷", hint: "انسخ رمز العلم من لوحة الرموز التعبيرية." },
  { type: "image", key: "coverImage", label: "صورة الغلاف" },
  { type: "localized", key: "headline", label: "العنوان المختصر", multiline: true, rows: 2 },
  { type: "localized", key: "overview", label: "نبذة عن العمل في المنطقة", multiline: true, rows: 4 },
  { type: "list", key: "keyInterventions", label: "أبرز التدخلات", itemKind: "localized", multiline: true, addLabel: "إضافة تدخل" },
  { type: "number", key: "activeProjectsCount", label: "المشاريع النشطة", width: "half", min: 0 },
  { type: "number", key: "beneficiariesCount", label: "عدد المستفيدين", width: "half", min: 0 },
];

export const regionEditor: RecordEditorConfig<CountryRegion> = {
  table: "regions",
  label: "المنطقة",
  listHref: "/admin/regions",
  fromRow: rowToRegion,
  toRow: regionToRow,
  sortOrderOf: (row) => Number(row.sort_order ?? 0),
  create: () => ({
    id: newId("reg"),
    slug: "",
    flag: "",
    coverImage: "",
    name: EMPTY_LOCALIZED(),
    headline: EMPTY_LOCALIZED(),
    overview: EMPTY_LOCALIZED(),
    beneficiariesCount: 0,
    activeProjectsCount: 0,
    keyInterventions: [],
  }),
  schema,
  titleOf: (draft) => localizedTitle(draft.name),
  preview: (draft, all) => ({
    path: `/where-we-work#${draft.slug || draft.id}`,
    overrides: { regions: all.map((r) => ({ ...r, coverImage: imageOr(r.coverImage) })) },
  }),
  validate: (draft, others) => {
    if (!draft.name.ar.trim()) return "اسم المنطقة بالعربية مطلوب";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) return "المعرّف في الرابط يجب أن يكون بالإنجليزية (أحرف صغيرة وأرقام وشرطات)";
    if (others.some((r) => r.slug === draft.slug)) return "توجد منطقة أخرى بنفس المعرّف";
    return null;
  },
};

export const regionList: RecordListConfig<CountryRegion> = {
  table: "regions",
  title: "أين نعمل",
  description: "الدول والمناطق التي تعمل فيها الجمعية. الترتيب هنا هو ترتيب الظهور في الموقع.",
  label: "منطقة",
  createHref: "/admin/regions/new",
  editHref: (r) => `/admin/regions/${r.id}`,
  fromRow: rowToRegion,
  sortColumn: "sort_order",
  searchText: (r) => `${r.name.ar} ${r.name.en} ${r.name.tr} ${r.slug}`,
  columns: [
    { key: "cover", label: "", render: (r) => <Thumb src={r.coverImage} />, className: "w-20" },
    {
      key: "name",
      label: "المنطقة",
      render: (r) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{r.flag}</span>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 truncate">{r.name.ar}</div>
            <div className="text-[11px] text-slate-500 font-latin truncate" dir="ltr">
              /where-we-work#{r.slug}
            </div>
          </div>
        </div>
      ),
    },
    { key: "projects", label: "مشاريع نشطة", render: (r) => <span className="font-latin">{fmtNumber(r.activeProjectsCount)}</span> },
    { key: "beneficiaries", label: "المستفيدون", render: (r) => <span className="font-latin">{fmtNumber(r.beneficiariesCount)}</span> },
    { key: "interventions", label: "التدخلات", render: (r) => <Badge>{r.keyInterventions.length}</Badge> },
  ],
};
