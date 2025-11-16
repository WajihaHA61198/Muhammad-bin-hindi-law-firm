"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getServicesPaginated } from "@/lib/strapi";
import { useLanguage } from "@/components/LanguageProvider";
import { useTranslation } from "react-i18next";
import BackButton from "./BackButton";

// Safe excerpt helper
const excerpt = (value, max = 140) => {
  if (value == null) return "";

  const findFirstString = (v, depth = 0) => {
    if (depth > 5) return null;

    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);

    if (Array.isArray(v)) {
      for (const item of v) {
        const found = findFirstString(item, depth + 1);
        if (found) return found;
      }
      return null;
    }

    if (v && typeof v === "object") {
      const keys = [
        "html",
        "value",
        "data",
        "text",
        "description",
        "content",
        "attributes",
      ];
      for (const k of keys) {
        if (Object.prototype.hasOwnProperty.call(v, k)) {
          const found = findFirstString(v[k], depth + 1);
          if (found) return found;
        }
      }

      for (const k of Object.keys(v)) {
        const found = findFirstString(v[k], depth + 1);
        if (found) return found;
      }
      return null;
    }

    return null;
  };

  let htmlString = findFirstString(value);
  if (!htmlString) {
    try {
      htmlString = String(value);
    } catch {
      htmlString = "";
    }
  }

  const text = htmlString
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max).trim() + "…";
};

export default function ServicesPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  });

  const isRTL = language === "ar";

  // Load services
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const result = await getServicesPaginated({
          page: pagination.page,
          pageSize: pagination.pageSize,
          sort: "order:asc",
        });

        setServices(result.data || []);
        setPagination(result.pagination || pagination);
      } catch (e) {
        console.error("Error loading services:", e);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pagination.page]);

  // Pagination
  const handlePageChange = (p) => {
    setPagination((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = Array.from({ length: pagination.pageCount }, (_, i) => i + 1);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white flex">
      {/* 1 */}
      <aside className="w-64 border-r border-gray-200 p-6 hidden md:block bg-white">
        <nav className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              {t("common.navigation", "Navigation")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/team"
                  className="block text-gray-600 hover:text-brand transition"
                >
                  {t("common.team", "Team")}
                </Link>
              </li>
              <li>
                <span className="block text-brand font-semibold">
                  {t("services.title", "Services")}
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* 2 */}
      <div className="flex-1 md:ml-2">
        <div className=" mx-auto px-6 py-16">
          <BackButton />
          {/* <h1 className="text-3xl font-bold mb-10 text-gray-900">
            {t("services.title", "Services")}
          </h1> */}
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              {t("common.loading", "Loading...")}
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {services.map((s) => (
                  <div key={s.id} className="pb-6 border-b border-gray-200">
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-lg font-semibold text-brand hover:underline"
                    >
                      {isRTL ? s.titleAr || s.title : s.title}
                    </Link>

                    <p className="text-gray-600 mt-2 leading-relaxed text-sm">
                      {isRTL
                        ? excerpt(s.descriptionAr || s.description, 150)
                        : excerpt(s.description, 150)}
                    </p>

                    <Link
                      href={`/services/${s.slug}`}
                      className="text-brand font-medium text-sm mt-3 inline-flex items-center hover:underline"
                    >
                      {t("common.read_more", "Read more")}
                      <span className={`ml-1 ${isRTL ? "rotate-180" : ""}`}>
                        →
                      </span>
                    </Link>
                  </div>
                ))}
              </div>

              {pagination.pageCount > 1 && (
                <div className="flex justify-center mt-10">
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`w-5 h-5 flex items-center justify-center text-sm transition ${
                        pagination.page === 1
                          ? "text-gray-300 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {isRTL ? "→" : "←"}
                    </button>

                    {/* Page Numbers */}
                    {pages.map((num) => (
                      <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        className={`w-9 h-9 flex items-center justify-center text-sm transition cursor-pointer ${
                          num === pagination.page
                            ? " text-brand border-b-brand font-bold border-b-2"
                            : "bg-white text-gray-400 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pageCount}
                      className={`w-5 h-5 flex items-center justify-center text-sm transition ${
                        pagination.page === pagination.pageCount
                          ? "text-gray-300 border-gray-200 cursor-not-allowed"
                          : "text-brand border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {isRTL ? "←" : "→"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
