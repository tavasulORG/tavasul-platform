"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { ShieldCheck, FileText, Download, CheckCircle2, Award, Users, ArrowRight } from "lucide-react";

export default function GovernancePage() {
  const { language, t } = useLanguage();

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
          <ShieldCheck className="w-4 h-4" />
          <span>شفافية مطلقة ومساءلة مؤسسية</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          الحوكمة، الشفافية، والامتثال
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          نلتزم بأعلى معايير النزاهة المؤسسية والرقابة المالية والتدقيق القانوني الرسمي المستمر
        </p>
      </section>

      {/* Official Legal Registry Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-sky-50 to-primary-50 rounded-3xl p-8 border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider block">
              بيانات القيد والتسجيل الرسمي
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              مديرية العلاقات مع منظمات المجتمع المدني - ولاية إسطنبول
            </h3>
            <p className="text-xs text-slate-600">
              رقم الترخيص القانوني: <strong className="text-primary-700 font-mono text-sm">34-292-049</strong> | مسجلة بموجب القوانين واللوائح التركية الناظمة للعمل الإنساني.
            </p>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white shadow-sm border border-sky-100 text-center shrink-0">
            <span className="text-[11px] text-slate-500 block">حالة التسجيل</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-center mt-0.5">
              <CheckCircle2 className="w-4 h-4" /> نشط ومعتمد رسمياً
            </span>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">مجلس الإدارة والقيادة</h2>
            <p className="text-xs text-slate-500">كفاءات متخصصة تدير الجمعية وفق أعلى مبادئ الحوكمة والنزاهة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aboutData.governance.boardOfDirectors.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm text-center space-y-2 hover:-translate-y-1 transition duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-primary-100 flex items-center justify-center text-primary-600 mx-auto font-black text-lg">
                {member.name.charAt(0)}
              </div>
              <h3 className="font-bold text-slate-900 text-sm pt-1">{member.name}</h3>
              <p className="text-xs text-primary-600 font-medium">
                {language === "tr" ? member.roleTr : language === "en" ? member.roleEn : member.roleAr}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Financial & Audit Reports */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">التقارير المالية والسنوية</h2>
            <p className="text-xs text-slate-500">تقارير مدققة من مكاتب محاسبة قانونية مستقلة ومعتمدة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aboutData.governance.reports.map((report, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {language === "tr" ? report.titleTr : language === "en" ? report.titleEn : report.titleAr}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    PDF • حجم الملف: {report.size} • عام {report.year}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert("سيتم بدء تنزيل ملف التقرير المالي المعتمد بصيغة PDF")}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-600 hover:text-primary-600 border border-slate-200 transition shrink-0"
                title="تنزيل التقرير"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Audit Commitments */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-4">
          <h3 className="text-xl font-bold">التزامنا تجاه المتبرعين والشركاء</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            تخضع جميع حسابات ومشاريع جمعية تواصل للإغاثة والتنمية لرقابة مالية داخلية صارمة وتدقيق خارجي من مراجعين قانونيين معتمدين في الجمهورية التركية. كما نلتزم بتزويد المانحين والشركاء بتقارير دورية مدعمة بالصور ومقاطع الفيديو والبيانات الإحصائية الدقيقة للمستفيدين.
          </p>
        </div>
      </section>
    </div>
  );
}

