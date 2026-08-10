"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const FinalCTA = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-40 bg-vinex-teal text-white text-center px-4 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-[64px] font-bold mb-10 leading-[1.15]">
            Let’s Create Something <br className="hidden md:block" />
            <span className="text-vinex-gold italic font-serif font-light">Memorable.</span>
          </h2>
          <p className="text-white/80 font-light text-[17px] md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed">
            Bắt đầu hành trình kiến tạo những bộ quà tặng đẳng cấp, mang đậm dấu ấn thương hiệu của riêng bạn cùng VINEX.
          </p>
          
          <Link href={`/${lang}/request-quote`}>
            <button className="px-12 py-5 bg-vinex-gold text-vinex-charcoal font-bold uppercase tracking-widest text-[14px] hover:bg-white transition-colors duration-300 rounded-lg">
              Nhận tư vấn hợp tác
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
