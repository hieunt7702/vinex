"use client";

import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Edit3, Briefcase } from 'lucide-react'; // Placeholder icons

const features = [
  { icon: ShieldCheck, title: "PREMIUM QUALITY", desc: "Kiểm soát chất lượng nghiêm ngặt từ nguyên liệu đến thành phẩm." },
  { icon: MapPin, title: "VIETNAMESE ORIGIN", desc: "Tinh hoa nông sản Việt từ những vùng nguyên liệu chọn lọc." },
  { icon: Edit3, title: "BESPOKE DESIGN", desc: "Thiết kế riêng theo nhận diện và câu chuyện thương hiệu." },
  { icon: Briefcase, title: "ENTERPRISE SCALE", desc: "Đáp ứng đơn hàng lớn và các sự kiện quy mô quốc tế." }
];

const stats = [
  { number: "10+", label: "YEARS\nOF EXPERIENCE" },
  { number: "50+", label: "PARTNERS\nTRUST US" },
  { number: "100K+", label: "GIFTS\nDELIVERED" }
];

export const WhyVinexHome = () => {
  return (
    <section className="py-20 lg:py-24 bg-vinex-teal text-white border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
          
          {/* Features (Left/Top) */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            <div className="col-span-full">
              <span className="text-[10px] tracking-[0.2em] text-vinex-gold uppercase font-bold">WHY VINEX</span>
            </div>
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={idx}
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Icon className="w-6 h-6 text-vinex-gold shrink-0 stroke-[1.5]" />
                  <div>
                    <h3 className="text-[12px] font-bold tracking-widest text-vinex-gold uppercase mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-white/70 font-light text-[13px] leading-relaxed max-w-[260px]">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats (Right/Bottom) */}
          <div className="lg:w-1/3 flex flex-row lg:flex-col justify-between lg:justify-end gap-8 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-12">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4"
              >
                <span className="text-[32px] lg:text-[44px] font-serif text-vinex-gold leading-none">
                  {stat.number}
                </span>
                <span className="text-[9px] lg:text-[10px] font-bold tracking-[0.15em] text-white/60 uppercase whitespace-pre-line leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
