"use client";

import { motion } from "framer-motion";
import {
  Accessibility,
  Baby,
  GraduationCap,
  Hammer,
  HeartPulse,
  PersonStanding,
  Tent,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import type { Language } from "@/types";
import { PaleCircle, SectionHeading, fadeUp, stagger, viewportOnce } from "./shared";

type Group = (typeof aboutData.targetGroups)[number];

/** One icon per target group, in the order of data/about.ts. */
const ICONS: LucideIcon[] = [Tent, UserRound, Baby, PersonStanding, Accessibility, HeartPulse, GraduationCap, Users, Hammer];

function GroupNode({ group, language }: { group: Group; language: Language }) {
  const Icon = ICONS[group.number - 1] ?? Users;
  return (
    <motion.li variants={fadeUp} className="relative flex flex-col items-center text-center gap-3">
      <span className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-2 border-primary-500 text-primary-600 flex items-center justify-center shadow-md shadow-primary-500/10">
        <Icon className="w-7 h-7" />
        <span className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-primary-500 text-white text-[10px] font-latin font-bold flex items-center justify-center border-2 border-white">
          {group.number}
        </span>
      </span>
      <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug max-w-[140px]">{group[language]}</span>
    </motion.li>
  );
}

export function TargetGroups() {
  const { language, t } = useLanguage();
  const groups = aboutData.targetGroups;
  const rows = [groups.slice(0, 5), groups.slice(5)];

  return (
    <section id="target-groups" className="relative overflow-hidden bg-white py-16 sm:py-24 scroll-mt-32">
      <PaleCircle size={240} className="-end-28 -top-28" />
      <PaleCircle size={70} className="end-24 top-24 bg-primary-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <SectionHeading index="06" title={t("aboutTargetTitle")} subtitle={t("aboutTargetSubtitle")} align="center" />
        </motion.div>

        {/* Small screens: plain three-column grid. */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="grid grid-cols-3 gap-x-3 gap-y-8 lg:hidden"
        >
          {groups.map((group) => (
            <GroupNode key={group.number} group={group} language={language} />
          ))}
        </motion.ul>

        {/* Large screens: two rows of nodes on a dashed line, as on the template's timeline slide. */}
        <div className="hidden lg:block space-y-14">
          {rows.map((row, r) => (
            <motion.ul
              key={r}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={stagger}
              className={r === 0 ? "relative grid grid-cols-5 gap-6" : "relative grid grid-cols-4 gap-6 max-w-4xl mx-auto"}
            >
              <span
                aria-hidden
                className={
                  r === 0
                    ? "absolute top-10 inset-x-[10%] border-t-2 border-dashed border-primary-200"
                    : "absolute top-10 inset-x-[12.5%] border-t-2 border-dashed border-primary-200"
                }
              />
              {row.map((group) => (
                <GroupNode key={group.number} group={group} language={language} />
              ))}
            </motion.ul>
          ))}
        </div>
      </div>
    </section>
  );
}
