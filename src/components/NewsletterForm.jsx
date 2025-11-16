"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./LanguageProvider";
import { subscribeToNewsletter } from "@/lib/strapi";

export default function NewsletterForm() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("footer.validation.email.invalid", "Invalid email address"))
        .required(t("footer.validation.email.required", "Email is required")),
    }),
    onSubmit: async (values, { resetForm }) => {
      setSubmitStatus("loading");
      setErrorMessage("");

      try {
        const result = await subscribeToNewsletter({
          email: values.email,
          language: language,
        });

        if (result.success) {
          setSubmitStatus("success");
          resetForm();
          // console.log("Subscription successful:", result.data);
        } else {
          setSubmitStatus("error");

          // Handle specific error types
          if (result.error === "EMAIL_ALREADY_EXISTS") {
            setErrorMessage(
              t(
                "footer.newsletter.alreadySubscribed",
                "This email is already subscribed to our newsletter."
              )
            );
          } else if (result.error === "VALIDATION_ERROR") {
            setErrorMessage(
              result.message ||
                t("footer.validation.email.invalid", "Invalid email address")
            );
          } else if (result.error === "SERVER_ERROR") {
            setErrorMessage(
              t(
                "footer.newsletter.serverError",
                "Server error. Please try again later."
              )
            );
          } else {
            setErrorMessage(
              result.message ||
                t(
                  "footer.newsletter.error",
                  "Something went wrong. Please try again."
                )
            );
          }
        }
      } catch (error) {
        console.error("Newsletter subscription error:", error);
        setSubmitStatus("error");
        setErrorMessage(
          t(
            "footer.newsletter.error",
            "Something went wrong. Please try again."
          )
        );
      } finally {
        setTimeout(() => {
          setSubmitStatus("idle");
          setErrorMessage("");
        }, 3000);
      }
    },
  });

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md w-full p-1 rounded-md bg-white"
        noValidate
      >
        <div className="flex-grow relative">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("footer.newsletter.placeholder", "Enter your email")}
            aria-label={t("footer.newsletter.aria", "Email address")}
            className={`w-full py-2 px-4 text-gray-800 placeholder-gray-500 rounded-md sm:rounded-r-none sm:rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all ${
              formik.touched.email && formik.errors.email
                ? "ring-2 ring-red-500"
                : ""
            }`}
            {...formik.getFieldProps("email")}
            disabled={submitStatus === "loading"}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="absolute -bottom-5 left-0 text-xs text-red-500">
              {formik.errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitStatus === "loading" || submitStatus === "success"}
          className={`
            bg-brand text-white text-sm font-light py-2 px-5 rounded-md sm:rounded-l-none sm:rounded-r-md
            hover:opacity-90 transition-all whitespace-nowrap
            focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand
            disabled:opacity-70 disabled:cursor-not-allowed
            ${submitStatus === "loading" ? "animate-pulse" : ""}
          `}
        >
          {submitStatus === "loading"
            ? t("footer.newsletter.loading", "Loading...")
            : submitStatus === "success"
            ? t("footer.newsletter.success", "Subscribed!")
            : t("footer.newsletter.subscribe", "Subscribe")}
        </button>
      </form>

      {/* Success Message */}
      {submitStatus === "success" && (
        <p
          role="status"
          aria-live="polite"
          className="text-green-300 text-sm text-center mt-2 animate-fade-in"
        >
          {t(
            "footer.newsletter.successMessage",
            "Successfully subscribed! Thank you for joining our newsletter."
          )}
        </p>
      )}

      {/* Error Messages */}
      {submitStatus === "error" && errorMessage && (
        <p
          role="alert"
          aria-live="assertive"
          className="text-red-400 text-sm text-center mt-2 animate-fade-in"
        >
          {errorMessage}
        </p>
      )}
    </>
  );
}
