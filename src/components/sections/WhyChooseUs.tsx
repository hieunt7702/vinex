"use client";

import React, { useRef } from "react";
import { Gift, Leaf, UserCheck, ShieldCheck, Truck } from "lucide-react";
import { motion, useInView } from "framer-motion";

export const WhyChooseUs = () => {
  const container = useRef<HTMLDivElement>(null);
  const isInView = useInView(container, { once: true, margin: "-10%" });

  const values = [
    { icon: Gift, title: "Thiết kế sang trọng", desc: "Tinh tế trong từng đường nét và chất liệu" },
    { icon: Leaf, title: "Nguyên liệu tuyển chọn", desc: "Sản phẩm chất lượng từ những thương hiệu uy tín" },
    { icon: UserCheck, title: "Cá nhân hóa theo yêu cầu", desc: "In logo, thiệp chúc, thiết kế riêng cho doanh nghiệp" },
    { icon: ShieldCheck, title: "Đóng gói cao cấp", desc: "Chỉn chu trong từng chi tiết" },
    { icon: Truck, title: "Giao hàng toàn quốc", desc: "Đúng hẹn, an toàn, chuyên nghiệp" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <section ref={container} className="py-24 bg-vinex-blue text-white relative overflow-hidden">
      
      {/* Shared Gradient for Icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="goldGradientWhy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#FDE047" offset="0%" />
            <stop stopColor="#EAB308" offset="50%" />
            <stop stopColor="#A16207" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-bold tracking-widest uppercase mb-4 text-white"
          >
            VÌ SAO CHỌN VINEX
          </motion.h2>
          <div className="flex items-center justify-center gap-2 overflow-hidden py-2">
            <motion.span 
              initial={{ x: "-100%" }}
              animate={isInView ? { x: 0 } : { x: "-100%" }}
              transition={{ duration: 1, ease: "circOut" }}
              className="w-16 h-[1px] bg-vinex-yellow/60"
            ></motion.span>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0C7 3.86599 3.86599 7 0 7C3.86599 7 7 10.134 7 14C7 10.134 10.134 7 14 7C10.134 7 7 3.86599 7 0Z" fill="#FFC703"/>
              </svg>
            </motion.div>
            <motion.span 
              initial={{ x: "100%" }}
              animate={isInView ? { x: 0 } : { x: "100%" }}
              transition={{ duration: 1, ease: "circOut" }}
              className="w-16 h-[1px] bg-vinex-yellow/60"
            ></motion.span>
          </div>
        </div>

        {/* 5-Column Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5"
        >
          {values.map((val, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`flex flex-col items-center text-center px-4 py-6 group relative ${
                idx !== values.length - 1 ? 'lg:border-r lg:border-white/15' : ''
              }`}
            >
              <motion.div 
                className="mb-6 drop-shadow-[0_2px_10px_rgba(255,199,3,0.2)]"
                whileHover={{ rotate: 8, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <val.icon 
                  size={48} 
                  strokeWidth={1.5} 
                  style={{ stroke: "url(#goldGradientWhy)" }}
                />
              </motion.div>
              <h3 className="text-[15px] md:text-base font-bold mb-3 tracking-wide text-white group-hover:text-vinex-yellow transition-colors duration-300">
                {val.title}
              </h3>
              <p className="text-[13px] md:text-[14px] text-white/70 font-light leading-relaxed max-w-[16rem]">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
