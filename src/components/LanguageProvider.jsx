// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import i18n from "@/lib/i18n";

// import { initReactI18next } from "react-i18next";  //new addition

// const LanguageContext = createContext();

// export function LanguageProvider({ children }) {
//   const [language, setLanguage] = useState("en");
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     // Load saved language from localStorage
//     const savedLang = localStorage.getItem("language") || "en";
//     changeLanguage(savedLang);
//   }, []);

//   const changeLanguage = (lang) => {
//     setLanguage(lang);
//     i18n.changeLanguage(lang);
//     document.documentElement.lang = lang;
//     document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
//     localStorage.setItem("language", lang);
//   };

//   return (
//     <LanguageContext.Provider value={{ language, changeLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export const useLanguage = () => {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error("useLanguage must be used within LanguageProvider");
//   }
//   return context;
// };

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import i18n from "@/lib/i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Extract locale from current URL path
  const getLocaleFromPath = () => {
    if (pathname.startsWith("/ar")) return "ar";
    return "en";
  };

  const [language, setLanguage] = useState(() => {
    // Initialize from URL first, then localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("language") || getLocaleFromPath();
    }
    return "en";
  });

  // ✅ Sync language on mount and pathname changes
  useEffect(() => {
    const urlLocale = getLocaleFromPath();
    const savedLang = localStorage.getItem("language");

    // Priority: URL > localStorage > default
    const initialLang = urlLocale || savedLang || "en";

    if (initialLang !== language) {
      setLanguage(initialLang);
      i18n.changeLanguage(initialLang);
      document.documentElement.lang = initialLang;
      document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
    }
  }, [pathname]);

  // ✅ Initialize i18n on mount
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, []); 

  // ✅ Change language and update URL
  const changeLanguage = (newLang) => {
    if (newLang === language) return; // Avoid unnecessary updates

    // Get current path without locale prefix
    let newPath = pathname;

    // Remove existing locale prefix if present
    if (pathname.startsWith("/ar")) {
      newPath = pathname.replace(/^\/ar/, "") || "/";
    } else if (pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/en/, "") || "/";
    }

    // Add new locale prefix only for Arabic
    if (newLang === "ar") {
      newPath = `/ar${newPath === "/" ? "" : newPath}`;
    }

    // Ensure path starts with /
    if (!newPath.startsWith("/")) {
      newPath = `/${newPath}`;
    }

    // Update state and i18n
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);

    // Update document attributes
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

    // Navigate to new URL
    router.push(newPath);
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
