"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { PaleCircle, SectionHeading, fadeUp, stagger, viewportOnce } from "./shared";

export function OurStory() {
  const { language, t } = useLanguage();
  const { about: aboutData } = useContent();
  const story = aboutData.ourStory[language];

  const steps = [
    { title: t("aboutStoryStep1Title"), desc: t("aboutStoryStep1Desc") },
    { title: t("aboutStoryStep2Title"), desc: t("aboutStoryStep2Desc") },
    { title: t("aboutStoryStep3Title"), desc: t("aboutStoryStep3Desc") },
  ];

  return (
    <section id="story" className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 scroll-mt-32">
      <PaleCircle size={280} className="-start-32 -bottom-32" />
      <PaleCircle size={90} className="start-28 bottom-12 bg-primary-200/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Numbered milestones, as on the slide with circled numbers beside a capsule photo. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="lg:col-span-8 space-y-8"
        >
          <motion.div variants={fadeUp}>
            <SectionHeading index="02" title={story.title} subtitle={story.lead} />
          </motion.div>

          <ol className="relative space-y-7">
            <span
              aria-hidden
              className="absolute top-6 bottom-6 start-6 border-s-2 border-dashed border-primary-200"
            />
            {steps.map((step, i) => (
              <motion.li key={step.title} variants={fadeUp} className="relative flex gap-5">
                <span className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-primary-500 text-white font-latin font-bold text-sm flex items-center justify-center shadow-lg shadow-primary-500/25">
                  0{i + 1}
                </span>
                <div className="pt-1.5 space-y-1">
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Tall capsule photo. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="lg:col-span-4 flex justify-center"
        >
          <div className="relative w-52 sm:w-64 h-[360px] sm:h-[440px] lg:h-[520px]">
            <PaleCircle size={200} className="-end-20 -top-12 bg-primary-100" />
            <div className="absolute inset-0 rounded-full overflow-hidden shadow-xl shadow-slate-900/10">
              <Image src="/images/yemen-historic-sanaa.jpg" alt={story.title} fill sizes="260px" className="object-cover" />
            </div>
            <span
              aria-hidden
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary-500 border-4 border-white"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
