"use client";

import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { PiWhatsappLogoLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./LanguageProvider";
import { getTeamMembers, getStrapiMedia } from "@/lib/strapi";

export default function OurTeam() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await getTeamMembers();
        // console.log("Team members fetched:", data);
        setTeamMembers(data);
      } catch (error) {
        // console.error("Error fetching team members:", error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const itemsPerPage = 3;
  const maxSlide = Math.max(0, teamMembers.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="md:min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading", "Loading...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:min-h-screen bg-gray-100" dir={isRTL ? "rtl" : "ltr"}>
      <div className="xs:py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 1. Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-brand mb-4">
              {t("team.title", "Our Team")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t(
                "team.subtitle",
                "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s"
              )}
            </p>
          </div>

          {/* 2.Carousel */}
          {teamMembers.length > 0 ? (
            <div className="relative">
              <button
                onClick={isRTL ? nextSlide : prevSlide}
                disabled={currentSlide === 0}
                className={`absolute ${
                  isRTL ? "right-0 translate-x-4" : "left-0 -translate-x-4"
                } top-1/2 -translate-y-1/2 z-10 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer`}
                aria-label={t("team.prev", "Previous slide")}
              >
                {isRTL ? <FaAngleRight size={25} /> : <FaAngleLeft size={25} />}
              </button>

              <button
                onClick={isRTL ? prevSlide : nextSlide}
                disabled={currentSlide >= maxSlide}
                className={`absolute ${
                  isRTL ? "left-0 -translate-x-4" : "right-0 translate-x-4"
                } top-1/2 -translate-y-1/2 z-10 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer`}
                aria-label={t("team.next", "Next slide")}
              >
                {isRTL ? <FaAngleLeft size={25} /> : <FaAngleRight size={25} />}
              </button>

              {/* 3. Team Cards Container */}
              <div className="overflow-hidden md:max-w-5xl m-auto">
                <div
                  className="flex transition-transform duration-500 ease-in-out xs:gap-3 md:gap-0"
                  style={{
                    transform: `translateX(${isRTL ? "" : "-"}${
                      currentSlide * (100 / itemsPerPage)
                    }%)`,
                  }}
                >
                  {teamMembers.map((member) => {
                    // console.log("Member data:", member);
                    // console.log("Member image:", member.image);

                    let imageUrl = null;
                    if (member.image?.data?.attributes?.url) {
                      imageUrl = member.image.data.attributes.url;
                    } else if (member.image?.url) {
                      imageUrl = member.image.url;
                    } else if (member.image?.data?.[0]?.attributes?.url) {
                      imageUrl = member.image.data[0].attributes.url;
                    }

                    // console.log("Image URL:", imageUrl);
                    const fullImageUrl = getStrapiMedia(imageUrl);
                    // console.log("Full Image URL:", fullImageUrl);

                    const displayName = isRTL
                      ? member.nameAr || member.name
                      : member.name;
                    const displayPosition = isRTL
                      ? member.positionAr || member.position
                      : member.position;

                    return (
                      <div
                        key={member.id}
                        className="lg:w-1/3 xs:w-full flex-shrink-0 md:px-4"
                      >
                        <div className="overflow-hidden transition-shadow">
                          <div className="aspect-4/3 overflow-hidden bg-gradient-to-br from-amber-900 to-amber-700">
                            <img
                              src={
                                fullImageUrl ||
                                "https://via.placeholder.com/400"
                              }
                              alt={displayName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(
                                  "Image failed to load:",
                                  fullImageUrl
                                );
                                e.target.src =
                                  "https://via.placeholder.com/400";
                              }}
                            />
                          </div>

                          {/* Member Info */}
                          <div className="p-6 text-center">
                            <h3 className="text-[22px] font-medium text-brand mb-2">
                              {displayName}
                            </h3>
                            <p className="text-sm text-gray-500 tracking-widest mb-4 font-medium">
                              {displayPosition}
                            </p>

                            <div className="flex justify-center gap-3">
                              <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:text-green-600 transition-colors"
                                aria-label={t("team.whatsapp", "WhatsApp")}
                              >
                                <PiWhatsappLogoLight className="w-5 h-5 font-medium" />
                              </a>
                              <a
                                href="#"
                                className="text-black hover:text-blue-600 transition-colors"
                                aria-label={t("team.phone", "Phone")}
                              >
                                <LiaPhoneVolumeSolid className="w-5 h-5 font-medium" />
                              </a>
                              <a
                                href="#"
                                className="text-black hover:text-red-600 transition-colors"
                                aria-label={t("team.email", "Email")}
                              >
                                <TfiEmail className="w-4 h-4 font-medium" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {t("team.noMembers", "No team members found")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
