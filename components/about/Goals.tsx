"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { PaleCircle, SectionHeading, fadeUp, stagger, viewportOnce } from "./shared";

export function Goals() {
  const { language, t } = useLanguage();

  return (
    <section id="goals" className="relative overflow-hidden bg-white py-16 sm:py-24 scroll-mt-32">
      <PaleCircle size={300} className="-end-36 -bottom-36" />
      <PaleCircle size={110} className="end-36 bottom-8 bg-primary-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <SectionHeading index="04" title={t("aboutGoalsTitle")} subtitle={t("aboutGoalsSubtitle")} align="center" />
        </motion.div>

        {/* Numbered capsules, as on the template's 01 to 04 pill slide. */}
        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6"
        >
          {aboutData.goals.map((goal, i) => (
            <motion.li
              key={goal.id}
              variants={fadeUp}
              className="rounded-[2rem] sm:rounded-[999px] bg-primary-500 text-white px-6 py-6 sm:px-6 sm:py-10 flex sm:flex-col items-center gap-4 sm:gap-5 sm:text-center lg:min-h-[340px] shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-colors"
            >
              <span className="w-14 h-14 shrink-0 rounded-full bg-white text-primary-600 font-latin font-bold text-lg flex items-center justify-center">
                0{i + 1}
              </span>
              <p className="text-sm leading-relaxed font-medium">{goal[language]}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
