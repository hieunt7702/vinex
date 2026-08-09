import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// Generate metadata dynamically later when data is real
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Sản phẩm ${slug} | VINEX`,
    description: `Khám phá chi tiết sản phẩm ${slug} tại VINEX.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-20">
        
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-500 w-full">
           <Link href="/vi/san-pham" className="hover:text-vinex-blue transition-colors">Sản phẩm</Link>
           <span className="mx-2">/</span>
           <span className="text-vinex-black font-medium">{slug}</span>
        </div>

        {/* Section 1: Hero sản phẩm + trạng thái */}
        <section className="px-4 pb-16 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
           {/* Image Gallery */}
           <div className="flex-1 w-full flex flex-col gap-4">
              <div className="aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative">
                 <div className="absolute top-4 left-4 bg-vinex-blue text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                    Đang phát triển
                 </div>
                 {/* Main Image placeholder */}
              </div>
              <div className="grid grid-cols-4 gap-4">
                 {[1, 2, 3, 4].map((img) => (
                    <div key={img} className="aspect-square bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-vinex-yellow transition-all">
                       {/* Thumb placeholder */}
                    </div>
                 ))}
              </div>
           </div>

           {/* Product Info */}
           <div className="flex-1 w-full">
              <div className="mb-8 border-b border-gray-200 pb-8">
                 <h1 className="text-4xl font-bold mb-4">{slug}</h1>
                 <p className="text-lg text-gray-600 leading-relaxed">
                    Mô tả ngắn về đặc điểm sản phẩm, ứng dụng và hình thức bao bì. (Ví dụ: Sự kết hợp giữa vị béo tự nhiên của hạt điều và những công thức hương vị hiện đại tạo nên sản phẩm phù hợp với nhu cầu ăn nhẹ, bán lẻ, phân phối và quà tặng).
                 </p>
              </div>

              {/* Thông số CMS */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                 <div className="bg-white p-4 rounded border border-gray-100">
                    <span className="block text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Nhóm</span>
                    <span className="font-bold">Hạt điều tẩm vị</span>
                 </div>
                 <div className="bg-white p-4 rounded border border-gray-100">
                    <span className="block text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Quy cách</span>
                    <span className="font-bold">50 g</span>
                 </div>
                 <div className="bg-white p-4 rounded border border-gray-100">
                    <span className="block text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Bao bì</span>
                    <span className="font-bold">Túi / Lọ</span>
                 </div>
                 <div className="bg-white p-4 rounded border border-gray-100">
                    <span className="block text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Ứng dụng</span>
                    <span className="font-bold">Bán lẻ / Bộ quà</span>
                 </div>
              </div>

              {/* CTA */}
              <div className="bg-vinex-blue p-8 rounded-xl text-white">
                 <h3 className="text-xl font-bold mb-2">Quan tâm sản phẩm này?</h3>
                 <p className="text-white/70 mb-6 text-sm">Để lại thông tin để nhận mẫu thử và báo giá chi tiết cho doanh nghiệp.</p>
                 <a href="/vi/lien-he" className="inline-block px-8 py-3 bg-vinex-yellow text-vinex-black rounded font-bold uppercase tracking-wider text-sm hover:bg-vinex-yellow/90 transition-colors">
                    Gửi yêu cầu
                 </a>
              </div>
           </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
