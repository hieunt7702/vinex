import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import Image from 'next/image';
import { products } from '@/data/products';

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
        <section className="px-4 md:px-8 xl:px-12 pb-16 lg:pb-20 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-[240px] shrink-0 sticky top-32 h-fit">
            <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-vinex-teal">Bộ lọc</h3>
            <div className="space-y-8">
               <div>
                  <h4 className="font-bold mb-4 text-vinex-black text-[15px]">Nhóm sản phẩm</h4>
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Hạt & sản phẩm từ hạt</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Trà & cà phê</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Bánh & kẹo</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Nông sản chế biến</label>
                  </div>
               </div>
               <div>
                  <h4 className="font-bold mb-4 text-vinex-black text-[15px]">Trạng thái</h4>
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Đang phát triển</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Sẵn sàng cung ứng</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Phát triển theo yêu cầu</label>
                  </div>
               </div>
               <div>
                  <h4 className="font-bold mb-4 text-vinex-black text-[15px]">Hình thức bao bì</h4>
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Hộp giấy cao cấp</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Túi zip / Bao bì mềm</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Lọ / Hũ</label>
                  </div>
               </div>
               <div>
                  <h4 className="font-bold mb-4 text-vinex-black text-[15px]">Mục đích</h4>
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Bán lẻ</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Đóng bộ quà</label>
                  </div>
               </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             {/* Tabs */}
             <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
                <button className="px-4 py-2 md:px-5 md:py-2.5 bg-vinex-teal text-white rounded-sm font-bold text-[10px] md:text-xs uppercase tracking-wider">Tất cả</button>
                <button className="px-4 py-2 md:px-5 md:py-2.5 bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-sm font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors">Hạt điều</button>
                <button className="px-4 py-2 md:px-5 md:py-2.5 bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-sm font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors">Trà & cà phê</button>
                <button className="px-4 py-2 md:px-5 md:py-2.5 bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-sm font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors">Bánh & kẹo</button>
                <button className="px-4 py-2 md:px-5 md:py-2.5 bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-sm font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors">Nông sản chế biến</button>
             </div>

             {/* Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                   <Link href={`/vi/san-pham/${product.slug}`} key={product.id} className="group flex flex-col bg-white rounded-sm border border-[#E8E4D9] overflow-hidden hover:shadow-xl hover:border-vinex-teal/30 transition-all duration-300">
                      <div className="relative aspect-square bg-gray-100 flex items-center justify-center p-6">
                         {/* Badge */}
                         <div className="absolute top-4 left-4 z-10 bg-vinex-teal text-vinex-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm rounded-sm">
                            {product.status}
                         </div>
                         {/* Product Image */}
                         {product.img ? (
                           <div className="absolute inset-0 w-full h-full">
                              <Image src={product.img} alt={product.name} fill className="object-cover" />
                           </div>
                         ) : (
                           <div className="w-full h-full bg-gray-200/50 flex flex-col items-center justify-center text-gray-400">
                              <span className="font-bold uppercase tracking-widest text-xs mb-2">{product.name}</span>
                              <span className="text-[10px]">CMS Image Content</span>
                           </div>
                         )}
                      </div>
                      <div className="p-6 flex flex-col flex-1 bg-white">
                         <span className="text-[10px] font-bold text-vinex-teal uppercase tracking-widest mb-3">{product.category}</span>
                         <h3 className="font-marcellus text-2xl mb-3 text-vinex-black group-hover:text-vinex-teal transition-colors">{product.name}</h3>
                         <p className="text-sm text-gray-600 mb-0 flex-1 font-light leading-relaxed">{product.desc}</p>
                      </div>
                   </Link>
                ))}
             </div>
          </div>

        </section>

      </main>
    </SmoothScroll>
  );
}
