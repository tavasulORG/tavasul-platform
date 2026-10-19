"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const { language, t } = useLanguage();
  const copy = {
    ar: ["نسعد دائماً بالتواصل معكم", "تواصل مع جمعية تواصل", "فريقنا في إسطنبول جاهز للإجابة على استفساراتكم المتعلقة بالمشاريع، التبرعات، أو الشراكات الإنسانية", "المقر الرئيسي", "إسطنبول - تركيا", "جمعية تواصل للإغاثة والتنمية (ترخيص: 34-292-049)", "العنوان", "الهاتف / الواتساب", "البريد الإلكتروني", "أوقات العمل الرسمية", "الإثنين - الجمعة: 09:00 صباحاً - 05:30 مساءً", "خدمة عملاء المتبرعين متاحة على مدار الساعة عبر الواتساب للاستجابة السريعة.", "تم إرسال رسالتك بنجاح!", "شكراً لتواصلك معنا. سيقوم فريق جمعية تواصل بمراجعة رسالتك والرد عليك في أقرب وقت.", "إرسال رسالة أخرى", "أرسل لنا استفسارك", "يرجى تعبئة النموذج أدناه وسيقوم القسم المختص بالرد عليك", "الاسم الكامل", "أدخل اسمك", "البريد الإلكتروني", "رقم الهاتف / الواتساب", "الموضوع", "استفسار عن تبرع / مشروع...", "نص الرسالة", "اكتب رسالتك بالتفصيل هنا...", "إرسال الرسالة الآن"],
    tr: ["Sizinle iletişim kurmaktan memnuniyet duyarız", "Tawasul ile iletişime geçin", "İstanbul ekibimiz projeler, bağışlar ve insani ortaklıklarla ilgili sorularınızı yanıtlamaya hazırdır", "Genel merkez", "İstanbul - Türkiye", "Tawasul Yardım ve Kalkınma Derneği (Sicil: 34-292-049)", "Adres", "Telefon / WhatsApp", "E-posta", "Çalışma saatleri", "Pazartesi - Cuma: 09:00 - 17:30", "Bağışçı destek ekibimiz hızlı yanıt için WhatsApp üzerinden günün her saati hizmetinizdedir.", "Mesajınız başarıyla gönderildi!", "Bize ulaştığınız için teşekkür ederiz. Tawasul ekibi mesajınızı inceleyip en kısa sürede yanıtlayacaktır.", "Başka bir mesaj gönder", "Sorunuzu bize iletin", "Aşağıdaki formu doldurun; ilgili ekibimiz size yanıt versin", "Ad soyad", "Adınızı girin", "E-posta", "Telefon / WhatsApp", "Konu", "Bağış / proje hakkında soru...", "Mesaj", "Mesajınızı ayrıntılı olarak yazın...", "Mesajı şimdi gönder"],
    en: ["We are always happy to hear from you", "Contact Tawasul", "Our Istanbul team is ready to answer questions about projects, donations, and humanitarian partnerships", "Head office", "Istanbul, Türkiye", "Tawasul Relief & Development Association (Registration: 34-292-049)", "Address", "Phone / WhatsApp", "Email", "Office hours", "Monday–Friday: 9:00 AM–5:30 PM", "Donor support is available around the clock on WhatsApp for a prompt response.", "Your message was sent successfully!", "Thank you for contacting us. The Tawasul team will review your message and reply as soon as possible.", "Send another message", "Send us your inquiry", "Complete the form below and the relevant team will respond", "Full name", "Enter your name", "Email", "Phone / WhatsApp", "Subject", "Question about a donation / project...", "Message", "Write your message in detail...", "Send message now"],
  }[language];
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <MessageSquare className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {copy[1]}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
        </p>
      </section>

      {/* Main Contact Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs text-primary-400 font-bold uppercase tracking-wider block">
                  {copy[3]}
                </span>
                <h3 className="text-2xl font-bold">{copy[4]}</h3>
                <p className="text-xs text-slate-400">
                  {copy[5]}
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-primary-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">{copy[6]}:</strong>
                    <span>İstanbul, Fatih / Başakşehir, Türkiye</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-primary-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">{copy[7]}:</strong>
                    <span dir="ltr">+90 534 000 0000</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-primary-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">{copy[8]}:</strong>
                    <span>info@tawasul-tr.org</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-primary-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">{copy[9]}:</strong>
                    <span>{copy[10]}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400">
              {copy[11]}
            </div>
          </div>

          {/* Interactive Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">{copy[12]}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {copy[13]}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
                >
                  {copy[14]}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">{copy[15]}</h3>
                <p className="text-xs text-slate-500 pb-2">
                  {copy[16]}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">{copy[17]} *</label>
                    <input
                      type="text"
                      required
                      placeholder={copy[18]}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">{copy[19]} *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">{copy[20]}</label>
                    <input
                      type="tel"
                      placeholder="+90 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">{copy[21]}</label>
                    <input
                      type="text"
                      placeholder={copy[22]}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{copy[23]} *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder={copy[24]}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{copy[25]}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

