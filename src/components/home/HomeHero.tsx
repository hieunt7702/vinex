"use client";

import { motion } from "framer-motion";

export const HomeHero = () => {
  return (
    <section className="min-h-[80vh] bg-vinex-white flex flex-col justify-center items-center pt-24 text-center px-4">
      <span className="text-sm tracking-widest text-vinex-blue uppercase mb-4 font-bold">VINEX - Enduring Excellence</span>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-vinex-blue to-[#2B8390] max-w-4xl mb-6">
        Phát triển giá trị từ hạt điều và nông sản Việt
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-10">
        VINEX bắt đầu từ nền tảng nhà máy bóc tách điều thô, từng bước phát triển nhân điều trắng, hạt điều tẩm vị, sản phẩm nông sản, bao bì và quà tặng doanh nghiệp.
      </p>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 max-w-xs sm:max-w-none mx-auto">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden px-8 py-3.5 bg-gradient-to-r from-vinex-blue to-[#2B8390] text-white rounded-md font-bold uppercase tracking-wider text-[13px] sm:text-sm shadow-[0_4px_20px_rgba(13,89,98,0.3)] hover:shadow-[0_8px_30px_rgba(13,89,98,0.4)] transition-all w-full sm:w-auto"
        >
          <motion.div 
            className="absolute inset-0 w-[150%] -left-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          />
          <span className="relative z-10 block w-full text-center">Khám phá năng lực</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3.5 bg-white text-vinex-blue border-2 border-vinex-blue/20 rounded-md font-bold uppercase tracking-wider text-[13px] sm:text-sm hover:border-vinex-blue hover:bg-vinex-blue/5 transition-colors w-full sm:w-auto"
        >
          <span className="block w-full text-center">Nhận tư vấn hợp tác</span>
        </motion.button>
      </div>
    </section>
  );
};
