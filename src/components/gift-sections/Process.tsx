"use client";

import React, { useRef } from "react";
import { Gift, Box, Stamp, Mail, Layers, Settings, Truck } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export const Process = () => {
  const container = useRef<HTMLDivElement>(null);
  const isInView = useInView(container, { once: true, margin: "-10%" });
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 70%", "end 70%"]
  });

  // Grow progress line from 0 to 100% based on scroll
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps = [
    { icon: Gift, label: "Chọn bộ quà" },
    { icon: Box, label: "Chọn sản phẩm" },
    { icon: Stamp, label: "In logo doanh nghiệp" },
    { icon: Mail, label: "Thiệp chúc Tết" },
    { icon: Layers, label: "Thiết kế bao bì" },
    { icon: Settings, label: "Sản xuất" },
    { icon: Truck, label: "Giao hàng" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <section ref={container} className="py-24 bg-white text-vinex-black relative overflow-hidden">
      
      {/* SVG Definitions for Gradient Icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#FDE047" offset="0%" />
            <stop stopColor="#EAB308" offset="50%" />
            <stop stopColor="#A16207" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-3xl md:text-4xl font-light text-vinex-yellow mb-4 block font-script tracking-wide">
              Quy trình
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-vinex-blue tracking-tight leading-tight mb-4 font-serif">
              CÁ NHÂN HÓA QUÀ TẶNG
            </h2>
          </motion.div>
          <div className="flex items-center justify-center gap-2 overflow-hidden py-2">
            <motion.span 
              initial={{ x: "-100%" }}
              animate={isInView ? { x: 0 } : { x: "-100%" }}
              transition={{ duration: 1, ease: "circOut" }}
              className="w-12 h-[1px] bg-vinex-yellow/60"
            ></motion.span>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0C7 3.86599 3.86599 7 0 7C3.86599 7 7 10.134 7 14C7 10.134 10.134 7 14 7C10.134 7 7 3.86599 7 0Z" fill="#FFC703"/>
              </svg>
            </motion.div>
            <motion.span 
              initial={{ x: "100%" }}
              animate={isInView ? { x: 0 } : { x: "100%" }}
              transition={{ duration: 1, ease: "circOut" }}
              className="w-12 h-[1px] bg-vinex-yellow/60"
            ></motion.span>
          </div>
        </div>

        {/* 7-Step Horizontal Timeline */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-2"
        >
          
          {/* Connector Line Background (Desktop only) */}
          {/* 4.5rem is exactly the center of a 9rem max-w container, ensuring the line connects perfect centers */}
          <div className="absolute top-[3rem] left-[4.5rem] right-[4.5rem] h-[2px] bg-vinex-yellow/20 z-0 hidden md:block"></div>
          
          {/* Animated Solid Connector Line (Desktop only) */}
          <motion.div 
            className="absolute top-[3rem] left-[4.5rem] right-[4.5rem] h-[2px] bg-vinex-yellow z-0 hidden md:block origin-left"
            style={{ scaleX }}
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={idx}>
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="step-node flex flex-col items-center text-center relative z-10 w-full max-w-[9rem] group cursor-default"
                >
                  {/* Step Circle */}
                  <div className="w-24 h-24 rounded-full bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center relative mb-5 transition-all duration-500 group-hover:border-vinex-yellow/50 group-hover:shadow-[0_12px_40px_rgba(255,199,3,0.2)] group-hover:bg-gradient-to-br from-white to-orange-50/30">
                    <Icon 
                      className="group-hover:scale-110 transition-transform duration-500 drop-shadow-sm" 
                      style={{ stroke: "url(#goldGradient)" }} 
                      size={36} 
                      strokeWidth={1.5} 
                    />
                    
                    {/* Step Number Badge */}
                    <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white text-vinex-black text-[11px] flex items-center justify-center font-bold border border-gray-100 shadow-sm z-10 group-hover:bg-vinex-yellow group-hover:border-vinex-yellow group-hover:text-white transition-colors duration-300">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Step Label */}
                  <h3 className="text-[13px] md:text-sm font-bold text-vinex-blue tracking-wide px-1 leading-relaxed group-hover:text-vinex-yellow transition-colors duration-300 min-h-[2.5rem] flex items-center justify-center">
                    {step.label}
                  </h3>
                </motion.div>
              </React.Fragment>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};
