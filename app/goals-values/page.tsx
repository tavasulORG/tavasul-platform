"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { Target, Heart, Users, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function GoalsValuesPage() {
  const { language } = useLanguage();
  const copy = {
    ar: ["منظومة العمل المؤسسي", "أهدافنا وقيمنا والفئات المستهدفة", "المعايير الراسخة التي تحكم أداءنا وأولويات الفئات التي نسخر طاقاتنا لأجلها", "أهداف الجمعية المؤسسية", "الغايات الاستراتيجية الخمس المعتمدة", "المعايير الأخلاقية والمهنية", "قيمنا الست الراسخة", "نلتزم بهذه القيم في كل مشروع وتدخل وشراكة", "قيمة مؤسسية", "الفئات المستهدفة في برامجنا", "الفئات التسع الأكثر استحقاقاً للدعم والتمكين", "الاطلاع على الحوكمة والتقارير والشفافية"],
    tr: ["Kurumsal çalışma sistemi", "Hedeflerimiz, değerlerimiz ve hedef gruplarımız", "Çalışmalarımızı yöneten temel standartlar ve desteklediğimiz grupların öncelikleri", "Kurumsal hedeflerimiz", "Onaylı beş stratejik hedef", "Etik ve mesleki standartlar", "Altı temel değerimiz", "Her proje, müdahale ve ortaklıkta bu değerlere bağlı kalırız", "Kurumsal değer", "Programlarımızın hedef grupları", "Destek ve güçlenmeye en çok ihtiyaç duyan dokuz grup", "Yönetişim, raporlar ve şeffaflığı incele"],
    en: ["Our institutional framework", "Our goals, values, and target groups", "The enduring standards that guide our work and the priorities of the communities we serve", "Institutional goals", "Five approved strategic goals", "Ethical and professional standards", "Our six core values", "We uphold these values in every project, intervention, and partnership", "Institutional value", "Target groups in our programs", "Nine groups with the greatest need for support and empowerment", "View governance, reports, and transparency"],
  }[language];

  return (
    <div className="py-12 sm:py-20 space-y-20">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Target className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {copy[1]}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
        </p>
      </section>

      {/* Part 1: Our 5 Goals (أهدافنا الخمسة) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{copy[3]}</h2>
            <p className="text-xs text-slate-500">{copy[4]}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aboutData.goals.map((goal, idx) => (
            <div
              key={goal.id}
              className={`p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-start gap-4 ${
                idx === 4 ? "md:col-span-2" : ""
              }`}
            >
              <span className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 font-extrabold text-sm flex items-center justify-center shrink-0">
                0{idx + 1}
              </span>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed pt-1">
                {goal[language] || goal.ar}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Part 2: Our 6 Core Values (قيمنا الست) */}
      <section className="bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-primary-400 uppercase">
              {copy[5]}
            </span>
            <h2 className="text-3xl font-black">{copy[6]}</h2>
            <p className="text-xs text-slate-400">
              {copy[7]}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.values.map((val) => (
              <div
                key={val.id}
                className="bg-slate-850 p-6 rounded-3xl border border-slate-800 hover:border-primary-500/50 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-primary-400">{val.number}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
                    {copy[8]}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {val[language] || val.ar}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {val.desc[language] || val.desc.ar}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Part 3: The 9 Target Groups (الفئات المستهدفة التسع) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{copy[9]}</h2>
            <p className="text-xs text-slate-500">{copy[10]}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {aboutData.targetGroups.map((group) => (
            <div
              key={group.number}
              className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3 hover:border-primary-200 transition"
            >
              <div className="w-8 h-8 rounded-full bg-sky-50 text-primary-600 font-black text-xs flex items-center justify-center shrink-0">
                {group.number}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {group[language] || group.ar}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <Link
          href="/governance"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition"
        >
          <span>{copy[11]}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </section>
    </div>
  );
}

