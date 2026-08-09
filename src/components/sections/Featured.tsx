"use client";

import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";

export const Featured = () => {
  const container = useRef<HTMLDivElement>(null);
  const isInView = useInView(container, { once: true, margin: "-10%" });

  const collections = [
    { title: "PREMIUM", img: "/images/product/bao_bi_qua_tang/p1.png" },
    { title: "EXECUTIVE", img: "/images/product/bao_bi_qua_tang/p2.png" },
    { title: "BUSINESS", img: "/images/product/bao_bi_qua_tang/p3.png" },
    { title: "FAMILY", img: "/images/product/bao_bi_qua_tang/p4.png" },
    { title: "SPECIAL", img: "/images/product/bao_bi_qua_tang/p5.png" },
  ];

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 80, damping: 20 }
    }
  };

  return (
    <section ref={container} className="py-24 bg-white text-vinex-black">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-3xl md:text-4xl font-light text-vinex-yellow mb-4 block font-script tracking-wide">
              Giải pháp
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-vinex-blue tracking-tight leading-tight mb-4">
              QUÀ TẶNG DOANH NGHIỆP
            </h2>
            <p className="text-sm text-black/60 font-light max-w-xl">
              Một món quà cần phù hợp với người nhận, thể hiện đúng tinh thần thương hiệu và tạo trải nghiệm khi mở hộp.
            </p>
          </motion.div>
          
          <motion.button 
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center gap-3 px-6 py-3.5 text-xs font-bold tracking-widest text-vinex-yellow bg-transparent border border-vinex-yellow transition-all rounded-full uppercase whitespace-nowrap overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-vinex-yellow origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">XEM TẤT CẢ BỘ SƯU TẬP</span>
            <motion.div className="relative z-10 group-hover:text-white transition-colors duration-300" transition={{ type: "spring", stiffness: 400, damping: 25 }} whileHover={{ x: 4 }}>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>

        {/* 5-Card Grid */}
        <motion.div 
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {collections.map((col, idx) => (
            <motion.div 
              key={idx} 
              variants={cardVariants}
              whileHover="hover"
              className="collection-card group flex flex-col bg-white border border-gray-100 rounded-3xl transition-all overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-vinex-yellow/30"
            >
              {/* Product Image Wrapper */}
              <div className="w-full aspect-[4/5] md:aspect-square overflow-hidden relative bg-black/5">
                <motion.img 
                  src={col.img} 
                  alt={`BỘ SƯU TẬP ${col.title}`} 
                  className="w-full h-full object-cover pointer-events-none"
                  variants={{
                    hover: { scale: 1.03, transition: { duration: 1.5, ease: "easeOut" } }
                  }}
                />
                
                {/* Luxury shimmer sweep */}
                <motion.div 
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                  variants={{
                    hover: { x: "100%", transition: { duration: 1, ease: "easeInOut" } }
                  }}
                />
              </div>

              {/* Card Footer Details */}
              <div className="px-5 py-4 flex items-center justify-between bg-white relative z-10">
                <div>
                  <span className="text-[10px] tracking-widest text-black/50 block font-semibold mb-0.5">BỘ SƯU TẬP</span>
                  <motion.h3 
                    variants={{ hover: { color: "#FFC703" } }}
                    className="text-sm font-extrabold text-vinex-blue tracking-wider uppercase transition-colors duration-300"
                  >
                    {col.title}
                  </motion.h3>
                </div>
                
                {/* Micro Action Button */}
                <motion.div 
                  variants={{ hover: { scale: 1.1, backgroundColor: "#FFC703" } }}
                  className="w-7 h-7 rounded-full bg-vinex-blue flex items-center justify-center text-white shadow-sm transition-colors duration-300"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
