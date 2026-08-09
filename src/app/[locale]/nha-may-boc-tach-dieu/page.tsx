import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export const metadata: Metadata = {
  title: "Nhà máy bóc tách điều thô VINEX",
  description: "Tìm hiểu quy trình tiếp nhận, xử lý, bóc tách, bóc lụa, phân loại, kiểm tra và đóng gói nhân điều trắng tại VINEX.",
};

export default function FactoryPage() {
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
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-20">
        
        {/* Section 1: Hero ảnh nhà máy thật & Mô tả */}
        <section className="px-4 py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nhà máy bóc tách điều thô</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-12 leading-relaxed">
            Nền tảng vững chắc của VINEX, nơi tiếp nhận điều thô nguyên bản và trải qua quy trình chế biến khép kín để tạo ra nhân điều trắng đạt chuẩn.
          </p>
          <div className="w-full h-[500px] bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
             {/* Hero Image placeholder */}
          </div>
        </section>

        {/* Section 2: Quy trình 8 bước */}
        <section className="px-4 py-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-16 text-center">Quy trình 8 bước</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {steps.map((step) => (
                  <div key={step.id} className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-center flex flex-col items-center justify-center">
                     <span className="text-vinex-yellow font-bold text-lg mb-2">{step.id}.</span>
                     <span className="font-medium text-sm">{step.title}</span>
                  </div>
               ))}
            </div>
          </div>
        </section>

        {/* Section 3: Gallery khu vực nhà máy */}
        <section className="px-4 py-24 bg-vinex-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Hình ảnh nhà máy</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((img) => (
                 <div key={img} className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                    {/* Gallery Image placeholder */}
                 </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Nguyên tắc kiểm tra và đóng gói */}
        <section className="px-4 py-24 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Nguyên tắc kiểm tra & đóng gói</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Kiểm soát chất lượng nghiêm ngặt ở bước cuối cùng đảm bảo độ ẩm, màu sắc và kích thước hạt đồng đều. Bao bì chuyên dụng giúp bảo quản tối đa hương vị tự nhiên của điều.
          </p>
        </section>

        {/* Section 5: CTA */}
        <section className="px-4 py-32 bg-vinex-blue text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Trao đổi nhu cầu cung ứng</h2>
            <p className="text-lg text-white/70 mb-10">Liên hệ ngay để nhận thông tin chi tiết về năng lực sản xuất và tiêu chuẩn sản phẩm.</p>
            <a href="/vi/lien-he" className="inline-block px-10 py-4 bg-vinex-yellow text-vinex-black rounded font-bold uppercase tracking-wider hover:bg-vinex-yellow/90 transition-colors">
              Nhận tư vấn
            </a>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
