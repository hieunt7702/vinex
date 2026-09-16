"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import { ArrowRight } from 'lucide-react';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import Image from 'next/image';

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";

const stepImages = [
  '/images/des1.png',
  '/images/des2.png',
  '/images/des3.png',
  '/images/des4.png'
];

export const BespokeServiceHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-12 lg:py-20 bg-vinex-teal text-white overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col xl:flex-row gap-16 xl:gap-12 items-start">

          {/* Left Content */}
          <div className="xl:w-[320px] shrink-0">
            <h2 className="text-[32px] sm:text-[40px] leading-[1.1] mb-6 whitespace-pre-line font-semibold">
              {t.bespoke.headline}
            </h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-8"></div>
            <p className="text-white/80 text-[14px] leading-relaxed mb-10 whitespace-pre-line">
              {t.bespoke.desc}
            </p>
            <Link 
              href={`/${lang}/bao-bi-qua-tang`}
              className="group inline-flex flex-col items-start gap-1.5 text-[14px] font-bold text-white hover:text-vinex-gold transition-colors mt-2"
            >
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wide">{t.bespoke.cta}</span>
                <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="w-[60px] h-[2px] bg-vinex-gold/50 group-hover:w-full group-hover:bg-vinex-gold transition-all duration-500"></div>
            </Link>
          </div>

          {/* Right Content (Cards via Swiper) */}
          <div className="xl:flex-1 w-full overflow-hidden">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView="auto"
              grabCursor={true}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="!overflow-visible"
            >
              {[...t.bespoke.steps].map((step, idx) => {
                const originalIdx = idx % t.bespoke.steps.length;
                return (
                  <SwiperSlide
                    key={`${step.id}-${idx}`}
                    className="!w-[260px] md:!w-[280px] lg:!w-[300px]"
                  >
                    <div className="w-full aspect-[4/3] mb-6 relative overflow-hidden group shadow-lg bg-vinex-teal rounded-sm">
                      <Image
                        src={stepImages[originalIdx]}
                        alt={step.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
                      />

                      {/* Top Left Gradient Bracket (Inner) */}
                      <div className="absolute top-0 left-0 w-12 h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-20 opacity-80 group-hover:opacity-100"></div>
                      <div className="absolute top-0 left-0 w-[2px] h-12 bg-gradient-to-b from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-20 opacity-80 group-hover:opacity-100"></div>

                      {/* Bottom Right Gradient Bracket (Inner) */}
                      <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-gradient-to-l from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-20 opacity-80 group-hover:opacity-100"></div>
                      <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-gradient-to-t from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-20 opacity-80 group-hover:opacity-100"></div>

                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-white/80 text-[10px] font-semibold uppercase tracking-[0.2em]">{step.title}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-end gap-3 mb-3">
                        <span className="text-vinex-gold font-semibold text-[16px]">{step.id}</span>
                        <h3 className="font-marcellus uppercase font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-white/60 text-[13px] font-light leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

        </div>
      </div>
    </section>
  );
};
