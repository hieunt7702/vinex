import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassCard, GlassButton, GlassInput, GlassTextarea, Glass } from '@/components/ui/glass';

export const metadata: Metadata = {
   title: "Liên hệ VINEX | Nông sản và Quà tặng doanh nghiệp",
   description: "Kết nối cùng VINEX để nhận tư vấn về cung ứng nhân điều trắng, sản phẩm nông sản, bao bì và bộ quà tặng doanh nghiệp.",
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   const t = getDictionary(locale as Locale);
   const pg = t.pages.contact;

   const solutions = [
      { id: '01', title: pg.solutions[0].title, desc: pg.solutions[0].desc, link: `/${locale}/nhan-dieu-trang` },
      { id: '02', title: pg.solutions[1].title, desc: pg.solutions[1].desc, link: `/${locale}/giai-phap-doanh-nghiep` },
      { id: '03', title: pg.solutions[2].title, desc: pg.solutions[2].desc, link: `/${locale}/qua-tang-doanh-nghiep` },
   ];

   return (
      <SmoothScroll>
         <main className="w-full flex flex-col min-h-screen bg-vinex-ivory text-vinex-black pt-[90px]">

            {/* Section 1: Mỏ neo giải pháp */}
            <section className="px-4 py-16 lg:py-20 max-w-7xl mx-auto w-full">
               <div className="text-center mb-10 md:mb-16">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-marcellus text-vinex-teal mb-4 md:mb-6 leading-tight">{pg.hero_title}</h1>
                  <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                  {solutions.map((sol, idx) => (
                     <Link href={sol.link} key={idx} className="block h-full">
                        <GlassCard variant="interactive" radius={14} displacementScale={15} blurAmount={0.06} className="p-6 md:p-8 h-full flex flex-col bg-white/70 border border-black/5 shadow-sm hover:shadow-md transition-all group">
                           <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-semibold text-lg md:text-xl mb-4 md:mb-6 bg-vinex-gold text-vinex-teal">
                              {sol.id}
                           </div>
                           <h3 className="font-semibold text-base md:text-lg mb-2 text-vinex-teal group-hover:opacity-80 transition-opacity">{sol.title}</h3>
                           <p className="font-light text-[13px] md:text-sm text-vinex-charcoal/80">{sol.desc}</p>
                        </GlassCard>
                     </Link>
                  ))}
               </div>
            </section>

            {/* Section 2: Form liên hệ và Thông tin */}
            <section className="px-4 py-16 lg:py-20 bg-white/40 border-t border-black/5">
               <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-16">

                  {/* Form Section */}
                  <GlassCard radius={16} displacementScale={15} blurAmount={0.06} className="flex-1 bg-white/80 p-6 sm:p-10 md:p-14 border border-black/5 shadow-md">
                     <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-4 md:mb-6">{pg.form_title}</h2>
                     <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-10"></div>

                     <form className="space-y-6 md:space-y-8">
                        <GlassInput
                           label="Họ tên đại diện"
                           placeholder="Nhập họ tên của bạn..."
                        />

                        <GlassInput
                           label="Doanh nghiệp"
                           placeholder="Tên công ty hoặc doanh nghiệp..."
                        />

                        <GlassInput
                           label="Điện thoại / Email"
                           placeholder="Nhập số điện thoại hoặc email liên hệ..."
                        />

                        <div>
                           <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-vinex-charcoal/80">Nhu cầu</label>
                           <select className="w-full px-4 py-3 bg-white/60 border border-black/10 rounded-lg text-sm text-vinex-charcoal font-light focus:outline-none focus:border-vinex-teal focus:ring-2 focus:ring-vinex-teal/15 transition-all">
                              <option value="">Chọn nhu cầu...</option>
                              <option value="cung-ung">Cung ứng thương mại</option>
                              <option value="san-pham">Sản phẩm bán lẻ</option>
                              <option value="bao-bi">Sản xuất bao bì</option>
                              <option value="qua-tang">Bộ quà tặng doanh nghiệp</option>
                           </select>
                        </div>

                        <GlassTextarea
                           label="Nội dung chi tiết"
                           rows={5}
                           placeholder="Mô tả cụ thể về nhu cầu hợp tác của bạn..."
                        />

                        <div className="flex items-start gap-4">
                           <input type="checkbox" id="consent" className="mt-1 accent-vinex-teal w-4 h-4 cursor-pointer" />
                           <label htmlFor="consent" className="text-[13px] text-gray-500 font-light leading-relaxed cursor-pointer">
                              {pg.form_consent}
                           </label>
                        </div>

                        <div className="pt-4">
                           <GlassButton variant="primary" size="lg" className="w-full md:w-auto">
                              {pg.form_submit}
                           </GlassButton>
                        </div>
                     </form>
                  </GlassCard>

                  {/* Info Section */}
                  <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-8 pt-4">
                     <GlassCard radius={16} displacementScale={15} blurAmount={0.06} className="p-8 bg-white/80 border border-black/5 shadow-md">
                        <h3 className="text-2xl font-marcellus text-vinex-teal mb-4">Thông tin liên hệ</h3>
                        <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-8"></div>
                        <ul className="space-y-6 text-vinex-charcoal/80">
                           <li>
                              <span className="block font-semibold text-xs uppercase tracking-widest text-vinex-gold mb-1">Hotline</span>
                              <span className="text-base text-vinex-black font-semibold">(+84) 966 967 966</span>
                           </li>
                           <li>
                              <span className="block font-semibold text-xs uppercase tracking-widest text-vinex-gold mb-1">Email</span>
                              <span className="text-base text-vinex-black font-semibold">info@vinexgroup.vn</span>
                           </li>
                           <li>
                              <span className="block font-semibold text-xs uppercase tracking-widest text-vinex-gold mb-1">Website</span>
                              <span className="text-sm font-light leading-relaxed text-vinex-black">www.vinexgroup.vn</span>
                           </li>
                           <li>
                              <span className="block font-semibold text-xs uppercase tracking-widest text-vinex-gold mb-1">Văn phòng Hà Nội</span>
                              <span className="text-sm font-light leading-relaxed text-vinex-black">Sảnh 2B tòa nhà Sun Grand City - 69B Thụy Khuê - Hà Nội</span>
                           </li>
                           <li>
                              <span className="block font-semibold text-xs uppercase tracking-widest text-vinex-gold mb-1">Nhà máy sản xuất</span>
                              <span className="text-sm font-light leading-relaxed text-vinex-black">Khu 6 Bằng Doãn, Xã Bằng Luân, Tỉnh Phú Thọ</span>
                           </li>
                        </ul>
                     </GlassCard>

                     <GlassCard radius={14} displacementScale={15} blurAmount={0.06} className="bg-white/80 p-6 border border-black/5 shadow-sm">
                        <h4 className="font-semibold text-sm uppercase tracking-widest text-vinex-teal mb-3">Giờ làm việc</h4>
                        <p className="text-vinex-charcoal/80 text-sm font-light leading-relaxed">
                           Thứ 2 - Thứ 6: 08:00 - 17:30<br />
                           Thứ 7: 08:00 - 12:00
                        </p>
                     </GlassCard>
                  </div>

               </div>
            </section>

         </main>
      </SmoothScroll>
   );
}
