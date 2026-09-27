import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { GlassCard } from '@/components/ui/glass';
import { BusinessSolutionForm } from '@/components/forms/BusinessSolutionForm';

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
      <main className="w-full flex flex-col min-h-screen text-vinex-black pt-[90px]">

        {/* Section 1: Hero & 6 Steps */}
        <section className="px-4 md:px-8 xl:px-12 py-16 lg:py-20 max-w-[1536px] mx-auto flex flex-col items-center text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6 leading-tight">Từ nhu cầu đến phương án <br className="hidden sm:block" /> sản phẩm phù hợp</h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mb-20 font-light leading-relaxed">
            VINEX phối hợp cùng đối tác để lựa chọn nhóm sản phẩm, xây dựng cơ cấu danh mục, định hướng quy cách và bao bì, từ đó hoàn thiện phương án triển khai tối ưu nhất.
          </p>

          {/* 6 Steps Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {steps.map((step, idx) => (
              <GlassCard key={idx} variant="interactive" className="flex flex-col items-center justify-center p-6 text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold text-xl mb-4 shadow-sm
                    ${idx === 5 ? 'bg-vinex-teal text-white' : 'bg-vinex-gold text-vinex-teal'}`}>
                  <span className="font-marcellus">{step.id}</span>
                </div>
                <span className="font-semibold text-[13px] md:text-[15px] text-vinex-teal uppercase tracking-wider">{step.title}</span>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Section 2: Form Brief */}
        <section className="px-4 py-16 lg:py-20 bg-vinex-teal text-white border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <BusinessSolutionForm />
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
