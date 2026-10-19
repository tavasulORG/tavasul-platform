"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { Eye, Send, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function VisionMissionPage() {
  const { language, t } = useLanguage();
  const vision = aboutData.vision[language] || aboutData.vision.ar;
  const mission = aboutData.mission[language] || aboutData.mission.ar;
  const copy = {
    ar: ["البوصلة الاستراتيجية لجمعية تواصل", "رؤيتنا ورسالتنا", "المبادئ التوجيهية والغايات الكبرى التي تقود كافة تدخلاتنا ومشاريعنا الإنسانية", "رؤيتنا الاستراتيجية", "رسالتنا الإنسانية", "مرتكزات تحقيق الرؤية والرسالة", "السرعة في الاستجابة الطارئة", "الاستدامة في التمكين التنموي", "الشفافية والحوكمة الصارمة", "استعرض أهدافنا وقيمنا الست المؤسسية"],
    tr: ["Tawasul'un stratejik pusulası", "Vizyonumuz ve misyonumuz", "Tüm insani müdahale ve projelerimize yön veren ilkeler ve temel amaçlar", "Stratejik vizyonumuz", "İnsani misyonumuz", "Vizyon ve misyonun dayanakları", "Acil durumlarda hızlı müdahale", "Kalkınma ve güçlenmede sürdürülebilirlik", "Şeffaflık ve güçlü yönetişim", "Kurumsal hedef ve değerlerimizi inceleyin"],
    en: ["Tawasul's strategic compass", "Our vision and mission", "The guiding principles and major goals behind every humanitarian intervention and project", "Our strategic vision", "Our humanitarian mission", "Foundations of our vision and mission", "Speed in emergency response", "Sustainability in development and empowerment", "Transparency and rigorous governance", "Explore our institutional goals and core values"],
  }[language];

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Sparkles className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {copy[1]}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
        </p>
      </section>

      {/* Vision & Mission Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vision Card */}
        <div className="bg-gradient-to-br from-primary-600 to-sky-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Eye className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-sky-200 block">
              {copy[3]}
            </span>
            <blockquote className="text-xl sm:text-2xl font-black leading-snug">
              &quot;{vision}&quot;
            </blockquote>
          </div>

          <p className="text-xs text-sky-100 leading-relaxed pt-4 border-t border-white/20 relative z-10">
            {vision}
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white text-slate-800 rounded-3xl p-8 sm:p-10 shadow-md border border-slate-100 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
              <Send className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block">
              {copy[4]}
            </span>
            <blockquote className="text-xl sm:text-2xl font-black leading-snug text-slate-900">
              &quot;{mission}&quot;
            </blockquote>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
            {mission}
          </p>
        </div>
      </section>

      {/* Strategic Focus Points */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base text-center">
            {copy[5]}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{copy[6]}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{copy[7]}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{copy[8]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Link */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <Link
          href="/goals-values"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition"
        >
          <span>{copy[9]}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </section>
    </div>
  );
}

