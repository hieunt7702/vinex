"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import Image from 'next/image';

const imgColors = [
  'bg-vinex-teal/80',
  'bg-vinex-teal/90',
  'bg-[#5C1A1B]',
  'bg-vinex-gold/80',
  'bg-vinex-charcoal/90',
  'bg-[#8C7B65]'
];

const colImages = [
  '/images/product/Layout khay dưỡng 1.png',
  '/images/product/Layout khay dưỡng 2.png',
  '/images/product/Layout kjhay dưỡng 3.png',
  '/images/product/Layout khay dưỡng 4.png',
  '/images/product/Bao bi hat dieu sieu thi 1.png',
  '/images/product/Bao bi hat dieu sieu thi 2.png'
];

export const CollectionsPreview = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-20 lg:py-28 bg-vinex-ivory">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-vinex-charcoal/50 uppercase mb-4 font-bold block">{t.collections.label}</span>
            <h2 className="text-[32px] sm:text-4xl md:text-[44px] font-marcellus text-vinex-charcoal leading-tight">
              {t.collections.headline}
            </h2>
          </div>
          <Link href={`/${lang}/qua-tang-doanh-nghiep`}>
            <button className="text-vinex-charcoal font-bold uppercase tracking-widest text-[11px] hover:text-vinex-teal transition-colors flex items-center gap-2">
              {t.collections.cta} <span>&rarr;</span>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {t.collections.items.map((col, idx) => (
            <Link href={`/${lang}/qua-tang-doanh-nghiep`} key={col.id}>
              <motion.div 
                className="group cursor-pointer relative aspect-[4/3] w-full overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
              >
                {/* Image Background */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                   <Image src={colImages[idx]} alt={col.category} fill className="object-cover" />
                   <div className={`absolute inset-0 ${imgColors[idx]} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />
                </div>
                
                {/* Gradient Overlay */}
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
