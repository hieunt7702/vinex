"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import { Button } from '@/components/ui/Button';

export const FinalCTA = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-12 lg:py-16 bg-vinex-teal text-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          
          <motion.div 
            className="lg:max-w-[65%]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-marcellus leading-[1.2] mb-4">
              {t.cta.headline}
            </h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-6"></div>
            <p className="text-white/80 text-[15px] leading-relaxed max-w-md">
              {t.cta.desc}
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 lg:w-auto w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <Link href={`/${lang}/request-quote`}>
              <Button variant="gold" className="w-full sm:w-auto">
                {t.cta.primary}
              </Button>
            </Link>
            <Link href={`/${lang}/lien-he`}>
              <Button variant="secondary" className="w-full sm:w-auto !border-white !text-white hover:!border-vinex-gold hover:!text-vinex-gold">
                {t.cta.secondary}
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
