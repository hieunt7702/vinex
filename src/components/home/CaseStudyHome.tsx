"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import { ArrowRight } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass';

export const CaseStudyHome = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <section className="py-12 lg:py-20 bg-vinex-ivory overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">

          {/* Left: Image */}
          <div className="flex-1 w-full flex flex-col">
            <div className="relative h-full min-h-[300px] lg:min-h-0 w-full overflow-hidden rounded-sm bg-vinex-ivory shadow-xl group">
              <Image src="/images/missworld.png" alt="Miss World 2026" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />

              {/* Top Left Gradient Bracket (Inner) */}
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-28 opacity-80 group-hover:opacity-100"></div>
              <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-28 opacity-80 group-hover:opacity-100"></div>

              {/* Bottom Right Gradient Bracket (Inner) */}
              <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-gradient-to-l from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:w-28 opacity-80 group-hover:opacity-100"></div>
              <div className="absolute bottom-0 right-0 w-[2px] h-16 bg-gradient-to-t from-vinex-gold via-vinex-gold/80 to-transparent z-10 transition-all duration-700 group-hover:h-28 opacity-80 group-hover:opacity-100"></div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-marcellus uppercase text-[10px] md:text-[11px] tracking-[0.2em] text-vinex-teal">
                {t.casestudy.label}
              </span>
              <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            </div>
            <h2 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[44px] xl:text-[48px] text-vinex-teal leading-[1.1] mb-6 whitespace-normal sm:whitespace-nowrap font-semibold">
              {t.casestudy.headline}
            </h2>
            <p className="text-vinex-charcoal/70 text-[14px] md:text-[15px] mb-10 lg:mb-12 leading-relaxed max-w-lg">
              {t.casestudy.desc}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 w-full max-w-lg">
              <div className="flex items-center gap-4 text-left">
                <div className="relative w-10 h-10 shrink-0">
                  <Image src="/images/miss1.png" alt="Icon 1" fill className="object-contain object-center" />
                </div>
                <div>
                  <p className="text-[20px] sm:text-[24px] font-marcellus text-vinex-teal leading-none mb-1.5">{t.casestudy.stat1_num}</p>
                  <p className="text-[8px] sm:text-[9px] font-semibold text-vinex-charcoal/50 uppercase tracking-widest leading-none">{t.casestudy.stat1_label}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="relative w-10 h-10 shrink-0">
                  <Image src="/images/miss2.png" alt="Icon 2" fill className="object-contain object-center" />
                </div>
                <div>
                  <p className="text-[20px] sm:text-[24px] font-marcellus text-vinex-teal leading-none mb-1.5">{t.casestudy.stat2_num}</p>
                  <p className="text-[8px] sm:text-[9px] font-semibold text-vinex-charcoal/50 uppercase tracking-widest leading-none">{t.casestudy.stat2_label}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="relative w-10 h-10 shrink-0">
                  <Image src="/images/miss3.png" alt="Icon 3" fill className="object-contain object-center" />
                </div>
                <div>
                  <p className="text-[20px] sm:text-[24px] font-marcellus text-vinex-teal leading-none mb-1.5">{t.casestudy.stat3_num}</p>
                  <p className="text-[8px] sm:text-[9px] font-semibold text-vinex-charcoal/50 uppercase tracking-widest leading-none">{t.casestudy.stat3_label}</p>
                </div>
              </div>
            </div>

            <Link 
              href={`/${lang}/request-quote`}
              className="group inline-flex flex-col items-start gap-1.5 text-[14px] font-bold text-[#074751] hover:text-[#0a5c68] transition-colors mt-2"
            >
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wide">{t.casestudy.cta}</span>
                <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="w-[60px] h-[2px] bg-vinex-gold/50 group-hover:w-full group-hover:bg-vinex-gold transition-all duration-500"></div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
