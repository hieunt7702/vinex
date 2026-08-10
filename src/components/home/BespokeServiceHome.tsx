"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const BespokeServiceHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-32 bg-white px-4 md:px-8 xl:px-12 relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-[120%] bg-vinex-sage/5 rounded-l-[80px] pointer-events-none hidden lg:block" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div 
            className="order-2 lg:order-1 relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative aspect-[4/5] w-full max-w-[480px] mx-auto bg-vinex-ivory rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(36,49,58,0.06)] border border-vinex-charcoal/5">
              <div className="w-full h-full flex flex-col items-center justify-center text-vinex-charcoal/30 bg-white/50">
                <span className="text-[13px] font-bold uppercase tracking-widest mb-2">Bespoke Design</span>
                <span className="text-[11px]">4:5 Aspect Ratio</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[11px] sm:text-xs tracking-[0.2em] text-vinex-teal uppercase mb-6 font-bold block">BESPOKE SERVICE</span>
            <h2 className="text-[36px] sm:text-[44px] lg:text-5xl font-bold text-vinex-charcoal mb-8 leading-[1.15]">
              Khả năng Thiết Kế Riêng Độc Bản
            </h2>
            <div className="space-y-6 text-vinex-charcoal/70 font-light mb-12 text-[15px] sm:text-[17px] leading-relaxed">
              <p>
                VINEX hiểu rằng mỗi doanh nghiệp là một bản sắc duy nhất. Dịch vụ Bespoke của chúng tôi cho phép bạn tham gia vào mọi khâu sáng tạo để tạo ra món quà mang đậm dấu ấn thương hiệu.
              </p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0 mt-0.5">✓</div>
                  <span>Tùy chọn chất liệu hộp (Gỗ, Da, Sơn mài, Giấy mỹ thuật)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0 mt-0.5">✓</div>
                  <span>Ép kim, dập nổi, khắc laser logo doanh nghiệp chuẩn xác</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0 mt-0.5">✓</div>
                  <span>Tùy chỉnh thành phần nông sản bên trong theo ngân sách</span>
                </li>
              </ul>
            </div>
            
            <Link href={`/${lang}/custom-gifts`}>
              <button className="px-10 py-4 bg-vinex-teal text-white rounded-lg font-semibold text-[14px] hover:bg-vinex-charcoal transition-all duration-300">
                Tìm hiểu Dịch vụ Bespoke
              </button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
