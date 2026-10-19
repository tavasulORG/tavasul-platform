"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { bankAccountsData } from "@/data/bankAccounts";
import { Building2, Copy, Check, ShieldCheck, Download, AlertCircle, FileCheck } from "lucide-react";

export default function BankAccountsPage() {
  const { language, t } = useLanguage();
  const copy = {
    ar: ["الحسابات البنكية الرسمية المعتمدة", "حسابات التبرع المصرفية", "يمكنكم التبرع مباشرة عبر الحوالات البنكية الداخلية (في تركيا) أو الدولية (سويفت SWIFT) للحسابات الرسمية لجمعية تواصل", "اسم المستفيد الرسمي لدى جميع البنوك", "ترخيص جمعية إنسانية غير ربحية رقم: 34-292-049 - إسطنبول", "تم نسخ الاسم!", "نسخ اسم الحساب", "رقم الآيبان (IBAN)", "رمز السويفت (SWIFT Code)", "حساب رسمي خاضع لإشراف هيئة الرقابة التركية", "ملاحظات هامة عند التحويل البنكي", "يرجى كتابة اسم المشروع أو الغاية في خانة البيان (Açıklama).", "لاستلام إيصال رسمي، أرسل صورة إشعار التحويل مع رقم هاتفك عبر الواتساب أو البريد الإلكتروني."],
    tr: ["Onaylı resmi banka hesapları", "Banka bağış hesapları", "Tawasul'un resmi hesaplarına Türkiye içi veya uluslararası SWIFT havalesiyle doğrudan bağış yapabilirsiniz", "Tüm bankalardaki resmi hesap sahibi", "Kâr amacı gütmeyen insani yardım derneği sicil no: 34-292-049 - İstanbul", "Hesap adı kopyalandı!", "Hesap adını kopyala", "IBAN", "SWIFT Kodu", "Türk denetim kurumlarının gözetimindeki resmi hesap", "Banka havalesi için önemli notlar", "Açıklama alanına proje adını veya bağış amacını yazınız.", "Resmi makbuz almak için transfer dekontunu telefon numaranızla WhatsApp veya e-posta üzerinden gönderin."],
    en: ["Approved official bank accounts", "Bank donation accounts", "Donate directly to Tawasul's official accounts through domestic transfers in Türkiye or international SWIFT transfers", "Official beneficiary name at all banks", "Non-profit humanitarian association registration No. 34-292-049 - Istanbul", "Account name copied!", "Copy account name", "IBAN", "SWIFT Code", "Official account supervised by Turkish regulatory authorities", "Important bank-transfer notes", "Include the project name or donation purpose in the transfer description.", "To receive an official receipt, send the transfer confirmation with your phone number by WhatsApp or email."],
  }[language];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Building2 className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {copy[1]}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
        </p>
      </section>

      {/* Official Legal Account Holder Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-start">
            <span className="text-xs text-primary-400 font-bold uppercase tracking-wider block">
              {copy[3]}
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-wide text-white">
              TAVASUL YARDIM VE KALKINMA DERNEĞİ
            </div>
            <p className="text-xs text-slate-400">
              {copy[4]}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy("holder", "TAVASUL YARDIM VE KALKINMA DERNEĞİ")}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition flex items-center gap-2 border border-slate-700"
            >
              {copiedId === "holder" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{copy[5]}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{copy[6]}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Accounts Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bankAccountsData.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm"
                      style={{ backgroundColor: acc.iconColor }}
                    >
                      {acc.bankName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{acc.bankName}</h3>
                      <span className="text-[11px] text-slate-400">{acc.branchName}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800">
                    {acc.currency}
                  </span>
                </div>

                {/* IBAN Box */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    {copy[7]}:
                  </span>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between font-mono text-xs sm:text-sm text-slate-800">
                    <span className="truncate">{acc.iban}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(acc.id, acc.iban)}
                      className="ms-2 p-1.5 rounded-lg bg-white shadow-sm border border-slate-200 text-primary-600 hover:text-primary-700 transition shrink-0"
                      title={t("copyIban")}
                    >
                      {copiedId === acc.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SWIFT Code */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span>{copy[8]}:</span>
                  <strong className="font-mono text-slate-900">{acc.swiftCode}</strong>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{copy[9]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Wire Instructions */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-sky-50 rounded-3xl p-6 sm:p-8 border border-sky-100 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900">{copy[10]}:</h4>
            <ul className="list-disc ps-5 space-y-1 text-slate-600 text-xs">
              <li>{copy[11]}</li>
              <li>{copy[12]}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

