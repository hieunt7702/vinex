"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Leaf, Gem, Package } from 'lucide-react';
import { useDict } from '@/hooks/useDict';

const stepIcons = [Leaf, Gem, Package];

export const VietnamStory = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-20 lg:py-28 bg-vinex-ivory">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Header Content */}
          <motion.div 
            className="lg:w-[380px] shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-vinex-charcoal/50 uppercase mb-4 font-bold block">{t.vietnam.label}</span>
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-marcellus text-vinex-charcoal leading-[1.1] mb-6 whitespace-pre-line">
              {t.vietnam.headline}
            </h2>
            <p className="text-vinex-charcoal/70 text-[15px] mb-8 leading-relaxed max-w-sm">
              {t.vietnam.desc}
            </p>
            <Link href={`/${lang}/gioi-thieu`}>
              <button className="text-vinex-charcoal font-bold uppercase tracking-widest text-[11px] hover:text-vinex-teal transition-colors flex items-center gap-2">
                {t.vietnam.cta} <span>&rarr;</span>
              </button>
            </Link>
          </motion.div>

          {/* Flow Content */}
          <div className="lg:flex-1 w-full pb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-6 md:gap-12 relative px-4">
              
              {/* Connecting Line */}
              <div className="hidden sm:block absolute top-[32px] left-[15%] right-[15%] h-[1px] bg-vinex-charcoal/10 z-0" />

              {t.vietnam.steps.map((step, idx) => {
                const Icon = stepIcons[idx];
                return (
                  <motion.div 
                    key={idx}
                    className="flex flex-col items-center text-center w-[160px] relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                  >
                    <div className="w-16 h-16 bg-vinex-ivory flex items-center justify-center mb-6">
                      <Icon className="w-10 h-10 text-vinex-gold stroke-[1.5]" />
                    </div>
                    <h3 className="text-[11px] font-bold tracking-widest uppercase text-vinex-charcoal mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[12px] text-vinex-charcoal/50 leading-snug">
                      {step.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
