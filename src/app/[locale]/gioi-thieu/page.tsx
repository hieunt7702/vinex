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
    <main className="w-full flex flex-col min-h-screen pt-[90px] text-vinex-charcoal relative overflow-hidden">
      {/* Ambient Global Gradient for Liquid Glass Refraction */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#074751]/30 rounded-full blur-[160px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-vinex-gold/30 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/30 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 px-4 bg-[#074751] text-white flex flex-col items-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="text-vinex-gold font-bold tracking-widest text-[13px] uppercase mb-6 block">
              {pg.hero_label || "VINEX LÀ AI"}
            </span>
          <h1 className="text-[34px] md:text-[44px] lg:text-[52px] font-semibold uppercase tracking-tight leading-[1.2] mb-8">
            {pg.hero_title || "PHÁT TRIỂN GIÁ TRỊ TỪ HẠT ĐIỀU VÀ NÔNG SẢN VIỆT"}
          </h1>
          <div className="w-[60px] h-[2px] bg-vinex-gold mx-auto mb-8"></div>
          <p className="text-[16px] md:text-[18px] text-white/90 leading-relaxed font-medium max-w-3xl mx-auto">
            {pg.hero_desc || "VINEX phát triển từ nền tảng hạt điều, mở rộng sang các dòng sản phẩm từ nông sản Việt và hoàn thiện trải nghiệm thông qua bao bì, quà tặng doanh nghiệp."}
          </p>
        </div>
      </section>

      {/* Section 1: Nền tảng hạt điều */}
      <section className="py-16 lg:py-24 px-4 ">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#074751] mb-6 uppercase tracking-tight">
              {pg.section1_title || "NỀN TẢNG TỪ HẠT ĐIỀU"}
            </h2>
            <div className="w-[40px] h-[2px] bg-vinex-gold mb-6"></div>
            <p className="text-[16px] text-[#2b5963] leading-relaxed font-medium">
              Nhà máy bóc tách điều thô là một phần nền tảng trong hoạt động hạt điều của VINEX, nơi quy trình tiếp nhận, xử lý, bóc tách và phân loại được kiểm soát chặt chẽ để hình thành nên nhân điều trắng chất lượng trước khi đi vào các quy trình chế biến sâu hơn.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-[16px] overflow-hidden bg-slate-200">
            <Image
              src="/value1.png"
              alt="Nhà máy bóc tách điều"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Mở rộng danh mục nông sản */}
      <section className="py-16 lg:py-24 px-4 ">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 relative aspect-[4/3] rounded-[16px] overflow-hidden bg-slate-200">
            <Image
              src="/value2.png"
              alt="Mở rộng danh mục nông sản"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#074751] mb-6 uppercase tracking-tight">
              {pg.section2_title || "MỞ RỘNG HỆ SẢN PHẨM"}
            </h2>
            <div className="w-[40px] h-[2px] bg-vinex-gold mb-6"></div>
            <p className="text-[16px] text-[#2b5963] leading-relaxed font-medium">
              Từ hạt điều, VINEX tiếp tục mở rộng danh mục với trà, cà phê, bánh, kẹo và các sản phẩm nông sản sấy. Chúng tôi tuyển chọn những nguyên liệu mang đậm hương vị Việt Nam để phát triển thành một hệ sinh thái sản phẩm đa dạng, đáp ứng nhu cầu thưởng thức và chia sẻ.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Bao bì và quà tặng như lớp hoàn thiện */}
      <section className="py-16 lg:py-24 px-4 ">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#074751] mb-6 uppercase tracking-tight">
              {pg.section3_title || "HOÀN THIỆN TRẢI NGHIỆM"}
            </h2>
            <div className="w-[40px] h-[2px] bg-vinex-gold mb-6"></div>
            <p className="text-[16px] text-[#2b5963] leading-relaxed font-medium">
              Bao bì và giải pháp quà tặng đóng vai trò là lớp hoàn thiện cuối cùng, kết nối các nhóm sản phẩm thành những lựa chọn phù hợp cho bối cảnh trao tặng doanh nghiệp. Quà tặng VINEX đại diện cho sự trân trọng và những giá trị thiết thực từ nông sản Việt.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-[16px] overflow-hidden bg-slate-200">
            <Image
              src="/value3.png"
              alt="Các collection quà tặng"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
      
      </div>

    </main>
  );
}
