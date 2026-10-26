"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { useContent } from "@/context/ContentContext";
import { EASE, fadeUp, numberFormat, projectTotals, stagger } from "./shared";

interface RingProps {
  /** 0 to 1 share drawn around the ring. */
  share: number;
  value: string;
  label: string;
  delay: number;
}

/** A figure inside a ring whose arc is drawn once on load, as on the template's achievement slide. */
function Ring({ share, value, label, delay }: RingProps) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <motion.li variants={fadeUp} className="flex flex-col items-center text-center gap-3">
      <span className="relative w-28 h-28 sm:w-32 sm:h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="7" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - Math.max(0.02, Math.min(1, share))) }}
            transition={{ duration: 0.9, delay, ease: EASE }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-latin text-2xl sm:text-3xl font-bold">
          <bdi dir="ltr">{value}</bdi>
        </span>
      </span>
      <span className="text-xs sm:text-sm font-semibold text-white/90 max-w-[9rem] leading-snug">{label}</span>
    </motion.li>
  );
}

export function ProjectsHero() {
  const { t } = useLanguage();
  const { settings } = useContent();
  const HERO_IMAGE = settings.projectsHeroImage;
  const { projects } = useDonation();
  const totals = projectTotals(projects);
  const share = (n: number) => (totals.count ? n / totals.count : 0);

  const rings: Omit<RingProps, "delay">[] = [
    { share: totals.fundedPct / 100, value: `${totals.fundedPct}%`, label: t("projectsRingFunding") },
    { share: share(totals.urgent), value: String(totals.urgent), label: t("projectsRingUrgent") },
    { share: share(totals.active), value: String(totals.active), label: t("projectsRingActive") },
    { share: share(totals.completed), value: String(totals.completed), label: t("projectsRingCompleted") },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <motion.div
        initial={{ opacity: 0.5, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute inset-0"
      >
        <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20 space-y-12">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto text-center space-y-5">
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] sm:text-xs font-bold"
          >
            <FileText className="w-3.5 h-3.5 text-primary-300" />
            {t("projectsHeroEyebrow")}
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="font-brand text-4xl sm:text-5xl lg:text-6xl font-black leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
          >
            {t("projectsHeroTitle")}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
          >
            {t("projectsHeroSubtitle")}
          </motion.p>
          <motion.dl variants={fadeUp} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-300">
            <div className="flex flex-row-reverse items-center gap-2">
              <dt>{t("beneficiaries")}</dt>
              <dd className="font-latin text-lg font-bold text-white">
                <bdi dir="ltr">{numberFormat.format(totals.beneficiaries)}</bdi>
              </dd>
            </div>
            <div className="flex flex-row-reverse items-center gap-2">
              <dt>{t("donors")}</dt>
              <dd className="font-latin text-lg font-bold text-white">
                <bdi dir="ltr">{numberFormat.format(totals.donors)}</bdi>
              </dd>
            </div>
          </motion.dl>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 max-w-4xl mx-auto"
        >
          {rings.map((ring, i) => (
            <Ring key={ring.label} {...ring} delay={0.3 + i * 0.1} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
