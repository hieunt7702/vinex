"use client";

import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

export const VietnamStory = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true, dragFree: true });

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => { emblaApi.scrollNext(); }, 3000);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <section className="py-16 lg:py-20 bg-vinex-ivory overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col gap-12 xl:gap-16">
          
          {/* Header Content - Top */}
          <motion.div 
            className="text-center xl:text-left"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-vinex-teal uppercase mb-4 font-bold block">{t.vietnam.label}</span>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-6 mx-auto xl:mx-0"></div>
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-marcellus text-vinex-teal leading-[1.1]">
              {t.vietnam.headline.replace('\n', ' ')}
            </h2>
          </motion.div>

          {/* Bottom Row: Description + Images */}
          <div className="flex flex-col xl:flex-row items-center gap-10 xl:gap-12 w-full">
            
            {/* Left Block: Description & CTA */}
            <motion.div 
              className="xl:w-[320px] shrink-0 text-center xl:text-left border-l-[3px] border-vinex-gold pl-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-vinex-charcoal/80 text-[15px] leading-relaxed mb-8 max-w-xl mx-auto xl:mx-0">
                {t.vietnam.desc}
              </p>
              <Link href={`/${lang}/gioi-thieu`} className="inline-block">
                <Button variant="secondary">
                  {t.vietnam.cta} <span>&rarr;</span>
                </Button>
              </Link>
            </motion.div>

            {/* Right Block: Flow Content (5 Images in Carousel) */}
            <div className="xl:flex-1 w-full overflow-hidden xl:border-l xl:border-vinex-charcoal/10 xl:pl-8">
              <div className="overflow-hidden py-4" ref={emblaRef}>
                <div className="flex gap-4 sm:gap-6 xl:gap-8 cursor-grab active:cursor-grabbing">
                  {[...t.vietnam.steps, ...t.vietnam.steps].map((step, idx) => {
                    const originalIdx = idx % t.vietnam.steps.length;
                    return (
                      <div key={`${step.title}-${idx}`} className="flex items-center flex-[0_0_auto]">
                        <motion.div 
                          className="flex flex-col items-center text-center w-[120px] sm:w-[140px] relative z-10"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.5, delay: originalIdx * 0.15 }}
                        >
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 flex items-center justify-center">
                            <Image 
                              src={`/images/story${originalIdx + 1}.png`} 
                              alt={step.title} 
                              fill 
                              className="object-contain drop-shadow-sm mix-blend-multiply pointer-events-none" 
                            />
                          </div>
                          <h3 className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-vinex-charcoal mb-2 leading-tight">
                            {step.title}
                          </h3>
                          <p className="text-[11px] sm:text-[12px] text-vinex-charcoal/60 leading-snug px-2">
                            {step.desc}
                          </p>
                        </motion.div>

                        {/* Arrow separator (always show in loop) */}
                        <motion.div 
                          className="mx-2 sm:mx-6 -mt-10 sm:-mt-16 text-vinex-charcoal/20 hidden sm:block"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: originalIdx * 0.15 + 0.3 }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
