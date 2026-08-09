import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Quà tặng doanh nghiệp từ nông sản Việt | VINEX",
  description: "Giải pháp quà Tết, quà khách hàng, quà đối tác và quà sự kiện với sản phẩm, bao bì và ngân sách theo nhu cầu.",
};

export default function CorporateGiftPage() {
  const occasions = [
    { name: 'Quà Tết', bg: 'bg-vinex-yellow text-vinex-black' },
    { name: 'Quà khách hàng', bg: 'bg-white' },
    { name: 'Quà đối tác', bg: 'bg-white' },
    { name: 'Quà sự kiện', bg: 'bg-white' },
    { name: 'Quà tri ân', bg: 'bg-white' },
    { name: 'Quà nội bộ', bg: 'bg-white' },
  ];

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-20">
        
        {/* Section 1: Hero & 3 nền tảng */}
        <section className="px-4 py-20 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Quà tặng được xây dựng có chủ đích</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
             Một món quà cần phù hợp với người nhận, thể hiện đúng tinh thần thương hiệu và tạo trải nghiệm khi mở hộp.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-lg border border-gray-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-vinex-yellow rounded-full flex items-center justify-center font-bold text-xl mb-6">01</div>
                <h3 className="font-bold text-xl mb-4">Chất lượng sản phẩm</h3>
                <p className="text-gray-500">Lựa chọn phù hợp từ danh mục nông sản cao cấp.</p>
             </div>
             <div className="bg-white p-8 rounded-lg border border-gray-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-vinex-yellow rounded-full flex items-center justify-center font-bold text-xl mb-6">02</div>
                <h3 className="font-bold text-xl mb-4">Thẩm mỹ & câu chuyện</h3>
                <p className="text-gray-500">Bao bì có chủ đích, thiết kế sang trọng.</p>
             </div>
             <div className="bg-white p-8 rounded-lg border border-gray-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-vinex-yellow rounded-full flex items-center justify-center font-bold text-xl mb-6">03</div>
                <h3 className="font-bold text-xl mb-4">Ngân sách phù hợp</h3>
                <p className="text-gray-500">Cơ cấu linh hoạt theo từng yêu cầu doanh nghiệp.</p>
             </div>
          </div>
        </section>

        {/* Section 2: Ứng dụng theo dịp */}
        <section className="px-4 py-16 bg-white">
          <div className="max-w-4xl mx-auto">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {occasions.map((occ, idx) => (
                   <div key={idx} className={`p-4 rounded-lg text-center font-bold border border-gray-100 shadow-sm ${occ.bg}`}>
                      {occ.name}
                   </div>
                ))}
             </div>
          </div>
        </section>

        {/* Section 3: Xem thêm khả năng tùy biến bao bì */}
        <section className="px-4 py-24 bg-vinex-white/50 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Bao bì và hộp quà theo yêu cầu</h2>
            <p className="text-lg text-gray-600 mb-10">Khám phá các lựa chọn kết cấu hộp, trải nghiệm mở hộp và khả năng tùy biến nhận diện thương hiệu.</p>
            <div className="w-full h-[400px] bg-gray-200 rounded-lg mb-10 flex items-center justify-center">
               {/* Collection layout placeholder */}
            </div>
            <Link href="/vi/bao-bi-qua-tang" className="inline-block px-8 py-3 bg-white text-vinex-blue border border-vinex-blue rounded font-bold uppercase tracking-wider text-sm hover:bg-gray-50 transition-colors">
               Xem chi tiết bao bì
            </Link>
          </div>
        </section>

        {/* Section 4: Form tư vấn */}
        <section className="px-4 py-32 bg-vinex-blue text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Liên hệ tư vấn quà tặng</h2>
            <p className="text-white/70 mb-12">Đội ngũ VINEX sẵn sàng lắng nghe và xây dựng bộ quà hoàn hảo nhất cho doanh nghiệp của bạn.</p>
            <a href="/vi/lien-he" className="inline-block px-10 py-4 bg-vinex-yellow text-vinex-black rounded font-bold uppercase tracking-wider hover:bg-vinex-yellow/90 transition-colors">
              Gửi yêu cầu
            </a>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
