"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";
import { GlassCard } from "@/components/ui/glass";

export const FlavoredCashewsHome: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  
  const title = lang === "en" ? "FROM NATURAL CASHEW TO NEW FLAVOR SHADES." : "TỪ VỊ ĐIỀU TỰ NHIÊN ĐẾN NHỮNG SẮC VỊ MỚI.";
  const desc = lang === "en" 
    ? "From cashews, VINEX develops diverse flavor options, suitable for many tasting experiences." 
    : "Từ hạt điều, VINEX phát triển những lựa chọn hương vị đa dạng, phù hợp với nhiều trải nghiệm thưởng thức.";
  const cta = lang === "en" ? "EXPLORE FLAVORED CASHEWS" : "KHÁM PHÁ HẠT ĐIỀU";

  // Placeholder SKUs
  const skus = [1, 2, 3, 4, 5, 6];

  return (
    <section className="py-16 sm:py-20 lg:py-24  relative overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10">
        
        <div className="text-center mb-12 max-w-[800px] mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            <span className="font-marcellus uppercase text-vinex-teal text-[13px]">
              {lang === "en" ? "FLAVORED CASHEWS" : "HẠT ĐIỀU TẨM VỊ"}
            </span>
            <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
          </div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] text-[#074751] uppercase tracking-tight leading-[1.2] mb-6 font-semibold">
            {title}
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#2b5963] leading-relaxed mx-auto max-w-[600px]">
            {desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 max-w-[1000px] mx-auto">
          {skus.map((sku) => (
            <div
              key={sku}
              className="w-full aspect-square rounded-[20px] overflow-hidden relative shadow-[0_12px_30px_rgba(7,71,81,0.08)] hover:-translate-y-2 transition-transform duration-500 group cursor-pointer"
            >
              <Image 
                src={`/images/product/Cashew${sku}.png`} 
                alt={`Cashew Flavor ${sku}`} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href={`/${lang}/san-pham?category=hat-dieu`}
            className="group inline-flex flex-col items-center gap-1.5 text-[14px] font-bold text-[#074751] hover:text-[#0a5c68] transition-colors mt-2"
          >
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wide">{cta}</span>
              <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            <div className="w-[60px] h-[2px] bg-vinex-gold/50 group-hover:w-[120px] group-hover:bg-vinex-gold transition-all duration-500"></div>
          </Link>
        </div>

      </div>
    </section>
  );
};
