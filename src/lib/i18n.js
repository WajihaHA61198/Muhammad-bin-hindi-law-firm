import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslations from "@/messages/en.json";
import arTranslations from "@/messages/ar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    ar: {
      translation: arTranslations,
    },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
