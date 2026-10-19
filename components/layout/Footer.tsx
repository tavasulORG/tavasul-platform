"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { sectorsData } from "@/data/sectors";
import { regionsData } from "@/data/regions";
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Heart,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-850">
      {/* Top Banner / Registration Badge */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                {t("footerLegalTitle")}
              </div>
              <div className="text-[11px] text-slate-400">
                {t("footerLegalDescription")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/governance"
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700 flex items-center gap-1.5"
            >
              <span>{t("governanceReports")}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Column 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.jpg"
              alt="Tawasul"
              className="h-10 w-auto object-contain rounded-lg bg-white p-1"
            />
            <div>
              <div className="text-white font-bold text-base">{t("brandName")}</div>
              <div className="text-[10px] text-primary-400 font-semibold tracking-wider">
                TAVASUL YARDIM VE KALKINMA DERNEĞİ
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-md">
            {t("footerAbout")}
          </p>

          <div className="space-y-2 pt-2 text-[11px]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary-400 shrink-0" />
              <span>{t("address")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary-400 shrink-0" />
              <span dir="ltr">+90 534 000 0000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary-400 shrink-0" />
              <span>info@tawasul-tr.org</span>
            </div>
          </div>
        </div>

        {/* Column 2: Sectors */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide">
            {t("navSectors")}
          </h4>
          <ul className="space-y-2">
            {sectorsData.map((sec) => (
              <li key={sec.id}>
                <Link
                  href={`/sectors/${sec.slug}`}
                  className="hover:text-primary-400 transition block truncate"
                >
                  {sec.title[language] || sec.title.ar}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Where We Work */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide">
            {t("navWhereWeWork")}
          </h4>
          <ul className="space-y-2">
            {regionsData.map((reg) => (
              <li key={reg.id}>
                <Link
                  href={`/where-we-work/${reg.slug}`}
                  className="hover:text-primary-400 transition flex items-center gap-1.5"
                >
                  <span>{reg.flag}</span>
                  <span>{reg.name[language] || reg.name.ar}</span>
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/projects"
                className="text-primary-400 hover:text-primary-300 font-bold block"
              >
                {t("allHumanitarianProjects")} →
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Quick Navigation & Transparency */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide">
            {t("importantLinks")}
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/our-story" className="hover:text-primary-400 transition">
                {t("navStory")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary-400 transition">
                {t("navWhoWeAre")}
              </Link>
            </li>
            <li>
              <Link href="/governance" className="hover:text-primary-400 transition">
                {t("navGovernance")}
              </Link>
            </li>
            <li>
              <Link href="/partners" className="hover:text-primary-400 transition">
                {t("navPartners")}
              </Link>
            </li>
            <li>
              <Link href="/bank-accounts" className="hover:text-primary-400 transition">
                {t("navBanks")}
              </Link>
            </li>
            <li>
              <Link href="/volunteer" className="hover:text-primary-400 transition">
                {t("navVolunteer")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary-400 transition">
                {t("navContact")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-8 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{t("allRightsReserved")}</p>
          <div className="flex items-center gap-4">
            <Link href="/governance" className="hover:text-slate-400 transition">
              {t("privacyPolicy")}
            </Link>
            <span>•</span>
            <Link href="/governance" className="hover:text-slate-400 transition">
              {t("termsConditions")}
            </Link>
            <span>•</span>
            <Link href="/bank-accounts" className="hover:text-slate-400 transition">
              {t("approvedDonationAccounts")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

