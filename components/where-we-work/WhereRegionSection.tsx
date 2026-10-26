"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CircleCheck, Heart } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import type { CountryRegion, Project } from "@/types";
import { LocatorMap, fadeUp, numberFormat, stagger, viewportOnce } from "./shared";

interface Props {
  region: CountryRegion;
  index: number;
  /** Put the photo on the end side instead of the start side. */
  flip?: boolean;
}

/** One region: a rounded photo with a locator-map badge and a figures capsule, beside the region's text and projects. */
export function WhereRegionSection({ region, index, flip = false }: Props) {
  const { language, t } = useLanguage();
  const { projects, openQuickDonate } = useDonation();
  const related = projects.filter((project) => project.countrySlug === region.slug);
  const name = region.name[language];

  const statusLabel = (status: Project["status"]) =>
    status === "urgent" ? t("urgentBadge") : status === "completed" ? t("completedBadge") : t("whereStatusActive");

  return (
    <section
      id={region.slug}
      className={clsx("scroll-mt-24 py-16 sm:py-24", index % 2 === 1 ? "bg-primary-50/60" : "bg-white")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className={clsx("lg:col-span-5", flip && "lg:order-2")}
        >
          <div className="relative mx-auto w-[88%] max-w-[420px] aspect-[4/5] pt-8 pb-10">
            <div className="relative w-full h-full overflow-hidden rounded-[2rem] bg-slate-200 shadow-xl shadow-slate-900/10">
              <Image src={region.coverImage} alt={name} fill sizes="(max-width: 640px) 85vw, 420px" className="object-cover" />
            </div>

            {/* Locator badge on the top-start corner: the whole map with this region picked out. */}
            <div className="absolute top-0 -start-3 sm:-start-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-lg shadow-slate-900/10 border border-slate-100 p-2.5 overflow-hidden">
              <LocatorMap slug={region.slug} className="w-full h-full" />
            </div>

            {/* Figures capsule on the bottom-end corner. Term before value in the DOM; each column is reversed. */}
            <dl className="absolute bottom-0 -end-2 sm:-end-6 flex divide-x rtl:divide-x-reverse divide-primary-100 rounded-full bg-white shadow-lg shadow-slate-900/10 border border-slate-100 px-2 py-3">
              <div className="flex flex-col-reverse px-4 sm:px-5 text-center">
                <dt className="mt-1 text-[10px] font-semibold text-slate-500 whitespace-nowrap">{t("whereStatBeneficiaries")}</dt>
                <dd className="font-latin text-lg sm:text-xl font-bold text-primary-700 leading-none">
                  <bdi dir="ltr">{numberFormat.format(region.beneficiariesCount)}</bdi>
                </dd>
              </div>
              <div className="flex flex-col-reverse px-4 sm:px-5 text-center">
                <dt className="mt-1 text-[10px] font-semibold text-slate-500 whitespace-nowrap">{t("whereStatProjects")}</dt>
                <dd className="font-latin text-lg sm:text-xl font-bold text-primary-700 leading-none">
                  <bdi dir="ltr">{numberFormat.format(region.activeProjectsCount)}</bdi>
                </dd>
              </div>
            </dl>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className={clsx("lg:col-span-7 space-y-7", flip && "lg:order-1")}
        >
          <motion.div variants={fadeUp} className="space-y-2">
            <h2 className="font-brand text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-slate-900 leading-tight">{name}</h2>
            <p className="text-sm sm:text-base font-semibold text-primary-700 leading-relaxed">{region.headline[language]}</p>
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm sm:text-base leading-[1.9] text-slate-600">
            {region.overview[language]}
          </motion.p>

          <motion.div variants={fadeUp} className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">{t("whereInterventionsLabel")}</h3>
            <ul className="space-y-2.5">
              {region.keyInterventions.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CircleCheck className="mt-0.5 w-5 h-5 shrink-0 text-primary-600" />
                  <p className="text-sm text-slate-700 leading-relaxed">{item[language]}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">{t("whereRegionProjectsLabel")}</h3>
            {related.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 pe-4 hover:border-primary-500 transition-colors"
                    >
                      <span className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                        <Image src={project.coverImage} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                          {project.title[language]}
                        </span>
                        <span className="mt-1 block text-[10px] font-semibold text-slate-500">{statusLabel(project.status)}</span>
                      </span>
                      <ArrowUpRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-primary-700 rtl:-scale-x-100 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">{t("whereNoProjects")}</p>
            )}
            <button
              type="button"
              onClick={() => openQuickDonate(related[0]?.id)}
              className="inline-flex items-center gap-2 rounded-full bg-primary-700 text-white px-6 py-3 text-sm font-black hover:bg-primary-600 transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              {t("whereDonateRegion")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
