"use client";

import type { BankAccount } from "@/types";
import { newId } from "@/lib/adminClient";
import { bankAccountToRow, rowToBankAccount } from "@/lib/contentMappers";
import { banksData } from "@/data/banks";
import type { RecordEditorConfig } from "../RecordEditor";
import type { RecordListConfig } from "../RecordList";
import { type FieldSchema } from "../SchemaForm";
import { Badge } from "../ui";

const schema: FieldSchema[] = [
  {
    type: "text",
    key: "bankName",
    label: "اسم البنك",
    required: true,
    dir: "ltr",
    hint: `البنوك التي لها شعار جاهز: ${banksData.map((b) => b.name).join(" · ")}. اكتب الاسم مطابقاً ليظهر الشعار.`,
  },
  { type: "text", key: "accountHolder", label: "اسم صاحب الحساب (المستفيد)", required: true, dir: "ltr" },
  {
    type: "select",
    key: "currency",
    label: "العملة",
    width: "third",
    options: [
      { value: "TRY", label: "TRY ليرة تركية" },
      { value: "USD", label: "USD دولار أمريكي" },
      { value: "EUR", label: "EUR يورو" },
    ],
  },
  { type: "text", key: "iban", label: "IBAN", required: true, dir: "ltr", mono: true, width: "third" },
  { type: "text", key: "swiftCode", label: "SWIFT / BIC", dir: "ltr", mono: true, width: "third" },
  { type: "text", key: "branchName", label: "الفرع", dir: "ltr" },
  { type: "color", key: "iconColor", label: "لون مميز", hint: "يُستخدم كلمسة لونية بجانب الحساب." },
  { type: "boolean", key: "isActive", label: "حساب نشط", hint: "الحسابات غير النشطة تبقى محفوظة لكنها لا تظهر في الموقع." },
];

export const bankEditor: RecordEditorConfig<BankAccount> = {
  table: "bank_accounts",
  label: "الحساب البنكي",
  listHref: "/admin/banks",
  fromRow: rowToBankAccount,
  toRow: bankAccountToRow,
  sortOrderOf: (row) => Number(row.sort_order ?? 0),
  create: () => ({
    id: newId("bank"),
    bankName: "",
    accountHolder: "TAVASUL YARDIM VE KALKINMA DERNEĞİ",
    currency: "TRY",
    iban: "",
    swiftCode: "",
    branchName: "",
    iconColor: "#0284c7",
    isActive: true,
  }),
  schema,
  titleOf: (draft) => `${draft.bankName} · ${draft.currency}`,
  preview: (_draft, all) => ({ path: "/bank-accounts#accounts", overrides: { bankAccounts: all.filter((a) => a.isActive !== false) } }),
  validate: (draft) => {
    if (!draft.bankName.trim()) return "اسم البنك مطلوب";
    if (!draft.accountHolder.trim()) return "اسم صاحب الحساب مطلوب";
    if (draft.iban.replace(/\s/g, "").length < 15) return "رقم IBAN غير مكتمل";
    return null;
  },
};

export const bankList: RecordListConfig<BankAccount> = {
  table: "bank_accounts",
  title: "الحسابات البنكية",
  description: "حسابات التبرع الرسمية كما تظهر في صفحة الحسابات البنكية وفي نافذة التبرع.",
  label: "حساب",
  createHref: "/admin/banks/new",
  editHref: (b) => `/admin/banks/${b.id}`,
  fromRow: rowToBankAccount,
  sortColumn: "sort_order",
  searchText: (b) => `${b.bankName} ${b.currency} ${b.iban} ${b.branchName}`,
  columns: [
    {
      key: "bank",
      label: "البنك",
      render: (b) => (
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full" style={{ backgroundColor: b.iconColor }} />
          <div className="min-w-0">
            <div className="font-bold text-slate-900 font-latin truncate" dir="ltr">
              {b.bankName}
            </div>
            <div className="text-[11px] text-slate-500 font-latin truncate" dir="ltr">
              {b.branchName}
            </div>
          </div>
        </div>
      ),
    },
    { key: "currency", label: "العملة", render: (b) => <Badge tone="cyan">{b.currency}</Badge> },
    {
      key: "iban",
      label: "IBAN",
      render: (b) => (
        <span className="font-latin text-xs text-slate-700" dir="ltr">
          {b.iban}
        </span>
      ),
    },
    { key: "swift", label: "SWIFT", render: (b) => <span className="font-latin text-xs" dir="ltr">{b.swiftCode}</span> },
    { key: "active", label: "الحالة", render: (b) => (b.isActive === false ? <Badge>مخفي</Badge> : <Badge tone="green">نشط</Badge>) },
  ],
};
