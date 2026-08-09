import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";

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
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-20">
        
        {/* Section 1: Hero */}
        <section className="px-4 py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Từ nhu cầu đến phương án sản phẩm phù hợp</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-16 leading-relaxed">
            VINEX phối hợp lựa chọn nhóm sản phẩm, xây dựng cơ cấu danh mục, định hướng quy cách và bao bì, hoàn thiện phương án triển khai.
          </p>

          {/* 6 Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {steps.map((step, idx) => (
              <div key={idx} className={`p-6 rounded-lg flex items-center gap-4 ${idx === 5 ? 'bg-vinex-blue text-white' : 'bg-white border border-gray-100 shadow-sm'}`}>
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${idx === 5 ? 'bg-vinex-yellow text-vinex-black' : 'bg-vinex-yellow text-vinex-black'}`}>
                    {step.id}
                 </div>
                 <span className="font-bold text-left">{step.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Form Brief */}
        <section className="px-4 py-24 bg-vinex-blue text-white">
          <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10 backdrop-blur-sm">
            <div className="text-center mb-10">
               <h2 className="text-3xl font-bold mb-4">Gửi nhu cầu sản phẩm</h2>
               <p className="text-white/70">Vui lòng cung cấp một số thông tin cơ bản để chúng tôi có thể đề xuất giải pháp tốt nhất.</p>
            </div>
            
            <form className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold mb-2 text-white/90">Nhóm sản phẩm quan tâm</label>
                    <select className="w-full p-4 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-vinex-yellow">
                       <option value="" className="text-black">Chọn nhóm sản phẩm...</option>
                       <option value="hat-dieu" className="text-black">Hạt điều</option>
                       <option value="tra-ca-phe" className="text-black">Trà & cà phê</option>
                       <option value="banh-keo" className="text-black">Bánh & kẹo</option>
                       <option value="nong-san" className="text-black">Nông sản chế biến</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold mb-2 text-white/90">Mục đích sử dụng / Kênh phân phối</label>
                    <input type="text" className="w-full p-4 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-vinex-yellow" />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold mb-2 text-white/90">Số lượng dự kiến</label>
                    <input type="text" className="w-full p-4 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-vinex-yellow" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold mb-2 text-white/90">Ngân sách dự kiến</label>
                    <input type="text" className="w-full p-4 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-vinex-yellow" />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold mb-2 text-white/90">Thời gian dự kiến</label>
                    <input type="text" className="w-full p-4 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-vinex-yellow" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold mb-2 text-white/90">Thông tin liên hệ (Email/SĐT)</label>
                    <input type="text" className="w-full p-4 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-vinex-yellow" />
                 </div>
               </div>

               <div>
                  <label className="block text-sm font-bold mb-2 text-white/90">Yêu cầu quy cách và bao bì</label>
                  <textarea rows={4} className="w-full p-4 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-vinex-yellow"></textarea>
               </div>
               
               <div className="text-center pt-6">
                  <button type="button" className="px-12 py-4 bg-vinex-yellow text-vinex-black rounded font-bold uppercase tracking-wider hover:bg-vinex-yellow/90 transition-colors w-full md:w-auto">
                     Gửi nhu cầu sản phẩm
                  </button>
               </div>
            </form>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
