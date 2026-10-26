"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { RegionIcon, fadeUp, stagger } from "./shared";

/** The row under the hero: a label pill and one circle per region, as the template's audience selector. */
export function WhereCountryRow() {
  const { language, t } = useLanguage();
  const { regions: regionsData } = useContent();

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-14 sm:pb-16 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex lg:flex-col flex-wrap items-center lg:items-stretch gap-3 shrink-0"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center justify-center rounded-full bg-primary-700 text-white px-6 py-2.5 text-xs font-bold"
          >
            {t("wherePickLabel")}
          </motion.span>
          <motion.span variants={fadeUp}>
            <Link
              href="#map"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-100 text-primary-800 px-6 py-2.5 text-xs font-bold hover:bg-primary-200 transition-colors"
            >
              <Map className="w-3.5 h-3.5" />
              {t("whereShowMap")}
            </Link>
          </motion.span>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex-1 grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-8 justify-items-center"
        >
          {regionsData.map((region) => (
            <motion.li key={region.id} variants={fadeUp} className="w-full">
              <Link href={`#${region.slug}`} className="group flex flex-col items-center gap-3 text-center">
                <span className="relative w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20">
                  {/* Thin ring offset to the top-end corner, as on the template's circles. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border-2 border-primary-700/50 translate-x-1.5 rtl:-translate-x-1.5 -translate-y-1.5 group-hover:border-primary-500 transition-colors"
                  />
                  <span className="absolute inset-0 rounded-full bg-primary-700 text-white flex items-center justify-center shadow-lg shadow-primary-700/25 group-hover:bg-primary-500 transition-colors">
                    <RegionIcon slug={region.slug} className="w-8 h-8 sm:w-9 sm:h-9" />
                  </span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-snug max-w-[9rem] group-hover:text-primary-700 transition-colors">
                  {region.name[language]}
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
