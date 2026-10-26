"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { CornerFrame, fadeUp, viewportOnce } from "./shared";

/** Closing band: the cover's bracket frame again, on a full-bleed brand band above the dark footer. */
export function SectorsCta() {
  const { t } = useLanguage();
  const { openQuickDonate } = useDonation();

  return (
    <section className="bg-primary-600 text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-3xl mx-auto"
        >
          <CornerFrame color="border-white/70" className="px-6 py-10 sm:px-12 sm:py-14 text-center space-y-5">
            <h2 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">{t("sectorsCtaTitle")}</h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl mx-auto">{t("sectorsCtaDesc")}</p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openQuickDonate()}
                className="inline-flex items-center gap-2 rounded-full bg-white text-primary-700 px-7 py-3.5 font-black text-sm hover:bg-primary-50 transition-colors"
              >
                <Heart className="w-4 h-4 fill-current" />
                {t("donateNow")}
              </button>
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-7 py-3.5 font-bold text-sm hover:bg-white/10 transition-colors"
              >
                <HeartHandshake className="w-4 h-4" />
                {t("navVolunteer")}
              </Link>
            </div>
          </CornerFrame>
        </motion.div>
      </div>
    </section>
  );
}
