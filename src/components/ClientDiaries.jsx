"use client";

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./LanguageProvider";
import { getTestimonials, getStrapiMedia } from "@/lib/strapi";

export default function ClientDiaries() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from Strapi
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        // console.log("Testimonials fetched:", data);
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  // Auto-play
  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length]);

  if (loading) {
    return (
      <section className="bg-brand text-white xs:py-8 md:py-16 px-6 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">{t("common.loading", "Loading...")}</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="bg-brand text-white xs:py-8 md:py-16 px-6 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <p className="text-white">
            {t("testimonials.noTestimonials", "No testimonials available")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-brand text-white xs:py-8 md:py-16 px-6 mb-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title and subtitle remain static with i18n translations */}
        <h2 className="text-2xl md:text-[33px] font-semibold mb-5">
          What our clients are saying
        </h2>
        <p className="text-sm md:text-[15px] mb-12 max-w-[500px] text-white/60">
          Our clients range from individual investors, to local, international
          as well as Fortune 500 companies.
        </p>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out md:mb-20 xs:mb-10"
            style={{
              transform: `translateX(${isRTL ? "" : "-"}${
                currentIndex * 100
              }%)`,
            }}
          >
            {testimonials.map((testimonial) => {
              // Get image URL from Strapi
              let imageUrl = null;
              if (testimonial.image?.data?.attributes?.url) {
                imageUrl = testimonial.image.data.attributes.url;
              } else if (testimonial.image?.url) {
                imageUrl = testimonial.image.url;
              } else if (testimonial.image?.data?.[0]?.attributes?.url) {
                imageUrl = testimonial.image.data[0].attributes.url;
              }

              const fullImageUrl = getStrapiMedia(imageUrl);
              const displayText = isRTL
                ? testimonial.textAr || testimonial.text
                : testimonial.text;
              const displayAuthor = isRTL
                ? testimonial.authorAr || testimonial.author
                : testimonial.author;
              const displayRole = isRTL
                ? testimonial.roleAr || testimonial.role
                : testimonial.role;

              return (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 flex flex-col md:flex-row xs:gap-4 md:gap-10 px-4"
                >
                  <div className="flex-shrink-0 md:w-[30%]">
                    <div className="overflow-hidden bg-[#643F2E]">
                      <img
                        src={
                          fullImageUrl || "https://via.placeholder.com/400x500"
                        }
                        alt={displayAuthor}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", fullImageUrl);
                          e.target.src = "https://via.placeholder.com/400x500";
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left flex flex-col justify-between">
                    <p className="text-base md:text-[20px] mb-6 md:leading-loose text-white/60">
                      &ldquo;{displayText}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold text-[20px] mb-4">
                        {displayAuthor}
                      </p>
                      <p className="text-sm">{displayRole}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div
            className={`absolute xs:-bottom-0 md:bottom-5 flex gap-4 ${
              isRTL ? "xs:left-[40%] md:left-0" : "xs:right-[40%] md:right-0"
            }`}
          >
            <button
              onClick={prevSlide}
              className="xs:p-2 md:p-5 rounded-full bg-white/20 hover:bg-white flex items-center justify-center transition-colors"
              aria-label="prev"
            >
              {isRTL ? (
                <FaArrowRight className="w-4 h-4 hover:text-[#4B2615]" />
              ) : (
                <FaArrowLeft className="w-4 h-4 hover:text-[#4B2615]" />
              )}
            </button>
            <button
              onClick={nextSlide}
              className="xs:p-2 md:p-5 rounded-full bg-white/20 hover:bg-white flex items-center justify-center transition-colors"
              aria-label="next"
            >
              {isRTL ? (
                <FaArrowLeft className="w-4 h-4 hover:text-[#4B2615]" />
              ) : (
                <FaArrowRight className="w-4 h-4 hover:text-[#4B2615]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
