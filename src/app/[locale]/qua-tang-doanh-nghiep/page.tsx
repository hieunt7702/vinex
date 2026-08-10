import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';

export const metadata: Metadata = {
  title: "Quà tặng doanh nghiệp từ nông sản Việt | VINEX",
  description: "Giải pháp quà Tết, quà khách hàng, quà đối tác và quà sự kiện với sản phẩm, bao bì và ngân sách theo nhu cầu.",
};

export default async function CorporateGiftPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const pg = t.pages.gifts;

  const occasions = [
    { name: 'Quà Tết', bg: 'bg-vinex-gold text-vinex-teal border-vinex-gold' },
    { name: 'Quà khách hàng', bg: 'bg-white border-[#E8E4D9]' },
    { name: 'Quà đối tác', bg: 'bg-white border-[#E8E4D9]' },
    { name: 'Quà sự kiện', bg: 'bg-white border-[#E8E4D9]' },
    { name: 'Quà tri ân', bg: 'bg-white border-[#E8E4D9]' },
    { name: 'Quà nội bộ', bg: 'bg-white border-[#E8E4D9]' },
  ];

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-[#FAF8F2] text-vinex-black pt-[90px]">
        
        {/* Section 1: Hero & 3 nền tảng */}
        <section className="px-4 py-24 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6 leading-tight">{pg.hero_title}</h1>
          <p className="text-[17px] text-gray-600 max-w-3xl mx-auto mb-20 leading-relaxed font-light">
             {pg.hero_desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
             <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-[#E8E4D9] flex flex-col items-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-vinex-teal rounded-full flex items-center justify-center font-marcellus text-vinex-gold text-2xl md:text-3xl mb-6 md:mb-8 group-hover:scale-110 transition-transform">01</div>
                <h3 className="font-bold text-vinex-teal text-base md:text-[17px] mb-3 md:mb-4 text-center">Chất lượng <br className="hidden md:block"/> sản phẩm</h3>
                <p className="text-gray-500 font-light text-[13px] md:text-sm leading-relaxed text-center">Lựa chọn phù hợp từ danh mục nông sản cao cấp của VINEX.</p>
             </div>
             <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-[#E8E4D9] flex flex-col items-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-vinex-teal rounded-full flex items-center justify-center font-marcellus text-vinex-gold text-2xl md:text-3xl mb-6 md:mb-8 group-hover:scale-110 transition-transform">02</div>
                <h3 className="font-bold text-vinex-teal text-base md:text-[17px] mb-3 md:mb-4 text-center">Thẩm mỹ & <br className="hidden md:block"/> câu chuyện</h3>
                <p className="text-gray-500 font-light text-[13px] md:text-sm leading-relaxed text-center">Bao bì có chủ đích, thiết kế sang trọng truyền tải thông điệp.</p>
             </div>
             <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-[#E8E4D9] flex flex-col items-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-vinex-teal rounded-full flex items-center justify-center font-marcellus text-vinex-gold text-2xl md:text-3xl mb-6 md:mb-8 group-hover:scale-110 transition-transform">03</div>
                <h3 className="font-bold text-vinex-teal text-base md:text-[17px] mb-3 md:mb-4 text-center">Ngân sách <br className="hidden md:block"/> phù hợp</h3>
                <p className="text-gray-500 font-light text-[13px] md:text-sm leading-relaxed text-center">Cơ cấu linh hoạt theo từng yêu cầu và đối tượng của doanh nghiệp.</p>
             </div>
          </div>
        </section>

        {/* Section 2: Ứng dụng theo dịp */}
        <section className="px-4 py-20 bg-white border-y border-[#E8E4D9]">
          <div className="max-w-4xl mx-auto">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {occasions.map((occ, idx) => (
                   <div key={idx} className={`p-6 rounded-sm text-center font-bold text-sm tracking-widest uppercase border hover:shadow-md transition-shadow cursor-default ${occ.bg}`}>
                      {occ.name}
                   </div>
                ))}
             </div>
          </div>
        </section>

        {/* Section 3: Xem thêm khả năng tùy biến bao bì */}
        <section className="px-4 py-32 bg-[#FAF8F2] text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-8">Bao bì và hộp quà theo yêu cầu</h2>
            <p className="text-[15px] md:text-[17px] text-gray-600 mb-12 font-light">Khám phá các lựa chọn kết cấu hộp, trải nghiệm mở hộp và khả năng tùy biến nhận diện thương hiệu.</p>
            <div className="w-full aspect-[4/3] md:aspect-[21/9] bg-white border border-[#E8E4D9] rounded-sm mb-12 flex items-center justify-center shadow-lg relative overflow-hidden">
               <div className="absolute inset-0 bg-vinex-teal/5"></div>
               <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs text-gray-400 relative z-10 text-center px-4">Packaging Collection Mockup</span>
            </div>
            <Link href="/vi/bao-bi-qua-tang" className="inline-block px-12 py-4 bg-white text-vinex-teal border border-vinex-teal rounded-sm font-bold uppercase tracking-[0.15em] text-xs hover:bg-vinex-teal hover:text-white transition-colors">
               Xem chi tiết bao bì
            </Link>
          </div>
        </section>

        {/* Section 4: Form tư vấn */}
        <section className="px-4 py-32 bg-vinex-teal text-white border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-gold mb-6">Liên hệ tư vấn quà tặng</h2>
            <p className="text-white/80 mb-12 font-light text-[17px]">Đội ngũ VINEX sẵn sàng lắng nghe và xây dựng bộ quà hoàn hảo nhất cho doanh nghiệp của bạn.</p>
            <Link href="/vi/lien-he" className="inline-block px-12 py-4 bg-vinex-gold text-vinex-teal rounded-sm font-bold uppercase tracking-[0.15em] text-xs hover:bg-white transition-colors shadow-xl">
              Nhận tư vấn bộ quà
            </Link>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
