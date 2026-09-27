"use client";
import React, { useState } from 'react';
import { Search, Filter, Tags, Plus, Edit, Trash2, X, ChevronLeft, ChevronRight, Check, ArrowUpDown, ChevronDown, ChevronUp, Type, Link, Settings2, RotateCcw, Loader2, FolderOpen, Pin, Eye, EyeOff } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import ConfirmModal from '@/admin-components/ui/ConfirmModal';
import { toast } from 'sonner';
import { AdminHeaderPortal } from '@/admin-components/layout/AdminHeaderPortal';
import { generateSlug } from '@/admin-utils/slug';

const TYPES = ['Sản phẩm', 'Bài viết'];

const TYPE_COLOR_MAP: Record<string, string> = {
  'Sản phẩm': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  'Bài viết': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
};

const STATUS_MAP: Record<string, string> = {
  'ACTIVE': 'Hiển thị',
  'HIDDEN': 'Đang ẩn'
};

export default function CategoriesPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/categories');
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const activeFiltersCount = (typeFilter.length > 0 ? 1 : 0);

  const [formData, setFormData] = useState<any>({
    id: '', name: '', slug: '', type: 'Sản phẩm', status: 'ACTIVE', isPinned: false, parentId: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', desc: '', onConfirm: () => {}
  });

  const filteredData = data.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter.length === 0 || typeFilter.includes(c.type);
    return matchesSearch && matchesType;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: any = a[key as keyof typeof a];
    let bValue: any = b[key as keyof typeof b];
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const buildTree = (items: any[]) => {
    const rootItems: any[] = [];
    const lookup: any = {};
    items.forEach(item => {
      lookup[item.id] = { ...item, children: [] };
    });
    items.forEach(item => {
      if (item.parentId && lookup[item.parentId]) {
        lookup[item.parentId].children.push(lookup[item.id]);
      } else {
        rootItems.push(lookup[item.id]);
      }
    });
    return rootItems;
  };

  const flattenTree = (nodes: any[], level = 0, parentPath = ''): any[] => {
    let result: any[] = [];
    nodes.forEach(node => {
      const currentPath = parentPath ? `${parentPath} > ${node.name}` : node.name;
      result.push({ ...node, level, path: currentPath });
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, level + 1, currentPath));
      }
    });
    return result;
  };

  const treeData = flattenTree(buildTree(sortedData));
  const totalPages = Math.ceil(treeData.length / itemsPerPage) || 1;
  const currentData = treeData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const summary = {
    totalItems: data.length,
    productCount: data.filter(d => d.type === 'Sản phẩm' || !d.type).length,
    articleCount: data.filter(d => d.type === 'Bài viết').length,
    activeCount: data.filter(d => d.status !== 'HIDDEN').length,
    hiddenCount: data.filter(d => d.status === 'HIDDEN').length,
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length && currentData.length > 0) setSelectedIds([]);
    else setSelectedIds(currentData.map(c => c.id));
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Tên danh mục không được để trống';
    if (!formData.slug?.trim()) newErrors.slug = 'Slug không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      if (modalMode === 'add') {
        const { id, ...createData } = formData;
        if (!createData.slug) createData.slug = createData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        await apiClient.post('/categories', createData);
        toast.success('Thêm danh mục thành công!');
      } else {
        const { id, ...updateData } = formData;
        if (!updateData.slug) updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        await apiClient.patch(`/categories/${id}`, updateData);
        toast.success('Cập nhật danh mục thành công!');
      }
      setIsDrawerOpen(false);
      fetchCategories();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vinex_categories_updated'));
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi lưu danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (category: any) => {
    const isHidden = category.status === 'HIDDEN';
    const nextStatus = isHidden ? 'ACTIVE' : 'HIDDEN';
    const label = isHidden ? 'Hiển thị' : 'Đang ẩn';

    try {
      setData(prev => prev.map(c => c.id === category.id ? { ...c, status: nextStatus } : c));
      await apiClient.patch(`/categories/${category.id}`, { status: nextStatus });
      toast.success(`Đã chuyển trạng thái sang "${label}"`);
      await fetchCategories();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vinex_categories_updated'));
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi đổi trạng thái');
      await fetchCategories();
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa danh mục',
      desc: 'Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.',
      onConfirm: async () => {
        try {
          setData(prev => prev.filter(c => c.id !== id));
          await apiClient.delete(`/categories/${id}`);
          toast.success('Xóa danh mục thành công');
          await fetchCategories();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('vinex_categories_updated'));
          }
        } catch (error) {
          console.error(error);
          toast.error('Có lỗi xảy ra khi xóa');
          await fetchCategories();
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleBulkDelete = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa hàng loạt',
      desc: `Bạn có chắc chắn muốn xóa ${selectedIds.length} danh mục đã chọn? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          const idsToDelete = [...selectedIds];
          setSelectedIds([]);
          setData(prev => prev.filter(c => !idsToDelete.includes(c.id)));
          await Promise.all(idsToDelete.map(id => apiClient.delete(`/categories/${id}`)));
          toast.success(`Đã xóa ${idsToDelete.length} danh mục thành công`);
          await fetchCategories();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('vinex_categories_updated'));
          }
        } catch (error) {
          console.error('Bulk delete error:', error);
          toast.error('Lỗi khi xóa hàng loạt');
          await fetchCategories();
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Header Portal Injection */}
      <AdminHeaderPortal
        title="Danh Mục & Phân Loại"
        description="Cây danh mục đa tầng nông sản & chuyên mục tin tức"
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Tìm tên danh mục..."
              className="pl-9 pr-4 py-2 w-[200px] sm:w-[260px] bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 dark:focus:ring-[#5865f2]/30 focus:border-[#5865f2]/40 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all shadow-xs"
            />
          </div>
        }
        actions={
          <button
            onClick={() => {
              setModalMode('add');
              setFormData({
                id: '', name: '', slug: '', type: 'Sản phẩm', status: 'ACTIVE', isPinned: false, parentId: null
              });
              setErrors({});
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tạo Danh Mục Mới</span>
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

          <div className="w-[180px]">
            <CustomDropdown
              className="w-full"
              options={[{ value: '', label: 'Tất cả loại danh mục' }, ...TYPES.map(t => ({ value: t, label: t }))]}
              value={typeFilter[0] || ''}
              onChange={v => setTypeFilter(v ? [v] : [])}
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => setTypeFilter([])}
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

      {/* Dashboard / Summary Card (Thiết kế đồng bộ như màn sản phẩm) */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300 shadow-xs">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Danh Mục & Phân Loại</h3>
              {!isSummaryCollapsed && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} danh mục</span>
              )}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-blue-600 dark:text-blue-400">{summary.totalItems} Danh mục</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{summary.productCount} Sản phẩm</span>
                  <span className="text-purple-600 dark:text-purple-400">{summary.articleCount} Bài viết</span>
                  <span className="text-teal-600 dark:text-teal-400">{summary.activeCount} Đang hiện</span>
                </div>
              </div>
            )}

            <button
              type="button"
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
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng danh mục</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">
                  {summary.totalItems} <span className="text-xs font-normal text-gray-500">nhóm</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Danh mục Sản phẩm</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">
                  {summary.productCount} <span className="text-xs font-normal text-gray-500">danh mục</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Chuyên mục Bài viết</span>
                </div>
                <div className="text-2xl font-medium text-purple-700 dark:text-purple-400">
                  {summary.articleCount} <span className="text-xs font-normal text-gray-500">chuyên mục</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-teal-100 dark:border-teal-900/30 bg-teal-50/50 dark:bg-teal-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-teal-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Trạng thái hiển thị</span>
                </div>
                <div className="text-2xl font-medium text-teal-700 dark:text-teal-400 flex items-baseline gap-2">
                  <span>{summary.activeCount} <span className="text-xs font-normal text-gray-500">hiện</span></span>
                  {summary.hiddenCount > 0 && (
                    <span className="text-sm font-normal text-amber-600 dark:text-amber-400">/ {summary.hiddenCount} ẩn</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col min-h-0 rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] overflow-hidden shadow-sm">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50/80 dark:bg-[#1a1b23]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs w-[45%]">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.length === currentData.length && currentData.length > 0 ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                        }`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center cursor-pointer select-none uppercase tracking-wide" onClick={() => handleSort('name')}>
                      Tên danh mục <SortIcon columnKey="name" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('type')}>
                  <div className="flex items-center cursor-pointer">Phân loại <SortIcon columnKey="type" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('status')}>
                  <div className="flex items-center cursor-pointer">Trạng thái <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-[#5865f2] mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Đang tải danh mục...</h3>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Không có danh mục nào</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Chưa có danh mục phù hợp với bộ lọc tìm kiếm.</p>
                      <button
                        onClick={() => {
                          setModalMode('add');
                          setFormData({ id: '', name: '', slug: '', type: 'Sản phẩm', status: 'ACTIVE', isPinned: false, parentId: null });
                          setErrors({});
                          setIsDrawerOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Tạo Danh Mục Mới
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((c) => (
                  <tr key={c.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${selectedIds.includes(c.id) ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                            }`}
                          onClick={() => toggleSelect(c.id)}
                        >
                          {selectedIds.includes(c.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex flex-col" style={{ paddingLeft: `${c.level * 24}px` }}>
                          <div className="flex items-center gap-2">
                            {c.level === 0 ? (
                              <span className="w-2 h-2 rounded-full bg-[#5865f2]" />
                            ) : (
                              <span className="text-gray-400 font-mono text-xs select-none">└──</span>
                            )}
                            <span className="font-semibold text-gray-900 dark:text-white">{c.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                              c.level === 0 
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40' 
                                : c.level === 1 
                                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
                                  : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40'
                            }`}>
                              Cấp {c.level + 1}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">/{c.slug}</span>
                          </div>
                          {c.level > 0 && (
                            <span className="text-[11px] text-gray-400 dark:text-gray-500 pl-4 mt-0.5">
                              {c.path}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium border ${TYPE_COLOR_MAP[c.type] || 'bg-gray-100 text-gray-700'}`}>
                        {c.type || 'Sản phẩm'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c)}
                        title={`Click để chuyển sang ${c.status === 'HIDDEN' ? 'Hiển thị' : 'Ẩn'}`}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-medium transition-all hover:scale-105 cursor-pointer whitespace-nowrap ${
                          c.status !== 'HIDDEN'
                            ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                            : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status !== 'HIDDEN' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {c.status !== 'HIDDEN' ? 'Hiển thị' : 'Đang ẩn'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                      <div className="flex items-center justify-center">
                        <ActionMenu
                          items={[
                            {
                              label: 'Thêm mục con', icon: Plus, onClick: () => {
                                setModalMode('add');
                                setFormData({ id: '', name: '', slug: '', type: c.type || 'Sản phẩm', status: 'ACTIVE', isPinned: false, parentId: c.id });
                                setErrors({});
                                setIsDrawerOpen(true);
                              }
                            },
                            {
                              label: 'Chỉnh sửa', icon: Edit, onClick: () => {
                                setModalMode('edit');
                                setFormData({ ...c, status: c.status || 'ACTIVE' });
                                setErrors({});
                                setIsDrawerOpen(true);
                              }
                            },
                            {
                              label: c.status === 'HIDDEN' ? 'Hiển thị danh mục' : 'Ẩn danh mục',
                              icon: c.status === 'HIDDEN' ? Eye : EyeOff,
                              onClick: () => handleToggleStatus(c)
                            },
                            { label: 'Xóa danh mục', icon: Trash2, variant: 'danger', onClick: () => handleDelete(c.id) }
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-[#1a1b23] backdrop-blur-md">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị <span className="font-medium text-gray-900 dark:text-white">{treeData.length === 0 ? 0 : page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, treeData.length)}</span> trong <span className="font-medium text-gray-900 dark:text-white">{treeData.length}</span> danh mục
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">{page + 1} / {totalPages}</div>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer for Add/Edit Category */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-2xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-xl z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#5865f2]/10 flex items-center justify-center">
                  <Tags className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Thêm Danh Mục Mới' : 'Cập Nhật Danh Mục'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="category-form" onSubmit={handleSave} className="p-6 pb-32 space-y-8">
                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    Thông tin cơ bản
                  </h3>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên danh mục <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Type className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => {
                            const name = e.target.value;
                            const generateSlug = (text: string) => {
                              return text.toString().toLowerCase()
                                .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
                                .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
                                .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
                                .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
                                .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
                                .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
                                .replace(/đ/gi, 'd')
                                .replace(/\s+/g, '-')
                                .replace(/[^a-z0-9\-]/g, '')
                                .replace(/\-\-+/g, '-')
                                .replace(/^-+/, '')
                                .replace(/-+$/, '');
                            };
                            setFormData({ ...formData, name, slug: generateSlug(name) });
                            if (errors.name) setErrors({ ...errors, name: '' });
                          }}
                          className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`}
                          placeholder="VD: Hạt điều tẩm vị..."
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Slug (Đường dẫn tĩnh) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Link className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={e => { setFormData({ ...formData, slug: e.target.value }); if (errors.slug) setErrors({ ...errors, slug: '' }); }}
                          className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.slug ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`}
                          placeholder="hat-dieu-tam-vi"
                        />
                      </div>
                      {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Phân loại & Cấu trúc
                  </h3>

                  <div className="space-y-5">
                    <div className="space-y-1.5 relative z-40">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loại Danh Mục</label>
                      <CustomDropdown
                        className="w-full"
                        options={TYPES.map(t => ({ value: t, label: t }))}
                        value={formData.type}
                        onChange={val => setFormData({ ...formData, type: val })}
                      />
                    </div>

                    <div className="space-y-1.5 relative z-30">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                      <CustomDropdown
                        className="w-full"
                        options={[{ value: 'ACTIVE', label: 'Hiển thị (Hiện)', color: 'green' }, { value: 'HIDDEN', label: 'Đang ẩn (Ẩn)', color: 'yellow' }]}
                        value={formData.status || 'ACTIVE'}
                        onChange={val => setFormData({ ...formData, status: val as any })}
                      />
                    </div>

                    <div className="space-y-1.5 relative z-20">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục cha (Phân cấp nhiều tầng)</label>
                      <CustomDropdown
                        className="w-full"
                        options={[
                          { value: '', label: '📁 -- Không có (Danh mục gốc Cấp 1) --' },
                          ...treeData
                            .filter(c => (c.type || 'Sản phẩm') === (formData.type || 'Sản phẩm') && c.id !== formData.id)
                            .map(c => ({
                              value: c.id.toString(),
                              label: `${'— '.repeat(c.level)}${c.name} [Cấp ${c.level + 1}]`
                            }))
                        ]}
                        value={formData.parentId ? formData.parentId.toString() : ''}
                        onChange={val => setFormData({ ...formData, parentId: val ? parseInt(val) : null })}
                      />
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Chọn danh mục cha để tạo cấu trúc danh mục nhiều cấp (Cha &gt; Con &gt; Cháu)
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả danh mục</label>
                      <textarea
                        rows={2}
                        value={formData.description || ''}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 transition-all hover:bg-white dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 resize-none h-20"
                        placeholder="Mô tả tóm tắt về nhóm danh mục này..."
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

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
                form="category-form"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-[#074751] hover:bg-[#0a5c68] text-white rounded-[6px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" /> {isSubmitting ? 'Đang lưu...' : (modalMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.desc}
      />
    </div>
  );
}
