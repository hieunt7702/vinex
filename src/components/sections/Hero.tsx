"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
      {/* Dynamic Scaling Background */}
      <div 
        ref={bgRef}
        className="absolute -inset-10 z-0 bg-[url('/images/hero-box.png')] bg-cover bg-center bg-no-repeat will-change-transform"
      ></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-vinex-yellow/50"
            style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
            animate={{
              y: [0, -80, 0],
              x: [0, p.xOffset, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 w-full relative z-20">
        
        {/* Content */}
        <div className="flex flex-col items-start text-left max-w-4xl">
          <span className="hero-pre text-3xl md:text-5xl font-light text-vinex-yellow mb-6 font-script tracking-wide drop-shadow-sm">
            Quà Tết Vinex
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-vinex-blue tracking-tight leading-[1.15] mb-8 font-serif whitespace-nowrap drop-shadow-sm flex flex-col">
            <div className="overflow-hidden py-1"><div className="hero-line-1 origin-bottom-left">TRAO TÂM Ý</div></div>
            <div className="overflow-hidden py-1"><div className="hero-line-2 origin-bottom-left text-vinex-blue">GẮN KẾT GIÁ TRỊ</div></div>
          </h1>
          <p className="hero-desc text-base md:text-lg text-vinex-blue/90 max-w-2xl mb-10 leading-relaxed font-normal drop-shadow-sm">
            Bộ sưu tập quà Tết cao cấp dành cho doanh nghiệp, đối tác và những người trân quý.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="hero-btn group relative flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase text-white bg-vinex-blue hover:bg-vinex-blue/95 transition-all rounded-sm w-full sm:w-auto shadow-[0_4px_20px_rgba(17,76,90,0.25)] hover:shadow-[0_8px_30px_rgba(17,76,90,0.35)] overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-sweep"></div>
              <span>KHÁM PHÁ BỘ SƯU TẬP</span>
              <motion.div transition={{ type: "spring", stiffness: 400, damping: 25 }} whileHover={{ x: 4 }}>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -2, backgroundColor: "rgba(17,76,90,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="hero-btn group relative flex items-center justify-center px-8 py-4 text-xs font-bold tracking-widest uppercase text-vinex-blue bg-white/80 border border-vinex-blue/30 transition-all rounded-sm w-full sm:w-auto backdrop-blur-sm shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:border-vinex-blue"
            >
              <span>YÊU CẦU BÁO GIÁ</span>
            </motion.button>
          </div>

          <div className="hero-foot flex items-center gap-4 text-sm font-semibold tracking-wider text-vinex-blue/80 uppercase drop-shadow-sm">
            <motion.span 
              initial={{ scaleX: 0 }} 
              animate={{ scaleX: 1 }} 
              transition={{ delay: 2, duration: 1, ease: "circOut" }}
              className="w-10 h-[1px] bg-vinex-yellow origin-left"
            ></motion.span>
            <span>Tinh tuyển từ những giá trị Việt</span>
          </div>
        </div>
      </div>
    </section>
  );
};
