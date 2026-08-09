import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Sản phẩm hạt điều và nông sản Việt | VINEX",
  description: "Khám phá hạt điều tẩm vị, trà, cà phê, bánh, kẹo, trái cây sấy và sản phẩm nông sản VINEX đang phát triển.",
};

// Dummy data to render the layout
const DUMMY_PRODUCTS = [
  { id: 1, slug: 'orchard-nuts', name: 'Hạt Orchard Nút', category: 'Hạt điều', status: 'Sẵn sàng cung ứng', desc: 'Hạt điều tẩm vị đa dạng', img: '/images/product/hat_orchard_nút/p1.png' },
  { id: 2, slug: 'hat-dieu-lo-sieu-thi', name: 'Hạt điều lọ siêu thị', category: 'Hạt điều', status: 'Đang phát triển', desc: 'Hạt điều đóng lọ tiện dụng', img: '/images/product/bao_bi_hat_dieu_lo_sieu_thi/p1.png' },
  { id: 3, slug: 'cafe-nguyen-hat', name: 'Cà phê nguyên hạt', category: 'Trà & cà phê', status: 'Sẵn sàng cung ứng', desc: 'Cà phê Robusta Honey 1kg', img: '/images/product/cafe_nguyen_hat_500g&1kg/cafe_nguyen_hat_honey_robussta_1kg.png' },
  { id: 4, slug: 'cafe-hoa-tan', name: 'Cà phê hòa tan', category: 'Trà & cà phê', status: 'Đang phát triển', desc: 'Cà phê sữa đá, cà phê nâu', img: '/images/product/cafe_goi_hoa_tan_20x17g/cafe_nau.png' },
  { id: 5, slug: 'tra-essiora', name: 'Trà Premium Essiora', category: 'Trà & cà phê', status: 'Đang phát triển', desc: 'Trà cao cấp Essiora', img: '/images/product/tra_premium_essiora_tea/p1.png' },
  { id: 6, slug: 'tra-florish', name: 'Trà Mid-tier Florish', category: 'Trà & cà phê', status: 'Đang phát triển', desc: 'Trà hương hoa tự nhiên', img: '/images/product/tra_midtier_florish_tea/p1.png' },
  { id: 7, slug: 'banh-premium', name: 'Bánh Premium Petite', category: 'Bánh & kẹo', status: 'Đang phát triển', desc: 'Bánh premium quy cách hộp', img: '/images/product/banh_premium_petite_deights/p1.png' },
  { id: 8, slug: 'banh-crunchies', name: 'Bánh Mid Crunchies', category: 'Bánh & kẹo', status: 'Đang phát triển', desc: 'Bánh quy giòn tan', img: '/images/product/banh_mid_crunchies/p1.png' },
  { id: 9, slug: 'keo-delicia', name: 'Kẹo Delicia Sweets', category: 'Bánh & kẹo', status: 'Đang phát triển', desc: 'Kẹo ngọt hương vị tự nhiên', img: '/images/product/keo_delicia_sweets/p1.png' },
  { id: 10, slug: 'mut-golden-grove', name: 'Mứt Golden Grove', category: 'Nông sản chế biến', status: 'Đang phát triển', desc: 'Mứt trái cây nhiệt đới', img: '/images/product/mut_golden_grove/p1.jpg' },
  { id: 11, slug: 'khay-duong', name: 'Khay đường tiện lợi', category: 'Nông sản chế biến', status: 'Đang phát triển', desc: 'Khay đường và phụ kiện', img: '/images/product/layout_khay_duong/p1.png' },
];

export default function ProductsPage() {
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen bg-vinex-white text-vinex-black pt-20">
        
        {/* Header Section */}
        <section className="px-4 py-16 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sản phẩm từ hạt điều và nông sản Việt</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             Danh mục sản phẩm đa dạng đang được VINEX nghiên cứu và phát triển để đáp ứng nhu cầu thị trường.
          </p>
        </section>

        {/* Filters and Product List */}
        <section className="px-4 pb-24 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Bộ lọc</h3>
            <div className="space-y-8">
               <div>
                  <h4 className="font-bold mb-3 text-vinex-blue">Nhóm sản phẩm</h4>
                  <div className="space-y-2">
                     <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="accent-vinex-yellow" /> Hạt điều</label>
                     <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="accent-vinex-yellow" /> Trà & cà phê</label>
                     <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="accent-vinex-yellow" /> Bánh & kẹo</label>
                     <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="accent-vinex-yellow" /> Nông sản</label>
                  </div>
               </div>
               <div>
                  <h4 className="font-bold mb-3 text-vinex-blue">Trạng thái</h4>
                  <div className="space-y-2">
                     <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="accent-vinex-yellow" /> Đang phát triển</label>
                     <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="accent-vinex-yellow" /> Sẵn sàng cung ứng</label>
                  </div>
               </div>
               <div>
                  <h4 className="font-bold mb-3 text-vinex-blue">Bao bì</h4>
                  <div className="space-y-2">
                     <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="accent-vinex-yellow" /> Hộp giấy</label>
                     <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="accent-vinex-yellow" /> Túi zip</label>
                     <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="accent-vinex-yellow" /> Lọ</label>
                  </div>
               </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             {/* Tabs */}
             <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200 pb-4">
                <button className="px-4 py-2 bg-vinex-blue text-white rounded font-bold text-sm">Tất cả</button>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded font-bold text-sm transition-colors">Hạt điều</button>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded font-bold text-sm transition-colors">Trà & cà phê</button>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded font-bold text-sm transition-colors">Bánh & kẹo</button>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded font-bold text-sm transition-colors">Nông sản chế biến</button>
             </div>

             {/* Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {DUMMY_PRODUCTS.map(product => (
                   <Link href={`/vi/san-pham/${product.slug}`} key={product.id} className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                      <div className="relative aspect-[4/3] bg-gray-100">
                         {/* Badge */}
                         <div className="absolute top-4 left-4 z-10 bg-vinex-blue text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded shadow-sm">
                            {product.status}
                         </div>
                         {/* Image */}
                         {product.img && (
                           <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${product.img})` }}></div>
                         )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{product.category}</span>
                         <h3 className="font-bold text-xl mb-2 group-hover:text-vinex-blue transition-colors">{product.name}</h3>
                         <p className="text-sm text-gray-600 mb-6 flex-1">{product.desc}</p>
                         <div className="w-full text-center py-3 bg-vinex-yellow/10 text-vinex-black font-bold text-sm rounded group-hover:bg-vinex-yellow transition-colors">
                            Xem chi tiết
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
