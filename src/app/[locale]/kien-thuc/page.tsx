import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';

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
          <div className="flex flex-col md:flex-row gap-16 items-start">
             
             {/* Main Content */}
             <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-marcellus text-vinex-teal mb-6">{pg.hero_title}</h1>
                <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-12"></div>
                <p className="text-lg text-gray-600 mb-12 font-light">{pg.hero_desc}</p>
                
                <div className="space-y-12">
                   {articles.map((article, idx) => (
                      <article key={idx} className="group flex flex-col sm:flex-row gap-6 items-start">
                         <div className="w-full sm:w-64 aspect-[4/3] bg-gray-200 rounded shrink-0 overflow-hidden relative">
                            {/* Article Image Placeholder */}
                            <div className="absolute inset-0 bg-vinex-blue/0 group-hover:bg-vinex-blue/10 transition-colors"></div>
                         </div>
                         <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-3 group-hover:text-vinex-teal transition-colors">
                               <Link href={`/vi/kien-thuc/${article.slug}`}>{article.title}</Link>
                            </h2>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                               Mô tả ngắn gọn về bài viết. Cung cấp kiến thức hữu ích về nông sản, từ quy trình sản xuất đến giải pháp bao bì và quà tặng.
                            </p>
                            <Link href={`/vi/kien-thuc/${article.slug}`} className="text-sm font-bold text-vinex-teal uppercase tracking-wider hover:underline">
                               Đọc tiếp
                            </Link>
                         </div>
                      </article>
                   ))}
                </div>
             </div>

             {/* Sidebar (CTA) */}
             <aside className="w-full md:w-80 shrink-0">
                <div className="bg-vinex-teal p-8 rounded-xl text-white sticky top-32">
                   <h3 className="text-xl font-bold mb-4">Bạn cần tư vấn trực tiếp?</h3>
                   <p className="text-white/70 text-sm mb-8">VINEX sẵn sàng hỗ trợ bạn với các giải pháp cung ứng, sản phẩm và quà tặng doanh nghiệp chuyên nghiệp.</p>
                   <Link href="/vi/lien-he" className="block w-full py-4 bg-vinex-gold text-vinex-charcoal rounded text-center font-bold uppercase tracking-wider hover:bg-white transition-colors">
                      Nhận tư vấn
                   </Link>
                </div>
             </aside>
             
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
