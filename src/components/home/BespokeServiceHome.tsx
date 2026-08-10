"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const processSteps = [
  {
    id: '01',
    title: 'CONCEPT',
    desc: 'Lắng nghe và xây dựng ý tưởng phù hợp với thương hiệu.',
    imgColor: 'bg-[#B0B0B0]'
  },
  {
    id: '02',
    title: 'MATERIAL',
    desc: 'Lựa chọn chất liệu cao cấp, thân thiện và bền vững.',
    imgColor: 'bg-[#8C7B65]'
  },
  {
    id: '03',
    title: 'BRANDING',
    desc: 'Cá nhân hóa logo, màu sắc, chất liệu & tổng gói.',
    imgColor: 'bg-[#0D5962]' // Assuming dark teal image
  },
  {
    id: '04',
    title: 'PRODUCTION',
    desc: 'Sản xuất cẩn thận, kiểm soát chất lượng ở từng chi tiết.',
    imgColor: 'bg-[#4A3B32]'
  }
];

export const BespokeServiceHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-20 lg:py-32 bg-vinex-teal text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col xl:flex-row gap-16 xl:gap-12 items-start">
          
          {/* Left Content */}
          <motion.div 
            className="xl:w-[320px] shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-[32px] sm:text-[40px] font-serif leading-[1.1] mb-6">
              MADE FOR <br />YOUR BRAND.
            </h2>
            <p className="text-white/80 text-[14px] leading-relaxed mb-10">
              Không có hai thương hiệu giống nhau.<br/>Vì vậy, không nên có hai món quà giống nhau.
            </p>
            <Link href={`/${lang}/custom-gifts`}>
              <button className="px-6 py-4 bg-vinex-gold text-vinex-charcoal font-bold text-[11px] tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                KHỞI TẠO THIẾT KẾ RIÊNG <span>&rarr;</span>
              </button>
            </Link>
          </motion.div>

          {/* Right Content (Cards) */}
          <div className="xl:flex-1 w-full overflow-x-auto pb-8 -mb-8 scrollbar-hide">
            <div className="flex gap-6 min-w-max">
              {processSteps.map((step, idx) => (
                <motion.div 
                  key={step.id}
                  className="w-[260px] md:w-[280px] shrink-0"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                >
                  <div className={`w-full aspect-[4/3] ${step.imgColor} mb-6 relative overflow-hidden group shadow-lg`}>
                     {/* Image Placeholder */}
                     <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors duration-500">
                       <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{step.title}</span>
                     </div>
                  </div>
                  <div>
                    <div className="flex items-end gap-3 mb-3">
                      <span className="text-vinex-gold font-bold text-[16px]">{step.id}</span>
                      <h3 className="text-[13px] font-bold tracking-widest uppercase">{step.title}</h3>
                    </div>
                    <p className="text-white/60 text-[13px] font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
