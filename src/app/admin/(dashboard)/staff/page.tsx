"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, ShieldCheck, UserCheck, Plus, Search, Filter,
  Edit2, Trash2, Lock, Unlock, Mail, Phone, Building2,
  CheckCircle2, XCircle, AlertTriangle, ArrowUpDown, ChevronDown,
  ChevronUp, Key, Sparkles, X, Loader2, Eye, EyeOff, ShieldAlert,
  Check, ChevronLeft, ChevronRight, User, Package, FileText,
  Layers, Image, Receipt, Coins, Save, UserPlus, CheckCircle
} from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { useAuthStore, UserRole } from '@/admin-features/auth/stores/useAuthStore';
import { useConfirm } from '@/hooks/useConfirm';
import { AdminHeaderPortal } from '@/admin-components/layout/AdminHeaderPortal';
import ConfirmModal from '@/admin-components/ui/ConfirmModal';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { safeFormatDate } from '@/admin-utils/dateUtils';
import { toast } from 'sonner';

export interface StaffPermissions {
  products?: boolean;
  articles?: boolean;
  categories?: boolean;
  media?: boolean;
  leads?: boolean;
  canDelete?: boolean;
  canManageStaff?: boolean;
}

interface StaffMember {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  permissions?: StaffPermissions;
  status: 'ACTIVE' | 'INACTIVE';
  department?: string;
  lastLogin?: string | null;
  createdAt?: string;
}

export default function StaffManagementPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { confirm } = useConfirm();

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'STAFF'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 20;

  // Sorting (Mặc định: Nhân viên mới nhất đến cũ nhất)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'createdAt',
    direction: 'desc'
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    status: 'ACTIVE' | 'INACTIVE';
    department: string;
    permissions: StaffPermissions;
  }>({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'STAFF',
    status: 'ACTIVE',
    department: 'Nội dung & Sản phẩm',
    permissions: {
      products: true,
      articles: true,
      categories: true,
      media: true,
      leads: false,
      canDelete: false,
      canManageStaff: false,
    }
  });

  // Fetch Staff list
  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/staff');
      setStaffList(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      console.error('Failed to fetch staff:', error);
      toast.error('Không thể tải danh sách nhân viên');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchQuery =
        !searchQuery.trim() ||
        (s.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.phone || '').includes(searchQuery.trim()) ||
        (s.department || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchRole = roleFilter === 'ALL' || s.role === roleFilter;
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;

      return matchQuery && matchRole && matchStatus;
    });
  }, [staffList, searchQuery, roleFilter, statusFilter]);

  // Sort staff (Mặc định: Mới nhất đến cũ nhất)
  const sortedStaff = useMemo(() => {
    const list = [...filteredStaff];
    const key = sortConfig?.key || 'createdAt';
    const direction = sortConfig?.direction || 'desc';

    return list.sort((a, b) => {
      let aVal = (a as any)[key];
      let bVal = (b as any)[key];

      if (key === 'createdAt' || key === 'lastLogin') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      } else if (key === 'id') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      // Secondary fallback sort: newest id first
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
  }, [filteredStaff, sortConfig]);

  // Paginated staff
  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const currentStaff = useMemo(() => {
    return sortedStaff.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  }, [sortedStaff, page, itemsPerPage]);

  const activeFiltersCount = 
    (roleFilter !== 'ALL' ? 1 : 0) + 
    (statusFilter !== 'ALL' ? 1 : 0);

  // Metrics
  const stats = useMemo(() => {
    const total = staffList.length;
    const admins = staffList.filter((s) => s.role === 'ADMIN').length;
    const staffs = staffList.filter((s) => s.role === 'STAFF').length;
    const actives = staffList.filter((s) => s.status === 'ACTIVE').length;
    return { total, admins, staffs, actives };
  }, [staffList]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentStaff.length && currentStaff.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentStaff.map(s => s.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedStaff = useMemo(() => {
    return staffList.filter((s) => selectedIds.includes(s.id));
  }, [staffList, selectedIds]);

  const activeSelectedCount = useMemo(() => {
    return selectedStaff.filter((s) => s.status === 'ACTIVE' && s.id !== 1 && s.username !== 'admin').length;
  }, [selectedStaff]);

  const inactiveSelectedCount = useMemo(() => {
    return selectedStaff.filter((s) => s.status === 'INACTIVE').length;
  }, [selectedStaff]);

  const deletableSelected = useMemo(() => {
    return selectedStaff.filter((s) => s.id !== 1 && s.username !== 'admin' && s.id !== currentUser?.id);
  }, [selectedStaff, currentUser?.id]);

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    const countToDelete = deletableSelected.length;
    if (countToDelete === 0) {
      toast.error('Các tài khoản đã chọn đều được bảo vệ (Quản trị viên gốc admin hoặc tài khoản đang đăng nhập). Không thể xóa.');
      return;
    }

    const hasProtected = deletableSelected.length < selectedIds.length;

    confirm({
      title: 'Xác nhận xóa nhân sự hàng loạt',
      description: hasProtected
        ? `Bạn có chắc chắn muốn xóa ${countToDelete} nhân sự đã chọn? (${selectedIds.length - countToDelete} tài khoản Quản trị viên gốc / tài khoản đang đăng nhập sẽ được giữ lại an toàn). Hành động này không thể hoàn tác.`
        : `Bạn có chắc chắn muốn xóa vĩnh viễn ${countToDelete} nhân sự đã chọn? Dữ liệu nhân viên và lịch sử phân quyền sẽ bị xóa hoàn toàn.`,
      confirmText: `Xóa ${countToDelete} nhân sự`,
      cancelText: 'Hủy bỏ',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const idsToDelete = deletableSelected.map((s) => s.id);
          setSelectedIds([]);
          // Optimistic local update
          setStaffList((prev) => prev.filter((s) => !idsToDelete.includes(s.id)));

          try {
            await apiClient.delete('/staff', { data: { ids: idsToDelete } });
          } catch {
            await Promise.all(idsToDelete.map((id) => apiClient.delete(`/staff/${id}`)));
          }

          toast.success(`Đã xóa thành công ${countToDelete} nhân sự!`);
          await fetchStaff();
        } catch (error: any) {
          console.error('Failed to bulk delete staff:', error);
          toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa nhân viên');
          await fetchStaff();
        }
      }
    });
  };

  const handleBulkToggleStatus = (targetStatus: 'ACTIVE' | 'INACTIVE') => {
    const targets = targetStatus === 'ACTIVE'
      ? selectedStaff.filter((s) => s.status === 'INACTIVE')
      : selectedStaff.filter((s) => s.status === 'ACTIVE' && s.id !== 1 && s.username !== 'admin');

    if (targets.length === 0) return;

    confirm({
      title: targetStatus === 'ACTIVE' ? 'Kích hoạt hàng loạt nhân viên' : 'Tạm khóa hàng loạt nhân viên',
      description: `Bạn có chắc chắn muốn ${targetStatus === 'ACTIVE' ? 'kích hoạt' : 'tạm khóa'} ${targets.length} tài khoản nhân sự đã chọn?`,
      confirmText: targetStatus === 'ACTIVE' ? `Kích hoạt (${targets.length})` : `Tạm khóa (${targets.length})`,
      cancelText: 'Hủy bỏ',
      variant: targetStatus === 'ACTIVE' ? 'primary' : 'warning',
      onConfirm: async () => {
        try {
          const ids = targets.map((s) => s.id);
          setSelectedIds([]);
          setStaffList((prev) => prev.map((s) => ids.includes(s.id) ? { ...s, status: targetStatus } : s));
          await Promise.all(ids.map((id) => apiClient.put(`/staff/${id}`, { status: targetStatus })));
          toast.success(`Đã ${targetStatus === 'ACTIVE' ? 'kích hoạt' : 'tạm khóa'} ${targets.length} nhân sự thành công!`);
          await fetchStaff();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
          await fetchStaff();
        }
      }
    });
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingStaffId(null);
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'STAFF',
      status: 'ACTIVE',
      department: 'Nội dung & Sản phẩm',
      permissions: {
        products: true,
        articles: true,
        categories: true,
        media: true,
        leads: false,
        canDelete: false,
        canManageStaff: false,
      }
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (staff: StaffMember) => {
    setModalMode('edit');
    setEditingStaffId(staff.id);
    setFormData({
      username: staff.username,
      password: '',
      fullName: staff.fullName,
      email: staff.email || '',
      phone: staff.phone || '',
      role: staff.role,
      status: staff.status,
      department: staff.department || 'Nội dung & Sản phẩm',
      permissions: staff.permissions || (staff.role === 'ADMIN' ? {
        products: true,
        articles: true,
        categories: true,
        media: true,
        leads: true,
        canDelete: true,
        canManageStaff: true,
      } : {
        products: true,
        articles: true,
        categories: true,
        media: true,
        leads: false,
        canDelete: false,
        canManageStaff: false,
      })
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  // Submit Add / Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên');
      return;
    }

    if (modalMode === 'add') {
      if (!formData.username.trim()) {
        toast.error('Vui lòng nhập tên đăng nhập');
        return;
      }
      if (!formData.password || formData.password.length < 3) {
        toast.error('Mật khẩu tối thiểu 3 ký tự');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      if (modalMode === 'add') {
        const res = await apiClient.post('/staff', formData);
        toast.success(`Tạo nhân viên "${formData.fullName}" thành công!`);
        setStaffList((prev) => [res.data, ...prev]);
      } else {
        if (!editingStaffId) return;
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password;
        const res = await apiClient.put(`/staff/${editingStaffId}`, payload);
        toast.success(`Cập nhật nhân viên "${formData.fullName}" thành công!`);
        setStaffList((prev) =>
          prev.map((s) => (s.id === editingStaffId ? res.data : s))
        );
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu nhân viên');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Staff Status (Lock / Activate)
  const handleToggleStatus = async (staff: StaffMember) => {
    if (staff.id === 1 || staff.username === 'admin') {
      toast.error('Không thể khóa tài khoản Quản trị viên gốc');
      return;
    }

    const nextStatus = staff.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await apiClient.put(`/staff/${staff.id}`, { status: nextStatus });
      setStaffList((prev) =>
        prev.map((s) => (s.id === staff.id ? { ...s, status: nextStatus } : s))
      );
      toast.success(
        nextStatus === 'ACTIVE'
          ? `Đã kích hoạt tài khoản "${staff.fullName}"`
          : `Đã tạm khóa tài khoản "${staff.fullName}"`
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể thay đổi trạng thái');
    }
  };

  // Delete Staff
  const confirmDelete = async () => {
    if (!staffToDelete) return;
    try {
      await apiClient.delete(`/staff/${staffToDelete.id}`);
      setStaffList((prev) => prev.filter((s) => s.id !== staffToDelete.id));
      toast.success(`Đã xóa nhân viên "${staffToDelete.fullName}"`);
      setDeleteModalOpen(false);
      setStaffToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa nhân viên này');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  // ROLE-BASED ACCESS CONTROL GUARD
  const canAccessStaffPage = currentUser?.role === 'ADMIN' || currentUser?.permissions?.canManageStaff === true;

  if (!canAccessStaffPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-[4px] bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Truy cập bị giới hạn
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          Tài khoản của bạn đang có quyền <strong>Nhân viên (STAFF)</strong>. Quyền này chưa được kích hoạt tính năng <strong>Quản lý & Phân quyền Nhân sự</strong>. Bạn vẫn có thể thao tác với Bài viết, Sản phẩm, Danh mục theo quyền hạn đã được Quản trị viên phân công.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => router.push('/admin/articles')}
            className="px-5 py-2.5 rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Quản lý Bài viết
          </button>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-5 py-2.5 rounded-[4px] bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors cursor-pointer"
          >
            Quản lý Sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header Portal Injection */}
      <AdminHeaderPortal
        title="Quản Lý Nhân Viên"
        description="Phân quyền 2 cấp bậc: Quản trị viên (toàn quyền) & Nhân viên (sửa bài viết, sản phẩm)"
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Tìm theo họ tên, username, email..."
              className="pl-9 pr-4 py-2 w-[200px] sm:w-[260px] bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 dark:focus:ring-[#5865f2]/30 focus:border-[#5865f2]/40 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all shadow-xs"
            />
          </div>
        }
        actions={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors border-0 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm Nhân Viên Mới</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        }
      />

      {/* 2. Permanent Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] flex-shrink-0 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Filter className="w-3.5 h-3.5 text-[#5865f2]" />
            <span>Bộ Lọc:</span>
          </div>

          <div className="w-[190px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: 'ALL', label: 'Tất cả vai trò' },
                { value: 'ADMIN', label: 'Cấp 1 - Quản trị viên (ADMIN)' },
                { value: 'STAFF', label: 'Cấp 2 - Nhân viên (STAFF)' }
              ]}
              value={roleFilter}
              onChange={(val) => {
                setRoleFilter(val as any);
                setPage(0);
              }}
            />
          </div>

          <div className="w-[170px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                { value: 'ACTIVE', label: 'Đang hoạt động' },
                { value: 'INACTIVE', label: 'Đã tạm khóa' }
              ]}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val as any);
                setPage(0);
              }}
            />
          </div>

          <div className="w-[195px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: 'createdAt-desc', label: 'Mới nhất đến cũ nhất' },
                { value: 'createdAt-asc', label: 'Cũ nhất đến mới nhất' },
                { value: 'fullName-asc', label: 'Họ tên: A → Z' },
                { value: 'fullName-desc', label: 'Họ tên: Z → A' },
                { value: 'lastLogin-desc', label: 'Đăng nhập gần nhất' }
              ]}
              value={`${sortConfig?.key || 'createdAt'}-${sortConfig?.direction || 'desc'}`}
              onChange={(val) => {
                const [key, direction] = val.split('-');
                setSortConfig({ key, direction: direction as 'asc' | 'desc' });
                setPage(0);
              }}
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                setRoleFilter('ALL');
                setStatusFilter('ALL');
                setPage(0);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border border-rose-300 hover:border-rose-400 dark:border-rose-800/80 dark:hover:border-rose-700 bg-rose-50/60 hover:bg-rose-100/70 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5 shrink-0" />
              <span>Xóa bộ lọc ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1 whitespace-nowrap">
              Đã chọn: <strong className="text-gray-900 dark:text-white">{selectedIds.length}</strong>
            </span>

            {inactiveSelectedCount > 0 && (
              <button
                type="button"
                onClick={() => handleBulkToggleStatus('ACTIVE')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[4px] text-xs font-medium transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                title={`Kích hoạt ${inactiveSelectedCount} tài khoản đã chọn`}
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Kích hoạt ({inactiveSelectedCount})</span>
              </button>
            )}

            {activeSelectedCount > 0 && (
              <button
                type="button"
                onClick={() => handleBulkToggleStatus('INACTIVE')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-[4px] text-xs font-medium transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                title={`Tạm khóa ${activeSelectedCount} tài khoản đã chọn`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Tạm khóa ({activeSelectedCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-[4px] text-xs font-medium transition-colors border-0 cursor-pointer shadow-xs whitespace-nowrap"
              title={`Xóa ${selectedIds.length} nhân viên đã chọn`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{selectedIds.length === staffList.length ? `Xóa tất cả (${selectedIds.length})` : `Xóa (${selectedIds.length})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium px-1.5 py-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              Bỏ chọn
            </button>
          </div>
        )}
      </div>

      {/* 3. Collapsible Summary Card */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300 shadow-xs">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Đội Ngũ Nhân Sự</h3>
              {!isSummaryCollapsed && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{stats.total} nhân sự</span>
              )}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-blue-600 dark:text-blue-400">{stats.total} Tổng nhân sự</span>
                  <span className="text-purple-600 dark:text-purple-400">{stats.admins} Quản trị viên</span>
                  <span className="text-teal-600 dark:text-teal-400">{stats.staffs} Nhân viên</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{stats.actives} Đang hoạt động</span>
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
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng nhân sự</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">
                  {stats.total} <span className="text-xs font-normal text-gray-500">tài khoản</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Quản trị viên (Cấp 1)</span>
                </div>
                <div className="text-2xl font-medium text-purple-700 dark:text-purple-400">
                  {stats.admins} <span className="text-xs font-normal text-purple-600/80 dark:text-purple-400/80">toàn quyền</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-teal-100 dark:border-teal-900/30 bg-teal-50/50 dark:bg-teal-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-teal-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Nhân viên biên tập (Cấp 2)</span>
                </div>
                <div className="text-2xl font-medium text-teal-700 dark:text-teal-400">
                  {stats.staffs} <span className="text-xs font-normal text-teal-600/80 dark:text-teal-400/80">sửa SP, tin tức</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Đang hoạt động</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">
                  {stats.actives} <span className="text-xs font-normal text-gray-500">tài khoản</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Main Table Container */}
      <div className="flex-1 bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 flex flex-col min-h-0 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#5865f2] mb-3" />
            <p className="text-sm">Đang tải danh sách nhân viên...</p>
          </div>
        ) : sortedStaff.length === 0 ? (
          <div className="py-16 text-center text-gray-400 px-4">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Không tìm thấy nhân viên nào
            </h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Không có tài khoản nhân sự nào phù hợp với từ khóa hoặc bộ lọc đã chọn.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50/80 dark:bg-[#1a1b23]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 lg:px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs min-w-[200px] whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${
                          selectedIds.length === currentStaff.length && currentStaff.length > 0
                            ? 'bg-[#5865f2] border-[#5865f2]'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                        }`}
                        onClick={toggleSelectAll}
                      >
                        {selectedIds.length === currentStaff.length && currentStaff.length > 0 && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div
                        className="flex items-center cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide whitespace-nowrap"
                        onClick={() => handleSort('fullName')}
                      >
                        Nhân Sự <SortIcon columnKey="fullName" />
                      </div>
                    </div>
                  </th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 select-none uppercase tracking-wide min-w-[200px]">
                    <div className="flex items-center">Thông Tin Liên Hệ</div>
                  </th>
                  <th
                    className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center">Bộ Phận <SortIcon columnKey="department" /></div>
                  </th>
                  <th
                    className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[240px]"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">Cấp Bậc &amp; Phân Quyền <SortIcon columnKey="role" /></div>
                  </th>
                  <th
                    className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[130px]"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">Trạng Thái <SortIcon columnKey="status" /></div>
                  </th>
                  <th
                    className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[140px]"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">Ngày Tạo <SortIcon columnKey="createdAt" /></div>
                  </th>
                  <th
                    className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[150px]"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <div className="flex items-center">Đăng Nhập Gần Nhất <SortIcon columnKey="lastLogin" /></div>
                  </th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-16">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {currentStaff.map((staff) => {
                  const isAdmin = staff.role === 'ADMIN';
                  const isActive = staff.status === 'ACTIVE';
                  const isRootAdmin = staff.id === 1 || staff.username === 'admin';
                  const isSelected = selectedIds.includes(staff.id);

                  return (
                    <tr
                      key={staff.id}
                      className={`hover:bg-gray-50/75 dark:hover:bg-[#1a1b23]/50 transition-colors ${
                        isSelected ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="px-4 lg:px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#5865f2] border-[#5865f2]'
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                            }`}
                            onClick={() => toggleSelectRow(staff.id)}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>

                          <div
                            className={`w-8 h-8 rounded-[4px] flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                              isAdmin
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                                : 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60'
                            }`}
                          >
                            {staff.fullName.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5 truncate text-xs">
                              <span>{staff.fullName}</span>
                              {isRootAdmin && (
                                <span className="px-1.5 py-0.2 rounded-[4px] text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800">
                                  ROOT
                                </span>
                              )}
                              {staff.createdAt && (Date.now() - new Date(staff.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000) && (
                                <span className="px-1.5 py-0.2 rounded-[4px] text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                                  MỚI
                                </span>
                              )}
                            </div>
                            <div className="text-gray-400 text-[11px] font-mono">
                              @{staff.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60">
                        <div className="space-y-0.5 text-xs">
                          {staff.email ? (
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 truncate">
                              <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                              <span>{staff.email}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">Chưa có email</span>
                          )}
                          {staff.phone && (
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[11px]">
                              <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60">
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                          {staff.department || 'Chung'}
                        </span>
                      </td>

                      {/* Role & Permissions */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60">
                        {isAdmin ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 font-semibold text-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>Quản trị viên (Cấp 1)</span>
                          </div>
                        ) : (
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 font-medium text-xs">
                              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                              <span>Nhân viên (Cấp 2)</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5 max-w-[280px]">
                              {staff.permissions?.canManageStaff && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-[4px] text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                                  ⭐ Quản lý nhân sự
                                </span>
                              )}
                              {staff.permissions?.leads && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-[4px] text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                                  Leads / Báo giá
                                </span>
                              )}
                              {staff.permissions?.canDelete && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-[4px] text-[10px] bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
                                  Quyền xóa
                                </span>
                              )}
                              {staff.permissions?.products !== false && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-[4px] text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                  SP
                                </span>
                              )}
                              {staff.permissions?.articles !== false && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-[4px] text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                  Tin tức
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Đã khóa
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 text-gray-600 dark:text-gray-300 text-xs">
                        {staff.createdAt ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {safeFormatDate(staff.createdAt, 'dd/MM/yyyy')}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {safeFormatDate(staff.createdAt, 'HH:mm')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">—</span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 text-gray-500 dark:text-gray-400 text-xs">
                        {staff.lastLogin ? (
                          <span>{safeFormatDate(staff.lastLogin, 'dd/MM/yyyy HH:mm')}</span>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Chưa đăng nhập</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 text-center">
                        <div className="inline-flex items-center justify-center">
                          <ActionMenu
                            items={[
                              {
                                label: 'Chỉnh sửa thông tin',
                                icon: Edit2,
                                onClick: () => handleOpenEdit(staff)
                              },
                              {
                                label: isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản',
                                icon: isActive ? Lock : Unlock,
                                variant: isActive ? 'warning' : 'success',
                                onClick: () => handleToggleStatus(staff)
                              },
                              ...(!isRootAdmin
                                ? [
                                    {
                                      label: 'Xóa nhân viên',
                                      icon: Trash2,
                                      variant: 'danger' as const,
                                      separatorBefore: true,
                                      onClick: () => {
                                        setStaffToDelete(staff);
                                        setDeleteModalOpen(true);
                                      }
                                    }
                                  ]
                                : [])
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 52px Standard Pagination Footer */}
        <div className="px-4 py-3 bg-gray-50/50 dark:bg-[#1a1b23]/50 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>
              Hiển thị <strong className="text-gray-900 dark:text-white">{sortedStaff.length > 0 ? page * itemsPerPage + 1 : 0}</strong> -{' '}
              <strong className="text-gray-900 dark:text-white">{Math.min((page + 1) * itemsPerPage, sortedStaff.length)}</strong> trên tổng số{' '}
              <strong className="text-gray-900 dark:text-white">{sortedStaff.length}</strong> nhân sự
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-gray-700 dark:text-gray-300">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b23] text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. Add / Edit Staff Slide-Over Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-[#14151a] w-full max-w-4xl h-full flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300 shadow-2xl z-10">
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1b23]/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[4px] bg-[#5865f2]/10 text-[#5865f2] border border-[#5865f2]/20 flex items-center justify-center shadow-2xs">
                  {modalMode === 'add' ? <UserPlus className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                    <span>{modalMode === 'add' ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên'}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/60 text-[#5865f2] border border-indigo-200 dark:border-indigo-800">
                      {modalMode === 'add' ? 'Tạo mới' : `@${formData.username}`}
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {modalMode === 'add'
                      ? 'Thiết lập tài khoản người dùng và phân quyền chi tiết các chức năng'
                      : 'Cập nhật quyền hạn truy cập và thông tin hồ sơ nhân viên'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable Form) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/40 dark:bg-[#101114]">
              <form id="staff-form" onSubmit={handleSubmitForm} className="space-y-5 w-full">
                {/* CARD 1: THÔNG TIN TÀI KHOẢN & LIÊN HỆ */}
                <div className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#5865f2]" />
                      <span>Thông tin cá nhân & Tài khoản</span>
                    </h4>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Key className="w-3 h-3 text-gray-400" />
                      <span>Thông tin đăng nhập</span>
                    </span>
                  </div>

                  {/* Họ và tên */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>Họ và tên <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full h-[36px] px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                    />
                  </div>

                  {/* Tên đăng nhập & Mật khẩu */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-gray-400" />
                        <span>Tên đăng nhập <span className="text-rose-500">*</span></span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={modalMode === 'edit'}
                        placeholder="vd: an.nv"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })}
                        className="w-full h-[36px] px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] text-xs text-gray-900 dark:text-white font-mono placeholder-gray-400 focus:outline-none focus:border-[#5865f2] disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                        <span>Mật khẩu {modalMode === 'add' ? <span className="text-rose-500">*</span> : <span className="text-gray-400 text-[11px] font-normal">(để trống nếu không đổi)</span>}</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required={modalMode === 'add'}
                          placeholder={modalMode === 'add' ? 'Nhập mật khẩu khởi tạo' : 'Mật khẩu mới...'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full h-[36px] pl-3 pr-8 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>Email liên hệ</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email@vinex.vn"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-[36px] px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>Số điện thoại</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="09xx..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-[36px] px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span>Bộ phận làm việc</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nội dung & Sản phẩm, Phòng Kinh Doanh, Ban Biên Tập..."
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full h-[36px] px-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                    />
                  </div>
                </div>

                {/* CARD 2: CẤP BẬC & VAI TRÒ HỆ THỐNG */}
                <div className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5865f2]" />
                      <span>Cấp bậc & Quyền hạn truy cập <span className="text-rose-500">*</span></span>
                    </h4>
                    <span className="text-[11px] text-gray-400">Chọn vai trò chính</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Option 1: ADMIN */}
                    <div
                      onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                      className={`relative flex flex-col p-4 rounded-[4px] border-2 cursor-pointer transition-all ${
                        formData.role === 'ADMIN'
                          ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 shadow-xs ring-1 ring-purple-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-800 bg-gray-50/50 dark:bg-[#14151a]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-[4px] flex items-center justify-center ${
                            formData.role === 'ADMIN'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                          }`}>
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-gray-900 dark:text-white block">
                              Quản trị viên (ADMIN)
                            </span>
                            <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">
                              Cấp tối cao
                            </span>
                          </div>
                        </div>

                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          formData.role === 'ADMIN'
                            ? 'border-purple-600 bg-purple-600'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                        }`}>
                          {formData.role === 'ADMIN' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                        Toàn quyền thêm, sửa, xóa tài khoản nhân viên, cấu hình hệ thống &amp; toàn bộ nội dung.
                      </p>
                    </div>

                    {/* Option 2: STAFF */}
                    <div
                      onClick={() => setFormData({ ...formData, role: 'STAFF' })}
                      className={`relative flex flex-col p-4 rounded-[4px] border-2 cursor-pointer transition-all ${
                        formData.role === 'STAFF'
                          ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 shadow-xs ring-1 ring-teal-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-800 bg-gray-50/50 dark:bg-[#14151a]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-[4px] flex items-center justify-center ${
                            formData.role === 'STAFF'
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                          }`}>
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-gray-900 dark:text-white block">
                              Nhân viên (STAFF)
                            </span>
                            <span className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold">
                              Tùy biến quyền
                            </span>
                          </div>
                        </div>

                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          formData.role === 'STAFF'
                            ? 'border-teal-600 bg-teal-600'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                        }`}>
                          {formData.role === 'STAFF' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                        Được phép thao tác nội dung theo các danh mục được cấp phép chi tiết bên dưới.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CARD 3: PHÂN QUYỀN CHI TIẾT & CẤP QUYỀN NÂNG CAO */}
                <div className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-4 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#5865f2]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                        Phân quyền chi tiết & Cấp quyền nâng cao
                      </h4>
                    </div>

                    {formData.role === 'STAFF' && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              permissions: {
                                products: true,
                                articles: true,
                                categories: true,
                                media: true,
                                leads: false,
                                canDelete: false,
                                canManageStaff: false,
                              },
                            })
                          }
                          className="px-2.5 py-1 rounded-[4px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#14151a] hover:bg-gray-100 dark:hover:bg-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                        >
                          Cơ bản
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              permissions: {
                                products: true,
                                articles: true,
                                categories: true,
                                media: true,
                                leads: true,
                                canDelete: true,
                                canManageStaff: false,
                              },
                            })
                          }
                          className="px-2.5 py-1 rounded-[4px] border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Trưởng nhóm nội dung
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              permissions: {
                                products: true,
                                articles: true,
                                categories: true,
                                media: true,
                                leads: true,
                                canDelete: true,
                                canManageStaff: true,
                              },
                            })
                          }
                          className="px-2.5 py-1 rounded-[4px] border border-purple-200 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Toàn quyền (Nâng cao)
                        </button>
                      </div>
                    )}
                  </div>

                  {formData.role === 'ADMIN' ? (
                    <div className="p-4 rounded-[4px] bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3 text-xs text-purple-900 dark:text-purple-200">
                      <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold mb-1">Toàn quyền hệ thống được kích hoạt</div>
                        <p className="text-[11.5px] leading-relaxed text-purple-800 dark:text-purple-300">
                          Tài khoản <strong>Quản trị viên (ADMIN)</strong> tự động sở hữu tất cả các quyền hạn cao nhất: quản lý nhân sự, xóa dữ liệu, duyệt báo giá khách hàng và toàn quyền thay đổi cấu hình.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Products */}
                      <label className={`flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-colors ${
                        formData.permissions?.products !== false
                          ? 'border-[#5865f2]/60 bg-indigo-50/30 dark:bg-indigo-950/20'
                          : 'border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-[#14151a]'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.permissions?.products !== false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permissions: {
                                ...formData.permissions,
                                products: e.target.checked,
                              },
                            })
                          }
                          className="mt-0.5 rounded-[3px] text-[#5865f2] focus:ring-[#5865f2] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-amber-500" />
                            <span>Quản lý Sản phẩm</span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Thêm mới, sửa giá, tồn kho và hình ảnh nông sản</div>
                        </div>
                      </label>

                      {/* Articles */}
                      <label className={`flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-colors ${
                        formData.permissions?.articles !== false
                          ? 'border-[#5865f2]/60 bg-indigo-50/30 dark:bg-indigo-950/20'
                          : 'border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-[#14151a]'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.permissions?.articles !== false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permissions: {
                                ...formData.permissions,
                                articles: e.target.checked,
                              },
                            })
                          }
                          className="mt-0.5 rounded-[3px] text-[#5865f2] focus:ring-[#5865f2] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-blue-500" />
                            <span>Quản lý Bài viết & Tin tức</span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Viết bài, biên tập bài viết và cấu hình SEO Google</div>
                        </div>
                      </label>

                      {/* Categories */}
                      <label className={`flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-colors ${
                        formData.permissions?.categories !== false
                          ? 'border-[#5865f2]/60 bg-indigo-50/30 dark:bg-indigo-950/20'
                          : 'border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-[#14151a]'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.permissions?.categories !== false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permissions: {
                                ...formData.permissions,
                                categories: e.target.checked,
                              },
                            })
                          }
                          className="mt-0.5 rounded-[3px] text-[#5865f2] focus:ring-[#5865f2] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-purple-500" />
                            <span>Danh mục & Bộ lọc</span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Cấu hình cây phân loại sản phẩm và chuyên mục</div>
                        </div>
                      </label>

                      {/* Media */}
                      <label className={`flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-colors ${
                        formData.permissions?.media !== false
                          ? 'border-[#5865f2]/60 bg-indigo-50/30 dark:bg-indigo-950/20'
                          : 'border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-[#14151a]'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.permissions?.media !== false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permissions: {
                                ...formData.permissions,
                                media: e.target.checked,
                              },
                            })
                          }
                          className="mt-0.5 rounded-[3px] text-[#5865f2] focus:ring-[#5865f2] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Image className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Thư viện Media</span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Tải lên và quản lý kho hình ảnh tài nguyên</div>
                        </div>
                      </label>

                      {/* Elevated: Leads */}
                      <label className={`flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-colors ${
                        Boolean(formData.permissions?.leads)
                          ? 'border-blue-400 dark:border-blue-600 bg-blue-50/60 dark:bg-blue-950/30'
                          : 'border-blue-100 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10'
                      }`}>
                        <input
                          type="checkbox"
                          checked={Boolean(formData.permissions?.leads)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permissions: {
                                ...formData.permissions,
                                leads: e.target.checked,
                              },
                            })
                          }
                          className="mt-0.5 rounded-[3px] text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Receipt className="w-3.5 h-3.5 text-blue-600" />
                              <span>Yêu cầu & Báo giá (Leads B2B)</span>
                            </span>
                            <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                              Quyền cao
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Xem thông tin khách hàng liên hệ và gửi báo giá quà tặng</div>
                        </div>
                      </label>

                      {/* Elevated: Delete */}
                      <label className={`flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-colors ${
                        Boolean(formData.permissions?.canDelete)
                          ? 'border-rose-400 dark:border-rose-600 bg-rose-50/60 dark:bg-rose-950/30'
                          : 'border-rose-100 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10'
                      }`}>
                        <input
                          type="checkbox"
                          checked={Boolean(formData.permissions?.canDelete)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permissions: {
                                ...formData.permissions,
                                canDelete: e.target.checked,
                              },
                            })
                          }
                          className="mt-0.5 rounded-[3px] text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-rose-900 dark:text-rose-200 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Quyền Xóa Dữ Liệu</span>
                            </span>
                            <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800">
                              Quyền cao
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Được phép xóa sản phẩm hoặc bài viết khỏi hệ thống</div>
                        </div>
                      </label>

                      {/* Elevated: Manage Staff */}
                      <label className={`col-span-1 sm:col-span-2 flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-colors ${
                        Boolean(formData.permissions?.canManageStaff)
                          ? 'border-purple-400 dark:border-purple-600 bg-purple-50/60 dark:bg-purple-950/30'
                          : 'border-purple-100 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10'
                      }`}>
                        <input
                          type="checkbox"
                          checked={Boolean(formData.permissions?.canManageStaff)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              permissions: {
                                ...formData.permissions,
                                canManageStaff: e.target.checked,
                              },
                            })
                          }
                          className="mt-0.5 rounded-[3px] text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-purple-900 dark:text-purple-200 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4 text-purple-600" />
                              <span>Cho phép Quản lý & Phân quyền Nhân sự khác</span>
                            </span>
                            <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                              Quyền Quản Trị Viên
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Cấp quyền cho nhân viên này truy cập trang Quản lý nhân viên, thêm mới và phân quyền cho nhân viên cấp dưới</div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {/* CARD 4: TRẠNG THÁI TÀI KHOẢN */}
                <div className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#5865f2]" />
                      <span>Trạng thái tài khoản</span>
                    </h4>
                    <span className="text-[11px] text-gray-400">Tình trạng đăng nhập</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setFormData({ ...formData, status: 'ACTIVE' })}
                      className={`flex items-center justify-between p-3 rounded-[4px] border cursor-pointer transition-all ${
                        formData.status === 'ACTIVE'
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-500'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-[#14151a]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <div>
                          <span className="font-semibold text-xs text-gray-900 dark:text-white block">Đang hoạt động</span>
                          <span className="text-[10.5px] text-gray-500 dark:text-gray-400">Cho phép đăng nhập bình thường</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        formData.status === 'ACTIVE'
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                      }`}>
                        {formData.status === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, status: 'INACTIVE' })}
                      className={`flex items-center justify-between p-3 rounded-[4px] border cursor-pointer transition-all ${
                        formData.status === 'INACTIVE'
                          ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 shadow-xs ring-1 ring-rose-500'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-[#14151a]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                        <div>
                          <span className="font-semibold text-xs text-gray-900 dark:text-white block">Tạm khóa tài khoản</span>
                          <span className="text-[10.5px] text-gray-500 dark:text-gray-400">Chặn đăng nhập vào hệ thống</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        formData.status === 'INACTIVE'
                          ? 'border-rose-500 bg-rose-500'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                      }`}>
                        {formData.status === 'INACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Drawer Sticky Footer */}
            <div className="h-16 flex items-center justify-end gap-3 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="h-[36px] px-4 rounded-[4px] border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                form="staff-form"
                disabled={isSubmitting}
                className="h-[36px] px-5 rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-xs text-white font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : modalMode === 'add' ? (
                  <UserPlus className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{modalMode === 'add' ? 'Tạo nhân viên' : 'Lưu thay đổi'}</span>
              </button>
            </div>

        </div>
      </div>
    )}

      {/* 7. Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa nhân viên"
        description={`Bạn có chắc chắn muốn xóa tài khoản "${staffToDelete?.fullName}" (@${staffToDelete?.username})? Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        variant="danger"
      />
    </div>
  );
}
