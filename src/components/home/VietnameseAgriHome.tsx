"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";
import { GlassCard } from "@/components/ui/glass";

export const VietnameseAgriHome: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  return (
    <section className="py-10 sm:py-14 lg:py-16 relative overflow-hidden flex items-center">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg_vi.png"
          alt="Hệ sản phẩm mang hương vị Việt"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlay for text readability (lighter so image is clearer) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />
      </div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10 w-full">
        <div className="max-w-[900px]">
          <div className="flex items-center gap-4 mb-3">
            <span className="font-marcellus uppercase text-vinex-teal text-[13px]">
              NÔNG SẢN VIỆT
            </span>
            <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
          </div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] text-[#074751] uppercase tracking-tight leading-[1.15] mb-4 font-semibold drop-shadow-sm">
            Trà, cà phê và nông sản Việt
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[17px] text-[#1a444c] leading-relaxed max-w-[750px] font-medium drop-shadow-sm mb-8">
            VINEX cung cấp các lựa chọn trà, cà phê, bánh kẹo và trái cây sấy. Các nhóm sản phẩm được phát triển để mang đến trải nghiệm thưởng thức đa dạng và kết nối nông sản Việt với người tiêu dùng.
          </p>
          
          <div className="flex flex-col gap-4 mb-10">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-vinex-gold/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-vinex-gold"></div>
                  </div>
                  <span className="text-[15px] font-semibold text-[#074751]">Trà và cà phê</span>
                </div>
                <p className="text-[14px] text-[#1a444c] ml-9 drop-shadow-sm">Các dòng trà và cà phê nguyên bản, giữ được đặc trưng của vùng trồng, thích hợp sử dụng hàng ngày hoặc kết hợp trong bộ quà.</p>
              </div>
              
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-vinex-gold/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-vinex-gold"></div>
                  </div>
                  <span className="text-[15px] font-semibold text-[#074751]">Nông sản sấy</span>
                </div>
                <p className="text-[14px] text-[#1a444c] ml-9 drop-shadow-sm">Nhóm nấm, trái cây sấy và các loại bánh kẹo mang hương vị tự nhiên, bổ sung lựa chọn cho danh mục sản phẩm VINEX.</p>
              </div>
          </div>
          <Link
            href={`/${lang}/san-pham`}
            className="group inline-flex items-center gap-2 text-[14px] font-bold text-[#074751] uppercase tracking-wider hover:text-[#0a6673] transition-colors"
          >
            Xem sản phẩm nông sản <ArrowUpRight className="w-4 h-4 text-vinex-gold transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
