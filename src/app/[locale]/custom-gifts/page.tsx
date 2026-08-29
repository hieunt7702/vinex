"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function CustomGiftsPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  const steps = [
    { num: "01", title: "Tư vấn & Lấy Yêu Cầu", desc: "Lắng nghe mục tiêu, ngân sách và đối tượng nhận quà." },
    { num: "02", title: "Phát Triển Concept", desc: "Xây dựng ý tưởng thiết kế, thông điệp và lựa chọn sản phẩm." },
    { num: "03", title: "Thiết Kế Chi Tiết", desc: "Thiết kế bao bì, logo, thiệp và các ấn phẩm đi kèm." },
    { num: "04", title: "Sản Xuất Mẫu Thử", desc: "Làm mẫu thực tế để khách hàng đánh giá và duyệt." },
    { num: "05", title: "Sản Xuất Hàng Loạt", desc: "Kiểm soát chất lượng nghiêm ngặt trong quá trình sản xuất." },
    { num: "06", title: "Giao Hàng", desc: "Đóng gói cẩn thận và giao tận nơi theo tiến độ cam kết." },
  ];

  return (
    <main className="w-full flex flex-col min-h-screen pt-[90px] bg-white">
      
      {/* Header */}
      <section className="relative h-[60vh] bg-vinex-black flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-0">
          <span className="text-gray-500 font-bold tracking-widest">Bespoke Hero Image (16:9)</span>
        </div>
        
        <div className="relative z-20 max-w-4xl px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm tracking-widest text-[#D4AF37] uppercase mb-4 font-bold block">BESPOKE GIFTS</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Quà Tặng Thiết Kế Riêng</h1>
            <p className="text-gray-300 text-lg font-light max-w-2xl mx-auto">
              Sự độc bản dành riêng cho thương hiệu của bạn. Tự do sáng tạo từ chất liệu hộp, quy cách đến từng chi tiết nhỏ nhất.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Options */}
      <section className="py-24 px-4 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-vinex-black mb-4">Các Lựa Chọn Cá Nhân Hóa</h2>
            <p className="text-gray-500 font-light">Mọi chi tiết đều có thể tùy biến theo nhận diện thương hiệu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Chất liệu Hộp', 'Ruy Băng & Phụ kiện', 'Ép Kim Logo', 'Thiệp & Thông điệp'].map((item, idx) => (
              <motion.div 
                key={idx}
                className="bg-white p-6 rounded-xl text-center border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-6 mx-auto max-w-[200px]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <span className="font-bold tracking-widest uppercase mb-1 text-[10px]">{item}</span>
                    <span className="text-[10px]">1:1 Ratio</span>
                  </div>
                </div>
                <h3 className="font-bold text-vinex-black">{item}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-vinex-black mb-4">Quy Trình Triển Khai</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                className="p-8 border border-gray-100 rounded-xl hover:border-vinex-blue/30 hover:bg-vinex-blue/5 transition-colors"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="text-4xl font-extrabold text-gray-200 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-vinex-black mb-3">{step.title}</h3>
                <p className="text-gray-500 font-light text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-vinex-black text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Bắt đầu câu chuyện của bạn</h2>
          <p className="text-gray-400 mb-10 font-light">
            Tạo dấu ấn khác biệt với bộ quà tặng độc bản từ VINEX.
          </p>
          <Link href={`/${lang}/request-quote`}>
            <Button variant="gold">
              Tạo bộ quà của bạn
            </Button>
          </Link>
        </div>
      </section>
      
    </main>
  );
}
