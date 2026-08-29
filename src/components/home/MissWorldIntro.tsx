"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useDict } from '@/hooks/useDict';

export const MissWorldIntro = () => {
  const t = useDict();

  return (
    <section className="py-24 px-4 bg-white overflow-hidden relative border-b border-[#E8E4D9]">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 w-full max-w-4xl"
        >
          <div className="inline-flex items-center gap-6 mb-8 justify-center flex-wrap">
            <h2 className="text-3xl md:text-5xl font-marcellus text-vinex-teal tracking-wide">{t.missworld.title1}</h2>
            <span className="text-xl text-vinex-gold">×</span>
            <h2 className="text-3xl md:text-5xl font-marcellus text-vinex-teal tracking-wide uppercase">{t.missworld.title2}</h2>
          </div>
          <div className="w-[80px] h-[2px] bg-vinex-gold mx-auto mb-10"></div>
          
          <p className="text-vinex-charcoal/80 text-base md:text-lg font-light leading-relaxed mb-8">
            {t.missworld.desc}
          </p>
          
          <div className="inline-block px-6 py-2 border border-vinex-teal/20 rounded-full text-vinex-teal text-[11px] font-bold tracking-widest uppercase">
            {t.missworld.label}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-5xl aspect-[21/9] relative rounded-sm overflow-hidden group shadow-xl"
        >
          <Image 
            src="/images/banner/b_miss_world_2026.png" 
            alt={t.missworld.title2} 
            fill 
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105" 
          />
          
          {/* Top Left Gradient Bracket (Inner) */}
          <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-28 opacity-80 group-hover:opacity-100"></div>
          <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-28 opacity-80 group-hover:opacity-100"></div>
          
          {/* Bottom Right Gradient Bracket (Inner) */}
          <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-gradient-to-l from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-28 opacity-80 group-hover:opacity-100"></div>
          <div className="absolute bottom-0 right-0 w-[2px] h-16 bg-gradient-to-t from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-28 opacity-80 group-hover:opacity-100"></div>
        </motion.div>
      </div>
    </section>
  );
};
