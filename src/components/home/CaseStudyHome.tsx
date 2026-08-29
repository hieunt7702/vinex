"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Package, Crown, Globe } from 'lucide-react';
import { useDict } from '@/hooks/useDict';
import { Button } from '@/components/ui/Button';

export const CaseStudyHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-16 lg:py-20 bg-vinex-ivory overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
          
          {/* Left: Image */}
          <motion.div 
            className="flex-1 w-full flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative h-full min-h-[350px] lg:min-h-0 w-full overflow-hidden rounded-sm bg-vinex-ivory shadow-xl group">
              <Image src="/images/missworld.png" alt="Miss World 2026" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              
              {/* Top Left Gradient Bracket (Inner) */}
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-28 opacity-80 group-hover:opacity-100"></div>
              <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-28 opacity-80 group-hover:opacity-100"></div>
              
              {/* Bottom Right Gradient Bracket (Inner) */}
              <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-gradient-to-l from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-28 opacity-80 group-hover:opacity-100"></div>
              <div className="absolute bottom-0 right-0 w-[2px] h-16 bg-gradient-to-t from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-28 opacity-80 group-hover:opacity-100"></div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-vinex-teal uppercase mb-4 font-bold block">
              {t.casestudy.label}
            </span>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-6"></div>
            <h2 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[44px] xl:text-[48px] font-marcellus text-vinex-teal leading-[1.1] mb-6 whitespace-nowrap">
              {t.casestudy.headline}
            </h2>
            <p className="text-vinex-charcoal/70 text-[15px] mb-12 leading-relaxed max-w-lg">
              {t.casestudy.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 w-full max-w-lg">
              <div className="flex items-center gap-4 text-left">
                <div className="relative w-10 h-10 shrink-0">
                  <Image src="/images/miss1.png" alt="Icon 1" fill className="object-contain object-center" />
                </div>
                <div>
                  <p className="text-[20px] sm:text-[24px] font-marcellus text-vinex-teal leading-none mb-1.5">{t.casestudy.stat1_num}</p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-vinex-charcoal/50 uppercase tracking-widest leading-none">{t.casestudy.stat1_label}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="relative w-10 h-10 shrink-0">
                  <Image src="/images/miss2.png" alt="Icon 2" fill className="object-contain object-center" />
                </div>
                <div>
                  <p className="text-[20px] sm:text-[24px] font-marcellus text-vinex-teal leading-none mb-1.5">{t.casestudy.stat2_num}</p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-vinex-charcoal/50 uppercase tracking-widest leading-none">{t.casestudy.stat2_label}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="relative w-10 h-10 shrink-0">
                  <Image src="/images/miss3.png" alt="Icon 3" fill className="object-contain object-center" />
                </div>
                <div>
                  <p className="text-[20px] sm:text-[24px] font-marcellus text-vinex-teal leading-none mb-1.5">{t.casestudy.stat3_num}</p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-vinex-charcoal/50 uppercase tracking-widest leading-none">{t.casestudy.stat3_label}</p>
                </div>
              </div>
            </div>
            
            <Link href={`/${lang}/request-quote`}>
              <Button variant="primary" className="w-full sm:w-auto shadow-[0_10px_40px_-10px_rgba(13,89,98,0.7)] hover:shadow-[0_15px_50px_-10px_rgba(13,89,98,0.8)] transition-shadow">
                {t.casestudy.cta} <span>&rarr;</span>
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
