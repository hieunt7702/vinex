"use client";

import React, { useRef } from "react";
import { Download, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { GlassButton } from "@/components/ui/glass";

gsap.registerPlugin(ScrollTrigger);

export const CTABanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(bgRef.current,
      { yPercent: -15, scale: 1.05 },
      {
        yPercent: 15,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative py-16 lg:py-20 overflow-hidden text-white flex items-center justify-center min-h-[400px]">
      
      {/* Animated Parallax Background */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 bg-[url('/images/cta.png')] bg-cover bg-center will-change-transform"
      />
      
      {/* Semi-transparent overlay for luxury contrast */}
      <div className="absolute inset-0 bg-[#0A323B]/70 z-0 pointer-events-none"></div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Content & Buttons */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-7 text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-marcellus uppercase tracking-wide leading-tight mb-4 text-white">
              DOANH NGHIỆP CỦA BẠN <br />
              <span className="text-vinex-gold font-light normal-case italic text-2xl md:text-3xl lg:text-4xl mt-2 block">xứng đáng với món quà tinh tế nhất</span>
            </h2>
            <p className="text-sm md:text-base text-white/80 font-light leading-relaxed max-w-lg">
              Để lại thông tin để nhận catalogue và báo giá ưu đãi nhất dành riêng cho doanh nghiệp của bạn.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col gap-4 w-full max-w-sm">
            <Link href="/vi/request-quote" className="w-full">
              <GlassButton 
                variant="gold" 
                size="lg" 
                className="w-full justify-between"
                rightIcon={<Download className="w-4 h-4" />}
              >
                NHẬN CATALOGUE
              </GlassButton>
            </Link>
            
            <Link href="/vi/lien-he" className="w-full">
              <GlassButton 
                variant="secondary" 
                size="lg" 
                className="w-full justify-between !border-white/30 !text-white hover:!border-vinex-gold hover:!text-vinex-gold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                YÊU CẦU BÁO GIÁ
              </GlassButton>
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
};
