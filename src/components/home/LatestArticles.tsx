"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import { useDict } from "@/hooks/useDict";
import { GlassCard } from "@/components/ui/glass";

export const LatestArticles: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [t.journal.articles]);

  const handleNext = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-vinex-ivory relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10 w-full">

        {/* Header Row: Badge, Headline & Top-Right Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">

          {/* Left: Badge & Headline */}
          <div className="flex flex-col items-start text-left">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#0d5962]/40 bg-white/40 text-[#074751] text-[11px] sm:text-[11.5px] font-semibold tracking-wider uppercase mb-2.5 shadow-[0_2px_8px_rgba(7,71,81,0.03)]">
              {t.journal.badge || "TẠP CHÍ VINEX"}
            </span>
            <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-semibold text-[#074751] tracking-tight leading-tight">
              {t.journal.headline || "Kiến thức - Xu hướng - Câu chuyện nông sản"}
            </h2>
          </div>

          {/* Right: Outlined Pill Button (matching Screenshot) */}
          <Link
            href={`/${lang}/kien-thuc`}
            className="group inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-[#074751]/30 hover:border-[#074751]/60 bg-white/60 hover:bg-white/90 text-[#074751] text-[13px] sm:text-[13.5px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xs self-start sm:self-auto shrink-0"
          >
            <span>{t.journal.cta || "Xem tất cả"}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel Container with Left/Right Controls */}
        <div className="relative flex items-center">

          {/* Left Navigation Chevron Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous articles"
            className={`absolute -left-3 lg:-left-5 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_4px_18px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center text-[#074751] hover:bg-white hover:scale-110 hover:text-[#0c616d] active:scale-95 transition-all duration-200 cursor-pointer ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable Cards Track */}
          <div
            ref={scrollRef}
            className="w-full flex items-stretch gap-5 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar py-4 px-1 snap-x snap-mandatory"
          >
            {t.journal.articles.map((article, idx) => (
              <div
                key={article.id || idx}
                className="w-[260px] sm:w-[285px] md:w-[310px] shrink-0 snap-start"
              >
                <Link
                  href={`/${lang}/kien-thuc`}
                  className="group flex flex-col h-full rounded-[24px] overflow-hidden"
                >
                  <GlassCard
                    radius={24}
                    displacementScale={20}
                    blurAmount={0.35}
                    className="flex flex-col h-full hover:-translate-y-1.5 transition-all duration-400 p-0 overflow-hidden"
                  >
                    {/* Top Article Image */}
                    <div className="relative aspect-[16/9.5] w-full overflow-hidden bg-[#eef3ef]">
                      <Image
                        src={article.img || `/images/article_${idx + 1}.png`}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 260px, (max-width: 1024px) 285px, 310px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Subtle Top Gloss Sheen */}
                      <div
                        className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Bottom Info Banner */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white/40">
                      <h3 className="text-[14px] sm:text-[14.5px] font-semibold text-[#074751] leading-snug line-clamp-2 group-hover:text-[#0c616d] transition-colors">
                        {article.title}
                      </h3>

                      {/* Date with Calendar icon */}
                      <div className="flex items-center gap-1.5 text-[12px] text-[#6b8f97] mt-3.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#6b8f97]" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </div>
            ))}
          </div>

          {/* Right Navigation Chevron Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next articles"
            className="absolute -right-3 lg:-right-5 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_4px_18px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center text-[#074751] hover:bg-white hover:scale-110 hover:text-[#0c616d] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>
    </section>
  );
};

export default LatestArticles;

