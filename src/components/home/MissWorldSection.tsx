"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { GlassButton, GlassCard } from "@/components/ui/glass";

export const MissWorldSection = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <section className="py-28 bg-vinex-teal text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="w-full h-full bg-vinex-charcoal mix-blend-multiply"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xl md:text-2xl font-semibold tracking-widest text-vinex-gold">VINEX</span>
              <span className="text-xl text-white/50">×</span>
              <span className="text-xl md:text-2xl font-semibold tracking-widest text-white">MISS WORLD 2026</span>
            </div>

            <h2 className="text-4xl md:text-[44px] font-semibold mb-6 leading-tight">
              Tôn vinh vẻ đẹp <br />
              <span className="text-vinex-gold italic font-serif">& di sản Việt Nam</span>
            </h2>

            <p className="text-white/80 mb-10 text-lg leading-relaxed font-light max-w-xl">
              Tự hào là nhà tài trợ quà tặng chính thức cho Miss World 2026. Bộ sưu tập giới hạn lấy cảm hứng từ tinh hoa nông sản Việt, mang thông điệp về sự phát triển bền vững và vẻ đẹp vượt thời gian đến bạn bè quốc tế.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${lang}/miss-world-2026`}>
                <GlassButton variant="gold" size="lg">
                  Khám phá câu chuyện
                </GlassButton>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <GlassCard variant="elevated" className="aspect-square flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-vinex-gold mb-2">Gift Set 1</span>
              <span className="text-xs text-vinex-charcoal/60">Phiên bản giới hạn Miss World</span>
            </GlassCard>

            <GlassCard variant="elevated" className="aspect-square flex flex-col items-center justify-center p-6 text-center mt-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-vinex-gold mb-2">Gift Set 2</span>
              <span className="text-xs text-vinex-charcoal/60">Bộ sưu tập Ngoại giao</span>
            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  );
};
