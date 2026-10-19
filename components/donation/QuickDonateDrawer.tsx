"use client";

import React, { useState, useEffect } from "react";
import { useDonation } from "@/context/DonationContext";
import { useLanguage } from "@/context/LanguageContext";
import { Currency } from "@/types";
import { bankAccountsData } from "@/data/bankAccounts";
import { 
  X, 
  CreditCard, 
  Building2, 
  Heart, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles, 
  Loader2 
} from "lucide-react";

export function QuickDonateDrawer() {
  const {
    isQuickDonateOpen,
    closeQuickDonate,
    selectedProjectId,
    defaultAmountUSD,
    projects,
    currency,
    setCurrency,
    currencySymbol,
    convertUSDToCurrency,
    convertCurrencyToUSD,
    submitDonation,
  } = useDonation();

  const { t, language } = useLanguage();

  // Tab: 'card' or 'bank'
  const [activeTab, setActiveTab] = useState<"card" | "bank">("card");
  // Frequency: 'once' or 'monthly'
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  
  // Amounts presets in USD
  const presetAmountsUSD = [10, 25, 50, 100, 250];
  const [selectedAmountUSD, setSelectedAmountUSD] = useState<number>(defaultAmountUSD || 50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Designation target
  const [targetProjectId, setTargetProjectId] = useState<string>(selectedProjectId || "");

  // Donor form
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [copiedIbanId, setCopiedIbanId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProjectId) {
      setTargetProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (defaultAmountUSD) {
      setSelectedAmountUSD(defaultAmountUSD);
      setIsCustom(false);
    }
  }, [defaultAmountUSD]);

  if (!isQuickDonateOpen) return null;

  // Calculate actual amount in current currency
  const currentAmountInCurrency = isCustom
    ? parseFloat(customAmount) || 0
    : convertUSDToCurrency(selectedAmountUSD);

  const handleCopyIban = (id: string, iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedIbanId(id);
    setTimeout(() => setCopiedIbanId(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmountInCurrency <= 0) return;

    setIsLoading(true);
    try {
      await submitDonation({
        donorName: donorName || t("anonymous"),
        donorEmail: donorEmail || "donor@tawasul-tr.org",
        donorPhone,
        isAnonymous,
        amount: currentAmountInCurrency,
        currency,
        projectId: targetProjectId || undefined,
        paymentMethod: activeTab === "card" ? "card" : "bank_transfer",
      });
      closeQuickDonate();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <Heart className="w-5 h-5 fill-primary-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t("quickDonateTitle")}</h2>
              <p className="text-xs text-slate-500">{t("turkishLicenseShort")}</p>
            </div>
          </div>
          <button
            onClick={closeQuickDonate}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-6 flex-1">
          {/* Currency Switcher */}
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-semibold text-slate-600 px-2">{t("donationCurrency")}:</span>
            <div className="flex gap-1">
              {(["USD", "TRY", "EUR", "SAR"] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currency === curr
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setFrequency("once")}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                frequency === "once" ? "bg-white text-primary-700 shadow-sm" : "text-slate-600"
              }`}
            >
              {t("oneTimeDonation")}
            </button>
            <button
              type="button"
              onClick={() => setFrequency("monthly")}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                frequency === "monthly" ? "bg-white text-primary-700 shadow-sm" : "text-slate-600"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t("monthlyDonation")}</span>
            </button>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">{t("selectAmount")}:</label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmountsUSD.map((amtUSD) => {
                const amtCurr = convertUSDToCurrency(amtUSD);
                const isSelected = !isCustom && selectedAmountUSD === amtUSD;
                return (
                  <button
                    key={amtUSD}
                    type="button"
                    onClick={() => {
                      setSelectedAmountUSD(amtUSD);
                      setIsCustom(false);
                      setCustomAmount("");
                    }}
                    className={`py-3 px-2 rounded-2xl border text-center transition font-bold ${
                      isSelected
                        ? "border-primary-600 bg-primary-50/70 text-primary-700 ring-2 ring-primary-500/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-base font-extrabold">{amtCurr.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{currencySymbol}</div>
                  </button>
                );
              })}

              {/* Custom Amount Button */}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`py-3 px-2 rounded-2xl border text-center transition font-bold ${
                  isCustom
                    ? "border-primary-600 bg-primary-50/70 text-primary-700 ring-2 ring-primary-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="text-sm">{t("customAmount")}</div>
                <div className="text-[11px] text-slate-500 font-normal">...</div>
              </button>
            </div>

            {/* Custom Input */}
            {isCustom && (
              <div className="pt-2">
                <div className="relative rounded-2xl shadow-sm">
                  <input
                    type="number"
                    min="1"
                    placeholder={t("enterAmount")}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full py-3 px-4 rounded-2xl border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-800 text-lg"
                    autoFocus
                  />
                  <span className="absolute inset-y-0 left-4 rtl:left-auto rtl:right-auto rtl:left-4 flex items-center text-sm font-bold text-primary-600">
                    {currencySymbol}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Donation Designation Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">{t("donationTarget")}:</label>
            <select
              value={targetProjectId}
              onChange={(e) => setTargetProjectId(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{t("generalRelief")}</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title[language] || proj.title.ar}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Tabs */}
          <div className="space-y-3 pt-1">
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("card")}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
                  activeTab === "card"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{t("creditCard")}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bank")}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
                  activeTab === "bank"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t("bankTransfer")}</span>
              </button>
            </div>

            {/* Credit Card Fields */}
            {activeTab === "card" && (
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {t("cardNumber")}
                  </label>
                  <input
                    type="text"
                    placeholder="4500 •••• •••• 1234"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t("expiryDate")}
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bank Accounts IBAN Info */}
            {activeTab === "bank" && (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {bankAccountsData
                  .filter((b) => b.currency === (currency === "SAR" ? "USD" : currency))
                  .slice(0, 2)
                  .map((acc) => (
                    <div
                      key={acc.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{acc.bankName}</span>
                        <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold text-primary-700">
                          {acc.currency}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{acc.accountHolder}</div>
                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 font-mono text-[11px]">
                        <span className="truncate">{acc.iban}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyIban(acc.id, acc.iban)}
                          className="shrink-0 ml-2 p-1 text-primary-600 hover:text-primary-700"
                        >
                          {copiedIbanId === acc.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                <p className="text-[11px] text-slate-500 text-center">
                  {t("bankTransferNote")}
                </p>
              </div>
            )}
          </div>

          {/* Donor Information */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">{t("donorDetails")}</label>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span>{t("anonymousDonation")}</span>
              </label>
            </div>

            {!isAnonymous && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={t("fullName")}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder={t("emailAddress")}
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder={t("phoneNumber")}
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t("dataSecurityNote")}</span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading || currentAmountInCurrency <= 0}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-600 to-sky-500 hover:from-primary-700 hover:to-sky-600 text-white font-bold text-sm shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" />
                <span>
                  {t("donateAmountPrefix")} {currentAmountInCurrency.toLocaleString()} {currencySymbol}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
