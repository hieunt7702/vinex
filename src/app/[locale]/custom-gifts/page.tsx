"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { GlassCard, GlassButton } from '@/components/ui/glass';

export default function CustomGiftsPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  const steps = [
    { num: "01", title: "Tư vấn & Lấy Yêu Cầu", desc: "Lắng nghe mục tiêu, ngân sách và đối tượng nhận quà." },
    { num: "02", title: "Phát Triển Concept", desc: "Xây dựng ý tưởng thiết kế, thông điệp và lựa chọn sản phẩm." },
    { num: "03", title: "Thiết Kế Chi Tiết", desc: "Thiết kế bao bì, logo, thiệp và các ấn phẩm đi kèm." },
    { num: "04", title: "Sản Xuất Mẫu Thử", desc: "Làm mẫu thực tế để khách hàng đánh giá và duyệt." },
    { num: "05", title: "Sản Xuất Hàng Loạt", desc: "Kiểm soát chất lượng nghiêm ngặt trong quá trình sản xuất." },
    { num: "06", title: "Giao Hàng", desc: "Đóng gói cẩn thận và giao tận nơi theo tiến độ cam kết." },
  ];

  return (
    <main className="w-full flex flex-col min-h-screen pt-[90px] bg-vinex-ivory text-vinex-black">

      {/* Header */}
      <section className="relative h-[60vh] bg-vinex-teal flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center bg-vinex-teal z-0">
          <span className="text-white/20 font-semibold tracking-widest text-2xl uppercase font-marcellus">Bespoke Gifts</span>
        </div>

        <div className="relative z-20 max-w-4xl px-4 mx-auto">
          <div>
            <span className="text-sm tracking-widest text-vinex-gold uppercase mb-4 font-semibold block">BESPOKE GIFTS</span>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
            <h1 className="text-4xl md:text-6xl font-marcellus text-white mb-6">Quà Tặng Thiết Kế Riêng</h1>
            <p className="text-white/80 text-lg font-light max-w-2xl mx-auto">
              Sự độc bản dành riêng cho thương hiệu của bạn. Tự do sáng tạo từ chất liệu hộp, quy cách đến từng chi tiết nhỏ nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="py-20 px-4 bg-white/40 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-marcellus text-vinex-teal mb-4">Các Lựa Chọn Cá Nhân Hóa</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
            <p className="text-vinex-charcoal/70 font-light">Mọi chi tiết đều có thể tùy biến theo nhận diện thương hiệu.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Chất liệu Hộp', 'Ruy Băng & Phụ kiện', 'Ép Kim Logo', 'Thiệp & Thông điệp'].map((item, idx) => (
              <GlassCard
                key={idx}
                variant="interactive"
                radius={14}
                displacementScale={15}
                blurAmount={0.06}
                className="bg-white/80 p-6 rounded-xl text-center border border-black/5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-square w-full bg-vinex-teal/5 rounded-lg overflow-hidden mb-6 mx-auto max-w-[200px] flex items-center justify-center">
                  <span className="font-semibold tracking-widest uppercase text-[11px] text-vinex-teal">{item}</span>
                </div>
                <h3 className="font-marcellus text-lg text-vinex-teal">{item}</h3>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 bg-vinex-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-marcellus text-vinex-teal mb-4">Quy Trình Triển Khai</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <GlassCard
                key={idx}
                variant="interactive"
                radius={14}
                displacementScale={15}
                blurAmount={0.06}
                className="p-8 border border-black/5 rounded-xl bg-white/80 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-3xl font-marcellus font-semibold text-vinex-gold mb-4">{step.num}</div>
                <h3 className="text-xl font-marcellus text-vinex-teal mb-3">{step.title}</h3>
                <p className="text-vinex-charcoal/70 font-light text-sm leading-relaxed">{step.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-vinex-teal text-center px-4 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-marcellus mb-4">Bắt đầu câu chuyện của bạn</h2>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
          <p className="text-white/80 mb-10 font-light text-lg">
            Tạo dấu ấn khác biệt với bộ quà tặng độc bản từ VINEX.
          </p>
          <Link href={`/${lang}/request-quote`}>
            <GlassButton variant="gold" size="lg" rightIcon={<span>&rarr;</span>}>
              Tạo bộ quà của bạn
            </GlassButton>
          </Link>
        </div>
      </section>

    </main>
  );
}
