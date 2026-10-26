"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { MAP_HEIGHT, MAP_VIEWBOX, MAP_WIDTH, mapCountries, regionCountryCodes, regionPins } from "@/data/regionMap";
import type { CountrySlug } from "@/types";
import { PaleCircle, WhereHeading, fadeUp, numberFormat, stagger, viewportOnce } from "./shared";

/** Region each highlighted country belongs to. */
const REGION_OF: Record<string, CountrySlug> = Object.fromEntries(
  (Object.keys(regionCountryCodes) as CountrySlug[]).flatMap((slug) =>
    regionCountryCodes[slug].map((code) => [code, slug])
  )
);

/** The template's "Explorez le territoire": text beside a map on a pale circle, with the regions clickable. */
export function WhereMap() {
  const { language, t } = useLanguage();
  const [selected, setSelected] = useState<CountrySlug | null>(null);
  const [hovered, setHovered] = useState<CountrySlug | null>(null);
  const { regions: regionsData } = useContent();
  const region = regionsData.find((r) => r.slug === selected);

  const toggle = (slug: CountrySlug) => setSelected((current) => (current === slug ? null : slug));

  return (
    <section id="map" className="relative overflow-hidden bg-white scroll-mt-24">
      <PaleCircle size={820} className="hidden lg:block -top-28 -end-52" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="lg:col-span-5 space-y-6"
        >
          <motion.div variants={fadeUp}>
            <WhereHeading title={t("whereMapTitle")} eyebrow={t("whereMapEyebrow")} />
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm sm:text-base leading-[1.9] text-slate-600">
            {t("whereMapP1")}
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm sm:text-base leading-[1.9] text-slate-600">
            {t("whereMapP2")}
          </motion.p>

          {/* Shows the selected region; the key restarts the short fade when the selection changes. */}
          <motion.div variants={fadeUp} aria-live="polite" className="min-h-[9.5rem]">
            {region ? (
              <div
                key={region.slug}
                className="animate-fadeIn rounded-2xl border border-slate-200 bg-white p-5 shadow-brand-soft space-y-4"
              >
                <div>
                  <h3 className="font-brand text-xl font-extrabold text-slate-900">{region.name[language]}</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{region.headline[language]}</p>
                </div>
                {/* Term before value in the DOM; the column is reversed so the figure sits above its label. */}
                <dl className="flex flex-wrap gap-x-8 gap-y-2">
                  <div className="flex flex-col-reverse">
                    <dt className="mt-1 text-[11px] font-semibold text-slate-500">{t("whereStatBeneficiaries")}</dt>
                    <dd className="font-latin text-2xl font-bold text-primary-700 leading-none">
                      <bdi dir="ltr">{numberFormat.format(region.beneficiariesCount)}</bdi>
                    </dd>
                  </div>
                  <div className="flex flex-col-reverse">
                    <dt className="mt-1 text-[11px] font-semibold text-slate-500">{t("whereStatProjects")}</dt>
                    <dd className="font-latin text-2xl font-bold text-primary-700 leading-none">
                      <bdi dir="ltr">{numberFormat.format(region.activeProjectsCount)}</bdi>
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`#${region.slug}`}
                    className="inline-flex items-center gap-2 bg-primary-700 text-white px-5 py-2.5 text-xs font-bold hover:bg-primary-600 transition-colors"
                  >
                    {t("whereMapGoTo")}
                    <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-primary-700 transition-colors"
                  >
                    {t("whereMapAll")}
                  </button>
                </div>
              </div>
            ) : (
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                <MapPin className="w-4 h-4 text-primary-600" />
                {t("whereMapHint")}
              </p>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="lg:col-span-7 space-y-6"
        >
          <div className="relative mx-auto w-full max-w-[640px]" style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
            {/* Geography never mirrors, so the map ignores the page direction. Default overflow clips the
                countries that run past the viewBox (Russia, Kazakhstan) instead of painting them over the text. */}
            <svg aria-hidden viewBox={MAP_VIEWBOX} className="absolute inset-0 w-full h-full">
              {mapCountries.map((country) => {
                const slug = REGION_OF[country.code];
                if (!slug) {
                  return (
                    <path
                      key={country.code}
                      d={country.d}
                      fillRule="evenodd"
                      className="fill-primary-100 stroke-white"
                      strokeWidth={2}
                      strokeLinejoin="round"
                    />
                  );
                }
                const isSelected = selected === slug;
                const isHovered = hovered === slug;
                return (
                  <path
                    key={country.code}
                    d={country.d}
                    fillRule="evenodd"
                    onClick={() => toggle(slug)}
                    onMouseEnter={() => setHovered(slug)}
                    onMouseLeave={() => setHovered(null)}
                    className={clsx(
                      "cursor-pointer stroke-white transition-colors",
                      isSelected ? "fill-primary-800" : isHovered ? "fill-primary-500" : "fill-primary-600"
                    )}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                );
              })}
            </svg>

            {/* Pins are HTML so their labels set in the page font and stay readable. */}
            {regionsData.map((item) => {
              const pin = regionPins[item.slug];
              if (!pin) return null;
              const isSelected = selected === item.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => toggle(item.slug)}
                  onMouseEnter={() => setHovered(item.slug)}
                  onMouseLeave={() => setHovered(null)}
                  aria-pressed={isSelected}
                  className="group absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${(pin.x / MAP_WIDTH) * 100}%`, top: `${(pin.y / MAP_HEIGHT) * 100}%` }}
                >
                  <span
                    aria-hidden
                    className={clsx(
                      "block w-4 h-4 rounded-full border-[3px] shadow-md transition-colors",
                      isSelected
                        ? "bg-primary-700 border-white ring-2 ring-primary-700"
                        : "bg-white border-primary-700 group-hover:border-primary-500"
                    )}
                  />
                  <span
                    className={clsx(
                      "absolute top-1/2 -translate-y-1/2 start-full ms-2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-bold shadow-sm transition-colors",
                      isSelected ? "bg-primary-700 text-white" : "bg-white/95 text-slate-800 group-hover:text-primary-700"
                    )}
                  >
                    {item.name[language]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Keyboard and small-screen alternative to clicking the map. */}
          <ul className="flex flex-wrap justify-center gap-2">
            {regionsData.map((item) => {
              const isSelected = selected === item.slug;
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => toggle(item.slug)}
                    aria-pressed={isSelected}
                    className={clsx(
                      "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                      isSelected
                        ? "border-primary-700 bg-primary-700 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-primary-500 hover:text-primary-700"
                    )}
                  >
                    {item.name[language]}
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
