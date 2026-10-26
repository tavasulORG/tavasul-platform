"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import type { Language, Project, Sector } from "@/types";
import { SectorIcon, fadeUp, numberFormat, pad, stagger, viewportOnce } from "./shared";

export type SectorVariant = "frame" | "mosaic";

interface SectorSectionProps {
  sector: Sector;
  index: number;
  /** "frame": photo with an offset solid frame (mission slide). "mosaic": 2x2 photo and colour blocks (about slide). */
  variant: SectorVariant;
  /** Put the visual on the end side instead of the start side. */
  flip?: boolean;
}

/** Second mosaic image: a related project photo that differs from the sector cover, if there is one. */
function secondImage(sector: Sector, related: Project[]) {
  return related.find((project) => project.coverImage !== sector.coverImage)?.coverImage;
}

function FramedPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto w-[82%] max-w-[380px] aspect-[4/5]">
      {/* Offset solid frame behind the photo and a dark bar at its foot, as on the mission slide. */}
      <span aria-hidden className="absolute -top-4 -end-4 sm:-top-6 sm:-end-6 w-full h-full bg-primary-500" />
      <span aria-hidden className="absolute -bottom-4 -start-4 sm:-bottom-6 sm:-start-6 w-2/3 h-24 bg-slate-900" />
      <div className="absolute inset-0 overflow-hidden shadow-xl shadow-slate-900/15">
        <Image src={src} alt={alt} fill sizes="(max-width: 640px) 80vw, 380px" className="object-cover" />
      </div>
    </div>
  );
}

interface MosaicProps {
  sector: Sector;
  related: Project[];
  language: Language;
  projectsLabel: string;
  beneficiariesLabel: string;
  completedLabel: string;
}

function Mosaic({ sector, related, language, projectsLabel, beneficiariesLabel, completedLabel }: MosaicProps) {
  const alt = sector.title[language];
  const second = secondImage(sector, related);
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-[460px] mx-auto">
      <div className="aspect-square bg-slate-900 text-white p-5 sm:p-6 flex flex-col justify-end">
        <span className="font-latin text-3xl sm:text-4xl font-bold leading-none">
          <bdi dir="ltr">{numberFormat.format(sector.stats.projectsCount)}</bdi>
        </span>
        <span className="mt-2 text-xs font-semibold text-slate-300">{projectsLabel}</span>
      </div>
      <div className="relative aspect-square overflow-hidden bg-slate-200">
        <Image src={sector.coverImage} alt={alt} fill sizes="(max-width: 640px) 45vw, 230px" className="object-cover" />
      </div>
      {second ? (
        <div className="relative aspect-square overflow-hidden bg-slate-200">
          <Image src={second} alt="" fill sizes="(max-width: 640px) 45vw, 230px" className="object-cover" />
        </div>
      ) : (
        /* No distinct project photo yet: a third figure block instead of a filler image. */
        <div className="aspect-square bg-primary-50 text-slate-900 p-5 sm:p-6 flex flex-col justify-end">
          <span className="font-latin text-3xl sm:text-4xl font-bold leading-none">
            <bdi dir="ltr">{numberFormat.format(sector.stats.completedProjects)}</bdi>
          </span>
          <span className="mt-2 text-xs font-semibold text-slate-500">{completedLabel}</span>
        </div>
      )}
      <div className="aspect-square bg-primary-500 text-white p-5 sm:p-6 flex flex-col justify-end">
        <span className="font-latin text-3xl sm:text-4xl font-bold leading-none">
          <bdi dir="ltr">{numberFormat.format(sector.stats.beneficiariesCount)}</bdi>
        </span>
        <span className="mt-2 text-xs font-semibold text-white/85">{beneficiariesLabel}</span>
      </div>
    </div>
  );
}

export function SectorSection({ sector, index, variant, flip = false }: SectorSectionProps) {
  const { language, t } = useLanguage();
  const { projects, openQuickDonate } = useDonation();
  const related = projects.filter((project) => project.sectorSlug === sector.slug);
  const muted = index % 2 === 1;
  const title = sector.title[language];

  const stats = [
    { label: t("sectorStatProjects"), value: sector.stats.projectsCount },
    { label: t("sectorStatBeneficiaries"), value: sector.stats.beneficiariesCount },
    { label: t("sectorStatCompleted"), value: sector.stats.completedProjects },
  ];

  return (
    <section id={sector.slug} className={clsx("scroll-mt-24 py-16 sm:py-24", muted ? "bg-slate-50" : "bg-white")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className={clsx("lg:col-span-5 py-4", flip && "lg:order-2")}
        >
          {variant === "frame" ? (
            <FramedPhoto src={sector.coverImage} alt={title} />
          ) : (
            <Mosaic
              sector={sector}
              related={related}
              language={language}
              projectsLabel={t("sectorStatProjects")}
              beneficiariesLabel={t("sectorStatBeneficiaries")}
              completedLabel={t("sectorStatCompleted")}
            />
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className={clsx("lg:col-span-7 space-y-7", flip && "lg:order-1")}
        >
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-14 h-14 shrink-0 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/25">
                <SectorIcon name={sector.iconName} className="w-7 h-7" />
              </span>
              <h2 className="font-brand text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{title}</h2>
            </div>
            <p className="text-sm sm:text-base font-semibold text-primary-600">{sector.subtitle[language]}</p>
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm sm:text-base leading-[1.9] text-slate-600">
            {sector.description[language]}
          </motion.p>

          <motion.div variants={fadeUp} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">{t("sectorObjectivesLabel")}</h3>
            {variant === "frame" ? (
              <ol className="space-y-4">
                {sector.objectives.map((objective, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="w-9 h-9 shrink-0 rounded-lg border-2 border-primary-500 text-primary-600 font-latin font-bold text-xs flex items-center justify-center">
                      {pad(i)}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed pt-1.5">{objective[language]}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="space-y-3">
                {sector.objectives.map((objective, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span aria-hidden className="mt-2 w-2.5 h-2.5 shrink-0 bg-primary-500" />
                    <p className="text-sm text-slate-700 leading-relaxed">{objective[language]}</p>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {variant === "frame" && (
            <motion.dl
              variants={fadeUp}
              className="grid grid-cols-3 divide-x rtl:divide-x-reverse divide-slate-200 border-y border-slate-200 py-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="px-3 first:ps-0 last:pe-0">
                  <dt className="text-[11px] font-semibold text-slate-500">{stat.label}</dt>
                  <dd className="font-latin text-lg sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
                    <bdi dir="ltr">{numberFormat.format(stat.value)}</bdi>
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}

          <motion.div variants={fadeUp} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">{t("sectorProjectsLabel")}</h3>
            {related.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {related.map((project) => (
                  <li key={project.id} className="max-w-full">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 max-w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-700 transition-colors"
                    >
                      <span
                        aria-hidden
                        className={clsx(
                          "w-2 h-2 shrink-0 rounded-full",
                          project.status === "completed" ? "bg-slate-400" : "bg-primary-500"
                        )}
                      />
                      <span className="truncate max-w-[14rem] sm:max-w-xs">{project.title[language]}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 rtl:-scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">{t("sectorNoProjects")}</p>
            )}
            <button
              type="button"
              onClick={() => openQuickDonate(related[0]?.id)}
              className="inline-flex items-center gap-2 rounded-full bg-primary-500 text-white px-6 py-3 text-sm font-black hover:bg-primary-600 transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              {t("sectorDonateBtn")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
