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

  const occasions = [
    { name: 'Quà Tết', highlight: true },
    { name: 'Quà khách hàng', highlight: false },
    { name: 'Quà đối tác', highlight: false },
    { name: 'Quà sự kiện', highlight: false },
    { name: 'Quà tri ân', highlight: false },
    { name: 'Quà nội bộ', highlight: false },
  ];

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
        {/* Section 1: Hero & Intro */}
        <section className="px-4 py-16 lg:py-24 max-w-5xl mx-auto text-center">
          <span className="text-vinex-gold font-bold tracking-widest text-[13px] uppercase mb-6 block">
            {lang === 'en' ? 'CORPORATE GIFTING' : 'QUÀ TẶNG DOANH NGHIỆP'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#074751] mb-8 leading-tight tracking-tight uppercase">
            {pg.hero_title}
          </h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-10"></div>
          <p className="text-[16px] md:text-[18px] text-[#2b5963] max-w-3xl mx-auto leading-relaxed font-medium">
            {pg.hero_desc}
          </p>
        </section>

        {/* Section 2: 4 Collections Showcase */}
        <section className="px-4 pb-20 lg:pb-32">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              { id: '01', name: lang === 'en' ? 'Appreciation Gifts' : 'Quà tặng Tri ân', desc: lang === 'en' ? 'For employees and long-term partners.' : 'Dành cho CBNV và những đối tác gắn bó lâu dài.', img: '/images/product/Collection 6.png' },
              { id: '02', name: lang === 'en' ? 'Partner Gifts' : 'Quà tặng Đối tác', desc: lang === 'en' ? 'Premium sets for VIP clients.' : 'Những lựa chọn cao cấp dành cho khách hàng VIP và đối tác chiến lược.', img: '/images/product/Collection 7.png' },
              { id: '03', name: lang === 'en' ? 'Event Gifts' : 'Quà tặng Sự kiện', desc: lang === 'en' ? 'Compact, meaningful gifts for events.' : 'Giải pháp quà tặng tinh gọn, ý nghĩa cho các sự kiện doanh nghiệp.', img: '/images/product/Collection 9.png' },
              { id: '04', name: lang === 'en' ? 'Internal Gifts' : 'Quà tặng Nội bộ', desc: lang === 'en' ? 'For internal holidays and team building.' : 'Lựa chọn quà tặng các dịp lễ Tết nội bộ, xây dựng văn hóa doanh nghiệp.', img: '/images/product/Collection 10.png' },
            ].map((col, idx) => (
              <GlassCard
                key={idx}
                radius={24}
                className="overflow-hidden group hover:-translate-y-2 transition-transform duration-500 shadow-[0_24px_50px_rgba(7,71,81,0.06)]"
                contentClassName="p-6 sm:p-8 flex flex-col"
              >
                <div className="aspect-[16/10] bg-slate-200 rounded-[16px] mb-8 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#074751]/5 transition-colors group-hover:bg-[#074751]/10 z-10"></div>
                  <Image 
                    src={col.img} 
                    alt={col.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-vinex-gold font-bold text-[14px] mb-2">{col.id}</div>
                    <h3 className="text-2xl font-bold text-[#074751] mb-3">{col.name}</h3>
                    <p className="text-[15px] text-[#5c858e] leading-relaxed max-w-[400px]">{col.desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-vinex-ivory flex items-center justify-center shrink-0 group-hover:bg-[#074751] group-hover:text-white transition-colors border border-black/5 shadow-sm">
                    <span className="font-bold text-lg leading-none mt-[-2px]">&rarr;</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Section 3: Form tư vấn */}
        <section className="px-4 py-16 lg:py-24 bg-[#074751] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-vinex-gold font-bold tracking-widest text-[13px] uppercase mb-4 block">
              LIÊN HỆ TƯ VẤN
            </span>
            <h2 className="text-[34px] md:text-[42px] font-semibold uppercase tracking-tight mb-6">Liên hệ tư vấn bộ quà</h2>
            <div className="w-[60px] h-[2px] bg-vinex-gold mx-auto mb-8"></div>
            <p className="text-white/80 mb-12 font-light text-[16px] md:text-[18px] max-w-2xl mx-auto">
              Đội ngũ VINEX sẵn sàng lắng nghe và xây dựng bộ quà hoàn hảo nhất cho doanh nghiệp của bạn.
            </p>
            <Link href={`/${lang}/lien-he`}>
              <GlassButton variant="gold" size="lg" className="px-10 py-4 !rounded-full">
                NHẬN TƯ VẤN BỘ QUÀ
              </GlassButton>
            </Link>
          </div>
        </section>

        </div>
      </main>
    </SmoothScroll>
  );
}
