"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { sectorsData } from "@/data/sectors";
import {
  GraduationCap,
  HeartPulse,
  AlertTriangle,
  TrendingUp,
  Users,
  Droplets,
  Home as HomeIcon,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function SectorsIndexPage() {
  const { language, t } = useLanguage();
  const copy = {
    ar: ["القطاعات الاستراتيجية السبعة", "مجالات عمل جمعية تواصل", "تدخلات متكاملة تصنع فارقاً جوهرياً، تبدأ من الإغاثة الفورية في أوقات الطوارئ، وتصل إلى التمكين المستدام صوناً لكرامة الإنسان", "المستفيدون", "المشاريع المنجزة", "استعرض صفحة القطاع والمشاريع التابعة"],
    tr: ["Yedi stratejik çalışma alanı", "Tawasul'un çalışma alanları", "Acil yardımdan insan onurunu koruyan sürdürülebilir güçlenmeye uzanan bütüncül müdahaleler", "Faydalanıcılar", "Tamamlanan projeler", "Alanı ve ilgili projeleri incele"],
    en: ["Seven strategic sectors", "Tawasul's areas of work", "Integrated interventions ranging from immediate emergency relief to sustainable empowerment that protects human dignity", "Beneficiaries", "Completed projects", "View this sector and its projects"],
  }[language];

  const getSectorIcon = (slug: string) => {
    switch (slug) {
      case "education":
        return <GraduationCap className="w-8 h-8" />;
      case "health":
        return <HeartPulse className="w-8 h-8" />;
      case "emergency-relief":
        return <AlertTriangle className="w-8 h-8" />;
      case "economic-empowerment":
        return <TrendingUp className="w-8 h-8" />;
      case "child-women":
        return <Users className="w-8 h-8" />;
      case "wash":
        return <Droplets className="w-8 h-8" />;
      case "shelter":
        return <HomeIcon className="w-8 h-8" />;
      default:
        return <Layers className="w-8 h-8" />;
    }
  };

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Layers className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {copy[1]}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
        </p>
      </section>

      {/* Sectors List Detailed Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sectorsData.map((sec) => (
            <div
              key={sec.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={sec.coverImage}
                    alt={sec.title.ar}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 start-4 flex items-center gap-2 text-white">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      {getSectorIcon(sec.slug)}
                    </div>
                    <span className="font-extrabold text-lg text-white">
                      {sec.title[language] || sec.title.ar}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs font-semibold text-primary-600">
                    {sec.subtitle[language] || sec.subtitle.ar}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {sec.description[language] || sec.description.ar}
                  </p>

                  <div className="pt-2 grid grid-cols-2 gap-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">{copy[3]}</span>
                      <strong className="text-slate-800 font-bold">
                        +{sec.stats.beneficiariesCount.toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{copy[4]}</span>
                      <strong className="text-emerald-600 font-bold">
                        {sec.stats.completedProjects} {t("project")}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/sectors/${sec.slug}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-bold text-xs transition border border-slate-200/80 flex items-center justify-center gap-2 text-center"
                >
                  <span>{copy[5]}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

