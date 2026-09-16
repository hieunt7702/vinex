"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight, ChevronLeft, Calendar, ArrowUpRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";
import { GlassCard } from "@/components/ui/glass";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

interface ProjectItem {
  id: string;
  title: string;
  date: string;
  img: string;
}

export const FeaturedProjectsHome: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();
  
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const projectsData = (t as any).featured_projects || {
    badge: "DỰ ÁN TIÊU BIỂU",
    headline: "Hành trình vươn xa cùng nông sản Việt",
    cta: "Xem tất cả",
    items: [
      {
        id: "01",
        title: "Xuất khẩu hạt điều sang EU",
        date: "Tháng 3, 2026",
        img: "/images/story1.png",
      },
      {
        id: "02",
        title: "Hợp tác cùng Miss World 2026",
        date: "Tháng 3, 2026",
        img: "/images/missworld.png",
      },
      {
        id: "03",
        title: "Phát triển vùng nguyên liệu Bình Phước",
        date: "Tháng 4, 2026",
        img: "/images/story2.png",
      },
      {
        id: "04",
        title: "Dự án chế biến sâu Giá trị gia tăng cao",
        date: "Tháng 2, 2026",
        img: "/images/story4.png",
      },
    ],
  };

  return (
    <section className="py-14 sm:py-18 lg:py-24 relative overflow-hidden">
      {/* Strong ambient glow for liquid glass refraction */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-gradient-to-br from-[#F2B719]/25 to-orange-500/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-teal-500/25 to-emerald-400/20 rounded-full blur-[120px] pointer-events-none translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10 w-full">
        {/* Header Row: Badge, Headline & Top-Right Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
          {/* Left: Badge & Headline */}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="font-marcellus uppercase inline-flex items-center px-3.5 py-1 rounded-full border border-[#0d5962]/40 bg-white/50 backdrop-blur-md text-[#074751] text-[11px] sm:text-[11.5px] shadow-[0_2px_8px_rgba(7,71,81,0.03)]">
                {projectsData.badge || "DỰ ÁN TIÊU BIỂU"}
              </span>
              <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            </div>
            <h2 className="text-[26px] sm:text-[32px] md:text-[36px] text-[#074751] tracking-tight leading-tight font-semibold">
              {projectsData.headline || "Hành trình vươn xa cùng nông sản Việt"}
            </h2>
          </div>

          {/* Right: Outlined Pill Button */}
          <Link
            href={`/${lang}/miss-world-2026`}
            className="group inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-[#074751]/30 hover:border-[#074751]/60 bg-white/60 hover:bg-white/90 text-[#074751] text-[13px] sm:text-[13.5px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xs self-start sm:self-auto shrink-0"
          >
            <span>{projectsData.cta || "Xem tất cả"}</span>
            <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel Container with Left/Right Controls */}
        <div className="relative flex items-center group/carousel">
          {/* Left Navigation Chevron Button */}
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            aria-label="Previous projects"
            className={`absolute -left-3 lg:-left-5 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_4px_18px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center text-[#074751] hover:bg-white hover:scale-110 hover:text-[#0c616d] active:scale-95 transition-all duration-200 cursor-pointer ${!isBeginning ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

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
                640: { spaceBetween: 24 },
                1024: { spaceBetween: 32 }
              }}
              className="!overflow-visible"
            >
              {projectsData.items.map((item: ProjectItem, idx: number) => (
                <SwiperSlide
                  key={item.id || idx}
                  className="!w-[280px] sm:!w-[310px] md:!w-[330px]"
                >
                  <Link
                    href={`/${lang}/miss-world-2026`}
                    className="block h-full group hover:-translate-y-1.5 transition-all duration-400 select-none"
                  >
                    <GlassCard
                      radius={22}
                      className="flex flex-col h-full overflow-hidden border border-white/80 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.85)]"
                      contentClassName="flex flex-col h-full bg-white/40 hover:bg-white/50 transition-colors duration-400"
                    >
                      {/* Top Image Container */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#eef3ee]/60">
                        {/* Abstract Gradient Mesh instead of Image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#074751] via-[#10626f] to-vinex-gold opacity-90 transition-transform duration-700 ease-out group-hover:scale-105" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/20 bg-white/10 backdrop-blur-3xl group-hover:bg-white/20 transition-all duration-700 shadow-2xl" />

                        {/* Specular sheen reflection gradient overlay */}
                        <div
                          className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none"
                          aria-hidden="true"
                        />

                        {/* Bottom vignette on image for smooth contrast */}
                        <div
                          className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Bottom Info Banner */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-[16px] sm:text-[17px] text-[#074751] leading-[1.3] group-hover:text-[#0c616d] transition-colors pr-2 font-semibold">
                            {item.title}
                          </h3>
                          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shrink-0 border border-white/80 group-hover:bg-[#F2B719] group-hover:border-[#F2B719] group-hover:text-white text-[#074751] transition-all duration-400">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Date with Calendar icon */}
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6b8f97] mt-auto font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#6b8f97]" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Navigation Chevron Button */}
          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            aria-label="Next projects"
            className={`absolute -right-3 lg:-right-5 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_4px_18px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center text-[#074751] hover:bg-white hover:scale-110 hover:text-[#0c616d] active:scale-95 transition-all duration-200 cursor-pointer ${!isEnd ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProjectsHome;
