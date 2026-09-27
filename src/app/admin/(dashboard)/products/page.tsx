"use client";
import { useConfirm } from '@/hooks/useConfirm';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Plus, Filter, Edit, Trash2, Package, X, ChevronLeft, ChevronRight, 
  Check, ArrowUpDown, ChevronDown, ChevronUp, Loader2, FolderOpen, 
  Layers, Barcode, AlertTriangle, Star, Image as ImageIcon, ShieldAlert, Sparkles
} from 'lucide-react';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ProductImageGallery } from '@/admin-components/ui/ProductImageGallery';
import { CategoryTreeSelect } from '@/admin-components/ui/CategoryTreeSelect';
import TiptapEditor from '@/admin-components/ui/TiptapEditor';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import { toast } from 'sonner';
import { AdminHeaderPortal } from '@/admin-components/layout/AdminHeaderPortal';
import { generateSlug } from '@/admin-utils/slug';
import apiClient from '@/admin-lib/apiClient';
import { CurrencyInput, formatNumberVN } from '@/admin-components/ui/CurrencyInput';

const SEGMENT_MAP: Record<string, string> = {
  'co-ban': 'Cơ bản',
  'trung-cap': 'Trung cấp',
  'cao-cap': 'Cao cấp'
};

const STATUS_MAP: Record<string, string> = {
  'ACTIVE': 'Đang cung ứng',
  'PENDING': 'Chờ duyệt',
  'HIDDEN': 'Tạm ẩn',
  'STOPPED': 'Ngừng sản xuất'
};

const STOCK_STATUS_MAP: Record<string, { label: string; color: string }> = {
  'IN_STOCK': { 
    label: 'Còn hàng', 
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40' 
  },
  'LOW_STOCK': { 
    label: 'Sắp hết', 
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/40' 
  },
  'OUT_OF_STOCK': { 
    label: 'Hết hàng', 
    color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/40' 
  },
  'PREORDER': { 
    label: 'Đặt trước', 
    color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/40' 
  }
};

export default function ProductsPage() {
  const { confirm } = useConfirm();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProductsAndCategories = async () => {
    try {
      setIsLoading(true);
      const [resProducts, resCategories] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/categories')
      ]);
      setData(Array.isArray(resProducts.data) ? resProducts.data : []);
      // Filter for product categories
      const allCats = Array.isArray(resCategories.data) ? resCategories.data : [];
      setCategories(allCats.filter((c: any) => !c.type || c.type === 'Sản phẩm'));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const [formData, setFormData] = useState({
    id: 0,
    productId: '',
    sku: '',
    name: '',
    slug: '',
    segment: 'cao-cap',
    price: 0,
    promotionalPrice: 0,
    stockQuantity: 100,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 10,
    status: 'ACTIVE',
    shortDescription: '',
    description: '',
    images: [] as string[],
    categoryIds: [] as number[],
    attributes: [] as { name: string, value: string }[],
    seoTitle: '',
    metaDescription: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSlugManual, setIsSlugManual] = useState(false);

  const activeFiltersCount = 
    (statusFilter.length > 0 ? 1 : 0) + 
    (segmentFilter.length > 0 ? 1 : 0) + 
    (stockFilter.length > 0 ? 1 : 0);

  // Filter Data
  const filteredData = Array.isArray(data) ? data.filter(product => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name?.toLowerCase().includes(q) ||
      product.productId?.toLowerCase().includes(q) ||
      product.sku?.toLowerCase().includes(q) ||
      product.shortDescription?.toLowerCase().includes(q);
      
    const matchesSegment = segmentFilter.length === 0 || segmentFilter.includes(product.segment);
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(product.status);
    
    // Stock filter logic
    const currentStockStatus = product.stockStatus || (
      (product.stockQuantity || 0) === 0 ? 'OUT_OF_STOCK' : 
      (product.stockQuantity || 0) <= (product.lowStockThreshold || 10) ? 'LOW_STOCK' : 'IN_STOCK'
    );
    const matchesStock = stockFilter.length === 0 || stockFilter.includes(currentStockStatus);

    return matchesSearch && matchesSegment && matchesStatus && matchesStock;
  }) : [];

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig) {
      const { key, direction } = sortConfig;
      let aValue: any = a[key as keyof typeof a];
      let bValue: any = b[key as keyof typeof b];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    }
    // Mặc định: Sản phẩm mới nhất hiển thị trước
    if (a.createdAt && b.createdAt) {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (diff !== 0) return diff;
    }
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // Summary statistics
  const summary = {
    totalItems: filteredData.length,
    activeCount: filteredData.filter(d => d.status === 'ACTIVE').length,
    totalStock: filteredData.reduce((acc, curr) => acc + (curr.stockQuantity || 0), 0),
    lowStockCount: filteredData.filter(d => (d.stockQuantity || 0) <= (d.lowStockThreshold || 10) && (d.stockQuantity || 0) > 0).length,
    outOfStockCount: filteredData.filter(d => (d.stockQuantity || 0) === 0 || d.stockStatus === 'OUT_OF_STOCK').length,
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length && currentData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentData.map(c => c.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm không được để trống';
    if (formData.stockQuantity < 0) newErrors.stockQuantity = 'Số lượng không được âm';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    try {
      // Auto-compute stock status if user hasn't explicitly set preorder
      let stockStatus = formData.stockStatus;
      if (stockStatus !== 'PREORDER') {
        if (formData.stockQuantity === 0) stockStatus = 'OUT_OF_STOCK';
        else if (formData.stockQuantity <= formData.lowStockThreshold) stockStatus = 'LOW_STOCK';
        else stockStatus = 'IN_STOCK';
      }

      if (modalMode === 'add') {
        const { id, ...createData } = formData;
        if (!createData.productId) createData.productId = `VNX-${Math.floor(100 + Math.random() * 900)}`;
        if (!createData.sku) createData.sku = `VNX-SKU-${Math.floor(1000 + Math.random() * 9000)}`;
        if (!createData.slug) createData.slug = createData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        
        // Attach category objects
        const selectedCategories = categories.filter((c: any) => createData.categoryIds?.includes(c.id));
        const payload = { ...createData, stockStatus, categories: selectedCategories };

        await apiClient.post('/products', payload);
        toast.success('Thêm sản phẩm thành công!');
      } else {
        const { id, ...updateData } = formData;
        if (!updateData.slug) updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        
        const selectedCategories = categories.filter((c: any) => updateData.categoryIds?.includes(c.id));
        const payload = { ...updateData, stockStatus, categories: selectedCategories };

        await apiClient.patch(`/products/${id}`, payload);
        toast.success('Cập nhật sản phẩm thành công!');
      }
      setIsDrawerOpen(false);
      fetchProductsAndCategories();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vinex_products_updated'));
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Lỗi khi lưu sản phẩm');
    }
  };

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Xác nhận xóa sản phẩm',
      description: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống VINEX?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/products/${id}`);
          fetchProductsAndCategories();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('vinex_products_updated'));
          }
          toast.success('Đã xóa sản phẩm thành công');
        } catch (error) {
          console.error('Failed to delete product:', error);
          toast.error('Lỗi khi xóa sản phẩm');
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    confirm({
      title: 'Xác nhận xóa hàng loạt',
      description: `Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => apiClient.delete(`/products/${id}`)));
          setSelectedIds([]);
          fetchProductsAndCategories();
          toast.success('Đã xóa thành công!');
        } catch (error) {
          console.error('Failed to delete products:', error);
          toast.error('Lỗi khi xóa sản phẩm');
        }
      }
    });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Header Portal Injection */}
      <AdminHeaderPortal
        title="Quản Lý Sản Phẩm"
        description="Theo dõi kho hàng, phân loại nhiều cấp, giá bán & hình ảnh"
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Tìm Tên sản phẩm, Mã SP, SKU..."
              className="pl-9 pr-4 py-2 w-[200px] sm:w-[260px] bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 dark:focus:ring-[#5865f2]/30 focus:border-[#5865f2]/40 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all shadow-xs"
            />
          </div>
        }
        actions={
          <button
            onClick={() => {
              setModalMode('add');
              setIsSlugManual(false);
              setFormData({
                id: 0,
                productId: '',
                sku: '',
                name: '',
                slug: '',
                segment: 'cao-cap',
                price: 0,
                promotionalPrice: 0,
                stockQuantity: 100,
                stockStatus: 'IN_STOCK',
                lowStockThreshold: 10,
                status: 'ACTIVE',
                shortDescription: '',
                description: '',
                images: [],
                categoryIds: [],
                attributes: [],
                seoTitle: '',
                metaDescription: '',
              });
              setErrors({});
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm Sản Phẩm Mới</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        }
      />

      {/* Permanent Filter Bar (Luôn luôn hiển thị theo yêu cầu) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] flex-shrink-0 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Filter className="w-3.5 h-3.5 text-[#5865f2]" />
            <span>Bộ Lọc:</span>
          </div>

          <div className="w-[170px]">
            <CustomDropdown
              className="w-full"
              options={[{ value: '', label: 'Tất cả trạng thái' }, ...Object.entries(STATUS_MAP).map(([v, l]) => ({ value: v, label: l }))]}
              value={statusFilter[0] || ''}
              onChange={v => setStatusFilter(v ? [v] : [])}
            />
          </div>

          <div className="w-[180px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: '', label: 'Tất cả trạng thái kho' },
                ...Object.entries(STOCK_STATUS_MAP).map(([v, item]) => ({ value: v, label: item.label }))
              ]}
              value={stockFilter[0] || ''}
              onChange={v => setStockFilter(v ? [v] : [])}
            />
          </div>

          <div className="w-[170px]">
            <CustomDropdown
              className="w-full"
              options={[{ value: '', label: 'Tất cả phân khúc' }, ...Object.entries(SEGMENT_MAP).map(([v, l]) => ({ value: v, label: l }))]}
              value={segmentFilter[0] || ''}
              onChange={v => setSegmentFilter(v ? [v] : [])}
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => { setStatusFilter([]); setStockFilter([]); setSegmentFilter([]); }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border border-rose-300 hover:border-rose-400 dark:border-rose-800/80 dark:hover:border-rose-700 bg-rose-50/60 hover:bg-rose-100/70 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5 shrink-0" />
              <span>Xóa bộ lọc ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-[4px] text-xs font-medium transition-colors border-0 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xóa {selectedIds.length} mục đã chọn
          </button>
        )}
      </div>

      {/* Summary Card */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300 shadow-xs">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Kho &amp; Sản Phẩm</h3>
              {!isSummaryCollapsed && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} sản phẩm</span>
              )}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-blue-600 dark:text-blue-400">{summary.totalStock.toLocaleString('vi-VN')} Tồn kho</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{summary.activeCount} Đang bán</span>
                  {summary.lowStockCount > 0 && (
                    <span className="text-amber-600 dark:text-amber-400">{summary.lowStockCount} Sắp hết</span>
                  )}
                  {summary.outOfStockCount > 0 && (
                    <span className="text-rose-600 dark:text-rose-400">{summary.outOfStockCount} Hết hàng</span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] text-xs font-medium cursor-pointer"
            >
              {isSummaryCollapsed ? 'Mở rộng' : 'Thu gọn'}
              {isSummaryCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!isSummaryCollapsed && (
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-[4px] border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng tồn kho</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">
                  {summary.totalStock.toLocaleString('vi-VN')} <span className="text-xs font-normal text-gray-500">cái</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Đang cung ứng</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">
                  {summary.activeCount} <span className="text-xs font-normal text-gray-500">sản phẩm</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Cảnh báo sắp hết</span>
                </div>
                <div className="text-2xl font-medium text-amber-700 dark:text-amber-400">
                  {summary.lowStockCount} <span className="text-xs font-normal text-gray-500">sản phẩm</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-rose-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Hết hàng</span>
                </div>
                <div className="text-2xl font-medium text-rose-700 dark:text-rose-400">
                  {summary.outOfStockCount} <span className="text-xs font-normal text-gray-500">sản phẩm</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="flex-1 bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 flex flex-col min-h-0 overflow-hidden shadow-sm">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50/80 dark:bg-[#1a1b23]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 lg:px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs min-w-[140px] whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.length === currentData.length && currentData.length > 0
                        ? 'bg-[#5865f2] border-[#5865f2]'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                        }`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide whitespace-nowrap" onClick={() => handleSort('productId')}>
                      Mã &amp; SKU <SortIcon columnKey="productId" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[260px]" onClick={() => handleSort('name')}>
                  <div className="flex items-center">Sản Phẩm & Ảnh <SortIcon columnKey="name" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 select-none uppercase tracking-wide">
                  <div className="flex items-center">Phân Loại Đa Cấp</div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide" onClick={() => handleSort('stockQuantity')}>
                  <div className="flex items-center">Số Lượng Kho <SortIcon columnKey="stockQuantity" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide" onClick={() => handleSort('price')}>
                  <div className="flex items-center">Giá Bán <SortIcon columnKey="price" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[140px] whitespace-nowrap" onClick={() => handleSort('status')}>
                  <div className="flex items-center">Trạng Thái <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-16">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-[#5865f2] mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Đang tải danh sách sản phẩm...</h3>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Không có sản phẩm nào</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Chưa có sản phẩm phù hợp với bộ lọc tìm kiếm.</p>
                      <button
                        onClick={() => {
                          setModalMode('add');
                          setFormData({
                            id: 0, productId: '', sku: '', name: '', slug: '', segment: 'cao-cap', price: 0, promotionalPrice: 0, stockQuantity: 100, stockStatus: 'IN_STOCK', lowStockThreshold: 10, status: 'ACTIVE', shortDescription: '', description: '', images: [], categoryIds: [], attributes: [], seoTitle: '', metaDescription: ''
                          });
                          setErrors({});
                          setIsDrawerOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((prod) => {
                  const stockStatusInfo = STOCK_STATUS_MAP[prod.stockStatus] || (
                    (prod.stockQuantity || 0) === 0 ? STOCK_STATUS_MAP['OUT_OF_STOCK'] :
                    (prod.stockQuantity || 0) <= (prod.lowStockThreshold || 10) ? STOCK_STATUS_MAP['LOW_STOCK'] :
                    STOCK_STATUS_MAP['IN_STOCK']
                  );

                  return (
                    <tr key={prod.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group">
                      <td className="px-4 lg:px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${selectedIds.includes(prod.id)
                              ? 'bg-[#5865f2] border-[#5865f2]'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                              }`}
                            onClick={() => toggleSelect(prod.id)}
                          >
                            {selectedIds.includes(prod.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex flex-col items-start gap-1">
                            <span className="font-semibold text-[#5865f2] text-sm whitespace-nowrap">
                              {prod.productId}
                            </span>
                            {prod.sku ? (
                              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800/80 px-1.5 py-0.5 rounded-[4px] border border-gray-200 dark:border-gray-700/60 whitespace-nowrap">
                                <Barcode className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{prod.sku}</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-gray-400 italic whitespace-nowrap">Chưa có SKU</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 min-w-[260px]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-[4px] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0 flex items-center justify-center">
                            {prod.images && prod.images.length > 0 ? (
                              <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                            {prod.images && prod.images.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 py-0.5 rounded-tl-[3px] font-medium">
                                +{prod.images.length - 1}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{prod.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{prod.shortDescription}</div>
                            {prod.images && prod.images.length > 0 && (
                              <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                                <ImageIcon className="w-3 h-3" /> {prod.images.length} hình ảnh
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                        <div>
                          {prod.categories && prod.categories.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mb-1">
                              {prod.categories.map((c: any) => (
                                <span key={c.id || c.name} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-[2px] text-[11px] whitespace-nowrap font-medium">
                                  <Layers className="w-2.5 h-2.5 text-[#5865f2]" /> {c.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Chưa phân loại</span>
                          )}
                          <span className="inline-block text-[10px] text-gray-400 dark:text-gray-500">
                            Phân khúc: {SEGMENT_MAP[prod.segment] || prod.segment}
                          </span>
                        </div>
                      </td>

                      {/* Stock Column */}
                      <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatNumberVN(prod.stockQuantity ?? 0)} <span className="text-xs font-normal text-gray-500">cái</span>
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[11px] font-semibold border w-fit whitespace-nowrap ${stockStatusInfo.color}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {stockStatusInfo.label}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatNumberVN(prod.promotionalPrice > 0 ? prod.promotionalPrice : prod.price)} đ
                          </span>
                          {prod.promotionalPrice > 0 && prod.price > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatNumberVN(prod.price)} đ
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-xs font-medium whitespace-nowrap ${
                          prod.status === 'ACTIVE' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30' :
                          prod.status === 'PENDING' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30' :
                            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                        }`}>
                          {STATUS_MAP[prod.status] || prod.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                        <div className="flex items-center justify-center">
                          <ActionMenu
                            items={[
                              {
                                label: 'Chỉnh sửa', icon: Edit, onClick: () => {
                                  setIsSlugManual(true);
                                  setModalMode('edit');
                                  setFormData({
                                    ...prod,
                                    sku: prod.sku || '',
                                    stockQuantity: prod.stockQuantity ?? 100,
                                    stockStatus: prod.stockStatus || 'IN_STOCK',
                                    lowStockThreshold: prod.lowStockThreshold || 10,
                                    slug: prod.slug || '',
                                    segment: prod.segment || 'cao-cap',
                                    shortDescription: prod.shortDescription || '',
                                    description: prod.description || '',
                                    price: prod.price || 0,
                                    promotionalPrice: prod.promotionalPrice || 0,
                                    images: Array.isArray(prod.images) ? prod.images : [],
                                    categoryIds: prod.categories?.map((c: any) => c.id) || [],
                                    attributes: Array.isArray(prod.attributes) ? prod.attributes : [],
                                    seoTitle: prod.seoTitle || '',
                                    metaDescription: prod.metaDescription || '',
                                  });
                                  setErrors({});
                                  setIsDrawerOpen(true);
                                }
                              },
                              {
                                label: 'Xóa sản phẩm', icon: Trash2, variant: 'danger', onClick: () => handleDelete(prod.id)
                              }
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 0 && (
          <div className="sticky bottom-0 z-20 px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-[#1a1b23] backdrop-blur-md">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị <span className="font-medium text-gray-900 dark:text-white">{filteredData.length === 0 ? 0 : page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, filteredData.length)}</span> trong <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span> sản phẩm
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">{page + 1} / {totalPages}</div>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SlideOver Drawer for Add/Edit */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-4xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-xl z-10">

            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#5865f2]/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Thêm Sản Phẩm Nông Sản Mới' : 'Cập Nhật Sản Phẩm & Tồn Kho'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="product-form" onSubmit={handleSave} className="p-6 pb-48 space-y-8">

                {/* Section 1: Thông tin cơ bản */}
                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    1. Thông tin cơ bản & Phân khúc
                  </h3>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên Sản Phẩm <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => { 
                          const name = e.target.value;
                          const newSlug = generateSlug(name);
                          setFormData((prev: any) => ({ 
                            ...prev, 
                            name, 
                            slug: isSlugManual ? prev.slug : newSlug,
                            seoTitle: isSlugManual && prev.seoTitle ? prev.seoTitle : `${name.trim()} | Nông Sản VINEX`.slice(0, 60)
                          })); 
                          if (errors.name) setErrors({ ...errors, name: '' }); 
                        }}
                        className={`w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`}
                        placeholder="VD: Hạt Điều Tẩm Vị Phô Mai Hũ 250g..."
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đường dẫn thân thiện (Slug)</label>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                            isSlugManual ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {isSlugManual ? 'Chỉnh sửa thủ công' : 'Tự động theo tên'}
                          </span>
                          {isSlugManual && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsSlugManual(false);
                                setFormData((prev: any) => ({ ...prev, slug: generateSlug(prev.name) }));
                              }}
                              className="text-xs text-[#5865f2] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" /> Tạo lại
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={e => {
                          setIsSlugManual(true);
                          setFormData((prev: any) => ({ ...prev, slug: e.target.value }));
                        }}
                        className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 font-mono"
                        placeholder="hat-dieu-tam-vi-pho-mai"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5 relative z-50">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phân khúc sản phẩm</label>
                      <CustomDropdown
                        className="w-full"
                        options={[
                          { value: 'cao-cap', label: 'Cao cấp (Quà tặng VIP / Xuất khẩu)' },
                          { value: 'trung-cap', label: 'Trung cấp (Đặc sản chất lượng)' },
                          { value: 'co-ban', label: 'Cơ bản (Tiêu dùng hàng ngày)' }
                        ]}
                        value={formData.segment || 'cao-cap'}
                        onChange={val => setFormData({ ...formData, segment: val })}
                      />
                    </div>
                    <div className="space-y-1.5 relative z-40">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng Thái Cung Ứng</label>
                      <CustomDropdown
                        className="w-full"
                        options={Object.entries(STATUS_MAP).map(([v, l]) => ({ value: v, label: l }))}
                        value={formData.status}
                        onChange={v => setFormData({ ...formData, status: v })}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section 2: Quản lý Kho & Tồn Kho */}
                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    2. Quản lý kho hàng, SKU & Số lượng tồn kho
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 rounded-[6px] border border-emerald-100 dark:border-emerald-800/30">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Mã SKU Quản Lý</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={e => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                        placeholder="VD: VNX-CAS-250G"
                        className="w-full px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Số Lượng Tồn Kho <span className="text-red-500">*</span></label>
                      <CurrencyInput
                        value={formData.stockQuantity}
                        onChange={val => setFormData({ ...formData, stockQuantity: val })}
                        className="w-full px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Ngưỡng Báo Sắp Hết</label>
                      <CurrencyInput
                        value={formData.lowStockThreshold}
                        onChange={val => setFormData({ ...formData, lowStockThreshold: val })}
                        className="w-full px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-1.5 relative z-30">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Trạng Thái Tồn Kho</label>
                      <CustomDropdown
                        className="w-full"
                        options={Object.entries(STOCK_STATUS_MAP).map(([key, val]) => ({
                          value: key,
                          label: val.label
                        }))}
                        value={formData.stockStatus}
                        onChange={val => setFormData({ ...formData, stockStatus: val })}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section 3: Giá bán */}
                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    3. Giá niêm yết & Giá khuyến mãi / Bán buôn
                  </h3>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Giá niêm yết (VNĐ)</label>
                      <CurrencyInput
                        value={formData.price}
                        onChange={val => setFormData({ ...formData, price: val })}
                        suffix="VNĐ"
                        className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Giá khuyến mãi / Giá sỉ B2B (VNĐ)</label>
                      <CurrencyInput
                        value={formData.promotionalPrice}
                        onChange={val => setFormData({ ...formData, promotionalPrice: val })}
                        suffix="VNĐ"
                        className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#262930] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section 4: Phân loại nhiều cấp */}
                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    4. Phân loại sản phẩm nhiều cấp (Cha &gt; Con &gt; Cháu)
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Chọn danh mục theo cấu trúc phân cấp cây
                    </label>
                    <CategoryTreeSelect
                      categories={categories}
                      selectedCategoryIds={formData.categoryIds || []}
                      onChange={(newIds) => setFormData({ ...formData, categoryIds: newIds })}
                      placeholder="Tìm và chọn các danh mục cha, con, cháu..."
                    />
                    <p className="text-xs text-gray-400">
                      Bạn có thể chọn một hoặc nhiều danh mục từ các cấp khác nhau để sản phẩm hiển thị đúng vị trí trên website.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section 5: Thư viện nhiều hình ảnh */}
                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    5. Thư viện hình ảnh sản phẩm (Nhiều ảnh &amp; Chọn ảnh chính)
                  </h3>

                  <ProductImageGallery
                    images={formData.images || []}
                    onChange={(newImages) => setFormData({ ...formData, images: newImages })}
                    maxImages={12}
                  />
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section 6: Thông số & Quy cách */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                      6. Thông số &amp; Quy cách đóng gói sản phẩm
                    </h3>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attributes: [...(formData.attributes || []), { name: '', value: '' }] })}
                      className="text-xs text-[#5865f2] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm thuộc tính
                    </button>
                  </div>

                  {formData.attributes && formData.attributes.length > 0 ? (
                    <div className="space-y-3">
                      {formData.attributes.map((attr, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <input
                            type="text"
                            value={attr.name}
                            onChange={(e) => {
                              const newAttr = [...formData.attributes];
                              newAttr[index].name = e.target.value;
                              setFormData({ ...formData, attributes: newAttr });
                            }}
                            className="w-1/3 px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20"
                            placeholder="Thuộc tính (VD: Trọng lượng, Quy cách)"
                          />
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => {
                              const newAttr = [...formData.attributes];
                              newAttr[index].value = e.target.value;
                              setFormData({ ...formData, attributes: newAttr });
                            }}
                            className="w-full px-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20"
                            placeholder="Giá trị (VD: 500g, Hũ nắp nhôm hút chân không)"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newAttr = formData.attributes.filter((_, i) => i !== index);
                              setFormData({ ...formData, attributes: newAttr });
                            }}
                            className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-[4px] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-[#1a1b23] p-3 rounded border border-dashed border-gray-200 dark:border-gray-800">
                      Chưa có thông số nào. Nhấn "+ Thêm thuộc tính" để thiết lập Trọng lượng, Hạn dùng, Tiêu chuẩn chất lượng, Xuất xứ...
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section 7: Mô tả ngắn & Chi tiết */}
                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    7. Mô tả sản phẩm &amp; Bài viết giới thiệu chi tiết
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả tóm tắt (Hiển thị ở card sản phẩm)</label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription}
                      onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20 resize-none h-20"
                      placeholder="Mô tả súc tích cho thẻ sản phẩm ngoài website..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bài viết chi tiết chuẩn SEO</label>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-[4px] overflow-hidden bg-white dark:bg-[#14151a]">
                      <TiptapEditor value={formData.description} onChange={(content) => setFormData({ ...formData, description: content })} />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Drawer Footer */}
            <div className="h-20 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] hover:bg-gray-50 dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-sm h-10 px-5 cursor-pointer font-medium transition-colors"
              >
                <X className="w-4 h-4" /> Hủy bỏ
              </button>
              <button
                type="submit"
                form="product-form"
                className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors shadow-sm"
              >
                <Check className="w-4 h-4" /> {modalMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
