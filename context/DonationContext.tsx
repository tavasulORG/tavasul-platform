"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Currency, DonationRecord, Project } from "@/types";
import { initialProjects } from "@/data/projects";
import confetti from "canvas-confetti";

interface DonationContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  currencySymbol: string;
  exchangeRate: number; // to 1 USD
  formatAmount: (amountUSD: number) => string;
  convertUSDToCurrency: (amountUSD: number) => number;
  convertCurrencyToUSD: (amount: number) => number;
  
  // Quick Donate Drawer
  isQuickDonateOpen: boolean;
  openQuickDonate: (projectId?: string, defaultAmountUSD?: number) => void;
  closeQuickDonate: () => void;
  selectedProjectId: string | null;
  defaultAmountUSD: number;
  
  // Projects dynamic state
  projects: Project[];
  getProjectById: (id: string) => Project | undefined;
  getProjectBySlug: (slug: string) => Project | undefined;
  
  // Submit donation simulation
  submitDonation: (data: {
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    isAnonymous: boolean;
    amount: number;
    currency: Currency;
    projectId?: string;
    sectorSlug?: any;
    paymentMethod: "card" | "bank_transfer";
  }) => Promise<DonationRecord>;

  recentDonations: DonationRecord[];
  activeReceipt: DonationRecord | null;
  setActiveReceipt: (rec: DonationRecord | null) => void;
}

const RATES: Record<Currency, { rate: number; symbol: string }> = {
  USD: { rate: 1, symbol: "$" },
  TRY: { rate: 34.5, symbol: "₺" },
  EUR: { rate: 0.92, symbol: "€" },
  SAR: { rate: 3.75, symbol: "ر.س" },
};

const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: "don-1",
    receiptNumber: "TAW-2026-9041",
    donorName: "فاعل خير",
    donorEmail: "donor1@example.com",
    isAnonymous: true,
    amount: 150,
    currency: "USD",
    amountUSD: 150,
    projectId: "proj-1",
    projectTitle: "إطعام وتدفئة العائلات في قطاع غزة",
    paymentMethod: "card",
    status: "success",
    timestamp: "منذ 3 دقائق",
  },
  {
    id: "don-2",
    receiptNumber: "TAW-2026-9040",
    donorName: "أحمد سليم - إسطنبول",
    donorEmail: "ahmed@example.com",
    isAnonymous: false,
    amount: 2500,
    currency: "TRY",
    amountUSD: 72.4,
    projectId: "proj-2",
    projectTitle: "سقيا الأمل: حفر الآبار في اليمن",
    paymentMethod: "card",
    status: "success",
    timestamp: "منذ 11 دقيقة",
  },
  {
    id: "don-3",
    receiptNumber: "TAW-2026-9039",
    donorName: "أم عبد الله",
    donorEmail: "donor3@example.com",
    isAnonymous: false,
    amount: 1000,
    currency: "SAR",
    amountUSD: 266.6,
    projectId: "proj-3",
    projectTitle: "قرية تواصل السكنية للنازحين",
    paymentMethod: "card",
    status: "success",
    timestamp: "منذ 25 دقيقة",
  },
  {
    id: "don-4",
    receiptNumber: "TAW-2026-9038",
    donorName: "فاعل خير",
    donorEmail: "donor4@example.com",
    isAnonymous: true,
    amount: 50,
    currency: "EUR",
    amountUSD: 54.3,
    projectId: "proj-4",
    projectTitle: "كفالة أيتام الزلزال",
    paymentMethod: "card",
    status: "success",
    timestamp: "منذ 42 دقيقة",
  },
];

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [isQuickDonateOpen, setIsQuickDonateOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [defaultAmountUSD, setDefaultAmountUSD] = useState(50);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [recentDonations, setRecentDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [activeReceipt, setActiveReceipt] = useState<DonationRecord | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tawasul_currency") as Currency;
    if (saved && RATES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("tawasul_currency", c);
  };

  const currencySymbol = RATES[currency].symbol;
  const exchangeRate = RATES[currency].rate;

  const convertUSDToCurrency = (amountUSD: number): number => {
    return Math.round(amountUSD * exchangeRate);
  };

  const convertCurrencyToUSD = (amount: number): number => {
    return amount / exchangeRate;
  };

  const formatAmount = (amountUSD: number): string => {
    const converted = convertUSDToCurrency(amountUSD);
    return `${converted.toLocaleString()} ${currencySymbol}`;
  };

  const openQuickDonate = (projectId?: string, amountUSD?: number) => {
    if (projectId) setSelectedProjectId(projectId);
    else setSelectedProjectId(null);

    if (amountUSD) setDefaultAmountUSD(amountUSD);
    setIsQuickDonateOpen(true);
  };

  const closeQuickDonate = () => {
    setIsQuickDonateOpen(false);
  };

  const getProjectById = (id: string) => projects.find((p) => p.id === id);
  const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

  const submitDonation = async (data: {
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    isAnonymous: boolean;
    amount: number;
    currency: Currency;
    projectId?: string;
    sectorSlug?: any;
    paymentMethod: "card" | "bank_transfer";
  }): Promise<DonationRecord> => {
    const amountInUSD = data.amount / RATES[data.currency].rate;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const receiptNum = `TAW-${new Date().getFullYear()}-${randomSuffix}`;

    const matchedProject = projects.find((p) => p.id === data.projectId);

    const newRecord: DonationRecord = {
      id: `don-${Date.now()}`,
      receiptNumber: receiptNum,
      donorName: data.isAnonymous ? "فاعل خير" : data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,
      isAnonymous: data.isAnonymous,
      amount: data.amount,
      currency: data.currency,
      amountUSD: amountInUSD,
      projectId: data.projectId,
      projectTitle: matchedProject ? matchedProject.title.ar : "صندوق التبرع العام",
      sectorSlug: data.sectorSlug,
      paymentMethod: data.paymentMethod,
      status: "success",
      timestamp: "الآن",
    };

    // Update Project metrics live
    if (data.projectId) {
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id === data.projectId) {
            return {
              ...proj,
              raisedAmount: Math.min(proj.goalAmount, proj.raisedAmount + Math.round(amountInUSD)),
              donorsCount: proj.donorsCount + 1,
            };
          }
          return proj;
        })
      );
    }

    setRecentDonations((prev) => [newRecord, ...prev.slice(0, 9)]);
    setActiveReceipt(newRecord);

    // Fire festive celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#00A3E0", "#10b981", "#f59e0b", "#38bdf8"],
      });
    } catch {
      // Ignore if unavailable
    }

    return newRecord;
  };

  return (
    <DonationContext.Provider
      value={{
        currency,
        setCurrency,
        currencySymbol,
        exchangeRate,
        formatAmount,
        convertUSDToCurrency,
        convertCurrencyToUSD,
        isQuickDonateOpen,
        openQuickDonate,
        closeQuickDonate,
        selectedProjectId,
        defaultAmountUSD,
        projects,
        getProjectById,
        getProjectBySlug,
        submitDonation,
        recentDonations,
        activeReceipt,
        setActiveReceipt,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
}

