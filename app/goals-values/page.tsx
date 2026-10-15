"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { Target, Heart, Users, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function GoalsValuesPage() {
  const { language } = useLanguage();

  return (
    <div className="py-12 sm:py-20 space-y-20">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Target className="w-4 h-4" />
          <span>منظومة العمل المؤسسي</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          أهدافنا وقيمنا والفئات المستهدفة
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          المعايير الراسخة التي تحكم أداءنا، وأولويات الفئات الإنسانية التي نسخر طاقاتنا لأجلها
        </p>
      </section>

      {/* Part 1: Our 5 Goals (أهدافنا الخمسة) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">أهداف الجمعية المؤسسية</h2>
            <p className="text-xs text-slate-500">الغايات الاستراتيجية الخمس المعتمدة في اللائحة التأسيسية</p>
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
              المعايير الأخلاقية والمهنية
            </span>
            <h2 className="text-3xl font-black">قيمنا الست الراسخة</h2>
            <p className="text-xs text-slate-400">
              نلتزم بهذه القيم في كل مشروع وتدخل ميداني وشراكة إنسانية نقيمها
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
                    قيمة مؤسسية
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
            <h2 className="text-2xl font-black text-slate-900">الفئات المستهدفة في برامجنا</h2>
            <p className="text-xs text-slate-500">الفئات التسع الأكثر استحقاقاً للدعم والتمكين الإنساني</p>
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
          <span>الاطلاع على الحوكمة والتقارير والشفافية</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </section>
    </div>
  );
}

