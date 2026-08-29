"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useDict } from '@/hooks/useDict';

export const BrandPhilosophy = () => {
  const t = useDict();

  return (
    <section className="py-16 lg:py-20 bg-vinex-ivory">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[13px] md:text-[15px] font-bold tracking-[0.2em] text-vinex-teal uppercase block mb-4">
              {t.brand.label}
            </span>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-6"></div>
            <h2 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-marcellus leading-[1.2] text-vinex-teal mb-12">
              {t.brand.headline}
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-vinex-charcoal/60 uppercase">
              <span>{t.brand.tag1}</span>
              <span className="w-1 h-1 rounded-full bg-vinex-charcoal/60"></span>
              <span>{t.brand.tag2}</span>
              <span className="w-1 h-1 rounded-full bg-vinex-charcoal/60"></span>
              <span>{t.brand.tag3}</span>
              <span className="w-1 h-1 rounded-full bg-vinex-charcoal/60"></span>
              <span>{t.brand.tag4}</span>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative aspect-[4/3] lg:aspect-[16/11] w-full bg-vinex-sage/10 flex items-center justify-center overflow-hidden rounded-sm shadow-xl group">
              <Image 
                src="/images/banner/b_more_than_a_gift.png" 
                alt="More than a gift" 
                fill 
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105" 
              />
              
              {/* Top Left Gradient Bracket (Inner) */}
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-28 opacity-80 group-hover:opacity-100"></div>
              <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-28 opacity-80 group-hover:opacity-100"></div>
              
              {/* Bottom Right Gradient Bracket (Inner) */}
              <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-gradient-to-l from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-28 opacity-80 group-hover:opacity-100"></div>
              <div className="absolute bottom-0 right-0 w-[2px] h-16 bg-gradient-to-t from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-28 opacity-80 group-hover:opacity-100"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
