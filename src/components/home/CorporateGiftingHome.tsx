"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";
import { GlassCard, GlassButton } from "@/components/ui/glass";

export const CorporateGiftingHome: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-vinex-ivory relative overflow-hidden">
      {/* 0. Ambient Atmospheric Glow so liquid glass has background contrast to refract */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-500/8 via-[#074751]/6 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-10 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-bl from-teal-400/10 via-[#F2B719]/6 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-14">

          {/* Left Column: Product Box Image Showcase with Glass Frame */}
          <div className="w-full lg:w-[36%] xl:w-[37%] shrink-0">
            <div className="relative p-2 sm:p-2.5 rounded-[22px] bg-white/55 backdrop-blur-md border border-white/85 shadow-[0_16px_40px_rgba(7,71,81,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.9)] group">
              <div className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full rounded-[16px] overflow-hidden bg-[#eaf1ec] shadow-inner">
                <Image
                  src="/images/corporate_gift_box.png"
                  alt="VINEX Corporate Gift Set"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 450px, 520px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gentle ambient lighting highlight */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/20 pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Floating Glass Tag */}
              <div className="absolute -bottom-3.5 left-6 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(7,71,81,0.12)] text-[#074751] text-[11px] font-semibold tracking-wide select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{lang === "en" ? "Custom Tailored Set" : "Hộp quà may đo cao cấp"}</span>
              </div>
            </div>
          </div>

          {/* Center Column: Badge, Typography & Glowing CTA Button */}
          <div className="w-full lg:w-[36%] xl:w-[35%] flex flex-col items-start text-left pt-2 lg:pt-0">
            {/* Liquid Glass Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-[#074751]/20 shadow-[0_2px_10px_rgba(7,71,81,0.04)] mb-4 select-none">
              <span className="text-[#074751] text-[10px]">◆</span>
              <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.16em] text-[#074751] uppercase leading-none">
                {t.corporate.badge || "THIẾT KẾ RIÊNG"}
              </span>
            </div>

            {/* Main Headline with dual-tone luxury styling */}
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] xl:text-[42px] leading-[1.14] mb-4 tracking-tight font-sans">
              <span className="block font-bold text-[#074751] drop-shadow-xs">
                {t.corporate.title1 || "MỘT THƯƠNG HIỆU."}
              </span>
              <span className="block font-normal italic text-[#0c616d] font-serif sm:font-sans mt-1 drop-shadow-xs">
                {t.corporate.title2 || "ĐA DẠNG NHU CẦU."}
              </span>
            </h2>

            {/* Description Paragraph */}
            <p className="text-[#133e44] text-[14px] sm:text-[15px] md:text-[15.5px] leading-[1.68] max-w-[460px] font-medium mb-7 sm:mb-8">
              {t.corporate.desc ||
                "VINEX cung cấp giải pháp thiết kế, sản xuất và in ấn bao bì quà tặng theo yêu cầu, giúp thương hiệu của bạn tạo dấu ấn riêng trong từng sản phẩm."}
            </p>

            {/* Glowing CTA Button */}
            <div className="relative group inline-block">
              <span
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-400/50 to-cyan-400/40 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
              />
              <Link href={`/${lang}/request-quote`} className="relative z-10 block">
                <GlassButton
                  variant="primary"
                  size="md"
                  radius={999}
                  rightIcon={<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
                  className="text-[14px] px-7 py-3.5 font-semibold shadow-[0_8px_22px_rgba(7,71,81,0.28)] bg-gradient-to-r from-[#074751] via-[#0D5962] to-[#146b76] text-white"
                >
                  {t.corporate.cta || "Tư vấn ngay"}
                </GlassButton>
              </Link>
            </div>
          </div>

          {/* Right Column: Liquid Glass Features Card matching Header aesthetic */}
          <div className="w-full sm:w-[340px] lg:w-[28%] xl:w-[27%] shrink-0">
            <GlassCard
              radius={18}
              displacementScale={40}
              blurAmount={0.5}
              saturation={140}
              aberrationIntensity={1.5}
              className="w-full rounded-[18px] bg-white/65 backdrop-blur-xl border border-white/80 shadow-[0_16px_40px_rgba(7,71,81,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.9)] transition-all duration-300"
              contentClassName="p-5 sm:p-6 flex flex-col gap-3.5 sm:gap-4"
            >
              {/* Specular sheen gradient reflection */}
              <span
                className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/10 to-transparent pointer-events-none rounded-[inherit]"
                aria-hidden="true"
              />

              {/* Feature 1: Thiết kế riêng */}
              <div className="relative z-10 flex items-center gap-3.5 p-2 rounded-[12px] hover:bg-white/50 border border-transparent hover:border-white/70 hover:shadow-[0_4px_14px_rgba(7,71,81,0.04)] transition-all duration-200 group">
                <div className="relative w-10 h-10 rounded-[12px] overflow-hidden bg-gradient-to-br from-white via-white/85 to-[#e6f4f2] flex items-center justify-center border border-white/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_12px_rgba(7,71,81,0.08)] flex-shrink-0 group-hover:scale-105 transition-all duration-200">
                  <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                  <svg
                    className="w-5 h-5 text-[#074751] relative z-10 drop-shadow-[0_1px_2px_rgba(7,71,81,0.15)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 12c-2-2.5-5-3.5-7-2s-2.5 5 0 7 6-.5 7-2.5c1 2 4.5 4.5 7 2.5s2-5.5 0-7-5-.5-7 2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#074751] text-[14.5px] sm:text-[15px] leading-tight group-hover:text-[#0c616d] transition-colors">
                    {t.corporate.features?.[0]?.title || "Thiết kế riêng"}
                  </span>
                  <span className="text-[12px] text-[#2b5963]/70 font-normal leading-tight mt-0.5">
                    {lang === "en" ? "Exclusive Bespoke" : "Độc quyền theo thương hiệu"}
                  </span>
                </div>
              </div>

              {/* Feature 2: In ấn logo */}
              <div className="relative z-10 flex items-center gap-3.5 p-2 rounded-[12px] hover:bg-white/50 border border-transparent hover:border-white/70 hover:shadow-[0_4px_14px_rgba(7,71,81,0.04)] transition-all duration-200 group">
                <div className="relative w-10 h-10 rounded-[12px] overflow-hidden bg-gradient-to-br from-white via-white/85 to-[#e6f4f2] flex items-center justify-center border border-white/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_12px_rgba(7,71,81,0.08)] flex-shrink-0 group-hover:scale-105 transition-all duration-200">
                  <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                  <svg
                    className="w-5 h-5 text-[#074751] relative z-10 drop-shadow-[0_1px_2px_rgba(7,71,81,0.15)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="3" width="14" height="6" rx="2" />
                    <path d="M7 9v6a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V9" />
                    <path d="M10 18v3" />
                    <path d="M14 18v3" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#074751] text-[14.5px] sm:text-[15px] leading-tight group-hover:text-[#0c616d] transition-colors">
                    {t.corporate.features?.[1]?.title || "In ấn logo"}
                  </span>
                  <span className="text-[12px] text-[#2b5963]/70 font-normal leading-tight mt-0.5">
                    {lang === "en" ? "Premium Engraving" : "Khắc kim, ép nhũ sắc nét"}
                  </span>
                </div>
              </div>

              {/* Feature 3: Đa dạng bao bì */}
              <div className="relative z-10 flex items-center gap-3.5 p-2 rounded-[12px] hover:bg-white/50 border border-transparent hover:border-white/70 hover:shadow-[0_4px_14px_rgba(7,71,81,0.04)] transition-all duration-200 group">
                <div className="relative w-10 h-10 rounded-[12px] overflow-hidden bg-gradient-to-br from-white via-white/85 to-[#e6f4f2] flex items-center justify-center border border-white/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_12px_rgba(7,71,81,0.08)] flex-shrink-0 group-hover:scale-105 transition-all duration-200">
                  <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                  <svg
                    className="w-5 h-5 text-[#074751] relative z-10 drop-shadow-[0_1px_2px_rgba(7,71,81,0.15)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#074751] text-[14.5px] sm:text-[15px] leading-tight group-hover:text-[#0c616d] transition-colors">
                    {t.corporate.features?.[2]?.title || "Đa dạng bao bì"}
                  </span>
                  <span className="text-[12px] text-[#2b5963]/70 font-normal leading-tight mt-0.5">
                    {lang === "en" ? "Flexible Formats" : "Hộp quà, túi xách cao cấp"}
                  </span>
                </div>
              </div>

              {/* Feature 4: Số lượng linh hoạt */}
              <div className="relative z-10 flex items-center gap-3.5 p-2 rounded-[12px] hover:bg-white/50 border border-transparent hover:border-white/70 hover:shadow-[0_4px_14px_rgba(7,71,81,0.04)] transition-all duration-200 group">
                <div className="relative w-10 h-10 rounded-[12px] overflow-hidden bg-gradient-to-br from-white via-white/85 to-[#e6f4f2] flex items-center justify-center border border-white/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_12px_rgba(7,71,81,0.08)] flex-shrink-0 group-hover:scale-105 transition-all duration-200">
                  <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                  <svg
                    className="w-5 h-5 text-[#074751] relative z-10 drop-shadow-[0_1px_2px_rgba(7,71,81,0.15)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#074751] text-[14.5px] sm:text-[15px] leading-tight group-hover:text-[#0c616d] transition-colors">
                    {t.corporate.features?.[3]?.title || "Số lượng linh hoạt"}
                  </span>
                  <span className="text-[12px] text-[#2b5963]/70 font-normal leading-tight mt-0.5">
                    {lang === "en" ? "Agile MOQs" : "Đáp ứng mọi quy mô đơn hàng"}
                  </span>
                </div>
              </div>

            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CorporateGiftingHome;
