"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./LanguageProvider";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import NewsletterForm from "./NewsletterForm";

const SOCIAL_LINKS = {
  twitter: "https://x.com/yourbrand",
  facebook: "https://facebook.com/yourbrand",
  instagram: "https://instagram.com/yourbrand",
};

const NAV_ITEMS = [
  { key: "about", slug: "about" },
  { key: "strategy", slug: "our-strategy" },
  { key: "advantages", slug: "advantages" },
  { key: "responsibility", slug: "social-responsibility" },
  { key: "services", slug: "services" },
];

export default function Footer() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`text-white bg-brand ${isRTL ? "font-arabic" : "font-sans"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-brand/95">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-end items-center gap-8">
            <NewsletterForm />

            <div className="flex items-center gap-8 text-sm">
              <Link
                href="/contact"
                className="hover:text-neutral-200 transition-colors whitespace-nowrap"
              >
                {t("footer.contact", "Contact Us")}
              </Link>
              <div className="flex gap-5 items-center">
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="hover:text-neutral-200 transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-neutral-200 transition-colors"
                >
                  <FaFacebookF className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-neutral-200 transition-colors"
                >
                  <FaInstagram className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 pb-4">
        <hr className="border-neutral-200/30 border-t-2" />
      </div>

      {/* Lower Section: Nav & Copyright */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-start gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={`/${item.slug}`}
                className="hover:text-neutral-200 transition-colors whitespace-nowrap"
              >
                {t(`footer.nav.${item.key}`, item.key)}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-neutral-300">
            © {currentYear} {t("footer.copyright", "All rights reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
