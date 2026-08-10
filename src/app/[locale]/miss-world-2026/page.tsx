"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function MissWorldPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <main className="w-full flex flex-col min-h-screen pt-[90px]">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Placeholder Video/Image */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-0">
          <span className="text-gray-500 font-bold tracking-widest">Miss World Hero Video/Image</span>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-3xl font-bold tracking-widest text-[#D4AF37]">VINEX</span>
              <span className="text-2xl text-gray-400">×</span>
              <span className="text-3xl font-bold tracking-widest text-white">MISS WORLD 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Tôn vinh vẻ đẹp <br/>
              <span className="text-[#D4AF37] italic font-serif">& di sản Việt Nam</span>
            </h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
              Nhà tài trợ quà tặng chính thức mang tinh hoa nông sản Việt đến đấu trường nhan sắc quốc tế.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Role & Reason Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-vinex-black mb-6">Vai trò và Sứ mệnh</h2>
              <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                <p>
                  Đồng hành cùng Miss World 2026, VINEX mang trên mình trọng trách thiết kế và chế tác các bộ quà tặng cao cấp dành riêng cho các thí sinh, ban giám khảo và khách mời VIP từ khắp nơi trên thế giới.
                </p>
                <p>
                  Chúng tôi tin rằng, mỗi phần quà không chỉ là một tặng phẩm vật chất, mà còn là đại sứ văn hóa truyền tải thông điệp về sự hiếu khách, bản sắc truyền thống và khát vọng vươn mình của Việt Nam.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="font-bold tracking-widest">Sponsorship Image</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Gift Box Story */}
      <section className="py-24 bg-vinex-white px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-vinex-black mb-6">Câu chuyện Bộ Quà Tặng</h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-light">
            Sự kết hợp hoàn hảo giữa nguyên liệu bản địa và thiết kế đương đại.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((item) => (
            <motion.div 
              key={item}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: item * 0.2 }}
            >
              <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-6">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <span className="font-bold tracking-widest uppercase mb-1">Exclusive Box {item}</span>
                  <span className="text-xs">1:1 Aspect Ratio</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-vinex-black mb-4">The Crown Collection {item}</h3>
              <p className="text-gray-500 font-light">
                Hộp quà sơn mài thủ công với các sản phẩm hạt điều tẩm vị đặc sản, kết hợp cùng trà sen Tây Hồ hảo hạng.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preparation & BTS */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-vinex-black mb-12 text-center">Hậu trường & Quá trình chuẩn bị</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <motion.div 
                key={item}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 z-0">
                  <span className="font-bold tracking-widest text-xs uppercase">BTS {item}</span>
                  <span className="text-[10px]">1:1 Aspect Ratio</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-vinex-blue text-white px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Trải nghiệm Quà Tặng Đẳng Cấp</h2>
          <p className="text-blue-100 mb-10 font-light text-lg">
            Khám phá các giải pháp quà tặng doanh nghiệp tiêu chuẩn quốc tế từ VINEX.
          </p>
          <Link href={`/${lang}/corporate-gifts`}>
            <button className="px-10 py-4 bg-[#D4AF37] text-vinex-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-md shadow-lg">
              Khám phá Corporate Gifts
            </button>
          </Link>
        </div>
      </section>
      
    </main>
  );
}
