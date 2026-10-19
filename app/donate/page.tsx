"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { Currency } from "@/types";
import {
  Heart,
  ShieldCheck,
  CreditCard,
  Building2,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function DonatePage() {
  const { language, t } = useLanguage();
  const copy = {
    ar: ["بوابة العطاء الإلكتروني الموحدة", "التبرع الإلكتروني الآمن", "وجّه تبرعك لأحد برامجنا الحيوية بضغطة زر واحدة واحصل على إيصال رسمي معتمد", "1. العملة وتوجيه التبرع", "اختر الغاية أو المشروع", "صندوق الإغاثة العامة والطارئة (حيث تشتد الحاجة)", "2. تحديد مبلغ المساهمة", "العودة للخيارات المحددة", "إدخال مبلغ آخر مخصص...", "متابعة التبرع الآمن بمبلغ", "عملية مشفرة ببروتوكول SSL وإيصال فوري رسمي"],
    tr: ["Birleşik çevrimiçi bağış portalı", "Güvenli çevrimiçi bağış", "Bağışınızı tek tıkla programlarımızdan birine yönlendirin ve resmi makbuzunuzu alın", "1. Para birimi ve bağış amacı", "Amaç veya proje seçin", "Genel ve acil yardım fonu (en çok ihtiyaç duyulan alan)", "2. Katkı tutarını belirleyin", "Hazır seçeneklere dön", "Özel bir tutar girin...", "Güvenli bağışa devam et:", "SSL ile şifrelenmiş işlem ve anında resmi makbuz"],
    en: ["Unified online giving portal", "Secure online donation", "Direct your gift to one of our vital programs in one click and receive an official receipt", "1. Currency and donation designation", "Choose a purpose or project", "General and emergency relief fund (where most needed)", "2. Choose your contribution amount", "Return to preset amounts", "Enter a custom amount...", "Continue securely with", "SSL-encrypted transaction and instant official receipt"],
  }[language];
  const {
    openQuickDonate,
    currency,
    setCurrency,
    currencySymbol,
    convertUSDToCurrency,
    projects,
  } = useDonation();

  const [selectedFund, setSelectedFund] = useState<string>("");
  const [amountUSD, setAmountUSD] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  const finalAmount = isCustom ? parseFloat(customAmount) || 0 : convertUSDToCurrency(amountUSD);

  const handleProceed = () => {
    openQuickDonate(selectedFund || undefined, isCustom ? Math.round(finalAmount / 1) : amountUSD);
  };

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Heart className="w-4 h-4 fill-primary-600" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {copy[1]}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
        </p>
      </section>

      {/* Donation Box Container */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 space-y-8">
          {/* Step 1: Currency & Fund */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">{copy[3]}</span>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {(["USD", "TRY", "EUR", "SAR"] as Currency[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1 rounded-lg transition ${
                      currency === c ? "bg-primary-600 text-white shadow-sm" : "text-slate-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">{copy[4]}:</label>
              <select
                value={selectedFund}
                onChange={(e) => setSelectedFund(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-slate-50"
              >
                <option value="">{copy[5]}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title[language] || p.title.ar}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Amount */}
          <div className="space-y-4">
            <span className="text-sm font-bold text-slate-800 block pb-3 border-b border-slate-100">
              {copy[6]}
            </span>

            <div className="grid grid-cols-4 gap-3">
              {[10, 25, 50, 100].map((amt) => {
                const conv = convertUSDToCurrency(amt);
                const isSelected = !isCustom && amountUSD === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmountUSD(amt);
                      setIsCustom(false);
                      setCustomAmount("");
                    }}
                    className={`py-3 px-2 rounded-2xl border text-center transition font-black ${
                      isSelected
                        ? "border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-lg">{conv.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 font-normal">{currencySymbol}</div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className="text-xs font-bold text-primary-600 hover:underline"
              >
                {isCustom ? copy[7] : copy[8]}
              </button>

              {isCustom && (
                <div className="mt-2 relative">
                  <input
                    type="number"
                    min="1"
                    placeholder={t("enterAmount")}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full py-3 px-4 rounded-2xl border border-primary-300 font-black text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                  <span className="absolute inset-y-0 left-4 rtl:left-auto rtl:right-auto rtl:left-4 flex items-center font-bold text-primary-600 text-sm">
                    {currencySymbol}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Trigger Payment */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <button
              onClick={handleProceed}
              disabled={finalAmount <= 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-sky-500 hover:from-primary-700 hover:to-sky-600 text-white font-black text-base shadow-xl shadow-primary-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Lock className="w-5 h-5" />
              <span>
                {copy[9]} {finalAmount.toLocaleString()} {currencySymbol}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{copy[10]}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

