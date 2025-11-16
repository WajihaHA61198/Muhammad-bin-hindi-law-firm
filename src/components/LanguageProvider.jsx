"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import i18n from "@/lib/i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem("language") || "en";
    changeLanguage(savedLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
