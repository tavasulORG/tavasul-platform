"use client";

import { motion } from "framer-motion";
import { FileText, Handshake, Landmark, UserRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { DashedRing, PaleCircle, SectionHeading, SubHeading, fadeUp, stagger, viewportOnce } from "./shared";

const ROLE_KEY = { ar: "roleAr", tr: "roleTr", en: "roleEn" } as const;
const TITLE_KEY = { ar: "titleAr", tr: "titleTr", en: "titleEn" } as const;

export function Governance() {
  const { language, t } = useLanguage();
  const { boardOfDirectors, reports } = aboutData.governance;
  const partnerGroups = [
    { label: t("aboutFundingPartners"), items: aboutData.partners.funding },
    { label: t("aboutImplementingPartners"), items: aboutData.partners.implementing },
  ];

  return (
    <section id="governance" className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 scroll-mt-32">
      <PaleCircle size={300} className="-start-36 -bottom-36" />
      <PaleCircle size={90} className="start-36 bottom-12 bg-primary-200/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <SectionHeading
            index="07"
            title={t("aboutGovernanceTitle")}
            subtitle={t("aboutGovernanceSubtitle")}
            align="center"
          />
        </motion.div>

        {/* Board: four brand circles, as on the template's four-icon slide. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="space-y-8"
        >
          <motion.div variants={fadeUp}>
            <SubHeading icon={<Landmark className="w-5 h-5" />}>{t("aboutBoardLabel")}</SubHeading>
          </motion.div>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {boardOfDirectors.map((member) => (
              <motion.li key={member.name} variants={fadeUp} className="flex flex-col items-center text-center gap-4">
                <span className="relative inline-flex">
                  <DashedRing className="-inset-2.5" />
                  <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/25">
                    <UserRound className="w-9 h-9" />
                  </span>
                </span>
                <span>
                  <span className="block font-bold text-slate-900 text-sm sm:text-base">{member.name}</span>
                  <span className="block text-xs text-slate-500 mt-1 leading-relaxed">{member[ROLE_KEY[language]]}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Reports as capsule rows with an icon circle. */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="space-y-5"
          >
            <motion.div variants={fadeUp}>
              <SubHeading icon={<FileText className="w-5 h-5" />}>{t("aboutReportsLabel")}</SubHeading>
            </motion.div>
            <ul className="space-y-3">
              {reports.map((report) => (
                <motion.li
                  key={report[TITLE_KEY[language]]}
                  variants={fadeUp}
                  className="flex items-center gap-4 rounded-full border border-slate-200 bg-white ps-2 pe-5 py-2"
                >
                  <span className="w-12 h-12 shrink-0 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900 leading-snug">{report[TITLE_KEY[language]]}</span>
                    <span className="block text-[11px] text-slate-500 font-latin mt-0.5">
                      <bdi dir="ltr">PDF · {report.year} · {report.size}</bdi>
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Partners as capsule tags. */}
          <motion.div
            id="partners"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="space-y-5 scroll-mt-32"
          >
            <motion.div variants={fadeUp}>
              <SubHeading icon={<Handshake className="w-5 h-5" />}>{t("aboutPartnersTitle")}</SubHeading>
            </motion.div>
            {partnerGroups.map((group) => (
              <motion.div key={group.label} variants={fadeUp} className="space-y-2.5">
                <span className="block text-xs font-bold text-primary-600">{group.label}</span>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((partner) => (
                    <li
                      key={partner.name}
                      className="rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-800"
                    >
                      {partner.name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
