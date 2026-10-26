"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { useContent } from "@/context/ContentContext";
import { Language, Currency } from "@/types";
import { Heart, Globe, Menu, X, Phone, Coins, ShieldCheck } from "lucide-react";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, openQuickDonate } = useDonation();
  const { settings } = useContent();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /** Sectors, where-we-work and projects are single pages, so every item is a plain link. */
  const links = [
    { href: "/", label: t("navHome") },
    { href: "/about", label: t("navAbout") },
    { href: "/sectors", label: t("navSectors") },
    { href: "/where-we-work", label: t("navWhereWeWork") },
    { href: "/projects", label: t("navProjects") },
    { href: "/bank-accounts", label: t("navBanks") },
    { href: "/contact", label: t("navContact") },
  ];

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false);

  // The admin panel has its own shell.
  if (pathname?.startsWith("/admin")) return null;

  const phoneDigits = settings.phone.replace(/[^d+]/g, "");

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
            <span className="hidden sm:inline-block text-white/40">|</span>
            <a
              href={`tel:${phoneDigits}`}
              className="hidden sm:flex items-center gap-1 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-white/70" />
              <span dir="ltr">{settings.phone}</span>
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
                src={settings.logo}
                alt="Tawasul Logo"
                className="h-10 w-[138px] sm:h-12 sm:w-auto sm:max-w-[210px] object-contain"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-bold text-slate-700">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className={`px-3 py-2 rounded-lg transition ${
                  isCurrent(link.href)
                    ? "text-primary-600 bg-primary-50"
                    : "hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
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
              aria-expanded={isMobileMenuOpen}
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
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className={`block py-2 px-3 rounded-xl ${
                  isCurrent(link.href) ? "bg-primary-50 text-primary-600" : "hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
