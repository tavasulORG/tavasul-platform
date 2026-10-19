"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { Handshake, Building2, Globe2, ShieldCheck, ArrowRight, Mail } from "lucide-react";

export default function PartnersPage() {
  const { language } = useLanguage();
  const copy = {
    ar: ["التحالفات والعمل الإنساني المشترك", "الشركاء الممولون والتنفيذيون", "نؤمن بأن الشراكة الاستراتيجية هي السبيل الأنجع لتعظيم الأثر الميداني وإيصال الغوث للمحتاجين بكفاءة عالية", "الشركاء الممولون والمانحون الدوليون", "هيئات وصناديق دولية وإقليمية تدعم برامجنا ومشاريعنا", "الشركاء التنفيذيون في الميدان", "جمعيات ومؤسسات ذات خبرة ميدانية في مناطق النزاع والكوارث", "هل ترغب ببناء شراكة إنسانية مع تواصل؟", "نرحب بالتعاون مع المنظمات والجهات المانحة لتدشين مشاريع مشتركة ذات أثر مستدام.", "تواصل مع قسم الشراكات والعلاقات الدولية"],
    tr: ["İttifaklar ve ortak insani yardım", "Fon sağlayan ve uygulayıcı ortaklar", "Stratejik ortaklığın saha etkisini büyütmenin ve yardımı verimli ulaştırmanın en etkili yolu olduğuna inanıyoruz", "Uluslararası fon ve bağış ortakları", "Program ve projelerimizi destekleyen uluslararası ve bölgesel kuruluşlar", "Sahadaki uygulayıcı ortaklar", "Çatışma ve afet bölgelerinde saha deneyimine sahip kuruluşlar", "Tawasul ile insani bir ortaklık kurmak ister misiniz?", "Kalıcı etki yaratan ortak projeler için kuruluşlar ve bağışçılarla iş birliğine açığız.", "Ortaklıklar ve uluslararası ilişkiler ekibiyle iletişime geçin"],
    en: ["Alliances and joint humanitarian action", "Funding and implementation partners", "We believe strategic partnerships are the most effective way to maximize field impact and deliver aid efficiently", "International funding partners", "International and regional bodies supporting our programs and projects", "Field implementation partners", "Organizations with deep field experience in conflict and disaster zones", "Interested in building a humanitarian partnership with Tawasul?", "We welcome collaboration with organizations and donors to launch joint projects with sustainable impact.", "Contact partnerships and international relations"],
  }[language];

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Handshake className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {copy[1]}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
        </p>
      </section>

      {/* Funding Partners */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{copy[3]}</h2>
            <p className="text-xs text-slate-500">{copy[4]}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aboutData.partners.funding.map((partner, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2 hover:border-primary-200 hover:-translate-y-1 transition duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-primary-600 flex items-center justify-center font-bold">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{partner.name}</h3>
              <span className="text-[11px] font-semibold text-slate-400 block">{partner.type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Implementing Partners */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{copy[5]}</h2>
            <p className="text-xs text-slate-500">{copy[6]}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {aboutData.partners.implementing.map((partner, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2 hover:border-primary-200 hover:-translate-y-1 transition duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{partner.name}</h3>
              <span className="text-[11px] font-semibold text-slate-400 block">{partner.type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-primary-600 to-sky-600 text-white rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-4">
          <h3 className="text-2xl font-extrabold">{copy[7]}</h3>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto leading-relaxed">
            {copy[8]}
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-primary-700 hover:bg-slate-50 font-bold text-xs shadow-md transition"
            >
              <Mail className="w-4 h-4" />
              <span>{copy[9]}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

