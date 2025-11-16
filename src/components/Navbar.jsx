"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLanguage } from "./LanguageProvider";
import { useTranslation } from "react-i18next";
import { getNavigation, getServices } from "@/lib/strapi";

// ──────────────────────────────────────────────────────────────
// Fallback Services Data (if Strapi fails)
// ──────────────────────────────────────────────────────────────
const fallbackServices = [
  {
    title: "Corporate Services",
    titleAr: "الخدمات المؤسسية",
    items: [
      {
        name: "Legal Consultation Services",
        href: "/services/consultation",
        key: "services.legal_consultation",
      },
      {
        name: "Foreign Investment Services",
        href: "/services/investment",
        key: "services.foreign_investment",
      },
      {
        name: "Contracts",
        href: "/services/contracts",
        key: "services.contracts",
      },
      {
        name: "Naturalization",
        href: "/services/naturalization",
        key: "services.naturalization",
      },
      {
        name: "Insurance",
        href: "/services/insurance",
        key: "services.insurance",
      },
    ],
  },
  {
    title: "Legal Services",
    titleAr: "الخدمات القانونية",
    items: [
      {
        name: "Defence in all cases",
        href: "/services/defence",
        key: "services.defence",
      },
      {
        name: "Banks and Financial Institutions",
        href: "/services/banks",
        key: "services.banks",
      },
      {
        name: "Corporate Governance Services",
        href: "/services/governance",
        key: "services.governance",
      },
      {
        name: "Companies Liquidation",
        href: "/services/liquidation",
        key: "services.liquidation",
      },
      {
        name: "Internal Regulations for companies",
        href: "/services/regulations",
        key: "services.regulations",
      },
    ],
  },
  {
    title: "Business Services",
    titleAr: "خدمات الأعمال",
    items: [
      {
        name: "Services for Companies and Institutions",
        href: "/services/companies",
        key: "services.companies",
      },
      {
        name: "Arbitration",
        href: "/services/arbitration",
        key: "services.arbitration",
      },
      {
        name: "Intellectual Property",
        href: "/services/ip",
        key: "services.ip",
      },
      {
        name: "Corporate Restructuring and Reorganization",
        href: "/services/restructuring",
        key: "services.restructuring",
      },
    ],
  },
  {
    title: "Other Services",
    titleAr: "خدمات أخرى",
    items: [
      {
        name: "Establishing National and Foreign Companies",
        href: "/services/establishing",
        key: "services.establishing",
      },
      {
        name: "Commercial Agencies",
        href: "/services/agencies",
        key: "services.agencies",
      },
      {
        name: "Supporting Vision 2030",
        href: "/services/vision",
        key: "services.vision",
      },
      { name: "Estates", href: "/services/estates", key: "services.estates" },
    ],
  },
];

// ──────────────────────────────────────────────────────────────
// Language Options
// ──────────────────────────────────────────────────────────────
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function HeaderNavigation() {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();

  // State for navigation data from Strapi
  const [navigation, setNavigation] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [openMenu, setOpenMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isRTL = language === "ar";

  // Refs for click-outside
  const servicesRef = useRef(null);
  const langRef = useRef(null);
  const searchRef = useRef(null);

  // Navbar solid when scrolled OR search OR menu open
  const navbarSolid = scrolled || searchOpen || dropdownOpen;

  // Fetch navigation data (logo & title)
  useEffect(() => {
    async function loadNavigation() {
      const nav = await getNavigation(language);
      setNavigation(nav);
    }
    loadNavigation();
  }, [language]);

  // Fetch services from Strapi
  useEffect(() => {
    async function loadServices() {
      setServicesLoading(true);
      try {
        // console.log("Fetching services from Strapi...");
        const servicesData = await getServices();
        // console.log("Services fetched:", servicesData);
        setServices(servicesData);
      } catch (error) {
        // console.error("Error loading services:", error);
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    }
    loadServices();
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSearchQuery("");
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [searchOpen]);

  // Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  // Change language handler
  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setLangOpen(false);
  };

  // Get logo and title from Strapi
  const logoUrl = navigation?.logo?.url;
  const logoAlt = navigation?.logo?.alternativeText || navigation?.title;
  const homeUrl = navigation?.url || "/";

  // Group services by category
  const groupServicesByCategory = (servicesList) => {
    if (!Array.isArray(servicesList) || servicesList.length === 0) {
      // console.log("No services from Strapi, using fallback");
      return fallbackServices;
    }

    // console.log("Grouping Strapi services:", servicesList);

    const grouped = {};
    servicesList.forEach((service) => {
      const category = service.category || "General";
      if (!grouped[category]) {
        grouped[category] = {
          title: category,
          titleAr: category,
          items: [],
        };
      }
      grouped[category].items.push(service);
    });

    const result = Object.values(grouped);
    // console.log("Grouped services:", result);
    return result;
  };

  const servicesWithCategories = groupServicesByCategory(services);

  // Split services into 4 equal columns
  const splitIntoColumns = (categories) => {
    const numColumns = 4;
    const columns = [[], [], [], []];

    // Calculate items per column
    const itemsPerColumn = Math.ceil(categories.length / numColumns);

    // Distribute categories into columns
    categories.forEach((category, idx) => {
      const columnIndex = Math.floor(idx / itemsPerColumn);
      if (columnIndex < numColumns) {
        columns[columnIndex].push(category);
      }
    });

    // console.log("Service columns (chunked into 4):", columns);
    return columns;
  };

  const serviceColumns = splitIntoColumns(servicesWithCategories);

  // console.log("Service columns:", serviceColumns);

  return (
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className={`
        fixed inset-x-0 top-0 z-50 
        transition-all duration-300
        ${
          navbarSolid
            ? "bg-brand shadow-lg"
            : "bg-transparent hover:bg-brand/90"
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 py-2">
        {/* Logo */}
        <Link
          href={homeUrl}
          className="font-bold text-xl text-white z-10 flex items-center gap-2"
        >
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={navigation?.logo?.width || 40}
              height={navigation?.logo?.height || 40}
              className="object-contain"
              priority
              unoptimized
            />
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/about"
            className="text-white hover:text-neutral-200 transition"
          >
            {t("nav.about", "About Us")}
          </Link>

          {/* Services Mega Menu */}
          <div className="relative" ref={servicesRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-white hover:text-neutral-200 transition"
            >
              <Link href="/services">{t("nav.services", "Services")}</Link>

              <MdOutlineKeyboardArrowDown
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div
                className={`
                  absolute top-full mt-2 w-[94vw] max-w-[90vw] bg-brand rounded-b-xl shadow-xl py-8 pb-12 z-50
                  ${
                    // isRTL
                    //   ? "right-0 origin-top-right"
                    //   : "left-0 origin-top-left"

                    isRTL
                      ? "right-[unset] origin-top-right left-[50%] -translate-x-[70%]"
                      : "left-0 origin-top-left"
                  } 
                `}
                style={{
                  transform: isRTL ? "translateX(10%)" : "translateX(-33%)",
                }}
              >
                {servicesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="ml-3 text-white">
                      {t("common.loading", "Loading services...")}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-8">
                    {serviceColumns.map((column, columnIdx) => (
                      <div key={columnIdx} className="flex flex-col gap-8">
                        {column.map((category, categoryIdx) => (
                          <div key={categoryIdx}>
                            {/* Category Title */}
                            {/* <h3 className="text-white font-semibold text-lg mb-4 border-b border-white/20 pb-2">
                              {isRTL ? category.titleAr : category.title}
                            </h3> */}

                            {/* Service Links */}
                            <div className="flex flex-col gap-7">
                              {category.items.map((service) => (
                                <Link
                                  key={service.id || service.href}
                                  href={
                                    service.slug
                                      ? `/services/${service.slug}`
                                      : service.href
                                  }
                                  className="text-white/80 hover:text-white hover:underline transition font-light text-[15px]"
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  {service.slug
                                    ? isRTL
                                      ? service.titleAr || service.title
                                      : service.title
                                    : t(service.key, service.name)}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            href="/team"
            className="text-white hover:text-neutral-200 transition"
          >
            {t("nav.team", "Our Team")}
          </Link>
          <Link
            href="/blogs"
            className="text-white hover:text-neutral-200 transition"
          >
            {t("nav.blogs", "Blogs")}
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-neutral-200 transition"
          >
            {t("nav.contact", "Contact Us")}
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search with icons inside */}
          {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white cursor-pointer"
            >
              <FiSearch size={20} />
            </button>
          ) : (
            <form onSubmit={handleSearch} className="relative" ref={searchRef}>
              <FiSearch
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 text-black pointer-events-none ${
                  isRTL ? "right-3" : "left-3"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.search", "Search...")}
                className={`
                  w-48 py-2 rounded-md bg-white text-black text-sm
                  focus:outline-none focus:ring-2 focus:ring-neutral-500
                  ${isRTL ? "pr-10 pl-3" : "pl-10 pr-3"}
                `}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
                className={`absolute top-1/2 -translate-y-1/2 text-black ${
                  isRTL ? "left-3" : "right-3"
                }`}
              >
                <FiX size={16} />
              </button>
            </form>
          )}

          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-white text-sm font-medium px-3 py-1 rounded transition"
            >
              {language.toUpperCase()}
              <MdOutlineKeyboardArrowDown
                className={`w-4 h-4 transition-transform ${
                  langOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {langOpen && (
              <div
                className={`absolute top-full mt-2 w-40 bg-brand rounded-lg shadow-xl z-50 ${
                  isRTL ? "left-0" : "right-0"
                }`}
              >
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLanguageChange(item.code)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition ${
                      language === item.code
                        ? "bg-neutral-900 text-white"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{item.flag}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <Link
            href="/book"
            className="text-white px-4 py-2 border border-white rounded-lg text-sm font-light hover:bg-white hover:text-brand transition"
          >
            {t("nav.book", "Book Appointment")}
          </Link>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-4 md:hidden">
          {!searchOpen ? (
            <button onClick={() => setSearchOpen(true)} className="text-white">
              <FiSearch size={22} />
            </button>
          ) : (
            <div className="absolute left-0 top-full w-full bg-brand p-4 shadow-lg z-40">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.search", "Search...")}
                  className="flex-1 px-3 py-2 rounded bg-white text-black text-sm"
                  autoFocus
                />
                <button type="submit" className="text-white">
                  <FiSearch size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-white"
                >
                  <FiX size={22} />
                </button>
              </form>
            </div>
          )}

          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="text-white z-10"
          >
            {openMenu ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {openMenu && (
        <div className="md:hidden bg-brand p-6 space-y-4">
          <Link
            href="/about"
            className="block text-white hover:text-neutral-200"
            onClick={() => setOpenMenu(false)}
          >
            {t("nav.about", "About Us")}
          </Link>

          <div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full text-left text-white hover:text-neutral-200 flex justify-between items-center"
            >
              {t("nav.services", "Services")}
              <MdOutlineKeyboardArrowDown
                className={`w-4 h-4 transition ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {dropdownOpen && (
              <div className="mt-3 space-y-4">
                {servicesLoading ? (
                  <div className="text-white/80 text-sm pl-4">
                    {t("common.loading", "Loading...")}
                  </div>
                ) : (
                  servicesWithCategories.map((category, idx) => (
                    <div key={idx} className="pl-4">
                      <h4 className="text-white font-semibold text-sm mb-2 border-b border-white/20 pb-1">
                        {isRTL ? category.titleAr : category.title}
                      </h4>
                      <div className="space-y-2 mt-2">
                        {category.items.map((service) => (
                          <Link
                            key={service.id || service.href}
                            href={
                              service.slug
                                ? `/services/${service.slug}`
                                : service.href
                            }
                            className="block text-white/80 hover:text-neutral-200 text-sm pl-2"
                            onClick={() => {
                              setOpenMenu(false);
                              setDropdownOpen(false);
                            }}
                          >
                            {service.slug
                              ? isRTL
                                ? service.titleAr || service.title
                                : service.title
                              : t(service.key, service.name)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            href="/team"
            className="block text-white hover:text-neutral-200"
            onClick={() => setOpenMenu(false)}
          >
            {t("nav.team", "Our Team")}
          </Link>
          <Link
            href="/blogs"
            className="block text-white hover:text-neutral-200"
            onClick={() => setOpenMenu(false)}
          >
            {t("nav.blogs", "Blogs")}
          </Link>
          <Link
            href="/contact"
            className="block text-white hover:text-neutral-200"
            onClick={() => setOpenMenu(false)}
          >
            {t("nav.contact", "Contact Us")}
          </Link>

          <div className="pt-4 space-y-3">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-full text-center text-sm font-medium px-3 py-1 rounded border border-white/30 text-white flex items-center justify-center gap-1"
              >
                {language.toUpperCase()}
                <MdOutlineKeyboardArrowDown
                  className={`w-4 h-4 transition ${
                    langOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {langOpen && (
                <div className="mt-2 bg-brand rounded-lg shadow-xl">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageChange(item.code)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        language === item.code
                          ? "bg-neutral-900 text-white"
                          : "text-white/80"
                      }`}
                    >
                      <span className="text-lg">{item.flag}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/book"
              className="block w-full bg-white text-brand text-center px-5 py-2 rounded font-medium"
              onClick={() => setOpenMenu(false)}
            >
              {t("nav.book", "Book Appointment")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
