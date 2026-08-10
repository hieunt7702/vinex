"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const articles = [
  {
    id: 1,
    title: 'Nghệ thuật sơn mài trong thiết kế bao bì đương đại',
    category: 'Văn hóa & Thiết kế',
    date: '10 Tháng 8, 2026',
    image: 'Sơn mài Image'
  },
  {
    id: 2,
    title: 'Câu chuyện đằng sau hạt điều chuẩn xuất khẩu của VINEX',
    category: 'Câu chuyện nông sản',
    date: '05 Tháng 8, 2026',
    image: 'Hạt điều Image'
  },
  {
    id: 3,
    title: 'Xu hướng quà tặng doanh nghiệp mùa Tết 2027',
    category: 'Góc nhìn thị trường',
    date: '01 Tháng 8, 2026',
    image: 'Quà Tết Image'
  }
];

export const LatestArticles = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-28 bg-vinex-ivory px-4 md:px-8 xl:px-12 border-t border-vinex-charcoal/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-[11px] sm:text-xs tracking-[0.2em] text-vinex-teal uppercase mb-4 font-bold block">VINEX JOURNAL</span>
            <h2 className="text-[32px] sm:text-4xl font-bold text-vinex-charcoal">Kiến thức & Góc nhìn</h2>
          </div>
          <Link href={`/${lang}/kien-thuc`}>
            <button className="text-vinex-charcoal font-bold uppercase tracking-widest text-[13px] hover:text-vinex-teal transition-colors border-b border-transparent hover:border-vinex-teal pb-1">
              Xem tất cả bài viết
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {articles.map((article, idx) => (
            <motion.div 
              key={article.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
            >
              <div className="relative aspect-[4/3] w-full bg-white rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(36,49,58,0.04)] border border-vinex-charcoal/5 mb-6">
                <div className="absolute inset-0 bg-vinex-sage/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <div className="w-full h-full flex flex-col items-center justify-center text-vinex-charcoal/30 bg-vinex-ivory/50 group-hover:scale-105 transition-transform duration-700">
                  <span className="text-[12px] font-bold uppercase tracking-widest mb-1">{article.image}</span>
                  <span className="text-[10px]">4:3 Aspect Ratio</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-xs font-semibold text-vinex-teal uppercase tracking-wider">{article.category}</span>
                  <span className="text-xs text-vinex-charcoal/40 font-light">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-vinex-charcoal group-hover:text-vinex-teal transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
