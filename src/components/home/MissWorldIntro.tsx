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
    <section className="relative w-full overflow-hidden bg-[#f3efe6] min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] xl:min-h-[640px] flex flex-col justify-between">

      {/* 1. Background Image with Soft Left Light Wash */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/miss_hero.png"
          alt="Miss World 2026 & VINEX"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] sm:object-center transform scale-[1.01]"
        />

        {/* Soft atmospheric ivory-white wash on the left to ensure live typography is ultra-crisp */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent w-full lg:w-[58%] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle vignette along bottom for wave transition grounding */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/15 via-black/5 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* 2. Main Content Grid (Left Typography & Right Floating Liquid Glass Card) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-20 flex-1 flex flex-col justify-center py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-12">

          {/* Left Column: Badge, Headline, Subtitle, and CTA Button */}
          <div className="w-full lg:w-[52%] xl:w-[48%] flex flex-col items-start text-left">

            {/* Pill Badge: ◆ VINEX X MISS WORLD 2026 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/55 backdrop-blur-md border border-[#074751]/30 shadow-xs mb-5 sm:mb-6 select-none transition-all duration-300">
              <span className="text-[#074751] text-[10px]">◆</span>
              <span className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-[#074751] uppercase leading-none">
                {t.missworld?.badge || 'VINEX X MISS WORLD 2026'}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-[34px] sm:text-[42px] md:text-[48px] lg:text-[52px] xl:text-[58px] leading-[1.12] mb-4 sm:mb-5 tracking-tight font-sans">
              <span className="block font-semibold text-[#074751] drop-shadow-xs">
                {t.missworld?.title1 || 'Trẻ trung hôm nay'}
              </span>
              <span className="block font-normal italic text-[#0c616d] mt-1 sm:mt-1.5 drop-shadow-xs font-serif sm:font-sans">
                {t.missworld?.title2 || 'Kiến tạo ngày mai'}
              </span>
            </h2>

            {/* Subtitle Description */}
            <p className="text-[#133e44] text-[14px] sm:text-[15px] md:text-[15.5px] leading-[1.65] max-w-[480px] font-medium mb-7 sm:mb-8 drop-shadow-xs">
              {t.missworld?.desc || 'VINEX đồng hành cùng Miss World 2026 trong các hoạt động vì cộng đồng, lan tỏa giá trị nông sản Việt và vẻ đẹp bền vững.'}
            </p>

            {/* CTA Button with Cyan-Teal Glowing Aura */}
            <div className="relative group inline-block">
              <span
                className="absolute -inset-1 rounded-[14px] bg-gradient-to-r from-teal-400/50 to-cyan-400/40 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
              />
              <Link href={`/${lang}/miss-world-2026`} className="relative z-10 block">
                <GlassButton
                  variant="primary"
                  size="md"
                  radius={12}
                  rightIcon={<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
                  className="text-[14px] px-6 py-3.5 font-semibold shadow-[0_8px_20px_rgba(7,71,81,0.3)] bg-gradient-to-r from-[#074751] via-[#0D5962] to-[#146b76] text-white"
                >
                  {t.missworld?.cta || 'Tìm hiểu thêm'}
                </GlassButton>
              </Link>
            </div>

          </div>

          {/* Right Column: Floating Liquid Glass Emblem Card (Wider Width) */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <GlassCard
              variant="elevated"
              radius={18}
              blurAmount={0.5}
              displacementScale={45}
              saturation={135}
              aberrationIntensity={1.5}
              elasticity={0}
              className="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] xl:max-w-[420px] rounded-[18px] transition-all duration-300"
              contentClassName="p-7 sm:p-8 lg:p-9 flex flex-col items-center justify-center text-center gap-4 sm:gap-5"
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

              {/* Title: MISS WORLD 2026 */}
              <span className="relative z-10 text-[14.5px] sm:text-[16px] font-semibold tracking-[0.24em] text-white uppercase text-center drop-shadow-xs">
                MISS WORLD 2026
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
              <span className="relative z-10 text-[#F2B719] font-serif italic text-[18px] sm:text-[20px] tracking-wide drop-shadow-xs">
                {t.missworld?.partner || 'Proud Partner'}
              </span>

            </GlassCard>
          </div>

        </div>
      </div>

      {/* 3. Smooth Organic Wave Transition into Section Below (#FAF8F2) */}
      <div className="w-full overflow-hidden leading-none relative z-10 pointer-events-none -mt-1">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-7 sm:h-11 lg:h-14 text-vinex-ivory block preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L0 22C340 55 680 50 1020 25C1220 10 1360 22 1440 12L1440 60L0 60Z"
            fill="currentColor"
          />
        </svg>
      </div>

    </section>
  );
};

export default MissWorldIntro;
