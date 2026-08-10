"use client";

import { motion } from "framer-motion";

export const BrandPhilosophy = () => {
  return (
    <section className="py-32 md:py-40 bg-vinex-teal text-white text-center px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-xs tracking-[0.3em] text-vinex-gold uppercase mb-8 font-bold inline-block">OUR PHILOSOPHY</span>
          <h2 className="text-[44px] sm:text-5xl md:text-7xl font-serif italic mb-10 leading-tight font-light">
            "More Than A Gift."
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
            Chúng tôi tin rằng, mỗi tặng phẩm là một đại sứ văn hóa mang theo câu chuyện của sự trân trọng, kết nối bền chặt và tôn vinh những giá trị đích thực.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
