"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ClipboardList, CreditCard } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { useContent } from "@/context/ContentContext";
import { bankBrand } from "@/data/banks";
import type { BankAccount } from "@/types";
import {
  BankLogo,
  BanksHeading,
  CURRENCIES,
  CURRENCY_META,
  CopyButton,
  CurrencyBadge,
  type CurrencyFilter,
  type Translate,
  accountSummary,
  fadeUp,
  groupByBank,
  useCopy,
  viewportOnce,
} from "./shared";

const FILTERS: CurrencyFilter[] = ["all", ...CURRENCIES];

interface RowProps {
  account: BankAccount;
  selected: boolean;
  copied: boolean;
  onSelect: () => void;
  onCopy: () => void;
  t: Translate;
}

/**
 * One account as a ledger line under its bank's heading: a radio, the currency, the IBAN in full,
 * the SWIFT code and a copy button. The bank's colour runs as a strip along the start edge.
 */
function AccountRow({ account, selected, copied, onSelect, onCopy, t }: RowProps) {
  const brand = bankBrand(account.bankName);

  return (
    <li
      onClick={onSelect}
      className={clsx(
        "group relative cursor-pointer overflow-hidden rounded-2xl border bg-white transition-colors",
        selected ? "border-primary-500 shadow-brand-soft ring-1 ring-primary-500" : "border-slate-200 hover:border-primary-300"
      )}
    >
      <span aria-hidden className="absolute inset-y-0 start-0 w-1" style={{ backgroundColor: brand?.color ?? "#0f172a" }} />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 p-4 ps-5 sm:p-5 sm:ps-6">
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          aria-label={t("banksSelectAccount")}
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          className="flex items-center gap-3"
        >
          <span
            className={clsx(
              "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
              selected ? "border-primary-500 bg-primary-500 text-white" : "border-slate-300 group-hover:border-primary-400"
            )}
          >
            {selected && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <CurrencyBadge currency={account.currency} />
        </button>

        {/* Values stay inline inside page-direction blocks so they line up under their labels in RTL too. */}
        <div className="min-w-0 flex-1 basis-56">
          <span className="block text-[11px] font-semibold text-slate-500">IBAN</span>
          <span className="block break-words font-mono text-sm font-semibold tracking-wide text-slate-900 sm:text-base">
            <bdi dir="ltr">{account.iban}</bdi>
          </span>
        </div>

        <div className="hidden md:block">
          <span className="block text-[11px] font-semibold text-slate-500">SWIFT</span>
          <span className="block font-mono text-sm font-semibold text-slate-700">
            <bdi dir="ltr">{account.swiftCode}</bdi>
          </span>
        </div>

        <CopyButton copied={copied} onCopy={onCopy} label={t("copyIban")} copiedLabel={t("copied")} />
      </div>
    </li>
  );
}

interface FieldProps {
  label: string;
  value: string;
  mono?: boolean;
  ltr?: boolean;
  copyKey?: string;
  copied?: string | null;
  onCopy?: (key: string, text: string) => void;
  t: Translate;
}

function SheetField({ label, value, mono, ltr, copyKey, copied, onCopy, t }: FieldProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 py-3.5">
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold text-slate-500">{label}</dt>
        <dd className={clsx("mt-0.5 break-words text-sm font-semibold text-slate-900", mono && "font-mono tracking-wide")}>
          {ltr ? <bdi dir="ltr">{value}</bdi> : value}
        </dd>
      </div>
      {copyKey && onCopy && (
        <CopyButton copied={copied === copyKey} onCopy={() => onCopy(copyKey, value)} label={label} copiedLabel={t("copied")} />
      )}
    </div>
  );
}

/**
 * Accounts grouped by bank and filtered by currency, beside a "transfer sheet" that shows the
 * selected account the way a bank's transfer form asks for it.
 */
export function BanksLedger() {
  const { t } = useLanguage();
  const { openQuickDonate } = useDonation();
  const { copied, copy } = useCopy();
  const { bankAccounts: bankAccountsData } = useContent();
  const [filter, setFilter] = useState<CurrencyFilter>("all");
  const [selectedId, setSelectedId] = useState(bankAccountsData[0]?.id ?? "");

  const visible = useMemo(
    () => (filter === "all" ? bankAccountsData : bankAccountsData.filter((account) => account.currency === filter)),
    [filter, bankAccountsData]
  );
  const groups = useMemo(() => groupByBank(visible), [visible]);
  /* Falls back to the first visible account when the filter hides the chosen one. */
  const selected = visible.find((account) => account.id === selectedId) ?? visible[0];

  return (
    <section id="accounts" className="scroll-mt-28 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <BanksHeading eyebrow={t("banksAccountsEyebrow")} title={t("banksAccountsTitle")} description={t("banksAccountsDesc")} />
          </div>

          <div role="radiogroup" aria-label={t("banksAccountsEyebrow")} className="flex flex-wrap gap-2">
            {FILTERS.map((value) => {
              const active = filter === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setFilter(value)}
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors sm:text-sm",
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-700"
                  )}
                >
                  {value === "all" ? (
                    t("banksFilterAll")
                  ) : (
                    <>
                      <span dir="ltr">
                        {CURRENCY_META[value].symbol} <span className="font-latin">{value}</span>
                      </span>
                      <span className="hidden opacity-70 sm:inline">{t(CURRENCY_META[value].labelKey)}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12"
        >
          <div className="space-y-8 lg:col-span-7">
            {groups.map((group) => (
              <div key={group.name}>
                {/* On narrow screens the name and branch wrap under the logo instead of being clipped. */}
                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <BankLogo bankName={group.name} className="h-9 sm:h-10" />
                  <span aria-hidden className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block" />
                  <div className="min-w-0 flex-1 basis-44">
                    <h3 className="text-sm font-bold text-slate-900">{group.name}</h3>
                    <p className="text-xs text-slate-500">{group.branch}</p>
                  </div>
                  <span dir="ltr" className="ms-auto hidden items-center gap-1 sm:flex">
                    {group.accounts.map((account) => (
                      <span
                        key={account.id}
                        className="rounded-md bg-slate-100 px-1.5 py-0.5 font-latin text-[11px] font-bold text-slate-600"
                      >
                        {account.currency}
                      </span>
                    ))}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {group.accounts.map((account) => (
                    <AccountRow
                      key={account.id}
                      account={account}
                      selected={selected?.id === account.id}
                      copied={copied === account.id}
                      onSelect={() => setSelectedId(account.id)}
                      onCopy={() => copy(account.id, account.iban)}
                      t={t}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {selected && (
            <aside className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-28">
                <div className="relative flex items-center justify-between gap-4 bg-slate-900 px-6 py-5 text-white">
                  {/* The selected bank's colour along the top of the sheet. */}
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: bankBrand(selected.bankName)?.color }} />
                  <div>
                    <span className="block text-[11px] font-bold text-primary-300">{t("banksSheetEyebrow")}</span>
                    <h3 className="font-brand text-lg font-extrabold sm:text-xl">{t("banksSheetTitle")}</h3>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <BankLogo bankName={selected.bankName} tone="dark" className="h-9" />
                    <CurrencyBadge currency={selected.currency} tone="dark" />
                  </div>
                </div>

                {/* Keyed so a new selection re-runs the short fade. */}
                <dl key={selected.id} className="animate-fadeIn divide-y divide-slate-100">
                  <SheetField
                    label={t("banksLabelHolder")}
                    value={selected.accountHolder}
                    ltr
                    copyKey="sheet-holder"
                    copied={copied}
                    onCopy={copy}
                    t={t}
                  />
                  <SheetField label={t("banksLabelBank")} value={selected.bankName} ltr t={t} />
                  <SheetField label={t("banksLabelBranch")} value={selected.branchName} ltr t={t} />
                  <SheetField label="IBAN" value={selected.iban} mono ltr copyKey="sheet-iban" copied={copied} onCopy={copy} t={t} />
                  <SheetField
                    label="SWIFT / BIC"
                    value={selected.swiftCode}
                    mono
                    ltr
                    copyKey="sheet-swift"
                    copied={copied}
                    onCopy={copy}
                    t={t}
                  />
                  <SheetField
                    label={t("banksLabelCurrency")}
                    value={`${selected.currency} · ${t(CURRENCY_META[selected.currency].labelKey)}`}
                    t={t}
                  />
                  <div className="px-6 py-4">
                    <dt className="text-[11px] font-semibold text-slate-500">{t("banksLabelDescription")}</dt>
                    <dd className="mt-1.5 rounded-xl border border-dashed border-primary-300 bg-primary-50/60 px-3 py-2 text-sm font-semibold text-primary-800">
                      {t("banksDescriptionHint")}
                    </dd>
                  </div>
                </dl>

                <div className="space-y-3 border-t border-slate-100 bg-slate-50 p-5">
                  <button
                    type="button"
                    onClick={() => copy("all", accountSummary(selected, t))}
                    className={clsx(
                      "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-black text-white transition-colors",
                      copied === "all" ? "bg-emerald-500" : "bg-primary-500 hover:bg-primary-600"
                    )}
                  >
                    {copied === "all" ? <Check className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
                    {copied === "all" ? t("banksCopiedAll") : t("banksCopyAll")}
                  </button>
                  <button
                    type="button"
                    onClick={() => openQuickDonate()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <CreditCard className="h-4 w-4" />
                    {t("banksPayByCard")}
                  </button>
                  <p className="text-center text-[11px] leading-relaxed text-slate-500">{t("bankTransferNote")}</p>
                </div>
              </div>
            </aside>
          )}
        </motion.div>
      </div>
    </section>
  );
}
