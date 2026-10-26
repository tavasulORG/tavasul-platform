"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Language } from "@/types";
import { translations as defaultTranslations } from "@/data/translations";
import { supabase } from "@/lib/supabase";
import { isPreviewWindow, usePreview } from "@/lib/previewBridge";

type Dictionary = Record<string, string>;
type Dictionaries = Record<Language, Dictionary>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "rtl" | "ltr";
  t: (key: keyof typeof defaultTranslations.ar) => string;
  isDbLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL: Dictionaries = {
  ar: defaultTranslations.ar,
  tr: defaultTranslations.tr,
  en: defaultTranslations.en,
};

function isLanguage(value: unknown): value is Language {
  return value === "ar" || value === "tr" || value === "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [chosenLanguage, setLanguageState] = useState<Language>("ar");
  const [translationsData, setTranslationsData] = useState<Dictionaries>(LOCAL);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const preview = usePreview();

  // Load translations from Supabase (the admin edits the "main" row).
  useEffect(() => {
    async function loadRemoteTranslations() {
      try {
        const { data, error } = await supabase.from("translations").select("ar, tr, en").eq("id", "main").single();
        if (data && !error) {
          setTranslationsData({
            ar: { ...LOCAL.ar, ...data.ar },
            tr: { ...LOCAL.tr, ...data.tr },
            en: { ...LOCAL.en, ...data.en },
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
    const saved = localStorage.getItem("tawasul_lang");
    if (isLanguage(saved)) setLanguageState(saved);
  }, []);

  // The admin's preview iframe switches language and injects the unsaved texts.
  const language: Language = preview.language ?? chosenLanguage;
  const dictionaries = useMemo<Dictionaries>(() => {
    const o = preview.overrides.translations;
    if (!o) return translationsData;
    return {
      ar: { ...translationsData.ar, ...(o.ar ?? {}) },
      tr: { ...translationsData.tr, ...(o.tr ?? {}) },
      en: { ...translationsData.en, ...(o.en ?? {}) },
    };
  }, [translationsData, preview.overrides.translations]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Inside the preview iframe the choice must not leak into the visitor's preference.
    if (!isPreviewWindow()) localStorage.setItem("tawasul_lang", lang);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    const dict = dictionaries[language] || dictionaries.ar;
    document.title = dict.metaTitle || LOCAL.ar.metaTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", dict.metaDescription || LOCAL.ar.metaDescription);
    }
  }, [language, dictionaries]);

  const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr";

  const t = useCallback(
    (key: keyof typeof defaultTranslations.ar): string => {
      const dict = dictionaries[language] || dictionaries.ar;
      return dict[key] || LOCAL.ar[key] || String(key);
    },
    [dictionaries, language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, dir, t, isDbLoaded }),
    [language, setLanguage, dir, t, isDbLoaded]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
