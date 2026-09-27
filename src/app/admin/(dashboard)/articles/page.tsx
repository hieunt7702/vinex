"use client";
import { useConfirm } from '@/hooks/useConfirm';
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, FileText, Plus, Edit, Trash2, X, ChevronLeft, ChevronRight, 
  Image as ImageIcon, SearchCode, Check, ArrowUpDown, ChevronDown, ChevronUp, 
  User, Eye, EyeOff, Tag, Link as LinkIcon, Loader2, FolderOpen, Globe, CheckCircle2, AlertTriangle, Sparkles, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import apiClient from '@/admin-lib/apiClient';
import { format } from 'date-fns';
import { normalizeImageUrl } from '@/lib/imageUtils';
import TiptapEditor from '@/admin-components/ui/TiptapEditor';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ImageUploader } from '@/admin-components/ui/image-uploader';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import { SeoArticleSuite } from '@/admin-components/ui/SeoArticleSuite';
import { generateSlug } from '@/admin-utils/slug';
import { AdminHeaderPortal } from '@/admin-components/layout/AdminHeaderPortal';
import ConfirmModal from '@/admin-components/ui/ConfirmModal';
import { CurrencyInput } from '@/admin-components/ui/CurrencyInput';
import { toast } from 'sonner';

const STATUS_MAP: Record<string, string> = {
  'PUBLISHED': 'Đã xuất bản',
  'DRAFT': 'Bản nháp'
};

const DEFAULT_CATEGORIES = [
  'Tin tức VINEX',
  'Kiến thức nông sản',
  'Kinh nghiệm quà tặng',
  'Sự kiện & Hoạt động',
  'Quy trình sản xuất'
];

export default function ArticlesPage() {
  const { confirm } = useConfirm();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlugManual, setIsSlugManual] = useState(false);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const [res, catRes] = await Promise.all([
        apiClient.get('/articles'),
        apiClient.get('/categories')
      ]);
      setData(Array.isArray(res.data) ? res.data : []);
      
      const allCats = Array.isArray(catRes.data) ? catRes.data : [];
      const articleCats = allCats.filter((c: any) => c.type === 'Bài viết').map((c: any) => c.name);
      if (articleCats.length > 0) {
        setCategories(articleCats);
      }
    } catch (error) {
      console.error('Failed to fetch articles or categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const activeFiltersCount = (categoryFilter.length > 0 ? 1 : 0) + (statusFilter.length > 0 ? 1 : 0);

  const [formData, setFormData] = useState<any>({
    id: '',
    title: '',
    slug: '',
    category: 'Tin tức VINEX',
    author: 'Truyền thông VINEX',
    summary: '',
    content: '',
    thumbnail: [] as string[],
    views: 0,
    status: 'PUBLISHED',
    isFeatured: false,
    tags: '',
    metaTitle: '',
    metaDescription: '',
    keyword: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    robotsIndex: 'index',
    robotsFollow: 'follow',
    schemaType: 'Article',
    faqSchema: false,
    publishedAt: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredData = data.filter(article => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      article.title?.toLowerCase().includes(q) ||
      article.summary?.toLowerCase().includes(q) ||
      article.keyword?.toLowerCase().includes(q) ||
      article.slug?.toLowerCase().includes(q);
      
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(article.category);
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(article.status);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig) {
      const { key, direction } = sortConfig;
      let aValue: any = a[key as keyof typeof a];
      let bValue: any = b[key as keyof typeof b];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    }
    // Mặc định: Bài viết mới nhất hiển thị trước
    const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    if (timeA && timeB && timeA !== timeB) return timeB - timeA;
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const summary = {
    totalItems: data.length,
    publishedCount: data.filter(d => d.status === 'PUBLISHED').length,
    draftCount: data.filter(d => d.status === 'DRAFT').length,
    totalViews: data.reduce((acc, curr) => acc + (curr.views || 0), 0)
  };

  const selectedArticles = data.filter(a => selectedIds.includes(a.id.toString()));
  const draftSelectedCount = selectedArticles.filter(a => a.status === 'DRAFT').length;
  const publishedSelectedCount = selectedArticles.filter(a => a.status === 'PUBLISHED').length;

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length && currentData.length > 0) setSelectedIds([]);
    else setSelectedIds(currentData.map(c => c.id.toString()));
  };

  const toggleSelect = (id: string) => {
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
    if (!formData.title?.trim()) newErrors.title = 'Tiêu đề bài viết không được để trống';
    const contentText = formData.content?.replace(/<[^>]*>?/gm, '').trim();
    if (!contentText) newErrors.content = 'Nội dung bài viết không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    const thumbnailStr = Array.isArray(formData.thumbnail) && formData.thumbnail.length > 0
      ? formData.thumbnail[0]
      : (typeof formData.thumbnail === 'string' ? formData.thumbnail : '');

    const dataToSave = {
      ...formData,
      isFeatured: Boolean(formData.isFeatured),
      thumbnail: thumbnailStr,
      publishedAt: formData.status === 'PUBLISHED' ? (formData.publishedAt || new Date().toISOString()) : ''
    };

    try {
      if (modalMode === 'add') {
        const { id, ...createData } = dataToSave;
        if (!createData.slug) {
          createData.slug = createData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        }
        await apiClient.post('/articles', createData);
        toast.success('Thêm bài viết mới thành công!');
      } else {
        const { id, ...updateData } = dataToSave;
        if (!updateData.slug) {
          updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        }
        await apiClient.patch(`/articles/${id}`, updateData);
        toast.success('Cập nhật bài viết thành công!');
      }
      setIsDrawerOpen(false);
      fetchArticles();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vinex_articles_updated'));
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error('Có lỗi xảy ra khi lưu bài viết');
    }
  };

  const handleEdit = (article: any) => {
    setIsSlugManual(true);
    setModalMode('edit');
    setFormData({
      ...article,
      isFeatured: Boolean(article.isFeatured),
      thumbnail: article.thumbnail ? (Array.isArray(article.thumbnail) ? article.thumbnail : [article.thumbnail]) : [],
      canonicalUrl: article.canonicalUrl || `https://vinex.vn/tin-tuc/${article.slug || ''}`,
      ogTitle: article.ogTitle || '',
      ogDescription: article.ogDescription || '',
      ogImage: article.ogImage || '',
      robotsIndex: article.robotsIndex || 'index',
      robotsFollow: article.robotsFollow || 'follow',
      schemaType: article.schemaType || 'Article',
      faqSchema: Boolean(article.faqSchema)
    });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleToggleFeatured = async (article: any) => {
    const nextFeatured = !article.isFeatured;
    try {
      await apiClient.patch(`/articles/${article.id}`, { isFeatured: nextFeatured });
      toast.success(nextFeatured ? 'Đã ghim bài viết làm Tiêu Điểm Nổi Bật!' : 'Đã bỏ ghim bài viết nổi bật.');
      fetchArticles();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vinex_articles_updated'));
      }
    } catch (error) {
      console.error('Lỗi khi đổi trạng thái nổi bật:', error);
      toast.error('Có lỗi xảy ra khi đổi trạng thái nổi bật');
    }
  };

  const handleToggleStatus = (article: any) => {
    const isPublished = article.status === 'PUBLISHED';
    const nextStatus = isPublished ? 'DRAFT' : 'PUBLISHED';
    const actionLabel = isPublished ? 'ẩn' : 'mở xuất bản';

    confirm({
      title: isPublished ? 'Xác nhận ẩn bài viết' : 'Xác nhận mở xuất bản bài viết',
      description: isPublished
        ? `Bạn có chắc chắn muốn ẩn bài viết "${article.title}"? Bài viết sẽ chuyển sang trạng thái Bản nháp và tạm thời không còn hiển thị với người dùng trên website.`
        : `Bạn có chắc chắn muốn mở và xuất bản lại bài viết "${article.title}" lên website?`,
      confirmText: isPublished ? 'Ẩn bài viết' : 'Xuất bản ngay',
      cancelText: 'Hủy bỏ',
      variant: isPublished ? 'warning' : 'primary',
      onConfirm: async () => {
        try {
          await apiClient.patch(`/articles/${article.id}`, { status: nextStatus });
          toast.success(isPublished ? 'Đã ẩn bài viết thành công!' : 'Đã xuất bản bài viết lên website thành công!');
          fetchArticles();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('vinex_articles_updated'));
          }
        } catch (error) {
          console.error(`Lỗi khi ${actionLabel} bài viết:`, error);
          toast.error(`Có lỗi xảy ra khi ${actionLabel} bài viết`);
        }
      }
    });
  };

  const handleDelete = (article: any) => {
    confirm({
      title: 'Xác nhận xóa bài viết',
      description: `Bạn có chắc chắn muốn xóa bài viết "${article.title}"? Dữ liệu bài viết này sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.`,
      confirmText: 'Xóa bài viết',
      cancelText: 'Hủy bỏ',
      variant: 'danger',
      onConfirm: async () => {
        try {
          // Optimistic local state update for instant UI response
          setData(prev => prev.filter(a => String(a.id) !== String(article.id)));
          await apiClient.delete(`/articles/${article.id}`);
          toast.success('Xóa bài viết thành công!');
          await fetchArticles();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('vinex_articles_updated'));
          }
        } catch (error) {
          console.error('Failed to delete article:', error);
          toast.error('Có lỗi xảy ra khi xóa bài viết');
          await fetchArticles();
        }
      }
    });
  };

  const handleBulkToggleStatus = (nextStatus: 'PUBLISHED' | 'DRAFT') => {
    const isHide = nextStatus === 'DRAFT';
    const actionLabel = isHide ? 'ẩn' : 'xuất bản';

    const targetArticles = data.filter(a => selectedIds.includes(a.id.toString()) && a.status !== nextStatus);
    const targetCount = targetArticles.length;
    if (targetCount === 0) return;

    confirm({
      title: isHide ? 'Xác nhận ẩn hàng loạt bài viết' : 'Xác nhận xuất bản hàng loạt bài viết',
      description: isHide
        ? `Bạn có chắc chắn muốn ẩn ${targetCount} bài viết đã chọn? Các bài này sẽ chuyển sang trạng thái Bản nháp.`
        : `Bạn có chắc chắn muốn xuất bản ${targetCount} bài viết đã chọn lên website?`,
      confirmText: isHide ? `Ẩn ${targetCount} bài viết` : `Xuất bản ${targetCount} bài viết`,
      cancelText: 'Hủy bỏ',
      variant: isHide ? 'warning' : 'primary',
      onConfirm: async () => {
        try {
          await Promise.all(targetArticles.map(a => apiClient.patch(`/articles/${a.id}`, { status: nextStatus })));
          toast.success(`Đã ${actionLabel} ${targetCount} bài viết thành công!`);
          setSelectedIds([]);
          fetchArticles();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('vinex_articles_updated'));
          }
        } catch (error) {
          console.error(`Lỗi khi ${actionLabel} hàng loạt:`, error);
          toast.error(`Có lỗi xảy ra khi ${actionLabel} hàng loạt bài viết`);
        }
      }
    });
  };

  const handleBulkDelete = () => {
    confirm({
      title: 'Xác nhận xóa hàng loạt bài viết',
      description: `Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.length} bài viết đã chọn? Dữ liệu đã xóa sẽ không thể khôi phục.`,
      confirmText: `Xóa ${selectedIds.length} bài viết`,
      cancelText: 'Hủy bỏ',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const idsToDelete = [...selectedIds];
          setSelectedIds([]);
          // Optimistic local state update
          setData(prev => prev.filter(a => !idsToDelete.includes(String(a.id))));
          await Promise.all(idsToDelete.map(id => apiClient.delete(`/articles/${id}`)));
          toast.success('Đã xóa các bài viết đã chọn thành công!');
          await fetchArticles();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('vinex_articles_updated'));
          }
        } catch (error) {
          console.error('Failed to delete articles:', error);
          toast.error('Lỗi khi xóa bài viết');
          await fetchArticles();
        }
      }
    });
  };

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Header Portal Injection */}
      <AdminHeaderPortal
        title="Quản Lý Tin Tức & Bài Viết"
        description="Biên tập bài viết chuẩn SEO Google & quản lý xuất bản"
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Tìm tiêu đề, từ khóa SEO, slug..."
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
                id: '',
                title: '',
                slug: '',
                category: categories[0] || 'Tin tức VINEX',
                author: 'Truyền thông VINEX',
                views: 0,
                status: 'PUBLISHED',
                content: '',
                summary: '',
                thumbnail: [],
                tags: '',
                metaTitle: '',
                metaDescription: '',
                keyword: '',
                canonicalUrl: '',
                ogTitle: '',
                ogDescription: '',
                ogImage: '',
                robotsIndex: 'index',
                robotsFollow: 'follow',
                schemaType: 'Article',
                faqSchema: false,
                isFeatured: false,
                publishedAt: new Date().toISOString()
              });
              setErrors({});
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Soạn Bài Viết Mới</span>
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
              options={[{ value: '', label: 'Tất cả chuyên mục' }, ...categories.map(c => ({ value: c, label: c }))]}
              value={categoryFilter[0] || ''}
              onChange={v => setCategoryFilter(v ? [v] : [])}
            />
          </div>

          <div className="w-[160px]">
            <CustomDropdown
              className="w-full"
              options={[{ value: '', label: 'Tất cả trạng thái' }, ...Object.entries(STATUS_MAP).map(([v, l]) => ({ value: v, label: l }))]}
              value={statusFilter[0] || ''}
              onChange={v => setStatusFilter(v ? [v] : [])}
            />
          </div>

          {(categoryFilter.length > 0 || statusFilter.length > 0) && (
            <button
              onClick={() => { setCategoryFilter([]); setStatusFilter([]); }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border border-rose-300 hover:border-rose-400 dark:border-rose-800/80 dark:hover:border-rose-700 bg-rose-50/60 hover:bg-rose-100/70 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5 shrink-0" />
              <span>Xóa bộ lọc ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">
              Đã chọn {selectedIds.length}:
            </span>
            {draftSelectedCount > 0 && (
              <button
                onClick={() => handleBulkToggleStatus('PUBLISHED')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[4px] text-xs font-medium transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                title={`Xuất bản ${draftSelectedCount} bài viết dạng bản nháp đã chọn`}
              >
                <Eye className="w-3.5 h-3.5" />
                Xuất bản ({draftSelectedCount})
              </button>
            )}
            {publishedSelectedCount > 0 && (
              <button
                onClick={() => handleBulkToggleStatus('DRAFT')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-[4px] text-xs font-medium transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                title={`Ẩn ${publishedSelectedCount} bài viết đã xuất bản sang bản nháp`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                Ẩn bài ({publishedSelectedCount})
              </button>
            )}
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-[4px] text-xs font-medium transition-colors border-0 cursor-pointer shadow-xs whitespace-nowrap"
              title={`Xóa tất cả ${selectedIds.length} bài viết đã chọn`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300 shadow-xs">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Bài Viết</h3>
              {!isSummaryCollapsed && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} bài viết</span>
              )}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400">{summary.publishedCount} Đã xuất bản</span>
                  {summary.draftCount > 0 && (
                    <span className="text-amber-600 dark:text-amber-400">{summary.draftCount} Bản nháp</span>
                  )}
                  <span className="text-blue-600 dark:text-blue-400">{summary.totalViews.toLocaleString('vi-VN')} Lượt xem</span>
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
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng bài viết</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">
                  {summary.totalItems} <span className="text-xs font-normal text-gray-500">bài</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Đã xuất bản</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">
                  {summary.publishedCount} <span className="text-xs font-normal text-gray-500">bài</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Bản nháp</span>
                </div>
                <div className="text-2xl font-medium text-amber-700 dark:text-amber-400">
                  {summary.draftCount} <span className="text-xs font-normal text-gray-500">bài</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng lượt xem</span>
                </div>
                <div className="text-2xl font-medium text-purple-700 dark:text-purple-400">
                  {summary.totalViews.toLocaleString('vi-VN')}
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
                <th className="px-3 sm:px-4 lg:px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.length === currentData.length && currentData.length > 0 ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                        }`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center cursor-pointer select-none uppercase tracking-wide" onClick={() => handleSort('title')}>
                      Bài viết &amp; Tiêu đề <SortIcon columnKey="title" />
                    </div>
                  </div>
                </th>
                <th className="px-3 sm:px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase w-28 sm:w-32 lg:w-40" onClick={() => handleSort('category')}>
                  <div className="flex items-center cursor-pointer">Chuyên mục <SortIcon columnKey="category" /></div>
                </th>
                <th className="px-3 sm:px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase w-32 sm:w-40 lg:w-48">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#5865f2]" />
                    Tối Ưu SEO
                  </div>
                </th>
                <th className="px-2 sm:px-2.5 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase text-center w-16 sm:w-20 lg:w-24" onClick={() => handleSort('views')}>
                  <div className="flex items-center justify-center cursor-pointer">Lượt xem <SortIcon columnKey="views" /></div>
                </th>
                <th className="px-2 sm:px-2.5 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase text-center w-24 sm:w-28 lg:w-32" onClick={() => handleSort('status')}>
                  <div className="flex items-center justify-center cursor-pointer">Trạng thái <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-2 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-14">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-[#5865f2] mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Đang tải danh sách bài viết...</h3>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Không có bài viết nào</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Chưa có bài viết phù hợp với bộ lọc tìm kiếm.</p>
                      <button
                        onClick={() => {
                          setModalMode('add');
                          setFormData({
                            id: '',
                            title: '',
                            slug: '',
                            category: categories[0] || 'Tin tức VINEX',
                            author: 'Truyền thông VINEX',
                            views: 0,
                            status: 'PUBLISHED',
                            content: '',
                            summary: '',
                            thumbnail: [],
                            tags: '',
                            metaTitle: '',
                            metaDescription: '',
                            keyword: '',
                            canonicalUrl: '',
                            ogTitle: '',
                            ogDescription: '',
                            ogImage: '',
                            robotsIndex: 'index',
                            robotsFollow: 'follow',
                            schemaType: 'Article',
                            faqSchema: false,
                            isFeatured: false,
                            publishedAt: new Date().toISOString()
                          });
                          setErrors({});
                          setIsDrawerOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Viết Bài Mới
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((article) => {
                  const hasKeyword = Boolean(article.keyword);
                  const titleOk = article.metaTitle && article.metaTitle.length >= 35 && article.metaTitle.length <= 65;
                  const descOk = article.metaDescription && article.metaDescription.length >= 100 && article.metaDescription.length <= 165;

                  return (
                    <tr key={article.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group">
                      <td className="px-3 sm:px-4 lg:px-5 py-3 min-w-0">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${selectedIds.includes(article.id.toString()) ? 'bg-[#5865f2] border-[#5865f2]' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                              }`}
                            onClick={() => toggleSelect(article.id.toString())}
                          >
                            {selectedIds.includes(article.id.toString()) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <div className="w-12 h-9 sm:w-14 sm:h-10 lg:w-16 lg:h-12 rounded-[4px] bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                              {article.thumbnail ? (
                                <img src={normalizeImageUrl(article.thumbnail)} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                {article.isFeatured && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                                    ⭐ NỔI BẬT
                                  </span>
                                )}
                                <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug">{article.title}</span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 min-w-0 text-xs text-gray-400">
                                <span className="font-mono truncate max-w-[120px] sm:max-w-[160px] lg:max-w-[240px]">/tin-tuc/{article.slug}</span>
                                <span className="shrink-0">• {article.createdAt ? format(new Date(article.createdAt), 'dd/MM/yyyy') : ''}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3 border-l border-gray-200 dark:border-gray-800">
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium mb-0.5 truncate">{article.category}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                          <User className="w-3 h-3 text-gray-400 shrink-0" /> <span className="truncate">{article.author || 'Truyền thông VINEX'}</span>
                        </div>
                      </td>

                      {/* SEO Google Column */}
                      <td className="px-3 sm:px-4 py-3 border-l border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col gap-1 min-w-0">
                          {hasKeyword ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#5865f2]/10 text-[#5865f2] border border-[#5865f2]/30 w-fit max-w-full truncate">
                              <span className="shrink-0">🔑</span> <span className="truncate">{article.keyword}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400 italic">Chưa đặt từ khóa</span>
                          )}

                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 whitespace-nowrap">
                            <span className={`flex items-center gap-0.5 ${titleOk ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-400'}`}>
                              {titleOk ? '✓' : '•'} Title ({article.metaTitle?.length || 0})
                            </span>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <span className={`flex items-center gap-0.5 ${descOk ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-400'}`}>
                              {descOk ? '✓' : '•'} Desc ({article.metaDescription?.length || 0})
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-2.5 sm:px-3 py-3 border-l border-gray-200 dark:border-gray-800 text-center">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-[4px] whitespace-nowrap">
                          {(article.views || 0).toLocaleString('vi-VN')}
                        </span>
                      </td>

                      <td className="px-2.5 sm:px-3 py-3 border-l border-gray-200 dark:border-gray-800 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(article)}
                          title={`Click để ${article.status === 'PUBLISHED' ? 'ẩn bài viết' : 'mở xuất bản bài viết'}`}
                          className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-[4px] text-[11px] sm:text-xs font-medium transition-all hover:scale-105 cursor-pointer whitespace-nowrap ${
                            article.status === 'PUBLISHED' 
                              ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                              : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {STATUS_MAP[article.status] || article.status}
                        </button>
                      </td>

                      <td className="px-2 py-3 border-l border-gray-200 dark:border-gray-800 text-center w-14">
                        <div className="flex items-center justify-center">
                          <ActionMenu
                            items={[
                              {
                                label: 'Chỉnh sửa & Tối ưu SEO',
                                icon: Edit,
                                onClick: () => handleEdit(article)
                              },
                              {
                                label: article.isFeatured ? 'Bỏ ghim bài viết nổi bật' : 'Ghim bài viết nổi bật ⭐',
                                icon: Star,
                                onClick: () => handleToggleFeatured(article)
                              },
                              {
                                label: article.status === 'PUBLISHED' ? 'Ẩn bài viết (Bản nháp)' : 'Mở xuất bản bài viết',
                                icon: article.status === 'PUBLISHED' ? EyeOff : Eye,
                                onClick: () => handleToggleStatus(article)
                              },
                              {
                                label: 'Xóa bài viết',
                                icon: Trash2,
                                variant: 'danger',
                                separatorBefore: true,
                                onClick: () => handleDelete(article)
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

        {totalPages > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-[#1a1b23] backdrop-blur-md">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị <span className="font-medium text-gray-900 dark:text-white">{filteredData.length === 0 ? 0 : page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, filteredData.length)}</span> trong <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span> bài viết
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">{page + 1} / {totalPages}</div>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a]"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Drawer for Add/Edit Article */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-4xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-xl z-10">

            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#5865f2]/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#5865f2]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Soạn Thảo Bài Viết & Tối Ưu SEO Mới' : 'Cập Nhật Bài Viết & Bộ Công Cụ SEO Google'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="article-form" onSubmit={handleSave} className="p-6 pb-32 space-y-8">

                {/* Section 1: Nội dung bài viết */}
                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
                    1. Tiêu đề, Tóm tắt &amp; Nội dung bài viết
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu Đề Bài Viết <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={e => {
                          const newTitle = e.target.value;
                          const newSlug = generateSlug(newTitle);
                          setFormData((prev: any) => ({ 
                            ...prev, 
                            title: newTitle, 
                            slug: isSlugManual ? prev.slug : newSlug,
                            metaTitle: isSlugManual && prev.metaTitle ? prev.metaTitle : `${newTitle.trim()} | Nông Sản VINEX`.slice(0, 60)
                          }));
                          if (errors.title) setErrors({ ...errors, title: '' });
                        }}
                        className={`pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-[#5865f2]/20'} text-sm h-10 rounded-[4px] text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:border-[#5865f2]/40`}
                        placeholder="VD: 5 Lợi Ích Của Hạt Điều Đối Với Sức Khỏe..."
                      />
                    </div>
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Đường dẫn tĩnh thân thiện (URL Slug)</label>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                          isSlugManual ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {isSlugManual ? 'Chỉnh sửa thủ công' : 'Tự động theo tiêu đề'}
                        </span>
                        {isSlugManual && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsSlugManual(false);
                              setFormData((prev: any) => ({ ...prev, slug: generateSlug(prev.title) }));
                            }}
                            className="text-xs text-[#5865f2] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" /> Tạo lại theo tiêu đề
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={e => {
                          setIsSlugManual(true);
                          setFormData((prev: any) => ({ ...prev, slug: e.target.value }));
                        }}
                        className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20 font-mono"
                        placeholder="loi-ich-cua-hat-dieu"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tóm tắt ngắn (Summary / Lead paragraph)</label>
                    <textarea
                      rows={2}
                      value={formData.summary}
                      onChange={e => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[4px] text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20 resize-none h-20"
                      placeholder="Tóm tắt ngắn gọn hiển thị trên các thẻ tin tức ngoài trang chủ và chuyên mục..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung chi tiết chuẩn SEO (Headings, Ảnh, Danh sách...) <span className="text-red-500">*</span></label>
                    <div className={`border ${errors.content ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-[4px] overflow-hidden bg-white dark:bg-[#14151a]`}>
                      <TiptapEditor value={formData.content} onChange={(content) => { setFormData({ ...formData, content }); if (errors.content) setErrors({ ...errors, content: '' }); }} />
                    </div>
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section 2: Chuyên mục, Tác giả & Ảnh */}
                <div className="space-y-5">
                  <h3 className="text-xs font-semibold text-[#5865f2] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#43b581]"></span>
                    2. Chuyên mục, Tác giả &amp; Ảnh Thumbnail
                  </h3>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5 relative z-40">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chuyên Mục Bài Viết <span className="text-red-500">*</span></label>
                      <CustomDropdown
                        className="w-full"
                        options={categories.map(c => ({ value: c, label: c }))}
                        value={formData.category}
                        onChange={v => setFormData({ ...formData, category: v })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tác giả</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.author}
                          onChange={e => setFormData({ ...formData, author: e.target.value })}
                          className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20"
                          placeholder="Truyền thông VINEX..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lượt xem ban đầu</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Eye className="h-4 w-4 text-gray-400" />
                        </div>
                        <CurrencyInput
                          value={formData.views}
                          onChange={val => setFormData({ ...formData, views: val })}
                          className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 relative z-30">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng Thái Xuất Bản</label>
                      <CustomDropdown
                        className="w-full"
                        options={[{ value: 'DRAFT', label: 'Bản nháp' }, { value: 'PUBLISHED', label: 'Xuất bản công khai', color: 'green' }]}
                        value={formData.status}
                        onChange={v => setFormData({ ...formData, status: v })}
                      />
                    </div>
                  </div>

                  {/* Toggle Đánh dấu bài viết nổi bật */}
                  <div className="flex items-center justify-between p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
                    <div className="flex items-start gap-3">
                      <Star className={`w-5 h-5 mt-0.5 shrink-0 ${formData.isFeatured ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Đánh dấu bài viết nổi bật (Tiêu điểm)</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Bài viết nổi bật mới nhất sẽ tự động được ưu tiên đưa lên vị trí tiêu điểm trên đầu trang tin tức.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.isFeatured)}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Ảnh Đại Diện (Thumbnail 16:9 chất lượng cao)</label>
                    <ImageUploader
                      initialImages={Array.isArray(formData.thumbnail) ? formData.thumbnail : (formData.thumbnail ? [formData.thumbnail] : [])}
                      onUploadSuccess={(urls) => setFormData({ ...formData, thumbnail: urls })}
                      onRemoveImage={() => setFormData({ ...formData, thumbnail: [] })}
                      maxFiles={1}
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800/60 -mx-6"></div>

                {/* Section 3: BỘ CÔNG CỤ TỐI ƯU SEO GOOGLE TOÀN DIỆN */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      3. Bộ công cụ tối ưu SEO Google chuyên nghiệp (SEO Suite)
                    </h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Chuẩn Google SERP &amp; Schema
                    </span>
                  </div>

                  <SeoArticleSuite
                    title={formData.title}
                    slug={formData.slug}
                    summary={formData.summary}
                    content={formData.content}
                    thumbnail={Array.isArray(formData.thumbnail) && formData.thumbnail.length > 0 ? formData.thumbnail[0] : (typeof formData.thumbnail === 'string' ? formData.thumbnail : '')}
                    metaTitle={formData.metaTitle}
                    metaDescription={formData.metaDescription}
                    keyword={formData.keyword}
                    canonicalUrl={formData.canonicalUrl}
                    ogTitle={formData.ogTitle}
                    ogDescription={formData.ogDescription}
                    ogImage={formData.ogImage}
                    robotsIndex={formData.robotsIndex}
                    robotsFollow={formData.robotsFollow}
                    schemaType={formData.schemaType}
                    faqSchema={formData.faqSchema}
                    tags={formData.tags}
                    onChange={(updatedFields) => setFormData((prev: any) => ({ ...prev, ...updatedFields }))}
                  />
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
                form="article-form"
                className="flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] font-medium text-sm h-10 px-6 border-0 cursor-pointer transition-colors shadow-sm"
              >
                <Check className="w-4 h-4" /> {modalMode === 'add' ? 'Đăng bài viết' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
