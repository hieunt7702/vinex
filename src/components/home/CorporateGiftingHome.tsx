"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useDict } from "@/hooks/useDict";
import { GlassCard } from "@/components/ui/glass";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

export const CorporateGiftingHome: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();
  
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <section className="py-14 sm:py-18 lg:py-24 relative overflow-hidden">
      {/* Soft atmospheric ambient glow so liquid glass has background contrast to refract */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-bl from-teal-400/10 via-[#F2B719]/6 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 xl:gap-14">

          {/* Left Column: Heading, Subtitle & Glowing Aura CTA */}
          <div className="w-full lg:w-[45%] xl:w-[40%] shrink-0 flex flex-col items-start text-left">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-marcellus uppercase text-vinex-teal text-[13px]">
                {t.collections.eyebrow || "QUÀ TẶNG"}
              </span>
              <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            </div>

            <h2 className="text-[26px] sm:text-[30px] md:text-[34px] xl:text-[36px] text-[#074751] uppercase tracking-tight leading-[1.2] font-semibold">
              {t.collections.title1 || "BỘ SƯU TẬP QUÀ TẶNG"}
            </h2>

            <div className="text-[22px] sm:text-[25px] md:text-[28px] xl:text-[30px] font-medium text-[#0b5460] tracking-tight leading-[1.25] mt-1 sm:mt-1.5">
              {t.collections.title2 || "Đẳng cấp trong từng chi tiết"}
            </div>

            <p className="text-[#2b5963] text-[14px] sm:text-[15px] leading-[1.7] mt-4 sm:mt-5 mb-7 sm:mb-8 max-w-[400px]">
              {t.collections.desc ||
                "Từ những hộp quà tinh tế đến thiết kế cá nhân hóa, VINEX mang đến bộ sưu tập quà tặng đa dạng, phù hợp cho mọi dịp đặc biệt."}
            </p>

            <Link
              href={`/${lang}/qua-tang-doanh-nghiep`}
              className="group inline-flex flex-col items-start gap-1.5 text-[14px] font-bold text-[#074751] hover:text-[#0a5c68] transition-colors mt-2"
            >
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wide">{t.collections.cta || "Xem tất cả"}</span>
                <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="w-[60px] h-[2px] bg-vinex-gold/50 group-hover:w-full group-hover:bg-vinex-gold transition-all duration-500"></div>
            </Link>
          </div>

          {/* Right Column: Carousel Track with Liquid Glass Cards & Controls */}
          <div className="w-full lg:w-[55%] xl:w-[60%] min-w-0 relative flex items-center group/carousel">
            
            {/* Scrollable Cards Track via Swiper */}
            <div className="w-full overflow-hidden py-4 px-1">
              <Swiper
                modules={[Navigation, Autoplay]}
                onSwiper={setSwiper}
                onSlideChange={(s) => {
                  setIsBeginning(s.isBeginning);
                  setIsEnd(s.isEnd);
                }}
                spaceBetween={20}
                slidesPerView="auto"
                grabCursor={true}
                breakpoints={{
                  640: { spaceBetween: 24 }
                }}
                className="!overflow-visible"
              >
                {t.collections.items.map((item: any, idx: number) => (
                  <SwiperSlide
                    key={item.id || idx}
                    className="!w-[260px] sm:!w-[280px] md:!w-[300px]"
                  >
                    <Link
                      href={`/${lang}/qua-tang-doanh-nghiep`}
                      className="block h-full group hover:-translate-y-1.5 transition-all duration-400 select-none"
                    >
                      <div
                        className="flex flex-col h-full overflow-hidden rounded-[24px]"
                      >
                        {/* Top Image Container */}
                        <div className="relative aspect-[4/3.2] w-full overflow-hidden">
                          <Image 
                            src={item.img || `/images/product/Collection ${Math.min(idx + 1, 15)}.png`} 
                            alt={item.title} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
  
                        {/* Bottom Info Banner */}
                        <div className="pt-4 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[15px] sm:text-[15.5px] text-[#074751] leading-snug truncate group-hover:text-[#0c616d] transition-colors font-semibold">
                              {item.title}
                            </h3>
                            <p className="text-[12.5px] sm:text-[13px] text-[#5c858e] font-medium mt-0.5 truncate">
                              {item.sub}
                            </p>
                          </div>

                          {/* Minimalist Arrow Button */}
                          <div className="w-8 h-8 rounded-full bg-white/80 border border-[#074751]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#074751] group-hover:border-[#074751] transition-colors shadow-xs">
                            <ArrowUpRight className="w-4 h-4 text-[#074751] group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default CorporateGiftingHome;
