"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { fadeUp, viewportOnce } from "./shared";

/** A compact brand band: one line of text and two actions, a step down from the dark footer. */
export function BanksCta() {
  const { t } = useLanguage();
  const { openQuickDonate } = useDonation();

  return (
    <section className="bg-primary-600 text-white">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
      >
        <div className="max-w-xl space-y-2">
          <h2 className="font-brand text-2xl font-black leading-tight sm:text-3xl">{t("banksCtaTitle")}</h2>
          <p className="text-sm leading-relaxed text-white/85 sm:text-base">{t("banksCtaDesc")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => openQuickDonate()}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-primary-700 transition-colors hover:bg-primary-50"
          >
            <Heart className="h-4 w-4 fill-current" />
            {t("donateNow")}
          </button>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-7 py-3.5 text-sm font-bold transition-colors hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            {t("navContact")}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
