"use client";

import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import Image from 'next/image';

export const WhyVinexHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-8 lg:py-10 bg-vinex-ivory relative overflow-hidden">
      {/* Background motif on the right */}
      <div className="absolute right-[-10%] sm:right-[-5%] xl:right-[-3%] top-1/2 -translate-y-1/2 h-[180px] md:h-[220px] xl:h-[280px] aspect-square z-0 opacity-40 pointer-events-none mix-blend-multiply">
        <Image src="/images/motif_leaf3.png" alt="Motif" fill className="object-contain object-right" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 relative z-10 w-full">
        
        {/* Title */}
        <motion.div 
          className="mb-8 xl:mb-12"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-[18px] xl:text-[20px] font-marcellus text-vinex-teal tracking-widest uppercase font-bold mb-4">
            {t.why.headline}
          </h2>
          <div className="w-[60px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent"></div>
        </motion.div>

        {/* Items Container */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-max gap-8 xl:gap-12 pr-8 pb-4">
            {t.why.features.map((item, idx) => (
              <motion.div 
                key={idx}
                className="flex items-start xl:items-center gap-4 w-[240px] xl:w-[280px] shrink-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="relative w-10 h-10 xl:w-12 xl:h-12 shrink-0 mt-1 xl:mt-0">
                  <Image 
                    src={`/images/why${idx + 1}.png`} 
                    alt={item.title} 
                    fill 
                    className="object-contain drop-shadow-sm mix-blend-multiply" 
                  />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-vinex-charcoal mb-1.5 leading-tight">{item.title}</h3>
                  <p className="text-[12px] text-vinex-charcoal/70 leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
