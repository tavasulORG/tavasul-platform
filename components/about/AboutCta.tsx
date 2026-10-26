"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { fadeUp, viewportOnce } from "./shared";

export function AboutCta() {
  const { t } = useLanguage();
  const { openQuickDonate } = useDonation();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="relative overflow-hidden rounded-[2rem] bg-primary-600 text-white px-8 py-12 sm:px-14 sm:py-14"
      >
        {/* One pale circle cut off at the edge and a dashed ring, nothing else. */}
        <div aria-hidden className="absolute -end-20 -top-24 w-72 h-72 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -end-4 top-12 w-40 h-40 rounded-full border-2 border-dashed border-white/30" />
        <div aria-hidden className="absolute -start-12 -bottom-16 w-40 h-40 rounded-full bg-primary-500" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <h2 className="font-brand text-2xl sm:text-3xl font-black leading-tight">{t("aboutCtaTitle")}</h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">{t("aboutCtaDesc")}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openQuickDonate()}
              className="inline-flex items-center gap-2 rounded-full bg-white text-primary-700 px-7 py-3.5 font-black text-sm hover:bg-primary-50 transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              {t("donateNow")}
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-7 py-3.5 font-bold text-sm hover:bg-white/10 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {t("navContact")}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
