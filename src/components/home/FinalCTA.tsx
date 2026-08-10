"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const FinalCTA = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-24 lg:py-32 bg-vinex-teal text-white relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1605335123985-e6fba040f98d?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center mix-blend-color-dodge opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-vinex-teal via-vinex-teal/80 to-transparent pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          
          <motion.div 
            className="lg:max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-[40px] sm:text-[48px] lg:text-[56px] font-serif leading-[1.1] mb-6">
              LET'S CREATE<br />SOMETHING MEMORABLE.
            </h2>
            <p className="text-white/80 text-[15px] leading-relaxed max-w-md">
              Bạn đang tìm kiếm một món quà xứng đáng với thương hiệu của mình?
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
              <button className="w-full sm:w-auto px-8 py-4 bg-vinex-gold text-vinex-charcoal font-bold text-[11px] tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center gap-2">
                BẮT ĐẦU DỰ ÁN <span>&rarr;</span>
              </button>
            </Link>
            <Link href={`/${lang}/contact`}>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white text-white font-bold text-[11px] tracking-widest uppercase hover:bg-white hover:text-vinex-teal transition-colors flex items-center justify-center">
                NHẬN CATALOGUE
              </button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
