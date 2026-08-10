"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ShieldCheck, Edit3, MapPin, Briefcase } from 'lucide-react';
import { useDict } from '@/hooks/useDict';

const featureIcons = [ShieldCheck, Edit3, MapPin, Briefcase];

export const WhyVinexHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-20 lg:py-24 bg-vinex-teal text-white border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16">
          
          {/* Left Side: Heading & Features Grid (70%) */}
          <div className="w-full lg:w-[70%] flex flex-col justify-between">
            <div className="mb-10">
              <h2 className="text-[28px] sm:text-[36px] font-marcellus text-vinex-gold tracking-wider uppercase">
                {t.why.headline}
              </h2>
              <div className="w-[50px] h-[2px] bg-vinex-gold mt-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 mb-10">
              {t.why.features.map((item, idx) => {
                const Icon = featureIcons[idx];
                return (
                  <motion.div 
                    key={idx}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                      <Icon className="w-5 h-5 text-vinex-gold stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold tracking-widest text-vinex-gold uppercase mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-white/80 font-light text-[13px] leading-relaxed max-w-[280px]">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href={`/${lang}/lien-he`}>
                <button className="relative overflow-hidden group px-8 py-4 bg-vinex-gold text-vinex-charcoal font-bold text-[11px] tracking-widest uppercase hover:bg-white transition-colors w-full sm:w-auto">
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine z-20" />
                  <span className="relative z-10">{t.why.cta}</span>
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Stats (30%) */}
          <div className="w-full lg:w-[30%] flex flex-row lg:flex-col justify-between lg:justify-center gap-8 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-16">
            {t.why.stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-2 lg:gap-4"
              >
                <span className="text-[36px] lg:text-[44px] font-marcellus text-vinex-gold leading-none shrink-0 min-w-[70px]">
                  {stat.number}
                </span>
                <span className="text-[10px] font-bold tracking-[0.15em] text-white/75 uppercase whitespace-pre-line leading-snug">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
