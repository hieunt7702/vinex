"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';

export const HomeHero = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="relative pt-[120px] lg:pt-[160px] pb-0 bg-vinex-ivory overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch">
          
          {/* Text Content - Left Side */}
          <div className="w-full lg:w-[55%] xl:w-1/2 flex lg:justify-end">
            <motion.div 
              className="w-full max-w-[700px] px-4 md:px-8 xl:px-12 pb-16 lg:pb-32 lg:pr-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className="text-[42px] sm:text-[56px] md:text-[72px] lg:text-[80px] xl:text-[96px] font-marcellus leading-[1.05] text-vinex-charcoal mb-6 tracking-tight">
                <span className="block text-vinex-teal">{t.hero.title1}</span>
                <span className="block text-vinex-teal sm:whitespace-nowrap">{t.hero.title2}</span>
              </h1>
              
              <div className="w-[60px] h-[3px] bg-vinex-gold mb-8"></div>
              
              <p className="text-vinex-charcoal/80 text-[16px] md:text-[18px] max-w-md mb-12 leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link href={`/${lang}/qua-tang-doanh-nghiep`}>
                  <button className="relative overflow-hidden group w-full sm:w-auto px-8 py-4 bg-vinex-teal text-white font-bold text-[11px] tracking-[0.15em] uppercase transition-colors shadow-lg hover:shadow-xl">
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine z-20" />
                    <span className="relative z-10">{t.hero.cta_primary}</span>
                  </button>
                </Link>
                <Link href={`/${lang}/request-quote`}>
                  <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-vinex-teal text-vinex-teal font-bold text-[11px] tracking-[0.15em] uppercase hover:bg-vinex-teal hover:text-white transition-colors flex items-center justify-center gap-2">
                    {t.hero.cta_secondary} <span className="text-lg leading-none">&rarr;</span>
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-vinex-charcoal uppercase opacity-80">
                <span>{t.hero.badge1}</span>
                <span className="w-1 h-1 rounded-full bg-vinex-charcoal"></span>
                <span>{t.hero.badge2}</span>
              </div>
            </motion.div>
          </div>

          {/* Image Content - Right Side (Bleeds to edge) */}
          <div className="w-full lg:w-[45%] xl:w-1/2 relative min-h-[500px] lg:min-h-0 lg:-mr-[calc((100vw-1400px)/2)]">
            <motion.div 
              className="absolute inset-0 bg-vinex-teal/5 flex flex-col items-center justify-center border-l border-vinex-teal/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            >
              <span className="font-bold tracking-widest uppercase text-vinex-teal/40 text-sm mb-2 z-10">Premium Gift Box</span>
              <span className="text-xs text-vinex-teal/30 z-10">Image Placeholder</span>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
