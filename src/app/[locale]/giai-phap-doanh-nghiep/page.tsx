import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { GlassButton, GlassCard, GlassInput, GlassTextarea } from '@/components/ui/glass';

export const metadata: Metadata = {
  title: "Giải pháp sản phẩm theo nhu cầu doanh nghiệp | VINEX",
  description: "VINEX phối hợp lựa chọn nhóm sản phẩm, xây dựng cơ cấu danh mục, định hướng quy cách và bao bì theo nhu cầu doanh nghiệp.",
};

export default function BusinessSolutionPage() {
  const steps = [
    { id: '01', title: 'Nhu cầu & đối tượng' },
    { id: '02', title: 'Nhóm sản phẩm' },
    { id: '03', title: 'Cơ cấu danh mục' },
    { id: '04', title: 'Quy cách' },
    { id: '05', title: 'Bao bì' },
    { id: '06', title: 'Phương án triển khai' },
  ];

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-[#FAF8F2] text-vinex-black pt-[90px]">

        {/* Section 1: Hero & 6 Steps */}
        <section className="px-4 py-16 lg:py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6 leading-tight">Từ nhu cầu đến phương án <br className="hidden sm:block" /> sản phẩm phù hợp</h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mb-20 font-light leading-relaxed">
            VINEX phối hợp cùng đối tác để lựa chọn nhóm sản phẩm, xây dựng cơ cấu danh mục, định hướng quy cách và bao bì, từ đó hoàn thiện phương án triển khai tối ưu nhất.
          </p>

          {/* 6 Steps Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {steps.map((step, idx) => (
              <GlassCard key={idx} variant="interactive" className="flex flex-col items-center justify-center p-6 text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold text-xl mb-4 shadow-sm
                    ${idx === 5 ? 'bg-vinex-teal text-white' : 'bg-vinex-gold text-vinex-teal'}`}>
                  <span className="font-marcellus">{step.id}</span>
                </div>
                <span className="font-semibold text-[13px] md:text-[15px] text-vinex-teal uppercase tracking-wider">{step.title}</span>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Section 2: Form Brief */}
        <section className="px-4 py-16 lg:py-20 bg-vinex-teal text-white border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <GlassCard variant="elevated" className="p-8 sm:p-12 md:p-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-4">Gửi nhu cầu sản phẩm</h2>
                <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
                <p className="text-gray-600 font-light text-[15px]">Vui lòng cung cấp một số thông tin cơ bản để đội ngũ VINEX có thể đề xuất giải pháp phù hợp nhất.</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-vinex-charcoal">Nhóm sản phẩm quan tâm</label>
                    <select className="w-full px-4 py-3 rounded-[12px] bg-white/60 border border-vinex-charcoal/10 text-vinex-charcoal focus:outline-none focus:border-vinex-teal transition-colors font-light appearance-none text-sm">
                      <option value="">Chọn nhóm sản phẩm...</option>
                      <option value="hat-dieu">Hạt điều & sản phẩm từ hạt</option>
                      <option value="tra-ca-phe">Trà, thảo mộc, cà phê</option>
                      <option value="banh-keo">Bánh, bánh quy, kẹo</option>
                      <option value="nong-san">Trái cây sấy, nông sản chế biến</option>
                    </select>
                  </div>
                  <div>
                    <GlassInput
                      label="Mục đích sử dụng / Kênh phân phối"
                      placeholder="Bán lẻ, đóng bộ quà..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <GlassInput
                      label="Số lượng dự kiến"
                      placeholder="10.000 túi, 5.000 hộp..."
                    />
                  </div>
                  <div>
                    <GlassInput
                      label="Ngân sách dự kiến"
                      placeholder="Khoảng ngân sách / sản phẩm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <GlassInput
                      label="Thời gian dự kiến"
                      placeholder="Tháng triển khai"
                    />
                  </div>
                  <div>
                    <GlassInput
                      label="Thông tin liên hệ"
                      placeholder="Tên / Email / SĐT"
                    />
                  </div>
                </div>

                <div>
                  <GlassTextarea
                    label="Yêu cầu quy cách và bao bì"
                    placeholder="Ví dụ: Cần đóng túi zip 100g, hộp quà 3 set..."
                    rows={4}
                  />
                </div>

                <div className="text-center pt-6">
                  <GlassButton variant="primary" size="lg" className="w-full md:w-auto">
                    Gửi yêu cầu sản phẩm
                  </GlassButton>
                </div>
              </form>
            </GlassCard>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
