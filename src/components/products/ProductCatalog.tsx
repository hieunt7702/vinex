"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductFilterDrawer } from '@/components/products/ProductFilterDrawer';
import { Checkbox } from '@/components/ui/Checkbox';

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
      // Add package/purpose filtering here if data gets updated in the future
      return true;
    });
  }, [initialProducts, searchQuery, selectedCategories, selectedStatuses]);

  const categoriesList = ["Hạt & sản phẩm từ hạt", "Trà & cà phê", "Bánh & kẹo", "Nông sản chế biến", "Quà tặng"];
  const statusesList = ["Đang phát triển", "Sẵn sàng cung ứng", "Phát triển theo yêu cầu"];
  const packagesList = ["Hộp giấy cao cấp", "Túi zip / Bao bì mềm", "Lọ / Hũ"];
  const purposesList = ["Bán lẻ", "Đóng bộ quà"];

  return (
    <section className="px-4 md:px-8 xl:px-12 pb-16 lg:pb-20 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Sidebar Filters */}
      <ProductFilterDrawer 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        onClear={clearFilters}
      >
        <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-vinex-teal hidden lg:block">Bộ lọc</h3>
        <div className="space-y-8">
           <div>
              <h4 className="font-bold mb-4 text-vinex-black text-[15px]">Nhóm sản phẩm</h4>
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
              <h4 className="font-bold mb-4 text-vinex-black text-[15px]">Trạng thái</h4>
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
              <h4 className="font-bold mb-4 text-vinex-black text-[15px]">Hình thức bao bì</h4>
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
              <h4 className="font-bold mb-4 text-vinex-black text-[15px]">Mục đích</h4>
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
         <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
            <button 
              onClick={() => setSelectedCategories([])}
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-sm font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors border ${activeTab === 'Tất cả' ? 'bg-vinex-teal text-white border-transparent' : 'bg-white text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-200'}`}
            >
              Tất cả
            </button>
            {categoriesList.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategories([cat])}
                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-sm font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors border ${activeTab === cat ? 'bg-vinex-teal text-white border-transparent' : 'bg-white text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-200'}`}
              >
                {cat}
              </button>
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
         )}
      </div>
    </section>
  );
}
