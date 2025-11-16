"use client";

import React, { useEffect, useState } from "react";

const slides =
  "https://cdn.shopify.com/s/files/1/0680/4180/1945/files/43dec344438e46d54ce4c7044facbd2f7368c3ad.jpg?v=1763112897";

export default function PageBanners({ title }) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    const timer = setTimeout(() => setFadeIn(true), 100); // small delay for transition
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-fixed bg-no-repeat bg-center bg-cover h-screen relative">
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides})` }}
          >
            <div className="absolute inset-0 bg-[#643F2E]/50"></div>
          </div>

          {/* Fade-in H1 */}
          <h1
            className={`absolute inset-0 flex items-center justify-center text-white text-4xl font-bold transition-opacity duration-1000 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
          >
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
