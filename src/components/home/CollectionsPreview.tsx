"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const collections = [
  {
    id: 'signature',
    name: 'Signature Collection',
    desc: 'Bản sắc quà tặng doanh nghiệp',
    imgPlaceholder: 'Signature Box'
  },
  {
    id: 'executive',
    name: 'Executive Collection',
    desc: 'Đẳng cấp & tinh tế cho đối tác VIP',
    imgPlaceholder: 'Executive Box'
  },
  {
    id: 'heritage',
    name: 'Heritage Collection',
    desc: 'Tôn vinh hương vị truyền thống',
    imgPlaceholder: 'Heritage Box'
  }
];

export const CollectionsPreview = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-28 bg-white px-4 md:px-8 xl:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-20">
          <span className="text-[11px] sm:text-xs tracking-[0.2em] text-vinex-teal uppercase mb-4 font-bold block">CURATED COLLECTIONS</span>
          <h2 className="text-[32px] sm:text-4xl font-bold text-vinex-charcoal mb-6">Bộ sưu tập Quà tặng cao cấp</h2>
          <p className="text-vinex-charcoal/60 max-w-2xl mx-auto font-light text-base sm:text-lg">
            Mỗi bộ quà tặng là một tác phẩm nghệ thuật, kết tinh từ những nguyên liệu tuyển chọn và nghệ thuật thiết kế đương đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {collections.map((col, idx) => (
            <motion.div 
              key={col.id}
              className="group cursor-pointer flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
            >
              <div className="relative aspect-square w-full bg-vinex-ivory rounded-[24px] overflow-hidden shadow-sm border border-vinex-charcoal/5 mb-8">
                <div className="absolute inset-0 bg-vinex-charcoal/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                {/* 1:1 Image Placeholder */}
                <div className="w-full h-full flex flex-col items-center justify-center text-vinex-charcoal/30 group-hover:scale-105 transition-transform duration-700">
                  <span className="text-[13px] font-bold uppercase tracking-widest mb-1">{col.imgPlaceholder}</span>
                  <span className="text-[11px]">1:1 Aspect Ratio</span>
                </div>
              </div>
              <div className="text-center px-4">
                <h3 className="text-[22px] font-bold text-vinex-charcoal mb-3 group-hover:text-vinex-teal transition-colors">{col.name}</h3>
                <p className="text-[15px] text-vinex-charcoal/60 font-light leading-relaxed">{col.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link href={`/${lang}/collections`}>
            <button className="px-10 py-4 bg-transparent text-vinex-teal border border-vinex-teal rounded-lg font-semibold text-[14px] hover:bg-vinex-teal hover:text-white transition-all duration-300">
              Khám phá toàn bộ
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
