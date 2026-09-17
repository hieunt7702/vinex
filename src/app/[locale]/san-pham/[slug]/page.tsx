import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';

type Props = {
   params: Promise<{ slug: string; locale: string }>;
};

// Generate metadata dynamically later when data is real
export async function generateMetadata(
   { params }: Props
): Promise<Metadata> {
   const { slug } = await params;
   const product = products.find(p => p.slug === slug) || products[0];
   return {
      title: `Sản phẩm ${slug} | VINEX`,
      description: `Khám phá chi tiết sản phẩm ${slug} tại VINEX.`,
   };
}

export default async function ProductDetailPage({ params }: Props) {
   const { slug } = await params;
   const product = products.find(p => p.slug === slug) || products[0];

   return (
      <SmoothScroll>
         <main className="w-full flex flex-col min-h-screen pt-[140px] lg:pt-[160px] pb-20 relative overflow-hidden text-vinex-black">
            
            {/* Ambient Global Gradient for Liquid Glass Refraction */}
            <div className="fixed inset-0 pointer-events-none z-0">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#074751]/30 rounded-full blur-[160px]" />
               <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-vinex-gold/30 rounded-full blur-[160px]" />
               <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/30 rounded-full blur-[160px]" />
            </div>

            <div className="relative z-10">
            {/* Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 w-full mb-12">
               <div className="flex items-center text-[10px] uppercase tracking-widest font-semibold text-vinex-charcoal/50">
                  <Link href="/vi/san-pham" className="hover:text-vinex-teal transition-colors">Sản phẩm</Link>
                  <span className="mx-4 text-vinex-gold">/</span>
                  <span className="text-vinex-charcoal">{product.name}</span>
               </div>
            </div>

            {/* Section 1: Hero sản phẩm + trạng thái */}
            <section className="px-4 md:px-8 xl:px-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 xl:gap-24 w-full">
               {/* Image Gallery */}
               <div className="flex-1 w-full flex flex-col gap-6">
                  <div className="aspect-[4/5] relative">
                     {/* Main Image placeholder */}
                     <div className="absolute inset-0 flex items-center justify-center p-0 lg:p-4">
                        <div className="w-full h-full relative">
                           <Image src={product.img} alt={product.name} fill className="object-contain" />
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                     {[1, 2, 3, 4].map((img) => (
                        <div key={img} className="aspect-square flex items-center justify-center cursor-pointer relative p-2">
                           <Image src={product.img} alt={`Thumb ${img}`} fill className="object-contain p-2 opacity-50 hover:opacity-100 transition-opacity" />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Product Info */}
               <div className="flex-1 w-full lg:py-6">
                  <div className="mb-12 border-b border-vinex-charcoal/10 pb-10">
                     <h1 className="text-[40px] sm:text-[48px] font-marcellus text-vinex-charcoal leading-[1.1] mb-6 capitalize">{product.name}</h1>
                     <p className="text-[15px] text-vinex-charcoal/70 leading-relaxed max-w-xl">
                        {product.desc}
                     </p>
                  </div>

                  {/* Thông số CMS */}
                  <div className="grid grid-cols-2 gap-6 mb-16">
                     <div className="p-6 bg-white/40 backdrop-blur-md border border-white/40 hover:bg-white/60 transition-colors group rounded-[16px] shadow-sm">
                        <span className="block text-[10px] text-vinex-teal font-semibold uppercase tracking-widest mb-3">Danh mục</span>
                        <span className="font-marcellus text-xl text-vinex-charcoal group-hover:text-vinex-teal transition-colors">{product.category}</span>
                     </div>
                     <div className="p-6 bg-white/40 backdrop-blur-md border border-white/40 hover:bg-white/60 transition-colors group rounded-[16px] shadow-sm">
                        <span className="block text-[10px] text-vinex-teal font-semibold uppercase tracking-widest mb-3">Quy cách</span>
                        <span className="font-marcellus text-xl text-vinex-charcoal group-hover:text-vinex-teal transition-colors">50 g</span>
                     </div>
                     <div className="p-6 bg-white/40 backdrop-blur-md border border-white/40 hover:bg-white/60 transition-colors group rounded-[16px] shadow-sm">
                        <span className="block text-[10px] text-vinex-teal font-semibold uppercase tracking-widest mb-3">Bao bì</span>
                        <span className="font-marcellus text-xl text-vinex-charcoal group-hover:text-vinex-teal transition-colors">Túi / Lọ</span>
                     </div>
                     <div className="p-6 bg-white/40 backdrop-blur-md border border-white/40 hover:bg-white/60 transition-colors group rounded-[16px] shadow-sm">
                        <span className="block text-[10px] text-vinex-teal font-semibold uppercase tracking-widest mb-3">Ứng dụng</span>
                        <span className="font-marcellus text-xl text-vinex-charcoal group-hover:text-vinex-teal transition-colors">Bán lẻ / Bộ quà</span>
                     </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-[#074751]/95 backdrop-blur-xl p-10 lg:p-12 text-white relative overflow-hidden group rounded-[24px] shadow-[0_16px_40px_rgba(7,71,81,0.2)] border border-white/10">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-vinex-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                     <div className="relative z-10">
                        <h3 className="text-2xl font-marcellus mb-4">Quan tâm sản phẩm này?</h3>
                        <p className="text-white/80 mb-8 text-[14px] leading-relaxed max-w-sm">Để lại thông tin để nhận mẫu thử và báo giá chi tiết cho doanh nghiệp.</p>
                        <Link href="/vi/lien-he" className="inline-block px-8 py-4 bg-transparent border border-vinex-gold text-vinex-gold font-semibold uppercase tracking-widest text-[11px] hover:bg-vinex-gold hover:text-vinex-charcoal transition-colors text-center rounded-full">
                           Liên hệ nhận báo giá
                        </Link>
                     </div>
                  </div>
               </div>
            </section>

            </div>
         </main>
      </SmoothScroll>
   );
}
