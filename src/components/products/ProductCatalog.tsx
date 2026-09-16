"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductFilterDrawer } from '@/components/products/ProductFilterDrawer';
import { Checkbox } from '@/components/ui/Checkbox';
import { GlassCard, GlassButton, Glass } from '@/components/ui/glass';

export function ProductCatalog({ initialProducts }: { initialProducts: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  // optional future filters
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);

  // Derived state
  const activeTab = selectedCategories.length === 1 ? selectedCategories[0] : (selectedCategories.length === 0 ? "Tất cả" : "");

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };
  const handleToggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSelectedPackages([]);
    setSelectedPurposes([]);
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(p.status)) return false;
      return true;
    });
  }, [initialProducts, searchQuery, selectedCategories, selectedStatuses]);

  const categoriesList = ["Hạt & sản phẩm từ hạt", "Trà & cà phê", "Bánh & kẹo", "Nông sản chế biến", "Quà tặng"];
  const statusesList = ["Đang phát triển", "Sẵn sàng cung ứng", "Phát triển theo yêu cầu"];
  const packagesList = ["Hộp giấy cao cấp", "Túi zip / Bao bì mềm", "Lọ / Hũ"];
  const purposesList = ["Bán lẻ", "Đóng bộ quà"];

  return (
    <section className="px-4 md:px-8 xl:px-12 pb-16 lg:pb-20 max-w-[1536px] mx-auto flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
      {/* Sidebar Filters */}
      <ProductFilterDrawer
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClear={clearFilters}
      >
        <h3 className="text-sm mb-6 uppercase tracking-widest text-vinex-teal hidden lg:block font-semibold">Bộ lọc</h3>
        <div className="space-y-8">
          <div>
            <h4 className="font-semibold mb-4 text-vinex-black text-[15px]">Nhóm sản phẩm</h4>
            <div className="space-y-3">
              {categoriesList.map(cat => (
                <Checkbox
                  key={cat}
                  label={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleToggleCategory(cat)}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-vinex-black text-[15px]">Trạng thái</h4>
            <div className="space-y-3">
              {statusesList.map(status => (
                <Checkbox
                  key={status}
                  label={status}
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleToggleStatus(status)}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-vinex-black text-[15px]">Hình thức bao bì</h4>
            <div className="space-y-3">
              {packagesList.map(pkg => (
                <Checkbox
                  key={pkg}
                  label={pkg}
                  checked={selectedPackages.includes(pkg)}
                  onChange={() => setSelectedPackages(prev => prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg])}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-vinex-black text-[15px]">Mục đích</h4>
            <div className="space-y-3">
              {purposesList.map(purp => (
                <Checkbox
                  key={purp}
                  label={purp}
                  checked={selectedPurposes.includes(purp)}
                  onChange={() => setSelectedPurposes(prev => prev.includes(purp) ? prev.filter(p => p !== purp) : [...prev, purp])}
                />
              ))}
            </div>
          </div>
        </div>
      </ProductFilterDrawer>

      {/* Product Grid */}
      <div className="flex-1">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-8 border-b border-gray-200 pb-4">
          <GlassButton
            size="sm"
            variant={activeTab === 'Tất cả' ? 'primary' : 'ghost'}
            onClick={() => setSelectedCategories([])}
          >
            Tất cả
          </GlassButton>
          {categoriesList.map(cat => (
            <GlassButton
              key={cat}
              size="sm"
              variant={activeTab === cat ? 'primary' : 'ghost'}
              onClick={() => setSelectedCategories([cat])}
            >
              {cat}
            </GlassButton>
          ))}
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <Link href={`/vi/san-pham/${product.slug}`} key={product.id} className="block h-full group hover:-translate-y-1.5 transition-all duration-400">
                <GlassCard
                  radius={24}
                  className="h-full flex flex-col overflow-hidden border border-white/45 shadow-[0_16px_40px_rgba(7,71,81,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.7)]"
                  contentClassName="flex flex-col h-full bg-white/40 hover:bg-white/50 transition-colors duration-400"
                >
                  <div className="relative aspect-square bg-[#eef3ef] flex items-center justify-center p-6 overflow-hidden">
                    {/* Background Mesh Gradient if no image */}
                    {!product.img && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#074751] via-[#10626f] to-[#5C7B6C] opacity-90 transition-transform duration-700 ease-out group-hover:scale-105" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl group-hover:bg-white/20 transition-all duration-700 shadow-2xl" />
                      </>
                    )}

                    {/* Specular sheen reflection */}
                    <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="backdrop-blur-md bg-white/70 border border-white/80 text-[#074751] text-[10px] font-semibold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-vinex-teal animate-pulse"></span>
                        {product.status}
                      </div>
                    </div>

                    {/* Product Image */}
                    {product.img ? (
                      <div className="absolute inset-0 w-full h-full z-10">
                        <Image src={product.img} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white/80 text-center">
                        <span className="font-semibold uppercase tracking-widest text-xs mb-2 text-white">{product.name}</span>
                        <span className="text-[10px] opacity-70">Coming soon</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 relative z-20">
                    <span className="text-[10px] font-semibold text-[#074751]/70 uppercase tracking-widest mb-2.5">{product.category}</span>
                    <h3 className="text-xl lg:text-2xl mb-3 text-[#074751] group-hover:text-[#F2B719] transition-colors duration-300 font-semibold">{product.name}</h3>
                    <p className="text-[13px] text-[#074751]/80 mb-0 flex-1 font-light leading-relaxed">{product.desc}</p>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
