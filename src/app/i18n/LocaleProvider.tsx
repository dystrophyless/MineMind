import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getInitialLocale } from "../preferences/initialPreferences.mjs";
import { localeLabels, translations, type Locale, type TranslationKey } from "./translations";

const STORAGE_KEY = "minemind.locale";

type LocaleContextValue = {
  locale: Locale;
  localeLabels: Record<Locale, string>;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  return getInitialLocale({
    storedLocale: window.localStorage.getItem(STORAGE_KEY),
    browserLanguage: window.navigator.language,
  }) as Locale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    localeLabels,
    setLocale,
    t: (key) => translations[locale][key] ?? translations.en[key] ?? key,
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

export function useT() {
  return useLocale().t;
}
