"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import type { AboutValue, Language } from "@/types";
import { PaleCircle, SectionHeading, fadeUp, stagger, viewportOnce } from "./shared";

type Value = AboutValue;

function ValueItem({ value, language, mirrored }: { value: Value; language: Language; mirrored: boolean }) {
  return (
    <motion.li
      variants={fadeUp}
      className={clsx("flex gap-4 items-start", mirrored && "lg:flex-row-reverse lg:text-end")}
    >
      <span className="w-12 h-12 shrink-0 rounded-full border-2 border-primary-500 bg-white text-primary-600 font-latin font-bold text-sm flex items-center justify-center">
        {value.number}
      </span>
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900">{value[language]}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{value.desc[language]}</p>
      </div>
    </motion.li>
  );
}

export function Values() {
  const { language, t } = useLanguage();
  const { about: aboutData } = useContent();
  const first = aboutData.values.slice(0, 3);
  const second = aboutData.values.slice(3);

  return (
    <section id="values" className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 scroll-mt-32">
      <PaleCircle size={260} className="-start-32 -top-32" />
      <PaleCircle size={80} className="start-32 top-10 bg-primary-200/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <SectionHeading index="05" title={t("aboutValuesTitle")} subtitle={t("aboutValuesSubtitle")} align="center" />
        </motion.div>

        {/* Central circle with three values on each side, as on the six-advantages slide. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-14 items-center"
        >
          <ul className="space-y-8 order-2 lg:order-none">
            {first.map((value) => (
              <ValueItem key={value.id} value={value} language={language} mirrored />
            ))}
          </ul>

          <motion.div variants={fadeUp} className="flex justify-center order-1 lg:order-none">
            <div className="relative">
              <div aria-hidden className="absolute -inset-5 rounded-full border-2 border-dashed border-primary-300" />
              <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-primary-500 text-white flex flex-col items-center justify-center text-center px-8 shadow-2xl shadow-primary-500/30">
                <Compass className="w-8 h-8 mb-3 text-white/90" />
                <span className="font-brand font-black text-2xl sm:text-3xl leading-tight">{t("aboutValuesCenter")}</span>
              </div>
            </div>
          </motion.div>

          <ul className="space-y-8 order-3 lg:order-none">
            {second.map((value) => (
              <ValueItem key={value.id} value={value} language={language} mirrored={false} />
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
