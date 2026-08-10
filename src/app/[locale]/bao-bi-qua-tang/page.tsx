import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';

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
        <section className="px-4 py-20 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{pg.hero_title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed">
             {pg.hero_desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {boxes.map((box, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden text-left hover:shadow-lg transition-shadow">
                   <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                      {/* Box Image Placeholder */}
                      <span className="text-gray-400 text-sm">Ảnh {box.name}</span>
                   </div>
                   <div className="p-6">
                      <h3 className="font-bold text-xl mb-3 text-vinex-blue">{box.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{box.desc}</p>
                      <ul className="text-xs text-gray-500 space-y-1 mt-4 border-t border-gray-100 pt-4">
                         <li>• Xem sơ đồ khay & kích thước</li>
                         <li>• Ứng dụng nhóm sản phẩm</li>
                      </ul>
                   </div>
                </div>
             ))}
          </div>
        </section>

        {/* Section 2: Khả năng tùy biến */}
        <section className="px-4 py-24 bg-white">
          <div className="max-w-5xl mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Khả năng tùy biến</h2>
                <p className="text-gray-600">Được tinh chỉnh dựa trên yêu cầu cụ thể của từng chiến dịch.</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-6 bg-vinex-white/50 rounded text-center border border-gray-100">
                   <h4 className="font-bold text-vinex-blue mb-2">Theo mùa vụ</h4>
                </div>
                <div className="p-6 bg-vinex-white/50 rounded text-center border border-gray-100">
                   <h4 className="font-bold text-vinex-blue mb-2">Theo nhận diện</h4>
                </div>
                <div className="p-6 bg-vinex-white/50 rounded text-center border border-gray-100">
                   <h4 className="font-bold text-vinex-blue mb-2">Theo nhóm sản phẩm</h4>
                </div>
                <div className="p-6 bg-vinex-white/50 rounded text-center border border-gray-100">
                   <h4 className="font-bold text-vinex-blue mb-2">Theo ngân sách</h4>
                </div>
             </div>
          </div>
        </section>

        {/* Section 3: CTA */}
        <section className="px-4 py-32 bg-vinex-blue text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Tư vấn kết cấu hộp</h2>
            <p className="text-white/70 mb-12">Chia sẻ ý tưởng, chúng tôi sẽ đề xuất giải pháp bao bì tối ưu nhất.</p>
            <Link href="/vi/giai-phap-doanh-nghiep" className="inline-block px-10 py-4 bg-vinex-yellow text-vinex-black rounded font-bold uppercase tracking-wider hover:bg-vinex-yellow/90 transition-colors">
              Gửi yêu cầu
            </Link>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
