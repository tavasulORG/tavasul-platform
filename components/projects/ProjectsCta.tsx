"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Landmark } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { fadeUp, stagger, viewportOnce } from "./shared";

/** Two panels side by side, as on the template's three-tone slide: general fund on brand, bank transfer on dark. */
export function ProjectsCta() {
  const { t } = useLanguage();
  const { openQuickDonate } = useDonation();

  return (
    <section className="bg-white py-16 sm:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl bg-primary-600 text-white p-8 sm:p-10 space-y-5">
          <span aria-hidden className="absolute -end-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <h2 className="relative font-brand text-2xl sm:text-3xl font-black leading-tight">{t("projectsCtaTitle")}</h2>
          <p className="relative text-sm sm:text-base text-white/85 leading-relaxed max-w-md">{t("projectsCtaDesc")}</p>
          <button
            type="button"
            onClick={() => openQuickDonate()}
            className="relative inline-flex items-center gap-2 rounded-full bg-white text-primary-700 px-7 py-3.5 font-black text-sm hover:bg-primary-50 transition-colors"
          >
            <Heart className="w-4 h-4 fill-current" />
            {t("projectsCtaGeneral")}
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="rounded-2xl bg-slate-900 text-white p-8 sm:p-10 space-y-5">
          <span className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <Landmark className="w-6 h-6 text-primary-300" />
          </span>
          <h2 className="font-brand text-2xl sm:text-3xl font-black leading-tight">{t("projectsCtaBankTitle")}</h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">{t("projectsCtaBankDesc")}</p>
          <Link
            href="/bank-accounts"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-7 py-3.5 font-bold text-sm hover:bg-white/10 transition-colors"
          >
            {t("navBanks")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
