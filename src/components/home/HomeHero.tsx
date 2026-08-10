"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const HomeHero = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="relative pt-[120px] lg:pt-[160px] pb-0 bg-vinex-ivory overflow-hidden flex flex-col lg:flex-row items-stretch">
      {/* Text Content - Left Side */}
      <div className="w-full lg:w-1/2 flex lg:justify-end">
        <motion.div 
          className="w-full max-w-[700px] px-4 md:px-8 xl:pl-12 xl:pr-16 pb-16 lg:pb-32"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-[56px] sm:text-[72px] md:text-[84px] lg:text-[96px] leading-[1.05] text-vinex-charcoal mb-8 tracking-tight">
            <span className="block text-vinex-teal font-serif italic pr-4">Vietnam,</span>
            <span className="block text-vinex-teal font-marcellus">Beautifully Gifted.</span>
          </h1>
          
          <p className="text-vinex-charcoal/80 text-[16px] md:text-[18px] max-w-md mb-12 leading-relaxed">
            Từ tinh hoa nông sản Việt đến những tặng phẩm được chế tác riêng cho thương hiệu của bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href={`/${lang}/collections`}>
              <button className="w-full sm:w-auto px-8 py-4 bg-vinex-teal text-white font-bold text-[11px] tracking-[0.15em] uppercase transition-colors">
                KHÁM PHÁ BỘ SƯU TẬP
              </button>
            </Link>
            <Link href={`/${lang}/custom-gifts`}>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-vinex-teal text-vinex-teal font-bold text-[11px] tracking-[0.15em] uppercase hover:bg-vinex-teal hover:text-white transition-colors flex items-center justify-center gap-2">
                THIẾT KẾ QUÀ RIÊNG <span className="text-lg leading-none">&rarr;</span>
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-vinex-charcoal uppercase opacity-80">
            <span>PREMIUM CORPORATE GIFTS</span>
            <span className="w-1 h-1 rounded-full bg-vinex-charcoal"></span>
            <span>MADE IN VIETNAM</span>
          </div>
        </motion.div>
      </div>

      {/* Image Content - Right Side (Bleeds to edge) */}
      <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-0">
        <motion.div 
          className="absolute inset-0 bg-vinex-teal/5 flex items-center justify-center border-l border-vinex-teal/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        >
          <span className="font-serif italic text-2xl text-vinex-teal/40 z-10">VINEX Premium Gift Box</span>
        </motion.div>
      </div>
    </section>
  );
};
