"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { BankAccount, CountryRegion, HomeContent, OrganizationInfo, Sector, SiteSettings } from "@/types";
import { supabase } from "@/lib/supabase";
import { sectorsData } from "@/data/sectors";
import { regionsData } from "@/data/regions";
import { bankAccountsData } from "@/data/bankAccounts";
import { aboutData } from "@/data/about";
import { defaultSiteSettings } from "@/data/siteSettings";
import { defaultHomeContent } from "@/data/homeContent";
import {
  rowToBankAccount,
  rowToRegion,
  rowToSector,
  rowsToAbout,
  rowsToHome,
  rowsToSettings,
} from "@/lib/contentMappers";
import { startPreviewListener, usePreview } from "@/lib/previewBridge";

/**
 * Site content that the admin edits: sectors, regions, bank accounts, the About page,
 * site settings and the home-page stories. Loaded from Supabase with the data/*.ts files
 * as the fallback, and overridden by the admin's unsaved draft inside the preview iframe.
 */

interface ContentValue {
  sectors: Sector[];
  regions: CountryRegion[];
  bankAccounts: BankAccount[];
  about: OrganizationInfo;
  settings: SiteSettings;
  home: HomeContent;
  /** True once at least one table answered from the database. */
  isDbLoaded: boolean;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentValue | undefined>(undefined);

interface Loaded {
  sectors: Sector[];
  regions: CountryRegion[];
  bankAccounts: BankAccount[];
  about: OrganizationInfo;
  settings: SiteSettings;
  home: HomeContent;
}

const DEFAULTS: Loaded = {
  sectors: sectorsData,
  regions: regionsData,
  bankAccounts: bankAccountsData,
  about: aboutData,
  settings: defaultSiteSettings,
  home: defaultHomeContent,
};

async function loadFromDatabase(): Promise<{ data: Partial<Loaded>; touched: boolean }> {
  const [sectors, regions, banks, org, settings] = await Promise.all([
    supabase.from("sectors").select("*").order("sort_order", { ascending: true }),
    supabase.from("regions").select("*").order("sort_order", { ascending: true }),
    supabase.from("bank_accounts").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
    supabase.from("organization_info").select("key,data"),
    supabase.from("site_settings").select("key,data"),
  ]);

  const data: Partial<Loaded> = {};
  let touched = false;

  if (!sectors.error && sectors.data && sectors.data.length > 0) {
    data.sectors = sectors.data.map(rowToSector);
    touched = true;
  }
  if (!regions.error && regions.data && regions.data.length > 0) {
    data.regions = regions.data.map(rowToRegion);
    touched = true;
  }
  if (!banks.error && banks.data && banks.data.length > 0) {
    data.bankAccounts = banks.data.map(rowToBankAccount);
    touched = true;
  }
  if (!org.error && org.data && org.data.length > 0) {
    data.about = rowsToAbout(org.data);
    touched = true;
  }
  if (!settings.error && settings.data && settings.data.length > 0) {
    data.settings = rowsToSettings(settings.data);
    data.home = rowsToHome(settings.data);
    touched = true;
  }
  return { data, touched };
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState<Loaded>(DEFAULTS);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const preview = usePreview();

  const refresh = useCallback(async () => {
    try {
      const { data, touched } = await loadFromDatabase();
      if (touched) {
        setLoaded((current) => ({ ...current, ...data }));
        setIsDbLoaded(true);
      }
    } catch (err) {
      console.warn("Using local content fallback:", err);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Inside the admin's preview iframe: accept the draft and scroll to the edited section.
  useEffect(() => startPreviewListener(), []);
  useEffect(() => {
    if (!preview.scrollTo) return;
    const id = preview.scrollTo;
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => clearTimeout(timer);
  }, [preview.scrollTo]);

  const value = useMemo<ContentValue>(() => {
    const o = preview.overrides;
    return {
      sectors: o.sectors ?? loaded.sectors,
      regions: o.regions ?? loaded.regions,
      bankAccounts: o.bankAccounts ?? loaded.bankAccounts,
      about: o.about ?? loaded.about,
      settings: o.settings ?? loaded.settings,
      home: o.home ?? loaded.home,
      isDbLoaded,
      refresh,
    };
  }, [loaded, preview.overrides, isDbLoaded, refresh]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentValue {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within a ContentProvider");
  return context;
}

/* Derived figures used by several pages. */

export function sectorTotalsOf(sectors: Sector[]) {
  const totals = sectors.reduce(
    (acc, sector) => ({
      projects: acc.projects + sector.stats.projectsCount,
      beneficiaries: acc.beneficiaries + sector.stats.beneficiariesCount,
      completed: acc.completed + sector.stats.completedProjects,
    }),
    { projects: 0, beneficiaries: 0, completed: 0 }
  );
  const completionRate = totals.projects > 0 ? Math.round((totals.completed / totals.projects) * 100) : 0;
  return { ...totals, completionRate };
}

export function regionTotalsOf(regions: CountryRegion[]) {
  return regions.reduce(
    (acc, region) => ({
      regions: acc.regions + 1,
      projects: acc.projects + region.activeProjectsCount,
      beneficiaries: acc.beneficiaries + region.beneficiariesCount,
    }),
    { regions: 0, projects: 0, beneficiaries: 0 }
  );
}
