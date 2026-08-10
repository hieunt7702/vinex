"use client";

import { motion } from "framer-motion";

export const CorporateClients = () => {
  return (
    <section className="py-24 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] text-vinex-blue uppercase mb-4 font-bold block">TRUSTED BY</span>
          <h2 className="text-3xl font-bold text-vinex-black mb-6">Khách hàng Doanh nghiệp</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">
            VINEX tự hào là đối tác tin cậy, cung cấp giải pháp quà tặng cao cấp cho các tập đoàn và tổ chức hàng đầu.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-60">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-32 h-16 bg-gray-100 rounded flex items-center justify-center filter grayscale hover:grayscale-0 transition-all duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-xs font-bold text-gray-400">LOGO {i + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
