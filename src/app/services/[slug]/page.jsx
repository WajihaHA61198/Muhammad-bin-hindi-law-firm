"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { getServiceBySlug } from "@/lib/strapi";
import PageBanners from "@/components/PageBanners";
import { useLanguage } from "../../../components/LanguageProvider";
import Image from "next/image";
import { assets } from "../../../../public/assets";
import BackButton from "@/components/BackButton";

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug;
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchService() {
      try {
        console.log("Slug received:", slug);
        const data = await getServiceBySlug(slug);
        console.log("sidrea", data);

        if (!data) {
          setError(true);
        } else {
          setService(data);
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchService();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !service) {
    notFound();
  }

  // Get the appropriate title and description based on language
  const title = isRTL ? service.titleAr : service.title;
  const description = isRTL ? service.descriptionAr : service.description;

  // Ensure description is an array
  const descriptionArray = Array.isArray(description) ? description : [];

  return (
    <>
      <PageBanners title={title} />

      <div
        className={`bg-services min-h-screen bg-gray-50 py-20 px-6`}
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          backgroundImage: `url(${assets.bg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
       
        {/* <Image className="" src={assets.bg} alt="" /> // set this as bg */}
        <div className="max-w-4xl mx-auto">
           <BackButton/>
          <h1
            className={`text-4xl font-semibold text-brand mb-8 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {title}
          </h1>

          <div
            className={`prose prose-lg max-w-none text-gray-700 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {descriptionArray?.map((block, index) => {
              if (block.type === "paragraph") {
                return (
                  <p key={index} className="mb-6 leading-8">
                    {block.children.map((child) => child.text).join("")}
                  </p>
                );
              }
              if (block.type === "heading") {
                const HeadingTag = `h${block.level}`;
                return (
                  <HeadingTag
                    key={index}
                    className="text-3xl font-bold mt-10 mb-4"
                  >
                    {block.children.map((child) => child.text).join("")}
                  </HeadingTag>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
