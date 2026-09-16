"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";
import { GlassCard } from "@/components/ui/glass";

export const ValueLayers: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  return (
    <section className="py-10 sm:py-14 lg:py-16 relative overflow-hidden flex items-center">
      {/* Section Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg_value.png"
          alt="Landscape Background"
          fill
          className="object-cover opacity-100"
        />
      </div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Text Content */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center py-8">
            <div className="mb-8">
              {/* Fake Vinex Logo Placeholder */}
              <div className="text-[36px] font-marcellus text-[#074751] leading-none mb-1">
                Vinex
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5c858e] font-semibold ml-0.5 mb-3">
                Value for Vietnam
              </div>
              {/* Gold gradient line */}
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#F2B719]/80 to-[#F2B719]"></div>
            </div>
            
            <h2 className="text-[34px] md:text-[40px] lg:text-[44px] text-[#074751] leading-[1.15] font-semibold mb-6">
              Giá trị được tiếp nối<br/>qua từng lớp sản phẩm.
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#2b5963] leading-relaxed max-w-[400px] font-medium">
              Từ những nguyên liệu tinh tuyển đến những sản phẩm mang câu chuyện Việt Nam.
            </p>
          </div>

          {/* Right Column: Bento Grid */}
          <div className="w-full lg:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            
            {/* Card 1: Hạt điều (Left, tall) */}
            <GlassCard radius={24} className="col-span-1 md:row-span-2 overflow-hidden shadow-[0_8px_30px_rgba(7,71,81,0.06)] group transition-transform duration-500 hover:-translate-y-1" contentClassName="flex flex-col h-full w-full">
              <div className="relative aspect-[4/3] md:aspect-auto md:flex-1 w-full bg-[#e6ebe8]/30 overflow-hidden">
                <Image
                  src="/value1.png"
                  alt="Hạt điều"
                  fill
                  className="object-cover"
                />
                {/* Wavy shape divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
                  <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 sm:h-12 text-white/50 fill-current">
                    <path d="M0,100 C400,100 600,0 1200,80 L1200,120 L0,120 Z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col shrink-0">
                <span className="text-[#F2B719] font-serif text-[24px] leading-none mb-3 block">
                  <span className="opacity-40">0</span>1
                </span>
                <h3 className="text-[24px] text-[#074751] font-semibold mb-2">Hạt điều</h3>
                <p className="text-[14px] text-[#5c858e] font-medium mb-6">Nhân điều trắng - Hạt điều tẩm vị</p>
                
                <Link href={`/${lang}/nhan-dieu-trang`} className="mt-auto inline-flex items-center gap-2 text-[13px] font-bold text-[#074751] uppercase tracking-wider group-hover:text-[#0a6673] transition-colors">
                  Khám phá sản phẩm <ArrowRight className="w-4 h-4 text-[#F2B719]" />
                </Link>
              </div>
            </GlassCard>

            {/* Card 2: Nông sản Việt (Top Right, horizontal) */}
            <GlassCard radius={24} className="col-span-1 overflow-hidden shadow-[0_8px_30px_rgba(7,71,81,0.06)] group transition-transform duration-500 hover:-translate-y-1" contentClassName="flex flex-col sm:flex-row md:flex-row h-full w-full">
              <div className="relative w-full sm:w-[40%] aspect-[4/3] sm:aspect-auto bg-[#e6ebe8]/30 overflow-hidden shrink-0">
                <Image
                  src="/value2.png"
                  alt="Nông sản Việt"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 md:p-6 w-full sm:w-[60%] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#F2B719] font-serif text-[20px] leading-none">
                    <span className="opacity-40">0</span>2
                  </span>
                  <div className="h-[1px] w-12 bg-[#F2B719]/40"></div>
                </div>
                <h3 className="text-[20px] text-[#074751] font-semibold mb-2">Nông sản Việt</h3>
                <p className="text-[13px] text-[#5c858e] font-medium mb-5 leading-relaxed">Trà - Cà phê - Bánh - Kẹo - Trái cây sấy</p>
                
                <Link href={`/${lang}/san-pham?category=nong-san`} className="mt-auto inline-flex items-center gap-2 text-[12px] font-bold text-[#074751] uppercase tracking-wider group-hover:text-[#0a6673] transition-colors">
                  Khám phá sản phẩm <ArrowRight className="w-3.5 h-3.5 text-[#F2B719]" />
                </Link>
              </div>
            </GlassCard>

            {/* Card 3: Quà tặng doanh nghiệp (Bottom Right, horizontal) */}
            <GlassCard radius={24} className="col-span-1 overflow-hidden shadow-[0_8px_30px_rgba(7,71,81,0.06)] group transition-transform duration-500 hover:-translate-y-1" contentClassName="flex flex-col sm:flex-row md:flex-row h-full w-full">
              <div className="relative w-full sm:w-[40%] aspect-[4/3] sm:aspect-auto bg-[#e6ebe8]/30 overflow-hidden shrink-0">
                <Image
                  src="/value3.png"
                  alt="Quà tặng doanh nghiệp"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 md:p-6 w-full sm:w-[60%] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#F2B719] font-serif text-[20px] leading-none">
                    <span className="opacity-40">0</span>3
                  </span>
                  <div className="h-[1px] w-12 bg-[#F2B719]/40"></div>
                </div>
                <h3 className="text-[20px] text-[#074751] font-semibold mb-2">Quà tặng doanh nghiệp</h3>
                <p className="text-[13px] text-[#5c858e] font-medium mb-5 leading-relaxed">Những lựa chọn được hoàn thiện cho nhiều dịp trao tặng</p>
                
                <Link href={`/${lang}/qua-tang-doanh-nghiep`} className="mt-auto inline-flex items-center gap-2 text-[12px] font-bold text-[#074751] uppercase tracking-wider group-hover:text-[#0a6673] transition-colors">
                  Khám phá sản phẩm <ArrowRight className="w-3.5 h-3.5 text-[#F2B719]" />
                </Link>
              </div>
            </GlassCard>

          </div>
        </div>
      </div>
    </section>
  );
};
