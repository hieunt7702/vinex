"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const categories = [
  { id: 'client', title: 'Client Gifts', subtitle: 'Quà tặng khách hàng' },
  { id: 'vip', title: 'VIP Gifts', subtitle: 'Quà đối tác chiến lược' },
  { id: 'employee', title: 'Employee Gifts', subtitle: 'Quà tặng nhân viên' },
  { id: 'event', title: 'Event Gifts', subtitle: 'Quà tặng sự kiện' },
  { id: 'international', title: 'International', subtitle: 'Quà tặng quốc tế' },
];

export const CorporateGiftingHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-28 bg-vinex-ivory px-4 md:px-8 xl:px-12 border-t border-vinex-charcoal/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-20">
          <span className="text-[11px] sm:text-xs tracking-[0.2em] text-vinex-teal uppercase mb-4 font-bold block">CORPORATE GIFTING</span>
          <h2 className="text-[32px] sm:text-4xl font-bold text-vinex-charcoal mb-6">Giải pháp trọn vẹn cho Doanh nghiệp</h2>
          <p className="text-vinex-charcoal/60 max-w-2xl mx-auto font-light text-base sm:text-lg">
            Từ những sự kiện tri ân nhỏ đến các hội nghị mang tầm quốc tế, VINEX cung cấp giải pháp quà tặng linh hoạt, đáp ứng mọi quy mô và ngân sách.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {categories.map((cat, idx) => (
            <Link key={cat.id} href={`/${lang}/corporate-gifts`} className="group flex flex-col items-center">
              <motion.div 
                className="relative aspect-square w-full bg-white rounded-[24px] overflow-hidden shadow-sm border border-vinex-charcoal/5 mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-vinex-sage/10 group-hover:bg-vinex-teal/10 transition-colors duration-500 z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-20">
                  <span className="text-vinex-charcoal/30 text-[10px] uppercase tracking-widest font-medium group-hover:text-vinex-teal transition-colors">1:1 Ratio</span>
                </div>
              </motion.div>
              <h3 className="text-vinex-charcoal font-bold text-[15px] sm:text-[17px] mb-1 uppercase tracking-wide group-hover:text-vinex-teal transition-colors text-center">{cat.title}</h3>
              <span className="text-vinex-charcoal/50 text-[13px] font-light text-center">{cat.subtitle}</span>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-20">
          <Link href={`/${lang}/corporate-gifts`}>
            <button className="px-10 py-4 bg-vinex-teal text-white rounded-lg font-semibold text-[14px] hover:bg-vinex-charcoal transition-all duration-300">
              Xem tất cả giải pháp
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
