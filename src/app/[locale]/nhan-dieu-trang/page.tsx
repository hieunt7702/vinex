import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export const metadata: Metadata = {
  title: "Nhân điều trắng VINEX | Cung ứng theo quy cách",
  description: "Nhân điều trắng từ hoạt động bóc tách điều thô của VINEX, phục vụ cung ứng và phát triển sản phẩm từ hạt điều.",
};

export default function WhiteCashewPage() {
  const cmsFields = [
    { label: 'Grade / kích cỡ', value: '...' },
    { label: 'Màu sắc', value: '...' },
    { label: 'Độ ẩm', value: '...' },
    { label: 'Hình thức đóng gói', value: '...' },
    { label: 'Khối lượng', value: '...' },
    { label: 'MOQ / lead time', value: '...' },
  ];

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-20">
        
        {/* Section 1: Hero & Mô tả */}
        <section className="px-4 py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nhân điều trắng - nền tảng của chuỗi giá trị</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-12 leading-relaxed">
             Dòng sản phẩm nguyên liệu chất lượng cao, cung ứng theo quy chuẩn khắt khe, đáp ứng nhu cầu chế biến sâu và xuất khẩu.
          </p>
          <div className="w-full h-[500px] bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
             {/* Hero Image placeholder */}
          </div>
        </section>

        {/* Section 2: Thông số kỹ thuật (CMS fields) */}
        <section className="px-4 py-24 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Thông số kỹ thuật</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {cmsFields.map((field, idx) => (
                 <div key={idx} className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-center">
                    <span className="block text-sm text-gray-500 mb-2">{field.label}</span>
                    <span className="block font-bold text-lg text-vinex-blue">{field.value}</span>
                 </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-8 italic">
              * Dữ liệu đang chờ VINEX xác nhận - không tự điền.
            </p>
          </div>
        </section>

        {/* Section 3: Ứng dụng & Quy cách đóng gói */}
        <section className="px-4 py-24 bg-vinex-white/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8">Ứng dụng đa dạng</h2>
              <ul className="space-y-4">
                 <li className="flex items-center gap-4 bg-white p-4 rounded border border-gray-100">
                    <span className="text-vinex-yellow font-bold text-xl">01</span>
                    <span className="font-medium">Cung ứng thương mại nguyên liệu</span>
                 </li>
                 <li className="flex items-center gap-4 bg-white p-4 rounded border border-gray-100">
                    <span className="text-vinex-yellow font-bold text-xl">02</span>
                    <span className="font-medium">Chế biến hạt điều tẩm vị</span>
                 </li>
                 <li className="flex items-center gap-4 bg-white p-4 rounded border border-gray-100">
                    <span className="text-vinex-yellow font-bold text-xl">03</span>
                    <span className="font-medium">Đóng gói sản phẩm bán lẻ</span>
                 </li>
                 <li className="flex items-center gap-4 bg-white p-4 rounded border border-gray-100">
                    <span className="text-vinex-yellow font-bold text-xl">04</span>
                    <span className="font-medium">Kết hợp trong bộ quà doanh nghiệp</span>
                 </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8">Quy cách đóng gói</h2>
              <div className="bg-white p-8 rounded border border-gray-100 h-[calc(100%-4rem)] flex items-center justify-center text-gray-500">
                 {/* Quy cách image / description placeholder */}
                 Chi tiết quy cách đóng gói sẽ được cập nhật.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Form yêu cầu cung ứng */}
        <section className="px-4 py-32 bg-vinex-blue text-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-6">Yêu cầu cung ứng</h2>
               <p className="text-white/70">Để lại thông tin, đội ngũ VINEX sẽ liên hệ tư vấn quy cách và báo giá phù hợp.</p>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Họ tên" className="w-full p-4 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-vinex-yellow" />
                <input type="text" placeholder="Doanh nghiệp" className="w-full p-4 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-vinex-yellow" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="email" placeholder="Email" className="w-full p-4 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-vinex-yellow" />
                <input type="tel" placeholder="Số điện thoại" className="w-full p-4 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-vinex-yellow" />
              </div>
              <textarea placeholder="Nhu cầu cung ứng chi tiết (Số lượng, quy cách...)" rows={4} className="w-full p-4 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-vinex-yellow"></textarea>
              <div className="text-center mt-8">
                <button type="button" className="px-10 py-4 bg-vinex-yellow text-vinex-black rounded font-bold uppercase tracking-wider hover:bg-vinex-yellow/90 transition-colors w-full md:w-auto">
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
