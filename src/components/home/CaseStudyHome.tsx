"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Package, Crown, Globe } from 'lucide-react'; // Placeholder icons

export const CaseStudyHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-20 lg:py-28 bg-vinex-ivory">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Image */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative aspect-[4/3] w-full bg-vinex-charcoal flex items-center justify-center border border-white/10">
              <span className="font-serif italic text-white/40 text-xl">Miss World Stage Placeholder</span>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-vinex-charcoal/50 uppercase mb-4 font-bold block">
              FEATURED PROJECT
            </span>
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-serif text-vinex-charcoal leading-[1.1] mb-6">
              VINEX &times; MISS WORLD 2026
            </h2>
            <p className="text-vinex-charcoal/70 text-[15px] mb-12 leading-relaxed max-w-lg">
              VINEX tự hào là đơn vị cung cấp quà tặng chính thức cho cuộc thi Miss World Vietnam 2026, chế tác riêng những bộ quà tặng mang đậm bản sắc văn hóa Việt để gửi tới bạn bè quốc tế.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <Package className="w-6 h-6 text-vinex-gold mb-3 stroke-[1.5]" />
                <p className="text-[24px] font-serif text-vinex-charcoal mb-1">5,000+</p>
                <p className="text-[9px] font-bold text-vinex-charcoal/50 uppercase tracking-widest">VIP GIFT BOXES</p>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <Crown className="w-6 h-6 text-vinex-gold mb-3 stroke-[1.5]" />
                <p className="text-[24px] font-serif text-vinex-charcoal mb-1">100%</p>
                <p className="text-[9px] font-bold text-vinex-charcoal/50 uppercase tracking-widest">HANDCRAFTED<br/>LACQUER</p>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <Globe className="w-6 h-6 text-vinex-gold mb-3 stroke-[1.5]" />
                <p className="text-[24px] font-serif text-vinex-charcoal mb-1">01</p>
                <p className="text-[9px] font-bold text-vinex-charcoal/50 uppercase tracking-widest">GLOBAL<br/>EVENT</p>
              </div>
            </div>
            
            <Link href={`/${lang}/miss-world-2026`}>
              <button className="w-full sm:w-auto px-8 py-4 bg-vinex-teal text-white font-bold text-[11px] tracking-widest uppercase hover:bg-vinex-charcoal transition-colors flex items-center justify-center gap-2">
                XEM CASE STUDY <span>&rarr;</span>
              </button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
