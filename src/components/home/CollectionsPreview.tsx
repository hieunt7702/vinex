"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const collections = [
  {
    id: '01',
    category: 'SIGNATURE',
    name: 'Corporate Essentials',
    imgColor: 'bg-vinex-teal/80'
  },
  {
    id: '02',
    category: 'EXECUTIVE',
    name: 'For Distinguished Partners',
    imgColor: 'bg-vinex-teal/90'
  },
  {
    id: '03',
    category: 'HERITAGE',
    name: 'Vietnamese Heritage',
    imgColor: 'bg-[#5C1A1B]' // A deep red/brown for heritage based on the image
  }
];

export const CollectionsPreview = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-20 lg:py-28 bg-vinex-ivory">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-vinex-charcoal/50 uppercase mb-4 font-bold block">CURATED COLLECTIONS</span>
            <h2 className="text-[32px] sm:text-4xl md:text-[44px] font-marcellus text-vinex-charcoal leading-tight">
              Những tặng phẩm đáng được nhớ đến.
            </h2>
          </div>
          <Link href={`/${lang}/collections`}>
            <button className="text-vinex-charcoal font-bold uppercase tracking-widest text-[11px] hover:text-vinex-teal transition-colors flex items-center gap-2">
              Xem tất cả bộ sưu tập <span>&rarr;</span>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((col, idx) => (
            <Link href={`/${lang}/collections/${col.category.toLowerCase()}`} key={col.id}>
              <motion.div 
                className="group cursor-pointer relative aspect-[4/3] w-full overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
              >
                {/* Image Placeholder Background */}
                <div className={`absolute inset-0 ${col.imgColor} transition-transform duration-700 group-hover:scale-105 flex items-center justify-center`}>
                   <span className="font-marcellus italic text-white/30 text-xl">{col.category} Box Placeholder</span>
                </div>
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end">
                  <div>
                    <span className="text-[11px] font-bold tracking-[0.15em] text-vinex-gold uppercase block mb-2">
                      {col.id} &mdash; {col.category}
                    </span>
                    <h3 className="text-[20px] md:text-[22px] font-bold text-white leading-snug">
                      {col.name}
                    </h3>
                  </div>
                  <div className="text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    &rarr;
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
