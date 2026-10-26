"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { DashedRing, PaleCircle, SectionHeading, fadeUp, stagger, viewportOnce } from "./shared";

export function WhoWeAre() {
  const { language, t } = useLanguage();
  const copy = aboutData.whoWeAre[language];
  const highlights = [t("aboutWhoHeritage"), t("aboutWhoScope")];

  return (
    <section id="who-we-are" className="relative overflow-hidden bg-white py-16 sm:py-24 scroll-mt-32">
      <PaleCircle size={320} className="-end-40 -top-36" />
      <PaleCircle size={110} className="end-28 top-14 bg-primary-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Circular photo with a thick brand ring and an offset dashed ring, as on the ABOUT US slide. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px]">
            <DashedRing className="-inset-6 sm:-inset-8" />
            <div className="absolute inset-0 rounded-full overflow-hidden ring-[10px] ring-primary-500">
              <Image
                src="/images/impact-solar-water.jpg"
                alt={copy.title}
                fill
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 380px"
                className="object-cover"
              />
            </div>
            <span className="absolute -bottom-1 start-2 sm:start-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-500 text-white border-4 border-white shadow-xl shadow-primary-500/30 flex items-center justify-center">
              <ShieldCheck className="w-9 h-9 sm:w-10 sm:h-10" />
            </span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="lg:col-span-7 space-y-6"
        >
          <motion.div variants={fadeUp}>
            <SectionHeading index="01" title={copy.title} />
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm sm:text-base leading-[1.9] text-slate-600">
            {copy.content}
          </motion.p>
          <motion.ul variants={fadeUp} className="grid sm:grid-cols-2 gap-3 pt-1">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700"
              >
                <span aria-hidden className="mt-1.5 w-2.5 h-2.5 shrink-0 rounded-full bg-primary-500" />
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
