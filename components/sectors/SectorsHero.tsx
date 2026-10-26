"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { CornerFrame, EASE, fadeUp, stagger } from "./shared";

export function SectorsHero() {
  const { t } = useLanguage();
  const { settings } = useContent();
  const HERO_IMAGE = settings.sectorsHeroImage;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <motion.div
        initial={{ opacity: 0.5, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute inset-0"
      >
        {/* Monochrome photo under a dark wash, as on the template cover; the brand colour is the frame. */}
        <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover object-center grayscale" />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/80" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[540px] lg:min-h-[640px] flex items-center justify-center pt-20 pb-28">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="w-full max-w-3xl">
          <CornerFrame className="px-6 py-10 sm:px-12 sm:py-14 text-center">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] sm:text-xs font-bold"
            >
              <Layers className="w-3.5 h-3.5 text-primary-300" />
              {t("sectorsHeroEyebrow")}
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="mt-5 font-brand text-4xl sm:text-5xl lg:text-6xl font-black leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
            >
              {t("sectorsHeroTitle")}
            </motion.h1>
            <motion.span variants={fadeUp} aria-hidden className="block mx-auto mt-5 h-1 w-16 bg-primary-500" />
            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            >
              {t("sectorsHeroSubtitle")}
            </motion.p>
          </CornerFrame>
        </motion.div>
      </div>

      {/* Diagonal edge into the next section, as on the contents slide. */}
      <svg
        aria-hidden
        className="absolute bottom-0 inset-x-0 w-full h-12 sm:h-20 lg:h-24 text-white rtl:-scale-x-100"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        <polygon points="0,10 100,0 100,10" fill="currentColor" />
      </svg>
    </section>
  );
}
