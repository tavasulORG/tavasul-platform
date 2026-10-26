"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle, PenLine, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { FORM_ID, SignalArcs, fadeUp, mailtoHref, mapsHref, stagger, telHref, whatsappHref } from "./shared";

/** Light cover with the signal motif, then a strip of four live channels that hangs over the form section. */
export function ContactHero() {
  const { t } = useLanguage();
  const { settings } = useContent();
  const phone = settings.phone || t("phone");
  const whatsapp = settings.whatsapp || phone;
  const email = settings.email || t("email");
  const address = t("address");

  const channels = [
    {
      icon: MessageCircle,
      label: t("contactChannelWhatsapp"),
      value: phone,
      hint: t("contactChannelWhatsappHint"),
      href: whatsappHref(whatsapp),
      external: true,
      latin: true,
    },
    {
      icon: Mail,
      label: t("contactChannelEmail"),
      value: email,
      hint: t("contactChannelEmailHint"),
      href: mailtoHref(email),
      external: false,
      latin: true,
    },
    {
      icon: Phone,
      label: t("contactChannelPhone"),
      value: phone,
      hint: t("contactChannelPhoneHint"),
      href: telHref(phone),
      external: false,
      latin: true,
    },
    {
      icon: MapPin,
      label: t("contactChannelOffice"),
      value: address,
      hint: t("contactChannelOfficeHint"),
      href: mapsHref(`${t("brandSubtitle")} ${address}`),
      external: true,
      latin: false,
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-primary-50 via-white to-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <SignalArcs className="-top-16 end-[-4rem] h-[380px] w-[380px] text-primary-200 sm:-top-24 sm:end-[-5rem] sm:h-[560px] sm:w-[560px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl space-y-5">
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-[11px] font-bold text-primary-700 sm:text-xs"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {t("contactHeroEyebrow")}
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-balance font-brand text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {t("contactHeroTitle")}
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg">
            {t("contactHeroSubtitle")}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
            <a
              href={`#${FORM_ID}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-7 py-3.5 text-sm font-black text-white transition-colors hover:bg-primary-600"
            >
              <PenLine className="h-4 w-4" />
              {t("contactHeroWrite")}
            </a>
            <a
              href={whatsappHref(phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 px-7 py-3.5 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              {t("contactHeroWhatsapp")}
            </a>
          </motion.div>
        </motion.div>

        {/* The strip sits half over the next section; ContactForm leaves room for it with its top padding. */}
        <div className="relative z-10 mt-14 translate-y-12">
          <motion.ul initial="hidden" animate="visible" variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map(({ icon: Icon, label, value, hint, href, external, latin }) => (
              <motion.li key={label} variants={fadeUp}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-brand-soft transition-colors hover:border-primary-300"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-slate-500">{label}</span>
                    {latin ? (
                      <bdi dir="ltr" className="mt-1 block truncate font-latin text-sm font-bold text-slate-900">
                        {value}
                      </bdi>
                    ) : (
                      <span className="mt-1 block truncate text-sm font-bold text-slate-900">{value}</span>
                    )}
                    <span className="mt-1 block text-[11px] leading-snug text-slate-500">{hint}</span>
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
