import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { products } from '@/data/products';
import { ProductCatalog } from '@/components/products/ProductCatalog';

export const metadata: Metadata = {
  title: "Sản phẩm hạt điều và nông sản Việt | VINEX",
  description: "Khám phá hạt điều tẩm vị, trà, cà phê, bánh, kẹo, trái cây sấy và sản phẩm nông sản VINEX đang phát triển.",
};

// Dữ liệu mẫu (sẽ được thay thế bằng CMS sau)

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const pg = t.pages.products;
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-[#FAF8F2] text-vinex-black pt-[90px]">
        
        {/* Header Section */}
        <section className="px-4 md:px-8 xl:px-12 pt-20 pb-12 max-w-[1400px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6">{pg.hero_title}</h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
             {pg.hero_desc}
          </p>
        </section>

        {/* Filters and Product List */}
        <ProductCatalog initialProducts={products} />

      </main>
    </SmoothScroll>
  );
}
