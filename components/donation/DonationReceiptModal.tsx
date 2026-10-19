"use client";

import React from "react";
import { useDonation } from "@/context/DonationContext";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2, Download, Printer, X, ShieldCheck } from "lucide-react";

export function DonationReceiptModal() {
  const { activeReceipt, setActiveReceipt } = useDonation();
  const { t, language } = useLanguage();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-sky-400 p-6 text-white text-center relative">
          <button
            onClick={() => setActiveReceipt(null)}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold">{t("donationSuccessTitle")}</h3>
          <p className="text-xs text-white/90 mt-1 max-w-sm mx-auto">{t("donationSuccessDesc")}</p>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 space-y-5 bg-white">
          {/* Logo & Official Meta */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs text-slate-500 font-medium">TAVASUL DERNEĞİ</div>
              <div className="text-sm font-bold text-slate-800">{t("brandName")}</div>
              <div className="text-[11px] text-primary-600 font-semibold">{t("turkishLicenseShort")}</div>
            </div>
            <div className="text-end">
              <span className="text-[11px] text-slate-400 block">{t("receiptNumber")}</span>
              <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                {activeReceipt.receiptNumber}
              </span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-sky-50 rounded-2xl p-4 text-center border border-sky-100">
            <span className="text-xs text-slate-500 font-medium block mb-1">{t("receiptAmount")}</span>
            <div className="text-3xl font-extrabold text-primary-600">
              {activeReceipt.amount.toLocaleString()} {activeReceipt.currency}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {t("approximateUsd")} ~ ${Math.round(activeReceipt.amountUSD)} USD
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">{t("donorNameLabel")}:</span>
              <span className="font-semibold text-slate-800">{activeReceipt.donorName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">{t("purposeLabel")}:</span>
              <span className="font-semibold text-slate-800 max-w-[240px] truncate text-end">
                {activeReceipt.projectTitle || t("generalDonationFund")}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">{t("paymentMethodLabel")}:</span>
              <span className="font-semibold text-slate-800">
                {activeReceipt.paymentMethod === "card" ? t("electronicCard") : t("directBankTransfer")}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">{t("depositDate")}:</span>
              <span className="font-semibold text-slate-800">
                {new Date().toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Security Seal */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{t("verifiedReceiptNote")}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{t("printReceipt")}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 text-xs font-bold transition border border-primary-200"
            >
              <Download className="w-4 h-4" />
              <span>{t("downloadReceipt")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

