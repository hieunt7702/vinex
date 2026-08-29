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
    <section className="relative pt-[100px] lg:pt-[160px] pb-0 overflow-hidden min-h-[100vh] flex flex-col lg:flex-row items-center justify-center lg:justify-start">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/banner_new.png" 
          alt="VINEX Banner" 
          fill 
          className="object-cover object-center"
          priority
        />
        {/* Lớp phủ mờ nhẹ (30%) để làm nổi bật chữ */}
        <div className="absolute inset-0 bg-gradient-to-r from-vinex-ivory/30 to-transparent"></div>
      </div>



      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 w-full relative z-20">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* Text Content - Left Side */}
          <div className="w-full lg:w-[55%] xl:w-[50%] flex lg:justify-start relative">
            <motion.div 
              className="w-full max-w-[700px] pb-4 lg:pb-32 pt-8 lg:pt-0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className="text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[96px] font-marcellus leading-[1.05] text-vinex-charcoal mb-6 tracking-tight">
                <span className="block text-vinex-teal">{t.hero.title1}</span>
                <span className="block text-vinex-teal whitespace-nowrap">{t.hero.title2}</span>
              </h1>
              
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-8"></div>
              
              <p className="text-vinex-charcoal/80 text-[15px] sm:text-[16px] md:text-[18px] max-w-md mb-10 lg:mb-12 leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 lg:mb-16">
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
