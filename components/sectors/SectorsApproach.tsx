"use client";

import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { motion } from "framer-motion";
import { ClipboardCheck, ClipboardList, Hammer, Wallet } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { SectorsHeading, fadeUp, pad, stagger, viewportOnce } from "./shared";

interface Step {
  icon: ComponentType<LucideProps>;
  title: string;
  desc: string;
  /** Quadrant fill; the same class marks the step in the list. */
  color: string;
}

/** The four-quadrant disc of the SWOT slide, reused for the project cycle. */
export function SectorsApproach() {
  const { t } = useLanguage();

  const steps: Step[] = [
    { icon: ClipboardList, title: t("sectorsApproachStep1Title"), desc: t("sectorsApproachStep1Desc"), color: "bg-primary-500" },
    { icon: Wallet, title: t("sectorsApproachStep2Title"), desc: t("sectorsApproachStep2Desc"), color: "bg-primary-700" },
    { icon: Hammer, title: t("sectorsApproachStep3Title"), desc: t("sectorsApproachStep3Desc"), color: "bg-slate-800" },
    { icon: ClipboardCheck, title: t("sectorsApproachStep4Title"), desc: t("sectorsApproachStep4Desc"), color: "bg-slate-500" },
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <SectorsHeading
            eyebrow={t("sectorsApproachEyebrow")}
            title={t("sectorsApproachTitle")}
            description={t("sectorsApproachDesc")}
            align="center"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          <motion.div variants={fadeUp} className="lg:col-span-5 flex justify-center">
            {/* Four quadrants separated by the white gap of the grid, with a white centre disc. */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden bg-white grid grid-cols-2 gap-1.5 shadow-xl shadow-slate-900/10">
              {steps.map((step) => (
                <div key={step.title} className={clsx("flex items-center justify-center text-white", step.color)}>
                  <step.icon className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>
              ))}
              <div className="absolute inset-[29%] rounded-full bg-white border-[6px] border-slate-100 flex items-center justify-center text-center px-3">
                <span className="font-brand font-black text-slate-900 text-sm sm:text-base leading-tight">
                  {t("sectorsApproachCenter")}
                </span>
              </div>
            </div>
          </motion.div>

          <ol className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            {steps.map((step, i) => (
              <motion.li key={step.title} variants={fadeUp} className="flex gap-4 items-start">
                <span className={clsx("mt-1 w-3 h-3 shrink-0", step.color)} aria-hidden />
                <div className="space-y-1.5">
                  <span className="block font-latin text-[11px] font-bold tracking-[0.15em] text-slate-400">{pad(i)}</span>
                  <h3 className="font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
