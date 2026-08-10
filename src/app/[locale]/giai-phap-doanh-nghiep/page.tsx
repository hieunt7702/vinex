import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Giải pháp sản phẩm theo nhu cầu doanh nghiệp | VINEX",
  description: "VINEX phối hợp lựa chọn nhóm sản phẩm, xây dựng cơ cấu danh mục, định hướng quy cách và bao bì theo nhu cầu doanh nghiệp.",
};

export default function BusinessSolutionPage() {
  const steps = [
    { id: '01', title: 'Nhu cầu & đối tượng' },
    { id: '02', title: 'Nhóm sản phẩm' },
    { id: '03', title: 'Cơ cấu danh mục' },
    { id: '04', title: 'Quy cách' },
    { id: '05', title: 'Bao bì' },
    { id: '06', title: 'Phương án triển khai' },
  ];

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-[#FAF8F2] text-vinex-black pt-[90px]">
        
        {/* Section 1: Hero & 6 Steps */}
        <section className="px-4 py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-8 leading-tight">Từ nhu cầu đến phương án <br className="hidden sm:block" /> sản phẩm phù hợp</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-20 font-light leading-relaxed">
            VINEX phối hợp cùng đối tác để lựa chọn nhóm sản phẩm, xây dựng cơ cấu danh mục, định hướng quy cách và bao bì, từ đó hoàn thiện phương án triển khai tối ưu nhất.
          </p>

          {/* 6 Steps Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12 w-full max-w-5xl">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                 <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl mb-4 md:mb-6 shadow-md transition-transform duration-300 group-hover:-translate-y-2
                    ${idx === 5 ? 'bg-vinex-teal text-white' : 'bg-vinex-gold text-vinex-teal'}`}>
                    <span className="font-marcellus">{step.id}</span>
                 </div>
                 <span className="font-bold text-[13px] md:text-[15px] text-vinex-teal uppercase tracking-wider text-center">{step.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Form Brief */}
        <section className="px-4 py-24 bg-vinex-teal text-white border-t border-white/10">
          <div className="max-w-4xl mx-auto bg-white/5 rounded-sm p-6 sm:p-10 md:p-16 border border-white/10 backdrop-blur-sm shadow-2xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-gold mb-4">Gửi nhu cầu sản phẩm</h2>
               <p className="text-white/80 font-light text-[15px]">Vui lòng cung cấp một số thông tin cơ bản để đội ngũ VINEX có thể đề xuất giải pháp phù hợp nhất.</p>
            </div>
            
            <form className="space-y-6 md:space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 <div>
                    <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3 text-white/90">Nhóm sản phẩm quan tâm</label>
                    <select className="w-full p-3 md:p-4 rounded-sm bg-white/10 border border-white/20 text-white focus:outline-none focus:border-vinex-gold transition-colors font-light appearance-none text-sm md:text-base">
                       <option value="" className="text-black">Chọn nhóm sản phẩm...</option>
                       <option value="hat-dieu" className="text-black">Hạt điều & sản phẩm từ hạt</option>
                       <option value="tra-ca-phe" className="text-black">Trà, thảo mộc, cà phê</option>
                       <option value="banh-keo" className="text-black">Bánh, bánh quy, kẹo</option>
                       <option value="nong-san" className="text-black">Trái cây sấy, nông sản chế biến</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3 text-white/90">Mục đích sử dụng / Kênh phân phối</label>
                    <input type="text" placeholder="Bán lẻ, đóng bộ quà..." className="w-full p-3 md:p-4 rounded-sm bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-vinex-gold transition-colors font-light text-sm md:text-base" />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 <div>
                    <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3 text-white/90">Số lượng dự kiến</label>
                    <input type="text" placeholder="10.000 túi, 5.000 hộp..." className="w-full p-3 md:p-4 rounded-sm bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-vinex-gold transition-colors font-light text-sm md:text-base" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-white/90">Ngân sách dự kiến</label>
                    <input type="text" placeholder="Khoảng ngân sách / sản phẩm" className="w-full p-4 rounded-sm bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-vinex-gold transition-colors font-light" />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-white/90">Thời gian dự kiến</label>
                    <input type="text" placeholder="Tháng triển khai" className="w-full p-4 rounded-sm bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-vinex-gold transition-colors font-light" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-white/90">Thông tin liên hệ</label>
                    <input type="text" placeholder="Tên / Email / SĐT" className="w-full p-4 rounded-sm bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-vinex-gold transition-colors font-light" />
                 </div>
               </div>

               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-white/90">Yêu cầu quy cách và bao bì</label>
                  <textarea rows={4} placeholder="Ví dụ: Cần đóng túi zip 100g, hộp quà 3 set..." className="w-full p-4 rounded-sm bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-vinex-gold transition-colors font-light resize-none"></textarea>
               </div>
               
               <div className="text-center pt-8">
                  <button type="button" className="px-12 py-4 bg-vinex-gold text-vinex-teal rounded-sm font-bold uppercase tracking-[0.15em] text-xs hover:bg-white transition-colors w-full md:w-auto shadow-xl">
                     Gửi yêu cầu sản phẩm
                  </button>
               </div>
            </form>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
