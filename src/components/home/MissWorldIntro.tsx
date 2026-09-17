"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useDict } from '@/hooks/useDict';
import { GlassButton, GlassCard } from '@/components/ui/glass';

export const MissWorldIntro: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="relative w-full overflow-hidden bg-[#f3efe6] flex flex-col justify-between">

      {/* 1. Background Image with Soft Left Light Wash */}
      <div className="absolute inset-0 z-0 bg-[#0a1a1c]">
        <Image
          src="/bg_miss2.png"
          alt="Miss World 2026 & VINEX"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] sm:object-center transform scale-[1.01]"
        />

        {/* Gradient overlay for text readability against dark background */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle vignette along bottom for wave transition grounding */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* 2. Main Content Grid (Left Typography & Right Floating Liquid Glass Card) */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-20 flex-1 flex flex-col justify-center py-6 sm:py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-12">

          {/* Left Column: Badge, Headline, Subtitle, and CTA Button */}
          <div className="w-full lg:w-[60%] xl:w-[60%] flex flex-col items-start text-left">

            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-5 sm:mb-6">
              <span className="font-marcellus uppercase text-white/90 text-[11px] sm:text-[13px] tracking-[0.2em] drop-shadow-sm">
                {t.missworld?.badge || 'DẤU ẤN THƯƠNG HIỆU'}
              </span>
              <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            </div>

            {/* Main Headline */}
            <h2 className="text-[26px] sm:text-[30px] md:text-[34px] xl:text-[36px] uppercase tracking-tight leading-[1.2] font-semibold">
              <span className="block text-vinex-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {t.missworld?.title1 || 'VINEX × MISS WORLD 2026'}
              </span>
            </h2>

            {/* Subtitle */}
            <div className="text-[22px] sm:text-[25px] md:text-[28px] xl:text-[30px] font-medium text-white tracking-tight leading-[1.25] mt-1 sm:mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {t.missworld?.title2 || 'Kiến tạo ngày mai'}
            </div>

            {/* Subtitle Description */}
            <p className="text-white/90 text-[14px] sm:text-[15px] leading-[1.7] max-w-[650px] mt-4 sm:mt-5 mb-7 sm:mb-8 drop-shadow-sm">
              {t.missworld?.desc || 'VINEX đồng hành cùng Miss World 2026 trong các hoạt động vì cộng đồng, lan tỏa giá trị nông sản Việt và vẻ đẹp bền vững.'}
            </p>

            {/* CTA Link */}
            <Link
              href={`/${lang}/tin-tuc/vinex-miss-world`}
              className="group inline-flex flex-col items-start gap-1.5 text-[14px] font-bold text-white hover:text-vinex-gold transition-colors mt-2"
            >
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wide">{t.missworld?.cta || 'Xem chi tiết'}</span>
                <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="w-[60px] h-[2px] bg-vinex-gold/50 group-hover:w-full group-hover:bg-vinex-gold transition-all duration-500"></div>
            </Link>

          </div>

          {/* Right Column: Floating Liquid Glass Emblem Card (Wider Width) */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <div
              className="w-full sm:max-w-[380px] lg:max-w-[400px] xl:max-w-[420px] rounded-[18px] bg-white/5 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center text-center gap-4 sm:gap-5 p-7 sm:p-8 lg:p-9"
            >
              {/* Specular sheen reflection gradient overlay */}
              <span
                className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/5 pointer-events-none rounded-[inherit]"
                aria-hidden="true"
              />

              {/* Miss World Double-Ring Emblem Monogram */}
              <div className="relative z-10 w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-full border-[1.5px] border-white/70 p-[3px] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full border-[1.5px] border-white/90 flex items-center justify-center p-3 sm:p-3.5">
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                  >
                    {/* Outer M shape */}
                    <path d="M20 70 L20 32 L50 58 L80 32 L80 70" strokeWidth="5.5" />
                    {/* Inner chevron peak creating MW monogram */}
                    <path d="M33 70 L50 47 L67 70" strokeWidth="5.5" />
                  </svg>
                </div>
              </div>

              {/* Title: MISS WORLD VIETNAM */}
              <span className="font-marcellus uppercase relative z-10 text-[14.5px] sm:text-[16px] tracking-[0.24em] text-white text-center drop-shadow-xs">
                MISS WORLD VIETNAM
              </span>

              {/* Subtle Elegant Divider */}
              <div className="relative z-10 w-28 sm:w-36 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent my-0.5" />

              {/* Brand Logo: VINEX */}
              <div className="relative z-10 flex items-center justify-center h-10 sm:h-11 w-36 sm:w-44">
                <Image
                  src="/images/logo.png"
                  alt="VINEX"
                  fill
                  className="object-contain brightness-0 invert drop-shadow-xs"
                  sizes="180px"
                />
              </div>

              {/* Subtitle: Proud Partner */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-8 h-[1px] bg-vinex-gold/60"></div>
                <span className="text-[#F2B719] font-serif italic text-[18px] sm:text-[20px] tracking-wide drop-shadow-xs">
                  {t.missworld?.partner || 'Proud Partner'}
                </span>
                <div className="w-8 h-[1px] bg-vinex-gold/60"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default MissWorldIntro;
