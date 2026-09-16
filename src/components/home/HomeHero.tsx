"use client";

import React, { useState, useEffect } from 'react';
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
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

      {/* 2. Main Content Layer (Width aligned with bottom Dock) */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 xl:px-20 w-full relative z-20 flex-1 flex flex-col justify-center py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 lg:gap-8">

          {/* Left Column: Badge, Headline, Subtitle & Action Buttons */}
          <div className="w-full lg:w-[75%] xl:w-[80%] flex flex-col items-center sm:items-start text-center sm:text-left mt-8 sm:mt-0">

            {/* Pill Badge */}
            <div className="flex items-center gap-4 mb-5 sm:mb-6">
              <Glass
                radius={9999}
                className="inline-flex !w-fit !rounded-full select-none transition-all duration-300 border border-white/60"
              >
              {/* Specular sheen reflection gradient overlay */}
              <span
                className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent pointer-events-none rounded-full"
                aria-hidden="true"
              />
              <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
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
                <span className="font-marcellus text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.15em] text-[#0a4c32] uppercase leading-none mt-0.5">
                  {t.hero?.badge || (lang === 'en' ? 'FOR COMMUNITY HEALTH' : 'VÌ SỨC KHỎE CỘNG ĐỒNG')}
                </span>
              </div>
            </Glass>
              <div className="w-[60px] h-[1px] bg-vinex-gold hidden sm:block"></div>
            </div>

            {/* Main Headline: 2 lines with contrasting weights and styles */}
            <h1 className="text-[40px] sm:text-[50px] md:text-[58px] lg:text-[62px] xl:text-[70px] leading-[1.08] mb-5 tracking-tight font-sans">
              <span className="block font-semibold text-[#074751] drop-shadow-xs">
                {t.hero?.title1 || 'Việt Nam,'}
              </span>
              <span className="block font-normal italic mt-1 sm:mt-1.5 drop-shadow-xs font-serif sm:font-sans leading-[1.3] pb-2">
                {(() => {
                  const title2 = t.hero?.title2 || 'Tuyệt tác Quà tặng.';
                  if (title2.includes('Những giá trị')) {
                    const parts = title2.split('Những giá trị');
                    return (
                      <>
                        {parts[0] && <span className="text-[#0c616d]">{parts[0]}</span>}
                        <span className="text-vinex-gold">
                          Những giá trị
                        </span>
                        {parts[1] && <span className="text-[#0c616d]">{parts[1]}</span>}
                      </>
                    );
                  }
                  return <span className="text-[#0c616d]">{title2}</span>;
                })()}
              </span>
            </h1>

            {/* Description Subtitle */}
            <p className="text-[#133e44] text-[14.5px] sm:text-[15.5px] md:text-[16.5px] leading-[1.65] max-w-[500px] mx-auto sm:mx-0 font-medium mb-8 sm:mb-9 drop-shadow-xs">
              {t.hero?.subtitle || 'Từ tinh hoa nông sản Việt đến những tặng phẩm được chế tác riêng cho thương hiệu của bạn.'}
            </p>

            {/* Action Buttons: Khám phá quà tặng & Nhận tư vấn */}
            <div className="flex flex-row items-center justify-center sm:justify-start gap-3 sm:gap-5 w-full sm:w-auto">

              {/* Primary Button with glowing cyan-teal ambient aura */}
              <div className="relative group flex-1 sm:flex-none w-full sm:w-auto">
                <span
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-400/50 to-cyan-400/40 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  aria-hidden="true"
                />
                <Link href={`/${lang}/qua-tang-doanh-nghiep`} className="relative z-10 block w-full sm:w-auto">
                  <GlassButton
                    as="div"
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
                    className="text-[12.5px] sm:text-[14px] px-3 sm:px-6 py-3 sm:py-3.5 font-semibold shadow-[0_8px_20px_rgba(7,71,81,0.3)] w-full sm:w-auto"
                  >
                    {t.hero?.cta_primary || 'Khám phá quà tặng'}
                  </GlassButton>
                </Link>
              </div>

              {/* Secondary Liquid Glass Button with Play Badge */}
              <Link href={`/${lang}/lien-he`} className="flex-1 sm:flex-none w-full sm:w-auto">
                <GlassButton
                  as="div"
                  variant="secondary"
                  size="md"
                  rightIcon={
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex-shrink-0 lg:group-hover:scale-105 transition-transform duration-200">
                      <Play className="w-3 h-3 text-[#074751]" fill="currentColor" strokeWidth={0} style={{ marginLeft: '2px' }} />
                    </span>
                  }
                  className="text-[12.5px] sm:text-[14px] px-3 sm:px-6 py-3 sm:py-3.5 font-semibold text-[#074751] w-full sm:w-auto"
                >
                  {t.hero?.cta_secondary || 'Nhận tư vấn'}
                </GlassButton>
              </Link>
            </div>

          </div>

          {/* Right Column: Floating Liquid Glass Stats Card (Border-radius 16px, matching Header) */}
        </div>
      </div>
      <div className="w-full max-w-[1440px] mx-auto relative z-20 px-6 sm:px-8 md:px-12 xl:px-20 mb-5 sm:mb-7 lg:mb-8">
        <Glass
          radius={isDesktop ? 9999 : 24}
          className="w-full !rounded-[24px] lg:!rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-300 relative border border-white/45"
        >
          {/* Specular sheen reflection gradient overlay matching Header */}
          <span
            className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent pointer-events-none rounded-[inherit]"
            aria-hidden="true"
          />
          <div className="relative z-10 grid grid-cols-3 lg:grid-cols-6 gap-0 lg:gap-2 items-center p-0 sm:p-4 lg:py-3.5 lg:px-6">

            {/* Faded Gradient Dividers for Mobile/Tablet */}
            <div className="absolute top-1/2 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent lg:hidden pointer-events-none" />
            <div className="absolute top-[10%] bottom-[10%] left-[33.33%] w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent lg:hidden pointer-events-none" />
            <div className="absolute top-[10%] bottom-[10%] left-[66.66%] w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent lg:hidden pointer-events-none" />

            {/* Category 1: Chất lượng & Sản phẩm */}
            <Link
              href={`/${lang}/san-pham`}
              className="flex flex-col lg:flex-row items-center lg:justify-start gap-2.5 sm:gap-3 p-4 lg:p-2 rounded-full lg:hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 lg:group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] lg:group-hover:text-vinex-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M8 12l3 3 5-6" />
                </svg>
              </div>
              <div className="flex flex-col text-center lg:text-left">
                <span className="text-[12px] sm:text-[13.5px] font-semibold text-white tracking-tight leading-[1.2] lg:group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  Chất lượng
                </span>
                <span className="text-[11px] sm:text-[12px] font-medium text-white/85 leading-[1.2] drop-shadow-xs">
                  & Sản phẩm
                </span>
              </div>
            </Link>

            {/* Category 2: Hạt điều & Sản phẩm */}
            <Link
              href={`/${lang}/san-pham?category=hat-dieu`}
              className="flex flex-col lg:flex-row items-center lg:justify-start gap-2.5 sm:gap-3 p-4 lg:p-2 rounded-full lg:hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 lg:group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] lg:group-hover:text-vinex-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 4c-3 3-4 8-1 12s9 5 12 2c3-3 2-8-1-10-2-1.5-4-1.5-6 0-1.5 1-2.5 1-4-1-.5-.7-.7-1.7 0-3z" />
                  <path d="M11 11c1.5 2 4 2.5 6 1" />
                </svg>
              </div>
              <div className="flex flex-col text-center lg:text-left">
                <span className="text-[12px] sm:text-[13.5px] font-semibold text-white tracking-tight leading-[1.2] lg:group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  {t.hero?.cat1_title || 'Hạt điều'}
                </span>
                <span className="text-[11px] sm:text-[12px] font-medium text-white/85 leading-[1.2] drop-shadow-xs">
                  {t.hero?.cat1_sub || '& Sản phẩm'}
                </span>
              </div>
            </Link>

            {/* Category 3: Nông sản sấy khô */}
            <Link
              href={`/${lang}/san-pham?category=nong-san`}
              className="flex flex-col lg:flex-row items-center lg:justify-start gap-2.5 sm:gap-3 p-4 lg:p-2 rounded-full lg:hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 lg:group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] lg:group-hover:text-vinex-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="5" width="14" height="14" rx="3" transform="rotate(45 12 12)" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="flex flex-col text-center lg:text-left">
                <span className="text-[12px] sm:text-[13.5px] font-semibold text-white tracking-tight leading-[1.2] lg:group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  {t.hero?.cat2_title || 'Nông sản'}
                </span>
                <span className="text-[11px] sm:text-[12px] font-medium text-white/85 leading-[1.2] drop-shadow-xs">
                  {t.hero?.cat2_sub || 'sấy khô'}
                </span>
              </div>
            </Link>

            {/* Category 4: Trái cây nhiệt đới */}
            <Link
              href={`/${lang}/san-pham?category=trai-cay`}
              className="flex flex-col lg:flex-row items-center lg:justify-start gap-2.5 sm:gap-3 p-4 lg:p-2 rounded-full lg:hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 lg:group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] lg:group-hover:text-vinex-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a9 9 0 0 0-9 9c0 5 4 9 9 9s9-4 9-9c0-6-9-9-9-9z" />
                  <path d="M12 8v8" />
                </svg>
              </div>
              <div className="flex flex-col text-center lg:text-left">
                <span className="text-[12px] sm:text-[13.5px] font-semibold text-white tracking-tight leading-[1.2] lg:group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  {t.hero?.cat3_title || 'Trái cây'}
                </span>
                <span className="text-[11px] sm:text-[12px] font-medium text-white/85 leading-[1.2] drop-shadow-xs">
                  {t.hero?.cat3_sub || 'nhiệt đới'}
                </span>
              </div>
            </Link>

            {/* Category 5: Thực phẩm chế biến */}
            <Link
              href={`/${lang}/san-pham?category=banh-keo`}
              className="flex flex-col lg:flex-row items-center lg:justify-start gap-2.5 sm:gap-3 p-4 lg:p-2 rounded-full lg:hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 lg:group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-vinex-gold relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" />
                  <circle cx="12" cy="14" r="3" />
                </svg>
              </div>
              <div className="flex flex-col text-center lg:text-left">
                <span className="text-[12px] sm:text-[13.5px] font-semibold text-white tracking-tight leading-[1.2] lg:group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  {t.hero?.cat4_title || 'Thực phẩm'}
                </span>
                <span className="text-[11px] sm:text-[12px] font-medium text-white/85 leading-[1.2] drop-shadow-xs">
                  {t.hero?.cat4_sub || 'chế biến'}
                </span>
              </div>
            </Link>

            <Link
              href={`/${lang}/request-quote`}
              className="flex flex-col lg:flex-row items-center lg:justify-start gap-2.5 sm:gap-3 p-4 lg:p-2 rounded-full lg:hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#0D6370]/50 via-[#074751]/65 to-[#04282D]/75 flex items-center justify-center border border-white/50 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(0,0,0,0.25),0_6px_14px_rgba(7,71,81,0.25)] flex-shrink-0 lg:group-hover:scale-105 transition-all duration-300">
                <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] lg:group-hover:text-vinex-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex flex-col text-center lg:text-left">
                <span className="text-[12px] sm:text-[13.5px] font-semibold text-white tracking-tight leading-[1.2] lg:group-hover:text-vinex-gold transition-colors drop-shadow-xs">
                  Dịch vụ
                </span>
                <span className="text-[11px] sm:text-[12px] font-medium text-white/85 leading-[1.2] drop-shadow-xs">
                  & Hỗ trợ
                </span>
              </div>
            </Link>

          </div>
        </Glass>
      </div>
    </section>
  );
};

export default HomeHero;
