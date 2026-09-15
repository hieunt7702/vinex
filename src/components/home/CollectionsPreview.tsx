"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronRight, ChevronLeft } from "lucide-react";
import { useDict } from "@/hooks/useDict";

export const CollectionsPreview: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to toggle navigation buttons
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
  }, [t.collections.items]);

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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 xl:gap-14">

          {/* Left Column: Heading, Subtitle & Glowing Aura CTA */}
          <div className="w-full lg:w-[32%] xl:w-[30%] shrink-0 flex flex-col items-start text-left">
            <h2 className="text-[26px] sm:text-[30px] md:text-[34px] xl:text-[36px] font-semibold text-[#074751] uppercase tracking-tight leading-[1.2]">
              {t.collections.title1 || "BỘ SƯU TẬP QUÀ TẶNG"}
            </h2>

            <div className="text-[22px] sm:text-[25px] md:text-[28px] xl:text-[30px] font-medium text-[#0b5460] tracking-tight leading-[1.25] mt-1 sm:mt-1.5">
              {t.collections.title2 || "Đẳng cấp trong từng chi tiết"}
            </div>

            <p className="text-[#2b5963] text-[14px] sm:text-[15px] leading-[1.7] mt-4 sm:mt-5 mb-7 sm:mb-8 max-w-[400px]">
              {t.collections.desc ||
                "Từ những hộp quà tinh tế đến thiết kế cá nhân hóa, VINEX mang đến bộ sưu tập quà tặng đa dạng, phù hợp cho mọi dịp đặc biệt."}
            </p>

            {/* Glowing Pill Button matching media_1789360330972.png */}
            <div className="relative group inline-block">
              {/* Cyan-Teal Glowing Aura */}
              <span
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-400/50 to-cyan-400/40 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
              />
              <Link
                href={`/${lang}/qua-tang-doanh-nghiep`}
                className="relative z-10 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#074751] via-[#0b535f] to-[#10626f] text-white text-[14px] sm:text-[14.5px] font-medium shadow-[0_8px_22px_rgba(7,71,81,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t.collections.cta || "Xem tất cả"}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Carousel Track with Cards & Next/Prev Controls */}
          <div className="w-full lg:w-[68%] xl:w-[70%] min-w-0 relative flex items-center">

            {/* Scrollable Track */}
            <div
              ref={scrollRef}
              className="w-full flex items-stretch gap-5 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar py-4 px-1 snap-x snap-mandatory"
            >
              {t.collections.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start"
                >
                  <Link
                    href={`/${lang}/qua-tang-doanh-nghiep`}
                    className="group flex flex-col h-full bg-white rounded-[24px] overflow-hidden border border-white/90 shadow-[0_12px_32px_rgba(7,71,81,0.07)] hover:shadow-[0_20px_45px_rgba(7,71,81,0.13)] transition-all duration-400 hover:-translate-y-1.5"
                  >
                    {/* Top Image Container with Soft Ambient Lighting */}
                    <div className="relative aspect-[4/3.2] w-full overflow-hidden bg-[#eef3ee]/60">
                      <Image
                        src={item.img || `/images/product/Collection ${idx + 1}.png`}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 260px, (max-width: 1024px) 280px, 300px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Subtle Top Gloss Sheen */}
                      <div
                        className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Bottom Info Banner matching Screenshot */}
                    <div className="p-4 sm:p-5 bg-white flex items-center justify-between gap-3 border-t border-slate-100/70">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] sm:text-[15.5px] font-semibold text-[#074751] leading-snug truncate group-hover:text-[#0c616d] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[12.5px] sm:text-[13px] text-[#5c858e] font-medium mt-0.5 truncate">
                          {item.sub}
                        </p>
                      </div>

                      {/* Circular Button with Gold Border & White Arrow ↗ */}
                      <div
                        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#074751] border-[1.5px] border-[#d4af37] flex items-center justify-center text-white shrink-0 group-hover:bg-[#0b5460] group-hover:scale-110 transition-all duration-300 shadow-xs"
                        aria-hidden="true"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Optional Left Chevron (appears if scrolled) */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous items"
                className="hidden sm:flex absolute -left-3 lg:-left-5 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_4px_18px_rgba(0,0,0,0.12)] border border-slate-100 items-center justify-center text-[#074751] hover:bg-white hover:scale-110 hover:text-[#0c616d] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Right Navigation Circle Button (matching media_1789360330972.png) */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next items"
              className="hidden sm:flex absolute -right-3 lg:-right-5 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_4px_18px_rgba(0,0,0,0.12)] border border-slate-100 items-center justify-center text-[#074751] hover:bg-white hover:scale-110 hover:text-[#0c616d] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};

export default CollectionsPreview;
