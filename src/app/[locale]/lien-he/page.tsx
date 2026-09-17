import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassButton, GlassSelect, GlassCheckbox } from '@/components/ui/glass';

export const metadata: Metadata = {
   title: "Liên hệ VINEX | Nông sản và Quà tặng doanh nghiệp",
   description: "Kết nối cùng VINEX để nhận tư vấn về cung ứng nhân điều trắng, sản phẩm nông sản, bao bì và bộ quà tặng doanh nghiệp.",
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   const t = getDictionary(locale as Locale);
   const pg = t.pages.contact;

   return (
      <SmoothScroll>
         <main className="w-full flex flex-col min-h-screen  text-vinex-black pt-[90px]">
            {/* Ambient Global Gradient for Liquid Glass Refraction */}
            <div className="fixed inset-0 pointer-events-none z-0">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#074751]/30 rounded-full blur-[160px]" />
               <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-vinex-gold/30 rounded-full blur-[160px]" />
               <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/30 rounded-full blur-[160px]" />
            </div>

            {/* Section 2: Form liên hệ và Thông tin */}
            <section className="relative z-10 px-4 py-16 lg:py-24 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-16">

               {/* Form Section */}
               <div className="flex-1 bg-white/40 backdrop-blur-xl p-8 sm:p-10 md:p-14 border border-white/40 shadow-[0_16px_40px_rgba(7,71,81,0.06)] rounded-[24px]">
                  <h1 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-4 md:mb-6">{pg.form_title}</h1>
                  <p className="text-[15px] text-vinex-charcoal/80 mb-6 font-light leading-relaxed">Gửi yêu cầu tư vấn, nhận báo giá hoặc để lại lời nhắn để đội ngũ VINEX hỗ trợ nhanh nhất.</p>
                  <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-10"></div>

                  <form className="space-y-6 md:space-y-8 relative z-20">
                     <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Họ tên đại diện</label>
                        <input type="text" placeholder="Nhập họ tên của bạn..." className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" />
                     </div>

                     <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Doanh nghiệp</label>
                        <input type="text" placeholder="Tên công ty hoặc doanh nghiệp..." className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" />
                     </div>

                     <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Điện thoại / Email</label>
                        <input type="text" placeholder="Nhập số điện thoại hoặc email liên hệ..." className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" />
                     </div>

                     <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Nhu cầu</label>
                        <GlassSelect
                           name="nhu_cau"
                           placeholder="Chọn nhu cầu..."
                           options={[
                             { value: "cung-ung", label: "Cung ứng nguyên liệu" },
                             { value: "qua-tang", label: "Tư vấn quà tặng doanh nghiệp" },
                             { value: "hop-tac", label: "Hợp tác thương mại" }
                           ]}
                        />
                     </div>

                     <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Nội dung chi tiết</label>
                        <textarea rows={5} placeholder="Mô tả cụ thể về nhu cầu hợp tác của bạn..." className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] resize-none"></textarea>
                     </div>

                     <div className="hidden items-start gap-4">
                        <GlassCheckbox id="consent" label={pg.form_consent} />
                     </div>

                     <div className="pt-4">
                        <GlassButton variant="primary" size="lg" className="w-full md:w-auto">
                           {pg.form_submit}
                        </GlassButton>
                     </div>
                  </form>
               </div>

               {/* Info Section */}
               <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-8">
                  <div className="p-8 bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_16px_40px_rgba(7,71,81,0.06)] rounded-[24px]">
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
                  </div>

                  <div className="bg-[#074751]/95 backdrop-blur-xl p-8 rounded-[24px] shadow-[0_16px_40px_rgba(7,71,81,0.2)] border border-white/10">
                     <h4 className="font-semibold text-[11px] uppercase tracking-widest text-vinex-gold mb-3">Giờ làm việc</h4>
                     <p className="text-white/80 text-sm font-light leading-relaxed">
                        Thứ 2 - Thứ 6: 08:00 - 17:30<br />
                        Thứ 7: 08:00 - 12:00
                     </p>
                  </div>
               </div>

            </section>

         </main>
      </SmoothScroll>
   );
}
