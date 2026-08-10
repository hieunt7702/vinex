"use client";

import { motion } from "framer-motion";

export const BrandPhilosophy = () => {
  return (
    <section className="py-24 lg:py-32 bg-vinex-ivory">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-vinex-gold uppercase block mb-8">
              MORE THAN A GIFT.
            </span>
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-serif leading-[1.2] text-vinex-charcoal mb-16">
              Một món quà không chỉ được trao đi. Nó đại diện cho sự trân trọng, dấu ấn thương hiệu và câu chuyện của người trao.
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-vinex-charcoal/60 uppercase">
              <span>PRODUCT</span>
              <span className="w-1 h-1 rounded-full bg-vinex-charcoal/60"></span>
              <span>CRAFT</span>
              <span className="w-1 h-1 rounded-full bg-vinex-charcoal/60"></span>
              <span>CULTURE</span>
              <span className="w-1 h-1 rounded-full bg-vinex-charcoal/60"></span>
              <span>CONNECTION</span>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative aspect-[4/3] lg:aspect-[16/11] w-full bg-vinex-sage/20 shadow-lg">
              {/* Image Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-vinex-charcoal/40 bg-[url('https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity opacity-80">
                <span className="font-bold tracking-widest uppercase text-[10px] bg-white/50 px-4 py-2 backdrop-blur-sm">Terraced Fields Placeholder</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
