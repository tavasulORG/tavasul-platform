"use client";

import type { Sector } from "@/types";
import { newId } from "@/lib/adminClient";
import { imageOr, rowToSector, sectorToRow } from "@/lib/contentMappers";
import type { RecordEditorConfig } from "../RecordEditor";
import type { RecordListConfig } from "../RecordList";
import { Thumb } from "../RecordList";
import { IconPreview } from "../fields";
import { EMPTY_LOCALIZED, localizedTitle, type FieldSchema } from "../SchemaForm";
import { Badge, fmtNumber } from "../ui";

const schema: FieldSchema[] = [
  { type: "localized", key: "title", label: "اسم المجال", required: true },
  { type: "slug", key: "slug", label: "المعرّف في الرابط (slug)", source: "title", width: "half", required: true },
  { type: "icon", key: "iconName", label: "الأيقونة", width: "half" },
  { type: "image", key: "coverImage", label: "صورة الغلاف", hint: "تظهر على الصفحة الرئيسية وفي صفحة المجالات." },
  { type: "localized", key: "subtitle", label: "العنوان الفرعي" },
  { type: "localized", key: "description", label: "الوصف", multiline: true, rows: 4 },
  { type: "list", key: "objectives", label: "الأهداف", itemKind: "localized", multiline: true, addLabel: "إضافة هدف" },
  {
    type: "group",
    key: "stats",
    label: "الأرقام (تظهر في قسم «بالأرقام» وبطاقة المجال)",
    fields: [
      { type: "number", key: "projectsCount", label: "عدد المشاريع", width: "third", min: 0 },
      { type: "number", key: "completedProjects", label: "المشاريع المكتملة", width: "third", min: 0 },
      { type: "number", key: "beneficiariesCount", label: "عدد المستفيدين", width: "third", min: 0 },
    ],
  },
];

export const sectorEditor: RecordEditorConfig<Sector> = {
  table: "sectors",
  label: "المجال",
  listHref: "/admin/sectors",
  fromRow: rowToSector,
  toRow: sectorToRow,
  sortOrderOf: (row) => Number(row.sort_order ?? 0),
  create: () => ({
    id: newId("sec"),
    slug: "",
    iconName: "Users",
    coverImage: "",
    title: EMPTY_LOCALIZED(),
    subtitle: EMPTY_LOCALIZED(),
    description: EMPTY_LOCALIZED(),
    objectives: [],
    stats: { projectsCount: 0, beneficiariesCount: 0, completedProjects: 0 },
  }),
  schema,
  titleOf: (draft) => localizedTitle(draft.title),
  preview: (draft, all) => ({
    path: `/sectors#${draft.slug || draft.id}`,
    overrides: { sectors: all.map((s) => ({ ...s, coverImage: imageOr(s.coverImage) })) },
  }),
  validate: (draft, others) => {
    if (!draft.title.ar.trim()) return "اسم المجال بالعربية مطلوب";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) return "المعرّف في الرابط يجب أن يكون بالإنجليزية (أحرف صغيرة وأرقام وشرطات)";
    if (others.some((s) => s.slug === draft.slug)) return "يوجد مجال آخر بنفس المعرّف";
    return null;
  },
};

export const sectorList: RecordListConfig<Sector> = {
  table: "sectors",
  title: "مجالات العمل",
  description: "القطاعات السبعة وما يُضاف إليها. الترتيب هنا هو ترتيب الظهور في الموقع.",
  label: "مجال",
  createHref: "/admin/sectors/new",
  editHref: (s) => `/admin/sectors/${s.id}`,
  fromRow: rowToSector,
  sortColumn: "sort_order",
  searchText: (s) => `${s.title.ar} ${s.title.en} ${s.title.tr} ${s.slug}`,
  columns: [
    { key: "cover", label: "", render: (s) => <Thumb src={s.coverImage} />, className: "w-20" },
    {
      key: "title",
      label: "المجال",
      render: (s) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <IconPreview name={s.iconName} className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 truncate">{s.title.ar}</div>
            <div className="text-[11px] text-slate-500 font-latin truncate" dir="ltr">
              /sectors#{s.slug}
            </div>
          </div>
        </div>
      ),
    },
    { key: "projects", label: "المشاريع", render: (s) => <span className="font-latin">{fmtNumber(s.stats.projectsCount)}</span> },
    { key: "completed", label: "مكتملة", render: (s) => <span className="font-latin">{fmtNumber(s.stats.completedProjects)}</span> },
    { key: "beneficiaries", label: "المستفيدون", render: (s) => <span className="font-latin">{fmtNumber(s.stats.beneficiariesCount)}</span> },
    { key: "objectives", label: "الأهداف", render: (s) => <Badge>{s.objectives.length}</Badge> },
  ],
};
