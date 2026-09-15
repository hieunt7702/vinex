import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassButton, GlassCard } from '@/components/ui/glass';

export const metadata: Metadata = {
   title: "Kiến thức nông sản | VINEX",
   description: "Cập nhật các kiến thức chuyên sâu về hạt điều, quy trình bóc tách, ứng dụng sản phẩm và giải pháp quà tặng doanh nghiệp.",
};

export default async function KnowledgePage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   const t = getDictionary(locale as Locale);
   const pg = t.pages.knowledge;

   const articles = [
      { title: 'Nhân điều trắng là gì? Phân loại và ứng dụng trong sản xuất', slug: 'nhan-dieu-trang-la-gi' },
      { title: 'Quy trình 8 bước từ điều thô đến nhân điều trắng đạt chuẩn', slug: 'quy-trinh-boc-tach-dieu' },
      { title: 'Cách xây dựng bộ quà tặng doanh nghiệp ấn tượng', slug: 'cach-xay-dung-bo-qua-tang' },
   ];

   return (
      <SmoothScroll>
         <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-20">

            <section className="px-4 py-16 lg:py-20 max-w-7xl mx-auto w-full">
               <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">

                  {/* Main Content */}
                  <div className="flex-1">
                     <h1 className="text-4xl md:text-5xl font-marcellus text-vinex-teal mb-6">{pg.hero_title}</h1>
                     <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-8"></div>
                     <p className="text-lg text-gray-600 mb-12 font-light leading-relaxed">{pg.hero_desc}</p>

                     <div className="space-y-8">
                        {articles.map((article, idx) => (
                           <GlassCard key={idx} variant="interactive" className="p-6">
                              <article className="flex flex-col sm:flex-row gap-6 items-start">
                                 <div className="w-full sm:w-56 aspect-[4/3] bg-gray-100 rounded-[18px] shrink-0 overflow-hidden relative">
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">
                                       Bài viết {idx + 1}
                                    </div>
                                 </div>
                                 <div className="flex-1">
                                    <h2 className="text-xl font-semibold mb-3 group-hover:text-vinex-teal transition-colors">
                                       <Link href={`/vi/kien-thuc/${article.slug}`}>{article.title}</Link>
                                    </h2>
                                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm font-light leading-relaxed">
                                       Mô tả ngắn gọn về bài viết. Cung cấp kiến thức hữu ích về nông sản, từ quy trình sản xuất đến giải pháp bao bì và quà tặng.
                                    </p>
                                    <Link href={`/vi/kien-thuc/${article.slug}`} className="text-sm font-semibold text-vinex-teal uppercase tracking-wider hover:underline">
                                       Đọc tiếp &rarr;
                                    </Link>
                                 </div>
                              </article>
                           </GlassCard>
                        ))}
                     </div>
                  </div>

                  {/* Sidebar (CTA) */}
                  <aside className="w-full md:w-80 shrink-0">
                     <GlassCard variant="teal" className="p-8 sticky top-32">
                        <h3 className="text-xl font-semibold mb-4 text-white">Bạn cần tư vấn trực tiếp?</h3>
                        <p className="text-white/70 text-sm mb-8 font-light leading-relaxed">VINEX sẵn sàng hỗ trợ bạn với các giải pháp cung ứng, sản phẩm và quà tặng doanh nghiệp chuyên nghiệp.</p>
                        <Link href="/vi/lien-he" className="block w-full">
                           <GlassButton variant="gold" className="w-full justify-center">
                              Nhận tư vấn
                           </GlassButton>
                        </Link>
                     </GlassCard>
                  </aside>

               </div>
            </section>

         </main>
      </SmoothScroll>
   );
}
