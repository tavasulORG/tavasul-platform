"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Users, Heart, Sparkles, CheckCircle2, Send } from "lucide-react";

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Sparkles className="w-4 h-4" />
          <span>شبكة سفراء الخير</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          كن شريكاً في صناعة الأثر: انضم كمتطوع أو سفير
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          طاقاتكم وخبراتكم هي المحرك الحقيقي لعملنا الميداني. تطوع معنا وساهم في نشر رسالة الأمل والعطاء
        </p>
      </section>

      {/* Volunteer Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">شكراً لرغبتك الكريمة في التطوع!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                تم استلام طلبك وسيتواصل معك منسق العمل التطوعي في الجمعية لمناقشة مجالات المشاركة المناسبة.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                استمارة الانضمام التطوعي
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="اسمك الكامل"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف / الواتساب *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+90 ..."
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">بلد الإقامة الحالي *</label>
                  <input
                    type="text"
                    required
                    placeholder="تركيا / أوروبا / الخليج..."
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">مجال التطوع المفضل *</label>
                <select className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none bg-slate-50">
                  <option>التطوع الميداني والإغاثي</option>
                  <option>صناعة المحتوى والتصوير والإعلام</option>
                  <option>الترجمة واللغات (عربي / تركي / إنجليزي)</option>
                  <option>التصميم الجرافيكي والبرمجة</option>
                  <option>حملات التبرع وجمع التبرعات (سفير خير)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">نبذة عن خبراتك ومهاراتك</label>
                <textarea
                  rows={3}
                  placeholder="كيف تحب أن تشارك معنا؟"
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>إرسال طلب الانضمام</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

