"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa6";

const BackButton = () => {
  const router = useRouter();

  const handleBack = (e) => {
    e.preventDefault();

    // Try to go back in history first
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback if no history (e.g. direct URL access)
      router.push(backLink || "/services");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="cursor-pointer inline-flex items-center gap-2 text-amber-900 hover:text-amber-700 transition-colors mb-8 text-sm font-medium"
    >
      <FaAngleLeft size={18} />
      Back
    </button>
  );
};

export default BackButton;
