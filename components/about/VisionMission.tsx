"use client";

import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { SectionHeading, fadeUp, stagger, viewportOnce } from "./shared";

export function VisionMission() {
  const { language, t } = useLanguage();
  const { about: aboutData } = useContent();

  return (
    <section id="vision" className="relative overflow-hidden bg-slate-950 text-white py-20 sm:py-28 scroll-mt-32">
      {/* Dark band with one large circle, as on the template's dark INFORMATION slide. */}
      <div aria-hidden className="absolute -end-40 -top-40 w-[420px] h-[420px] rounded-full border-2 border-dashed border-white/15" />
      <div aria-hidden className="absolute -start-24 -bottom-24 w-72 h-72 rounded-full bg-white/[0.04]" />
      <div aria-hidden className="absolute start-[12%] top-12 w-3 h-3 rounded-full bg-primary-400" />
      <div aria-hidden className="absolute end-[18%] bottom-16 w-2 h-2 rounded-full bg-primary-300" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <SectionHeading index="03" title={t("aboutVisionMissionTitle")} align="center" tone="light" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="flex justify-center"
          >
            <div className="relative">
              <div aria-hidden className="absolute -inset-5 rounded-full border-2 border-dashed border-primary-400/50" />
              <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-[360px] lg:h-[360px] rounded-full bg-primary-500 flex flex-col items-center justify-center text-center px-10 sm:px-12 shadow-2xl shadow-primary-500/30">
                <Eye className="w-8 h-8 mb-3 text-white/90" />
                <span className="text-xs font-bold tracking-wide text-white/80 mb-2">{t("aboutVisionLabel")}</span>
                <p className="font-brand font-bold text-base sm:text-lg leading-relaxed">{aboutData.vision[language]}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="space-y-5 max-w-xl"
          >
            <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-primary-300 font-bold text-sm">
              <Target className="w-5 h-5" />
              {t("aboutMissionLabel")}
            </motion.span>
            <motion.p
              variants={fadeUp}
              className="font-brand text-xl sm:text-2xl lg:text-[1.7rem] font-bold leading-relaxed text-white"
            >
              {aboutData.mission[language]}
            </motion.p>
            <motion.span variants={fadeUp} aria-hidden className="block h-1 w-12 rounded-full bg-primary-500" />
            <motion.p variants={fadeUp} className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t("experienceBadge")}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
