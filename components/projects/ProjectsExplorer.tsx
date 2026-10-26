"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { useContent } from "@/context/ContentContext";
import type { CountrySlug, Project, SectorSlug } from "@/types";
import { ProjectTile } from "./ProjectTile";
import { type StatusFilter, sortProjects, stagger, viewportOnce } from "./shared";

const STATUSES: StatusFilter[] = ["all", "urgent", "active", "completed"];

function isStatus(value: string | null): value is StatusFilter {
  return value !== null && (STATUSES as string[]).includes(value);
}

/** Filter toolbar and the project grid. The filters live in the URL (?status=&sector=&country=&q=), so links can deep-link. */
export function ProjectsExplorer() {
  const { language, t } = useLanguage();
  const { projects } = useDonation();
  const { sectors, regions } = useContent();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [status, setStatus] = useState<StatusFilter>(() => {
    const value = searchParams.get("status");
    return isStatus(value) ? value : "all";
  });
  const [sector, setSector] = useState<string>(searchParams.get("sector") ?? "");
  const [country, setCountry] = useState<string>(searchParams.get("country") ?? "");
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");

  // Mirror the filters into the address bar without a navigation.
  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (sector) params.set("sector", sector);
    if (country) params.set("country", country);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    window.history.replaceState(window.history.state, "", qs ? `${pathname}?${qs}` : pathname);
  }, [status, sector, country, query, pathname]);

  const counts = useMemo(
    () =>
      projects.reduce<Record<StatusFilter, number>>(
        (acc, project) => {
          acc.all += 1;
          acc[project.status] += 1;
          return acc;
        },
        { all: 0, urgent: 0, active: 0, completed: 0 }
      ),
    [projects]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = (project: Project) =>
      (status === "all" || project.status === status) &&
      (!sector || project.sectorSlug === (sector as SectorSlug)) &&
      (!country || project.countrySlug === (country as CountrySlug)) &&
      (!needle ||
        [project.title, project.summary, project.countryName].some((text) =>
          Object.values(text).some((value) => value.toLowerCase().includes(needle))
        ));
    return sortProjects(projects.filter(matches));
  }, [projects, status, sector, country, query]);

  const filtered = status !== "all" || sector !== "" || country !== "" || query.trim() !== "";
  const reset = () => {
    setStatus("all");
    setSector("");
    setCountry("");
    setQuery("");
  };

  const statusText: Record<StatusFilter, string> = {
    all: t("all"),
    urgent: t("projectsStatusUrgent"),
    active: t("projectsStatusActive"),
    completed: t("projectsStatusCompleted"),
  };

  // Fixed widths on large screens: a select otherwise grows to its longest option and pushes the tabs onto two lines.
  const selectClass =
    "h-11 w-full lg:w-48 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500";

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        {/* Toolbar: status tabs, two selects and a search box. */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center gap-3">
          <div role="tablist" aria-label={t("filterStatus")} className="inline-flex flex-wrap gap-1 rounded-full bg-white border border-slate-200 p-1">
            {STATUSES.map((value) => {
              const active = status === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatus(value)}
                  className={clsx(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-colors",
                    active ? "bg-primary-500 text-white" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {statusText[value]}
                  <span
                    className={clsx(
                      "font-latin text-[10px] rounded-full px-1.5 py-0.5 leading-none",
                      active ? "bg-white/20" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {counts[value]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:ms-auto lg:items-center">
            <select aria-label={t("filterBySector")} value={sector} onChange={(e) => setSector(e.target.value)} className={selectClass}>
              <option value="">{t("projectsAllSectors")}</option>
              {sectors.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title[language]}
                </option>
              ))}
            </select>
            <select aria-label={t("filterByCountry")} value={country} onChange={(e) => setCountry(e.target.value)} className={selectClass}>
              <option value="">{t("projectsAllCountries")}</option>
              {regions.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {region.name[language]}
                </option>
              ))}
            </select>
            <label className="relative block">
              <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("projectsSearchPlaceholder")}
                className="h-11 w-full lg:w-56 rounded-full border border-slate-200 bg-white ps-11 pe-4 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            <bdi dir="ltr" className="font-latin font-bold text-slate-900">
              {results.length}
            </bdi>{" "}
            {results.length === 1 ? t("project") : t("projectsWord")}
          </p>
          {filtered && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800"
            >
              <X className="w-3.5 h-3.5" />
              {t("projectsClearFilters")}
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <motion.div
            key={`${status}-${sector}-${country}-${query}`}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {results.map((project) => (
              <ProjectTile key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center space-y-4">
            <p className="text-sm text-slate-600">{t("projectsNoResults")}</p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary-500 text-primary-700 px-6 py-2.5 text-xs font-bold hover:bg-primary-50 transition-colors"
            >
              {t("projectsClearFilters")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
