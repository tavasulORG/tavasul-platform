"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { Language, Currency } from "@/types";
import { sectorsData } from "@/data/sectors";
import { regionsData } from "@/data/regions";
import {
  Heart,
  Globe,
  ChevronDown,
  Menu,
  X,
  Phone,
  Coins,
  ShieldCheck,
  Building,
} from "lucide-react";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, openQuickDonate } = useDonation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md shadow-slate-200/70">
      {/* Top Utility Bar */}
      <div className="h-11 bg-gradient-to-l from-primary-700 to-primary-500 text-white text-xs px-4 sm:px-8">
        <div className="max-w-7xl h-full mx-auto flex items-center justify-center md:justify-between">
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t("licenseShort")}</span>
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <a
              href="tel:+905340000000"
              className="hidden sm:flex items-center gap-1 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-white/70" />
              <span dir="ltr">+90 534 000 0000</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
              <Coins className="w-3 h-3 text-amber-400" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="USD" className="bg-primary-700 text-white">USD ($)</option>
                <option value="TRY" className="bg-primary-700 text-white">TRY (₺)</option>
                <option value="EUR" className="bg-primary-700 text-white">EUR (€)</option>
                <option value="SAR" className="bg-primary-700 text-white">SAR (ر.س)</option>
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
              <Globe className="w-3 h-3 text-white/80" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="ar" className="bg-primary-700 text-white">العربية</option>
                <option value="tr" className="bg-primary-700 text-white">Türkçe</option>
                <option value="en" className="bg-primary-700 text-white">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl h-[72px] mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="h-8 flex shrink-0 items-center pe-3 sm:pe-5 border-e border-slate-200">
            <Link href="/" className="flex items-center group">
              <img
                src="/images/logo.jpg"
                alt="Tawasul Logo"
                className="h-10 w-[138px] sm:h-12 sm:w-auto sm:max-w-[210px] object-contain"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-bold text-slate-700">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition"
          >
            {t("navHome")}
          </Link>

          {/* About Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("about")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition">
              <span>{t("navAbout")}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === "about" && (
              <div className="absolute top-full start-0 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fadeIn z-50">
                <Link
                  href="/our-story"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                >
                  {t("navStory")}
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                >
                  {t("navWhoWeAre")}
                </Link>
                <Link
                  href="/vision-mission"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                >
                  {t("navVisionMission")}
                </Link>
                <Link
                  href="/goals-values"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                >
                  {t("navGoalsValues")}
                </Link>
                <Link
                  href="/governance"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                >
                  {t("navGovernance")}
                </Link>
                <Link
                  href="/partners"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                >
                  {t("navPartners")}
                </Link>
              </div>
            )}
          </div>

          {/* Sectors Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("sectors")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition">
              <span>{t("navSectors")}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === "sectors" && (
              <div className="absolute top-full start-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fadeIn z-50">
                <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("approvedSectors")}
                </div>
                {sectorsData.map((sec) => (
                  <Link
                    key={sec.id}
                    href={`/sectors/${sec.slug}`}
                    className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition truncate text-xs"
                  >
                    {sec.title[language] || sec.title.ar}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Where We Work Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("regions")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition">
              <span>{t("navWhereWeWork")}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === "regions" && (
              <div className="absolute top-full start-0 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fadeIn z-50">
                <Link
                  href="/where-we-work"
                  className="block px-4 py-2 font-bold text-primary-600 hover:bg-primary-50 transition"
                >
                  {t("mapOverview")}
                </Link>
                <div className="h-px bg-slate-100 my-1" />
                {regionsData.map((reg) => (
                  <Link
                    key={reg.id}
                    href={`/where-we-work/${reg.slug}`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                  >
                    <span>{reg.flag}</span>
                    <span>{reg.name[language] || reg.name.ar}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Projects Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("projects")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition">
              <span>{t("navProjects")}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === "projects" && (
              <div className="absolute top-full start-0 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fadeIn z-50">
                <Link
                  href="/projects"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                >
                  {t("navAllProjects")}
                </Link>
                <Link
                  href="/projects/active"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                >
                  {t("navActiveProjects")}
                </Link>
                <Link
                  href="/projects/completed"
                  className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-600 transition"
                >
                  {t("navCompletedProjects")}
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/bank-accounts"
            className="px-3 py-2 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition"
          >
            {t("navBanks")}
          </Link>

          <Link
            href="/contact"
            className="px-3 py-2 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition"
          >
            {t("navContact")}
          </Link>

          </nav>

          {/* CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 ps-3 sm:ps-5 border-s border-slate-200">
          <button
            onClick={() => openQuickDonate()}
            className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-primary-500/25 transition"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>{t("donateNow")}</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 p-5 space-y-4 max-h-[80vh] overflow-y-auto animate-fadeIn">
          <div className="space-y-1 text-sm font-bold text-slate-800">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-xl hover:bg-slate-50"
            >
              {t("navHome")}
            </Link>

            {/* About Submenu */}
            <div className="py-2">
              <button
                onClick={() => toggleDropdown("m-about")}
                className="flex items-center justify-between w-full px-3 py-1 text-slate-700"
              >
                <span>{t("navAbout")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "m-about" && (
                <div className="ps-4 pt-2 space-y-1 text-xs text-slate-600">
                  <Link href="/our-story" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    {t("navStory")}
                  </Link>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    {t("navWhoWeAre")}
                  </Link>
                  <Link href="/vision-mission" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    {t("navVisionMission")}
                  </Link>
                  <Link href="/goals-values" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    {t("navGoalsValues")}
                  </Link>
                  <Link href="/governance" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    {t("navGovernance")}
                  </Link>
                  <Link href="/partners" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    {t("navPartners")}
                  </Link>
                </div>
              )}
            </div>

            {/* Sectors Submenu */}
            <div className="py-2">
              <button
                onClick={() => toggleDropdown("m-sectors")}
                className="flex items-center justify-between w-full px-3 py-1 text-slate-700"
              >
                <span>{t("navSectors")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "m-sectors" && (
                <div className="ps-4 pt-2 space-y-1 text-xs text-slate-600">
                  {sectorsData.map((sec) => (
                    <Link
                      key={sec.id}
                      href={`/sectors/${sec.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1"
                    >
                      {sec.title[language] || sec.title.ar}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Where We Work Submenu */}
            <div className="py-2">
              <button
                onClick={() => toggleDropdown("m-regions")}
                className="flex items-center justify-between w-full px-3 py-1 text-slate-700"
              >
                <span>{t("navWhereWeWork")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "m-regions" && (
                <div className="ps-4 pt-2 space-y-1 text-xs text-slate-600">
                  <Link href="/where-we-work" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 font-bold text-primary-600">
                    {t("mapOverview")}
                  </Link>
                  {regionsData.map((reg) => (
                    <Link
                      key={reg.id}
                      href={`/where-we-work/${reg.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1"
                    >
                      {reg.flag} {reg.name[language] || reg.name.ar}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Projects Submenu */}
            <div className="py-2">
              <button
                onClick={() => toggleDropdown("m-projects")}
                className="flex items-center justify-between w-full px-3 py-1 text-slate-700"
              >
                <span>{t("navProjects")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "m-projects" && (
                <div className="ps-4 pt-2 space-y-1 text-xs text-slate-600">
                  <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    {t("navAllProjects")}
                  </Link>
                  <Link href="/projects/active" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    {t("navActiveProjects")}
                  </Link>
                  <Link href="/projects/completed" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    {t("navCompletedProjects")}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/bank-accounts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-xl hover:bg-slate-50"
            >
              {t("navBanks")}
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-xl hover:bg-slate-50"
            >
              {t("navContact")}
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}

