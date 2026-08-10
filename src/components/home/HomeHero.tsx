"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const HomeHero = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="relative pt-[120px] lg:pt-[140px] pb-20 lg:pb-32 bg-vinex-ivory overflow-hidden">
      {/* Decorative leaf branch in background (placeholder) */}
      <div className="absolute top-0 left-10 w-64 h-64 bg-vinex-sage/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-vinex-teal/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            className="flex-1 w-full pt-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-[52px] sm:text-[64px] md:text-[76px] lg:text-[88px] font-serif leading-[1.1] text-vinex-teal mb-8">
              Vietnam,<br />Beautifully Gifted.
            </h1>
            
            <p className="text-vinex-charcoal/80 text-[16px] md:text-[18px] max-w-md mb-12 leading-relaxed">
              Từ tinh hoa nông sản Việt đến những tặng phẩm được chế tác riêng cho thương hiệu của bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link href={`/${lang}/collections`}>
                <button className="w-full sm:w-auto px-8 py-4 bg-vinex-teal text-white font-bold text-[12px] tracking-widest uppercase hover:bg-vinex-charcoal transition-colors">
                  KHÁM PHÁ BỘ SƯU TẬP
                </button>
              </Link>
              <Link href={`/${lang}/custom-gifts`}>
                <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-vinex-teal text-vinex-teal font-bold text-[12px] tracking-widest uppercase hover:bg-vinex-teal hover:text-white transition-colors flex items-center justify-center gap-2">
                  THIẾT KẾ QUÀ RIÊNG <span>&rarr;</span>
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-vinex-charcoal uppercase">
              <span>PREMIUM CORPORATE GIFTS</span>
              <span className="w-1 h-1 rounded-full bg-vinex-charcoal"></span>
              <span>MADE IN VIETNAM</span>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            className="flex-1 w-full relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[700px] w-full bg-vinex-teal/10 shadow-2xl">
              {/* Image Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-vinex-teal/5 text-vinex-teal">
                <span className="font-serif italic text-2xl opacity-50">VINEX Premium Gift Box</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
