"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";
import { GlassCard } from "@/components/ui/glass";
import { getApiUrl } from "@/lib/apiConfig";
import { normalizeImageUrl } from "@/lib/imageUtils";

export const FlavoredCashewsHome: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  
  const title = "Hạt điều tẩm vị";
  const desc = "Khám phá các dòng hạt điều tẩm vị trong danh mục VINEX. Hình ảnh giới thiệu các lựa chọn sản phẩm và bao bì cho nhu cầu thưởng thức hoặc kết hợp trong bộ quà.";
  const cta = "Xem sản phẩm hạt điều";

  // Dynamic products from API or fallback with real authentic slugs
  const [items, setItems] = React.useState<any[]>([
    { id: 1, img: '/images/product/Cashew2.png', name: 'Hạt điều tẩm vị phô mai hũ 150g', slug: 'hat-dieu-tam-vi-phomai-hu-150g' },
    { id: 2, img: '/images/product/Cashew1.png', name: 'Hạt điều tẩm vị phô mai hũ 100g', slug: 'hat-dieu-tam-vi-phomai-hu-100g' },
    { id: 3, img: '/images/product/Orchard nuts 1.png', name: 'Hạt điều vị trứng muối', slug: 'hat-dieu-vi-trung-muoi' },
    { id: 4, img: '/images/product/Orchard nuts 2.png', name: 'Hạt điều vị Tứ Xuyên', slug: 'hat-dieu-vi-tu-xuyen' },
    { id: 5, img: '/images/product/Orchard nuts 3.png', name: 'Hạt điều vị Tomyum', slug: 'hat-dieu-vi-tomyum' },
    { id: 6, img: '/value1.png', name: 'Hạt điều rang củi Bình Phước W240', slug: 'hat-dieu-rang-cui-binh-phuoc-w240' },
  ]);

  React.useEffect(() => {
    async function fetchCashews() {
      try {
        const res = await fetch(getApiUrl('/products'), { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        const active = list.filter((p: any) => p.status === 'ACTIVE' || !p.status || p.status === 'active' || p.status === 'Sẵn sàng cung ứng');
        const cashews = active.filter((p: any) => 
          (p.categories?.[0]?.name || p.category || p.name || '').toLowerCase().includes('điều') ||
          (p.name || '').toLowerCase().includes('điều')
        );
        const displayList = (cashews.length > 0 ? cashews : active).slice(0, 6);
        if (displayList.length > 0) {
          setItems(displayList.map((p: any, idx: number) => ({
            id: p.id || idx,
            name: p.name,
            slug: p.slug,
            img: normalizeImageUrl(p.images || p.img, `/images/product/Cashew${(idx % 6) + 1}.png`)
          })));
        }
      } catch (e) {
        console.warn('Could not fetch cashews for homepage:', e);
      }
    }
    fetchCashews();

    const handleSync = () => fetchCashews();
    window.addEventListener('vinex_products_updated', handleSync);
    return () => window.removeEventListener('vinex_products_updated', handleSync);
  }, []);

  return (
    <section className="py-16 sm:py-20 lg:py-24  relative overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10">
        
        <div className="text-center mb-12 max-w-[800px] mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            <span className="font-marcellus uppercase text-vinex-teal text-[13px]">
              HẠT ĐIỀU TẨM VỊ
            </span>
            <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
          </div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] text-[#074751] uppercase tracking-tight leading-[1.2] mb-6 font-semibold">
            {title}
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#2b5963] leading-relaxed mx-auto max-w-[600px]">
            {desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 max-w-[1000px] mx-auto">
          {items.map((item) => {
            const content = (
              <div
                className="w-full aspect-square rounded-[20px] overflow-hidden relative shadow-[0_12px_30px_rgba(7,71,81,0.08)] hover:-translate-y-2 transition-transform duration-500 group cursor-pointer border border-white/60 bg-white/40"
              >
                <Image 
                  src={normalizeImageUrl(item.img, '/images/product/Cashew1.png')} 
                  alt={item.name} 
                  fill 
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#074751]/80 via-[#074751]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <span className="text-white text-xs font-semibold drop-shadow-sm line-clamp-1">{item.name}</span>
                </div>
              </div>
            );

            return item.slug ? (
              <Link key={item.id} href={`/${lang}/san-pham/${item.slug}`}>
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link
            href={`/${lang}/san-pham?category=hat-dieu`}
            className="group inline-flex flex-col items-center gap-1.5 text-[14px] font-bold text-[#074751] hover:text-[#0a5c68] transition-colors mt-2"
          >
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wide">{cta}</span>
              <ArrowRight className="w-[18px] h-[18px] text-vinex-gold transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            <div className="w-[60px] h-[2px] bg-vinex-gold/50 group-hover:w-[120px] group-hover:bg-vinex-gold transition-all duration-500"></div>
          </Link>
        </div>

      </div>
    </section>
  );
};
