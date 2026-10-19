"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import {
  Heart,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Share2,
  Flame,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function SingleProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, t } = useLanguage();
  const {
    getProjectBySlug,
    formatAmount,
    openQuickDonate,
    currency,
    setCurrency,
    currencySymbol,
    convertUSDToCurrency,
  } = useDonation();
  const copy = {
    ar: ["تم نسخ رابط المشروع بنجاح لمشاركته!", "مشاركة المشروع", "الفئات المستهدفة", "تفاصيل وسياق المشروع", "سجل التحديثات الميدانية", "توثيق مستمر لفرقنا في الميدان", "تم تحصيله", "متبرع", "المستفيدون المستهدفون", "إنسان", "اختر قيمة مساهمتك", "دفع آمن 100% وإيصال إلكتروني فوري", "جميع التبرعات موجهة حصراً للمشروع المحدد تحت إشراف رسمي."],
    tr: ["Proje bağlantısı paylaşım için kopyalandı!", "Projeyi paylaş", "Hedef gruplar", "Projenin ayrıntıları ve bağlamı", "Saha güncellemeleri", "Saha ekiplerimizden sürekli belgeleme", "toplandı", "bağışçı", "Hedeflenen faydalanıcılar", "kişi", "Katkı tutarınızı seçin", "%100 güvenli ödeme ve anında elektronik makbuz", "Tüm bağışlar resmi gözetim altında yalnızca seçilen projeye yönlendirilir."],
    en: ["Project link copied for sharing!", "Share project", "Target groups", "Project details and context", "Field updates", "Ongoing documentation from our field teams", "raised", "donors", "Target beneficiaries", "people", "Choose your contribution", "100% secure payment with an instant digital receipt", "All donations are allocated exclusively to the selected project under official supervision."],
  }[language];

  const project = getProjectBySlug(slug);
  if (!project) {
    return notFound();
  }

  const [donationInput, setDonationInput] = useState<number>(50);

  const title = project.title[language] || project.title.ar;
  const summary = project.summary[language] || project.summary.ar;
  const description = project.description[language] || project.description.ar;
  const country = project.countryName[language] || project.countryName.ar;

  const percent = Math.min(100, Math.round((project.raisedAmount / project.goalAmount) * 100));

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert(copy[0]);
    }
  };

  return (
    <div className="py-10 space-y-12 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 text-xs font-semibold text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-primary-600">{t("navHome")}</Link>
        <span>/</span>
        <Link href="/projects" className="hover:text-primary-600">{t("navProjects")}</Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-sm">{title}</span>
      </div>

      {/* Main Hero Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Visuals & Story */}
          <div className="lg:col-span-8 space-y-8">
            {/* Project Cover & Badges */}
            <div className="relative h-80 sm:h-[440px] rounded-3xl overflow-hidden shadow-md bg-slate-100">
              <img
                src={project.coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute top-4 start-4 flex items-center gap-2">
                {project.status === "urgent" && (
                  <span className="flex items-center gap-1 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md animate-pulse">
                    <Flame className="w-4 h-4" />
                    <span>{t("urgentBadge")}</span>
                  </span>
                )}
                {project.status === "completed" && (
                  <span className="flex items-center gap-1 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t("completedBadge")}</span>
                  </span>
                )}
              </div>

              <div className="absolute bottom-5 start-5 end-5 flex items-end justify-between text-white">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs">
                  <MapPin className="w-4 h-4 text-sky-300" />
                  <span>{country}</span>
                </div>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition"
                  title={copy[1]}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Key Meta */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                {title}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                {summary}
              </p>

              {/* Target Groups Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-400">{copy[2]}:</span>
                {project.targetGroups.map((g, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700"
                  >
                    {g[language] || g.ar}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">{copy[3]}</h2>
              <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-loose text-justify space-y-4">
                <p>{description}</p>
              </div>
            </div>

            {/* Field Updates Timeline (Molham Style UX) */}
            {project.updates && project.updates.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-bold text-slate-900">{copy[4]}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {copy[5]}
                  </span>
                </div>

                <div className="space-y-6 relative border-s-2 border-primary-100 ms-3 ps-6">
                  {project.updates.map((update, idx) => (
                    <div key={idx} className="relative space-y-2">
                      <span className="absolute -start-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary-600 ring-4 ring-primary-100" />
                      <div className="flex items-center gap-2 text-xs font-bold text-primary-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{update.date}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {update.title[language] || update.title.ar}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {update.text[language] || update.text.ar}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Donation Card & Progress (Sticky Box) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-100 space-y-6">
              {/* Financial Progress */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">{t("raised")}</span>
                    <strong className="text-2xl font-black text-primary-600">
                      {formatAmount(project.raisedAmount)}
                    </strong>
                  </div>
                  <div className="text-end">
                    <span className="text-xs text-slate-400 font-semibold block">{t("goal")}</span>
                    <span className="text-sm font-bold text-slate-700">
                      {formatAmount(project.goalAmount)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-sky-400 rounded-full transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-semibold">
                  <span className="text-slate-800">{percent}% {copy[6]}</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.donorsCount} {copy[7]}</span>
                  </span>
                </div>
              </div>

              {/* Beneficiaries Count Card */}
              <div className="bg-sky-50 rounded-2xl p-4 flex items-center justify-between border border-sky-100 text-xs">
                <span className="font-semibold text-slate-700">{copy[8]}:</span>
                <strong className="text-primary-700 font-black text-sm">
                  +{project.beneficiariesCount.toLocaleString()} {copy[9]}
                </strong>
              </div>

              {/* Fast Donation Amount Selection */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{copy[10]}:</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    {(["USD", "TRY", "EUR", "SAR"] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`px-1.5 py-0.5 rounded transition ${
                          currency === curr ? "bg-primary-600 text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((amt) => {
                    const conv = convertUSDToCurrency(amt);
                    const isSelected = donationInput === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonationInput(amt)}
                        className={`py-2 px-1 rounded-xl border text-center transition font-bold text-xs ${
                          isSelected
                            ? "border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div>{conv}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{currencySymbol}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Primary CTA Button */}
                <button
                  onClick={() => openQuickDonate(project.id, donationInput)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-600 to-sky-500 hover:from-primary-700 hover:to-sky-600 text-white font-black text-sm shadow-xl shadow-primary-500/30 flex items-center justify-center gap-2 transition"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>
                    {t("donateAmountPrefix")} {convertUSDToCurrency(donationInput).toLocaleString()} {currencySymbol}
                  </span>
                </button>
              </div>

              {/* Official Assurance */}
              <div className="text-[11px] text-slate-500 text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{copy[11]}</span>
                </div>
                <p>{copy[12]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

