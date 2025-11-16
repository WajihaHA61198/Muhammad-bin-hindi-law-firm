"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./LanguageProvider";

const BackButton = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const handleBack = (e) => {
    e.preventDefault();

    // Try to go back in history first
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/services");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="cursor-pointer inline-flex items-center gap-2 text-brand hover:text-amber-900 transition-colors mb-8 text-sm font-medium"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {isRTL ? <FaAngleRight size={18} /> : <FaAngleLeft size={18} />}
      {isRTL ? "خلف" : "Back"}
    </button>
  );
};

export default BackButton;
