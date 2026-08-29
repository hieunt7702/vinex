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

  const steps = [
    { id: '1', title: 'Tiếp nhận điều thô' },
    { id: '2', title: 'Sàng lọc tạp chất' },
    { id: '3', title: 'Xử lý nguyên liệu' },
    { id: '4', title: 'Chẻ tách vỏ' },
    { id: '5', title: 'Sấy và bóc lụa' },
    { id: '6', title: 'Phân loại kích cỡ & màu' },
    { id: '7', title: 'Kiểm tra' },
    { id: '8', title: 'Đóng gói' },
  ];

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-[90px]">
        
        {/* Section 1: Hero ảnh nhà máy thật & Mô tả */}
        <section className="px-4 py-16 lg:py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6 leading-tight">{pg.hero_title}</h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mb-16 font-light leading-relaxed">
            Nền tảng vững chắc của VINEX, nơi tiếp nhận điều thô nguyên bản và trải qua quy trình chế biến khép kín để tạo ra nhân điều trắng đạt chuẩn chất lượng xuất khẩu cao nhất.
          </p>
          <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-sm overflow-hidden relative shadow-xl border border-[#E8E4D9]">
             <Image
               src="/images/banner/nha_may_boc_tach.png"
               alt="Nhà máy bóc tách điều VINEX"
               fill
               className="object-cover object-center"
               priority
             />
          </div>
        </section>

        {/* Section 2: Quy trình 8 bước */}
        <section className="px-4 py-16 lg:py-20 bg-[#FAF8F2]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Quy trình 8 bước</h2>
               <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {steps.map((step) => (
                  <div key={step.id} className="bg-white border border-[#E8E4D9] p-4 sm:p-6 lg:p-8 rounded-sm text-center flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
                     <span className="text-vinex-gold font-marcellus text-xl md:text-2xl mb-2 md:mb-3">{step.id}.</span>
                     <span className="font-bold text-vinex-teal text-[11px] md:text-[13px] uppercase tracking-wide leading-tight">{step.title}</span>
                  </div>
               ))}
            </div>
          </div>
        </section>

        {/* Section 3: Gallery khu vực nhà máy */}
        <section className="px-4 py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Hình ảnh khu vực sản xuất</h2>
               <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[2, 3, 4, 5, 6, 7].map((num) => (
                 <div key={num} className="aspect-[4/3] rounded-sm border border-[#E8E4D9] overflow-hidden group relative">
                    <Image
                      src={`/images/banner/nha_may${num}.png`}
                      alt={`Khu vực sản xuất ${num - 1}`}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                 </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Nguyên tắc kiểm tra và đóng gói */}
        <section className="px-4 py-16 lg:py-20 bg-[#FAF8F2]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Nguyên tắc kiểm tra & đóng gói</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
            <p className="text-[15px] text-gray-600 mb-8 font-light leading-relaxed">
              Kiểm soát chất lượng nghiêm ngặt ở bước cuối cùng đảm bảo độ ẩm, màu sắc và kích thước hạt đồng đều tuyệt đối. Bao bì chuyên dụng giúp bảo quản tối đa hương vị tự nhiên của hạt điều, đáp ứng vòng đời lưu kho an toàn.
            </p>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="px-4 py-16 lg:py-20 bg-vinex-teal text-white text-center border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-[40px] font-marcellus text-vinex-gold mb-6">Trao đổi nhu cầu cung ứng</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
            <p className="text-lg text-white/80 mb-12 font-light">
              Liên hệ ngay để nhận thông tin chi tiết về năng lực sản xuất và báo giá theo tiêu chuẩn.
            </p>
            <Link href="/vi/lien-he" className="inline-block px-12 py-4 bg-vinex-gold text-vinex-teal rounded-sm font-bold uppercase tracking-[0.15em] text-xs hover:bg-white transition-colors shadow-xl">
              Nhận tư vấn ngay
            </Link>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
