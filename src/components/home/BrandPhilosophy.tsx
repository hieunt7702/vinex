"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useDict } from '@/hooks/useDict';

export const BrandPhilosophy = () => {
  const t = useDict();

  return (
    <section className="py-24 lg:py-32 bg-vinex-ivory">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[13px] md:text-[15px] font-bold tracking-[0.2em] text-vinex-gold uppercase block mb-6">
              {t.brand.label}
            </span>
            <h2 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-marcellus leading-[1.2] text-vinex-charcoal mb-12">
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
            <div className="relative aspect-[4/3] lg:aspect-[16/11] w-full bg-vinex-sage/10 border border-vinex-charcoal/10 flex items-center justify-center overflow-hidden">
              <Image 
                src="/images/banner/b_more_than_a_gift.png" 
                alt="More than a gift" 
                fill 
                className="object-cover object-center" 
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
