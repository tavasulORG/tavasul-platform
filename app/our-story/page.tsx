"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { aboutData } from "@/data/about";
import { ShieldCheck, Heart, History, Users, Globe2, ArrowRight } from "lucide-react";

export default function OurStoryPage() {
  const { language, t } = useLanguage();
  const story = aboutData.ourStory[language] || aboutData.ourStory.ar;
  const copy = {
    ar: ["أكثر من 30 عاماً من العمل الإنساني", "عطاء متواصل يمتد عبر العقود لخدمة الإنسان وصون كرامته", "عاماً", "خبرة ميدانية تراكمية", "خبرة انطلقت من بيئات إنسانية شديدة الصعوبة وراكمت نجاحات موثوقة في إدارة المشاريع.", "تأسيس مقر إسطنبول", "جمعية تركية رسمية غير ربحية برقم ترخيص 34-292-049 لتوسيع الأثر دولياً.", "أقاليم", "انتشار إنساني واسع", "تدخلات منسقة في تركيا واليمن وسوريا وفلسطين وعدد من الدول الأفريقية.", "تعرف على رسالتنا ورؤيتنا المؤسسية"],
    tr: ["30 yılı aşkın insani yardım çalışması", "İnsanlığa hizmet etmek ve onurunu korumak için onlarca yıldır süren iyilik", "yıl", "Birikimli saha deneyimi", "Zorlu insani ortamlarda başlayan ve proje yönetiminde güvenilir başarılar biriktiren deneyim.", "İstanbul merkezinin kuruluşu", "Uluslararası etkiyi büyütmek üzere 34-292-049 sicil numarasıyla kurulan resmi Türk derneği.", "bölge", "Geniş insani erişim", "Türkiye, Yemen, Suriye, Filistin ve çeşitli Afrika ülkelerinde koordineli müdahaleler.", "Kurumsal misyon ve vizyonumuzu keşfedin"],
    en: ["Over 30 years of humanitarian work", "Decades of continuous giving in service of people and their dignity", "years", "Accumulated field experience", "Experience forged in demanding humanitarian settings with a trusted record in project management.", "Istanbul office established", "A formally registered Turkish non-profit under No. 34-292-049, created to expand global impact.", "regions", "Broad humanitarian reach", "Coordinated interventions across Türkiye, Yemen, Syria, Palestine, and several African countries.", "Discover our institutional mission and vision"],
  }[language];

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <History className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {story.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
          {story.lead}
        </p>
      </section>

      {/* Main Narrative with Image */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 space-y-8">
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
              alt="Our Story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs sm:text-sm font-semibold">
                {copy[1]}
              </span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-loose space-y-6">
            <p className="text-justify font-normal">
              {story.body}
            </p>
          </div>

          {/* Timeline Milestones */}
          <div className="pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
              <div className="text-2xl font-black text-primary-600">30+ {copy[2]}</div>
              <div className="font-bold text-slate-800 text-sm">{copy[3]}</div>
              <p className="text-xs text-slate-500">
                {copy[4]}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
              <div className="text-2xl font-black text-slate-900">2025</div>
              <div className="font-bold text-slate-800 text-sm">{copy[5]}</div>
              <p className="text-xs text-slate-500">
                {copy[6]}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
              <div className="text-2xl font-black text-emerald-600">5 {copy[7]}</div>
              <div className="font-bold text-slate-800 text-sm">{copy[8]}</div>
              <p className="text-xs text-slate-500">
                {copy[9]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition"
        >
          <span>{copy[10]}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </section>
    </div>
  );
}

