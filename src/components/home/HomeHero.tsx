"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useDict } from '@/hooks/useDict';
import { Button } from '@/components/ui/Button';

export const HomeHero = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="relative pt-[120px] lg:pt-[160px] pb-0 overflow-hidden min-h-[100vh] flex items-center">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-vinex-ivory z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-vinex-gold/5 rounded-full blur-3xl -mr-40 -mt-40 transform-gpu will-change-transform"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-vinex-teal/5 rounded-full blur-3xl -ml-40 -mb-40 transform-gpu will-change-transform"></div>
      </div>

      {/* Motif Leaf - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-[200px] sm:w-[250px] md:w-[350px] xl:w-[450px] z-10 pointer-events-none opacity-80">
        <motion.div 
          className="w-full relative"
          initial={{ opacity: 0, y: 50, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img 
            src="/images/motif_leaf2.png" 
            alt="Motif Leaf" 
            className="w-full h-auto object-contain origin-bottom-left" 
          />
        </motion.div>
      </div>

      {/* Image Content - Right Side (Moved outside container to stick to bottom of section) */}
      <div className="hidden lg:block absolute right-0 xl:right-[-2%] 2xl:right-0 bottom-0 w-[55%] xl:w-[55%] 2xl:w-[45%] h-[75vh] xl:h-[80vh] z-10 pointer-events-none">
        <motion.div 
          className="w-full h-full relative"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        >
          <Image 
            src="/images/hero_gift.png" 
            alt="VINEX Premium Gift" 
            fill 
            className="object-contain object-bottom right-0 drop-shadow-2xl" 
            priority
            unoptimized
          />
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 w-full relative z-20">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* Text Content - Left Side */}
          <div className="w-full lg:w-[55%] xl:w-[50%] flex lg:justify-start relative">
            <motion.div 
              className="w-full max-w-[700px] pb-16 lg:pb-32 pt-8 lg:pt-0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className="text-[42px] sm:text-[56px] md:text-[72px] lg:text-[80px] xl:text-[96px] font-marcellus leading-[1.05] text-vinex-charcoal mb-6 tracking-tight">
                <span className="block text-vinex-teal">{t.hero.title1}</span>
                <span className="block text-vinex-teal whitespace-nowrap">{t.hero.title2}</span>
              </h1>
              
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-8"></div>
              
              <p className="text-vinex-charcoal/80 text-[16px] md:text-[18px] max-w-md mb-12 leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link href={`/${lang}/qua-tang-doanh-nghiep`}>
                  <Button variant="primary" className="w-full sm:w-auto">
                    {t.hero.cta_primary}
                  </Button>
                </Link>
                <Link href={`/${lang}/request-quote`}>
                  <Button variant="secondary" className="w-full sm:w-auto">
                    {t.hero.cta_secondary} <span className="text-lg leading-none">&rarr;</span>
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-vinex-charcoal uppercase opacity-80">
                <span>{t.hero.badge1}</span>
                <span className="w-1 h-1 rounded-full bg-vinex-charcoal"></span>
                <span>{t.hero.badge2}</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
