import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScrollReveal } from "@/components/layout/ScrollReveal";

export const ProductCategories = () => {
  return (
    <section id="san-pham" className="py-24 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-vinex-yellow font-bold text-sm tracking-widest uppercase block mb-4">Đang phát triển</span>
          <h2 className="text-3xl font-bold text-vinex-black mb-6">Từ nhân điều đến những trải nghiệm hương vị mới</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Các dòng rang và tẩm vị mở rộng cách thưởng thức hạt điều cho bán lẻ, phân phối và quà tặng.
          </p>
        </div>
        
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
          <Link href="/vi/san-pham" className="bg-vinex-white/50 rounded-lg p-6 text-center border border-gray-50 flex flex-col items-center group overflow-hidden block cursor-pointer">
            <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/product/hat_orchard_nút/p1.png')" }}></div>
            </div>
            <h3 className="font-bold text-vinex-black mb-2">Hạt & sản phẩm từ hạt</h3>
            <span className="text-vinex-blue text-sm font-medium group-hover:underline">Xem danh mục -&gt;</span>
          </Link>
          {/* Card 2 */}
          <Link href="/vi/san-pham" className="bg-vinex-white/50 rounded-lg p-6 text-center border border-gray-50 flex flex-col items-center group overflow-hidden block cursor-pointer">
            <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/product/tra_premium_essiora_tea/p1.png')" }}></div>
            </div>
            <h3 className="font-bold text-vinex-black mb-2">Trà & cà phê</h3>
            <span className="text-vinex-blue text-sm font-medium group-hover:underline">Xem danh mục -&gt;</span>
          </Link>
          {/* Card 3 */}
          <Link href="/vi/san-pham" className="bg-vinex-white/50 rounded-lg p-6 text-center border border-gray-50 flex flex-col items-center group overflow-hidden block cursor-pointer">
            <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/product/banh_premium_petite_deights/p1.png')" }}></div>
            </div>
            <h3 className="font-bold text-vinex-black mb-2">Bánh & kẹo</h3>
            <span className="text-vinex-blue text-sm font-medium group-hover:underline">Xem danh mục -&gt;</span>
          </Link>
          {/* Card 4 */}
          <Link href="/vi/san-pham" className="bg-vinex-white/50 rounded-lg p-6 text-center border border-gray-50 flex flex-col items-center group overflow-hidden block cursor-pointer">
            <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/product/mut_golden_grove/p1.jpg')" }}></div>
            </div>
            <h3 className="font-bold text-vinex-black mb-2">Nông sản chế biến</h3>
            <span className="text-vinex-blue text-sm font-medium group-hover:underline">Xem danh mục -&gt;</span>
          </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
