"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { ContactHeading, EASE, FORM_ID, fadeUp, pad, viewportOnce, type TranslationKey } from "./shared";

const FAQ: { q: TranslationKey; a: TranslationKey }[] = [
  { q: "contactFaq1Q", a: "contactFaq1A" },
  { q: "contactFaq2Q", a: "contactFaq2A" },
  { q: "contactFaq3Q", a: "contactFaq3A" },
  { q: "contactFaq4Q", a: "contactFaq4A" },
  { q: "contactFaq5Q", a: "contactFaq5A" },
];

/** Five questions in a ruled accordion; one answer open at a time, the first by default. */
export function ContactFaq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp} className="lg:col-span-4">
          <ContactHeading eyebrow={t("contactFaqEyebrow")} title={t("contactFaqTitle")} description={t("contactFaqDesc")} />
          <p className="mt-8 text-sm text-slate-600">
            {t("contactFaqMore")}{" "}
            <a href={`#${FORM_ID}`} className="font-bold text-primary-700 underline-offset-4 hover:underline">
              {t("contactFaqAsk")}
            </a>
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="divide-y divide-slate-200 border-y border-slate-200 lg:col-span-8"
        >
          {FAQ.map((item, i) => {
            const expanded = open === i;
            const panelId = `faq-panel-${i}`;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-start"
                >
                  <span className="flex items-center gap-4">
                    <span className="font-latin text-xs font-bold text-primary-500">{pad(i)}</span>
                    <span className={clsx("font-bold transition-colors", expanded ? "text-primary-700" : "text-slate-900")}>{t(item.q)}</span>
                  </span>
                  <ChevronDown className={clsx("h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300", expanded && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={panelId}
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 ps-10 text-sm leading-relaxed text-slate-600">{t(item.a)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
