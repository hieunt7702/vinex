"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Glass } from "@/components/ui/glass";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 group cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 w-12 h-12"
      aria-label="Scroll to top"
    >
      <Glass
        radius={999}
        className="w-full h-full text-vinex-teal bg-white/60 shadow-lg border border-white/40 group-hover:text-vinex-gold transition-colors"
      >
        <div className="w-full h-full flex items-center justify-center">
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </Glass>
    </button>
  );
};
