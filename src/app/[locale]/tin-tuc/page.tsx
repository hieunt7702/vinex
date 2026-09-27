import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { getPublicArticles } from '@/lib/dataService';
import { NewsListing } from '@/components/news/NewsListing';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
   title: "Tin tức & câu chuyện | VINEX",
   description: "Cập nhật hoạt động VINEX, kiến thức nông sản và kinh nghiệm chọn quà.",
};

export default async function KnowledgePage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   const liveArticles = await getPublicArticles();

   return (
      <SmoothScroll>
         <main className="w-full flex flex-col min-h-screen pt-[100px] sm:pt-[110px] pb-24 relative overflow-clip bg-[#FAF8F2]">
            
            {/* Ambient Global Gradient for Liquid Glass Refraction */}
            <div className="fixed inset-0 pointer-events-none z-0">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#074751]/20 rounded-full blur-[160px]" />
               <div className="absolute top-[35%] right-[-10%] w-[50%] h-[50%] bg-vinex-gold/20 rounded-full blur-[160px]" />
               <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/20 rounded-full blur-[160px]" />
            </div>

            <section className="relative z-10 px-4 md:px-8 xl:px-12 max-w-[1536px] mx-auto w-full">
               <NewsListing initialArticles={liveArticles} locale={locale} />
            </section>
         </main>
      </SmoothScroll>
   );
}
