"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { MAP_VIEWBOX, mapCountries } from "@/data/regionMap";
import { WaveEdge, fadeUp, viewportOnce } from "./shared";

/** Closing brand band under a wave, with the map as a quiet silhouette on the end side, as in the template's footer. */
export function WhereCta() {
  const { t } = useLanguage();
  const { openQuickDonate } = useDonation();

  return (
    <section className="relative overflow-hidden bg-primary-700 text-white">
      <WaveEdge flip fill="fill-white" className="relative z-10" />

      <svg
        aria-hidden
        viewBox={MAP_VIEWBOX}
        className="pointer-events-none absolute -bottom-24 -end-10 w-[420px] sm:w-[520px] lg:w-[600px] h-auto opacity-[0.14]"
      >
        {mapCountries.map((country) => (
          <path key={country.code} d={country.d} fillRule="evenodd" className="fill-white stroke-primary-700" strokeWidth={3} />
        ))}
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-2xl space-y-5"
        >
          <h2 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">{t("whereCtaTitle")}</h2>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">{t("whereCtaDesc")}</p>
          <div className="flex flex-wrap gap-3 pt-2">
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
        </motion.div>
      </div>
    </section>
  );
}
