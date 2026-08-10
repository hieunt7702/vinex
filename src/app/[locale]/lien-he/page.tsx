import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';

export const metadata: Metadata = {
  title: "Liên hệ VINEX | Nông sản và Quà tặng doanh nghiệp",
  description: "Kết nối cùng VINEX để nhận tư vấn về cung ứng nhân điều trắng, sản phẩm nông sản, bao bì và bộ quà tặng doanh nghiệp.",
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const pg = t.pages.contact;

  const solutions = [
    { id: '01', title: pg.solutions[0].title, desc: pg.solutions[0].desc, link: `/${locale}/nhan-dieu-trang`, bg: 'bg-[#FAF8F2] border-[#E8E4D9] text-vinex-teal', numBg: 'bg-vinex-gold text-vinex-teal' },
    { id: '02', title: pg.solutions[1].title, desc: pg.solutions[1].desc, link: `/${locale}/giai-phap-doanh-nghiep`, bg: 'bg-[#FAF8F2] border-[#E8E4D9] text-vinex-teal', numBg: 'bg-vinex-gold text-vinex-teal' },
    { id: '03', title: pg.solutions[2].title, desc: pg.solutions[2].desc, link: `/${locale}/qua-tang-doanh-nghiep`, bg: 'bg-vinex-teal border-vinex-teal text-white shadow-xl', numBg: 'bg-vinex-gold text-vinex-teal' },
  ];

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-[90px]">
        
        {/* Section 1: Mỏ neo giải pháp */}
        <section className="px-4 py-24 max-w-7xl mx-auto w-full">
          <div className="text-center mb-10 md:mb-16">
             <h1 className="text-3xl md:text-4xl lg:text-5xl font-marcellus text-vinex-teal mb-4 md:mb-6 leading-tight">{pg.hero_title}</h1>
             <div className="w-[60px] h-[2px] bg-vinex-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
             {solutions.map((sol, idx) => (
                <Link href={sol.link} key={idx} className={`p-6 md:p-8 rounded-sm border flex flex-col hover:shadow-lg transition-all duration-300 group ${sol.bg}`}>
                   <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg md:text-xl mb-4 md:mb-6 ${sol.numBg}`}>
                      {sol.id}
                   </div>
                   <h3 className={`font-bold text-base md:text-lg mb-2 group-hover:opacity-80 transition-opacity`}>{sol.title}</h3>
                   <p className="font-light text-[13px] md:text-sm opacity-80">{sol.desc}</p>
                </Link>
             ))}
          </div>
        </section>

        {/* Section 2: Form liên hệ và Thông tin */}
        <section className="px-4 py-16 md:py-24 bg-[#FAF8F2] border-t border-[#E8E4D9]">
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-16">
             
             {/* Form Section */}
             <div className="flex-1 bg-white p-6 sm:p-10 md:p-14 rounded-sm shadow-sm border border-[#E8E4D9]">
                <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-8 md:mb-10">{pg.form_title}</h2>
                
                <form className="space-y-6 md:space-y-8">
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Họ tên đại diện</label>
                      <input type="text" className="w-full p-4 rounded-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-teal focus:ring-1 focus:ring-vinex-teal transition-all font-light" />
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Doanh nghiệp</label>
                      <input type="text" className="w-full p-4 rounded-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-teal focus:ring-1 focus:ring-vinex-teal transition-all font-light" />
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Điện thoại / Email</label>
                      <input type="text" className="w-full p-4 rounded-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-teal focus:ring-1 focus:ring-vinex-teal transition-all font-light" />
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Nhu cầu</label>
                      <select className="w-full p-4 rounded-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-teal focus:ring-1 focus:ring-vinex-teal transition-all font-light appearance-none text-gray-700">
                         <option value="">Chọn nhu cầu...</option>
                         <option value="cung-ung">Cung ứng thương mại</option>
                         <option value="san-pham">Sản phẩm bán lẻ</option>
                         <option value="bao-bi">Sản xuất bao bì</option>
                         <option value="qua-tang">Bộ quà tặng doanh nghiệp</option>
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Nội dung chi tiết</label>
                      <textarea rows={5} className="w-full p-4 rounded-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-vinex-teal focus:ring-1 focus:ring-vinex-teal transition-all font-light resize-none"></textarea>
                   </div>

                   <div className="flex items-start gap-4">
                      <input type="checkbox" id="consent" className="mt-1 accent-vinex-teal w-4 h-4 cursor-pointer" />
                      <label htmlFor="consent" className="text-[13px] text-gray-500 font-light leading-relaxed cursor-pointer">
                         {pg.form_consent}
                      </label>
                   </div>
                   
                   <div className="pt-4">
                      <button type="button" className="px-12 py-4 bg-vinex-teal text-white rounded-sm font-bold uppercase tracking-[0.15em] text-xs hover:bg-vinex-teal/90 transition-colors w-full md:w-auto shadow-md">
                         {pg.form_submit}
                      </button>
                   </div>
                </form>
             </div>

             {/* Info Section */}
             <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-12 pt-4">
                <div>
                   <h3 className="text-2xl font-marcellus text-vinex-teal mb-8">Thông tin liên hệ</h3>
                   <ul className="space-y-8 text-gray-600">
                      <li>
                         <span className="block font-bold text-xs uppercase tracking-widest text-vinex-gold mb-2">Hotline</span>
                         <span className="text-lg text-vinex-black">090 123 4567</span>
                      </li>
                      <li>
                         <span className="block font-bold text-xs uppercase tracking-widest text-vinex-gold mb-2">Email</span>
                         <span className="text-lg text-vinex-black">hello@vinex.vn</span>
                      </li>
                      <li>
                         <span className="block font-bold text-xs uppercase tracking-widest text-vinex-gold mb-2">Văn phòng đại diện</span>
                         <span className="text-[15px] font-light leading-relaxed text-vinex-black">Tầng 12, Tòa nhà Vincom Center, 72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP. HCM</span>
                      </li>
                      <li>
                         <span className="block font-bold text-xs uppercase tracking-widest text-vinex-gold mb-2">Nhà máy sản xuất</span>
                         <span className="text-[15px] font-light leading-relaxed text-vinex-black">Khu công nghiệp Bàu Bàng, Xã Lai Uyên, Huyện Bàu Bàng, Tỉnh Bình Dương</span>
                      </li>
                   </ul>
                </div>
                
                <div className="bg-white p-8 rounded-sm border border-[#E8E4D9]">
                   <h4 className="font-bold text-sm uppercase tracking-widest text-vinex-teal mb-4">Giờ làm việc</h4>
                   <p className="text-gray-600 text-[15px] font-light leading-relaxed">
                      Thứ 2 - Thứ 6: 08:00 - 17:30<br/>
                      Thứ 7: 08:00 - 12:00
                   </p>
                </div>
             </div>

          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
