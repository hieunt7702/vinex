"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, Play } from 'lucide-react';
import { useDict } from '@/hooks/useDict';
import { Glass, GlassCard, GlassButton } from '@/components/ui/glass';

export const HomeHero = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="relative w-full overflow-hidden min-h-[100vh] flex flex-col justify-between pt-[105px] sm:pt-[120px] lg:pt-[135px] bg-[#074751]/10">
      {/* 1. Full Panoramic Background Image matching design */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/hero2.png"
          alt="VINEX - Nông sản và Quà tặng Việt"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] sm:object-center transform scale-[1.01]"
        />
        {/* Soft atmospheric light on left to maximize headline readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/15 to-transparent w-full lg:w-[62%]" />
        {/* Subtle vignette along bottom for dock grounding */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
      </div>

      {/* 2. Middle Content Grid (Left Text & Right Stats Card) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-20 flex-1 flex flex-col justify-center py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 lg:gap-8">

          {/* Left Column: Badge, Headline, Subtitle & Action Buttons */}
          <div className="w-full lg:w-[54%] xl:w-[50%] flex flex-col items-start text-left">

            {/* Pill Badge: 🌿 VÌ SỨC KHỎE CỘNG ĐỒNG */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#dcefe1]/85 backdrop-blur-md border border-[#7bb88e]/40 shadow-[0_2px_12px_rgba(13,82,54,0.08)] mb-5 sm:mb-6 select-none transition-all duration-300">
              <svg
                className="w-4 h-4 sm:w-[17px] sm:h-[17px] text-[#0a4c32] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.2 13.8c-.3-3.6 1.3-6.6 3.8-8.3.5 1.9.2 4.8-2.1 7-.9 1-1.4 1.4-1.7 1.3z" />
                <path d="M6.2 16.2c-.8-.7-1.3-1.6-1.5-2.9 1.7 0 4.3-1.9 4.8-5.7 1.9 1.6 2.7 4.8 1.4 7.4-1 1.9-2.9 2.5-4.7 1.2z" />
                <path d="M12.5 11.5c.3-3.3 2.6-6.8 6.2-8.5.2 2.4-.5 5.7-3.3 8-1.2 1-2.2 1-2.9.5z" />
                <path d="M13.8 17c-.8-1.4-1-3.3-.6-5.4 1.9 0 5.3-1.9 6.7-6.5 1.7 2.1 2.5 6.2.6 9.5-1.7 2.8-4.6 3.3-6.7 2.4z" />
              </svg>
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.14em] text-[#0a4c32] uppercase leading-none">
                {t.hero?.badge || (lang === 'en' ? 'FOR COMMUNITY HEALTH' : 'VÌ SỨC KHỎE CỘNG ĐỒNG')}
              </span>
            </div>

            {/* Main Headline: 2 lines with contrasting weights and styles */}
            <h1 className="text-[40px] sm:text-[50px] md:text-[58px] lg:text-[62px] xl:text-[70px] leading-[1.08] mb-5 tracking-tight font-sans">
              <span className="block font-semibold text-[#074751] drop-shadow-xs">
                {t.hero?.title1 || 'Việt Nam,'}
              </span>
              <span className="block font-normal italic text-[#0c616d] mt-1 sm:mt-1.5 drop-shadow-xs font-serif sm:font-sans">
                {t.hero?.title2 || 'Tuyệt tác Quà tặng.'}
              </span>
            </h1>

            {/* Description Subtitle */}
            <p className="text-[#133e44] text-[14.5px] sm:text-[15.5px] md:text-[16.5px] leading-[1.65] max-w-[500px] font-medium mb-8 sm:mb-9 drop-shadow-xs">
              {t.hero?.subtitle || 'Từ tinh hoa nông sản Việt đến những tặng phẩm được chế tác riêng cho thương hiệu của bạn.'}
            </p>

            {/* Action Buttons: Khám phá quà tặng & Nhận tư vấn (Border-radius 12px, GlassButton) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto">

              {/* Primary Button with glowing cyan-teal ambient aura */}
              <div className="relative group">
                <span
                  className="absolute -inset-1 rounded-[14px] bg-gradient-to-r from-teal-400/50 to-cyan-400/40 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  aria-hidden="true"
                />
                <Link href={`/${lang}/qua-tang-doanh-nghiep`} className="relative z-10 block">
                  <GlassButton
                    variant="primary"
                    size="md"
                    radius={12}
                    rightIcon={<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
                    className="text-[14px] px-6 py-3.5 font-semibold shadow-[0_8px_20px_rgba(7,71,81,0.3)]"
                  >
                    {t.hero?.cta_primary || 'Khám phá quà tặng'}
                  </GlassButton>
                </Link>
              </div>

              {/* Secondary Liquid Glass Button with Play Badge (Radius 12px) */}
              <Link href={`/${lang}/lien-he`}>
                <GlassButton
                  variant="secondary"
                  size="md"
                  radius={12}
                  rightIcon={
                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <Play className="w-2.5 h-2.5 text-[#074751] fill-[#074751] translate-x-0.5" />
                    </span>
                  }
                  className="text-[14px] px-6 py-3.5 font-semibold text-[#074751]"
                >
                  {t.hero?.cta_secondary || 'Nhận tư vấn'}
                </GlassButton>
              </Link>
            </div>

          </div>

          {/* Right Column: Floating Liquid Glass Stats Card (Border-radius 16px, matching Header) */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <GlassCard
              variant="elevated"
              radius={16}
              displacementScale={40}
              blurAmount={0.5}
              saturation={140}
              aberrationIntensity={1.5}
              elasticity={0}
              className="w-full max-w-[320px] sm:max-w-[330px] xl:max-w-[350px] rounded-[16px] transition-all duration-300"
              contentClassName="p-5 sm:p-6 lg:p-7 flex flex-col gap-5 sm:gap-6"
            >
              {/* Specular sheen gradient reflection */}
              <span
                className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/5 pointer-events-none rounded-[inherit]"
                aria-hidden="true"
              />

              {/* Stat Row 1: 100% Sản phẩm chất lượng */}
              <div className="relative z-10 flex items-center gap-4 group">
                <div className="relative w-12 h-12 rounded-[12px] overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_16px_rgba(7,71,81,0.25)] flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                  <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                  <svg className="w-5 h-5 text-vinex-gold relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <div className="text-[26px] sm:text-[28px] font-semibold text-white tracking-tight leading-none drop-shadow-xs">
                    {t.hero?.stat3_val || '100%'}
                  </div>
                  <div className="text-[13px] font-medium text-white/90 leading-snug mt-1 drop-shadow-xs">
                    {t.hero?.stat3_lbl || 'Sản phẩm chất lượng'}
                  </div>
                </div>
              </div>

              {/* Stat Row 2: 30+ Đối tác chiến lược */}
              <div className="relative z-10 flex items-center gap-4 group">
                <div className="relative w-12 h-12 rounded-[12px] overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_16px_rgba(7,71,81,0.25)] flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                  <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                  <svg className="w-5 h-5 text-vinex-gold relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div className="text-[26px] sm:text-[28px] font-semibold text-white tracking-tight leading-none drop-shadow-xs">
                    {t.hero?.stat1_val || '30+'}
                  </div>
                  <div className="text-[13px] font-medium text-white/90 leading-snug mt-1 drop-shadow-xs">
                    {t.hero?.stat1_lbl || 'Đối tác chiến lược'}
                  </div>
                </div>
              </div>

              {/* Stat Row 3: 5+ Quốc gia xuất khẩu */}
              <div className="relative z-10 flex items-center gap-4 group">
                <div className="relative w-12 h-12 rounded-[12px] overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_16px_rgba(7,71,81,0.25)] flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                  <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                  <svg className="w-5 h-5 text-vinex-gold relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </div>
                <div>
                  <div className="text-[26px] sm:text-[28px] font-semibold text-white tracking-tight leading-none drop-shadow-xs">
                    {t.hero?.stat2_val || '5+'}
                  </div>
                  <div className="text-[13px] font-medium text-white/90 leading-snug mt-1 drop-shadow-xs">
                    {t.hero?.stat2_lbl || 'Quốc gia xuất khẩu'}
                  </div>
                </div>
              </div>

            </GlassCard>
          </div>

        </div>
      </div>

      {/* 3. Bottom Floating Category Dock Bar (Border-radius 16px, matching Header) */}
      <div className="w-full max-w-[1360px] mx-auto relative z-20 px-4 sm:px-6 mb-5 sm:mb-7 lg:mb-8">
        <GlassCard
          variant="elevated"
          radius={16}
          displacementScale={40}
          blurAmount={0.5}
          saturation={140}
          aberrationIntensity={1.5}
          elasticity={0}
          className="w-full rounded-[16px] transition-all duration-300"
          contentClassName="p-3 sm:p-4 lg:py-3.5 lg:px-6"
        >
          {/* Specular sheen overlay */}
          <span
            className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/5 pointer-events-none rounded-[inherit]"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-2 items-center">

            {/* Category 1: Quà tặng Doanh nghiệp (Flagship Hero Highlight) */}
            <Link
              href={`/${lang}/qua-tang-doanh-nghiep`}
              className="flex items-center gap-3 p-2 rounded-[10px] hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-11 h-11 rounded-[12px] overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-5 h-5 text-vinex-gold relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-semibold text-white tracking-tight leading-tight group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  {t.hero?.cat5_title || 'Quà tặng'}
                </span>
                <span className="text-[12px] font-medium text-white/85 leading-tight drop-shadow-xs">
                  {t.hero?.cat5_sub || 'Doanh nghiệp'}
                </span>
              </div>
            </Link>

            {/* Category 2: Hạt điều & Sản phẩm */}
            <Link
              href={`/${lang}/san-pham?category=hat-dieu`}
              className="flex items-center gap-3 p-2 rounded-[10px] hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-11 h-11 rounded-[12px] overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-5 h-5 text-vinex-gold relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 4c-3 3-4 8-1 12s9 5 12 2c3-3 2-8-1-10-2-1.5-4-1.5-6 0-1.5 1-2.5 1-4-1-.5-.7-.7-1.7 0-3z" />
                  <path d="M11 11c1.5 2 4 2.5 6 1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-semibold text-white tracking-tight leading-tight group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  {t.hero?.cat1_title || 'Hạt điều'}
                </span>
                <span className="text-[12px] font-medium text-white/85 leading-tight drop-shadow-xs">
                  {t.hero?.cat1_sub || '& Sản phẩm'}
                </span>
              </div>
            </Link>

            {/* Category 3: Nông sản sấy khô */}
            <Link
              href={`/${lang}/san-pham?category=nong-san`}
              className="flex items-center gap-3 p-2 rounded-[10px] hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-11 h-11 rounded-[12px] overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-5 h-5 text-vinex-gold relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="5" width="14" height="14" rx="3" transform="rotate(45 12 12)" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-semibold text-white tracking-tight leading-tight group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  {t.hero?.cat2_title || 'Nông sản'}
                </span>
                <span className="text-[12px] font-medium text-white/85 leading-tight drop-shadow-xs">
                  {t.hero?.cat2_sub || 'sấy khô'}
                </span>
              </div>
            </Link>

            {/* Category 4: Trái cây nhiệt đới */}
            <Link
              href={`/${lang}/san-pham?category=trai-cay`}
              className="flex items-center gap-3 p-2 rounded-[10px] hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-11 h-11 rounded-[12px] overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-5 h-5 text-vinex-gold relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a9 9 0 0 0-9 9c0 5 4 9 9 9s9-4 9-9c0-6-9-9-9-9z" />
                  <path d="M12 8v8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-semibold text-white tracking-tight leading-tight group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  {t.hero?.cat3_title || 'Trái cây'}
                </span>
                <span className="text-[12px] font-medium text-white/85 leading-tight drop-shadow-xs">
                  {t.hero?.cat3_sub || 'nhiệt đới'}
                </span>
              </div>
            </Link>

            {/* Category 5: Thực phẩm chế biến */}
            <Link
              href={`/${lang}/san-pham?category=banh-keo`}
              className="flex items-center gap-3 p-2 rounded-[10px] hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-11 h-11 rounded-[12px] overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-5 h-5 text-vinex-gold relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" />
                  <circle cx="12" cy="14" r="3" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-semibold text-white tracking-tight leading-tight group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  {t.hero?.cat4_title || 'Thực phẩm'}
                </span>
                <span className="text-[12px] font-medium text-white/85 leading-tight drop-shadow-xs">
                  {t.hero?.cat4_sub || 'chế biến'}
                </span>
              </div>
            </Link>

          </div>
        </GlassCard>
      </div>

      {/* 4. Smooth Organic Wave Transition into Section Below (#FAF8F2) */}
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

export default HomeHero;
