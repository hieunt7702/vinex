"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Search, 
  MessageSquare, 
  Gift, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';
import type { PublicProduct } from '@/lib/dataService';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface ProductDetailViewProps {
  product: PublicProduct;
  relatedProducts: PublicProduct[];
  lang: string;
}

export function ProductDetailView({ product, relatedProducts, lang }: ProductDetailViewProps) {
  // Gallery images setup (dynamic from admin, fallback to multiple related angles)
  const rawImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.img];
  const dynamicImages = rawImages.map(img => normalizeImageUrl(img, '/images/placeholder.jpg')).filter(Boolean);
  const galleryImages = Array.from(new Set([
    ...dynamicImages,
    ...(product.attributes?.find(a => a.name === 'Hình ảnh phụ')?.value ? [normalizeImageUrl(product.attributes.find(a => a.name === 'Hình ảnh phụ')!.value)] : []),
    '/images/product/Orchard nuts 1.png',
    '/images/product/Orchard nuts 2.png',
  ].filter(Boolean))).slice(0, 4);

  const [activeImage, setActiveImage] = useState<string>(dynamicImages[0] || product.img || galleryImages[0]);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'storage'>('desc');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Specifications
  const defaultSpecs = [
    { name: 'Quy cách', value: product.attributes?.find(a => a.name === 'Quy cách')?.value || 'Hũ nắp nhôm / Hộp quà sang trọng' },
    { name: 'Độ rang / Chế biến', value: product.attributes?.find(a => a.name === 'Độ rang')?.value || 'Rang vừa (Medium Roast) / Sấy thăng hoa' },
    { name: 'Xuất xứ nguyên liệu', value: 'Bình Phước & Vùng trồng tuyển chọn VINEX' },
    { name: 'Tiêu chuẩn chất lượng', value: 'HACCP, ISO 22000, OCOP tiêu chuẩn xuất khẩu' },
    { name: 'Hạn sử dụng', value: '12 tháng kể từ ngày sản xuất' },
  ];

  const displayPrice = product.price ? product.price : 98000;
  const originalPrice = product.promotionalPrice && product.promotionalPrice < displayPrice 
    ? displayPrice 
    : Math.round(displayPrice * 1.15);
  const finalPrice = product.promotionalPrice && product.promotionalPrice > 0 
    ? product.promotionalPrice 
    : displayPrice;

  return (
    <div className="w-full relative z-10">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 mb-8 w-full">
        <nav className="flex items-center gap-2 text-[12.5px] font-medium text-gray-500">
          <Link href={`/${lang}`} className="hover:text-[#074751] transition-colors">
            {lang === 'en' ? 'Home' : 'Trang chủ'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href={`/${lang}/san-pham`} className="hover:text-[#074751] transition-colors">
            {lang === 'en' ? 'Products' : 'Sản phẩm'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#074751] font-semibold line-clamp-1">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Showcase Section */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 mb-16 w-full">
        <div className="flex flex-col lg:flex-row items-start gap-12 xl:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-[48%] flex flex-col gap-4">
            
            {/* Main Stage Image */}
            <div className="rounded-[20px] backdrop-blur(24px) saturate(140%) bg-white/70 border border-white/80 shadow-[0_16px_40px_rgba(7,71,81,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.75)] p-3.5 relative overflow-hidden group">
              <div className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-[#074751]/5 border border-white/60">
                <Image
                  src={normalizeImageUrl(activeImage, '/images/placeholder.jpg')}
                  alt={product.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover transition-all duration-500 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Magnifier Action Button */}
                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-white/90 shadow-md flex items-center justify-center text-[#074751] hover:scale-110 transition-transform cursor-pointer"
                  aria-label="Phóng to ảnh"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3.5 overflow-x-auto pb-1">
              {galleryImages.map((imgUrl, idx) => {
                const isSelected = activeImage === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImage(imgUrl);
                      setIsZoomed(false);
                    }}
                    className={`relative w-20 sm:w-24 aspect-square rounded-[14px] overflow-hidden p-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#074751] shadow-md ring-2 ring-[#074751]/20 scale-102 bg-white"
                        : "border border-white/80 bg-white/60 opacity-70 hover:opacity-100 hover:border-[#074751]/50"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-[10px] overflow-hidden">
                      <Image
                        src={normalizeImageUrl(imgUrl, '/images/placeholder.jpg')}
                        alt={`${product.name} angle ${idx + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Product Information & CTAs */}
          <div className="w-full lg:w-[52%] flex flex-col justify-start">
            
            {/* Category Pill Tag */}
            <div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-[11px] font-semibold uppercase tracking-wider mb-3">
                {product.category || 'NÔNG SẢN VIỆT'}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-[28px] sm:text-[36px] lg:text-[40px] font-marcellus text-[#074751] font-semibold leading-[1.2] mb-3">
              {product.name}
            </h1>

            {/* Product Summary */}
            <p className="text-[15px] sm:text-[16px] text-gray-600 font-light leading-relaxed mb-6">
              {product.desc || 'Hương vị đậm đà, giữ trọn nét đặc trưng của nông sản thượng hạng VINEX.'}
            </p>

            {/* Price Block */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-[28px] sm:text-[34px] font-bold text-[#074751]">
                  {finalPrice.toLocaleString('vi-VN')} đ
                </span>
                {originalPrice > finalPrice && (
                  <span className="text-[16px] text-gray-400 line-through font-normal">
                    {originalPrice.toLocaleString('vi-VN')} đ
                  </span>
                )}
              </div>
              <span className="text-[12px] text-gray-400 mt-1 block">
                {lang === 'en' ? 'Reference price • Contact for official B2B quotation' : 'Giá tham khảo • Liên hệ để xác nhận báo giá'}
              </span>
            </div>

            {/* Divider Line */}
            <div className="w-full h-[1px] bg-gray-200/80 mb-6"></div>

            {/* Attributes / Specifications Table */}
            <div className="space-y-3 mb-8">
              {defaultSpecs.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 text-[14px]">
                  <span className="text-[#2b5963] font-semibold">{item.name}</span>
                  <span className="text-gray-600 text-right">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              
              {/* Primary: Yêu cầu báo giá */}
              <Link
                href={`/${lang}/${lang === 'en' ? 'contact' : 'lien-he'}?purpose=BUY_PRODUCT&product=${encodeURIComponent(product.name)}&productId=${product.id}&slug=${encodeURIComponent(product.slug)}`}
                className="w-full py-3.5 px-6 rounded-full bg-[#074751] hover:bg-[#0b545f] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(7,71,81,0.22)] transition-all duration-300 group cursor-pointer"
              >
                <span>{lang === 'en' ? 'Request Quotation' : 'Yêu cầu báo giá'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary: Tư vấn chọn sản phẩm */}
              <Link
                href={`/${lang}/${lang === 'en' ? 'contact' : 'lien-he'}?purpose=BUY_PRODUCT&product=${encodeURIComponent(product.name)}&productId=${product.id}&slug=${encodeURIComponent(product.slug)}`}
                className="w-full py-3.5 px-6 rounded-full bg-white/75 hover:bg-white backdrop-blur-md border border-[#074751]/30 hover:border-[#074751] text-[#074751] font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all duration-300 shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#074751]" />
                <span>{lang === 'en' ? 'Product Advisory' : 'Tư vấn chọn sản phẩm'}</span>
              </Link>

              {/* Sub-note */}
              <span className="text-[12px] text-gray-400 text-center mt-1 block">
                {lang === 'en' ? 'Available for retail, distributors and corporate gifting.' : 'Dành cho khách hàng cá nhân, đại lý và doanh nghiệp.'}
              </span>

              {/* Corporate Gift Linking */}
              <Link
                href={`/${lang}/qua-tang-doanh-nghiep`}
                className="mt-2 inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-[#074751] hover:text-vinex-gold transition-colors text-center group"
              >
                <Gift className="w-4 h-4 text-vinex-gold" />
                <span className="border-b border-[#074751]/30 group-hover:border-vinex-gold">
                  {lang === 'en' ? 'Combine in a Corporate Gift Box →' : 'Kết hợp trong bộ quà doanh nghiệp →'}
                </span>
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Tabbed Content Section: Mô tả, Thông tin, Bảo quản */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 mb-20 w-full">
        
        {/* Tab Headers */}
        <div className="flex items-center gap-8 border-b border-gray-200/80 mb-6 px-2">
          {[
            { id: 'desc', label: lang === 'en' ? 'Product Description' : 'Mô tả sản phẩm' },
            { id: 'specs', label: lang === 'en' ? 'Detailed Specs' : 'Thông tin sản phẩm' },
            { id: 'storage', label: lang === 'en' ? 'Storage Instructions' : 'Hướng dẫn bảo quản' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3.5 text-[14.5px] transition-all cursor-pointer relative ${
                  isActive
                    ? 'font-semibold text-[#074751]'
                    : 'text-gray-500 hover:text-[#074751] font-medium'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#074751] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        <div className="rounded-[20px] backdrop-blur(24px) saturate(140%) bg-white/75 border border-white/80 shadow-[0_16px_40px_rgba(7,71,81,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.75)] p-6 sm:p-8">
          {activeTab === 'desc' && (
            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
              <h3 className="text-[20px] font-semibold text-[#074751] mb-2 font-marcellus">
                Đậm đà hương vị nguyên bản từ nông sản Việt
              </h3>
              <p>
                Sản phẩm <strong className="text-[#074751]">{product.name}</strong> được tuyển chọn khắt khe từ vùng nguyên liệu trù phú của VINEX, nơi thổ nhưỡng và khí hậu hội tụ để mang lại phẩm cấp tốt nhất. Quy trình chế biến khép kín, hiện đại kết hợp bí quyết ủ vị gia truyền giữ trọn hàm lượng dinh dưỡng và hương vị tự nhiên đặc trưng.
              </p>
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} className="mt-4" />
              ) : (
                <p>
                  Sản phẩm thích hợp dùng làm món ăn nhẹ bổ dưỡng mỗi ngày, tiếp khách thanh lịch hoặc kết hợp cùng các set quà tri ân sang trọng dành cho đối tác và doanh nghiệp.
                </p>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultSpecs.map((spec, idx) => (
                <div key={idx} className="p-4 rounded-[14px] bg-white/60 border border-white/80 shadow-xs flex items-center justify-between">
                  <span className="text-[13.5px] font-semibold text-[#074751]">{spec.name}</span>
                  <span className="text-[13.5px] text-gray-600">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3 text-[14.5px] text-gray-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nơi có độ ẩm cao.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Đậy kín nắp hộp / hàn kín miệng túi sau mỗi lần sử dụng để giữ trọn độ giòn và hương thơm.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Nên dùng hết trong vòng 15 – 30 ngày sau khi mở nắp để thưởng thức vị ngon hoàn hảo nhất.</span>
              </div>
            </div>
          )}
        </div>

      </section>

      {/* "Các sản phẩm liên quan" (Related Products Section) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 pb-20 w-full">
          
          <div className="mb-8">
            <h2 className="text-[26px] sm:text-[32px] font-marcellus text-[#074751] font-semibold mb-2">
              {lang === 'en' ? 'Related Products' : 'Sản phẩm liên quan'}
            </h2>
            <div className="w-[50px] h-[2px] bg-vinex-gold mb-3"></div>
            <p className="text-[14px] text-gray-500 font-light">
              {lang === 'en' 
                ? 'Discover more exquisite flavors in the same collection.' 
                : 'Khám phá thêm các hương vị đặc sắc khác trong cùng bộ sưu tập.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((rel) => {
              const relHref = `/${lang}/san-pham/${rel.slug}`;

              return (
                <div
                  key={rel.id}
                  className="rounded-[20px] backdrop-blur(24px) saturate(140%) bg-white/70 border border-white/80 shadow-[0_16px_40px_rgba(7,71,81,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.75)] hover:shadow-[0_22px_45px_rgba(7,71,81,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group overflow-hidden"
                >
                  {/* Framed Image */}
                  <div className="p-3.5 pb-0">
                    <Link href={relHref} className="block relative aspect-[4/3] rounded-[16px] overflow-hidden bg-[#074751]/5 border border-white/60 group-hover:border-white transition-colors">
                      <Image
                        src={normalizeImageUrl(rel.img, '/images/placeholder.jpg')}
                        alt={rel.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 pt-4 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C7B6C] mb-1.5 block">
                        {rel.category || 'NÔNG SẢN VIỆT'}
                      </span>
                      <Link href={relHref} className="block group-hover:text-vinex-gold transition-colors">
                        <h3 className="text-[17px] font-semibold text-[#074751] line-clamp-1 mb-1 leading-snug">
                          {rel.name}
                        </h3>
                      </Link>
                      <p className="text-[13px] text-gray-500 line-clamp-1 mb-3.5 font-light">
                        {rel.desc}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-[12px] font-medium text-[#074751]/85 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span>{rel.status || 'Sẵn sàng cung ứng'}</span>
                      </div>

                      <Link
                        href={relHref}
                        className="w-full py-2.5 px-4 rounded-full border border-[#074751]/25 text-[#074751] font-semibold text-[13px] hover:bg-[#074751] hover:text-white hover:border-[#074751] transition-all duration-200 flex items-center justify-center gap-1.5 group-hover:border-[#074751] shadow-xs"
                      >
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </section>
      )}

    </div>
  );
}
