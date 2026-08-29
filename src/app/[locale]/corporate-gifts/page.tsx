"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const categories = [
  { title: "Quà Khách Hàng", desc: "Tri ân khách hàng thân thiết với những sản phẩm mang đậm dấu ấn thương hiệu.", img: "Client Gifts" },
  { title: "Quà VIP", desc: "Đẳng cấp và khác biệt, dành riêng cho những đối tác chiến lược quan trọng nhất.", img: "VIP Gifts" },
  { title: "Quà Nhân Viên", desc: "Khích lệ tinh thần và gắn kết đội ngũ bằng những món quà ý nghĩa, thiết thực.", img: "Employee Gifts" },
  { title: "Quà Sự Kiện", desc: "Lưu lại ấn tượng sâu sắc trong các sự kiện, hội nghị, lễ kỷ niệm.", img: "Event Gifts" },
  { title: "Quà Đối Tác Quốc Tế", desc: "Giới thiệu tinh hoa văn hóa Việt Nam đến bạn bè quốc tế qua từng món quà.", img: "International Gifts" },
  { title: "Quà Thiết Kế Riêng", desc: "Độc bản và cá nhân hóa, thể hiện trọn vẹn câu chuyện thương hiệu của bạn.", img: "Bespoke Gifts" },
];

export default function CorporateGiftsPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <main className="w-full flex flex-col min-h-screen pt-[90px] bg-[#FAFAFA]">
      
      {/* Header */}
      <section className="py-16 lg:py-20 text-center px-4 bg-white border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-sm tracking-widest text-vinex-teal uppercase mb-4 font-bold block">VINEX B2B SOLUTIONS</span>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-marcellus text-vinex-teal mb-6">Giải Pháp Quà Tặng Doanh Nghiệp</h1>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
            Khẳng định đẳng cấp thương hiệu và xây dựng mối quan hệ bền chặt thông qua các bộ sưu tập quà tặng cao cấp được thiết kế riêng.
          </p>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-700">
                    <span className="font-bold tracking-widest uppercase mb-1">{cat.img}</span>
                    <span className="text-xs">1:1 Aspect Ratio</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-vinex-black mb-3 group-hover:text-vinex-blue transition-colors">{cat.title}</h3>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">{cat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-vinex-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Bạn cần tư vấn giải pháp quà tặng?</h2>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-gray-600 mb-10 font-light">
            Đội ngũ chuyên gia của VINEX luôn sẵn sàng lắng nghe và xây dựng phương án phù hợp nhất với ngân sách và mục tiêu của doanh nghiệp.
          </p>
          <Link href={`/${lang}/request-quote`}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-gradient-to-r from-vinex-blue to-[#2B8390] text-white font-bold uppercase tracking-widest text-sm hover:shadow-lg transition-all rounded-md"
            >
              Yêu cầu báo giá
            </motion.button>
          </Link>
        </div>
      </section>
      
    </main>
  );
}
