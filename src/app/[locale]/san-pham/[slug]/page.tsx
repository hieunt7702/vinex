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
      <main className="w-full flex flex-col min-h-screen bg-vinex-ivory pt-28 pb-20">
        
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 w-full mb-12">
           <div className="flex items-center text-[10px] uppercase tracking-widest font-bold text-vinex-charcoal/50">
             <Link href="/vi/san-pham" className="hover:text-vinex-teal transition-colors">Sản phẩm</Link>
             <span className="mx-4 text-vinex-gold">/</span>
             <span className="text-vinex-charcoal">{product.name}</span>
           </div>
        </div>

        {/* Section 1: Hero sản phẩm + trạng thái */}
        <section className="px-4 md:px-8 xl:px-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 xl:gap-24 w-full">
           {/* Image Gallery */}
           <div className="flex-1 w-full flex flex-col gap-6">
              <div className="aspect-[4/5] bg-vinex-teal/5 relative border border-vinex-charcoal/10 group overflow-hidden">
                 <div className="absolute top-6 left-6 bg-vinex-gold text-vinex-charcoal text-[10px] font-bold uppercase tracking-widest px-4 py-2 z-10 shadow-sm">
                    Đang phát triển
                 </div>
                 {/* Main Image placeholder */}
                 <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12">
                   <div className="w-full h-full relative">
                     <Image src={product.img} alt={product.name} fill className="object-contain" />
                   </div>
                 </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                 {[1, 2, 3, 4].map((img) => (
                    <div key={img} className="aspect-square bg-vinex-teal/5 border border-vinex-charcoal/10 flex items-center justify-center cursor-pointer hover:border-vinex-teal transition-colors relative p-2">
                       <Image src={product.img} alt={`Thumb ${img}`} fill className="object-contain p-2 opacity-60 hover:opacity-100 transition-opacity" />
                    </div>
                 ))}
              </div>
           </div>

           {/* Product Info */}
           <div className="flex-1 w-full lg:py-6">
              <div className="mb-12 border-b border-vinex-charcoal/10 pb-10">
                 <h1 className="text-[40px] sm:text-[48px] font-marcellus text-vinex-charcoal leading-[1.1] mb-6 capitalize">{product.name}</h1>
                 <p className="text-[15px] text-vinex-charcoal/70 leading-relaxed max-w-xl">
                    Mô tả ngắn về đặc điểm sản phẩm, ứng dụng và hình thức bao bì. (Ví dụ: Sự kết hợp giữa vị béo tự nhiên của hạt điều và những công thức hương vị hiện đại tạo nên sản phẩm phù hợp với nhu cầu ăn nhẹ, bán lẻ, phân phối và quà tặng).
                 </p>
              </div>

              {/* Thông số CMS */}
              <div className="grid grid-cols-2 gap-6 mb-16">
                 <div className="p-6 border border-vinex-charcoal/10 hover:bg-vinex-teal/5 transition-colors group">
                    <span className="block text-[10px] text-vinex-teal font-bold uppercase tracking-widest mb-3">Nhóm</span>
                    <span className="font-marcellus text-xl text-vinex-charcoal group-hover:text-vinex-teal transition-colors">Hạt điều tẩm vị</span>
                 </div>
                 <div className="p-6 border border-vinex-charcoal/10 hover:bg-vinex-teal/5 transition-colors group">
                    <span className="block text-[10px] text-vinex-teal font-bold uppercase tracking-widest mb-3">Quy cách</span>
                    <span className="font-marcellus text-xl text-vinex-charcoal group-hover:text-vinex-teal transition-colors">50 g</span>
                 </div>
                 <div className="p-6 border border-vinex-charcoal/10 hover:bg-vinex-teal/5 transition-colors group">
                    <span className="block text-[10px] text-vinex-teal font-bold uppercase tracking-widest mb-3">Bao bì</span>
                    <span className="font-marcellus text-xl text-vinex-charcoal group-hover:text-vinex-teal transition-colors">Túi / Lọ</span>
                 </div>
                 <div className="p-6 border border-vinex-charcoal/10 hover:bg-vinex-teal/5 transition-colors group">
                    <span className="block text-[10px] text-vinex-teal font-bold uppercase tracking-widest mb-3">Ứng dụng</span>
                    <span className="font-marcellus text-xl text-vinex-charcoal group-hover:text-vinex-teal transition-colors">Bán lẻ / Bộ quà</span>
                 </div>
              </div>

              {/* CTA */}
              <div className="bg-vinex-teal p-10 lg:p-12 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-vinex-gold/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                 <div className="relative z-10">
                   <h3 className="text-2xl font-marcellus mb-4">Quan tâm sản phẩm này?</h3>
                   <p className="text-white/80 mb-8 text-[14px] leading-relaxed max-w-sm">Để lại thông tin để nhận mẫu thử và báo giá chi tiết cho doanh nghiệp.</p>
                   <Link href="/vi/lien-he" className="inline-block px-8 py-4 bg-transparent border border-vinex-gold text-vinex-gold font-bold uppercase tracking-widest text-[11px] hover:bg-vinex-gold hover:text-vinex-charcoal transition-colors text-center">
                      Gửi yêu cầu
                   </Link>
                 </div>
              </div>
           </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
