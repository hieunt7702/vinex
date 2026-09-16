"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";

export const FactoryProof: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  return (
    <section className="py-16 sm:py-20 lg:py-24  relative overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-10 xl:gap-16">
          
          {/* Left Text Column */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-marcellus uppercase text-vinex-teal text-[13px]">
                {t.pages.home_factory?.eyebrow || "NỀN TẢNG TỪ HẠT ĐIỀU"}
              </span>
              <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            </div>
            <h2 className="text-[28px] sm:text-[34px] md:text-[40px] text-[#074751] uppercase tracking-tight leading-[1.2] mb-6 font-semibold">
              {t.pages.home_factory?.h2 || "NƠI GIÁ TRỊ ĐẦU TIÊN ĐƯỢC HÌNH THÀNH."}
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#2b5963] leading-relaxed mb-10 max-w-[500px]">
              {t.pages.home_factory?.body || "Nhà máy bóc tách điều thô tại Phú Thọ là một phần nền tảng trong hoạt động hạt điều của VINEX, nơi nguyên liệu được xử lý, bóc tách, làm sạch và phân loại trước khi hoàn thiện thành nhân điều trắng."}
            </p>
            
            <div className="flex flex-col gap-4 mb-10">
              {t.pages.home_factory?.labels?.map((label: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-vinex-gold/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-vinex-gold"></div>
                  </div>
                  <span className="text-[15px] font-semibold text-[#074751]">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${lang}/nha-may-boc-tach-dieu`}
              className="group inline-flex flex-col items-start gap-1.5 text-[14px] font-bold text-[#074751] hover:text-[#0a5c68] transition-colors mt-2"
            >
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wide">{t.pages.home_factory?.cta || "TÌM HIỂU NHÀ MÁY"}</span>
                <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="w-[60px] h-[2px] bg-vinex-gold/50 group-hover:w-full group-hover:bg-vinex-gold transition-all duration-500"></div>
            </Link>
          </div>

          {/* Right Visual Column (Documentary Style Photo) */}
          <div className="w-full lg:w-[55%] xl:w-[60%]">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full min-h-[320px] w-full rounded-[16px] overflow-hidden bg-slate-200 shadow-[0_24px_50px_rgba(7,71,81,0.08)]">
                <Image 
                  src="/images/des4.png"
                  alt="Nhà máy bóc tách điều"
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
