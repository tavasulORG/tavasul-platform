"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { HEX, ProjectsHeading, fadeUp, formatDate, stagger, viewportOnce } from "./shared";

const MAX_UPDATES = 5;

/** Latest dated updates across all projects on a timeline: hexagons on a dashed line, date tags underneath. */
export function ProjectsUpdates() {
  const { language, t } = useLanguage();
  const { projects } = useDonation();

  const updates = projects
    .flatMap((project) => project.updates.map((update) => ({ ...update, project })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_UPDATES);

  if (updates.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <ProjectsHeading
            eyebrow={t("projectsUpdatesEyebrow")}
            title={t("projectsUpdatesTitle")}
            description={t("projectsUpdatesDesc")}
            align="center"
          />
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="relative grid grid-cols-1 lg:grid-cols-5 gap-y-10 lg:gap-x-6"
        >
          {/* The line the nodes sit on: vertical on small screens, horizontal on large. */}
          <span aria-hidden className="absolute top-4 bottom-4 start-8 border-s-2 border-dashed border-primary-200 lg:hidden" />
          <span aria-hidden className="hidden lg:block absolute top-8 inset-x-[10%] border-t-2 border-dashed border-primary-200" />

          {updates.map((update, i) => (
            <motion.li key={`${update.project.id}-${update.date}`} variants={fadeUp} className="relative flex lg:flex-col gap-5 lg:gap-0 lg:items-center lg:text-center">
              <span
                className={clsx(
                  "relative z-10 w-16 h-16 shrink-0 flex items-center justify-center text-white",
                  HEX,
                  i % 2 === 0 ? "bg-primary-500" : "bg-slate-900"
                )}
              >
                <FileText className="w-6 h-6" />
              </span>
              <span aria-hidden className="hidden lg:block h-8 border-s-2 border-dashed border-primary-300" />

              <div className="min-w-0 space-y-2 pt-1 lg:pt-0">
                <span className="inline-block rounded-full bg-slate-900 text-white px-3 py-1 font-latin text-[11px] font-bold">
                  <bdi dir="ltr">{formatDate(update.date, language)}</bdi>
                </span>
                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{update.title[language]}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{update.text[language]}</p>
                <Link
                  href={`/projects/${update.project.slug}`}
                  className="inline-block text-xs font-bold text-primary-700 hover:text-primary-800 line-clamp-1"
                >
                  {update.project.title[language]}
                </Link>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
