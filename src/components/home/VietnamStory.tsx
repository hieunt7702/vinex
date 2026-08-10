"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const VietnamStory = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-28 bg-vinex-ivory px-4 md:px-8 xl:px-12 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative aspect-square w-full max-w-[560px] mx-auto bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(36,49,58,0.06)] border border-vinex-charcoal/5">
              {/* Image Placeholder */}
              <div className="w-full h-full flex flex-col items-center justify-center text-vinex-charcoal/30 bg-vinex-sage/10">
                <span className="text-[13px] font-bold uppercase tracking-widest mb-2">Vietnam Heritage</span>
                <span className="text-[11px]">1:1 Aspect Ratio</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[11px] sm:text-xs tracking-[0.2em] text-vinex-gold uppercase mb-6 font-bold block">OUR STORY</span>
            <h2 className="text-[36px] sm:text-[44px] lg:text-5xl font-bold text-vinex-charcoal mb-8 leading-[1.15]">
              Câu chuyện từ <br/> những hạt mầm Việt Nam
            </h2>
            <div className="space-y-6 text-vinex-charcoal/70 font-light mb-12 text-[15px] sm:text-[17px] leading-relaxed">
              <p>
                Hành trình của VINEX bắt đầu từ tình yêu sâu sắc với vùng đất đỏ bazan và những người nông dân tâm huyết. Chúng tôi tin rằng, mỗi hạt điều, mỗi sản phẩm nông sản đều mang trong mình tinh hoa của trời đất và mồ hôi của con người.
              </p>
              <p>
                Từ việc kiểm soát khắt khe quy trình chế biến, đến nghệ thuật kết hợp hương vị và thiết kế bao bì tinh tế, VINEX không chỉ tạo ra những sản phẩm chất lượng, mà còn gửi gắm những câu chuyện văn hóa sâu sắc vào từng hộp quà.
              </p>
            </div>
            
            <Link href={`/${lang}/gioi-thieu`}>
              <button className="flex items-center gap-3 text-vinex-teal font-bold uppercase tracking-widest text-[13px] hover:text-vinex-gold transition-colors group">
                <span>Khám phá hành trình</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
