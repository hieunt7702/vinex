import { Metadata } from 'next';
import Image from 'next/image';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassButton, GlassCard, GlassInput, GlassTextarea } from '@/components/ui/glass';

export const metadata: Metadata = {
  title: "Nhân điều trắng VINEX | Cung ứng theo quy cách",
  description: "Nhân điều trắng từ hoạt động bóc tách điều thô của VINEX, phục vụ cung ứng và phát triển sản phẩm từ hạt điều.",
};

export default async function WhiteCashewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const pg = t.pages.cashew;

  const cmsFields = [
    { label: 'Grade / Kích cỡ', value: 'W240, W320, W450...' },
    { label: 'Màu sắc', value: 'Trắng chuẩn tự nhiên' },
    { label: 'Độ ẩm', value: 'Tối đa 5%' },
    { label: 'Hình thức đóng gói', value: 'Hút chân không túi thiếc' },
    { label: 'Khối lượng', value: '11.34kg (25lbs) / thùng' },
    { label: 'MOQ / Lead time', value: 'Theo hợp đồng' },
  ];

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-[#FAF8F2] text-vinex-black pt-[90px]">

        {/* Section 1: Hero & Mô tả */}
        <section className="px-4 py-16 lg:py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6 leading-tight">{pg.hero_title}</h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mb-16 font-light leading-relaxed">
            {pg.hero_desc}
          </p>
          <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[24px] overflow-hidden relative shadow-xl border border-[#E8E4D9]">
            <Image
              src="/images/banner/nhan_dieu_trang.png"
              alt="Nhân điều trắng VINEX"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </section>

        {/* Section 2: Thông số kỹ thuật (CMS fields) */}
        <section className="px-4 py-16 lg:py-20 bg-white border-t border-[#E8E4D9]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Thông số kỹ thuật</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {cmsFields.map((field, idx) => (
                <GlassCard key={idx} variant="interactive" className="p-6 text-center flex flex-col items-center justify-center">
                  <span className="block text-[10px] md:text-[11px] font-semibold text-vinex-teal/70 uppercase tracking-widest mb-2">{field.label}</span>
                  <span className="block font-marcellus text-lg md:text-xl text-vinex-teal font-semibold">{field.value}</span>
                </GlassCard>
              ))}
            </div>
            <p className="text-center text-[13px] text-gray-400 mt-12 font-light italic">
              * Số liệu minh họa. Dữ liệu thực tế đang chờ VINEX xác nhận.
            </p>
          </div>
        </section>

        {/* Section 3: Ứng dụng & Quy cách đóng gói */}
        <section className="px-4 py-16 lg:py-20 bg-[#FAF8F2]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">4 Nhóm ứng dụng</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-10"></div>
              <div className="space-y-4">
                {[
                  "Cung ứng thương mại nguyên liệu",
                  "Phát triển hạt điều tẩm vị",
                  "Đóng gói sản phẩm bán lẻ",
                  "Kết hợp trong bộ quà doanh nghiệp"
                ].map((app, idx) => (
                  <GlassCard key={idx} variant="interactive" className="flex items-center gap-4 p-5">
                    <div className="w-10 h-10 bg-vinex-gold/20 flex items-center justify-center rounded-full shrink-0">
                      <span className="text-vinex-teal font-semibold text-sm">0{idx + 1}</span>
                    </div>
                    <span className="font-semibold text-vinex-teal text-sm md:text-[15px]">{app}</span>
                  </GlassCard>
                ))}
              </div>
            </div>
            <div className="flex flex-col h-full">
              <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Quy cách đóng gói</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-10"></div>
              <GlassCard variant="elevated" className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-vinex-teal/5 flex items-center justify-center mb-6">
                  <span className="text-vinex-teal text-xs font-semibold uppercase tracking-widest">PACKAGING</span>
                </div>
                <h3 className="font-semibold text-vinex-teal text-lg mb-2">Thùng Carton 22.68kg</h3>
                <p className="text-[14px] text-gray-600 font-light leading-relaxed max-w-md">Đóng gói hút chân không 2 túi thiếc (11.34kg/túi) bên trong, đảm bảo tuyệt đối an toàn vận chuyển quốc tế.</p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Section 4: Form yêu cầu cung ứng */}
        <section className="px-4 py-16 lg:py-20 bg-vinex-teal text-white border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <GlassCard variant="elevated" className="p-8 sm:p-12 md:p-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-4">Trao đổi nhu cầu cung ứng</h2>
                <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
                <p className="text-gray-600 font-light text-[15px]">Để lại thông tin, đội ngũ VINEX sẽ liên hệ tư vấn quy cách và báo giá phù hợp nhất.</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <GlassInput label="Họ tên đại diện" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <GlassInput label="Doanh nghiệp" placeholder="Tên công ty" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <GlassInput label="Email liên hệ" type="email" placeholder="example@company.com" />
                  </div>
                  <div>
                    <GlassInput label="Số điện thoại" type="tel" placeholder="0901 234 567" />
                  </div>
                </div>

                <div>
                  <GlassTextarea
                    label="Nhu cầu cung ứng chi tiết"
                    placeholder="Số lượng dự kiến, mã hàng, tiêu chuẩn..."
                    rows={4}
                  />
                </div>

                <div className="text-center pt-6">
                  <GlassButton variant="primary" size="lg" className="w-full md:w-auto">
                    Gửi yêu cầu cung ứng
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
