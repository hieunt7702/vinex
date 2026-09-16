import { Metadata } from 'next';
import Image from 'next/image';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassButton, GlassCard } from '@/components/ui/glass';

export const metadata: Metadata = {
  title: "Nhân điều trắng VINEX | Cung ứng theo quy cách",
  description: "Nhân điều trắng từ hoạt động bóc tách điều thô của VINEX, phục vụ cung ứng và phát triển sản phẩm từ hạt điều.",
};

export default async function WhiteCashewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const pg = t.pages.cashew;



  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen text-vinex-black pt-[90px] relative overflow-hidden">
        {/* Ambient Global Gradient for Liquid Glass Refraction */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#074751]/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-vinex-gold/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/30 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10">
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

        {/* Section 2: Trải nghiệm & Cảm nhận (Replaces Tech Specs) */}
        <section className="px-4 py-16 lg:py-20  border-t border-[#E8E4D9]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Trọn vẹn hương vị nguyên bản</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Thị giác", title: "Sắc trắng tự nhiên", desc: "Mỗi hạt nhân điều đều mang màu sắc đồng đều, sáng đẹp tự nhiên, không qua xử lý hóa chất." },
                { label: "Khứu giác", title: "Hương thơm nguyên bản", desc: "Giữ trọn mùi thơm đặc trưng của hạt điều tươi mới vừa được bóc tách." },
                { label: "Vị giác", title: "Vị ngọt thanh bùi béo", desc: "Cảm nhận độ giòn, vị ngọt thanh tự nhiên xen lẫn độ bùi béo đặc trưng của nông sản Việt." }
              ].map((item, idx) => (
                <GlassCard key={idx} variant="interactive" className="p-8 text-center flex flex-col items-center">
                  <span className="block text-[11px] font-semibold text-vinex-gold uppercase tracking-widest mb-4">{item.label}</span>
                  <h3 className="font-marcellus text-2xl text-vinex-teal font-semibold mb-4">{item.title}</h3>
                  <p className="text-[15px] text-gray-600 font-light leading-relaxed">{item.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Ứng dụng & Quy cách đóng gói */}
        <section className="px-4 py-16 lg:py-20">
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

        {/* Section 4: CTA yêu cầu cung ứng */}
        <section className="px-4 py-16 lg:py-20 bg-vinex-teal text-white text-center border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-[40px] font-marcellus text-vinex-gold mb-6">Trao đổi nhu cầu cung ứng</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
            <p className="text-lg text-white/80 mb-12 font-light">
              Liên hệ ngay để nhận thông tin chi tiết về năng lực sản xuất và báo giá theo tiêu chuẩn.
            </p>
            <Link href={`/${locale}/lien-he`}>
              <GlassButton variant="gold" size="lg">
                Nhận tư vấn ngay
              </GlassButton>
            </Link>
          </div>
        </section>

        </div>
      </main>
    </SmoothScroll>
  );
}
