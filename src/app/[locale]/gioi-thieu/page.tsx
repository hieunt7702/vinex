"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import { GlassButton, GlassCard, Glass } from '@/components/ui/glass';

export default function AboutPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();
  const pg = t.pages.about;

  return (
    <main className="w-full flex flex-col min-h-screen pt-[90px] bg-vinex-ivory text-vinex-black">

      {/* Hero Section */}
      <section className="relative h-[60vh] bg-vinex-teal flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-vinex-teal/90 z-10" />
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-0">
          <span className="text-gray-500 font-semibold tracking-widest uppercase">About VINEX Hero</span>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mt-10">
          <div>
            <div className="inline-flex justify-center mb-6">
              <Glass radius={999} displacementScale={15} blurAmount={0.05} className="px-5 py-2 border border-white/20 bg-black/20">
                <span className="text-[11px] tracking-[0.2em] text-vinex-gold uppercase font-bold">VINEX - ENDURING EXCELLENCE</span>
              </Glass>
            </div>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-white mb-6 leading-tight">{pg.hero_title}</h1>
          </div>
        </div>
      </section>

      {/* Hành trình chuỗi giá trị */}
      <section className="py-16 lg:py-20 px-4 bg-vinex-ivory">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-4 leading-snug">Hành trình bắt đầu từ nguồn nguyên liệu trân quý</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-8"></div>
            <div className="space-y-6 text-vinex-charcoal/80 font-light leading-relaxed text-[15px]">
              <p>
                VINEX bắt đầu từ nền tảng nhà máy bóc tách điều thô, nơi nguyên liệu được tuyển chọn kỹ lưỡng, xử lý và phân loại theo tiêu chuẩn khắt khe nhất để tạo ra nhân điều trắng thượng hạng.
              </p>
              <p>
                Từ nền tảng ấy, VINEX không ngừng mở rộng sang các dòng hạt điều tẩm vị, sản phẩm từ nông sản Việt Nam, bao bì sáng tạo và cuối cùng là hoàn thiện các giải pháp quà tặng doanh nghiệp đẳng cấp.
              </p>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-sm overflow-hidden shadow-2xl">
            <Image
              src="/images/banner/hat_dieu1.png"
              alt="Hành trình bắt đầu từ nguồn nguyên liệu trân quý"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Quan điểm về sản phẩm và bao bì */}
      <section className="py-16 lg:py-20 px-4 bg-white/50 border-t border-black/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-1 relative aspect-square rounded-sm overflow-hidden shadow-xl max-w-lg mx-auto w-full">
            <Image
              src="/images/banner/chat_luong_cot_loi.png"
              alt="Chất lượng cốt lõi & Vẻ đẹp nguyên bản"
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="order-2">
            <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-4 leading-snug">Chất lượng cốt lõi & Vẻ đẹp nguyên bản</h2>
            <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-8"></div>
            <div className="space-y-6 text-vinex-charcoal/80 font-light leading-relaxed text-[15px]">
              <p>
                Sản phẩm của VINEX luôn đặt tiêu chí tự nhiên và an toàn lên hàng đầu. Chúng tôi trân trọng hương vị nguyên bản của nông sản Việt, kết hợp với công nghệ chế biến hiện đại để tạo ra những sản phẩm an toàn, bổ dưỡng.
              </p>
              <p>
                Song hành cùng chất lượng là tính thẩm mỹ trong bao bì. VINEX tin rằng một thiết kế bao bì chỉn chu không chỉ bảo vệ sản phẩm mà còn tôn vinh giá trị thương hiệu, thể hiện trọn vẹn câu chuyện và ý nghĩa của mỗi món quà.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nhóm năng lực chính */}
      <section className="py-16 lg:py-20 px-4 bg-vinex-ivory border-t border-black/5">
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-6">Phát triển giá trị từ hạt điều và nông sản Việt</h2>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto"></div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            { title: "Năng lực Cung ứng", desc: "Hệ thống nhà máy chuẩn hóa, cung cấp nhân điều trắng và nông sản chế biến quy mô lớn, đáp ứng tiêu chuẩn xuất khẩu khắt khe." },
            { title: "Giải pháp Doanh nghiệp", desc: "Tư vấn và thiết kế danh mục sản phẩm, bao bì chuyên biệt và bộ quà tặng doanh nghiệp theo nhu cầu định vị thương hiệu riêng." }
          ].map((val, idx) => (
            <GlassCard
              key={idx}
              variant="interactive"
              radius={14}
              displacementScale={15}
              blurAmount={0.06}
              className="p-8 md:p-12 text-center bg-white/80 border border-black/5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-vinex-teal/5 rounded-full flex items-center justify-center border border-vinex-teal/10 mx-auto mb-6">
                <span className="text-vinex-gold font-semibold text-xl">0{idx + 1}</span>
              </div>
              <h3 className="font-marcellus text-2xl text-vinex-teal mb-4">{val.title}</h3>
              <p className="text-vinex-charcoal/80 font-light text-[15px] leading-relaxed">{val.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-vinex-teal text-white px-4 text-center border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-marcellus mb-4">Trở thành đối tác của VINEX</h2>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-white/80 mb-12 font-light text-lg">
            Cùng VINEX nâng tầm giá trị nông sản Việt và kiến tạo những giải pháp sản phẩm vượt trội.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href={`/${lang}/nha-may-boc-tach-dieu`}>
              <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto !border-white/30 !text-white hover:!border-vinex-gold hover:!text-vinex-gold">
                Khám phá năng lực
              </GlassButton>
            </Link>
            <Link href={`/${lang}/lien-he`}>
              <GlassButton variant="gold" size="lg" className="w-full sm:w-auto" rightIcon={<span>&rarr;</span>}>
                Nhận tư vấn
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
