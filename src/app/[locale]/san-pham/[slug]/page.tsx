import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { getProductBySlug, getPublicProducts } from '@/lib/dataService';
import { ProductDetailView } from '@/components/products/ProductDetailView';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Props = {
   params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata(
   { params }: Props
): Promise<Metadata> {
   const { slug } = await params;
   const product = (await getProductBySlug(slug)) || (await getPublicProducts())[0];
   if (!product) {
      return { title: 'Sản phẩm VINEX | Nông sản Việt' };
   }
   return {
      title: `${product.name} | VINEX`,
      description: product.desc || `Khám phá chi tiết sản phẩm ${product.name} tại VINEX.`,
   };
}

export default async function ProductDetailPage({ params }: Props) {
   const { slug, locale } = await params;
   const product = await getProductBySlug(slug);

   if (!product) {
      notFound();
   }

   const allProducts = await getPublicProducts();
   // Related products: priority to same category, fallback to others, excluding current product
   const relatedProducts = allProducts
      .filter(p => p.slug !== product.slug && p.slug !== slug)
      .sort((a, b) => (a.category === product.category ? -1 : 1))
      .slice(0, 3);

   return (
      <SmoothScroll>
         <main className="w-full flex flex-col min-h-screen pt-[120px] lg:pt-[140px] pb-16 relative overflow-hidden text-vinex-black">
            
            {/* Ambient Global Gradient for Liquid Glass Refraction */}
            <div className="fixed inset-0 pointer-events-none z-0">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#074751]/30 rounded-full blur-[160px]" />
               <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-vinex-gold/30 rounded-full blur-[160px]" />
               <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/30 rounded-full blur-[160px]" />
            </div>

            <ProductDetailView 
               product={product} 
               relatedProducts={relatedProducts} 
               lang={locale} 
            />

         </main>
      </SmoothScroll>
   );
}
