"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { EASE, PaleCircle, fadeUp, stagger, viewportOnce } from "./shared";

export function AboutHero() {
  const { t } = useLanguage();
  const { about: aboutData, settings } = useContent();
  const HERO_IMAGE = settings.aboutHeroImage;

  const facts = [
    { icon: CalendarDays, label: t("aboutFoundedLabel"), value: String(aboutData.foundedYear), ltr: true },
    { icon: MapPin, label: t("aboutCityLabel"), value: t("aboutCityValue"), ltr: false },
    { icon: ShieldCheck, label: t("aboutLicenseLabel"), value: aboutData.licenseNumber, ltr: true },
    { icon: Award, label: t("aboutExperienceLabel"), value: t("aboutExperienceValue"), ltr: false },
  ];

  return (
    <>
      {/* z-10 keeps the year circle above the facts strip; only the background is clipped. */}
      <section className="relative z-10 bg-slate-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0.6, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="absolute inset-0"
          >
            <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover object-center" />
            {/* Shade only the text side so the photo stays visible on the other side. */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/10 md:bg-gradient-to-r md:rtl:bg-gradient-to-l md:from-slate-950/85 md:via-slate-950/45 md:to-slate-950/5" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[520px] lg:min-h-[600px] flex items-end pt-20 pb-32 sm:pb-28 lg:pb-32">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl space-y-4 sm:space-y-5">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] sm:text-xs font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary-300" />
              {t("aboutHeroEyebrow")}
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="font-brand text-3xl sm:text-4xl lg:text-5xl font-black leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
            >
              {t("aboutHeroTitle")}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            >
              {t("aboutHeroSubtitle")}
            </motion.p>
          </motion.div>
        </div>

        {/* Founding-year circle cutting through the bottom edge, as on the template cover. */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          className="absolute z-20 -bottom-14 sm:-bottom-16 lg:-bottom-20 end-5 sm:end-12 lg:end-20"
        >
          <div className="relative">
            <div aria-hidden className="absolute -inset-3 sm:-inset-4 rounded-full border-2 border-dashed border-white/40" />
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-primary-500 shadow-2xl shadow-primary-500/40 flex flex-col items-center justify-center text-center pb-5 sm:pb-7">
              <span className="font-latin text-3xl sm:text-4xl lg:text-5xl font-bold leading-none">{aboutData.foundedYear}</span>
              <span className="mt-1.5 text-[11px] sm:text-xs font-semibold text-white/90">{t("aboutFoundedLabel")}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Facts strip: the template's full-width photo followed by four icon items. */}
      <section className="relative overflow-hidden bg-white pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16">
        <PaleCircle size={240} className="-start-28 -bottom-28" />
        <PaleCircle size={70} className="start-28 -bottom-4 bg-primary-200/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4"
          >
            {facts.map((fact) => (
              <motion.li
                key={fact.label}
                variants={fadeUp}
                className="flex items-center gap-4 lg:justify-center lg:border-e lg:last:border-e-0 border-slate-200"
              >
                <span className="w-14 h-14 shrink-0 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <fact.icon className="w-6 h-6" />
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{fact.label}</span>
                  <span className="text-base sm:text-lg font-extrabold text-slate-900 font-brand leading-tight">
                    {fact.ltr ? <bdi dir="ltr">{fact.value}</bdi> : fact.value}
                  </span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    </>
  );
}
