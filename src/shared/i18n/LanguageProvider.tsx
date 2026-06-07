import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./languageContext";
import { AR_TRANSLATIONS, type Language } from "./translations";

const STORAGE_KEY = "patria-language";

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : "en";
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback(
    (key: string) =>
      language === "ar" ? (AR_TRANSLATIONS[key] ?? key) : key,
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      dir: language === "ar" ? ("rtl" as const) : ("ltr" as const),
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, setLanguage, toggleLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
