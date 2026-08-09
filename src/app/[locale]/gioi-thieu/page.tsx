import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ValueChain } from "@/components/home/ValueChain"; // Reusing the chain from homepage

export const metadata: Metadata = {
  title: "Giới thiệu VINEX | Từ hạt điều đến nông sản Việt",
  description: "Tìm hiểu hành trình VINEX từ nhà máy bóc tách điều thô đến nhân điều trắng, sản phẩm nông sản, bao bì và quà tặng doanh nghiệp.",
};

export default function AboutPage() {
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-24">
        {/* Section 1: Hero + câu chuyện khởi đầu */}
        <section className="px-4 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Từ hạt điều đến giải pháp sản phẩm</h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              VINEX bắt đầu từ nền tảng nhà máy bóc tách điều thô, nơi nguyên liệu được xử lý và phân loại để tạo ra nhân điều trắng.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Từ nền tảng ấy, VINEX mở rộng sang hạt điều tẩm vị, sản phẩm từ nông sản Việt, bao bì và quà tặng doanh nghiệp.
            </p>
          </div>
          <div className="flex-1 w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
             {/* Image placeholder */}
          </div>
        </section>

        {/* Section 2: Chuỗi phát triển giá trị */}
        <ValueChain />

        {/* Section 3: Quan điểm về sản phẩm và bao bì */}
        <section className="px-4 py-24 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Quan điểm sản phẩm & bao bì</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
             <div className="bg-white p-8 rounded border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-vinex-blue">Sản phẩm chân thật</h3>
                <p className="text-gray-600">Nông sản thật, chất lượng thật, hạn chế can thiệp quá mức làm mất đi giá trị tự nhiên.</p>
             </div>
             <div className="bg-white p-8 rounded border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-vinex-blue">Bao bì có chủ đích</h3>
                <p className="text-gray-600">Thiết kế tinh gọn, sử dụng mảng cong lớn và motif sao 4 cánh, tạo ra trải nghiệm thị giác cao cấp mà không rườm rà.</p>
             </div>
          </div>
        </section>

        {/* Section 4: Nhóm năng lực chính */}
        <section className="px-4 py-24 bg-vinex-blue text-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Nhóm năng lực chính</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               <div>
                  <div className="text-vinex-yellow text-4xl font-bold mb-4">01</div>
                  <h3 className="font-bold mb-2 text-xl">Sản xuất lõi</h3>
                  <p className="text-white/70 text-sm">Nhà máy bóc tách điều thô chuyên nghiệp.</p>
               </div>
               <div>
                  <div className="text-vinex-yellow text-4xl font-bold mb-4">02</div>
                  <h3 className="font-bold mb-2 text-xl">Phát triển danh mục</h3>
                  <p className="text-white/70 text-sm">Lên ý tưởng, thử nghiệm và chuẩn hóa sản phẩm nông sản.</p>
               </div>
               <div>
                  <div className="text-vinex-yellow text-4xl font-bold mb-4">03</div>
                  <h3 className="font-bold mb-2 text-xl">Giải pháp doanh nghiệp</h3>
                  <p className="text-white/70 text-sm">Tư vấn bao bì và quà tặng theo nhu cầu, ngân sách.</p>
               </div>
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="px-4 py-32 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Kết nối cùng VINEX</h2>
          <p className="text-lg text-gray-600 mb-10">Chia sẻ nhu cầu của bạn để chúng tôi đề xuất giải pháp phù hợp nhất.</p>
          <a href="/vi/lien-he" className="inline-block px-10 py-4 bg-vinex-yellow text-vinex-black rounded font-bold uppercase tracking-wider hover:bg-vinex-yellow/90 transition-colors">
            Nhận tư vấn
          </a>
        </section>

      </main>
    </SmoothScroll>
  );
}
