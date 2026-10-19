"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { ShieldCheck, Award, Target, Compass, CheckCircle2, FileText, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { language, t } = useLanguage();
  const whoWeAre = aboutData.whoWeAre[language] || aboutData.whoWeAre.ar;
  const copy = {
    ar: ["الترخيص الرسمي: 34-292-049 (إسطنبول)", "الهوية القانونية المعتمدة", "جمعية إنسانية تركية غير ربحية مرخصة رسمياً تحت رقم القيد 34-292-049.", "التدخل الإنساني المزدوج", "الجمع بين الاستجابة الإغاثية الطارئة والبرامج التنموية المستدامة التي تحفظ الكرامة وتبني الاكتفاء الذاتي.", "الحوكمة والامتثال الرشيد", "تطبيق أعلى معايير الشفافية المالية والإدارية والتدقيق الخارجي المنتظم.", "شراكات دولية فاعلة", "التعاون مع المنظمات الدولية والتركية لتعظيم الأثر الميداني من كل تبرع."],
    tr: ["Resmi sicil: 34-292-049 (İstanbul)", "Onaylı yasal kimlik", "34-292-049 sicil numarasıyla resmi olarak kayıtlı, kâr amacı gütmeyen insani yardım derneği.", "İkili insani müdahale", "Acil yardım ile insan onurunu koruyan ve öz yeterliliği geliştiren sürdürülebilir kalkınma programlarını birleştirmek.", "İyi yönetişim ve uyum", "En yüksek mali ve idari şeffaflık standartları ile düzenli dış denetim uygulamak.", "Etkili uluslararası ortaklıklar", "Her bağışın saha etkisini artırmak için uluslararası ve Türk kuruluşlarıyla iş birliği yapmak."],
    en: ["Official registration: 34-292-049 (Istanbul)", "Accredited legal identity", "An officially registered Turkish non-profit humanitarian association under registration No. 34-292-049.", "Dual humanitarian response", "Combining emergency relief with sustainable development programs that protect dignity and build self-reliance.", "Sound governance and compliance", "Applying the highest standards of financial and administrative transparency with regular external audits.", "Effective international partnerships", "Working with international and Turkish organizations to maximize the field impact of every donation."],
  }[language];

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <ShieldCheck className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {whoWeAre.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {t("brandName")} (TAVASUL YARDIM VE KALKINMA DERNEĞİ)
        </p>
      </section>

      {/* Main Official Description */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 space-y-8">
          <div className="bg-sky-50 rounded-2xl p-6 border border-sky-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">{copy[1]}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {copy[2]}
              </p>
            </div>
          </div>

          <div className="text-sm sm:text-base text-slate-700 leading-loose text-justify space-y-4">
            <p>{whoWeAre.content}</p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{copy[3]}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {copy[4]}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{copy[5]}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {copy[6]}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{copy[7]}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {copy[8]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Quick Links */}
      <section className="max-w-4xl mx-auto px-4 text-center flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/vision-mission"
          className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition"
        >
          {t("navVisionMission")}
        </Link>
        <Link
          href="/goals-values"
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          {t("navGoalsValues")}
        </Link>
        <Link
          href="/governance"
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          {t("navGovernance")}
        </Link>
      </section>
    </div>
  );
}

