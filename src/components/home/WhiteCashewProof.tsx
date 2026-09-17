"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";

export const WhiteCashewProof: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg_core.png"
          alt="White Cashew Background"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        {/* Gradient overlay to ensure text readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-transparent" /> */}
      </div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-stretch gap-10 xl:gap-16">
          
          {/* Right Text Column (since reversed) */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-marcellus uppercase text-vinex-teal text-[13px]">
                {t.pages.home_cashew?.eyebrow || "NHÂN ĐIỀU TRẮNG"}
              </span>
              <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            </div>
            <h2 className="text-[28px] sm:text-[34px] md:text-[40px] text-[#074751] uppercase tracking-tight leading-[1.2] mb-6 font-semibold">
              Nhân điều trắng
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#2b5963] leading-relaxed mb-10 max-w-[500px]">
              Nguyên liệu được phân loại theo kích thước và hình thức, đáp ứng nhu cầu sản xuất chế biến hoặc cung ứng thương mại.
            </p>

            <div className="flex flex-col gap-4 mb-10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-vinex-gold/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-vinex-gold"></div>
                    </div>
                    <span className="text-[15px] font-semibold text-[#074751]">Chất lượng</span>
                  </div>
                  <p className="text-[14px] text-[#2b5963] ml-9">Hạt điều nguyên vẹn, màu sắc tự nhiên, đáp ứng yêu cầu thẩm mỹ và giá trị sử dụng.</p>
                </div>
                
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-vinex-gold/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-vinex-gold"></div>
                    </div>
                    <span className="text-[15px] font-semibold text-[#074751]">Phân loại</span>
                  </div>
                  <p className="text-[14px] text-[#2b5963] ml-9">Các dòng nguyên hạt (W) và hạt vỡ (S/B), cung cấp lựa chọn phù hợp cho từng nhu cầu.</p>
                </div>
            </div>

            <Link
              href={`/${lang}/nhan-dieu-trang`}
              className="group inline-flex flex-col items-start gap-1.5 text-[14px] font-bold text-[#074751] hover:text-[#0a5c68] transition-colors mt-2"
            >
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wide">Tìm hiểu nhân điều trắng</span>
                <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="w-[60px] h-[2px] bg-vinex-gold/50 group-hover:w-full group-hover:bg-vinex-gold transition-all duration-500"></div>
            </Link>
          </div>

          {/* Left Visual Column (Macro Clean Cashew Photo) */}
          <div className="w-full lg:w-[55%] xl:w-[60%]">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full min-h-[320px] w-full rounded-[16px] overflow-hidden bg-slate-200 shadow-[0_24px_50px_rgba(7,71,81,0.08)]">
                <Image 
                  src="/images/hero_gift_box.png"
                  alt="Nhân điều trắng"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
          </div>

        </div>
      </div>
    </section>
  );
};
