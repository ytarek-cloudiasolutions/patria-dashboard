import { useContext } from "react";
import { LanguageContext } from "./languageContext";

/**
 * Access the current language plus the `t()` translator.
 *
 * Usage:
 *   const { t, language, toggleLanguage, dir } = useTranslation();
 *   <span>{t("Dashboard")}</span>   // static chrome → translated
 *   <span>{offer.title}</span>      // backend data  → left as-is
 */
export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
};
