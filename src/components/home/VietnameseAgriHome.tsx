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
        <div className="max-w-[700px]">
          <div className="flex items-center gap-4 mb-3">
            <span className="font-marcellus uppercase text-vinex-teal text-[13px]">
              {t.pages.home_agri?.eyebrow || "MỞ RỘNG TỪ HẠT ĐIỀU"}
            </span>
            <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
          </div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] text-[#074751] uppercase tracking-tight leading-[1.15] mb-4 font-semibold drop-shadow-sm">
            {t.pages.home_agri?.h2 || "MỘT HỆ SẢN PHẨM MANG HƯƠNG VỊ VIỆT."}
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[17px] text-[#1a444c] leading-relaxed max-w-[560px] font-medium drop-shadow-sm mb-8">
            {t.pages.home_agri?.body || "Bên cạnh hạt điều, VINEX mở rộng danh mục với trà, cà phê, bánh, kẹo và các sản phẩm nông sản sấy."}
          </p>
          <Link
            href={`/${lang}/san-pham?category=nong-san`}
            className="group inline-flex items-center gap-2 text-[14px] font-bold text-[#074751] uppercase tracking-wider hover:text-[#0a6673] transition-colors"
          >
            Khám phá hệ nông sản <ArrowUpRight className="w-4 h-4 text-vinex-gold transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
