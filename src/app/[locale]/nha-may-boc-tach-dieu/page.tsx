import { Metadata } from 'next';
import Image from 'next/image';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';

export const metadata: Metadata = {
  title: "Nhà máy bóc tách điều thô VINEX",
  description: "Tìm hiểu quy trình tiếp nhận, xử lý, bóc tách, bóc lụa, phân loại, kiểm tra và đóng gói nhân điều trắng tại VINEX.",
};

export default async function FactoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const pg = t.pages.factory;

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen text-vinex-black pt-[90px] relative overflow-hidden">
        {/* Ambient Global Gradient for Liquid Glass Refraction */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#074751]/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-vinex-gold/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/30 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10">
          {/* Section 1: Hero ảnh nhà máy thật & Mô tả */}
          <section className="px-4 py-16 lg:py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6 leading-tight">{pg.hero_title}</h1>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mb-16 font-light leading-relaxed">
              {pg.hero_desc}
            </p>
            <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[24px] overflow-hidden relative shadow-xl border border-[#E8E4D9]">
              <Image
                src="/images/banner/nha_may_boc_tach.png"
                alt="Nhà máy bóc tách điều VINEX"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </section>

          {/* Section 2: Tập trung bóc tách và phân loại */}
          <section className="px-4 py-16 lg:py-20 bg-white/40">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">{pg.section2_title}</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
              <p className="text-[15px] text-gray-600 mb-12 font-light leading-relaxed">
                {pg.section2_desc}
              </p>
            </div>
            
            {/* Khối ảnh grid (3 ảnh) */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[2, 3, 4].map((num) => (
                <div key={num} className="aspect-[4/3] rounded-[18px] border border-[#E8E4D9] overflow-hidden group relative">
                  <Image
                    src={`/images/banner/nha_may${num}.png`}
                    alt={`Khu vực sản xuất ${num - 1}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </SmoothScroll>
  );
}
