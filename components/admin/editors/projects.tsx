"use client";

import type { Project } from "@/types";
import { newId } from "@/lib/adminClient";
import { imageOr, projectToRow, rowToProject } from "@/lib/contentMappers";
import type { EditorContext, RecordEditorConfig } from "../RecordEditor";
import type { RecordListConfig } from "../RecordList";
import { Thumb } from "../RecordList";
import { EMPTY_LOCALIZED, localizedTitle, type FieldSchema } from "../SchemaForm";
import { Badge, fmtMoney, fmtNumber } from "../ui";

export const STATUS_LABEL: Record<Project["status"], string> = { urgent: "عاجل", active: "جارٍ", completed: "مكتمل" };
const STATUS_TONE: Record<Project["status"], "red" | "cyan" | "green"> = { urgent: "red", active: "cyan", completed: "green" };

/** Projects are listed by their manual order, then by creation date. */
const LIST_OPTIONS = { order: { column: "sort_order", ascending: true } };

function schema({ sectors, regions }: EditorContext): FieldSchema[] {
  return [
    { type: "localized", key: "title", label: "عنوان المشروع", required: true },
    { type: "slug", key: "slug", label: "المعرّف في الرابط (slug)", source: "title", width: "half", required: true },
    {
      type: "select",
      key: "status",
      label: "الحالة",
      width: "half",
      options: [
        { value: "urgent", label: "عاجل" },
        { value: "active", label: "جارٍ" },
        { value: "completed", label: "مكتمل" },
      ],
    },
    { type: "boolean", key: "featured", label: "مشروع مميز", hint: "يظهر ضمن المشاريع ذات الأولوية على الصفحة الرئيسية." },
    { type: "image", key: "coverImage", label: "صورة الغلاف", required: true },
    { type: "localized", key: "summary", label: "ملخص قصير", multiline: true, rows: 2 },
    { type: "localized", key: "description", label: "الوصف الكامل", multiline: true, rows: 6 },
    {
      type: "select",
      key: "sectorSlug",
      label: "المجال",
      width: "half",
      options: sectors.map((s) => ({ value: s.slug, label: s.title.ar })),
    },
    {
      type: "select",
      key: "countrySlug",
      label: "المنطقة / الدولة",
      width: "half",
      options: regions.map((r) => ({ value: r.slug, label: `${r.flag} ${r.name.ar}` })),
    },
    { type: "localized", key: "countryName", label: "اسم الموقع كما يظهر على البطاقة", hint: "مثل «فلسطين (غزة)». يُملأ من اسم المنطقة إن تُرك فارغاً." },
    {
      type: "section",
      key: "funding",
      label: "التمويل",
      fields: [
        { type: "number", key: "goalAmount", label: "المبلغ المستهدف (USD)", width: "third", min: 0 },
        { type: "number", key: "raisedAmount", label: "المبلغ المُجمّع (USD)", width: "third", min: 0 },
        { type: "number", key: "donorsCount", label: "عدد المتبرعين", width: "third", min: 0 },
        { type: "number", key: "beneficiariesCount", label: "عدد المستفيدين", width: "third", min: 0 },
        { type: "date", key: "createdAt", label: "تاريخ الإطلاق", width: "third" },
      ],
    },
    { type: "list", key: "targetGroups", label: "الفئات المستهدفة", itemKind: "localized", addLabel: "إضافة فئة" },
    { type: "gallery", key: "gallery", label: "معرض الصور" },
    {
      type: "list",
      key: "updates",
      label: "التحديثات الميدانية",
      addLabel: "إضافة تحديث",
      newItem: () => ({ date: new Date().toISOString().slice(0, 10), title: EMPTY_LOCALIZED(), text: EMPTY_LOCALIZED(), image: "" }),
      itemTitle: (item) => `${item.date ?? ""} · ${localizedTitle(item.title, "تحديث جديد")}`,
      item: [
        { type: "date", key: "date", label: "التاريخ", width: "half" },
        { type: "localized", key: "title", label: "عنوان التحديث" },
        { type: "localized", key: "text", label: "نص التحديث", multiline: true, rows: 3 },
        { type: "image", key: "image", label: "صورة (اختياري)" },
      ],
    },
  ];
}

export const projectEditor: RecordEditorConfig<Project> = {
  table: "projects",
  label: "المشروع",
  listHref: "/admin/projects",
  listOptions: LIST_OPTIONS,
  fromRow: rowToProject,
  toRow: (draft, sortOrder) => projectToRow({ ...draft, sortOrder: draft.sortOrder || sortOrder }),
  sortOrderOf: (row) => Number(row.sort_order ?? 0),
  create: () => ({
    id: newId("proj"),
    slug: "",
    title: EMPTY_LOCALIZED(),
    summary: EMPTY_LOCALIZED(),
    description: EMPTY_LOCALIZED(),
    sectorSlug: "",
    countrySlug: "",
    countryName: EMPTY_LOCALIZED(),
    targetGroups: [],
    beneficiariesCount: 0,
    goalAmount: 0,
    raisedAmount: 0,
    donorsCount: 0,
    status: "active",
    featured: false,
    coverImage: "",
    gallery: [],
    updates: [],
    createdAt: new Date().toISOString().slice(0, 10),
    sortOrder: 0,
  }),
  schema,
  beforeSave: (draft, { sectors, regions }) => {
    const next = { ...draft };
    if (!next.sectorSlug && sectors[0]) next.sectorSlug = sectors[0].slug;
    if (!next.countrySlug && regions[0]) next.countrySlug = regions[0].slug;
    const region = regions.find((r) => r.slug === next.countrySlug);
    if (region && !next.countryName.ar.trim()) next.countryName = { ...region.name };
    next.updates = next.updates.map((u) => ({ ...u, image: u.image || undefined }));
    return next;
  },
  titleOf: (draft) => localizedTitle(draft.title),
  preview: (draft) => ({
    path: `/projects/${draft.slug || draft.id}`,
    overrides: {
      projects: [{ ...draft, coverImage: imageOr(draft.coverImage), updates: draft.updates.map((u) => ({ ...u, image: u.image || undefined })) }],
    },
  }),
  validate: (draft, others) => {
    if (!draft.title.ar.trim()) return "عنوان المشروع بالعربية مطلوب";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) return "المعرّف في الرابط يجب أن يكون بالإنجليزية (أحرف صغيرة وأرقام وشرطات)";
    if (others.some((p) => p.slug === draft.slug)) return "يوجد مشروع آخر بنفس المعرّف";
    if (!draft.coverImage) return "صورة الغلاف مطلوبة";
    if (draft.goalAmount <= 0) return "المبلغ المستهدف يجب أن يكون أكبر من صفر";
    return null;
  },
};

export const projectList: RecordListConfig<Project> = {
  table: "projects",
  title: "المشاريع",
  description: "كل الحملات والمشاريع. الترتيب هنا هو ترتيب الظهور في قائمة المشاريع.",
  label: "مشروع",
  listOptions: LIST_OPTIONS,
  createHref: "/admin/projects/new",
  editHref: (p) => `/admin/projects/${p.id}`,
  fromRow: rowToProject,
  sortColumn: "sort_order",
  searchText: (p) => `${p.title.ar} ${p.title.en} ${p.title.tr} ${p.slug} ${p.countryName.ar} ${p.sectorSlug}`,
  columns: [
    { key: "cover", label: "", render: (p) => <Thumb src={p.coverImage} />, className: "w-20" },
    {
      key: "title",
      label: "المشروع",
      render: (p) => (
        <div className="min-w-0 max-w-md">
          <div className="font-bold text-slate-900 truncate">{p.title.ar}</div>
          <div className="text-[11px] text-slate-500 truncate">
            {p.countryName.ar} · <span className="font-latin" dir="ltr">{p.sectorSlug}</span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (p) => (
        <div className="flex items-center gap-1.5">
          <Badge tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</Badge>
          {p.featured && <Badge tone="amber">مميز</Badge>}
        </div>
      ),
    },
    {
      key: "funding",
      label: "التمويل",
      render: (p) => {
        const pct = p.goalAmount > 0 ? Math.min(100, Math.round((p.raisedAmount / p.goalAmount) * 100)) : 0;
        return (
          <div className="min-w-[140px]">
            <div className="flex items-center justify-between text-[11px] font-latin text-slate-600">
              <span>{fmtMoney(p.raisedAmount)}</span>
              <span>{pct}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      },
    },
    { key: "donors", label: "المتبرعون", render: (p) => <span className="font-latin">{fmtNumber(p.donorsCount)}</span> },
    { key: "updates", label: "التحديثات", render: (p) => <Badge>{p.updates.length}</Badge> },
  ],
};
