"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import { GlassCard, GlassButton, Glass } from '@/components/ui/glass';

export default function MissWorldPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();
  const pg = t.pages.miss_world;

  return (
    <main className="w-full flex flex-col min-h-screen pt-[90px] bg-vinex-ivory text-vinex-black">

      {/* Hero Section */}
      <section className="relative h-[70vh] bg-vinex-teal flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center bg-vinex-teal z-0">
          <span className="text-white/20 font-semibold tracking-widest text-2xl uppercase font-marcellus">Miss World 2026 × VINEX</span>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl">
          <div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-3xl font-semibold tracking-widest text-vinex-gold font-marcellus">VINEX</span>
              <span className="text-2xl text-white/50">×</span>
              <span className="text-3xl font-semibold tracking-widest text-white font-marcellus">MISS WORLD 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-marcellus text-white mb-6 leading-tight">
              {pg.hero_title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto">
              {pg.hero_desc}
            </p>
          </div>
        </div>
      </section>

      {/* Role & Reason Section */}
      <section className="py-16 lg:py-20 bg-vinex-ivory px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-marcellus text-vinex-teal mb-4">Vai trò và Sứ mệnh</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-8"></div>
              <div className="space-y-4 text-vinex-charcoal/80 font-light leading-relaxed">
                <p>
                  Đồng hành cùng Miss World 2026, VINEX mang trên mình trọng trách thiết kế và chế tác các bộ quà tặng cao cấp dành riêng cho các thí sinh, ban giám khảo và khách mời VIP từ khắp nơi trên thế giới.
                </p>
                <p>
                  Chúng tôi tin rằng, mỗi phần quà không chỉ là một tặng phẩm vật chất, mà còn là đại sứ văn hóa truyền tải thông điệp về sự hiếu khách, bản sắc truyền thống và khát vọng vươn mình của Việt Nam.
                </p>
              </div>
            </div>

            <GlassCard radius={14} displacementScale={15} blurAmount={0.06} className="relative aspect-[4/3] w-full bg-vinex-teal/10 rounded-xl overflow-hidden shadow-xl border border-black/5 flex items-center justify-center">
              <span className="font-semibold tracking-widest text-vinex-teal text-sm uppercase">Sponsorship Showcase</span>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* The Gift Box Story */}
      <section className="py-16 lg:py-20 bg-white/50 border-t border-black/5 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-marcellus text-vinex-teal mb-4">Câu chuyện Bộ Quà Tặng</h2>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
          <p className="text-vinex-charcoal/70 max-w-3xl mx-auto font-light">
            Sự kết hợp hoàn hảo giữa nguyên liệu bản địa và thiết kế đương đại.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((item) => (
            <GlassCard
              key={item}
              variant="interactive"
              radius={16}
              displacementScale={15}
              blurAmount={0.06}
              className="bg-white/80 p-8 rounded-xl shadow-md border border-black/5"
            >
              <div className="relative aspect-square w-full bg-vinex-teal/5 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                <span className="font-semibold tracking-widest uppercase text-xs text-vinex-teal">Exclusive Box {item}</span>
              </div>
              <h3 className="text-2xl font-marcellus text-vinex-teal mb-4">The Crown Collection {item}</h3>
              <p className="text-vinex-charcoal/70 font-light text-sm leading-relaxed">
                Hộp quà sơn mài thủ công với các sản phẩm hạt điều tẩm vị đặc sản, kết hợp cùng trà sen Tây Hồ hảo hạng.
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Preparation & BTS */}
      <section className="py-16 lg:py-20 bg-vinex-ivory border-t border-black/5 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-marcellus text-vinex-teal mb-4 text-center">Hậu trường & Quá trình chuẩn bị</h2>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-12"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <GlassCard
                key={item}
                variant="interactive"
                radius={12}
                displacementScale={12}
                blurAmount={0.05}
                className="relative aspect-square bg-white/70 rounded-lg overflow-hidden flex items-center justify-center border border-black/5 shadow-sm hover:shadow-md cursor-pointer"
              >
                <span className="font-semibold tracking-widest text-xs uppercase text-vinex-charcoal/70">BTS {item}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-vinex-teal text-white px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-marcellus text-vinex-gold mb-4">Trải nghiệm Quà Tặng Đẳng Cấp</h2>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
          <p className="text-white/80 mb-10 font-light text-lg">
            Khám phá các giải pháp quà tặng doanh nghiệp tiêu chuẩn quốc tế từ VINEX.
          </p>
          <Link href={`/${lang}/qua-tang-doanh-nghiep`}>
            <GlassButton variant="gold" size="lg" rightIcon={<span>&rarr;</span>}>
              Khám phá bộ sưu tập
            </GlassButton>
          </Link>
        </div>
      </section>

    </main>
  );
}
