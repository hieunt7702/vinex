"use client";

import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import { GlassCard, GlassButton, GlassInput, GlassTextarea } from '@/components/ui/glass';

export default function RequestQuotePage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();
  const pg = t.pages.request_quote;

  return (
    <main className="w-full flex flex-col min-h-screen pt-[120px] pb-24 ">
      <div className="max-w-4xl mx-auto px-4 w-full">

        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.2em] text-vinex-teal uppercase mb-4 font-semibold block">CORPORATE SOLUTIONS</span>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-marcellus text-vinex-teal mb-6">{pg.hero_title}</h1>
          <p className="text-vinex-charcoal/70 font-light">{pg.hero_desc}</p>
        </div>

        <GlassCard
          radius={16}
          displacementScale={15}
          blurAmount={0.06}
          className="bg-white/80 p-8 md:p-12 rounded-xl shadow-xl border border-black/5"
        >
          <form className="space-y-8">

            {/* Section 1: Thông tin liên hệ */}
            <div>
              <h3 className="text-lg font-marcellus text-vinex-teal mb-6 border-b border-black/5 pb-2">1. Thông tin Doanh nghiệp</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassInput label="Tên Công Ty *" required placeholder="VD: Tập đoàn ABC..." />
                <GlassInput label="Người Liên Hệ *" required placeholder="Họ và tên người đại diện..." />
                <GlassInput label="Số Điện Thoại *" type="tel" required placeholder="0901234567..." />
                <GlassInput label="Email *" type="email" required placeholder="name@company.com..." />
              </div>
            </div>

            {/* Section 2: Nhu cầu */}
            <div>
              <h3 className="text-lg font-marcellus text-vinex-teal mb-6 border-b border-black/5 pb-2">2. Yêu cầu Quà Tặng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-vinex-charcoal uppercase tracking-wider mb-2">Số lượng dự kiến</label>
                  <select className="w-full px-4 py-3 bg-white/60 border border-black/10 rounded-lg focus:outline-none focus:border-vinex-teal focus:ring-2 focus:ring-vinex-teal/15 transition-all text-vinex-charcoal text-sm">
                    <option>50 - 100 hộp</option>
                    <option>100 - 500 hộp</option>
                    <option>500 - 1000 hộp</option>
                    <option>Trên 1000 hộp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-vinex-charcoal uppercase tracking-wider mb-2">Ngân sách dự kiến (VNĐ/Hộp)</label>
                  <select className="w-full px-4 py-3 bg-white/60 border border-black/10 rounded-lg focus:outline-none focus:border-vinex-teal focus:ring-2 focus:ring-vinex-teal/15 transition-all text-vinex-charcoal text-sm">
                    <option>Dưới 500.000đ</option>
                    <option>500.000đ - 1.000.000đ</option>
                    <option>1.000.000đ - 2.000.000đ</option>
                    <option>Trên 2.000.000đ</option>
                  </select>
                </div>
                <GlassInput label="Dịp tặng quà" placeholder="VD: Quà Tết, Sự kiện kỷ niệm..." />
                <GlassInput label="Ngày cần giao hàng (dự kiến)" type="date" />
              </div>
            </div>

            {/* Section 3: Branding */}
            <div>
              <h3 className="text-lg font-marcellus text-vinex-teal mb-6 border-b border-black/5 pb-2">3. Yêu cầu tùy chỉnh (Branding)</h3>
              <div className="flex flex-wrap gap-6 mb-6">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-vinex-teal rounded border-black/20 focus:ring-vinex-teal" />
                  <span className="text-vinex-charcoal/80 font-light group-hover:text-vinex-teal transition-colors text-sm">In/Ép kim Logo lên hộp</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-vinex-teal rounded border-black/20 focus:ring-vinex-teal" />
                  <span className="text-vinex-charcoal/80 font-light group-hover:text-vinex-teal transition-colors text-sm">Ruy băng in Logo</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-vinex-teal rounded border-black/20 focus:ring-vinex-teal" />
                  <span className="text-vinex-charcoal/80 font-light group-hover:text-vinex-teal transition-colors text-sm">Thiệp chúc mừng riêng</span>
                </label>
              </div>

              <GlassTextarea
                label="Ghi chú bổ sung"
                rows={4}
                placeholder="Mô tả thêm về yêu cầu đặc biệt của bạn..."
              />
            </div>

            <div className="pt-4">
              <GlassButton variant="primary" size="lg" className="w-full">
                {pg.form_submit}
              </GlassButton>
            </div>

          </form>
        </GlassCard>

      </div>
    </main>
  );
}
