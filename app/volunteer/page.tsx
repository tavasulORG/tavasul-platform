"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Users, Heart, Sparkles, CheckCircle2, Send } from "lucide-react";

export default function VolunteerPage() {
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const copy = {
    ar: ["شبكة سفراء الخير", "كن شريكاً في صناعة الأثر: انضم كمتطوع أو سفير", "طاقاتكم وخبراتكم هي المحرك الحقيقي لعملنا الميداني. تطوع معنا وساهم في نشر رسالة الأمل والعطاء", "شكراً لرغبتك الكريمة في التطوع!", "تم استلام طلبك وسيتواصل معك منسق العمل التطوعي لمناقشة مجالات المشاركة المناسبة.", "استمارة الانضمام التطوعي", "الاسم الكامل", "اسمك الكامل", "البريد الإلكتروني", "رقم الهاتف / الواتساب", "بلد الإقامة الحالي", "تركيا / أوروبا / الخليج...", "مجال التطوع المفضل", "التطوع الميداني والإغاثي", "صناعة المحتوى والتصوير والإعلام", "الترجمة واللغات", "التصميم الجرافيكي والبرمجة", "حملات التبرع وجمع التبرعات", "نبذة عن خبراتك ومهاراتك", "كيف تحب أن تشارك معنا؟", "إرسال طلب الانضمام"],
    tr: ["İyilik elçileri ağı", "Etkinin ortağı olun: gönüllü veya elçi olarak katılın", "Enerjiniz ve uzmanlığınız saha çalışmalarımızın gerçek gücüdür. Umut ve dayanışma mesajını yaymak için bize katılın", "Gönüllü olma isteğiniz için teşekkür ederiz!", "Başvurunuz alındı. Gönüllü koordinatörümüz uygun katılım alanlarını görüşmek için sizinle iletişime geçecektir.", "Gönüllü başvuru formu", "Ad soyad", "Adınız ve soyadınız", "E-posta", "Telefon / WhatsApp", "İkamet edilen ülke", "Türkiye / Avrupa / Körfez...", "Tercih edilen gönüllülük alanı", "Saha ve insani yardım", "İçerik, fotoğraf ve medya", "Çeviri ve diller", "Grafik tasarım ve yazılım", "Bağış kampanyaları ve kaynak geliştirme", "Deneyim ve becerileriniz", "Bizimle nasıl katkı sunmak istersiniz?", "Başvuruyu gönder"],
    en: ["Goodwill ambassadors network", "Help create lasting impact: join as a volunteer or ambassador", "Your energy and expertise power our fieldwork. Volunteer with us and help spread hope and generosity", "Thank you for your interest in volunteering!", "Your application has been received. Our volunteer coordinator will contact you to discuss suitable opportunities.", "Volunteer application", "Full name", "Your full name", "Email", "Phone / WhatsApp", "Current country of residence", "Türkiye / Europe / Gulf...", "Preferred volunteer field", "Field and relief work", "Content, photography, and media", "Translation and languages", "Graphic design and development", "Fundraising campaigns", "Your experience and skills", "How would you like to contribute?", "Submit application"],
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
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
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
              <h3 className="text-xl font-bold text-slate-900">{copy[3]}</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {copy[4]}
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
                {copy[5]}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{copy[6]} *</label>
                  <input
                    type="text"
                    required
                    placeholder={copy[7]}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{copy[8]} *</label>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">{copy[9]} *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+90 ..."
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{copy[10]} *</label>
                  <input
                    type="text"
                    required
                    placeholder={copy[11]}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{copy[12]} *</label>
                <select className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none bg-slate-50">
                  <option>{copy[13]}</option>
                  <option>{copy[14]}</option>
                  <option>{copy[15]}</option>
                  <option>{copy[16]}</option>
                  <option>{copy[17]}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{copy[18]}</label>
                <textarea
                  rows={3}
                  placeholder={copy[19]}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{copy[20]}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

