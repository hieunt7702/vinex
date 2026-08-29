"use client";

import React, { useRef } from "react";
import { Download, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const CTABanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

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
      <div className="absolute inset-0 bg-[#0A323B]/60 z-0 pointer-events-none"></div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Content & Buttons */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="md:col-span-7 text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide leading-tight mb-4 text-white">
              DOANH NGHIỆP CỦA BẠN <br />
              <span className="text-vinex-yellow font-light normal-case italic text-2xl md:text-3xl lg:text-4xl mt-2 block">xứng đáng với món quà tinh tế nhất</span>
            </h2>
            <p className="text-sm md:text-base text-white/80 font-light leading-relaxed max-w-lg">
              Để lại thông tin để nhận catalogue và báo giá ưu đãi nhất dành riêng cho doanh nghiệp của bạn.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="md:col-span-5 flex flex-col gap-5 w-full max-w-sm"
          >
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              animate={{ 
                scale: [1, 1, 1.02, 1, 1],
                boxShadow: [
                  "0px 4px 14px rgba(255, 199, 3, 0.2)",
                  "0px 4px 14px rgba(255, 199, 3, 0.2)",
                  "0px 8px 30px rgba(255, 199, 3, 0.5)",
                  "0px 4px 14px rgba(255, 199, 3, 0.2)",
                  "0px 4px 14px rgba(255, 199, 3, 0.2)"
                ]
              }}
              transition={{
                duration: 12, // Pulse every 12 seconds
                repeat: Infinity,
                times: [0, 0.9, 0.95, 1],
                ease: "easeInOut"
              }}
              className="group relative flex items-center justify-between px-8 py-4.5 text-xs font-bold tracking-widest text-vinex-black bg-vinex-yellow transition-all uppercase w-full rounded-sm overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-sweep"></div>
              <span className="relative z-10">NHẬN CATALOGUE</span>
              <motion.div className="relative z-10" transition={{ type: "spring", stiffness: 400, damping: 25 }} whileHover={{ y: 2 }}>
                <Download className="w-4 h-4" />
              </motion.div>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -2, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-between px-8 py-4.5 text-xs font-bold tracking-widest text-white bg-transparent border border-white/30 hover:border-vinex-yellow hover:text-vinex-yellow transition-all uppercase w-full rounded-sm backdrop-blur-sm shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
            >
              <span>YÊU CẦU BÁO GIÁ</span>
              <motion.div transition={{ type: "spring", stiffness: 400, damping: 25 }} whileHover={{ x: 4 }}>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
