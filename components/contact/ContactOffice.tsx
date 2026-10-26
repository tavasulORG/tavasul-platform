"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Heart, Landmark, MapPin, Navigation, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { useContent } from "@/context/ContentContext";
import { ContactHeading, SignalArcs, fadeUp, mapsHref, stagger, viewportOnce } from "./shared";

const ROW =
  "group flex w-full items-center gap-4 py-4 text-start text-sm font-bold text-white transition-colors hover:text-primary-200";
const ROW_ICON = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-primary-300";

/** Closing section: the office address with opening hours, and three other ways to help. */
export function ContactOffice() {
  const { t } = useLanguage();
  const { openQuickDonate } = useDonation();
  const { settings } = useContent();
  const address = t("address");

  const hours = [
    { day: t("contactHoursWeekdays"), value: t("contactHoursWeekdaysValue"), latin: true },
    { day: t("contactHoursSaturday"), value: t("contactHoursSaturdayValue"), latin: true },
    { day: t("contactHoursSunday"), value: t("contactHoursClosed"), latin: false },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 text-white sm:py-24">
      <SignalArcs corner="bottom-start" className="-bottom-24 -start-24 h-[420px] w-[420px] text-white/5" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger} className="lg:col-span-7">
          <motion.div variants={fadeUp}>
            <ContactHeading tone="light" eyebrow={t("contactOfficeEyebrow")} title={t("contactOfficeTitle")} description={t("contactOfficeDesc")} />
          </motion.div>

          <dl className="mt-10 grid gap-10 sm:grid-cols-2">
            <motion.div variants={fadeUp}>
              <dt className="flex items-center gap-2 text-xs font-bold text-primary-300">
                <MapPin className="h-4 w-4" />
                {t("contactOfficeAddressLabel")}
              </dt>
              <dd className="mt-3 text-base font-bold">{address}</dd>
              <dd className="mt-1 text-sm text-slate-400">
                <bdi dir="ltr" className="font-latin">
                  {t("brandSubtitle")}
                </bdi>
              </dd>
              <dd className="mt-1 text-xs leading-relaxed text-slate-400">{t("licenseInfo")}</dd>
              <dd className="mt-5">
                <a
                  href={mapsHref(`${t("brandSubtitle")} ${address}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-black text-slate-900 transition-colors hover:bg-primary-50"
                >
                  <Navigation className="h-4 w-4" />
                  {t("contactOfficeDirections")}
                </a>
              </dd>
            </motion.div>

            <motion.div variants={fadeUp}>
              <dt className="flex items-center gap-2 text-xs font-bold text-primary-300">
                <Clock className="h-4 w-4" />
                {t("contactOfficeHoursLabel")}
              </dt>
              <dd className="mt-3">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-dashed divide-white/15">
                    {hours.map(({ day, value, latin }) => (
                      <tr key={day}>
                        <th scope="row" className="py-2.5 text-start font-semibold text-slate-200">
                          {day}
                        </th>
                        <td className={clsxLatin(latin)}>{latin ? <bdi dir="ltr">{value}</bdi> : value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </dd>
              <dd className="mt-3 text-xs text-slate-400">{t("contactOfficeNote")}</dd>
            </motion.div>
          </dl>
        </motion.div>

        <motion.aside initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp} className="lg:col-span-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h3 className="font-brand text-xl font-extrabold">{t("contactOtherTitle")}</h3>
            <ul className="mt-4 divide-y divide-white/10">
              <li>
                <button type="button" onClick={() => openQuickDonate()} className={ROW}>
                  <span className={ROW_ICON}>
                    <Heart className="h-4 w-4 fill-current" />
                  </span>
                  <span className="flex-1">{t("contactOtherDonate")}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-primary-200 rtl:-scale-x-100" />
                </button>
              </li>
              <li>
                <Link href="/volunteer" className={ROW}>
                  <span className={ROW_ICON}>
                    <Users className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{t("contactOtherVolunteer")}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-primary-200 rtl:-scale-x-100" />
                </Link>
              </li>
              <li>
                <Link href="/bank-accounts" className={ROW}>
                  <span className={ROW_ICON}>
                    <Landmark className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{t("contactOtherBanks")}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-primary-200 rtl:-scale-x-100" />
                </Link>
              </li>
            </ul>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function clsxLatin(latin: boolean) {
  return latin ? "py-2.5 text-end font-latin font-bold" : "py-2.5 text-end font-bold text-slate-400";
}
