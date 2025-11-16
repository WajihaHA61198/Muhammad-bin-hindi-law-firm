"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./LanguageProvider";
import { getHeroSlides, getStrapiMedia } from "@/lib/strapi";

export default function Carousel() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch slides from Strapi
  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      try {
        // console.log("Fetching slides from Strapi...");
        const data = await getHeroSlides();
        // console.log("Received data:", data);
        // console.log("Data length:", data?.length);
        setSlides(data);
      } catch (error) {
        // console.error("Error loading slides:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand">
        <div className="text-white text-2xl">
          {t("common.loading", "Loading...")}
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand">
        <div className="text-white text-2xl">
          No slides available. Check console for errors.
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-no-repeat bg-center bg-cover h-screen relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => {
          // console.log("Rendering slide:", slide);

          // Get the correct field based on language
          const title = isRTL ? slide.titleAr : slide.title;
          const description = isRTL ? slide.descriptionAr : slide.description;
          const cta = isRTL ? slide.ctaAr : slide.cta;
          const ctaUrl = slide.ctaUrl;
          let backgroundImageUrl = null;
          let miniImageUrl = null;

          if (slide.image?.url) {
            backgroundImageUrl = getStrapiMedia(slide.image.url);
          }
          if (slide.mini_image?.url) {
            miniImageUrl = getStrapiMedia(slide.mini_image.url);
          }

          // console.log("Background Image URL:", backgroundImageUrl);
          // console.log("Mini Image URL:", miniImageUrl);
          // console.log("Full slide data:", JSON.stringify(slide, null, 2));
          // console.log("Mini Image Object:", slide.mini_image);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: backgroundImageUrl
                    ? `url(${backgroundImageUrl})`
                    : "none",
                  backgroundColor: "#643F2E",
                }}
              >
                <div className="absolute inset-0 bg-[#643F2E]/50"></div>
              </div>

              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                  <div className="text-white space-y-6">
                    <h1 className="text-2xl md:text-4xl font-bold">
                      {title || "No title"}
                    </h1>
                    <p className="text-medium text-gray-200 leading-relaxed max-w-lg md:mb-12 xs:mb-4">
                      {description || "No description"}
                    </p>
                    <button className="bg-white text-brand px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                      <Link href={ctaUrl || "#"}>{cta || "No CTA"}</Link>
                    </button>
                  </div>

                  <div className="hidden md:flex justify-end">
                    <div className="w-80 h-80 bg-[#643F2E] flex items-center justify-center">
                      {miniImageUrl ? (
                        <Image
                          // src={miniImageUrl}
                          src="https://cdn.shopify.com/s/files/1/0680/4180/1945/files/2e2cf1b6f441c6f28c3b0e1e0eb4863eb80b7401.png?v=1763112906"
                          alt={title || "Hero slide"}
                          width={640}
                          height={480}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-64 h-64 bg-[#643F2E] rounded-lg flex items-center justify-center text-white">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`absolute ${
            isRTL ? "right-4" : "left-4"
          } top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition cursor-pointer`}
          aria-label={t("hero.prev", "Previous slide")}
        >
          {isRTL ? <FaAngleRight size={18} /> : <FaAngleLeft size={18} />}
        </button>
        <button
          onClick={nextSlide}
          className={`absolute ${
            isRTL ? "left-4" : "right-4"
          } top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition cursor-pointer`}
          aria-label={t("hero.next", "Next slide")}
        >
          {isRTL ? <FaAngleLeft size={18} /> : <FaAngleRight size={18} />}
        </button>

        {/* Slide Indicators */}
        <div
          className={`absolute bottom-1/4 ${
            isRTL ? "right-10" : "left-10"
          } z-10 flex space-x-3 flex-col gap-2`}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                index === currentSlide
                  ? "bg-white"
                  : "border border-white hover:bg-white/75"
              }`}
              aria-label={t("hero.goToSlide", "Go to slide {{number}}", {
                number: index + 1,
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
