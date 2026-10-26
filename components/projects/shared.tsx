"use client";

import type { Language, Project } from "@/types";
import type { translations } from "@/data/translations";

export { EASE, fadeUp, stagger, viewportOnce } from "@/components/about/shared";
export { CornerFrame, SectorIcon, SectorsHeading as ProjectsHeading, numberFormat } from "@/components/sectors/shared";

export type TranslationKey = keyof typeof translations.ar;
export type Translate = (key: TranslationKey) => string;
export type StatusFilter = "all" | Project["status"];

export const STATUS_ORDER: Record<Project["status"], number> = { urgent: 0, active: 1, completed: 2 };

/** Hexagon node of the template's timeline slide (a clip-path utility class). */
export const HEX = "[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]";

/** Urgent first, then active, then completed; featured first within a status; newest first after that. */
export function sortProjects(projects: Project[]) {
  return [...projects].sort(
    (a, b) =>
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      Number(b.featured) - Number(a.featured) ||
      b.createdAt.localeCompare(a.createdAt)
  );
}

/** Portfolio figures derived from the live project list. */
export function projectTotals(projects: Project[]) {
  const totals = projects.reduce(
    (acc, project) => ({
      count: acc.count + 1,
      urgent: acc.urgent + (project.status === "urgent" ? 1 : 0),
      active: acc.active + (project.status === "active" ? 1 : 0),
      completed: acc.completed + (project.status === "completed" ? 1 : 0),
      beneficiaries: acc.beneficiaries + project.beneficiariesCount,
      donors: acc.donors + project.donorsCount,
      goal: acc.goal + project.goalAmount,
      raised: acc.raised + project.raisedAmount,
    }),
    { count: 0, urgent: 0, active: 0, completed: 0, beneficiaries: 0, donors: 0, goal: 0, raised: 0 }
  );
  return { ...totals, fundedPct: totals.goal ? Math.round((totals.raised / totals.goal) * 100) : 0 };
}

export function fundedPercent(project: Project) {
  if (!project.goalAmount) return 0;
  return Math.min(100, Math.round((project.raisedAmount / project.goalAmount) * 100));
}

/** Status tag colours: brand cyan for urgent, white for in progress, dark for completed. Same mapping on every page. */
export const STATUS_TAG: Record<Project["status"], string> = {
  urgent: "bg-primary-500 text-white",
  active: "bg-white/95 text-slate-900",
  completed: "bg-slate-900/85 text-white",
};

export function statusLabel(status: Project["status"], t: Translate) {
  if (status === "urgent") return t("urgentBadge");
  if (status === "completed") return t("completedBadge");
  return t("whereStatusActive");
}

const DATE_LOCALES: Record<Language, string> = { ar: "ar-u-nu-latn", tr: "tr-TR", en: "en-GB" };

/** Long date in the page language with Latin digits; noon avoids the day shifting with the time zone. */
/** Accepts a date-only string ("2026-03-28") or a full timestamp (as stored by Supabase). */
export function formatDate(iso: string, language: Language) {
  const value = iso.includes("T") ? iso : `${iso}T12:00:00`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(DATE_LOCALES[language], { year: "numeric", month: "long", day: "numeric" }).format(date);
}
