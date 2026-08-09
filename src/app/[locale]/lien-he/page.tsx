import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export const metadata: Metadata = {
  title: "Liên hệ VINEX | Nông sản và Quà tặng doanh nghiệp",
  description: "Kết nối cùng VINEX để nhận tư vấn về cung ứng nhân điều trắng, sản phẩm nông sản, bao bì và bộ quà tặng doanh nghiệp.",
};

export default function ContactPage() {
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-20">
        
        <section className="px-4 py-20 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-16">
           
           {/* Form Section */}
           <div className="flex-1 bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
              <h1 className="text-3xl md:text-4xl font-bold mb-8">Kết nối cùng VINEX</h1>
              
              <form className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Họ tên</label>
                    <input type="text" className="w-full p-4 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-blue focus:ring-1 focus:ring-vinex-blue transition-all" />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Doanh nghiệp</label>
                    <input type="text" className="w-full p-4 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-blue focus:ring-1 focus:ring-vinex-blue transition-all" />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Điện thoại / Email</label>
                    <input type="text" className="w-full p-4 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-blue focus:ring-1 focus:ring-vinex-blue transition-all" />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Nhu cầu</label>
                    <select className="w-full p-4 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-blue focus:ring-1 focus:ring-vinex-blue transition-all">
                       <option value="">Chọn nhu cầu...</option>
                       <option value="cung-ung">Cung ứng thương mại</option>
                       <option value="san-pham">Sản phẩm bán lẻ</option>
                       <option value="bao-bi">Sản xuất bao bì</option>
                       <option value="qua-tang">Bộ quà tặng doanh nghiệp</option>
                    </select>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Nội dung</label>
                    <textarea rows={4} className="w-full p-4 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-blue focus:ring-1 focus:ring-vinex-blue transition-all"></textarea>
                 </div>

                 <div className="flex items-start gap-3">
                    <input type="checkbox" id="consent" className="mt-1 accent-vinex-blue" />
                    <label htmlFor="consent" className="text-sm text-gray-600">
                       Tôi đồng ý với chính sách bảo mật và cho phép VINEX liên hệ dựa trên thông tin đã cung cấp.
                    </label>
                 </div>
                 
                 <div className="pt-4">
                    <button type="button" className="px-10 py-4 bg-vinex-blue text-white rounded font-bold uppercase tracking-wider hover:bg-vinex-blue/90 transition-colors w-full md:w-auto shadow-lg shadow-vinex-blue/20">
                       Gửi yêu cầu
                    </button>
                 </div>
              </form>
           </div>

           {/* Info Section */}
           <div className="w-full lg:w-96 shrink-0 flex flex-col gap-12 pt-4">
              <div>
                 <h2 className="text-xl font-bold mb-6">Thông tin liên hệ</h2>
                 <ul className="space-y-6 text-gray-600">
                    {/* Placeholder content will be updated when confirmed */}
                    <li>
                       <span className="block font-bold text-sm text-vinex-blue mb-1">Hotline</span>
                       <span className="text-lg">--</span>
                    </li>
                    <li>
                       <span className="block font-bold text-sm text-vinex-blue mb-1">Email</span>
                       <span className="text-lg">--</span>
                    </li>
                    <li>
                       <span className="block font-bold text-sm text-vinex-blue mb-1">Văn phòng</span>
                       <span>--</span>
                    </li>
                    <li>
                       <span className="block font-bold text-sm text-vinex-blue mb-1">Nhà máy</span>
                       <span>--</span>
                    </li>
                 </ul>
              </div>
              
              <div className="bg-vinex-yellow/10 p-6 rounded-lg border border-vinex-yellow/20">
                 <h3 className="font-bold text-vinex-blue mb-2">Giờ làm việc</h3>
                 <p className="text-gray-600 text-sm">Thứ 2 - Thứ 6: 8:00 - 17:30<br/>Thứ 7: 8:00 - 12:00</p>
              </div>
           </div>

        </section>

      </main>
    </SmoothScroll>
  );
}
