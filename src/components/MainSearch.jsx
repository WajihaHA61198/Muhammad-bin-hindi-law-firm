"use client";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import BackButton from "./BackButton";

const mockItems = [
  {
    id: 1,
    previewText: "Law Firm is one of the leading legal offices",
    fullText:
      "Law Firm is one of the leading legal offices that offer exceptional advisory services for both individuals and companies. We specialize in corporate law, litigation, and family law with a proven track record of success.",
  },
  {
    id: 2,
    previewText: "Law Firm is one of the leading legal offices",
    fullText:
      "Law Firm is one of the leading legal offices that offer exceptional advisory services for both individuals and companies. We specialize in corporate law, litigation, and family law with a proven track record of success.",
  },
];
export default function MainSearch() {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePageClick = (page) => {
    if (onPageChange) onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <BackButton />

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-4">
              {["Team", "Services"].map((item) => (
                <button
                  key={item}
                  className="block w-full text-left text-lg font-semibold text-amber-900 hover:text-amber-700 transition-colors py-2 border-b border-gray-200 last:border-0"
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          <main className="lg:col-span-3 space-y-12">
            {mockItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-8 last:border-0"
              >
                <div className="flex justify-between items-start gap-4">
                  <p className="text-gray-800 flex-1">
                    {expanded[item.id] ? item.fullText : item.previewText}
                  </p>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-amber-900 hover:text-amber-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap"
                  >
                    {expanded[item.id] ? (
                      <>
                        Read less <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>Read more</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </section>
  );
}
