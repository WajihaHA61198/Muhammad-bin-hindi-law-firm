"use client";

// import { ChevronLeft } from 'lucide-react';
import Link from "next/link";
import BackButton from "./BackButton";

export default function DynamicContent() {
  return (
    <section className="bg-[#F3F3F3] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6">
          Legal Consultation Services
        </h1>

        {/* Intro Paragraph */}
        <p className="text-gray-700 mb-10 leading-relaxed">
          Law Firm is one of the leading legal offices that offer exceptional
          advisory services for both individuals and companies. Our mission is
          to provide comprehensive and specialized legal support to meet our
          clients' needs and offer the best legal solutions in various cases and
          legal fields. We provide our legal consultation services as a follow:
        </p>

        {/* General Legal Consultations */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">
            General Legal Consultations
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-amber-900 mt-1">•</span>
              <p>
                At Law Firm, we provide comprehensive legal consultations
                covering all legal aspects that our clients may encounter in
                their daily lives or business activities. Our goal is to offer
                accurate legal advice based on a deep understanding of local and
                international laws.
              </p>
            </li>
          </ul>
        </div>

        {/* Corporate Legal Consultations */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">
            Corporate Legal Consultations
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-amber-900 mt-1">•</span>
              <p>
                We at the Law Firm understand the importance of legal
                consultations for companies in building and enhancing their
                businesses.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-900 mt-1">•</span>
              <p>Our advisory services about:</p>
            </li>
            <li className="ml-8 flex items-start gap-3">
              <span className="text-amber-900 mt-1">–</span>
              <p>Establishing and registering companies.</p>
            </li>
            <li className="ml-8 flex items-start gap-3">
              <span className="text-amber-900 mt-1">–</span>
              <p>All kinds of contracts and agreements.</p>
            </li>
            <li className="ml-8 flex items-start gap-3">
              <span className="text-amber-900 mt-1">–</span>
              <p>Commercial disputes.</p>
            </li>
            <li className="ml-8 flex items-start gap-3">
              <span className="text-amber-900 mt-1">–</span>
              <p>
                Compliance with local and international laws and regulations.
              </p>
            </li>
          </ul>
        </div>

        {/* Individual Legal Consultations */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">
            Individual Legal Consultations
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-amber-900 mt-1">•</span>
              <p>
                Law Firm offers customized advisory services for individuals,
                including:
              </p>
            </li>
            <li className="ml-8 flex items-start gap-3">
              <span className="text-amber-900 mt-1">–</span>
              <p>Family issues such as divorce, alimony, and custody.</p>
            </li>
            <li className="ml-8 flex items-start gap-3">
              <span className="text-amber-900 mt-1">–</span>
              <p>
                Real estate matters like buying, selling, and renting
                properties.
              </p>
            </li>
            <li className="ml-8 flex items-start gap-3">
              <span className="text-amber-900 mt-1">–</span>
              <p>Employment issues such as hiring and wrongful termination.</p>
            </li>
            <li className="ml-8 flex items-start gap-3">
              <span className="text-amber-900 mt-1">–</span>
              <p>Criminal cases and defending personal rights.</p>
            </li>
          </ul>
        </div>

        {/* Closing Paragraph */}
        <p className="text-gray-700 leading-relaxed">
          At Law Firm, we aim to provide the best legal services to ensure your
          rights and offer effective legal solutions. Contact us today to
          receive professional and comprehensive legal consultation.
        </p>
      </div>
    </section>
  );
}
