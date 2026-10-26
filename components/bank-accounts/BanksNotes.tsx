"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftRight, FileCheck, Globe, Landmark, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { BanksHeading, fadeUp, stagger, viewportOnce } from "./shared";

/** Four ruled notes on how transfers behave, beside a dark trust panel that names the only valid beneficiary. */
export function BanksNotes() {
  const { t } = useLanguage();

  const notes = [
    { icon: Landmark, title: t("banksNoteDomesticTitle"), desc: t("banksNoteDomesticDesc") },
    { icon: Globe, title: t("banksNoteIntlTitle"), desc: t("banksNoteIntlDesc") },
    { icon: ArrowLeftRight, title: t("banksNoteCurrencyTitle"), desc: t("banksNoteCurrencyDesc") },
    { icon: FileCheck, title: t("banksNoteReceiptTitle"), desc: t("banksNoteReceiptDesc") },
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-7">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
            <BanksHeading eyebrow={t("banksNotesEyebrow")} title={t("banksNotesTitle")} />
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="mt-10 grid gap-x-10 sm:grid-cols-2"
          >
            {notes.map(({ icon: Icon, title, desc }) => (
              <motion.li key={title} variants={fadeUp} className="border-t border-slate-200 py-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.aside initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp} className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white sm:p-10 lg:sticky lg:top-28">
            <ShieldCheck aria-hidden className="pointer-events-none absolute -bottom-10 -end-10 h-56 w-56 text-white/5" strokeWidth={1.2} />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/15 px-3 py-1 text-[11px] font-bold text-primary-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("officialLicenseBadge")}
              </span>
              <h3 className="mt-5 font-brand text-2xl font-extrabold leading-tight sm:text-3xl">{t("banksTrustTitle")}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{t("banksTrustDesc")}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">{t("licenseInfo")}</p>
              <Link
                href="/about#governance"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-900 transition-colors hover:bg-primary-50"
              >
                {t("financialAuditReports")}
              </Link>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
