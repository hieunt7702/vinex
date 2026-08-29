"use client";

import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { useDict } from '@/hooks/useDict';
import { Button } from '@/components/ui/Button';

import Image from 'next/image';

const stepImages = [
  '/images/des1.png',
  '/images/des2.png',
  '/images/des3.png',
  '/images/des4.png'
];

export const BespokeServiceHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => { emblaApi.scrollNext(); }, 3000);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <section className="py-12 lg:py-20 bg-vinex-teal text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col xl:flex-row gap-16 xl:gap-12 items-start">
          
          {/* Left Content */}
          <motion.div 
            className="xl:w-[320px] shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-[32px] sm:text-[40px] font-marcellus leading-[1.1] mb-6 whitespace-pre-line">
              {t.bespoke.headline}
            </h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-8"></div>
            <p className="text-white/80 text-[14px] leading-relaxed mb-10 whitespace-pre-line">
              {t.bespoke.desc}
            </p>
            <Link href={`/${lang}/bao-bi-qua-tang`}>
              <Button variant="gold" className="w-full sm:w-auto">
                {t.bespoke.cta} <span>&rarr;</span>
              </Button>
            </Link>
          </motion.div>

          {/* Right Content (Cards) */}
          <div className="xl:flex-1 w-full overflow-hidden">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {[...t.bespoke.steps, ...t.bespoke.steps].map((step, idx) => {
                  const originalIdx = idx % t.bespoke.steps.length;
                  return (
                  <motion.div 
                    key={`${step.id}-${idx}`}
                    className="flex-[0_0_260px] md:flex-[0_0_280px] lg:flex-[0_0_300px] min-w-0"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: originalIdx * 0.1, ease: "easeOut" }}
                  >
                    <div className="w-full aspect-[4/3] mb-6 relative overflow-hidden group shadow-lg bg-vinex-teal rounded-sm">
                       <Image 
                         src={stepImages[originalIdx]} 
                         alt={step.title} 
                         fill 
                         className="object-cover transition-transform duration-700 group-hover:scale-105" 
                       />
                       
                       {/* Top Left Gradient Bracket (Inner) */}
                       <div className="absolute top-0 left-0 w-12 h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-20 opacity-80 group-hover:opacity-100"></div>
                       <div className="absolute top-0 left-0 w-[2px] h-12 bg-gradient-to-b from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-20 opacity-80 group-hover:opacity-100"></div>
                       
                       {/* Bottom Right Gradient Bracket (Inner) */}
                       <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-gradient-to-l from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-20 opacity-80 group-hover:opacity-100"></div>
                       <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-gradient-to-t from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-20 opacity-80 group-hover:opacity-100"></div>

                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]">{step.title}</span>
                       </div>
                    </div>
                    <div>
                      <div className="flex items-end gap-3 mb-3">
                        <span className="text-vinex-gold font-bold text-[16px]">{step.id}</span>
                        <h3 className="text-[13px] font-bold tracking-widest uppercase">{step.title}</h3>
                      </div>
                      <p className="text-white/60 text-[13px] font-light leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                )})}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
