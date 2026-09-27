"use client";
import { useConfirm } from '@/hooks/useConfirm';
import React, { useState } from 'react';
import { 
  Search, Filter, Users, Edit, Trash2, X, ChevronLeft, ChevronRight, 
  Check, ArrowUpDown, ChevronDown, ChevronUp, User, Phone, Mail, MapPin, 
  Tag, FileText, Layers, Bookmark
} from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { safeFormatDate } from '@/admin-utils/dateUtils';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ImageUploader } from '@/admin-components/ui/image-uploader';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import { toast } from 'sonner';
import { AdminHeaderPortal } from '@/admin-components/layout/AdminHeaderPortal';

const LOCATION_MAP: Record<string, string> = {
  'Hà Nội': 'Hà Nội',
  'TP.HCM': 'TP.HCM',
  'Đà Nẵng': 'Đà Nẵng',
  'Bình Dương': 'Bình Dương',
  'Cần Thơ': 'Cần Thơ',
  'Hải Phòng': 'Hải Phòng',
  'Toàn quốc': 'Toàn quốc',
  'Khác': 'Khác'
};

const REQUEST_TYPE_OPTIONS = [
  'Hộp quà Tết & Set quà doanh nghiệp',
  'Hạt điều tẩm vị & Hạt dinh dưỡng',
  'Trà Ô Long, Cà phê & Thảo mộc',
  'Bánh ngói, Kẹo & Granola dinh dưỡng',
  'Trái cây sấy & Nông sản sấy dẻo',
  'Cung ứng nguyên liệu / Nông sản xuất khẩu',
  'Gia công sản phẩm theo yêu cầu (OEM/ODM)',
  'Tư vấn báo giá quà tặng B2B'
];

export default function CustomersPage() {
  const { confirm } = useConfirm();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/customers');
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('edit');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [requestTypeFilter, setRequestTypeFilter] = useState('');
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const activeFiltersCount = (locationFilter.length > 0 ? 1 : 0) + (requestTypeFilter ? 1 : 0);

  const [formData, setFormData] = useState({
    id: '', 
    fullName: '', 
    phoneNumber: '', 
    email: '', 
    address: 'Hà Nội', 
    requestType: 'Hộp quà Tết & Set quà doanh nghiệp',
    notes: '',
    images: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredData = Array.isArray(data) ? data.filter(customer => {
    const matchesSearch = 
      (customer.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (customer.phoneNumber || '').includes(searchQuery) ||
      (customer.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter.length === 0 || locationFilter.includes(customer.address);
    const matchesRequestType = !requestTypeFilter || (customer.requestType || customer.projectType || '') === requestTypeFilter;
    return matchesSearch && matchesLocation && matchesRequestType;
  }) : [];

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: any = a[key as keyof typeof a] || '';
    let bValue: any = b[key as keyof typeof b] || '';
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // Thống kê phân loại loại yêu cầu
  const requestTypeCounts = filteredData.reduce((acc: Record<string, number>, curr) => {
    const type = curr.requestType || curr.projectType || 'Quà tặng doanh nghiệp';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const topRequestType = Object.entries(requestTypeCounts).sort((a, b) => b[1] - a[1])[0];

  const summary = {
    totalItems: filteredData.length,
    uniqueTypesCount: Object.keys(requestTypeCounts).length,
    topType: topRequestType ? `${topRequestType[0]} (${topRequestType[1]})` : 'Chưa có dữ liệu'
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ và tên không được để trống';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Số điện thoại không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setErrors({});

    try {
      if (modalMode === 'add') {
        const { id, ...createData } = formData;
        await apiClient.post('/customers', createData);
        toast.success('Đã thêm khách hàng thành công');
      } else {
        const { id, ...updateData } = formData;
        await apiClient.patch(`/customers/${id}`, updateData);
        toast.success('Đã cập nhật hồ sơ khách hàng');
      }
      setIsDrawerOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to save customer:', error);
      toast.error('Có lỗi xảy ra khi lưu khách hàng');
    }
  };

  const handleBulkDelete = async () => {
    confirm({
      title: 'Xác nhận xóa hàng loạt',
      description: `Bạn có chắc chắn muốn xóa ${selectedIds.length} mục đã chọn?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => apiClient.delete(`/customers/${id}`)));
          setSelectedIds([]);
          fetchCustomers();
          toast.success('Đã xóa thành công!');
        } catch (error) {
          console.error('Failed to bulk delete:', error);
          toast.error('Lỗi khi xóa');
        }
      }
    });
  };

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa khách hàng này?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/customers/${id}`);
          fetchCustomers();
          toast.success('Đã xóa khách hàng');
        } catch (error) {
          console.error('Failed to delete customer:', error);
          toast.error('Lỗi khi xóa khách hàng');
        }
      }
    });
  };

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Header Portal Injection */}
      <AdminHeaderPortal
        title="Quản Lý Khách Hàng"
        description="Thông tin đối tác, doanh nghiệp & lịch sử nhu cầu sản phẩm VINEX"
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Tìm tên, SĐT, email khách hàng..."
              className="pl-9 pr-4 py-2 w-[200px] sm:w-[280px] bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[6px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751] text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all shadow-xs"
            />
          </div>
        }
        actions={
          /* Tạm thời ẩn nút thêm khách hàng theo yêu cầu người dùng */
          null
        }
      />

      {/* Permanent Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[6px] flex-shrink-0 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Filter className="w-3.5 h-3.5 text-[#074751]" />
            <span>Bộ lọc:</span>
          </div>

          <div className="w-[180px]">
            <CustomDropdown
              className="w-full"
              options={[{ value: '', label: 'Tất cả khu vực' }, ...Object.entries(LOCATION_MAP).map(([v, l]) => ({ value: v, label: l }))]}
              value={locationFilter[0] || ''}
              onChange={v => setLocationFilter(v ? [v] : [])}
            />
          </div>

          <div className="w-[240px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: '', label: 'Tất cả loại yêu cầu' }, 
                ...REQUEST_TYPE_OPTIONS.map(opt => ({ value: opt, label: opt }))
              ]}
              value={requestTypeFilter}
              onChange={v => setRequestTypeFilter(v)}
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => { setLocationFilter([]); setRequestTypeFilter(''); }}
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

      {/* Summary View (Thay thế hiển thị tổng yêu cầu bằng loại yêu cầu) */}
      <div className="rounded-[6px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Nhu Cầu & Khách Hàng</h3>
              {!isSummaryCollapsed && <span className="text-xs text-gray-500 dark:text-gray-400">{summary.totalItems} khách hàng</span>}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="text-[#074751] dark:text-teal-400 font-semibold">{summary.totalItems} Khách hàng</span>
                  <span className="text-amber-700 dark:text-amber-400">Loại phổ biến: {summary.topType}</span>
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
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-[6px] border border-teal-200/80 bg-teal-50/40 dark:bg-teal-950/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <Users className="w-4 h-4 text-[#074751]" />
                  <span className="text-xs font-semibold text-[#074751] dark:text-teal-300">Tổng Khách Hàng Tiếp Nhận</span>
                </div>
                <div className="text-2xl font-bold text-[#074751] dark:text-teal-100">{summary.totalItems}</div>
              </div>

              <div className="p-3.5 rounded-[6px] border border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Loại Yêu Cầu Nổi Bật</span>
                </div>
                <div className="text-base font-bold text-amber-900 dark:text-amber-100 truncate" title={summary.topType}>
                  {summary.topType}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col min-h-0 rounded-[6px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${
                        selectedIds.length === currentData.length && currentData.length > 0 
                          ? 'bg-[#074751] border-[#074751]' 
                          : 'border-gray-300'
                      }`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === currentData.length && currentData.length > 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-center cursor-pointer select-none uppercase tracking-wide" onClick={() => handleSort('fullName')}>
                      Thông tin khách hàng <SortIcon columnKey="fullName" />
                    </div>
                  </div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('phoneNumber')}>
                  <div className="flex items-center cursor-pointer">Liên hệ <SortIcon columnKey="phoneNumber" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('address')}>
                  <div className="flex items-center cursor-pointer">Khu vực <SortIcon columnKey="address" /></div>
                </th>
                {/* Đổi từ Tổng yêu cầu sang Loại yêu cầu */}
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase" onClick={() => handleSort('requestType')}>
                  <div className="flex items-center cursor-pointer">Loại yêu cầu <SortIcon columnKey="requestType" /></div>
                </th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 uppercase">Ngày tiếp nhận</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                        <Users className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Chưa có khách hàng nào</h3>
                      <p className="text-xs text-gray-500 max-w-sm">Dữ liệu khách hàng sẽ tự động ghi nhận khi khách hàng gửi yêu cầu tư vấn trên website.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((customer, index) => (
                  <tr key={customer.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#262930] dark:bg-[#1a1b23] transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                            selectedIds.includes(customer.id.toString()) ? 'bg-[#074751] border-[#074751]' : 'border-gray-300'
                          }`}
                          onClick={() => toggleSelect(customer.id.toString())}
                        >
                          {selectedIds.includes(customer.id.toString()) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 text-[#074751] dark:text-teal-300 flex items-center justify-center font-medium text-sm">
                            {(customer.fullName || 'K').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-gray-900 dark:text-white">{customer.fullName}</div>
                            {customer.companyName && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">{customer.companyName}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.phoneNumber || '---'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{customer.email || 'Chưa có email'}</div>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{customer.address || 'Hà Nội'}</span>
                    </td>
                    {/* Hiển thị Loại Yêu Cầu */}
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-xs font-medium bg-teal-50 dark:bg-teal-950/40 text-[#074751] dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 max-w-[260px] truncate" title={customer.requestType || customer.projectType || 'Quà tặng doanh nghiệp'}>
                        {customer.requestType || customer.projectType || 'Quà tặng doanh nghiệp'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{safeFormatDate(customer.createdAt, 'dd/MM/yyyy')}</span>
                    </td>
                    <td className="px-5 py-3.5 border-l border-gray-200 dark:border-gray-800 text-center">
                      <div className="flex items-center justify-center">
                        <ActionMenu
                          items={[
                            {
                              label: 'Xem & Sửa hồ sơ', icon: Edit, onClick: () => {
                                setModalMode('edit');
                                setFormData({ 
                                  ...customer, 
                                  requestType: customer.requestType || customer.projectType || 'Hộp quà Tết & Set quà doanh nghiệp',
                                  notes: customer.notes || '',
                                  images: customer.images || [] 
                                });
                                setErrors({});
                                setIsDrawerOpen(true);
                              }
                            },
                            { label: 'Xóa', icon: Trash2, onClick: () => handleDelete(customer.id), variant: 'danger', separatorBefore: true }
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
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#1a1b23]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị <span className="font-medium text-gray-900 dark:text-white">{filteredData.length > 0 ? page * itemsPerPage + 1 : 0} - {Math.min((page + 1) * itemsPerPage, filteredData.length)}</span> trong <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span> khách hàng
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a] cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">{page + 1} / {totalPages}</div>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#14151a] disabled:opacity-50 transition-colors bg-white dark:bg-[#14151a] cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Cập Nhật Hồ Sơ */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-2xl z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14151a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[6px] bg-[#074751]/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#074751]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                    {modalMode === 'add' ? 'Thêm Khách Hàng' : 'Cập Nhật Hồ Sơ Khách Hàng'}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-[4px] hover:bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form id="customer-form" onSubmit={handleSave} className="p-6 space-y-6">

                {/* Section: Thông tin khách hàng */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-[#074751] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#074751]"></span>
                    Thông tin liên hệ
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Họ và Tên <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          required 
                          value={formData.fullName} 
                          onChange={e => { setFormData({ ...formData, fullName: e.target.value }); if (errors.fullName) setErrors({ ...errors, fullName: '' }); }} 
                          className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[6px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]" 
                          placeholder="VD: Nguyễn Văn A..." 
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Số điện thoại <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          required 
                          value={formData.phoneNumber} 
                          onChange={e => { setFormData({ ...formData, phoneNumber: e.target.value }); if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' }); }} 
                          className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[6px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]" 
                          placeholder="0901..." 
                        />
                      </div>
                      {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="email" 
                          value={formData.email || ''} 
                          onChange={e => setFormData({ ...formData, email: e.target.value })} 
                          className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[6px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]" 
                          placeholder="contact@company.com" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Khu vực / Tỉnh thành</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          value={formData.address || ''} 
                          onChange={e => setFormData({ ...formData, address: e.target.value })} 
                          className="pl-9 w-full bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm h-10 rounded-[6px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]" 
                          placeholder="Hà Nội, TP.HCM..." 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 -mx-6"></div>

                {/* Section: Loại yêu cầu & Nhu cầu (Thay thế tổng số yêu cầu) */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-[#074751] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Loại yêu cầu & Nhu cầu sản phẩm
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Loại Yêu Cầu Quan Tâm
                    </label>
                    <select
                      value={formData.requestType}
                      onChange={e => setFormData({ ...formData, requestType: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-[6px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1a1b23] focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751]"
                    >
                      {REQUEST_TYPE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Ghi chú nhu cầu chi tiết
                    </label>
                    <textarea 
                      rows={3} 
                      value={formData.notes || ''} 
                      onChange={e => setFormData({ ...formData, notes: e.target.value })} 
                      placeholder="Mô tả cụ thể về nhu cầu, số lượng dự kiến, quy cách bao bì..."
                      className="w-full p-3 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-sm rounded-[6px] text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-[#074751]/20 focus:border-[#074751] resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Tài liệu / File đính kèm / Hợp đồng
                    </label>
                    <ImageUploader 
                      initialImages={formData.images} 
                      onUploadSuccess={(urls) => setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))} 
                      onRemoveImage={(url) => setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }))} 
                      maxFiles={5} 
                    />
                  </div>
                </div>
              </form>
            </div>

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
                form="customer-form" 
                className="px-6 py-2.5 rounded-[6px] bg-[#074751] hover:bg-[#0a5c68] text-white text-sm font-semibold cursor-pointer transition-all shadow-md flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> 
                {modalMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
