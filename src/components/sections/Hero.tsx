"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export const Hero = () => {
  const container = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    // Background scale reveal
    gsap.fromTo(bgRef.current, { scale: 1.05 }, { scale: 1, duration: 2.5, ease: "power2.out" });

    tl.fromTo(".hero-pre", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 })
      .fromTo(".hero-line-1", { opacity: 0, y: 50, rotation: 2 }, { opacity: 1, y: 0, rotation: 0, duration: 1.2 }, "-=0.8")
      .fromTo(".hero-line-2", { opacity: 0, y: 50, rotation: 2 }, { opacity: 1, y: 0, rotation: 0, duration: 1.2 }, "-=1.0")
      .fromTo(".hero-desc", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.8")
      .fromTo(".hero-btn", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, "-=0.8")
      .fromTo(".hero-foot", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.4");

    // Parallax effect on mouse move for the background using quickTo for high performance
    const xTo = gsap.quickTo(bgRef.current, "x", { duration: 1.5, ease: "power2.out" });
    const yTo = gsap.quickTo(bgRef.current, "y", { duration: 1.5, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo((e.clientX - window.innerWidth / 2) / 60);
      yTo((e.clientY - window.innerHeight / 2) / 60);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: container });

  // Pre-defined static particles to prevent Next.js SSR Hydration Error
  const particles = [
    { id: 1, size: 4, top: "20%", left: "15%", duration: 25, delay: 0, xOffset: 15 },
    { id: 2, size: 3, top: "40%", left: "80%", duration: 30, delay: -5, xOffset: -20 },
    { id: 3, size: 5, top: "70%", left: "25%", duration: 22, delay: -10, xOffset: 25 },
    { id: 4, size: 3, top: "85%", left: "70%", duration: 28, delay: -15, xOffset: -15 },
    { id: 5, size: 4, top: "15%", left: "60%", duration: 35, delay: -3, xOffset: 10 },
    { id: 6, size: 2, top: "55%", left: "45%", duration: 20, delay: -8, xOffset: -10 },
    { id: 7, size: 5, top: "30%", left: "90%", duration: 26, delay: -12, xOffset: 20 },
    { id: 8, size: 3, top: "75%", left: "10%", duration: 32, delay: -2, xOffset: -25 },
  ];

  return (
    <section ref={container} className="relative min-h-screen w-full overflow-hidden flex items-center pt-24 pb-12 bg-white">
      {/* Clean Ivory Background */}
      <div 
        ref={bgRef}
        className="absolute -inset-10 z-0 bg-vinex-white will-change-transform"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-vinex-yellow via-transparent to-transparent pointer-events-none"></div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 w-full relative z-20">
        
        {/* Content */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="flex flex-col items-start text-left max-w-2xl md:w-1/2">
            <span className="hero-pre text-sm font-bold text-vinex-blue uppercase tracking-[0.2em] mb-4 drop-shadow-sm">
              VINEX - Enduring Excellence.
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-vinex-blue tracking-tight leading-[1.15] mb-6 flex flex-col">
              <div className="overflow-hidden py-1"><div className="hero-line-1 origin-bottom-left">Phát triển giá trị từ hạt điều</div></div>
              <div className="overflow-hidden py-1"><div className="hero-line-2 origin-bottom-left text-vinex-blue">và nông sản Việt</div></div>
            </h1>
            <p className="hero-desc text-base md:text-lg text-vinex-blue/90 max-w-xl mb-10 leading-relaxed font-normal">
              VINEX bắt đầu từ nền tảng nhà máy bóc tách điều thô, từng bước phát triển nhân điều trắng, hạt điều tẩm vị, sản phẩm nông sản, bao bì và quà tặng doanh nghiệp.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8">
              <Link href="/vi/san-pham" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="hero-btn group relative flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase text-white bg-vinex-blue hover:bg-vinex-blue/95 transition-all rounded-full w-full shadow-[0_4px_20px_rgba(13,89,98,0.25)] hover:shadow-[0_8px_30px_rgba(13,89,98,0.35)] overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-sweep"></div>
                  <span>KHÁM PHÁ NĂNG LỰC</span>
                </motion.button>
              </Link>
              
              <Link href="/vi/lien-he" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2, backgroundColor: "rgba(13,89,98,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className="hero-btn group relative flex items-center justify-center px-8 py-4 text-xs font-bold tracking-widest uppercase text-vinex-blue bg-white/80 border border-vinex-blue/30 transition-all rounded-full w-full backdrop-blur-sm shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:border-vinex-blue"
                >
                  <span>NHẬN TƯ VẤN</span>
                </motion.button>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-5/12 hero-desc">
             <div className="relative aspect-[4/5] bg-vinex-white rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: "url('/images/product/bao_bi_qua_tang/p11.png')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-vinex-blue/50 to-transparent"></div>
             </div>
          </div>
        </div>

          <div className="hero-foot mt-12 flex items-center gap-4 text-sm font-semibold tracking-wider text-vinex-blue/80 uppercase">
            <motion.span 
              initial={{ scaleX: 0 }} 
              animate={{ scaleX: 1 }} 
              transition={{ delay: 1, duration: 1, ease: "circOut" }}
              className="w-10 h-[2px] bg-vinex-yellow origin-left"
            ></motion.span>
            <span>Nhà máy bóc tách điều thô</span>
          </div>
        </div>
    </section>
  );
};
