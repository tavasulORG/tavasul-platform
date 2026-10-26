"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import clsx from "clsx";
import type { BankAccount } from "@/types";
import type { translations } from "@/data/translations";
import { bankBrand } from "@/data/banks";

export { EASE, fadeUp, stagger, viewportOnce } from "@/components/about/shared";
export { pad } from "@/components/sectors/shared";

export type TranslationKey = keyof typeof translations.ar;
export type Translate = (key: TranslationKey) => string;
export type BankCurrency = BankAccount["currency"];
export type CurrencyFilter = "all" | BankCurrency;

/** The official beneficiary: the holder of the first account (every account shares it). */
export function accountHolderOf(accounts: BankAccount[]): string {
  return accounts[0]?.accountHolder ?? "";
}

export const CURRENCIES: BankCurrency[] = ["TRY", "USD", "EUR"];

export const CURRENCY_META: Record<BankCurrency, { symbol: string; labelKey: TranslationKey }> = {
  TRY: { symbol: "₺", labelKey: "banksCurrencyTRY" },
  USD: { symbol: "$", labelKey: "banksCurrencyUSD" },
  EUR: { symbol: "€", labelKey: "banksCurrencyEUR" },
};

export interface BankGroup {
  name: string;
  branch: string;
  accounts: BankAccount[];
}

/** Accounts grouped by bank in data order; a bank's accounts share one branch. */
export function groupByBank(accounts: BankAccount[]): BankGroup[] {
  const groups: BankGroup[] = [];
  for (const account of accounts) {
    const group = groups.find((g) => g.name === account.bankName);
    if (group) group.accounts.push(account);
    else groups.push({ name: account.bankName, branch: account.branchName, accounts: [account] });
  }
  return groups;
}

/** "KT" for "Kuveyt Türk Katılım Bankası": the initials of the first two words. */
export function bankInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/** One account's details as plain text, labelled in the page language, for the "copy all" button. */
export function accountSummary(account: BankAccount, t: Translate) {
  return [
    `${t("banksLabelHolder")}: ${account.accountHolder}`,
    `${t("banksLabelBank")}: ${account.bankName}`,
    `${t("banksLabelBranch")}: ${account.branchName}`,
    `${t("banksLabelCurrency")}: ${account.currency}`,
    `IBAN: ${account.iban}`,
    `SWIFT: ${account.swiftCode}`,
  ].join("\n");
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Non-secure contexts and older browsers: fall back to a hidden textarea.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }
}

/** Remembers which key was copied last and forgets it after `resetMs`. */
export function useCopy(resetMs = 2000) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copy = useCallback(
    async (key: string, text: string) => {
      await writeClipboard(text);
      setCopied(key);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), resetMs);
    },
    [resetMs]
  );

  return { copied, copy };
}

interface CopyButtonProps {
  copied: boolean;
  onCopy: () => void;
  label: string;
  copiedLabel: string;
  /** icon: square icon button; pill: brand button with label; ghost: translucent label button for dark panels. */
  variant?: "icon" | "pill" | "ghost";
  className?: string;
}

export function CopyButton({ copied, onCopy, label, copiedLabel, variant = "icon", className }: CopyButtonProps) {
  const Icon = copied ? Check : Copy;

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? copiedLabel : label}
        title={label}
        className={clsx(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
          copied
            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
            : "border-slate-200 bg-white text-primary-600 hover:border-primary-300 hover:bg-primary-50",
          className
        )}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={clsx(
        "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors",
        copied
          ? "bg-emerald-500 text-white"
          : variant === "pill"
            ? "bg-primary-500 text-white hover:bg-primary-600"
            : "bg-white/15 text-white hover:bg-white/25",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {copied ? copiedLabel : label}
    </button>
  );
}

interface CurrencyBadgeProps {
  currency: BankCurrency;
  tone?: "light" | "dark";
  className?: string;
}

export function CurrencyBadge({ currency, tone = "light", className }: CurrencyBadgeProps) {
  return (
    <span
      dir="ltr"
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide",
        tone === "light" ? "bg-slate-100 text-slate-800" : "bg-white/15 text-white",
        className
      )}
    >
      <span className="text-sm leading-none">{CURRENCY_META[currency].symbol}</span>
      <span className="font-latin">{currency}</span>
    </span>
  );
}

/** Dark tile with the bank's initials: the fallback for a bank without an entry in data/banks.ts. */
export function BankMark({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 font-latin text-sm font-bold text-white",
        className
      )}
    >
      {bankInitials(name)}
    </span>
  );
}

interface BankLogoProps {
  bankName: string;
  /** Set the height with an `h-*` class; the width follows the logo's own proportions. */
  className?: string;
  /** On dark panels the logo sits in a white chip so every bank's colours stay legible. */
  tone?: "light" | "dark";
}

/** The bank's own logo from data/banks.ts, with its name as the alt text; initials when the bank has no entry. */
export function BankLogo({ bankName, className, tone = "light" }: BankLogoProps) {
  const brand = bankBrand(bankName);
  if (!brand) return <BankMark name={bankName} className={clsx("aspect-square", className)} />;

  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center",
        tone === "dark" && "rounded-lg bg-white px-2.5 py-1.5",
        className
      )}
    >
      <Image
        src={brand.logo}
        alt={brand.name}
        width={Math.round(brand.ratio * 48)}
        height={48}
        unoptimized
        className="h-full w-auto"
      />
    </span>
  );
}

interface HeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  tone?: "dark" | "light";
}

/** A small tag-like eyebrow over the title, like a label on a bank form. */
export function BanksHeading({ eyebrow, title, description, align = "start", tone = "dark" }: HeadingProps) {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <div className={clsx("space-y-3", centered && "mx-auto max-w-2xl text-center")}>
      {eyebrow && (
        <span
          className={clsx(
            "inline-block rounded-md px-2.5 py-1 text-[11px] font-bold sm:text-xs",
            dark ? "bg-primary-50 text-primary-700" : "bg-white/10 text-primary-300"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={clsx(
          "font-brand text-2xl font-extrabold leading-tight sm:text-3xl lg:text-[2.125rem]",
          dark ? "text-slate-900" : "text-white"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={clsx("text-sm leading-relaxed sm:text-base", dark ? "text-slate-500" : "text-slate-300")}>
          {description}
        </p>
      )}
    </div>
  );
}
