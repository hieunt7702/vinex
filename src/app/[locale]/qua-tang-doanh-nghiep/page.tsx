import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassButton, GlassCard } from '@/components/ui/glass';

export const metadata: Metadata = {
  title: "Quà tặng doanh nghiệp từ nông sản Việt | VINEX",
  description: "Giải pháp quà Tết, quà khách hàng, quà đối tác và quà sự kiện với sản phẩm, bao bì và ngân sách theo nhu cầu.",
};

export default async function CorporateGiftPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
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
      <main className="w-full flex flex-col min-h-screen bg-[#FAF8F2] text-vinex-black pt-[90px]">

        {/* Section 1: Hero & 3 nền tảng */}
        <section className="px-4 py-16 lg:py-20 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6 leading-tight">{pg.hero_title}</h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-[17px] text-gray-600 max-w-3xl mx-auto mb-20 leading-relaxed font-light">
            {pg.hero_desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <GlassCard variant="interactive" className="p-8 md:p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-vinex-teal rounded-full flex items-center justify-center font-marcellus text-vinex-gold text-2xl mb-6">01</div>
              <h3 className="font-semibold text-vinex-teal text-lg mb-3">Chất lượng <br /> sản phẩm</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">Lựa chọn phù hợp từ danh mục nông sản cao cấp của VINEX.</p>
            </GlassCard>
            <GlassCard variant="interactive" className="p-8 md:p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-vinex-teal rounded-full flex items-center justify-center font-marcellus text-vinex-gold text-2xl mb-6">02</div>
              <h3 className="font-semibold text-vinex-teal text-lg mb-3">Thẩm mỹ & <br /> câu chuyện</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">Bao bì có chủ đích, thiết kế sang trọng truyền tải thông điệp.</p>
            </GlassCard>
            <GlassCard variant="interactive" className="p-8 md:p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-vinex-teal rounded-full flex items-center justify-center font-marcellus text-vinex-gold text-2xl mb-6">03</div>
              <h3 className="font-semibold text-vinex-teal text-lg mb-3">Ngân sách <br /> phù hợp</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">Cơ cấu linh hoạt theo từng yêu cầu và đối tượng của doanh nghiệp.</p>
            </GlassCard>
          </div>
        </section>

        {/* Section 2: Ứng dụng theo dịp */}
        <section className="px-4 py-16 bg-white border-y border-[#E8E4D9]">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {occasions.map((occ, idx) => (
                <GlassCard
                  key={idx}
                  variant={occ.highlight ? "elevated" : "default"}
                  className={`p-6 text-center font-semibold text-sm tracking-widest uppercase cursor-default ${occ.highlight ? "border-vinex-gold text-vinex-teal" : "text-vinex-charcoal"
                    }`}
                >
                  {occ.name}
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Xem thêm khả năng tùy biến bao bì */}
        <section className="px-4 py-16 lg:py-20 bg-[#FAF8F2] text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Bao bì và hộp quà theo yêu cầu</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
            <p className="text-[15px] md:text-[17px] text-gray-600 mb-12 font-light">Khám phá các lựa chọn kết cấu hộp, trải nghiệm mở hộp và khả năng tùy biến nhận diện thương hiệu.</p>
            <GlassCard variant="elevated" className="w-full aspect-[4/3] md:aspect-[21/9] mb-12 flex items-center justify-center relative overflow-hidden">
              <span className="font-semibold uppercase tracking-widest text-xs text-gray-400 px-4">Packaging Collection Preview</span>
            </GlassCard>
            <Link href="/vi/bao-bi-qua-tang">
              <GlassButton variant="secondary" size="lg">
                Xem chi tiết bao bì &rarr;
              </GlassButton>
            </Link>
          </div>
        </section>

        {/* Section 4: Form tư vấn */}
        <section className="px-4 py-16 lg:py-20 bg-vinex-teal text-white border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-gold mb-6">Liên hệ tư vấn quà tặng</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
            <p className="text-white/80 mb-12 font-light text-[17px]">Đội ngũ VINEX sẵn sàng lắng nghe và xây dựng bộ quà hoàn hảo nhất cho doanh nghiệp của bạn.</p>
            <Link href="/vi/lien-he">
              <GlassButton variant="gold" size="lg">
                Nhận tư vấn bộ quà
              </GlassButton>
            </Link>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
