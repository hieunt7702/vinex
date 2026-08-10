"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const MissWorldSection = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-28 bg-vinex-teal text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        {/* Placeholder for Miss World Background Event Image - subtly blended into Teal */}
        <div className="w-full h-full bg-vinex-charcoal mix-blend-multiply"></div>
      </div>
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xl md:text-2xl font-bold tracking-widest text-vinex-gold">VINEX</span>
              <span className="text-xl text-white/50">×</span>
              <span className="text-xl md:text-2xl font-bold tracking-widest text-white">MISS WORLD 2026</span>
            </div>
            
            <h2 className="text-4xl md:text-[44px] font-bold mb-6 leading-tight">
              Tôn vinh vẻ đẹp <br/>
              <span className="text-vinex-gold italic font-serif">& di sản Việt Nam</span>
            </h2>
            
            <p className="text-white/80 mb-10 text-lg leading-relaxed font-light max-w-xl">
              Tự hào là nhà tài trợ quà tặng chính thức cho Miss World 2026. Bộ sưu tập giới hạn lấy cảm hứng từ tinh hoa nông sản Việt, mang thông điệp về sự phát triển bền vững và vẻ đẹp vượt thời gian đến bạn bè quốc tế.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${lang}/miss-world-2026`}>
                <button className="px-10 py-4 bg-vinex-gold text-vinex-charcoal font-semibold uppercase tracking-wider text-[14px] hover:bg-white transition-colors duration-300 w-full sm:w-auto text-center rounded-lg">
                  Khám phá câu chuyện
                </button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative aspect-square bg-vinex-charcoal/40 rounded-[24px] overflow-hidden group border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
              <div className="absolute inset-0 bg-vinex-charcoal/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-vinex-ivory/5">
                <span className="text-[11px] font-medium uppercase tracking-widest mb-1">Gift Set 1</span>
                <span className="text-[10px] opacity-70">1:1 Aspect Ratio</span>
              </div>
            </div>
            <div className="relative aspect-square bg-vinex-charcoal/40 rounded-[24px] overflow-hidden group border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.2)] mt-12">
              <div className="absolute inset-0 bg-vinex-charcoal/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-vinex-ivory/5">
                <span className="text-[11px] font-medium uppercase tracking-widest mb-1">Gift Set 2</span>
                <span className="text-[10px] opacity-70">1:1 Aspect Ratio</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
