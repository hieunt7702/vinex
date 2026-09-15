"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Play, X } from "lucide-react";
import { useDict } from "@/hooks/useDict";

export const VietnamStory: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-[#f5f1e8] min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] xl:min-h-[580px] flex items-center">

      {/* 1. Cinematic Panoramic Background Scene */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/vietnam_story_bg.png"
          alt="Câu chuyện nông sản Việt - VINEX"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] sm:object-center transform scale-[1.01]"
        />

        {/* Soft atmospheric ivory-wash on the left for crisp live text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#FAF8F2] via-[#FAF8F2]/95 sm:via-[#FAF8F2]/85 md:via-[#FAF8F2]/75 to-transparent w-full sm:w-[65%] lg:w-[50%] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle bottom vignette for ground connection */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/15 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* 2. Main Content Layer */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-20 py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-8">

          {/* Left Column: Badge, Typography & Glowing CTA Button */}
          <div className="w-full lg:w-[48%] xl:w-[44%] flex flex-col items-start text-left">

            {/* Outlined Pill Badge */}
            <span className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#0d5962]/40 bg-white/50 backdrop-blur-xs text-[#074751] text-[11px] sm:text-[11.5px] font-semibold tracking-wider uppercase mb-3 sm:mb-4 shadow-[0_2px_8px_rgba(7,71,81,0.03)]">
              {t.vietnam.badge || "VINEX ORIGIN"}
            </span>

            {/* Main Headline */}
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[42px] font-semibold text-[#074751] uppercase tracking-tight leading-[1.2] drop-shadow-xs">
              {t.vietnam.headline || "CÂU CHUYỆN CỦA CHÚNG TÔI"}
            </h2>

            {/* Description Paragraph */}
            <p className="text-[#1e4e57] text-[14px] sm:text-[15px] md:text-[15.5px] leading-[1.7] max-w-[460px] mt-4 mb-7 sm:mb-8 font-medium drop-shadow-xs">
              {t.vietnam.desc ||
                "Từ những hạt điều tinh túy, VINEX bắt đầu hành trình kết nối nông sản Việt với thế giới. Cùng tầm nhìn, chúng tôi không chỉ mang đến sản phẩm, mà còn lan tỏa giá trị văn hóa và con người Việt."}
            </p>

            {/* Glowing Pill Button matching Screenshot */}
            <div className="relative group inline-block">
              {/* Cyan-Teal Glowing Aura */}
              <span
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-400/50 to-cyan-400/40 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
              />
              <Link
                href={`/${lang}/gioi-thieu`}
                className="relative z-10 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#074751] via-[#0b535f] to-[#10626f] text-white text-[14px] sm:text-[14.5px] font-medium shadow-[0_8px_22px_rgba(7,71,81,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t.vietnam.cta || "Tìm hiểu thêm"}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: "From Vietnam To The World" Script & Glass Play Button */}
          <div className="w-full lg:w-[45%] flex items-center justify-end gap-6 sm:gap-8 pt-4 lg:pt-0">

            {/* Artistic Calligraphic Script Tagline */}
            <div className="text-right select-none">
              <span className="block font-serif italic text-white text-[28px] sm:text-[36px] md:text-[44px] lg:text-[48px] leading-[1.08] tracking-wide drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)] font-normal">
                {t.vietnam.slogan_line1 || "From Vietnam"}
              </span>
              <span className="block font-serif italic text-white text-[28px] sm:text-[36px] md:text-[44px] lg:text-[48px] leading-[1.08] tracking-wide drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)] font-normal">
                {t.vietnam.slogan_line2 || "To The World"}
              </span>
            </div>

            {/* Circular Liquid Glass Play Button */}
            <div className="relative group shrink-0">
              {/* Outer soft pulse halo */}
              <span
                className="absolute -inset-1 rounded-full bg-white/20 blur-sm group-hover:bg-white/40 transition-colors pointer-events-none"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                aria-label="Xem video câu chuyện VINEX"
                className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#074751]/60 hover:bg-[#074751]/80 backdrop-blur-md border-[1.5px] border-white/80 shadow-[0_8px_25px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.7)] flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <Play className="w-6 h-6 fill-white text-white translate-x-0.5 group-hover:scale-105 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Interactive Video Modal */}
      {isVideoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Đóng video"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full flex items-center justify-center bg-neutral-900">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-vinex-teal/40 text-white flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">VINEX &mdash; Từ Nông Sản Đến Tặng Phẩm Quốc Tế</h3>
                <p className="text-white/60 text-sm max-w-md mx-auto">
                  Video giới thiệu hành trình vùng nguyên liệu và sứ mệnh nâng tầm nông sản Việt ra thế giới.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default VietnamStory;

