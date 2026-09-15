"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useDict } from '@/hooks/useDict';
import { GlassButton } from '@/components/ui/glass';

export const BrandPhilosophy: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="relative w-full overflow-hidden bg-[#f3efe6] min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] xl:min-h-[600px] flex flex-col justify-between">

      {/* 1. Panoramic Background Image with Soft Left Light Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/more_than_a_gift_mockup.png"
          alt="Hơn cả một món quà - VINEX"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-center transform scale-[1.01]"
        />

        {/* Soft atmospheric ivory-white wash on the left for crisp live text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent w-full lg:w-[55%] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle vignette along bottom for wave transition grounding */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/15 via-black/5 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* 2. Main Content Grid (Left Typography & CTA Button) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-20 flex-1 flex flex-col justify-center py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

          {/* Left Column: Headline, Description & CTA Button */}
          <div className="w-full lg:w-[50%] xl:w-[46%] flex flex-col items-start text-left">

            {/* Main Headline: HƠN CẢ MỘT MÓN QUÀ. */}
            <h2 className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] xl:text-[52px] leading-[1.15] mb-4 sm:mb-5 font-semibold tracking-tight text-[#074751] drop-shadow-xs uppercase">
              {t.brand?.label || 'HƠN CẢ MỘT MÓN QUÀ.'}
            </h2>

            {/* Subtitle Description */}
            <p className="text-[#133e44] text-[14.5px] sm:text-[15.5px] md:text-[16px] leading-[1.65] max-w-[480px] font-medium mb-7 sm:mb-8 drop-shadow-xs">
              {t.brand?.desc || 'Mỗi sản phẩm của VINEX không chỉ là hương vị thiên nhiên, mà còn là lời chúc sức khỏe, thịnh vượng và tinh thần gắn kết.'}
            </p>

            {/* Action CTA Button with Cyan-Teal Glowing Aura */}
            <div className="relative group inline-block">
              {/* Glowing Ambient Aura */}
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
                  className="text-[14px] px-6 py-3.5 font-semibold shadow-[0_8px_20px_rgba(7,71,81,0.3)] bg-gradient-to-r from-[#074751] via-[#0D5962] to-[#146b76] text-white"
                >
                  {t.brand?.cta || 'Khám phá quà tặng'}
                </GlassButton>
              </Link>
            </div>

          </div>

          {/* Right Column: Empty spacer preserving the right product scene view */}
          <div className="hidden lg:block lg:w-[48%]" aria-hidden="true" />

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

export default BrandPhilosophy;
