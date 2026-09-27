"use client";
import { useConfirm } from '@/hooks/useConfirm';
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MessageSquare, CheckCircle2, Plus, Edit, Trash2, X, 
  ChevronLeft, ChevronRight, Phone, Mail, MapPin, Calendar, User, 
  FileText, Check, ArrowUpDown, ChevronDown, ChevronUp, Gift, Package, 
  Clock, Tag, Building, Sparkles, Eye, PhoneCall, MessageCircle, Send
} from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { safeFormatDate } from '@/admin-utils/dateUtils';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { toast } from 'sonner';
import { AdminHeaderPortal } from '@/admin-components/layout/AdminHeaderPortal';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  'NEW': { label: 'Mới tiếp nhận', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  'CONTACTED': { label: 'Đã liên hệ', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
  'CONSULTING': { label: 'Đang tư vấn / Báo giá', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  'WON': { label: 'Đã chốt đơn hàng', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  'LOST': { label: 'Không phù hợp / Hủy', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700' },
};

const CLASS_MAP: Record<string, { label: string; color: string }> = {
  'HOT': { label: 'Nóng (HOT)', color: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200' },
  'WARM': { label: 'Ấm (WARM)', color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200' },
  'COLD': { label: 'Lạnh (COLD)', color: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200' },
};

const PRODUCT_GROUPS = [
  'Hộp quà Tết & Set quà doanh nghiệp',
  'Hạt điều tẩm vị & Hạt dinh dưỡng',
  'Trà Ô Long, Cà phê & Thảo mộc',
  'Bánh ngói, Kẹo & Granola dinh dưỡng',
  'Trái cây sấy & Nông sản sấy dẻo',
  'Gia công sản phẩm theo yêu cầu (OEM/ODM)',
  'Nông sản xuất khẩu & Tiêu chuẩn cao'
];

const PURPOSES = [
  'Quà Tết doanh nghiệp',
  'Tri ân đối tác & Khách hàng VIP',
  'Sự kiện, Hội nghị & Kỷ niệm thành lập',
  'Quà tặng cán bộ nhân viên',
  'Phân phối, Đại lý & Bán lẻ',
  'Xuất khẩu & Hợp đồng B2B'
];

const QUANTITY_OPTIONS = [
  '< 50 set / hộp',
  '50 - 100 set / hộp',
  '100 - 500 set / hộp',
  '500 - 1.000 set / hộp',
  '1.000 - 5.000 set / hộp',
  '> 5.000 set / hộp (Đơn hàng lớn)'
];

const BUDGET_OPTIONS = [
  '< 300.000đ / set',
  '300.000đ - 500.000đ / set',
  '500.000đ - 1.000.000đ / set',
  '1.000.000đ - 2.000.000đ / set',
  '> 2.000.000đ / set (Cao cấp VIP)',
  'Thương lượng theo số lượng'
];

const SOURCES = [
  'Website - Báo Giá B2B',
  'Website - Giải Pháp Doanh Nghiệp',
  'Website - Form Liên Hệ',
  'Hotline / Điện thoại',
  'Zalo Official / Fanpage',
  'Triển lãm / Hội chợ nông sản',
  'Showroom / Trực tiếp',
  'Tự nhập CRM'
];

const TIMELINES = [
  'Cần gấp trong tuần',
  'Trong 2 - 3 tuần tới',
  'Trước Tết 2 tuần',
  'Theo tiến độ dự án',
  'Tháng / Quý tới'
];

const BRANDING_OPTIONS = [
  'In / Ép kim logo doanh nghiệp',
  'Ruy băng thương hiệu riêng',
  'Thiệp chúc mừng / Thư ngỏ riêng',
  'Thiết kế bao bì hộp quà độc quyền'
];

const INITIAL_FORM_DATA = {
  id: '',
  customerName: '',
  companyName: '',
  phone: '',
  email: '',
  location: '',
  source: 'Tự nhập CRM',
  productGroup: 'Hộp quà Tết & Set quà doanh nghiệp',
  purpose: 'Quà Tết doanh nghiệp',
  quantity: '100 - 500 set / hộp',
  budget: '500.000đ - 1.000.000đ / set',
  timeline: 'Trong 2 - 3 tuần tới',
  customization: 'In / Ép kim logo doanh nghiệp, Thiệp chúc mừng / Thư ngỏ riêng',
  notes: '',
  status: 'NEW',
  leadClassification: 'WARM',
  assignee: '',
  callNotes: '',
  chatNotes: '',
  followUpDate: ''
};

export default function LeadsPage() {
  const { confirm } = useConfirm();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/leads');
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Không thể tải danh sách yêu cầu tư vấn');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [classFilter, setClassFilter] = useState<string[]>([]);
  const [productGroupFilter, setProductGroupFilter] = useState<string>('');
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const activeFiltersCount = (statusFilter.length > 0 ? 1 : 0) + (classFilter.length > 0 ? 1 : 0) + (productGroupFilter ? 1 : 0);

  const [formData, setFormData] = useState<any>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredData = Array.isArray(data) ? data.filter(lead => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (lead.customerName || '').toLowerCase().includes(q) ||
      (lead.companyName || '').toLowerCase().includes(q) ||
      (lead.phone || '').includes(searchQuery) ||
      (lead.email || '').toLowerCase().includes(q) ||
      (lead.notes || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(lead.status);
    const matchesClass = classFilter.length === 0 || classFilter.includes(lead.leadClassification);
    const matchesGroup = !productGroupFilter || (lead.productGroup || lead.projectType || '') === productGroupFilter;

    return matchesSearch && matchesStatus && matchesClass && matchesGroup;
  }) : [];

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: any = a[key as keyof typeof a];
    let bValue: any = b[key as keyof typeof b];
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const summary = {
    totalItems: filteredData.length,
    newCount: filteredData.filter(d => d.status === 'NEW').length,
    consultingCount: filteredData.filter(d => d.status === 'CONSULTING' || d.status === 'CONTACTED').length,
    wonCount: filteredData.filter(d => d.status === 'WON').length,
    lostCount: filteredData.filter(d => d.status === 'LOST').length,
  };

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

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (lead: any) => {
    setModalMode('edit');
    setFormData({
      id: lead.id,
      customerName: lead.customerName || '',
      companyName: lead.companyName || '',
      phone: lead.phone || '',
      email: lead.email || '',
      location: lead.location || '',
      source: lead.source || 'Website',
      productGroup: lead.productGroup || lead.projectType || 'Hộp quà Tết & Set quà doanh nghiệp',
      purpose: lead.purpose || 'Quà Tết doanh nghiệp',
      quantity: lead.quantity || '',
      budget: lead.budget || '',
      timeline: lead.timeline || '',
      customization: lead.customization || '',
      notes: lead.notes || '',
      status: lead.status || 'NEW',
      leadClassification: lead.leadClassification || 'WARM',
      assignee: lead.assignee || '',
      callNotes: lead.callNotes || '',
      chatNotes: lead.chatNotes || '',
      followUpDate: lead.followUpDate || ''
    });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.customerName?.trim()) newErrors.customerName = 'Họ tên người liên hệ không được để trống';
    if (!formData.phone?.trim()) newErrors.phone = 'Số điện thoại không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    setErrors({});

    try {
      if (modalMode === 'add') {
        const { id, ...createData } = formData;
        await apiClient.post('/leads', createData);
        toast.success('Tạo yêu cầu tư vấn mới thành công!');
      } else {
        const { id, ...updateData } = formData;
        await apiClient.patch(`/leads/${id}`, updateData);
        toast.success('Cập nhật yêu cầu tư vấn thành công!');
      }
      setIsDrawerOpen(false);
      fetchLeads();
    } catch (error) {
      console.error('Failed to save lead:', error);
      toast.error('Có lỗi xảy ra khi lưu yêu cầu');
    }
  };

  const handleBulkDelete = async () => {
    confirm({
      title: 'Xác nhận xóa hàng loạt',
      description: `Bạn có chắc chắn muốn xóa ${selectedIds.length} yêu cầu tư vấn đã chọn?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => apiClient.delete(`/leads/${id}`)));
          setSelectedIds([]);
          fetchLeads();
          toast.success('Đã xóa thành công!');
        } catch (error) {
          console.error('Failed to bulk delete:', error);
          toast.error('Lỗi khi xóa hàng loạt');
        }
      }
    });
  };

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Xác nhận xóa yêu cầu',
      description: 'Bạn có chắc chắn muốn xóa yêu cầu tư vấn này?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/leads/${id}`);
          fetchLeads();
          toast.success('Đã xóa yêu cầu thành công!');
        } catch (error) {
          console.error('Failed to delete lead:', error);
          toast.error('Lỗi khi xóa yêu cầu');
        }
      }
    });
  };

  // Toggle Branding Options
  const handleToggleBranding = (option: string) => {
    const current = (formData.customization || '').split(',').map((s: string) => s.trim()).filter(Boolean);
    let next: string[];
    if (current.includes(option)) {
      next = current.filter((s: string) => s !== option);
    } else {
      next = [...current, option];
    }
    setFormData({ ...formData, customization: next.join(', ') });
  };

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Header Portal Injection */}
      <AdminHeaderPortal
        title="Yêu Cầu Tư Vấn & Báo Giá B2B"
        description="Quản lý khách hàng tiềm năng, nhu cầu đặt quà doanh nghiệp & nông sản VINEX"
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Tìm khách hàng, công ty, SĐT..."
              className="pl-9 pr-4 py-2 w-[220px] sm:w-[280px] bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[6px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751] text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all shadow-xs"
            />
          </div>
        }
        actions={
          /* Tạm thời ẩn nút tạo yêu cầu mới trên trang admin theo yêu cầu người dùng */
          null
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[6px] flex-shrink-0 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Filter className="w-3.5 h-3.5 text-[#074751]" />
            <span>Bộ Lọc:</span>
          </div>

          <div className="w-[180px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                ...Object.entries(STATUS_MAP).map(([v, item]) => ({ value: v, label: item.label }))
              ]}
              value={statusFilter[0] || ''}
              onChange={v => setStatusFilter(v ? [v] : [])}
            />
          </div>

          <div className="w-[160px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: '', label: 'Tất cả phân loại' },
                ...Object.entries(CLASS_MAP).map(([v, item]) => ({ value: v, label: item.label }))
              ]}
              value={classFilter[0] || ''}
              onChange={v => setClassFilter(v ? [v] : [])}
            />
          </div>

          <div className="w-[220px] hidden md:block">
            <CustomDropdown
              className="w-full"
              options={[
                { value: '', label: 'Tất cả nhóm sản phẩm' },
                ...PRODUCT_GROUPS.map(g => ({ value: g, label: g }))
              ]}
              value={productGroupFilter}
              onChange={v => setProductGroupFilter(v)}
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => { setStatusFilter([]); setClassFilter([]); setProductGroupFilter(''); }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border border-rose-300 hover:border-rose-400 bg-rose-50 text-xs text-rose-600 font-medium transition-all cursor-pointer whitespace-nowrap"
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

      {/* Summary Cards */}
      <div className="rounded-[6px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300">
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-[6px] border border-blue-200/80 bg-blue-50/40 dark:bg-blue-950/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Mới Tiếp Nhận</span>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{summary.newCount}</div>
            </div>

            <div className="p-3.5 rounded-[6px] border border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Đang Tư Vấn</span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              </div>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{summary.consultingCount}</div>
            </div>

            <div className="p-3.5 rounded-[6px] border border-emerald-200/80 bg-emerald-50/40 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Đã Chốt Đơn</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{summary.wonCount}</div>
            </div>

            <div className="p-3.5 rounded-[6px] border border-gray-200 bg-gray-50/60 dark:bg-gray-800/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Tổng Số Lead</span>
                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{summary.totalItems}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col min-h-0 rounded-[6px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-xs">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.length === currentData.length && currentData.length > 0 ? 'bg-[#074751] border-[#074751]' : 'border-gray-300'}`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center cursor-pointer select-none uppercase tracking-wider" onClick={() => handleSort('customerName')}>
                      Khách Hàng & Đơn Vị <SortIcon columnKey="customerName" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-xs border-l border-gray-200 dark:border-gray-800 uppercase tracking-wider">
                  Nhu Cầu Sản Phẩm VINEX
                </th>
                <th className="px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-xs border-l border-gray-200 dark:border-gray-800 uppercase tracking-wider" onClick={() => handleSort('status')}>
                  <div className="flex items-center cursor-pointer">Trạng Thái & Phụ Trách <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-xs border-l border-gray-200 dark:border-gray-800 uppercase tracking-wider">
                  Yêu Cầu & Ghi Chú
                </th>
                <th className="px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-28 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/60 rounded-full flex items-center justify-center mb-3 border border-gray-200 dark:border-gray-700">
                        <Gift className="w-7 h-7 text-[#074751]/60" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Chưa có yêu cầu tư vấn nào</h3>
                      <p className="text-xs text-gray-500 max-w-sm mb-4">Các yêu cầu từ form Báo giá, Giải pháp B2B trên web hoặc bạn thêm thủ công sẽ xuất hiện tại đây.</p>
                      <button
                        onClick={handleOpenAdd}
                        className="px-4 py-2 bg-[#074751] text-white text-xs font-medium rounded-[4px] hover:bg-[#0a5c68] transition-colors"
                      >
                        Tạo yêu cầu đầu tiên
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((lead, index) => {
                  const statusInfo = STATUS_MAP[lead.status] || { label: lead.status, color: 'bg-gray-100 text-gray-700' };
                  const classInfo = CLASS_MAP[lead.leadClassification] || { label: lead.leadClassification || 'WARM', color: 'bg-slate-100 text-slate-700' };

                  return (
                    <tr key={lead.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-[#1f2128] transition-colors">
                      {/* Column 1: Customer & Company */}
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-4 h-4 rounded-[3px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 mt-0.5 ${selectedIds.includes(lead.id.toString()) ? 'bg-[#074751] border-[#074751]' : 'border-gray-300'}`}
                            onClick={() => toggleSelect(lead.id.toString())}
                          >
                            {selectedIds.includes(lead.id.toString()) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{lead.customerName}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-semibold border ${classInfo.color}`}>
                                {classInfo.label}
                              </span>
                            </div>

                            {lead.companyName && (
                              <div className="text-xs text-[#074751] font-medium flex items-center gap-1 mb-1">
                                <Building className="w-3 h-3 text-gray-400 shrink-0" />
                                <span>{lead.companyName}</span>
                              </div>
                            )}

                            <div className="flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" /> {lead.phone}</span>
                              {lead.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-gray-400" /> {lead.email}</span>}
                              <span className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5"><Calendar className="w-3 h-3" /> {safeFormatDate(lead.createdAt, 'dd/MM/yyyy HH:mm')}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: VINEX Needs */}
                      <td className="px-5 py-4 border-l border-gray-100 dark:border-gray-800 align-top max-w-[320px]">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-[#074751] shrink-0" />
                          <span>{lead.productGroup || lead.projectType || 'Quà tặng doanh nghiệp'}</span>
                        </div>
                        
                        {lead.purpose && (
                          <div className="text-xs text-[#074751]/80 font-medium mb-1">
                            Dịp: <span className="text-gray-700 dark:text-gray-300 font-normal">{lead.purpose}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {lead.quantity && (
                            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded-[4px] border border-gray-200 dark:border-gray-700">
                              <Package className="w-3 h-3 text-gray-400" /> {lead.quantity}
                            </span>
                          )}
                          {lead.budget && (
                            <span className="font-medium text-emerald-700 dark:text-emerald-400">
                              {lead.budget}
                            </span>
                          )}
                        </div>

                        {lead.timeline && (
                          <div className="text-[11.5px] text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" /> Giao: {lead.timeline}
                          </div>
                        )}

                        {lead.customization && (
                          <div className="mt-1 text-[11px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-[4px] inline-block border border-purple-200 dark:border-purple-800">
                            {lead.customization}
                          </div>
                        )}
                      </td>

                      {/* Column 3: Status & Assignee */}
                      <td className="px-5 py-4 border-l border-gray-100 dark:border-gray-800 align-top">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className={`inline-flex items-center px-2 py-1 rounded-[4px] text-xs font-semibold border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                            <User className="w-3 h-3 text-gray-400" /> {lead.assignee || 'Chưa gán'}
                          </span>
                          <span className="text-[11px] text-gray-400 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded-[3px]">
                            {lead.source || 'Website'}
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Notes */}
                      <td className="px-5 py-4 border-l border-gray-100 dark:border-gray-800 align-top max-w-[280px]">
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                          {lead.notes || 'Không có ghi chú thêm.'}
                        </p>
                        {lead.location && (
                          <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-1.5">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" /> {lead.location}
                          </div>
                        )}
                      </td>

                      {/* Column 5: Actions */}
                      <td className="px-5 py-4 border-l border-gray-100 dark:border-gray-800 align-top text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(lead)}
                            className="p-1.5 rounded-[4px] text-gray-500 hover:text-[#074751] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            title="Chỉnh sửa & Cập nhật"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-1.5 rounded-[4px] text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Xóa yêu cầu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="h-14 border-t border-gray-100 dark:border-gray-800 px-5 flex items-center justify-between text-xs text-gray-500">
            <span>Hiển thị {currentData.length} / {sortedData.length} yêu cầu</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))} 
                disabled={page === 0} 
                className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Trang {page + 1} / {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                disabled={page >= totalPages - 1} 
                className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer: Add / Edit Lead matching VINEX System */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-2xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[6px] bg-[#074751]/10 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-[#074751]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    {modalMode === 'add' ? 'Tạo Yêu Cầu Tư Vấn / Báo Giá Mới' : 'Chi Tiết & Cập Nhật Yêu Cầu Tư Vấn'}
                  </h2>
                  <p className="text-xs text-gray-500">Chuẩn hóa theo hệ thống giải pháp nông sản & quà tặng VINEX</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-7">
              <form id="lead-form" onSubmit={handleSave} className="space-y-7">
                
                {/* Section 1: Customer & Company Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#074751] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#074751]"></span>
                    1. Thông tin Khách Hàng & Doanh Nghiệp
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Họ tên người liên hệ / Đại diện <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.customerName} 
                        onChange={e => { setFormData({ ...formData, customerName: e.target.value }); if (errors.customerName) setErrors({ ...errors, customerName: '' }); }}
                        className={`w-full px-3 py-2 text-sm rounded-[6px] border ${errors.customerName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-700 focus:ring-[#074751]/20 focus:border-[#074751]'} bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px]`}
                        placeholder="Ví dụ: Nguyễn Văn An"
                      />
                      {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.phone} 
                        onChange={e => { setFormData({ ...formData, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
                        className={`w-full px-3 py-2 text-sm rounded-[6px] border ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-700 focus:ring-[#074751]/20 focus:border-[#074751]'} bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px]`}
                        placeholder="Ví dụ: 0966 967 966"
                      />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Tên công ty / Doanh nghiệp
                      </label>
                      <input 
                        type="text" 
                        value={formData.companyName} 
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                        placeholder="Ví dụ: Tập đoàn VinGroup, Ngân hàng Vietcombank..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Email liên hệ
                      </label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                        placeholder="email@company.vn"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Khu vực / Địa chỉ giao hàng
                      </label>
                      <input 
                        type="text" 
                        value={formData.location} 
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                        placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh, Bình Phước..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Nguồn tiếp nhận
                      </label>
                      <select
                        value={formData.source}
                        onChange={e => setFormData({ ...formData, source: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                      >
                        {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                {/* Section 2: VINEX Products & Needs */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    2. Nhu Cầu Sản Phẩm & Quà Tặng VINEX
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Nhóm sản phẩm quan tâm
                      </label>
                      <select
                        value={formData.productGroup}
                        onChange={e => setFormData({ ...formData, productGroup: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                      >
                        {PRODUCT_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Mục đích / Dịp sử dụng
                      </label>
                      <select
                        value={formData.purpose}
                        onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                      >
                        {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Số lượng dự kiến
                      </label>
                      <input
                        type="text"
                        list="quantity-suggestions"
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                        placeholder="Chọn hoặc nhập số lượng..."
                      />
                      <datalist id="quantity-suggestions">
                        {QUANTITY_OPTIONS.map(q => <option key={q} value={q} />)}
                      </datalist>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Ngân sách dự kiến
                      </label>
                      <input
                        type="text"
                        list="budget-suggestions"
                        value={formData.budget}
                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                        placeholder="Chọn hoặc nhập mức ngân sách..."
                      />
                      <datalist id="budget-suggestions">
                        {BUDGET_OPTIONS.map(b => <option key={b} value={b} />)}
                      </datalist>
                    </div>

                    <div className="col-span-1 sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Thời gian / Tiến độ giao hàng
                      </label>
                      <input
                        type="text"
                        list="timeline-suggestions"
                        value={formData.timeline}
                        onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                        placeholder="Ví dụ: Cần trước 20/12 Âm lịch, Giao trong 10 ngày..."
                      />
                      <datalist id="timeline-suggestions">
                        {TIMELINES.map(t => <option key={t} value={t} />)}
                      </datalist>
                    </div>

                    {/* Branding Options Checkboxes */}
                    <div className="col-span-1 sm:col-span-2 space-y-2 p-3.5 bg-gray-50/80 dark:bg-[#1a1b23] rounded-[6px] border border-gray-200 dark:border-gray-700">
                      <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tùy biến nhận diện thương hiệu & Bao bì:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {BRANDING_OPTIONS.map(opt => {
                          const isChecked = (formData.customization || '').includes(opt);
                          return (
                            <label key={opt} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={isChecked} 
                                onChange={() => handleToggleBranding(opt)}
                                className="w-4 h-4 rounded text-[#074751] focus:ring-[#074751]/20 border-gray-300"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Yêu cầu quy cách, đóng gói hoặc ghi chú chi tiết
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751] resize-none"
                        placeholder="Ví dụ: Hũ hạt điều nắp nhôm 250g, kết hợp Trà Ô Long lon thiếc, đóng hộp quà sơn mài đỏ..."
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                {/* Section 3: CRM Management & Follow up */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    3. Quản Trị Xử Lý & Chăm Sóc Khách Hàng (CRM)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Trạng thái xử lý
                      </label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                      >
                        {Object.entries(STATUS_MAP).map(([val, info]) => (
                          <option key={val} value={val}>{info.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Mức độ tiềm năng
                      </label>
                      <select
                        value={formData.leadClassification}
                        onChange={e => setFormData({ ...formData, leadClassification: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                      >
                        {Object.entries(CLASS_MAP).map(([val, info]) => (
                          <option key={val} value={val}>{info.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Nhân viên phụ trách tư vấn
                      </label>
                      <input
                        type="text"
                        value={formData.assignee}
                        onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                        placeholder="Tên nhân viên Sales/B2B..."
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Drawer Footer */}
            <div className="h-18 flex items-center justify-end gap-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)} 
                className="px-5 py-2.5 rounded-[6px] border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                form="lead-form" 
                className="px-6 py-2.5 rounded-[6px] bg-[#074751] hover:bg-[#0a5c68] text-white text-sm font-semibold cursor-pointer transition-all shadow-md flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {modalMode === 'add' ? 'Thêm Yêu Cầu Mới' : 'Lưu Thay Đổi'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
