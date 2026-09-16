import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassButton, GlassCard } from "@/components/ui/glass";

export const metadata: Metadata = {
  title: "Bao bì và hộp quà doanh nghiệp | VINEX",
  description: "Phát triển bao bì và hộp quà theo mùa vụ, nhận diện thương hiệu, nhóm sản phẩm và ngân sách doanh nghiệp.",
};

export default async function PackagingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const pg = t.pages.packaging;

  const boxes = [
    { name: 'Hộp quai xách', desc: 'Cấu trúc gọn gàng, thuận tiện di chuyển, phù hợp với các chương trình quà tặng.' },
    { name: 'Hộp nắp mở', desc: 'Hình thức mở trực tiếp, dễ bố trí sản phẩm và tạo trải nghiệm rõ ràng cho người nhận.' },
    { name: 'Hộp đa ngăn / Mở cánh', desc: 'Cấu trúc phân chia nhiều khu vực, phù hợp với bộ quà có nhiều nhóm sản phẩm.' },
  ];

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-20">

        {/* Section 1: Hero */}
        <section className="px-4 py-16 lg:py-20 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-marcellus text-vinex-teal mb-6">{pg.hero_title}</h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed font-light">
            {pg.hero_desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {boxes.map((box, idx) => (
              <GlassCard key={idx} variant="interactive" className="p-0 overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-medium">Ảnh {box.name}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-3 text-vinex-teal">{box.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 font-light leading-relaxed">{box.desc}</p>
                  <ul className="text-xs text-gray-500 space-y-1.5 mt-4 border-t border-black/5 pt-4">
                    <li>• Xem sơ đồ khay & kích thước</li>
                    <li>• Ứng dụng nhóm sản phẩm</li>
                  </ul>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Section 2: Khả năng tùy biến */}
        <section className="px-4 py-16 lg:py-20 ">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-marcellus text-vinex-teal mb-4">Khả năng tùy biến</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
              <p className="text-gray-600 font-light">Được tinh chỉnh dựa trên yêu cầu cụ thể của từng chiến dịch.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Theo mùa vụ', 'Theo nhận diện', 'Theo nhóm sản phẩm', 'Theo ngân sách'].map((tag, idx) => (
                <GlassCard key={idx} variant="default" className="p-6 text-center">
                  <h4 className="font-semibold text-vinex-teal text-sm md:text-base">{tag}</h4>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: CTA */}
        <section className="px-4 py-16 lg:py-20 bg-vinex-teal text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-marcellus text-vinex-gold mb-6">Tư vấn kết cấu hộp</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
            <p className="text-white/70 mb-12 font-light">Chia sẻ ý tưởng, chúng tôi sẽ đề xuất giải pháp bao bì tối ưu nhất.</p>
            <Link href="/vi/giai-phap-doanh-nghiep">
              <GlassButton variant="gold" size="lg">
                Gửi yêu cầu
              </GlassButton>
            </Link>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
