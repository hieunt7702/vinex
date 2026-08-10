"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';

export const CorporateGiftingHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-20 lg:py-28 bg-vinex-ivory border-t border-vinex-charcoal/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Column 1: Text & Button */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-[32px] sm:text-[40px] font-marcellus text-vinex-charcoal leading-tight mb-6 whitespace-pre-line">
              {t.corporate.headline}
            </h2>
            <p className="text-vinex-charcoal/70 text-[15px] mb-10 leading-relaxed">
              {t.corporate.desc}
            </p>
            <Link href={`/${lang}/request-quote`}>
              <button className="px-6 py-4 bg-transparent border border-vinex-gold text-vinex-charcoal font-bold text-[11px] tracking-widest uppercase hover:bg-vinex-gold transition-colors w-full sm:w-auto">
                {t.corporate.cta}
              </button>
            </Link>
          </motion.div>

          {/* Column 2: Image */}
          <motion.div 
            className="lg:col-span-5 h-full"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[400px] w-full bg-vinex-teal flex items-center justify-center text-vinex-gold">
              <span className="font-marcellus italic text-2xl opacity-70">VINEX Gift Box Image</span>
            </div>
          </motion.div>

          {/* Column 3: List */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <div className="flex flex-col">
              {t.corporate.occasions.map((title, idx) => (
                <Link 
                  key={idx} 
                  href={`/${lang}/qua-tang-doanh-nghiep`}
                  className={`group flex items-center justify-between py-6 ${idx !== t.corporate.occasions.length - 1 ? 'border-b border-vinex-charcoal/10' : ''}`}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-vinex-teal font-bold text-[14px]">0{idx + 1}</span>
                    <span className="text-vinex-charcoal font-bold text-[13px] tracking-widest uppercase group-hover:text-vinex-teal transition-colors">
                      {title}
                    </span>
                  </div>
                  <span className="text-vinex-charcoal group-hover:translate-x-2 transition-transform duration-300">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
