"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const articles = [
  {
    id: '01',
    title: 'Nghệ thuật sơn mài trong thiết kế bao bì đương đại',
    category: 'VĂN HÓA & THIẾT KẾ',
    image: 'bg-[#2A2A2A]' // Placeholder dark background
  },
  {
    id: '02',
    title: 'Câu chuyện đằng sau hạt điều chuẩn xuất khẩu',
    category: 'CÂU CHUYỆN NÔNG SẢN',
    image: 'bg-[#C2A383]' // Placeholder cashew background
  },
  {
    id: '03',
    title: 'Xu hướng quà tặng doanh nghiệp mùa Tết 2027',
    category: 'GÓC NHÌN THỊ TRƯỜNG',
    image: 'bg-[#0D5962]' // Placeholder teal background
  }
];

export const LatestArticles = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-20 lg:py-28 bg-vinex-ivory border-t border-vinex-charcoal/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-vinex-charcoal/50 uppercase mb-4 font-bold block">
              THE VINEX JOURNAL
            </span>
            <h2 className="text-[32px] sm:text-4xl md:text-[44px] font-serif text-vinex-charcoal leading-tight">
              Câu chuyện, cảm hứng và góc nhìn từ VINEX.
            </h2>
          </div>
          <Link href={`/${lang}/kien-thuc`}>
            <button className="text-vinex-charcoal font-bold uppercase tracking-widest text-[11px] hover:text-vinex-teal transition-colors flex items-center gap-2">
              Xem tất cả bài viết <span>&rarr;</span>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, idx) => (
            <motion.div 
              key={idx}
              className="group cursor-pointer flex flex-col h-full border border-vinex-charcoal/10 bg-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
            >
              <div className={`relative aspect-[4/3] w-full overflow-hidden ${article.image}`}>
                {/* Placeholder Image Overlay */}
                <div className="absolute inset-0 flex items-center justify-center mix-blend-overlay opacity-30 bg-black/20" />
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <span className="text-[10px] font-bold tracking-[0.15em] text-vinex-charcoal/50 uppercase mb-4">
                  {article.id} &mdash; {article.category}
                </span>
                <h3 className="text-[20px] font-serif text-vinex-charcoal group-hover:text-vinex-teal transition-colors leading-snug mb-8 flex-1">
                  {article.title}
                </h3>
                <div className="text-[11px] font-bold tracking-widest uppercase text-vinex-charcoal flex items-center gap-2 group-hover:text-vinex-teal transition-colors">
                  Đọc thêm <span>&rarr;</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
