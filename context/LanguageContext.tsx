"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "@/types";
import { translations as defaultTranslations } from "@/data/translations";
import { supabase } from "@/lib/supabase";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "rtl" | "ltr";
  t: (key: keyof typeof defaultTranslations.ar) => string;
  isDbLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");
  const [translationsData, setTranslationsData] = useState(defaultTranslations);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  // Load translations from Supabase
  useEffect(() => {
    async function loadRemoteTranslations() {
      try {
        const { data, error } = await supabase
          .from("translations")
          .select("ar, tr, en")
          .eq("id", "main")
          .single();

        if (data && !error) {
          setTranslationsData({
            ar: { ...defaultTranslations.ar, ...data.ar },
            tr: { ...defaultTranslations.tr, ...data.tr },
            en: { ...defaultTranslations.en, ...data.en },
          });
          setIsDbLoaded(true);
        }
      } catch (err) {
        // Fallback silently to local translations
        console.warn("Using local translations fallback:", err);
      }
    }

    loadRemoteTranslations();
  }, []);

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
      const dict = translationsData[language] || translationsData.ar;
      document.title = dict.metaTitle || defaultTranslations.ar.metaTitle;
      const description = document.querySelector('meta[name="description"]');
      if (description) {
        description.setAttribute("content", dict.metaDescription || defaultTranslations.ar.metaDescription);
      }
    }
  }, [language, translationsData]);

  const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr";

  const t = (key: keyof typeof defaultTranslations.ar): string => {
    const dict = translationsData[language] || translationsData.ar;
    return (dict as Record<string, string>)[key] || (defaultTranslations.ar as Record<string, string>)[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t, isDbLoaded }}>
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

