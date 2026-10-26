"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, FileText, Heart, Landmark, Layers, MapPin, Users } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { useContent } from "@/context/ContentContext";
import type { Project } from "@/types";
import { ProjectTile } from "./ProjectTile";
import {
  EASE,
  HEX,
  ProjectsHeading,
  STATUS_TAG,
  SectorIcon,
  fadeUp,
  formatDate,
  fundedPercent,
  numberFormat,
  sortProjects,
  stagger,
  statusLabel,
  viewportOnce,
} from "./shared";

const PRESET_AMOUNTS_USD = [25, 50, 100, 250];

function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center space-y-5">
      <h1 className="font-brand text-3xl font-extrabold text-slate-900">{t("projectDetailNotFound")}</h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto">{t("projectDetailNotFoundDesc")}</p>
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 rounded-full bg-primary-500 text-white px-7 py-3.5 text-sm font-black hover:bg-primary-600 transition-colors"
      >
        {t("viewAllProjects")}
      </Link>
    </section>
  );
}

/** Related projects: same sector first, then same country, newest first. */
function relatedProjects(project: Project, projects: Project[]) {
  const sameSector = projects.filter((p) => p.id !== project.id && p.sectorSlug === project.sectorSlug);
  const sameCountry = projects.filter(
    (p) => p.id !== project.id && p.countrySlug === project.countrySlug && p.sectorSlug !== project.sectorSlug
  );
  return [...sortProjects(sameSector), ...sortProjects(sameCountry)].slice(0, 3);
}

export function ProjectDetail({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const { projects, getProjectBySlug, openQuickDonate, formatAmount } = useDonation();
  const project = getProjectBySlug(slug);
  if (!project) return <NotFound />;

  const { sectors } = useContent();
  const sector = sectors.find((s) => s.slug === project.sectorSlug);
  const title = project.title[language];
  const pct = fundedPercent(project);
  const pctText = language === "tr" ? `%${pct}` : `${pct}%`;
  const related = relatedProjects(project, projects);
  const photos = Array.from(new Set([project.coverImage, ...project.gallery]));
  const bigFirst = photos.length >= 3;
  const updates = [...project.updates].sort((a, b) => b.date.localeCompare(a.date));

  const facts = [
    { icon: MapPin, label: t("projectDetailLocation"), value: project.countryName[language], href: `/where-we-work#${project.countrySlug}` },
    { icon: Layers, label: t("projectDetailSector"), value: sector?.title[language] ?? "", href: `/sectors#${project.sectorSlug}` },
    { icon: CalendarDays, label: t("projectDetailStarted"), value: formatDate(project.createdAt, language), ltr: true },
    { icon: Users, label: t("beneficiaries"), value: numberFormat.format(project.beneficiariesCount), ltr: true },
  ];

  const figures = [
    { label: t("raised"), value: formatAmount(project.raisedAmount) },
    { label: t("goal"), value: formatAmount(project.goalAmount) },
    { label: t("donors"), value: numberFormat.format(project.donorsCount) },
  ];

  return (
    <article>
      {/* Cover: the photo under a dark wash, title and tags at the foot. */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <motion.div
          initial={{ opacity: 0.5, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="absolute inset-0"
        >
          <Image src={project.coverImage} alt="" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/10" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[440px] lg:min-h-[520px] flex flex-col justify-end pt-16 pb-12 sm:pb-16 gap-5"
        >
          <motion.div variants={fadeUp}>
            <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
              {t("projectDetailBack")}
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
            <span className={clsx("rounded-full px-3 py-1 text-[11px] font-bold", STATUS_TAG[project.status])}>
              {statusLabel(project.status, t)}
            </span>
            {sector && (
              <Link
                href={`/sectors#${project.sectorSlug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold hover:bg-white/20 transition-colors"
              >
                <SectorIcon name={sector.iconName} className="w-3.5 h-3.5 text-primary-300" />
                {sector.title[language]}
              </Link>
            )}
            <Link
              href={`/where-we-work#${project.countrySlug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold hover:bg-white/20 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-primary-300" />
              {project.countryName[language]}
            </Link>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-brand text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.35] max-w-4xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
          >
            {title}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-3xl">
            {project.summary[language]}
          </motion.p>
        </motion.div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-8 space-y-14">
            <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger} className="space-y-6">
              <motion.div variants={fadeUp}>
                <ProjectsHeading title={t("projectDetailAbout")} />
              </motion.div>
              <motion.p variants={fadeUp} className="text-sm sm:text-base leading-[1.9] text-slate-600">
                {project.description[language]}
              </motion.p>

              {/* Three panels, as on the template's grey / bullets / black slide. */}
              <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-100 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">{t("projectDetailFacts")}</h3>
                  <dl className="space-y-4">
                    {facts.map((fact) => (
                      <div key={fact.label} className="flex items-start gap-3">
                        <fact.icon className="w-4 h-4 mt-0.5 shrink-0 text-primary-600" />
                        <div className="min-w-0">
                          <dt className="text-[11px] text-slate-500">{fact.label}</dt>
                          <dd className="text-sm font-bold text-slate-900 leading-snug">
                            {fact.href ? (
                              <Link href={fact.href} className="hover:text-primary-700 transition-colors">
                                {fact.value}
                              </Link>
                            ) : fact.ltr ? (
                              <bdi dir="ltr" className="font-latin">{fact.value}</bdi>
                            ) : (
                              fact.value
                            )}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-2xl border border-slate-200 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">{t("projectDetailTargetGroups")}</h3>
                  <ul className="space-y-3">
                    {project.targetGroups.map((group, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-snug">
                        <span aria-hidden className="mt-1.5 w-2.5 h-2.5 shrink-0 bg-primary-500" />
                        {group[language]}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-between gap-5">
                  {figures.map((figure) => (
                    <div key={figure.label}>
                      <span className="block text-[11px] text-slate-400">{figure.label}</span>
                      <span className="block font-latin text-xl sm:text-2xl font-bold leading-tight">
                        <bdi dir="ltr">{figure.value}</bdi>
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {photos.length > 1 && (
              <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger} className="space-y-6">
                <motion.div variants={fadeUp}>
                  <ProjectsHeading title={t("projectDetailGallery")} />
                </motion.div>
                {/* Photo mosaic with one solid text tile, as on the template's photo slide. */}
                <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {photos.map((src, i) => (
                    <div
                      key={src}
                      className={clsx(
                        "relative overflow-hidden bg-slate-200",
                        i === 0 ? (bigFirst ? "col-span-2 row-span-2 aspect-square" : "col-span-2 aspect-[2/1]") : "aspect-square"
                      )}
                    >
                      <Image src={src} alt="" fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover" />
                    </div>
                  ))}
                  <div className={clsx("bg-primary-500 text-white p-5 flex items-end", bigFirst ? "col-span-2 aspect-[2/1]" : "aspect-square")}>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed line-clamp-5">{project.summary[language]}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger} className="space-y-6">
              <motion.div variants={fadeUp}>
                <ProjectsHeading title={t("projectDetailUpdates")} />
              </motion.div>
              {updates.length > 0 ? (
                <ol className="relative space-y-8">
                  <span aria-hidden className="absolute top-4 bottom-4 start-7 border-s-2 border-dashed border-primary-200" />
                  {updates.map((update, i) => (
                    <motion.li key={update.date + i} variants={fadeUp} className="relative flex gap-5">
                      <span
                        className={clsx(
                          "relative z-10 w-14 h-14 shrink-0 flex items-center justify-center text-white",
                          HEX,
                          i % 2 === 0 ? "bg-primary-500" : "bg-slate-900"
                        )}
                      >
                        <FileText className="w-5 h-5" />
                      </span>
                      <div className="flex-1 min-w-0 rounded-2xl border border-slate-200 p-5 space-y-3">
                        <span className="inline-block rounded-full bg-slate-900 text-white px-3 py-1 font-latin text-[11px] font-bold">
                          <bdi dir="ltr">{formatDate(update.date, language)}</bdi>
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{update.title[language]}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{update.text[language]}</p>
                        {update.image && (
                          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-200">
                            <Image src={update.image} alt="" fill sizes="(max-width: 1024px) 100vw, 700px" className="object-cover" />
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ol>
              ) : (
                <motion.p variants={fadeUp} className="text-sm text-slate-500">
                  {t("projectDetailNoUpdates")}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Donation panel: first on small screens, sticky beside the text on large ones. */}
          <motion.aside
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="order-first lg:order-none lg:col-span-4 lg:sticky lg:top-32 rounded-2xl border border-slate-200 bg-white shadow-brand-soft p-6 space-y-6"
          >
            <h2 className="font-brand text-xl font-extrabold text-slate-900">{t("projectDetailFunding")}</h2>

            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="font-latin text-3xl font-bold text-slate-900">
                  <bdi dir="ltr">{formatAmount(project.raisedAmount)}</bdi>
                </span>
                <span className="text-xs text-slate-500">
                  {t("goal")}:{" "}
                  <bdi dir="ltr" className="font-latin font-bold text-slate-700">
                    {formatAmount(project.goalAmount)}
                  </bdi>
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <motion.span
                  className="block h-full rounded-full bg-primary-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              </div>
              <p className="text-xs text-slate-600">
                <bdi dir="ltr" className="font-latin font-bold text-primary-700">
                  {pctText}
                </bdi>{" "}
                {t("projectDetailFundedPct")}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-[11px] text-slate-500">{t("donors")}</dt>
                <dd className="font-latin text-lg font-bold text-slate-900">
                  <bdi dir="ltr">{numberFormat.format(project.donorsCount)}</bdi>
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-[11px] text-slate-500">{t("beneficiaries")}</dt>
                <dd className="font-latin text-lg font-bold text-slate-900">
                  <bdi dir="ltr">{numberFormat.format(project.beneficiariesCount)}</bdi>
                </dd>
              </div>
            </dl>

            {project.status === "completed" ? (
              <p className="rounded-xl bg-slate-900 text-white text-xs leading-relaxed p-4">{t("projectDetailCompletedNote")}</p>
            ) : (
              <div className="space-y-3">
                <span className="block text-xs font-bold text-slate-700">{t("projectDetailChooseAmount")}</span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_AMOUNTS_USD.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => openQuickDonate(project.id, amount)}
                      className="rounded-full border-2 border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-800 hover:border-primary-500 hover:text-primary-700 transition-colors"
                    >
                      <bdi dir="ltr" className="font-latin">
                        {formatAmount(amount)}
                      </bdi>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => openQuickDonate(project.id)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 text-white px-6 py-3.5 text-sm font-black hover:bg-primary-600 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  {t("donateForProject")}
                </button>
              </div>
            )}

            <Link href="/bank-accounts" className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary-700 transition-colors">
              <Landmark className="w-4 h-4 text-primary-500" />
              {t("projectDetailBankNote")}
            </Link>
          </motion.aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
              <ProjectsHeading title={t("projectDetailRelated")} />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {related.map((item) => (
                <ProjectTile key={item.id} project={item} compact />
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </article>
  );
}
