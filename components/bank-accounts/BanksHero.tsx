"use client";

import { motion } from "framer-motion";
import { Globe, Landmark, Receipt, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { CopyButton, EASE, accountHolderOf, fadeUp, stagger, useCopy } from "./shared";

/** Dark cover ruled like a ledger; the official beneficiary name rides on a bank-card panel at the end side. */
export function BanksHero() {
  const { t } = useLanguage();
  const { about: aboutData, bankAccounts } = useContent();
  const ACCOUNT_HOLDER = accountHolderOf(bankAccounts);
  const { copied, copy } = useCopy();

  const features = [
    { icon: Landmark, label: t("banksHeroDomestic") },
    { icon: Globe, label: t("banksHeroIntl") },
    { icon: Receipt, label: t("banksHeroReceipt") },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Static backdrop: a fine grid and one quiet brand glow behind the card. */}
      <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.07]">
        <defs>
          <pattern id="banks-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#banks-grid)" />
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 end-[-10%] h-[520px] w-[520px] rounded-full bg-primary-500/20 blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-20 sm:px-6 sm:pt-24 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:pb-28">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5 lg:col-span-7">
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold sm:text-xs"
          >
            <Landmark className="h-3.5 w-3.5 text-primary-300" />
            {t("banksHeroEyebrow")}
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-brand text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {t("banksHeroTitle")}
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
            {t("banksHeroSubtitle")}
          </motion.p>
          <motion.ul variants={fadeUp} className="flex flex-wrap gap-x-8 gap-y-3 pt-2 text-sm">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-slate-200">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-primary-300">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Beneficiary card: the one name every transfer must carry. */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="lg:col-span-5"
        >
          <div className="relative mx-auto w-full max-w-[440px]">
            <div
              aria-hidden
              className="absolute inset-0 translate-y-5 rotate-[5deg] rounded-[1.75rem] bg-slate-800/70 rtl:-rotate-[5deg]"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 p-6 shadow-2xl shadow-primary-900/50 sm:aspect-[1.586/1] sm:p-7">
              <svg aria-hidden viewBox="0 0 200 200" className="absolute -bottom-20 -end-16 h-72 w-72 opacity-20">
                {[40, 60, 80, 100, 120, 140].map((r) => (
                  <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="white" strokeWidth="1" />
                ))}
              </svg>

              <div className="relative flex h-full flex-col gap-6 sm:justify-between sm:gap-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="block font-latin text-lg font-bold tracking-[0.2em]">TAVASUL</span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">Derneği</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {t("banksCardVerified")}
                  </span>
                </div>

                <svg aria-hidden viewBox="0 0 48 36" className="h-9 w-12">
                  <rect x="1" y="1" width="46" height="34" rx="6" fill="rgba(255,255,255,0.9)" />
                  <path d="M1 13h14M1 23h14M33 13h14M33 23h14M15 1v34M33 1v34" stroke="#0369a1" strokeWidth="1.2" fill="none" />
                </svg>

                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{t("banksCardLabel")}</span>
                  <bdi dir="ltr" className="mt-1 block font-latin text-base font-bold leading-snug tracking-wide sm:text-lg">
                    {ACCOUNT_HOLDER}
                  </bdi>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <dl className="flex gap-6 text-[11px]">
                    <div>
                      <dt className="text-white/60">{t("banksCardLicense")}</dt>
                      <dd className="font-latin font-bold">
                        <bdi dir="ltr">{aboutData.licenseNumber}</bdi>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/60">{t("banksCardCityLabel")}</dt>
                      <dd className="font-bold">{t("banksCardCity")}</dd>
                    </div>
                  </dl>
                  <CopyButton
                    variant="ghost"
                    copied={copied === "holder"}
                    onCopy={() => copy("holder", ACCOUNT_HOLDER)}
                    label={t("banksCopyName")}
                    copiedLabel={t("copied")}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
