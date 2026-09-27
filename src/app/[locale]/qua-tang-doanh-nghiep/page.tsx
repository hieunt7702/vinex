import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Quà tặng doanh nghiệp từ nông sản Việt | VINEX",
  description: "Giải pháp quà Tết, quà khách hàng, quà đối tác và quà sự kiện với sản phẩm, bao bì và ngân sách theo nhu cầu.",
};

export default async function CorporateGiftPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale === 'en' ? 'en' : 'vi';
  const t = getDictionary(locale as Locale);
  const pg = t.pages.gifts;

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen text-vinex-black relative overflow-hidden">
        {/* Ambient Global Gradient for Liquid Glass Refraction */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#074751]/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-vinex-gold/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/30 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10">
          {/* Section 1: Hero & Intro with Corporate Gifting Banner extending behind header */}
          <section className="relative w-full overflow-hidden pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-20 sm:pb-24 lg:pb-32 flex flex-col items-center text-center">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
              <Image
                src="/bg_hero_qt.png"
                alt="Quà tặng doanh nghiệp VINEX"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-white/20 sm:bg-white/10" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
              <span className="text-vinex-gold font-bold tracking-widest text-[13px] uppercase mb-4 block drop-shadow-xs">
                {lang === 'en' ? 'CORPORATE GIFTING' : 'QUÀ TẶNG DOANH NGHIỆP'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[54px] font-semibold text-[#074751] mb-6 leading-tight tracking-tight uppercase">
                {pg.hero_title}
              </h1>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-transparent via-vinex-gold to-transparent mx-auto mb-6"></div>
              <p className="text-[16px] md:text-[18px] text-[#2b5963] max-w-3xl mx-auto leading-relaxed font-medium">
                {pg.hero_desc}
              </p>
            </div>
          </section>

          {/* Section 2: Dịch vụ thiết kế riêng */}
          <section className="px-4 py-16 lg:py-20 bg-white/40">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">{pg.design_service_title}</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
              <p className="text-[15px] text-gray-600 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
                Quy trình từ ý tưởng đến thành phẩm cuối cùng: Khảo sát nhu cầu -&gt; Đề xuất concept bao bì &amp; sản phẩm -&gt; Thiết kế &amp; Mockup -&gt; Sản xuất thử nghiệm -&gt; Bàn giao thành phẩm.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 relative">
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-vinex-teal/10 -translate-y-1/2 z-0"></div>
               {[
                  { step: '01', title: 'Ý tưởng' },
                  { step: '02', title: 'Thiết kế' },
                  { step: '03', title: 'Sản xuất' },
                  { step: '04', title: 'Thành phẩm' },
               ].map((item, idx) => (
                  <div key={idx} className="relative z-10 text-center">
                     <div className="w-16 h-16 rounded-full bg-vinex-teal text-white flex items-center justify-center mx-auto mb-4 text-xl font-marcellus font-bold shadow-lg border-4 border-white">{item.step}</div>
                     <h3 className="font-semibold text-vinex-teal">{item.title}</h3>
                  </div>
               ))}
            </div>
          </section>

          {/* Section 3: Thư viện hộp quà */}
          <section className="py-16 lg:py-24">
            <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 w-full text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">{pg.collections_title}</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
              <p className="text-[15px] text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                {pg.collections_desc}
              </p>
            </div>
            <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: '1', img: '/images/product/Collection 6.png' },
                { id: '2', img: '/images/product/Collection 7.png' },
                { id: '3', img: '/images/product/Collection 9.png' },
                { id: '4', img: '/images/product/Collection 10.png' },
                { id: '5', img: '/images/product/Layout-khay-du-o-ng-1.png' },
                { id: '6', img: '/images/product/Layout-khay-du-o-ng-2.png' },
              ].map((col, idx) => (
                <GlassCard
                  key={idx}
                  radius={16}
                  className="overflow-hidden group hover:-translate-y-2 transition-transform duration-500 shadow-sm"
                  contentClassName="p-4"
                >
                  <div className="aspect-[4/3] bg-slate-100 rounded-[12px] relative overflow-hidden flex items-center justify-center">
                    <Image 
                      src={col.img} 
                      alt={`Mẫu hộp quà ${col.id}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Section 4: Form tư vấn */}
          <section className="relative w-full overflow-hidden py-10 sm:py-12 lg:py-14 px-4 text-white flex flex-col items-center text-center">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
              <Image
                src="/bg_section_lhqt.png"
                alt="Liên hệ tư vấn bộ quà tặng VINEX"
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[#074751]/25" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <span className="text-vinex-gold font-bold tracking-widest text-[11px] sm:text-[12px] uppercase mb-2 block drop-shadow-sm">
                LIÊN HỆ TƯ VẤN
              </span>
              <h2 className="text-[26px] sm:text-[32px] md:text-[38px] font-semibold uppercase tracking-tight mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                Liên hệ tư vấn bộ quà tặng
              </h2>
              <div className="w-[50px] h-[1.5px] bg-vinex-gold mx-auto mb-4 shadow-sm"></div>
              <p className="text-white/90 mb-6 font-light text-[14px] sm:text-[15px] md:text-[16px] max-w-xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]">
                Đội ngũ VINEX sẵn sàng lắng nghe và xây dựng bộ quà hoàn hảo nhất cho doanh nghiệp của bạn.
              </p>
              <Link href={`/${lang}/lien-he`} className="inline-block group">
                <GlassButton as="div" variant="gold" size="md" className="px-8 py-3 !rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300 text-[13px] sm:text-[14px]">
                  NHẬN TƯ VẤN BỘ QUÀ TẶNG
                </GlassButton>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </SmoothScroll>
  );
}
