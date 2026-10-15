"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { ShieldCheck, Award, Target, Compass, CheckCircle2, FileText, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { language } = useLanguage();
  const whoWeAre = aboutData.whoWeAre[language] || aboutData.whoWeAre.ar;

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <ShieldCheck className="w-4 h-4" />
          <span>الترخيص الرسمي: 34-292-049 (إسطنبول)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {whoWeAre.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          جمعية تواصل للإغاثة والتنمية (TAVASUL YARDIM VE KALKINMA DERNEĞİ)
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
              <h3 className="font-bold text-slate-900 text-sm">الهوية القانونية المعتمدة</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                جمعية إنسانية تركية غير ربحية مرخصة بموجب القانون التركي من قِبل مديرية العلاقات مع منظمات المجتمع المدني في ولاية إسطنبول تحت رقم القيد الرسمي: <strong className="text-primary-600 font-mono">34-292-049</strong>.
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
              <h4 className="font-bold text-slate-900 text-sm">التدخل الإنساني المزدوج</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                الجمع بين الاستجابة الإغاثية الطارئة لإنقاذ الأرواح، والبرامج التنموية المستدامة التي تحفظ الكرامة وتبني الاكتفاء الذاتي.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">الحوكمة والامتثال الرشيد</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                تطبيق أعلى معايير الشفافية المالية والإدارية والرقابة الداخلية والتدقيق الخارجي المنتظم تحت إشراف الجهات الرسمية.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">شراكات دولية فاعلة</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                التعاون الوثيق مع وكالات الأمم المتحدة، والمنظمات الإنسانية الدولية والتركية لتعظيم العائد الميداني من كل تبرع.
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
          الرؤية والرسالة
        </Link>
        <Link
          href="/goals-values"
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          الأهداف والقيم المؤسسية
        </Link>
        <Link
          href="/governance"
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          الحوكمة والتقارير المالية
        </Link>
      </section>
    </div>
  );
}

