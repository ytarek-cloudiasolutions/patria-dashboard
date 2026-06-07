import { createContext } from "react";
import type { Language } from "./translations";

export interface LanguageContextValue {
  language: Language;
  /** "rtl" when Arabic, "ltr" otherwise. */
  dir: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  /** Translate a static UI string. Falls back to the source string. */
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
