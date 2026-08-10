"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function AboutPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <main className="w-full flex flex-col min-h-screen pt-[90px] bg-white">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-vinex-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-0">
          <span className="text-gray-500 font-bold tracking-widest uppercase">About VINEX Background</span>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-sm tracking-widest text-[#D4AF37] uppercase mb-4 font-bold block">OUR STORY</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Câu chuyện của VINEX</h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
              Từ xưởng bóc tách điều thô đến hành trình định hình lại tiêu chuẩn quà tặng cao cấp Việt Nam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Origin */}
      <section className="py-24 px-4 bg-vinex-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-vinex-black mb-6">Nơi mọi thứ bắt đầu</h2>
            <div className="space-y-4 text-gray-600 font-light leading-relaxed">
              <p>
                Tiền thân của VINEX là một nhà máy chuyên bóc tách và chế biến hạt điều nhân trắng tại vùng đất đỏ bazan trứ danh của Việt Nam. Hàng chục năm gắn bó với cây điều, chúng tôi thấu hiểu từng giọt mồ hôi của người nông dân và giá trị quý giá của nông sản Việt.
              </p>
              <p>
                Tuy nhiên, hầu hết hạt điều Việt Nam lại được xuất khẩu dưới dạng thô hoặc gia công cho các thương hiệu nước ngoài. Niềm trăn trở đó đã thôi thúc chúng tôi bước ra khỏi vùng an toàn, tạo ra VINEX - với khát vọng đưa nông sản Việt lên một tầm cao mới.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <span className="font-bold tracking-widest uppercase text-xs">Cashew Farm Origin</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg max-w-lg mx-auto w-full"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <span className="font-bold tracking-widest uppercase mb-1">Craftsmanship Process</span>
              <span className="text-xs">1:1 Aspect Ratio</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-vinex-black mb-6">Nghệ thuật Chế tác & Định vị</h2>
            <div className="space-y-4 text-gray-600 font-light leading-relaxed">
              <p>
                Không chỉ dừng lại ở nguyên liệu tốt, VINEX đặt tiêu chuẩn khắt khe cho sự hoàn mỹ của bao bì và thiết kế. Mỗi hộp quà là sự kết hợp giữa nghệ thuật thủ công truyền thống (như sơn mài, giấy dó) và công nghệ in ấn hiện đại.
              </p>
              <p>
                Chúng tôi chuyển mình từ một nhà sản xuất nông sản đơn thuần trở thành thương hiệu cung cấp Giải pháp Quà tặng Doanh nghiệp Cao cấp. Nơi mà mỗi sản phẩm không chỉ có hương vị thượng hạng mà còn là đại diện cho vị thế và đẳng cấp của người tặng.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-vinex-black mb-4">Giá Trị Cốt Lõi</h2>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Nguồn Gốc", desc: "Tôn vinh nguyên liệu và nông sản bản địa Việt Nam." },
            { title: "Sáng Tạo", desc: "Không ngừng đổi mới trong thiết kế bao bì và hương vị." },
            { title: "Hoàn Mỹ", desc: "Chỉn chu đến từng chi tiết nhỏ nhất trước khi đến tay khách hàng." }
          ].map((val, idx) => (
            <motion.div 
              key={idx}
              className="bg-white p-10 rounded-xl text-center border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] font-bold text-2xl mx-auto mb-6">
                0{idx + 1}
              </div>
              <h3 className="font-bold text-xl text-vinex-black mb-3">{val.title}</h3>
              <p className="text-gray-500 font-light">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-vinex-blue text-white px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Trở thành một phần của câu chuyện</h2>
          <p className="text-blue-100 mb-10 font-light text-lg">
            Đồng hành cùng VINEX để tạo ra những món quà ý nghĩa nhất.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={`/${lang}/collections`}>
              <button className="px-10 py-4 bg-white text-vinex-blue font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-colors rounded shadow-lg w-full sm:w-auto">
                Xem Bộ Sưu Tập
              </button>
            </Link>
            <Link href={`/${lang}/request-quote`}>
              <button className="px-10 py-4 bg-[#D4AF37] text-vinex-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded shadow-lg w-full sm:w-auto">
                Nhận Báo Giá
              </button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
