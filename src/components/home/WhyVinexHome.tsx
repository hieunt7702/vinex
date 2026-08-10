"use client";

import { motion } from "framer-motion";

const features = [
  { title: "Chất lượng Thượng Hạng", desc: "Kiểm soát 100% quy trình từ nguyên liệu thô đến thành phẩm cuối cùng." },
  { title: "Thiết kế Đương Đại", desc: "Thẩm mỹ cao cấp, kết hợp hài hòa giữa truyền thống và xu hướng hiện đại." },
  { title: "Cá nhân hóa Sâu Rộng", desc: "Tùy biến linh hoạt đáp ứng mọi yêu cầu định vị thương hiệu khắt khe nhất." },
  { title: "Sản lượng Khủng", desc: "Năng lực đáp ứng các đơn hàng quy mô lớn với thời gian tối ưu." }
];

export const WhyVinexHome = () => {
  return (
    <section className="py-28 bg-vinex-charcoal text-white px-4 md:px-8 xl:px-12 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-[11px] sm:text-xs tracking-[0.2em] text-vinex-gold uppercase mb-4 font-bold block">WHY VINEX</span>
          <h2 className="text-[32px] sm:text-4xl font-bold mb-6">Đối tác Quà tặng Chiến lược</h2>
          <p className="text-white/70 max-w-2xl mx-auto font-light text-base sm:text-lg">
            Những lý do khiến hàng trăm doanh nghiệp và sự kiện quốc tế lựa chọn VINEX làm đối tác đồng hành.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((item, idx) => (
            <motion.div 
              key={idx}
              className="bg-white/[0.03] border border-white/5 p-10 rounded-[24px] hover:bg-white/[0.06] transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
            >
              <div className="w-14 h-14 rounded-full bg-vinex-teal flex items-center justify-center text-white font-bold mb-8 text-[18px]">
                0{idx + 1}
              </div>
              <h3 className="text-[20px] font-bold mb-4 leading-snug">{item.title}</h3>
              <p className="text-white/60 font-light text-[14px] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
