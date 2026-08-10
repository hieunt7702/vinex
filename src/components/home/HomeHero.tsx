"use client";

import { motion } from "framer-motion";
import { getDictionary } from "@/dictionaries";
import { usePathname } from 'next/navigation';

export const HomeHero = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const dict = getDictionary(lang as 'en' | 'vi');

  return (
    <section className="relative min-h-[85vh] bg-vinex-ivory flex flex-col justify-center items-center pt-32 pb-24 text-center lg:text-left px-4 md:px-8 xl:px-12 overflow-hidden">
      
      {/* Background Decor: Mảng cong lớn, không texture */}
      <div className="absolute top-0 right-0 w-[50vw] h-[100vh] bg-white rounded-bl-[120px] pointer-events-none z-0 hidden lg:block shadow-[inset_10px_-10px_30px_rgba(0,0,0,0.02)]"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-xs sm:text-sm tracking-[0.2em] text-vinex-teal uppercase mb-6 font-bold inline-block">
              VINEX - ENDURING EXCELLENCE
            </span>
            <h1 className="text-[40px] sm:text-5xl lg:text-[64px] leading-[1.1] font-bold text-vinex-charcoal max-w-2xl mb-8">
              {dict.hero.title1} <br className="hidden md:block"/>
              <span className="text-vinex-charcoal">{dict.hero.title2}</span>
            </h1>
            <p className="text-base sm:text-lg text-vinex-charcoal/80 max-w-xl mb-12 leading-relaxed font-light">
              {dict.hero.subtitle}
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row w-full sm:w-auto gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-vinex-teal text-white rounded-lg font-semibold text-[15px] transition-all w-full sm:w-auto"
            >
              {dict.hero.cta_collection}
            </motion.button>
          </motion.div>
        </div>

        {/* Image - 1:1 Aspect Ratio Box */}
        <motion.div 
          className="flex-1 w-full max-w-[560px] lg:max-w-none"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          <div className="relative w-full aspect-square bg-white rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(36,49,58,0.05)] border border-vinex-teal/5">
            {/* Placeholder for Premium Gift Box Image */}
            <div className="w-full h-full flex flex-col items-center justify-center text-vinex-charcoal/30 bg-vinex-ivory/50">
              <span className="text-sm font-semibold tracking-widest uppercase mb-2">Premium Gift Box</span>
              <span className="text-xs">1:1 Aspect Ratio</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
