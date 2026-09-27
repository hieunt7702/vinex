import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { getPublicProducts } from '@/lib/dataService';
import { ProductCatalog } from '@/components/products/ProductCatalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Sản phẩm hạt điều và nông sản Việt | VINEX",
  description: "Khám phá hạt điều tẩm vị, trà, cà phê, bánh, kẹo, trái cây sấy và sản phẩm nông sản VINEX đang phát triển.",
};

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const pg = t.pages.products;
  const liveProducts = await getPublicProducts();

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen text-vinex-black pt-[90px] relative overflow-clip">
        
        {/* Ambient Global Gradient for Liquid Glass Refraction */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#074751]/30 rounded-full blur-[160px]" />
          <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-vinex-gold/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/30 rounded-full blur-[160px]" />
        </div>

        {/* Header Section matching mockup */}
        <section className="relative z-10 px-4 md:px-8 xl:px-12 pt-12 sm:pt-14 pb-8 max-w-[1536px] mx-auto text-center w-full">
          <span className="text-gray-500 font-medium tracking-[0.25em] text-[12px] uppercase mb-2.5 block">
            {locale === 'en' ? 'ESSENCE OF VIETNAMESE AGRI' : 'TINH HOA NÔNG SẢN VIỆT'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[52px] font-marcellus text-[#074751] mb-3">
            {pg.hero_title || 'Danh mục sản phẩm'}
          </h1>
          <div className="w-[50px] h-[2px] bg-vinex-gold mx-auto mb-3"></div>
          <p className="text-[15px] sm:text-[16px] text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
            {locale === 'en' ? 'Choose delicious taste every day, find meaningful gifts.' : 'Chọn vị ngon mỗi ngày, tìm món quà thật ý nghĩa.'}
          </p>
        </section>

        {/* Filters and Product List */}
        <ProductCatalog initialProducts={liveProducts} />

      </main>
    </SmoothScroll>
  );
}
