"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { EASE, WaveEdge, fadeUp, numberFormat, regionTotalsOf, stagger } from "./shared";

/** Photo hero with a wave for its bottom edge, as on the template's cover. */
export function WhereHero() {
  const { t } = useLanguage();
  const { regions, settings } = useContent();
  const regionTotals = regionTotalsOf(regions);
  const HERO_IMAGE = settings.whereHeroImage;

  const facts = [
    { value: regionTotals.regions, label: t("whereHeroStatRegions") },
    { value: regionTotals.projects, label: t("whereHeroStatProjects") },
    { value: regionTotals.beneficiaries, label: t("whereHeroStatBeneficiaries") },
  ];

  return (
    <section className="relative overflow-hidden bg-primary-900 text-white">
      <motion.div
        initial={{ opacity: 0.5, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute inset-0"
      >
        <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        {/* A brand-tinted wash rather than a black one, so the photo keeps its colour. */}
        <div className="absolute inset-0 bg-primary-900/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-primary-900/50" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[520px] lg:min-h-[600px] flex items-center justify-center pt-20 pb-32">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="w-full max-w-3xl text-center">
          <motion.span
            variants={fadeUp}
            className="block text-sm sm:text-base font-semibold text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
          >
            {t("whereHeroEyebrow")}
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="mt-2 font-brand text-4xl sm:text-5xl lg:text-6xl font-black leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
          >
            {t("whereHeroTitle")}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
          >
            {t("whereHeroSubtitle")}
          </motion.p>

          {/* The template's search pill, carrying the three headline figures instead. */}
          <motion.dl
            variants={fadeUp}
            className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-7 gap-y-2 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm px-6 py-3"
          >
            {/* Term before value in the DOM; the row is reversed so the figure reads first. */}
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-row-reverse items-center gap-2">
                <dt className="text-xs sm:text-sm font-semibold text-white/90">{fact.label}</dt>
                <dd className="font-latin text-base sm:text-lg font-bold leading-none">
                  <bdi dir="ltr">{numberFormat.format(fact.value)}</bdi>
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      <WaveEdge className="absolute bottom-0 inset-x-0" />
    </section>
  );
}
