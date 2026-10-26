"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { EASE, SectorsHeading, fadeUp, numberFormat, sectorTotalsOf, stagger, viewportOnce } from "./shared";

/** The results slide: one part-to-whole bar per sector (completed out of total) and three headline figures. */
export function SectorsNumbers() {
  const { language, t } = useLanguage();
  const { sectors: sectorsData } = useContent();
  const sectorTotals = sectorTotalsOf(sectorsData);
  const completionRate = sectorTotals.completionRate;
  const max = Math.max(1, ...sectorsData.map((sector) => sector.stats.projectsCount));

  const figures = [
    {
      label: t("sectorsTotalProjectsLabel"),
      value: numberFormat.format(sectorTotals.projects),
      desc: t("sectorsTotalProjectsDesc"),
    },
    {
      label: t("sectorsTotalBeneficiariesLabel"),
      value: numberFormat.format(sectorTotals.beneficiaries),
      desc: t("sectorsTotalBeneficiariesDesc"),
    },
    {
      label: t("sectorsCompletionLabel"),
      value: `${completionRate}%`,
      desc: t("sectorsCompletionDesc"),
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <SectorsHeading
            eyebrow={t("sectorsNumbersEyebrow")}
            title={t("sectorsNumbersTitle")}
            description={t("sectorsNumbersDesc")}
            align="center"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.figure
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 space-y-5"
          >
            <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="w-3.5 h-3.5 rounded-sm bg-primary-600" />
                {t("sectorsChartCompleted")}
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="w-3.5 h-3.5 rounded-sm bg-primary-100" />
                {t("sectorsChartTotal")}
              </span>
            </figcaption>

            <ul className="space-y-2">
              {sectorsData.map((sector) => {
                const { projectsCount, completedProjects } = sector.stats;
                const trackPct = (projectsCount / max) * 100;
                const fillPct = (completedProjects / max) * 100;
                const title = sector.title[language];
                return (
                  <motion.li
                    key={sector.id}
                    variants={fadeUp}
                    title={`${title}: ${completedProjects} / ${projectsCount}`}
                    className="grid grid-cols-[minmax(0,8.5rem)_1fr_auto] sm:grid-cols-[minmax(0,13rem)_1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 -mx-2 hover:bg-slate-50 transition-colors"
                  >
                    <span className="truncate text-xs sm:text-sm font-semibold text-slate-700">{title}</span>
                    <span className="relative h-5 min-w-0">
                      <span
                        aria-hidden
                        className="absolute inset-y-0 start-0 bg-primary-100 rounded-e-[4px]"
                        style={{ width: `${trackPct}%` }}
                      />
                      <motion.span
                        aria-hidden
                        className="absolute inset-y-0 start-0 bg-primary-600 rounded-e-[4px]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${fillPct}%` }}
                        viewport={viewportOnce}
                        transition={{ duration: 0.7, ease: EASE }}
                      />
                    </span>
                    <span className="font-latin text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                      <bdi dir="ltr">
                        {completedProjects} / {projectsCount}
                      </bdi>
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            {/* Screen-reader table of the same figures. The wrapper does the clipping: a table ignores sr-only's 1px width. */}
            <div className="sr-only">
            <table>
              <thead>
                <tr>
                  <th>{t("sectorsChartSector")}</th>
                  <th>{t("sectorsChartCompleted")}</th>
                  <th>{t("sectorsChartTotal")}</th>
                </tr>
              </thead>
              <tbody>
                {sectorsData.map((sector) => (
                  <tr key={sector.id}>
                    <td>{sector.title[language]}</td>
                    <td>{sector.stats.completedProjects}</td>
                    <td>{sector.stats.projectsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </motion.figure>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="lg:col-span-5 space-y-8"
          >
            {figures.map((figure) => (
              <motion.li key={figure.label} variants={fadeUp} className="border-s-[3px] border-primary-500 ps-5">
                <span className="block text-sm font-bold text-primary-600">{figure.label}</span>
                <span className="block font-latin text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mt-1">
                  <bdi dir="ltr">{figure.value}</bdi>
                </span>
                <span className="block text-sm text-slate-500 leading-relaxed mt-1">{figure.desc}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
