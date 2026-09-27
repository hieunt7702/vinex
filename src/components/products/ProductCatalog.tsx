"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { 
  LayoutGrid, 
  Leaf, 
  Coffee, 
  Candy, 
  Apple, 
  ChevronRight, 
  Search, 
  ArrowRight, 
  Gift, 
  ChevronDown,
  Sparkles,
  X,
  Check
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';

// Custom Botanical & Food Icons matching VINEX brand
const CashewIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3C7.5 3 4.2 6.5 4.2 11c0 3.8 2.2 7 5.5 8.8 2.3 1.2 5 1.2 7.3 0 3-1.6 4.8-4.5 4.8-8.8 0-4.5-3.5-8-9.8-8z" />
    <path d="M11 7c-2 0-3.5 1.5-3.5 3.5 0 1.8 1.2 3.2 2.8 3.8" />
  </svg>
);

const MushroomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3C7 3 3 6.8 3 11.5c0 1.2 1 1.8 2.5 1.8h13c1.5 0 2.5-.6 2.5-1.8C21 6.8 17 3 12 3z" />
    <path d="M10 13.3v6.7a2 2 0 0 0 4 0v-6.7" />
    <circle cx="8" cy="8.5" r="1" fill="currentColor" />
    <circle cx="15.5" cy="7.5" r="1.2" fill="currentColor" />
  </svg>
);

const CATEGORIES = [
  { id: "all", name: "Tất cả sản phẩm", key: "", icon: LayoutGrid },
  { id: "hat-dieu-tam-vi", name: "Hạt điều tẩm vị", key: "Hạt điều tẩm vị", icon: CashewIcon },
  { id: "tra-va-ca-phe", name: "Trà và cà phê", key: "Trà và cà phê", icon: Coffee },
  { id: "banh-keo", name: "Bánh kẹo", key: "Bánh kẹo", icon: Candy },
  { id: "nong-san-say", name: "Nông sản sấy", key: "Nông sản sấy", icon: Apple },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: Thấp đến cao' },
  { value: 'price-desc', label: 'Giá: Cao đến thấp' },
];

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('hạt điều') || lower.includes('cashew') || lower.includes('hạt')) return CashewIcon;
  if (lower.includes('trà') || lower.includes('tea') || lower.includes('thảo mộc')) return Leaf;
  if (lower.includes('cà phê') || lower.includes('coffee')) return Coffee;
  if (lower.includes('bánh') || lower.includes('kẹo') || lower.includes('granola')) return Candy;
  if (lower.includes('nấm') || lower.includes('mushroom')) return MushroomIcon;
  if (lower.includes('trái cây') || lower.includes('sấy') || lower.includes('fruit')) return Apple;
  if (lower.includes('quà') || lower.includes('gift') || lower.includes('set')) return Gift;
  return Sparkles;
}

export function ProductCatalog({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  const [products, setProducts] = useState<any[]>(initialProducts);
  const [categories, setCategories] = useState(CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // Real-time synchronization with Admin APIs
  useEffect(() => {
    let isSubscribed = true;

    async function fetchLiveCatalog() {
      try {
        const [resProds, resCats] = await Promise.all([
          fetch('/api/v1/products', { cache: 'no-store' }),
          fetch('/api/v1/categories', { cache: 'no-store' })
        ]);

        if (resProds.ok && isSubscribed) {
          const data = await resProds.json();
          const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
          if (list.length > 0) {
            const mapped = list
              .filter((p: any) => p.status === 'ACTIVE')
              .map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                category: p.categories?.[0]?.name || p.category || (typeof p.categoryName === 'string' ? p.categoryName : 'Nông sản VINEX'),
                status: 'Sẵn sàng cung ứng',
                desc: p.shortDescription || p.desc || '',
                img: (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.img || '/images/placeholder.jpg')),
                price: p.price,
                promotionalPrice: p.promotionalPrice,
                description: p.description,
                attributes: p.attributes || []
              }));
            setProducts(mapped);
          }
        }

        if (resCats.ok && isSubscribed) {
          const data = await resCats.json();
          const allCats = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
          const rootCats = allCats.filter((c: any) => (!c.type || c.type === 'Sản phẩm') && !c.parentId);
          const finalCats = rootCats.length > 0 ? rootCats : allCats.filter((c: any) => !c.type || c.type === 'Sản phẩm');
          if (finalCats.length > 0) {
            const dynamicTabs = [
              { id: 'all', name: 'Tất cả sản phẩm', key: '', icon: LayoutGrid },
              ...finalCats.map((c: any) => ({
                id: c.slug || `cat-${c.id}`,
                name: c.name,
                key: c.name,
                icon: getCategoryIcon(c.name)
              }))
            ];
            setCategories(dynamicTabs);
          }
        }
      } catch (err) {
        console.warn('Could not sync live catalog:', err);
      }
    }

    fetchLiveCatalog();

    const handleSync = () => {
      fetchLiveCatalog();
    };

    window.addEventListener('vinex_products_updated', handleSync);
    window.addEventListener('vinex_categories_updated', handleSync);

    return () => {
      isSubscribed = false;
      window.removeEventListener('vinex_products_updated', handleSync);
      window.removeEventListener('vinex_categories_updated', handleSync);
    };
  }, []);

  // Handle click outside to close custom sort dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Nổi bật';

  // Initialize filter from URL query param if present
  useEffect(() => {
    const catQuery = searchParams.get('category');
    if (catQuery) {
      const q = decodeURIComponent(catQuery).toLowerCase();
      if (q === 'hat-dieu' || q === 'hat-dieu-tam-vi' || q.includes('điều') || q.includes('dieu')) {
        setSelectedCategory('Hạt điều tẩm vị');
      } else if (q === 'tra-ca-phe' || q === 'tra-va-ca-phe' || q === 'tra' || q === 'ca-phe' || q.includes('trà') || q.includes('cà phê') || q.includes('tra') || q.includes('phe')) {
        setSelectedCategory('Trà và cà phê');
      } else if (q === 'banh-keo' || q.includes('bánh') || q.includes('kẹo') || q.includes('banh') || q.includes('keo')) {
        setSelectedCategory('Bánh kẹo');
      } else if (q === 'nong-san' || q === 'nong-san-say' || q.includes('sấy') || q.includes('say') || q.includes('nông sản') || q.includes('nong san')) {
        setSelectedCategory('Nông sản sấy');
      } else {
        const found = categories.find(c => c.id === catQuery || c.key.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
        if (found) setSelectedCategory(found.key);
      }
    }
  }, [searchParams, categories]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      // Category filter
      if (selectedCategory && p.category !== selectedCategory) {
        const selLower = selectedCategory.toLowerCase();
        const pCatLower = (p.category || '').toLowerCase();

        // Exact match or substring
        if (pCatLower.includes(selLower) || selLower.includes(pCatLower)) {
          // matched
        } else if (selLower.includes('điều') && pCatLower.includes('điều')) {
          // matched
        } else if ((selLower.includes('trà') || selLower.includes('cà phê')) &&
                   (pCatLower.includes('trà') || pCatLower.includes('cà phê') || pCatLower.includes('tea') || pCatLower.includes('coffee'))) {
          // matched
        } else if ((selLower.includes('bánh') || selLower.includes('kẹo')) &&
                   (pCatLower.includes('bánh') || pCatLower.includes('kẹo') || pCatLower.includes('granola'))) {
          // matched
        } else if ((selLower.includes('sấy') || selLower.includes('nông sản')) &&
                   (pCatLower.includes('sấy') || pCatLower.includes('trái cây') || pCatLower.includes('nấm') || pCatLower.includes('nông sản'))) {
          // matched
        } else {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name?.toLowerCase().includes(query);
        const matchDesc = p.desc?.toLowerCase().includes(query);
        const matchCat = p.category?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'newest') {
      result = [...result].reverse();
    } else if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const activeCategoryTitle = useMemo(() => {
    if (!selectedCategory) return "Khám phá sản phẩm";
    return `Khám phá ${selectedCategory.toLowerCase()}`;
  }, [selectedCategory]);

  return (
    <section className="px-4 md:px-8 xl:px-12 pb-20 max-w-[1536px] mx-auto w-full relative z-10">
      
      {/* Mobile Category Horizontal Bar */}
      <div className="lg:hidden mb-6 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 w-max">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = (!selectedCategory && cat.key === "") || selectedCategory === cat.key;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-[13px] font-medium transition-all shrink-0 whitespace-nowrap ${
                  isActive 
                    ? "bg-[#e2f1f3] text-[#074751] font-semibold border border-white/80 shadow-xs" 
                    : "bg-white/60 text-[#2b5963] border border-white/60 hover:bg-white/90"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#074751]" : "text-[#5C7B6C]"}`} />
                <span className="whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
        
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[285px] xl:w-[295px] shrink-0 hidden lg:block lg:sticky lg:top-28">
          <div className="rounded-[20px] backdrop-blur(24px) saturate(140%) bg-white/70 border border-white/80 p-4 sm:p-4.5 shadow-[0_16px_40px_rgba(7,71,81,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.7)] flex flex-col">
            
            {/* Sidebar Title */}
            <h3 className="text-[17px] font-semibold text-[#074751] mb-3 px-1 flex items-center justify-between">
              <span>Danh mục</span>
            </h3>

            {/* Category list */}
            <div className="flex flex-col gap-1.5">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isActive = (!selectedCategory && cat.key === "") || selectedCategory === cat.key;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-[14px] text-[13px] sm:text-[13.5px] transition-all group cursor-pointer ${
                      isActive 
                        ? "bg-[#e2f1f3]/95 text-[#074751] font-semibold shadow-[0_2px_8px_rgba(7,71,81,0.04)] border border-white/80" 
                        : "text-[#2b5963] hover:text-[#074751] hover:bg-white/65 font-medium border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1 text-left">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-[#074751]" : "text-[#5C7B6C]"
                      }`} />
                      <span className="whitespace-nowrap truncate">{cat.name}</span>
                    </div>

                    {isActive && (
                      <ChevronRight className="w-4 h-4 shrink-0 text-[#074751]/80 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Promo Card */}
            <div className="mt-8 rounded-[18px] bg-gradient-to-br from-[#eef6f4]/95 to-[#f7faf8]/95 border border-white/85 p-4 shadow-sm relative overflow-hidden group">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#074751]/10 flex items-center justify-center text-[#074751] shrink-0 mt-0.5">
                  <Gift className="w-4 h-4 text-[#074751]" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[13.5px] font-semibold text-[#074751] leading-tight">
                    Tìm quà cho doanh nghiệp?
                  </h4>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                    Tư vấn bộ quà phù hợp với nhu cầu của bạn.
                  </p>
                  <Link 
                    href={`/${lang}/qua-tang-doanh-nghiep`} 
                    className="text-[12px] font-bold text-[#074751] hover:text-vinex-gold transition-colors inline-flex items-center gap-1 mt-2.5 group/link"
                  >
                    <span>Nhận tư vấn</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* Right Main Content */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Header & Controls Toolbar: "Khám phá sản phẩm" + Search + Filter + Sort in single horizontal line */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 mb-6 pb-1">
            
            {/* Left: Heading "Khám phá sản phẩm" & Counter */}
            <div className="flex items-center gap-3 shrink-0">
              <h2 className="text-[22px] sm:text-[24px] font-semibold text-[#074751] tracking-tight">
                {activeCategoryTitle}
              </h2>
              <span className="text-[12px] sm:text-[13px] px-2.5 py-0.5 rounded-full bg-white/70 border border-white/80 text-[#074751]/80 font-medium whitespace-nowrap shadow-xs">
                {filteredProducts.length} sản phẩm
              </span>
            </div>

            {/* Right: Search + Filter + Sort Controls (aligned horizontally) */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap w-full md:w-auto">
              
              {/* Ô Search */}
              <div className="relative flex-1 sm:w-56 md:w-56 lg:w-64 xl:w-72 backdrop-blur-md bg-white/75 border border-white/80 rounded-[14px] px-3.5 py-2 flex items-center gap-2.5 shadow-[0_2px_12px_rgba(7,71,81,0.03)] focus-within:border-vinex-teal/50 focus-within:bg-white focus-within:shadow-[0_4px_16px_rgba(7,71,81,0.08)] transition-all">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[13.5px] text-[#074751] placeholder:text-gray-400 outline-none"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery("")} 
                    className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown Sắp xếp */}
              <div ref={sortRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="backdrop-blur-md bg-white/75 hover:bg-white/95 border border-white/80 rounded-[14px] px-3.5 py-2 text-[13px] shadow-[0_2px_12px_rgba(7,71,81,0.03)] flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all outline-none"
                >
                  <span className="text-gray-500 hidden xl:inline text-[12.5px]">Sắp xếp:</span>
                  <span className="font-semibold text-[#074751]">{currentSortLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#074751] transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 z-50 rounded-[18px] backdrop-blur(24px) saturate(140%) bg-white/95 border border-white/90 shadow-[0_16px_40px_rgba(7,71,81,0.15),inset_0_1.5px_2px_rgba(255,255,255,0.8)] p-1.5 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Specular sheen reflection overlay */}
                    <span
                      className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent pointer-events-none rounded-[inherit]"
                      aria-hidden="true"
                    />
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = opt.value === sortBy;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setIsSortOpen(false);
                          }}
                          className={`relative z-10 w-full px-3.5 py-2.5 rounded-[12px] text-[13px] text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#e2f1f3]/95 text-[#074751] font-semibold shadow-xs'
                              : 'text-[#2b5963] hover:text-[#074751] hover:bg-white/60 font-medium'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-vinex-teal"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center rounded-[20px] bg-white/50 border border-white/60 p-8">
              <p className="text-[#074751] font-semibold text-lg mb-2">Không tìm thấy sản phẩm phù hợp</p>
              <p className="text-gray-500 text-sm mb-6">Hãy thử tìm với từ khóa khác hoặc chọn lại danh mục.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}
                className="px-6 py-2.5 rounded-full bg-[#074751] text-white text-[13px] font-semibold hover:bg-[#0a5c68] transition-colors"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => {
                const productHref = `/${lang}/san-pham/${product.slug}`;
                
                return (
                  <div
                    key={product.id}
                    className="rounded-[20px] backdrop-blur(24px) saturate(140%) bg-white/70 border border-white/80 shadow-[0_16px_40px_rgba(7,71,81,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.75)] hover:shadow-[0_22px_45px_rgba(7,71,81,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group overflow-hidden"
                  >
                    {/* Inner Framed Image */}
                    <div className="p-3.5 pb-0">
                      <Link href={productHref} className="block relative aspect-[4/3] rounded-[16px] overflow-hidden bg-[#074751]/5 border border-white/60 group-hover:border-white transition-colors">
                        <Image
                          src={product.img || '/images/placeholder.jpg'}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 pt-4 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Category Label */}
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C7B6C] mb-1.5 block">
                          {product.category || 'NÔNG SẢN VIỆT'}
                        </span>

                        {/* Product Title */}
                        <Link href={productHref} className="block group-hover:text-vinex-gold transition-colors">
                          <h3 className="text-[17px] font-semibold text-[#074751] line-clamp-1 mb-1 leading-snug">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Short Description */}
                        <p className="text-[13px] text-gray-500 line-clamp-1 mb-3.5 font-light">
                          {product.desc}
                        </p>
                      </div>

                      <div>
                        {/* Supply Status */}
                        <div className="flex items-center gap-2 text-[12px] font-medium text-[#074751]/85 mb-4">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                          <span>{product.status || 'Sẵn sàng cung ứng'}</span>
                        </div>

                        {/* Detail Link Button */}
                        <Link
                          href={productHref}
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = pageNum === currentPage;

                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-full text-[13px] font-semibold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? "bg-[#074751] text-white shadow-sm"
                        : "bg-white/70 border border-white/80 text-[#074751] hover:bg-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
