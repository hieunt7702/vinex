"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { GlassCard, GlassButton } from '@/components/ui/glass';

const categories = [
  { title: "Quà Khách Hàng", desc: "Tri ân khách hàng thân thiết với những sản phẩm mang đậm dấu ấn thương hiệu.", img: "Client Gifts" },
  { title: "Quà VIP", desc: "Đẳng cấp và khác biệt, dành riêng cho những đối tác chiến lược quan trọng nhất.", img: "VIP Gifts" },
  { title: "Quà Nhân Viên", desc: "Khích lệ tinh thần và gắn kết đội ngũ bằng những món quà ý nghĩa, thiết thực.", img: "Employee Gifts" },
  { title: "Quà Sự Kiện", desc: "Lưu lại ấn tượng sâu sắc trong các sự kiện, hội nghị, lễ kỷ niệm.", img: "Event Gifts" },
  { title: "Quà Đối Tác Quốc Tế", desc: "Giới thiệu tinh hoa văn hóa Việt Nam đến bạn bè quốc tế qua từng món quà.", img: "International Gifts" },
  { title: "Quà Thiết Kế Riêng", desc: "Độc bản và cá nhân hóa, thể hiện trọn vẹn câu chuyện thương hiệu của bạn.", img: "Bespoke Gifts" },
];

export default function CorporateGiftsPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <main className="w-full flex flex-col min-h-screen pt-[90px] ">

      {/* Header */}
      <section className="py-16 lg:py-20 text-center px-4  border-b border-black/5">
        <div className="max-w-4xl mx-auto">
          <span className="text-sm tracking-widest text-vinex-teal uppercase mb-4 font-semibold block">VINEX B2B SOLUTIONS</span>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-marcellus text-vinex-teal mb-6">Giải Pháp Quà Tặng Doanh Nghiệp</h1>
          <p className="text-vinex-charcoal/70 text-lg font-light max-w-2xl mx-auto">
            Khẳng định đẳng cấp thương hiệu và xây dựng mối quan hệ bền chặt thông qua các bộ sưu tập quà tặng cao cấp được thiết kế riêng.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <GlassCard
                key={idx}
                variant="interactive"
                radius={14}
                displacementScale={15}
                blurAmount={0.06}
                className="group cursor-pointer bg-white/80 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-black/5"
              >
                <div className="relative aspect-square w-full bg-vinex-teal/5 overflow-hidden flex items-center justify-center">
                  <span className="font-semibold tracking-widest uppercase text-xs text-vinex-teal">{cat.img}</span>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-marcellus text-vinex-teal mb-3">{cat.title}</h3>
                  <p className="text-vinex-charcoal/70 font-light text-sm leading-relaxed">{cat.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20  text-center px-4 relative overflow-hidden border-t border-black/5">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Bạn cần tư vấn giải pháp quà tặng?</h2>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-vinex-charcoal/70 mb-10 font-light">
            Đội ngũ chuyên gia của VINEX luôn sẵn sàng lắng nghe và xây dựng phương án phù hợp nhất với ngân sách và mục tiêu của doanh nghiệp.
          </p>
          <Link href={`/${lang}/request-quote`}>
            <GlassButton variant="primary" size="lg" rightIcon={<span>&rarr;</span>}>
              Yêu cầu báo giá
            </GlassButton>
          </Link>
        </div>
      </section>

    </main>
  );
}
