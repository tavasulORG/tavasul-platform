"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { Award, FileText, Handshake, Landmark, MapPin, UserRound, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import type { Language, LocalizedString, Partner } from "@/types";
import { DashedRing, PaleCircle, SectionHeading, SubHeading, fadeUp, stagger, viewportOnce } from "./shared";

const ROLE_KEY = { ar: "roleAr", tr: "roleTr", en: "roleEn" } as const;
const TITLE_KEY = { ar: "titleAr", tr: "titleTr", en: "titleEn" } as const;

/** Partner types as stored in data/about.ts, shown in the visitor's language. */
const PARTNER_TYPES: Record<string, LocalizedString> = {
  "International Fund": { ar: "صندوق دولي", tr: "Uluslararası fon", en: "International fund" },
  "Governmental / Humanitarian": { ar: "جهة حكومية إنسانية", tr: "Kamu / insani kuruluş", en: "Governmental / humanitarian" },
  "UN Agency": { ar: "وكالة أممية", tr: "BM kuruluşu", en: "UN agency" },
  "Philanthropic Endowment": { ar: "وقف خيري", tr: "Hayır vakfı", en: "Philanthropic endowment" },
  "International NGO": { ar: "منظمة دولية غير حكومية", tr: "Uluslararası STK", en: "International NGO" },
  "Field Implementation Partner": { ar: "شريك تنفيذ ميداني", tr: "Saha uygulama ortağı", en: "Field implementation partner" },
  "Healthcare Partner": { ar: "شريك صحي", tr: "Sağlık ortağı", en: "Healthcare partner" },
  "Regional Partner": { ar: "شريك إقليمي", tr: "Bölgesel ortak", en: "Regional partner" },
};

/**
 * Partner names are stored as "Arabic name (Latin name)". Arabic readers get the
 * Arabic name first; Turkish and English readers get the Latin name first.
 */
function splitName(name: string, language: Language) {
  const match = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!match) return { primary: name, secondary: "" };
  const [, arabic, latin] = match;
  return language === "ar" ? { primary: arabic, secondary: latin } : { primary: latin, secondary: arabic };
}

interface PartnerGroup {
  label: string;
  icon: LucideIcon;
  items: Partner[];
}

export function Governance() {
  const { language, t } = useLanguage();
  const { about: aboutData } = useContent();
  const { boardOfDirectors, reports } = aboutData.governance;
  const partnerGroups: PartnerGroup[] = [
    { label: t("aboutFundingPartners"), icon: Landmark, items: aboutData.partners.funding },
    { label: t("aboutImplementingPartners"), icon: MapPin, items: aboutData.partners.implementing },
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
            <SubHeading icon={<Award className="w-5 h-5" />}>{t("aboutBoardLabel")}</SubHeading>
          </motion.div>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {boardOfDirectors.map((member) => (
              <motion.li key={member.name} variants={fadeUp} className="flex flex-col items-center text-center gap-4">
                <span className="relative inline-flex">
                  <DashedRing className="-inset-2.5" />
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg shadow-primary-500/25"
                    />
                  ) : (
                    <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/25">
                      <UserRound className="w-9 h-9" />
                    </span>
                  )}
                </span>
                <span>
                  <span className="block font-bold text-slate-900 text-sm sm:text-base">{member.name}</span>
                  <span className="block text-xs text-slate-500 mt-1 leading-relaxed">{member[ROLE_KEY[language]]}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Reports: two wide cards in one row. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="space-y-6"
        >
          <motion.div variants={fadeUp}>
            <SubHeading icon={<FileText className="w-5 h-5" />}>{t("aboutReportsLabel")}</SubHeading>
          </motion.div>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {reports.map((report) => (
              <motion.li
                key={report[TITLE_KEY[language]]}
                variants={fadeUp}
                className={clsx(
                  "relative flex items-center gap-5 rounded-[2rem] bg-white border border-slate-200 p-5 sm:p-6",
                  report.url && "hover:border-primary-300 transition-colors"
                )}
              >
                {report.url && (
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={report[TITLE_KEY[language]]}
                    className="absolute inset-0 rounded-[2rem]"
                  />
                )}
                <span className="w-16 h-16 shrink-0 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <FileText className="w-7 h-7" />
                </span>
                <span className="min-w-0 space-y-2">
                  <span className="block text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {report[TITLE_KEY[language]]}
                  </span>
                  <span className="flex flex-wrap gap-1.5">
                    {["PDF", report.year, report.size].filter(Boolean).map((chip) => (
                      <span
                        key={chip}
                        dir="ltr"
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-latin font-semibold text-slate-600"
                      >
                        {chip}
                      </span>
                    ))}
                  </span>
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Partners: two numbered lists side by side, like the template's contents slide. */}
        <motion.div
          id="partners"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="space-y-8 scroll-mt-32"
        >
          <motion.div variants={fadeUp}>
            <SubHeading icon={<Handshake className="w-5 h-5" />}>{t("aboutPartnersTitle")}</SubHeading>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-10">
            {partnerGroups.map((group) => (
              <motion.div key={group.label} variants={fadeUp}>
                <div className="flex items-center gap-3 pb-3 border-b-2 border-primary-500">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    <group.icon className="w-4 h-4" />
                  </span>
                  <span className="font-bold text-slate-900">{group.label}</span>
                  <span className="ms-auto rounded-full bg-primary-50 px-2.5 py-1 font-latin text-xs font-bold text-primary-700">
                    {group.items.length}
                  </span>
                </div>

                <ol>
                  {group.items.map((partner, i) => {
                    const { primary, secondary } = splitName(partner.name, language);
                    const type = PARTNER_TYPES[partner.type]?.[language] ?? partner.type;
                    return (
                      <li
                        key={partner.name}
                        className="flex items-start gap-4 py-4 border-b border-dashed border-slate-300 last:border-b-0"
                      >
                        {partner.logo ? (
                          <img
                            src={partner.logo}
                            alt=""
                            className="w-10 h-10 shrink-0 rounded-full object-contain bg-white border border-slate-200"
                          />
                        ) : (
                          <span className="w-10 h-10 shrink-0 rounded-full bg-primary-50 text-primary-700 font-latin font-bold text-xs flex items-center justify-center">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        )}
                        <span className="min-w-0 pt-2">
                          {partner.website ? (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noreferrer"
                              className="block font-semibold text-slate-900 leading-snug hover:text-primary-700"
                            >
                              {primary}
                            </a>
                          ) : (
                            <span className="block font-semibold text-slate-900 leading-snug">{primary}</span>
                          )}
                          <span className="block text-xs text-slate-500 mt-1">
                            {secondary ? `${secondary} · ${type}` : type}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
