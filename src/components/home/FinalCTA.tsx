"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";

export const FinalCTA: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  return (
    <section className="relative w-full overflow-hidden min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] flex items-center bg-[#074751]">

      {/* 1. Panoramic Mountain & Plantation Landscape Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/final_cta_bg.png"
          alt="Hãy tạo nên dấu ấn khó quên - VINEX"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-[1.01]"
        />

        {/* Soft atmospheric gradient wash on the left for live typography readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent w-full sm:w-[65%] lg:w-[50%] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle overall dark vignette */}
        <div
          className="absolute inset-0 bg-black/10 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* 2. Content Layer */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-20 py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">

          {/* Left Text Block */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <span className="text-white/90 text-[11px] sm:text-[13px] font-semibold tracking-[0.2em] uppercase mb-1 drop-shadow-sm">
              {t.cta.prefix || "HÃY TẠO NÊN"}
            </span>

            <h2 className="text-[26px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-semibold text-white uppercase tracking-tight leading-[1.15] drop-shadow-md">
              {t.cta.headline || "DẤU ẤN KHÓ QUÊN."}
            </h2>

            <p className="text-white/90 text-[13.5px] sm:text-[15px] md:text-[16px] font-medium mt-1.5 sm:mt-2.5 drop-shadow-sm">
              {t.cta.desc || "Cùng VINEX kiến tạo những giá trị bền vững."}
            </p>
          </div>

          {/* Right Action Button with Cyan Glowing Aura */}
          <div className="relative group shrink-0">
            {/* Cyan-Teal Glowing Aura */}
            <span
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-400/60 to-cyan-400/50 blur-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            />
            <Link
              href={`/${lang}/lien-he`}
              className="relative z-10 inline-flex items-center gap-3 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full bg-[#074751]/85 hover:bg-[#074751] backdrop-blur-md border border-white/70 text-white font-semibold text-[14px] sm:text-[15px] shadow-[0_8px_30px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>{t.cta.btn || t.cta.primary || "Liên hệ ngay"}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
};

export default FinalCTA;

