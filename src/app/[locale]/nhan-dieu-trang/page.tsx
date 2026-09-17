import { Metadata } from 'next';
import Image from 'next/image';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassButton, GlassCard } from '@/components/ui/glass';

export const metadata: Metadata = {
  title: "Nhân điều trắng VINEX | Cung ứng theo quy cách",
  description: "Nhân điều trắng từ hoạt động bóc tách điều thô của VINEX, phục vụ cung ứng và phát triển sản phẩm từ hạt điều.",
};

export default async function WhiteCashewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const pg = t.pages.cashew;

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
          {/* Section 1: Hero & Mô tả */}
          <section className="px-4 py-16 lg:py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6 leading-tight">{pg.hero_title}</h1>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mb-16 font-light leading-relaxed">
              {pg.hero_desc}
            </p>
            <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[24px] overflow-hidden relative shadow-xl border border-[#E8E4D9]">
              <Image
                src="/images/banner/nhan_dieu_trang.png"
                alt="Nhân điều trắng VINEX"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </section>

          {/* Section 2: Mô tả chi tiết */}
          <section className="px-4 py-16 lg:py-20 bg-white/40">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">{pg.section2_title}</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
              <p className="text-[15px] text-gray-600 font-light leading-relaxed">
                {pg.section2_desc}
              </p>
            </div>
          </section>

          {/* Section 3: CTA */}
          <section className="px-4 py-16 lg:py-20 bg-vinex-teal text-white text-center border-t border-white/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-[40px] font-marcellus text-vinex-gold mb-6">Trao đổi nhu cầu cung ứng</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
              <p className="text-lg text-white/80 mb-12 font-light">
                Liên hệ ngay để nhận thông tin chi tiết về năng lực sản xuất và báo giá theo tiêu chuẩn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button type="button">
                  <GlassButton variant="gold" size="lg">
                    Tải bảng quy chuẩn
                  </GlassButton>
                </button>
                <Link href={`/${locale}/lien-he`}>
                  <GlassButton variant="secondary" size="lg" className="border-white/20 hover:bg-white/10">
                    Liên hệ nhận mẫu
                  </GlassButton>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SmoothScroll>
  );
}
