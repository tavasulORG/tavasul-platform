import type {
  BankAccount,
  CountryRegion,
  HomeContent,
  LocalizedString,
  OrganizationInfo,
  Project,
  Sector,
  SiteSettings,
} from "@/types";
import { aboutData } from "@/data/about";
import { defaultSiteSettings } from "@/data/siteSettings";
import { defaultHomeContent } from "@/data/homeContent";

/* ----------------------------------------------------------------------------
 * Row <-> model mappers shared by the public site, the admin and the seed route.
 * Rows are the snake_case shapes of supabase/schema.sql; models are the camelCase
 * types in types/index.ts that every component consumes.
 * ------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export const EMPTY_LOCALIZED: LocalizedString = { ar: "", tr: "", en: "" };

/** Shown wherever a record has no photo yet (new records in the admin preview, empty rows). */
export const PLACEHOLDER_IMAGE = "/images/hero-poster.jpg";

export function imageOr(src: unknown, fallback = PLACEHOLDER_IMAGE): string {
  return typeof src === "string" && src.trim() ? src : fallback;
}

export function localized(value: unknown): LocalizedString {
  if (value && typeof value === "object") {
    const v = value as Partial<LocalizedString>;
    return { ar: v.ar ?? "", tr: v.tr ?? "", en: v.en ?? "" };
  }
  return { ...EMPTY_LOCALIZED };
}

function localizedList(value: unknown): LocalizedString[] {
  return Array.isArray(value) ? value.map(localized) : [];
}

function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/* Sectors */

export function rowToSector(row: Row): Sector {
  const stats = row.stats ?? {};
  return {
    id: String(row.id),
    slug: String(row.slug),
    iconName: row.icon_name ?? "Users",
    coverImage: imageOr(row.cover_image),
    title: localized(row.title),
    subtitle: localized(row.subtitle),
    description: localized(row.description),
    objectives: localizedList(row.objectives),
    stats: {
      projectsCount: num(stats.projectsCount),
      beneficiariesCount: num(stats.beneficiariesCount),
      completedProjects: num(stats.completedProjects),
    },
  };
}

export function sectorToRow(sector: Sector, sortOrder: number): Row {
  return {
    id: sector.id,
    slug: sector.slug,
    icon_name: sector.iconName,
    cover_image: sector.coverImage,
    title: sector.title,
    subtitle: sector.subtitle,
    description: sector.description,
    objectives: sector.objectives,
    stats: sector.stats,
    sort_order: sortOrder,
  };
}

/* Regions */

export function rowToRegion(row: Row): CountryRegion {
  return {
    id: String(row.id),
    slug: String(row.slug),
    flag: row.flag ?? "",
    coverImage: imageOr(row.cover_image),
    name: localized(row.name),
    headline: localized(row.headline),
    overview: localized(row.overview),
    beneficiariesCount: num(row.beneficiaries_count),
    activeProjectsCount: num(row.active_projects_count),
    keyInterventions: localizedList(row.key_interventions),
  };
}

export function regionToRow(region: CountryRegion, sortOrder: number): Row {
  return {
    id: region.id,
    slug: region.slug,
    flag: region.flag,
    cover_image: region.coverImage,
    name: region.name,
    headline: region.headline,
    overview: region.overview,
    beneficiaries_count: region.beneficiariesCount,
    active_projects_count: region.activeProjectsCount,
    key_interventions: region.keyInterventions,
    sort_order: sortOrder,
  };
}

/* Projects */

export function rowToProject(row: Row): Project {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: localized(row.title),
    summary: localized(row.summary),
    description: localized(row.description),
    sectorSlug: row.sector_slug ?? "",
    countrySlug: row.country_slug ?? "",
    countryName: localized(row.country_name),
    targetGroups: localizedList(row.target_groups),
    beneficiariesCount: num(row.beneficiaries_count),
    goalAmount: num(row.goal_amount),
    raisedAmount: num(row.raised_amount),
    donorsCount: num(row.donors_count),
    status: row.status === "urgent" || row.status === "completed" ? row.status : "active",
    featured: Boolean(row.featured),
    coverImage: imageOr(row.cover_image),
    gallery: Array.isArray(row.gallery) ? row.gallery.filter((g: unknown) => typeof g === "string") : [],
    updates: Array.isArray(row.updates)
      ? row.updates.map((u: Row) => ({
          date: String(u.date ?? ""),
          title: localized(u.title),
          text: localized(u.text),
          image: typeof u.image === "string" && u.image ? u.image : undefined,
        }))
      : [],
    createdAt: row.created_at ?? new Date().toISOString(),
    sortOrder: num(row.sort_order),
  };
}

export function projectToRow(project: Project): Row {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description,
    sector_slug: project.sectorSlug,
    country_slug: project.countrySlug,
    country_name: project.countryName,
    target_groups: project.targetGroups,
    beneficiaries_count: project.beneficiariesCount,
    goal_amount: project.goalAmount,
    raised_amount: project.raisedAmount,
    donors_count: project.donorsCount,
    status: project.status,
    featured: project.featured,
    cover_image: project.coverImage,
    gallery: project.gallery,
    updates: project.updates,
    sort_order: project.sortOrder ?? 0,
    created_at: project.createdAt,
  };
}

/* Bank accounts */

export function rowToBankAccount(row: Row): BankAccount {
  return {
    id: String(row.id),
    bankName: row.bank_name ?? "",
    accountHolder: row.account_holder ?? "",
    currency: row.currency === "USD" || row.currency === "EUR" ? row.currency : "TRY",
    iban: row.iban ?? "",
    swiftCode: row.swift_code ?? "",
    branchName: row.branch_name ?? "",
    iconColor: row.icon_color ?? "#0284c7",
    isActive: row.is_active !== false,
  };
}

export function bankAccountToRow(account: BankAccount, sortOrder: number): Row {
  return {
    id: account.id,
    bank_name: account.bankName,
    account_holder: account.accountHolder,
    currency: account.currency,
    iban: account.iban,
    swift_code: account.swiftCode,
    branch_name: account.branchName,
    icon_color: account.iconColor,
    sort_order: sortOrder,
    is_active: account.isActive !== false,
  };
}

/* Organization info: one row per section of the About page. */

export const ORG_INFO_KEYS = [
  "general",
  "our_story",
  "who_we_are",
  "vision",
  "mission",
  "goals",
  "values",
  "target_groups",
  "governance",
  "partners",
] as const;
export type OrgInfoKey = (typeof ORG_INFO_KEYS)[number];

export function aboutToRows(about: OrganizationInfo): { key: OrgInfoKey; data: unknown }[] {
  return [
    {
      key: "general",
      data: {
        licenseNumber: about.licenseNumber,
        foundedYear: about.foundedYear,
        foundationCity: about.foundationCity,
        originHeritage: about.originHeritage,
      },
    },
    { key: "our_story", data: about.ourStory },
    { key: "who_we_are", data: about.whoWeAre },
    { key: "vision", data: about.vision },
    { key: "mission", data: about.mission },
    { key: "goals", data: about.goals },
    { key: "values", data: about.values },
    { key: "target_groups", data: about.targetGroups },
    { key: "governance", data: about.governance },
    { key: "partners", data: about.partners },
  ];
}

/** Builds the About model from organization_info rows, filling gaps from data/about.ts. */
export function rowsToAbout(rows: { key: string; data: unknown }[]): OrganizationInfo {
  const byKey = new Map(rows.map((r) => [r.key, r.data as Row]));
  const general = (byKey.get("general") ?? {}) as Row;
  const governance = (byKey.get("governance") ?? {}) as Row;
  const partners = (byKey.get("partners") ?? {}) as Row;
  return {
    licenseNumber: general.licenseNumber ?? aboutData.licenseNumber,
    foundedYear: num(general.foundedYear, aboutData.foundedYear),
    foundationCity: general.foundationCity ?? aboutData.foundationCity,
    originHeritage: general.originHeritage ?? aboutData.originHeritage,
    ourStory: (byKey.get("our_story") as OrganizationInfo["ourStory"]) ?? aboutData.ourStory,
    whoWeAre: (byKey.get("who_we_are") as OrganizationInfo["whoWeAre"]) ?? aboutData.whoWeAre,
    vision: byKey.has("vision") ? localized(byKey.get("vision")) : aboutData.vision,
    mission: byKey.has("mission") ? localized(byKey.get("mission")) : aboutData.mission,
    goals: Array.isArray(byKey.get("goals")) ? (byKey.get("goals") as OrganizationInfo["goals"]) : aboutData.goals,
    values: Array.isArray(byKey.get("values")) ? (byKey.get("values") as OrganizationInfo["values"]) : aboutData.values,
    targetGroups: Array.isArray(byKey.get("target_groups"))
      ? (byKey.get("target_groups") as OrganizationInfo["targetGroups"])
      : aboutData.targetGroups,
    governance: {
      boardOfDirectors: Array.isArray(governance.boardOfDirectors)
        ? governance.boardOfDirectors
        : aboutData.governance.boardOfDirectors,
      reports: Array.isArray(governance.reports) ? governance.reports : aboutData.governance.reports,
    },
    partners: {
      funding: Array.isArray(partners.funding) ? partners.funding : aboutData.partners.funding,
      implementing: Array.isArray(partners.implementing) ? partners.implementing : aboutData.partners.implementing,
    },
  };
}

/* Site settings */

export function rowsToSettings(rows: { key: string; data: unknown }[]): SiteSettings {
  const general = (rows.find((r) => r.key === "general")?.data ?? {}) as Partial<SiteSettings>;
  return {
    ...defaultSiteSettings,
    ...general,
    socials: { ...defaultSiteSettings.socials, ...(general.socials ?? {}) },
  };
}

export function rowsToHome(rows: { key: string; data: unknown }[]): HomeContent {
  const home = (rows.find((r) => r.key === "home")?.data ?? {}) as Partial<HomeContent>;
  return {
    impactHeadline: home.impactHeadline ? localized(home.impactHeadline) : defaultHomeContent.impactHeadline,
    impactStories: Array.isArray(home.impactStories) && home.impactStories.length > 0
      ? home.impactStories
      : defaultHomeContent.impactStories,
  };
}
