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
    <main className="w-full flex flex-col min-h-screen pt-[90px] relative overflow-hidden text-vinex-black">
      
      {/* Global Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#074751]/10 to-[#5C7B6C]/10 blur-3xl mix-blend-multiply pointer-events-none" aria-hidden="true" />
      <div className="absolute top-[40%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-[#F2B719]/15 to-transparent blur-3xl mix-blend-multiply pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-gradient-to-t from-[#074751]/5 to-transparent blur-3xl mix-blend-multiply pointer-events-none" aria-hidden="true" />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden m-4 md:m-8 rounded-[24px] md:rounded-[32px] py-12">
        {/* Deep Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#074751] via-[#0b545d] to-[#126b75] z-0" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />
        
        {/* Floating Light Orb */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#F2B719]/20 blur-3xl rounded-full z-0 mix-blend-screen animate-pulse" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center bg-vinex-teal z-0">
          <span className="text-white/20 font-semibold tracking-widest text-xl md:text-2xl uppercase font-marcellus px-4 text-center">Miss World 2026 × VINEX</span>
        </div>

        <div className="relative z-20 text-center px-5 max-w-4xl w-full">
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-semibold tracking-widest text-vinex-gold font-marcellus">VINEX</span>
              <span className="text-xl sm:text-2xl text-white/50 hidden sm:block">×</span>
              <span className="text-xl sm:text-2xl text-white/50 block sm:hidden">&times;</span>
              <span className="text-2xl sm:text-3xl font-semibold tracking-widest text-white font-marcellus text-center">MISS WORLD 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-marcellus text-white mb-5 sm:mb-6 leading-tight drop-shadow-md">
              {pg.hero_title}
            </h1>
            <p className="text-[15px] sm:text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              {pg.hero_desc}
            </p>
          </div>
        </div>
      </section>

      {/* Role & Reason Section */}
      <section className="py-16 lg:py-24 relative z-10 px-4 md:px-8">
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

            <GlassCard 
              radius={24} 
              className="relative aspect-[4/3] w-full border border-white/80 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.85)] flex items-center justify-center overflow-hidden"
              contentClassName="bg-white/40 backdrop-blur-xl w-full h-full flex flex-col items-center justify-center"
            >
              <span className="font-semibold tracking-widest text-[#074751] text-sm uppercase mb-4">Sponsorship Showcase</span>
              {/* Decorative Mesh inside card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#074751]/5 to-transparent z-[-1]" />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* The Gift Box Story */}
      <section className="py-16 lg:py-24 relative z-10 px-4 md:px-8">
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
              radius={24}
              className="group border border-white/80 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.85)] hover:-translate-y-1.5 transition-all duration-400"
              contentClassName="bg-white/40 hover:bg-white/50 transition-colors duration-400 p-8 flex flex-col h-full"
            >
              <div className="relative aspect-video w-full rounded-[16px] overflow-hidden mb-8 flex items-center justify-center bg-[#eef3ef]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#074751] via-[#10626f] to-[#5C7B6C] opacity-90 transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl group-hover:bg-white/20 transition-all duration-700 shadow-2xl" />
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                <span className="relative z-10 font-semibold tracking-widest uppercase text-xs text-white">Exclusive Box {item}</span>
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
      <section className="py-16 lg:py-24 relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-marcellus text-vinex-teal mb-4 text-center">Hậu trường & Quá trình chuẩn bị</h2>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-12"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <GlassCard
                key={item}
                radius={20}
                className="group relative aspect-square border border-white/80 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.85)] hover:-translate-y-1 transition-all duration-400"
                contentClassName="bg-white/30 hover:bg-white/40 transition-colors duration-400 flex flex-col items-center justify-center w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#074751]/5 to-[#5C7B6C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 font-semibold tracking-widest text-xs uppercase text-[#074751]">BTS {item}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 relative z-10 px-4 md:px-8 mb-8 md:mb-12">
        <GlassCard 
          radius={32}
          className="max-w-4xl mx-auto border border-white/40 shadow-[0_16px_40px_rgba(7,71,81,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.2)] overflow-hidden"
          contentClassName="bg-gradient-to-br from-[#074751]/70 to-[#0D5962]/50 backdrop-blur-2xl p-12 lg:p-16 text-center text-white"
        >
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
        </GlassCard>
      </section>

    </main>
  );
}
