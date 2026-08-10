"use client";

import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';

export default function RequestQuotePage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <main className="w-full flex flex-col min-h-screen pt-[120px] pb-24 bg-vinex-white">
      <div className="max-w-4xl mx-auto px-4 w-full">
        
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.2em] text-[#D4AF37] uppercase mb-4 font-bold block">CORPORATE SOLUTIONS</span>
          <h1 className="text-4xl md:text-5xl font-bold text-vinex-black mb-6">Yêu Cầu Báo Giá</h1>
          <p className="text-gray-600 font-light">
            Vui lòng cung cấp thông tin chi tiết để VINEX có thể chuẩn bị đề xuất phù hợp nhất với yêu cầu của doanh nghiệp.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 md:p-12 rounded-xl shadow-xl border border-gray-100"
        >
          <form className="space-y-8">
            
            {/* Section 1: Thông tin liên hệ */}
            <div>
              <h3 className="text-lg font-bold text-vinex-black mb-6 border-b border-gray-100 pb-2">1. Thông tin Doanh nghiệp</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Tên Công Ty *</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-vinex-blue transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Người Liên Hệ *</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-vinex-blue transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Số Điện Thoại *</label>
                  <input type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-vinex-blue transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Email *</label>
                  <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-vinex-blue transition-all" required />
                </div>
              </div>
            </div>

            {/* Section 2: Nhu cầu */}
            <div>
              <h3 className="text-lg font-bold text-vinex-black mb-6 border-b border-gray-100 pb-2">2. Yêu cầu Quà Tặng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Số lượng dự kiến</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-vinex-blue transition-all text-gray-700">
                    <option>50 - 100 hộp</option>
                    <option>100 - 500 hộp</option>
                    <option>500 - 1000 hộp</option>
                    <option>Trên 1000 hộp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Ngân sách dự kiến (VNĐ/Hộp)</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-vinex-blue transition-all text-gray-700">
                    <option>Dưới 500.000đ</option>
                    <option>500.000đ - 1.000.000đ</option>
                    <option>1.000.000đ - 2.000.000đ</option>
                    <option>Trên 2.000.000đ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Dịp tặng quà</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-vinex-blue transition-all" placeholder="VD: Quà Tết, Sự kiện kỷ niệm..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Ngày cần giao hàng (dự kiến)</label>
                  <input type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-vinex-blue transition-all text-gray-700" />
                </div>
              </div>
            </div>

            {/* Section 3: Branding */}
            <div>
              <h3 className="text-lg font-bold text-vinex-black mb-6 border-b border-gray-100 pb-2">3. Yêu cầu tùy chỉnh (Branding)</h3>
              <div className="flex flex-wrap gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-vinex-blue rounded border-gray-300 focus:ring-vinex-blue" />
                  <span className="text-gray-600 font-light group-hover:text-vinex-black transition-colors">In/Ép kim Logo lên hộp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-vinex-blue rounded border-gray-300 focus:ring-vinex-blue" />
                  <span className="text-gray-600 font-light group-hover:text-vinex-black transition-colors">Ruy băng in Logo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-vinex-blue rounded border-gray-300 focus:ring-vinex-blue" />
                  <span className="text-gray-600 font-light group-hover:text-vinex-black transition-colors">Thiệp chúc mừng riêng</span>
                </label>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Ghi chú bổ sung</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-vinex-blue transition-all resize-none" placeholder="Mô tả thêm về yêu cầu đặc biệt của bạn..."></textarea>
              </div>
            </div>

            <div className="pt-6">
              <button type="button" className="w-full py-5 bg-gradient-to-r from-vinex-blue to-[#2B8390] text-white font-bold uppercase tracking-widest text-sm hover:shadow-lg transition-all rounded-md">
                Nhận đề xuất từ VINEX
              </button>
            </div>
            
          </form>
        </motion.div>
        
      </div>
    </main>
  );
}
