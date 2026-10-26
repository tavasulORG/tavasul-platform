"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { BanksHeading, fadeUp, pad, stagger, viewportOnce } from "./shared";

/** Perforated receipt edges: semicircles cut out of a white strip so the section colour shows through. */
const EDGE_TOP = "radial-gradient(circle at 10px 0px, transparent 7px, #ffffff 7.5px)";
const EDGE_BOTTOM = "radial-gradient(circle at 10px 12px, transparent 7px, #ffffff 7.5px)";

/** Fixed bar widths keep the decorative barcode identical on the server and the client. */
const BARS = [3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 2, 1, 1, 3, 1, 2, 1, 2, 3, 1, 1, 2, 1];

/** The three steps of a transfer donation, printed on a receipt. */
export function BanksSteps() {
  const { t } = useLanguage();
  const { settings } = useContent();
  const email = settings.email || t("email");
  const phone = settings.phone || t("phone");

  const steps = [
    { title: t("banksStep1Title"), desc: t("banksStep1Desc"), contact: false },
    { title: t("banksStep2Title"), desc: t("banksStep2Desc"), contact: false },
    { title: t("banksStep3Title"), desc: t("banksStep3Desc"), contact: true },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <BanksHeading eyebrow={t("banksStepsEyebrow")} title={t("banksStepsTitle")} align="center" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="mx-auto mt-12 max-w-3xl drop-shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
        >
          <div aria-hidden className="h-3" style={{ backgroundImage: EDGE_TOP, backgroundSize: "20px 12px", backgroundRepeat: "repeat-x" }} />

          <div className="bg-white px-6 py-8 sm:px-12 sm:py-10">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-slate-300 pb-5">
              <bdi dir="ltr" className="font-latin text-xs font-bold tracking-[0.2em] text-slate-900 sm:text-sm">
                {t("brandSubtitle")}
              </bdi>
              <span className="rounded-md bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-700">{t("banksHeroEyebrow")}</span>
            </header>

            <ol className="divide-y divide-dashed divide-slate-300">
              {steps.map((step, i) => (
                <motion.li key={step.title} variants={fadeUp} className="grid grid-cols-[3.25rem_1fr] gap-x-4 py-6 sm:grid-cols-[4.5rem_1fr] sm:py-7">
                  <span className="font-latin text-3xl font-bold leading-none text-primary-500 sm:text-4xl">
                    <bdi dir="ltr">{pad(i)}</bdi>
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-brand text-lg font-extrabold text-slate-900 sm:text-xl">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{step.desc}</p>
                    {step.contact && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        <a
                          href={`mailto:${email}`}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800"
                        >
                          <Mail className="h-4 w-4" />
                          <bdi dir="ltr">{email}</bdi>
                        </a>
                        <a
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 transition-colors hover:border-primary-400 hover:text-primary-700"
                        >
                          <Phone className="h-4 w-4" />
                          <bdi dir="ltr">{phone}</bdi>
                        </a>
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
            </ol>

            <footer className="border-t border-dashed border-slate-300 pt-5">
              <div aria-hidden className="flex h-8 items-stretch gap-[3px] opacity-70">
                {BARS.map((width, i) => (
                  <span key={i} className="bg-slate-900" style={{ width }} />
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{t("licenseInfo")}</p>
            </footer>
          </div>

          <div aria-hidden className="h-3" style={{ backgroundImage: EDGE_BOTTOM, backgroundSize: "20px 12px", backgroundRepeat: "repeat-x" }} />
        </motion.div>
      </div>
    </section>
  );
}
