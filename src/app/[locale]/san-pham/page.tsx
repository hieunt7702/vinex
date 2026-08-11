import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Sản phẩm hạt điều và nông sản Việt | VINEX",
  description: "Khám phá hạt điều tẩm vị, trà, cà phê, bánh, kẹo, trái cây sấy và sản phẩm nông sản VINEX đang phát triển.",
};

// Dữ liệu mẫu (sẽ được thay thế bằng CMS sau)
const DUMMY_PRODUCTS = [
  {
    "id": 1,
    "slug": "bao-bi-hat-dieu-sieu-thi-1",
    "name": "Bao bi hat dieu sieu thi 1",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Bao bi hat dieu sieu thi 1.png"
  },
  {
    "id": 2,
    "slug": "bao-bi-hat-dieu-sieu-thi-2",
    "name": "Bao bi hat dieu sieu thi 2",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Bao bi hat dieu sieu thi 2.png"
  },
  {
    "id": 3,
    "slug": "bao-bi-hat-ieu-lo",
    "name": "Bao bì hạt điều lọ",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Bao bì hạt điều lọ.png"
  },
  {
    "id": 4,
    "slug": "ca-phe-goi-hoa-tan-1",
    "name": "ca phe goi hoa tan 1",
    "category": "Trà, thảo mộc, cà phê",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/ca phe goi hoa tan 1.png"
  },
  {
    "id": 5,
    "slug": "ca-phe-goi-hoa-tan-2",
    "name": "ca phe goi hoa tan 2",
    "category": "Trà, thảo mộc, cà phê",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/ca phe goi hoa tan 2.png"
  },
  {
    "id": 6,
    "slug": "ca-phe-goi-hoa-tan-3",
    "name": "ca phe goi hoa tan 3",
    "category": "Trà, thảo mộc, cà phê",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/ca phe goi hoa tan 3.png"
  },
  {
    "id": 7,
    "slug": "ca-phe-nguyen-hat-1",
    "name": "ca phe nguyen hat 1",
    "category": "Trà, thảo mộc, cà phê",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/ca phe nguyen hat 1.png"
  },
  {
    "id": 8,
    "slug": "ca-phe-nguyen-hat-2",
    "name": "ca phe nguyen hat 2",
    "category": "Trà, thảo mộc, cà phê",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/ca phe nguyen hat 2.png"
  },
  {
    "id": 9,
    "slug": "cashew1",
    "name": "Cashew1",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Cashew1.png"
  },
  {
    "id": 10,
    "slug": "cashew2",
    "name": "Cashew2",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Cashew2.png"
  },
  {
    "id": 11,
    "slug": "cashew3",
    "name": "Cashew3",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Cashew3.png"
  },
  {
    "id": 12,
    "slug": "cashew4",
    "name": "Cashew4",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Cashew4.png"
  },
  {
    "id": 13,
    "slug": "cashew5",
    "name": "Cashew5",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Cashew5.png"
  },
  {
    "id": 14,
    "slug": "cashew6",
    "name": "Cashew6",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Cashew6.png"
  },
  {
    "id": 15,
    "slug": "layout-khay-duong-1",
    "name": "Layout khay dưỡng 1",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Layout khay dưỡng 1.png"
  },
  {
    "id": 16,
    "slug": "layout-khay-duong-2",
    "name": "Layout khay dưỡng 2",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Layout khay dưỡng 2.png"
  },
  {
    "id": 17,
    "slug": "layout-khay-duong-4",
    "name": "Layout khay dưỡng 4",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Layout khay dưỡng 4.png"
  },
  {
    "id": 18,
    "slug": "layout-kjhay-duong-3",
    "name": "Layout kjhay dưỡng 3",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Layout kjhay dưỡng 3.png"
  },
  {
    "id": 19,
    "slug": "mid-crunchies1",
    "name": "Mid crunchies1",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Mid crunchies1.png"
  },
  {
    "id": 20,
    "slug": "mid-crunchies2",
    "name": "Mid crunchies2",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Mid crunchies2.png"
  },
  {
    "id": 21,
    "slug": "orchard-nuts-1",
    "name": "Orchard nuts 1",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Orchard nuts 1.png"
  },
  {
    "id": 22,
    "slug": "orchard-nuts-2",
    "name": "Orchard nuts 2",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Orchard nuts 2.png"
  },
  {
    "id": 23,
    "slug": "orchard-nuts-3",
    "name": "Orchard nuts 3",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Orchard nuts 3.png"
  },
  {
    "id": 24,
    "slug": "orchard-nuts-4",
    "name": "Orchard nuts 4",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Orchard nuts 4.png"
  },
  {
    "id": 25,
    "slug": "orchard-nuts-5",
    "name": "Orchard nuts 5",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Orchard nuts 5.png"
  },
  {
    "id": 26,
    "slug": "orchard-nuts-6",
    "name": "Orchard nuts 6",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Orchard nuts 6.png"
  },
  {
    "id": 27,
    "slug": "premium-petite-delights",
    "name": "Premium petite delights",
    "category": "Hạt điều và sản phẩm từ hạt",
    "status": "Sẵn sàng cung ứng",
    "desc": "Sản phẩm cao cấp từ VINEX.",
    "img": "/images/product/Premium petite delights.png"
  }
];

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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
             {pg.hero_desc}
          </p>
        </section>

        {/* Filters and Product List */}
        <section className="px-4 md:px-8 xl:px-12 pb-24 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-12">
          
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
