import Link from 'next/link';
import { GlassCard } from "@/components/ui/glass";

export const ProductCategories = () => {
  const categories = [
    { title: "Hạt & sản phẩm từ hạt", image: "/images/product/hat_orchard_nút/p1.png", href: "/vi/san-pham" },
    { title: "Trà & cà phê", image: "/images/product/tra_premium_essiora_tea/p1.png", href: "/vi/san-pham" },
    { title: "Bánh & kẹo", image: "/images/product/banh_premium_petite_deights/p1.png", href: "/vi/san-pham" },
    { title: "Nông sản chế biến", image: "/images/product/mut_golden_grove/p1.jpg", href: "/vi/san-pham" },
  ];

  return (
    <section id="san-pham" className="py-24 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-vinex-gold font-semibold text-sm tracking-widest uppercase block mb-4">Đang phát triển</span>
          <h2 className="text-3xl font-semibold text-vinex-black mb-6">Từ nhân điều đến những trải nghiệm hương vị mới</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light">
            Các dòng rang và tẩm vị mở rộng cách thưởng thức hạt điều cho bán lẻ, phân phối và quà tặng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href} className="block group">
              <GlassCard variant="interactive" className="p-6 text-center flex flex-col items-center">
                <div className="w-full h-48 bg-gray-100 rounded-[18px] mb-4 flex items-center justify-center overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />
                </div>
                <h3 className="font-semibold text-vinex-black mb-2 group-hover:text-vinex-teal transition-colors">{cat.title}</h3>
                <span className="text-vinex-teal text-sm font-medium">Xem danh mục &rarr;</span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
