"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';

export const FinalCTA = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-16 lg:py-20 bg-vinex-teal text-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          
          <motion.div 
            className="lg:max-w-[65%]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-marcellus leading-[1.2] mb-4">
              {t.cta.headline}
            </h2>
            <p className="text-white/80 text-[15px] leading-relaxed max-w-md">
              {t.cta.desc}
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 lg:w-auto w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <Link href={`/${lang}/request-quote`}>
              <button className="relative overflow-hidden group w-full sm:w-auto px-8 py-4 bg-vinex-gold text-vinex-charcoal font-bold text-[11px] tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center gap-2">
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine z-20" />
                <span className="relative z-10">{t.cta.cta_primary} <span>&rarr;</span></span>
              </button>
            </Link>
            <Link href={`/${lang}/lien-he`}>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white text-white font-bold text-[11px] tracking-widest uppercase hover:bg-white hover:text-vinex-teal transition-colors flex items-center justify-center">
                {t.cta.cta_secondary}
              </button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
