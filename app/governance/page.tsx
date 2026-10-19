"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { ShieldCheck, FileText, Download, CheckCircle2, Award, Users, ArrowRight } from "lucide-react";

export default function GovernancePage() {
  const { language, t } = useLanguage();
  const copy = {
    ar: ["شفافية مطلقة ومساءلة مؤسسية", "الحوكمة، الشفافية، والامتثال", "نلتزم بأعلى معايير النزاهة والرقابة المالية والتدقيق القانوني المستمر", "بيانات القيد والتسجيل الرسمي", "مديرية العلاقات مع منظمات المجتمع المدني - ولاية إسطنبول", "رقم الترخيص القانوني: 34-292-049 | مسجلة بموجب القوانين التركية.", "حالة التسجيل", "نشط ومعتمد رسمياً", "مجلس الإدارة والقيادة", "كفاءات متخصصة تدير الجمعية وفق أعلى مبادئ الحوكمة والنزاهة", "التقارير المالية والسنوية", "تقارير مدققة من مكاتب محاسبة قانونية مستقلة", "حجم الملف", "عام", "سيتم بدء تنزيل التقرير المالي المعتمد بصيغة PDF", "تنزيل التقرير", "التزامنا تجاه المتبرعين والشركاء", "تخضع حسابات ومشاريع تواصل لرقابة مالية داخلية وتدقيق خارجي، ونلتزم بتزويد المانحين والشركاء بتقارير دورية موثقة."],
    tr: ["Tam şeffaflık ve kurumsal hesap verebilirlik", "Yönetişim, şeffaflık ve uyum", "En yüksek kurumsal dürüstlük, mali gözetim ve sürekli yasal denetim standartlarına bağlıyız", "Resmi kayıt bilgileri", "İstanbul İl Sivil Toplumla İlişkiler Müdürlüğü", "Yasal sicil no: 34-292-049 | Türk mevzuatına göre kayıtlıdır.", "Kayıt durumu", "Aktif ve resmi olarak onaylı", "Yönetim kurulu ve liderlik", "Derneği en yüksek yönetişim ve dürüstlük ilkeleriyle yöneten uzman kadro", "Mali ve yıllık raporlar", "Bağımsız yetkili mali müşavirlerce denetlenmiş raporlar", "Dosya boyutu", "Yıl", "Onaylı mali rapor PDF olarak indirilecek", "Raporu indir", "Bağışçı ve ortaklarımıza taahhüdümüz", "Tawasul'un tüm hesap ve projeleri iç ve dış denetime tabidir; bağışçı ve ortaklarımıza düzenli, belgeli raporlar sunarız."],
    en: ["Full transparency and institutional accountability", "Governance, transparency, and compliance", "We uphold the highest standards of institutional integrity, financial oversight, and continuous legal audit", "Official registration details", "Istanbul Provincial Directorate of Civil Society Relations", "Legal registration No. 34-292-049 | Registered under Turkish law.", "Registration status", "Active and officially accredited", "Board and leadership", "Specialists managing the association under the highest standards of governance and integrity", "Financial and annual reports", "Reports audited by independent licensed accountants", "File size", "Year", "The approved financial report will download as a PDF", "Download report", "Our commitment to donors and partners", "All Tawasul accounts and projects undergo internal control and external audit, with regular documented reports provided to donors and partners."],
  }[language];

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
          <ShieldCheck className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {copy[1]}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
        </p>
      </section>

      {/* Official Legal Registry Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-sky-50 to-primary-50 rounded-3xl p-8 border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider block">
              {copy[3]}
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              {copy[4]}
            </h3>
            <p className="text-xs text-slate-600">
              {copy[5]}
            </p>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white shadow-sm border border-sky-100 text-center shrink-0">
            <span className="text-[11px] text-slate-500 block">{copy[6]}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-center mt-0.5">
              <CheckCircle2 className="w-4 h-4" /> {copy[7]}
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
            <h2 className="text-2xl font-black text-slate-900">{copy[8]}</h2>
            <p className="text-xs text-slate-500">{copy[9]}</p>
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
            <h2 className="text-2xl font-black text-slate-900">{copy[10]}</h2>
            <p className="text-xs text-slate-500">{copy[11]}</p>
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
                    PDF • {copy[12]}: {report.size} • {copy[13]} {report.year}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert(copy[14])}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-600 hover:text-primary-600 border border-slate-200 transition shrink-0"
                title={copy[15]}
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
          <h3 className="text-xl font-bold">{copy[16]}</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {copy[17]}
          </p>
        </div>
      </section>
    </div>
  );
}

