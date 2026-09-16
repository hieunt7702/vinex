"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Leaf,
  Globe,
  Flower2,
  BadgeCheck,
  Users,
  ArrowRight,
} from "lucide-react";
import { useDict } from "@/hooks/useDict";
import { GlassCard } from "@/components/ui/glass";

const featureIcons = [
  Award,
  Leaf,
  Globe,
  Flower2,
  BadgeCheck,
  Users,
];

export const WhyVinexHome: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-vinex-ivory relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10 w-full">

        {/* Header Row: Badge, Title & Top-Right Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">

          {/* Left: Badge & Headline */}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="font-marcellus uppercase inline-flex items-center px-3.5 py-1 rounded-full border border-[#0d5962]/40 bg-white/40 text-[#074751] text-[11px] sm:text-[11.5px] shadow-[0_2px_8px_rgba(7,71,81,0.03)]">
                {t.why.badge || "TẠI SAO CHỌN VINEX?"}
              </span>
              <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            </div>
            <h2 className="text-[26px] sm:text-[32px] md:text-[36px] text-[#074751] tracking-tight leading-tight font-semibold">
              {t.why.headline || "Giá trị tạo nên sự khác biệt"}
            </h2>
          </div>

          {/* Right: Outlined Pill Button (matching Screenshot) */}
          <Link
            href={`/${lang}/ve-chung-toi`}
            className="group inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-[#074751]/30 hover:border-[#074751]/60 bg-white/60 hover:bg-white/90 text-[#074751] text-[13px] sm:text-[13.5px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xs self-start sm:self-auto shrink-0"
          >
            <span>{t.why.cta || "Xem tất cả"}</span>
            <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Liquid Glass Cards in a single balanced grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-4.5 xl:gap-5 w-full">
          {t.why.features.map((item, idx) => {
            const IconComponent = featureIcons[idx % featureIcons.length];

            return (
              <div key={item.id || idx} className="h-full">
                <GlassCard
                  radius={26}
                  displacementScale={20}
                  blurAmount={0.35}
                  className="group h-full hover:-translate-y-1.5 transition-all duration-300 p-5 sm:p-6 flex flex-col items-center justify-center text-center min-h-[175px] sm:min-h-[190px]"
                >
                  {/* Circular Icon Badge */}
                  <div className="w-12 h-12 rounded-full bg-[#EBF3F5] text-[#074751] flex items-center justify-center mb-3.5 sm:mb-4 shrink-0 shadow-xs group-hover:scale-110 group-hover:bg-[#d8e9ec] transition-all duration-300">
                    <IconComponent className="w-6 h-6 stroke-[2]" />
                  </div>

                  {/* Two-Line Title */}
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-[#074751] text-[13.5px] sm:text-[14px] leading-snug">
                      {item.title1}
                    </span>
                    <span className="font-medium text-[#195a66] text-[13px] sm:text-[13.5px] leading-snug mt-0.5">
                      {item.title2}
                    </span>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyVinexHome;

