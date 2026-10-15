"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { bankAccountsData } from "@/data/bankAccounts";
import { Building2, Copy, Check, ShieldCheck, Download, AlertCircle, FileCheck } from "lucide-react";

export default function BankAccountsPage() {
  const { t } = useLanguage();
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
          <span>الحسابات البنكية الرسمية المعتمدة</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          حسابات التبرع المصرفية
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          يمكنكم التبرع مباشرة عبر الحوالات البنكية الداخلية (في تركيا) أو الدولية (سويفت SWIFT) للحسابات الرسمية لجمعية تواصل
        </p>
      </section>

      {/* Official Legal Account Holder Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-start">
            <span className="text-xs text-primary-400 font-bold uppercase tracking-wider block">
              اسم المستفيد الرسمي لدى جميع البنوك
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-wide text-white">
              TAVASUL YARDIM VE KALKINMA DERNEĞİ
            </div>
            <p className="text-xs text-slate-400">
              ترخيص جمعية إنسانية غير ربحية رقم: 34-292-049 - إسطنبول
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
                  <span>تم نسخ الاسم!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ اسم الحساب</span>
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
                    رقم الآيبان (IBAN):
                  </span>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between font-mono text-xs sm:text-sm text-slate-800">
                    <span className="truncate">{acc.iban}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(acc.id, acc.iban)}
                      className="ms-2 p-1.5 rounded-lg bg-white shadow-sm border border-slate-200 text-primary-600 hover:text-primary-700 transition shrink-0"
                      title="نسخ الآيبان"
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
                  <span>رمز السويفت (SWIFT Code):</span>
                  <strong className="font-mono text-slate-900">{acc.swiftCode}</strong>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>حساب رسمي خاضع لإشراف هيئة الرقابة التركية</span>
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
            <h4 className="font-bold text-slate-900">ملاحظات هامة عند التحويل البنكي:</h4>
            <ul className="list-disc ps-5 space-y-1 text-slate-600 text-xs">
              <li>يرجى كتابة اسم المشروع أو الغاية (مثال: &quot;إغاثة غزة&quot; أو &quot;سقيا ماء&quot;) في خانة البيان (Açıklama).</li>
              <li>إذا كنت ترغب باستلام إيصال تبرع إلكتروني رسمي، يرجى إرسال صورة إشعار التحويل مع رقم هاتفك عبر الواتساب أو البريد الإلكتروني.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

