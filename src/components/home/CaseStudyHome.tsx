"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const CaseStudyHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-28 bg-white px-4 md:px-8 xl:px-12 border-t border-vinex-charcoal/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-[11px] sm:text-xs tracking-[0.2em] text-vinex-teal uppercase mb-4 font-bold block">FEATURED CASE STUDY</span>
            <h2 className="text-[32px] sm:text-4xl font-bold text-vinex-charcoal">Dự án Thực Tế: Miss World 2026</h2>
          </div>
          <Link href={`/${lang}/case-studies`}>
            <button className="text-vinex-charcoal font-bold uppercase tracking-widest text-[13px] hover:text-vinex-teal transition-colors border-b border-transparent hover:border-vinex-teal pb-1">
              Xem toàn bộ dự án
            </button>
          </Link>
        </div>

        <motion.div 
          className="relative bg-vinex-ivory rounded-[32px] overflow-hidden border border-vinex-charcoal/5 flex flex-col lg:flex-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Image Part */}
          <div className="lg:w-1/2 relative min-h-[400px]">
            <div className="absolute inset-0 bg-vinex-sage/10">
              {/* Image Placeholder */}
              <div className="w-full h-full flex items-center justify-center text-vinex-charcoal/30">
                <span className="font-semibold tracking-widest uppercase text-xs">Miss World Event Photo</span>
              </div>
            </div>
          </div>
          
          {/* Content Part */}
          <div className="lg:w-1/2 p-10 md:p-14 lg:p-20 flex flex-col justify-center">
            <h3 className="text-3xl lg:text-4xl font-bold text-vinex-charcoal mb-6">The Crown Collection</h3>
            <p className="text-vinex-charcoal/70 font-light mb-10 leading-relaxed text-[16px]">
              Thách thức đặt ra là tạo ra một bộ quà tặng vừa thể hiện đẳng cấp của cuộc thi sắc đẹp lớn nhất thế giới, vừa truyền tải được tinh hoa nông sản Việt. VINEX đã thiết kế bộ hộp sơn mài độc bản chứa đựng hạt điều tẩm vị thượng hạng và trà sen Tây Hồ, tạo tiếng vang lớn trong đêm tiệc VIP.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-4xl font-bold text-vinex-teal mb-2">5,000+</p>
                <p className="text-[11px] font-bold text-vinex-charcoal/50 uppercase tracking-widest">Hộp Quà VIP</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-vinex-teal mb-2">100%</p>
                <p className="text-[11px] font-bold text-vinex-charcoal/50 uppercase tracking-widest">Sơn Mài Thủ Công</p>
              </div>
            </div>
            
            <div>
              <Link href={`/${lang}/miss-world-2026`}>
                <button className="px-10 py-4 bg-transparent border border-vinex-teal text-vinex-teal font-semibold uppercase tracking-wider text-[14px] hover:bg-vinex-teal hover:text-white transition-all duration-300 rounded-lg">
                  Chi tiết Dự án
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
