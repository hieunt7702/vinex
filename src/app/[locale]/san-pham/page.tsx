import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Sản phẩm hạt điều và nông sản Việt | VINEX",
  description: "Khám phá hạt điều tẩm vị, trà, cà phê, bánh, kẹo, trái cây sấy và sản phẩm nông sản VINEX đang phát triển.",
};

// Dữ liệu mẫu (sẽ được thay thế bằng CMS sau)
const DUMMY_PRODUCTS = [
  { id: 1, slug: 'orchard-nuts', name: 'Orchard Nuts', category: 'Hạt điều tẩm vị', status: 'Đang phát triển', desc: 'Các dòng rang và tẩm vị mở rộng cách thưởng thức hạt điều cho bán lẻ, phân phối và quà tặng.', img: '' },
  { id: 2, slug: 'tra-ca-phe', name: 'Trà & cà phê', category: 'Nông sản Việt', status: 'Đang phát triển', desc: 'Bộ sưu tập trà và cà phê nguyên bản, đậm đà hương vị bản địa.', img: '' },
  { id: 3, slug: 'banh-keo', name: 'Bánh & kẹo', category: 'Nông sản Việt', status: 'Đang phát triển', desc: 'Bánh premium và kẹo trái cây hương vị tự nhiên, phù hợp làm quà tặng.', img: '' },
  { id: 4, slug: 'nong-san-che-bien', name: 'Nông sản chế biến', category: 'Nông sản Việt', status: 'Đang phát triển', desc: 'Mứt trái cây nhiệt đới, trái cây sấy và nông sản sấy đặc sản.', img: '' },
];

export default function ProductsPage() {
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-[#FAF8F2] text-vinex-black pt-[90px]">
        
        {/* Header Section */}
        <section className="px-4 pt-20 pb-12 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-marcellus text-vinex-teal mb-6">Sản phẩm từ hạt điều <br className="hidden sm:block" /> và nông sản Việt</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
             Danh mục sản phẩm đa dạng đang được VINEX nghiên cứu và phát triển để đáp ứng nhu cầu thị trường.
          </p>
        </section>

        {/* Filters and Product List */}
        <section className="px-4 pb-24 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-[240px] shrink-0">
            <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-vinex-teal">Bộ lọc</h3>
            <div className="space-y-8">
               <div>
                  <h4 className="font-bold mb-4 text-vinex-black text-[15px]">Nhóm sản phẩm</h4>
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Hạt điều và sản phẩm từ hạt</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Trà, thảo mộc, cà phê</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Bánh, bánh quy, kẹo</label>
                     <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-vinex-teal transition-colors"><input type="checkbox" className="accent-vinex-teal w-4 h-4" /> Trái cây sấy, mận sấy</label>
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
                {DUMMY_PRODUCTS.map(product => (
                   <Link href={`/vi/san-pham/${product.slug}`} key={product.id} className="group flex flex-col bg-white rounded-sm border border-[#E8E4D9] overflow-hidden hover:shadow-xl hover:border-vinex-teal/30 transition-all duration-300">
                      <div className="relative aspect-[4/5] bg-gray-100 flex items-center justify-center p-6">
                         {/* Badge */}
                         <div className="absolute top-4 left-4 z-10 bg-vinex-teal text-vinex-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm rounded-sm">
                            {product.status}
                         </div>
                         {/* Image placeholder for dummy data */}
                         <div className="w-full h-full bg-gray-200/50 flex flex-col items-center justify-center text-gray-400">
                            <span className="font-bold uppercase tracking-widest text-xs mb-2">{product.name}</span>
                            <span className="text-[10px]">CMS Image Content</span>
                         </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1 bg-white">
                         <span className="text-[10px] font-bold text-vinex-teal uppercase tracking-widest mb-3">{product.category}</span>
                         <h3 className="font-marcellus text-2xl mb-3 text-vinex-black group-hover:text-vinex-teal transition-colors">{product.name}</h3>
                         <p className="text-sm text-gray-600 mb-8 flex-1 font-light leading-relaxed">{product.desc}</p>
                         <div className="w-full text-center py-4 bg-[#FAF8F2] text-vinex-teal font-bold text-xs uppercase tracking-widest hover:bg-vinex-teal hover:text-vinex-gold transition-colors">
                            Xem danh mục
                         </div>
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
