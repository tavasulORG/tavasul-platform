"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { sectorsData } from "@/data/sectors";
import { regionsData } from "@/data/regions";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { bankAccountsData } from "@/data/bankAccounts";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Users,
  GraduationCap,
  HeartPulse,
  AlertTriangle,
  Droplets,
  Home as HomeIcon,
  Copy,
  Check,
  Flame,
  Globe2,
  Building,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { language, t } = useLanguage();
  const {
    openQuickDonate,
    projects,
    recentDonations,
    formatAmount,
    currency,
    setCurrency,
    currencySymbol,
    convertUSDToCurrency,
  } = useDonation();

  const [heroAmountUSD, setHeroAmountUSD] = useState(50);
  const [copiedIbanId, setCopiedIbanId] = useState<string | null>(null);

  const urgentProjects = projects.filter((p) => p.status === "urgent" || p.featured).slice(0, 3);

  const getSectorIcon = (slug: string) => {
    switch (slug) {
      case "education":
        return <GraduationCap className="w-6 h-6" />;
      case "health":
        return <HeartPulse className="w-6 h-6" />;
      case "emergency-relief":
        return <AlertTriangle className="w-6 h-6" />;
      case "economic-empowerment":
        return <TrendingUp className="w-6 h-6" />;
      case "child-women":
        return <Users className="w-6 h-6" />;
      case "wash":
        return <Droplets className="w-6 h-6" />;
      case "shelter":
        return <HomeIcon className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  const handleCopyIban = (id: string, iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedIbanId(id);
    setTimeout(() => setCopiedIbanId(null), 2000);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section With Integrated Quick Donate Box */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white overflow-hidden py-16 sm:py-24">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-sky-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-sky-200 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{t("experienceBadge")}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {t("heroTitle")}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {t("heroDescription")}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openQuickDonate()}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-sky-400 hover:from-primary-600 hover:to-sky-500 text-white font-extrabold text-sm shadow-xl shadow-primary-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{t("donateNow")}</span>
                </button>

                <Link
                  href="/projects"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition flex items-center gap-2"
                >
                  <span>{t("viewAllProjects")}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>

              {/* License Pill */}
              <div className="pt-4 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-primary-400 shrink-0" />
                <span>{t("licenseInfo")}</span>
              </div>
            </div>

            {/* Right Column: Hero Quick Donate Widget (Molham Team UX) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-800 border border-slate-100">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold">
                      <Sparkles className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{t("quickDonateTitle")}</h3>
                      <p className="text-[11px] text-slate-500">مباشرة عبر البطاقة أو الحساب البنكي</p>
                    </div>
                  </div>

                  {/* Currency Picker */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    {(["USD", "TRY", "EUR", "SAR"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`px-2 py-1 rounded-lg transition ${
                          currency === c ? "bg-white text-primary-600 shadow-sm" : "text-slate-600"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Amount Grid */}
                <div className="pt-4 space-y-3">
                  <span className="text-xs font-semibold text-slate-600 block">{t("selectAmount")}:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map((amt) => {
                      const converted = convertUSDToCurrency(amt);
                      const isSelected = heroAmountUSD === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setHeroAmountUSD(amt)}
                          className={`py-2.5 px-1 rounded-xl border text-center transition font-bold text-xs ${
                            isSelected
                              ? "border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div>{converted}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{currencySymbol}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Allocation Target Preview */}
                  <div className="pt-1">
                    <span className="text-xs font-semibold text-slate-600 block mb-1">{t("donationTarget")}:</span>
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 text-xs font-medium text-slate-700 flex items-center justify-between">
                      <span>إغاثة عاجلة - فلسطين وغزة</span>
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                        أولوية قصوى
                      </span>
                    </div>
                  </div>

                  {/* Trigger Main Quick Donate Modal */}
                  <button
                    onClick={() => openQuickDonate("proj-1", heroAmountUSD)}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-xs shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>
                      تبرع الآن بمبلغ {convertUSDToCurrency(heroAmountUSD).toLocaleString()} {currencySymbol}
                    </span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center pt-1">
                    إيصال رسمي فوري معتمد برقم مرجعي وتأكيد فوري للعملية
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Donations Ticker (Molham Style Feed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t("liveDonations")}</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto w-full py-1 text-xs text-slate-600 scrollbar-none">
            {recentDonations.slice(0, 4).map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0"
              >
                <span className="font-bold text-slate-800">{d.donorName}</span>
                <span className="text-slate-400">تبرع بـ</span>
                <span className="font-extrabold text-primary-600">
                  {d.amount.toLocaleString()} {d.currency}
                </span>
                <span className="text-[10px] text-slate-400">({d.timestamp})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Proven Impact Stats Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-primary-600">+310,000</div>
            <div className="text-xs text-slate-600 font-semibold">{t("heroStat1Label")}</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">+120</div>
            <div className="text-xs text-slate-600 font-semibold">{t("heroStat2Label")}</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">5</div>
            <div className="text-xs text-slate-600 font-semibold">{t("heroStat3Label")}</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">+30</div>
            <div className="text-xs text-slate-600 font-semibold">{t("heroStat4Label")}</div>
          </div>
        </div>
      </section>

      {/* 4. Urgent Projects Requiring Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>استجابة ميدانية عاجلة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t("urgentProjectsTitle")}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              {t("urgentProjectsSubtitle")}
            </p>
          </div>

          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition"
          >
            <span>{t("viewAllProjects")}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {urgentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 5. The Seven Core Sectors (مجالات العمل السبعة) */}
      <section className="bg-slate-100/70 py-16 sm:py-24 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t("sectorsTitle")}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t("sectorsSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sectorsData.map((sec, idx) => (
              <Link
                key={sec.id}
                href={`/sectors/${sec.slug}`}
                className={`group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                  idx === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 group-hover:bg-primary-600 group-hover:text-white text-primary-600 flex items-center justify-center transition-colors">
                    {getSectorIcon(sec.slug)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition">
                      {sec.title[language] || sec.title.ar}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                      {sec.subtitle[language] || sec.subtitle.ar}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between text-xs font-semibold text-primary-600 border-t border-slate-100 mt-4">
                  <span>استكشف المشاريع</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Where We Work (أين نعمل في الميدان) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t("regionsTitle")}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("regionsSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {regionsData.map((reg) => (
            <Link
              key={reg.id}
              href={`/where-we-work/${reg.slug}`}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src={reg.coverImage}
                alt={reg.name.ar}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white space-y-1">
                <span className="text-2xl">{reg.flag}</span>
                <h3 className="font-bold text-base group-hover:text-primary-300 transition">
                  {reg.name[language] || reg.name.ar}
                </h3>
                <span className="text-[11px] text-slate-300">
                  +{reg.beneficiariesCount.toLocaleString()} مستفيد
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Official Bank Accounts Box (IBAN with Copy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-primary-400 text-xs font-bold block mb-1">
                التبرع المالي المباشر
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                الحسابات البنكية الرسمية المعتمدة
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                اسم الحساب الرسمي: <strong className="text-white">TAVASUL YARDIM VE KALKINMA DERNEĞİ</strong>
              </p>
            </div>

            <Link
              href="/bank-accounts"
              className="py-2.5 px-5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>عرض جميع الحسابات الدولية</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bankAccountsData.slice(0, 3).map((acc) => (
              <div
                key={acc.id}
                className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{acc.bankName}</span>
                  <span className="text-[10px] bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full font-bold">
                    {acc.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 font-mono text-[11px]">
                  <span className="truncate text-slate-200">{acc.iban}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyIban(acc.id, acc.iban)}
                    className="shrink-0 ms-2 p-1 text-primary-400 hover:text-white transition"
                    title="نسخ الآيبان"
                  >
                    {copiedIbanId === acc.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Governance & Transparency Assurance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-sky-50 rounded-3xl p-8 sm:p-12 border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary-700 bg-white px-3 py-1 rounded-full shadow-sm">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span>رخصة رسمية معتمدة رقم 34-292-049</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t("transparencyTitle")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              {t("transparencySubtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/governance"
              className="py-3 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition text-center"
            >
              الاطلاع على تقارير التدقيق المالي
            </Link>
            <Link
              href="/partners"
              className="py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition text-center"
            >
              شركاؤنا الدوليون والمحليون
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

