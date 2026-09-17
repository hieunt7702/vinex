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
            {pg.hero_title || "GIỚI THIỆU VINEX"}
          </h1>
          <div className="w-[60px] h-[2px] bg-vinex-gold mx-auto mb-8"></div>
          <p className="text-[16px] md:text-[18px] text-white/90 leading-relaxed font-medium max-w-3xl mx-auto">
            {pg.hero_desc || "Công ty Cổ phần Xuất nhập khẩu và Thương mại Vinex hoạt động trong lĩnh vực hạt điều và nông sản Việt. Với nền tảng là nhà máy bóc tách điều thô, VINEX phát triển danh mục sản phẩm và các lựa chọn quà tặng dành cho doanh nghiệp."}
          </p>
        </div>
      </section>

      {/* Section 1: Nền tảng hạt điều */}
      <section className="py-16 lg:py-24 px-4 ">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#074751] mb-6 uppercase tracking-tight">
              {pg.section1_title || "NỀN TẢNG TỪ HOẠT ĐỘNG HẠT ĐIỀU"}
            </h2>
            <div className="w-[40px] h-[2px] bg-vinex-gold mb-6"></div>
            <p className="text-[16px] text-[#2b5963] leading-relaxed font-medium">
              Nhà máy bóc tách điều thô đảm nhiệm hoạt động bóc tách nguyên liệu và tạo nhân điều trắng. Đây là nền tảng trong lĩnh vực hạt điều của VINEX.
            </p>
            <Link href={`/${lang}/nha-may-boc-tach-dieu`} className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#074751] uppercase tracking-wider hover:text-[#0a6673] transition-colors group">
              Tìm hiểu nhà máy
              <span className="w-6 h-6 rounded-full bg-vinex-gold/20 flex items-center justify-center group-hover:bg-vinex-gold transition-colors">
                <svg className="w-3 h-3 text-[#074751] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </span>
            </Link>
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
              {pg.section2_title || "DANH MỤC SẢN PHẨM NÔNG SẢN VIỆT"}
            </h2>
            <div className="w-[40px] h-[2px] bg-vinex-gold mb-6"></div>
            <p className="text-[16px] text-[#2b5963] leading-relaxed font-medium">
              Danh mục VINEX gồm nhân điều trắng, hạt điều tẩm vị, trà, cà phê, bánh kẹo, nấm và trái cây sấy. Mỗi nhóm được giới thiệu riêng để khách hàng, đối tác thuận tiện tìm hiểu sản phẩm phù hợp với nhu cầu.
            </p>
            <Link href={`/${lang}/san-pham`} className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#074751] uppercase tracking-wider hover:text-[#0a6673] transition-colors group">
              Khám phá sản phẩm
              <span className="w-6 h-6 rounded-full bg-vinex-gold/20 flex items-center justify-center group-hover:bg-vinex-gold transition-colors">
                <svg className="w-3 h-3 text-[#074751] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Bao bì và quà tặng như lớp hoàn thiện */}
      <section className="py-16 lg:py-24 px-4 ">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#074751] mb-6 uppercase tracking-tight">
              {pg.section3_title || "KẾT NỐI SẢN PHẨM VỚI QUÀ TẶNG DOANH NGHIỆP"}
            </h2>
            <div className="w-[40px] h-[2px] bg-vinex-gold mb-6"></div>
            <p className="text-[16px] text-[#2b5963] leading-relaxed font-medium">
              VINEX kết hợp các nhóm sản phẩm với bao bì quà tặng, phục vụ những dịp tri ân, gặp gỡ đối tác và hoạt động doanh nghiệp. Sự phù hợp giữa sản phẩm, hình thức trình bày và người nhận là trọng tâm khi lựa chọn một bộ quà.
            </p>
            <Link href={`/${lang}/qua-tang-doanh-nghiep`} className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#074751] uppercase tracking-wider hover:text-[#0a6673] transition-colors group">
              Tìm hiểu quà tặng doanh nghiệp
              <span className="w-6 h-6 rounded-full bg-vinex-gold/20 flex items-center justify-center group-hover:bg-vinex-gold transition-colors">
                <svg className="w-3 h-3 text-[#074751] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </span>
            </Link>
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
