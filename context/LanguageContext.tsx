"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "@/types";
import { translations } from "@/data/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "rtl" | "ltr";
  t: (key: keyof typeof translations.ar) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("tawasul_lang") as Language;
    if (saved && (saved === "ar" || saved === "tr" || saved === "en")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("tawasul_lang", lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      const dict = translations[language] || translations.ar;
      document.title = dict.metaTitle;
      const description = document.querySelector('meta[name="description"]');
      if (description) {
        description.setAttribute("content", dict.metaDescription);
      }
    }
  }, [language]);

  const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr";

  const t = (key: keyof typeof translations.ar): string => {
    const dict = translations[language] || translations.ar;
    return (dict as Record<string, string>)[key] || (translations.ar as Record<string, string>)[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

