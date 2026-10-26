"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { SectorsHeading, fadeUp, pad, stagger, viewportOnce } from "./shared";

/** The contents slide: a photo with a diagonal edge and a numbered list stepping across. */
export function SectorsIndex() {
  const { language, t } = useLanguage();
  const { sectors: sectorsData, settings } = useContent();
  const INDEX_IMAGE = settings.sectorsIndexImage;

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="lg:col-span-5"
        >
          <div className="relative h-72 sm:h-96 lg:h-[620px] overflow-hidden bg-slate-900 [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)] rtl:[clip-path:polygon(0_0,100%_0,100%_100%,18%_100%)]">
            <Image src={INDEX_IMAGE} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            <div className="absolute inset-0 bg-slate-950/35" />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="lg:col-span-7 space-y-8"
        >
          <motion.div variants={fadeUp}>
            <SectorsHeading
              eyebrow={t("sectorsIndexEyebrow")}
              title={t("sectorsIndexTitle")}
              description={t("sectorsIndexDesc")}
            />
          </motion.div>

          <ol className="space-y-2">
            {sectorsData.map((sector, i) => (
              <motion.li
                key={sector.id}
                variants={fadeUp}
                style={{ "--step": i } as CSSProperties}
                className="lg:ms-[calc(var(--step)*2rem)]"
              >
                <Link
                  href={`#${sector.slug}`}
                  className="group flex items-center gap-4 rounded-full border border-transparent px-2 py-2 -mx-2 hover:border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <span className="w-11 h-11 shrink-0 rounded-full bg-primary-500 text-white font-latin font-bold text-sm flex items-center justify-center shadow-md shadow-primary-500/25 group-hover:bg-primary-600 transition-colors">
                    {pad(i)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {sector.title[language]}
                    </span>
                    <span className="block text-xs text-slate-500 leading-relaxed line-clamp-1">
                      {sector.subtitle[language]}
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
