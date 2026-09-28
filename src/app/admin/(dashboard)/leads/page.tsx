"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Filter, MessageSquare, CheckCircle2, Plus, Trash2, X, 
  ChevronLeft, ChevronRight, Phone, Mail, Calendar, User, 
  FileText, Check, ArrowUpDown, ChevronDown, ChevronUp, Gift, Package, 
  Clock, Tag, Building2, Sparkles, Eye, PhoneCall, MessageCircle, Send,
  Download, AlertTriangle, ShieldAlert, CheckCircle, RefreshCw, FileSpreadsheet,
  FileCheck, ExternalLink, Paperclip, UserCheck, AlertCircle, History,
  DollarSign, ShoppingCart, HelpCircle, Handshake, Store, Edit3, ArrowRight, Save,
  Building, Globe, Radio, UserPlus, Target, Layers, Hash, Coins, CalendarClock,
  MessageSquareText, ShieldCheck, CircleDollarSign, MapPin, CalendarCheck, Barcode,
  Receipt, CheckSquare, ArrowRightCircle, Activity, Info, Users, Flame, FolderOpen, Loader2
} from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { safeFormatDate } from '@/admin-utils/dateUtils';
import CustomDropdown from '@/admin-components/ui/CustomDropdown';
import { ActionMenu } from '@/admin-components/ui/ActionMenu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/admin-components/ui/dropdown-menu';
import { toast } from 'sonner';
import { AdminHeaderPortal } from '@/admin-components/layout/AdminHeaderPortal';
import { useConfirm } from '@/hooks/useConfirm';
import * as XLSX from 'xlsx';

import {
  InquiryPurpose,
  PURPOSE_DEFINITIONS,
  PURPOSE_MAP,
  PURPOSE_CONFIG,
  STATUS_CONFIG,
  CLOSING_RESULTS,
  PRIORITY_CONFIG,
  OCCASION_OPTIONS,
  QUANTITY_OPTIONS,
  BUDGET_PER_ITEM_OPTIONS,
  BUDGET_TOTAL_OPTIONS,
  BRANDING_OPTIONS,
  DELIVERY_PLAN_OPTIONS,
  INVOICE_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  ISSUE_CATEGORY_OPTIONS,
  PARTNERSHIP_TYPE_OPTIONS
} from '@/lib/constants/inquiryConstants';

// Dedicated Assignee Dropdown with Search, Autofocus & Fixed Width
interface AssigneeDropdownProps {
  lead: any;
  staffList: any[];
  onAssign: (lead: any, assigneeName: string) => Promise<void>;
  isAssignedTo: (leadAssignee: string, staff: any) => boolean;
  className?: string;
}

function AssigneeDropdown({
  lead,
  staffList,
  onAssign,
  isAssignedTo,
  className = ''
}: AssigneeDropdownProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredStaff = useMemo(() => {
    if (!searchTerm.trim()) return staffList;
    const q = searchTerm.toLowerCase().trim();
    return staffList.filter((s) => {
      const matchName = (s.fullName || '').toLowerCase().includes(q);
      const matchDept = (s.department || '').toLowerCase().includes(q);
      const matchUser = (s.username || '').toLowerCase().includes(q);
      return matchName || matchDept || matchUser;
    });
  }, [staffList, searchTerm]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={`w-full h-[28px] inline-flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-medium border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-[#14151a] hover:bg-gray-50 dark:hover:bg-[#1f2129] text-gray-800 dark:text-gray-200 cursor-pointer transition-all outline-none shadow-2xs select-none ${className}`}
      >
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {lead?.assignee ? (
            <>
              <div className="w-4 h-4 rounded-full bg-[#5865f2]/10 dark:bg-[#5865f2]/20 text-[#5865f2] dark:text-[#7983f5] font-bold text-[9px] flex items-center justify-center shrink-0">
                {lead.assignee.charAt(0)}
              </div>
              <span className="truncate">{lead.assignee.split('(')[0].trim()}</span>
            </>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 italic text-[11px] truncate">-- Chưa giao --</span>
          )}
        </div>
        <ChevronDown className={`w-3 h-3 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 p-0 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 shadow-xl rounded-[4px] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Search Input with AutoFocus */}
        <div 
          className="p-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' && filteredStaff.length === 1) {
                  onAssign(lead, filteredStaff[0].fullName);
                  setIsOpen(false);
                }
              }}
              placeholder="Tìm theo tên, phòng ban..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5865f2] transition-all"
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
          <DropdownMenuItem
            onClick={() => {
              onAssign(lead, '');
              setIsOpen(false);
            }}
            className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-[4px] cursor-pointer transition-colors ${
              !lead?.assignee 
                ? 'bg-gray-100 dark:bg-[#262930] font-semibold text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
            }`}
          >
            <span className="italic">-- Chưa giao / Hủy phân công --</span>
            {!lead?.assignee && <Check className="w-3.5 h-3.5 text-[#5865f2]" />}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center justify-between">
            <span>Nhân viên ({filteredStaff.length})</span>
            {searchTerm && (
              <span className="text-[9px] text-[#5865f2] font-normal lowercase">kết quả lọc</span>
            )}
          </div>

          {filteredStaff.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-gray-400 italic">
              Không tìm thấy nhân viên phù hợp
            </div>
          ) : (
            filteredStaff.map((s) => {
              const isSelected = isAssignedTo(lead?.assignee, s);
              return (
                <DropdownMenuItem
                  key={s.id || s.username}
                  onClick={() => {
                    onAssign(lead, s.fullName);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-[4px] cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-gray-100 dark:bg-[#262930] font-semibold text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-[#5865f2]/10 dark:bg-[#5865f2]/20 text-[#5865f2] dark:text-[#7983f5] font-bold text-[10px] flex items-center justify-center shrink-0">
                      {s.fullName.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{s.fullName}</span>
                      {s.department && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{s.department}</span>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#5865f2] shrink-0" />}
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function LeadsPage() {
  const { confirm } = useConfirm();
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState<any[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'UNREAD' | 'UNASSIGNED' | 'OVERDUE' | 'TODAY'>('ALL');

  // Pagination & Sorting & Selection
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Modals & Drawers
  const [activeLead, setActiveLead] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<'OVERVIEW' | 'ACTIVITIES' | 'QUOTATIONS' | 'AUDIT'>('OVERVIEW');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // Workflow Dialogs inside Detail
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
  const [closingForm, setClosingForm] = useState({
    closingResult: 'RESOLVED',
    closingNote: '',
    linkedOrderCode: '',
    orderValue: ''
  });

  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  // Activity Form State
  const [newActivity, setNewActivity] = useState({
    type: 'NOTE',
    content: '',
    contactResult: 'CONNECTED',
    nextAction: '',
    nextActionDeadline: '',
    attachments: [] as any[]
  });
  const [isSubmittingActivity, setIsSubmittingActivity] = useState(false);

  // Quotation Form State
  const [newQuotation, setNewQuotation] = useState({
    quoteCode: '',
    version: 'v1',
    value: '',
    validUntil: '',
    fileUrl: '',
    fileName: '',
    notes: ''
  });
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Verified Info State
  const [verifiedInfo, setVerifiedInfo] = useState({
    verifiedQuantity: '',
    verifiedBudget: '',
    verifiedDeliveryLocation: '',
    verifiedDeliveryDate: '',
    verifiedNeedInvoice: false,
    notes: ''
  });

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/leads');
      if (res.data) {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData(res.data.leads || []);
          setStats(res.data.stats || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Không thể tải danh sách yêu cầu');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Staff list from API
  const fetchStaff = async () => {
    try {
      const res = await apiClient.get('/staff');
      if (res.data && Array.isArray(res.data)) {
        // Prefer active staff
        const activeStaff = res.data.filter((s: any) => s.status === 'ACTIVE');
        setStaffList(activeStaff.length > 0 ? activeStaff : res.data);
      }
    } catch (e) {
      console.warn('Failed to fetch staff list:', e);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStaff();
  }, []);

  const isAssignedTo = (leadAssignee: string, staff: any) => {
    if (!leadAssignee || !staff) return false;
    const name = staff.fullName || '';
    return (
      leadAssignee === name ||
      leadAssignee.startsWith(name) ||
      leadAssignee.includes(name)
    );
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return data.filter((lead) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = lead.requestCode?.toLowerCase().includes(q);
        const matchName = lead.customerName?.toLowerCase().includes(q);
        const matchCompany = lead.companyName?.toLowerCase().includes(q);
        const matchPhone = lead.phone?.toLowerCase().includes(q);
        const matchEmail = lead.email?.toLowerCase().includes(q);
        const matchNotes = lead.notes?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchCompany && !matchPhone && !matchEmail && !matchNotes) {
          return false;
        }
      }

      // Purpose
      if (purposeFilter !== 'ALL' && lead.purpose !== purposeFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'ALL' && lead.status !== statusFilter) {
        return false;
      }

      // Priority
      if (priorityFilter !== 'ALL' && lead.priority !== priorityFilter) {
        return false;
      }

      // Assignee
      if (assigneeFilter !== 'ALL') {
        if (assigneeFilter === 'UNASSIGNED') {
          if (lead.assignee) return false;
        } else {
          if (!lead.assignee || (!lead.assignee.includes(assigneeFilter) && !assigneeFilter.includes(lead.assignee))) {
            return false;
          }
        }
      }

      // Quick Filters
      if (quickFilter === 'UNREAD' && lead.isRead) return false;
      if (quickFilter === 'UNASSIGNED' && (lead.assignee || lead.status === 'CLOSED')) return false;
      if (quickFilter === 'OVERDUE' && !lead.isFirstResponseOverdue && !lead.isFollowUpOverdue) return false;
      if (quickFilter === 'TODAY') {
        const today = new Date().toDateString();
        if (new Date(lead.createdAt).toDateString() !== today) return false;
      }

      return true;
    });
  }, [data, searchQuery, purposeFilter, statusFilter, priorityFilter, assigneeFilter, quickFilter]);

  const activeFiltersCount = 
    (purposeFilter !== 'ALL' ? 1 : 0) + 
    (statusFilter !== 'ALL' ? 1 : 0) + 
    (priorityFilter !== 'ALL' ? 1 : 0) + 
    (assigneeFilter !== 'ALL' ? 1 : 0) + 
    (quickFilter !== 'ALL' ? 1 : 0);

  // Sorted Leads
  const sortedLeads = useMemo(() => {
    if (!sortConfig) return filteredLeads;
    return [...filteredLeads].sort((a, b) => {
      const aVal = (a as any)[sortConfig.key] || '';
      const bVal = (b as any)[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortConfig]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = page * itemsPerPage;
    return sortedLeads.slice(start, start + itemsPerPage);
  }, [sortedLeads, page, itemsPerPage]);

  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((l) => String(l.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    confirm({
      title: 'Xóa hàng loạt yêu cầu tư vấn?',
      description: `Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.length} yêu cầu đã chọn khỏi hệ thống?`,
      variant: 'danger',
      confirmText: 'Xác nhận xóa',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => apiClient.delete(`/leads/${id}`)));
          toast.success('Đã xóa các yêu cầu đã chọn');
          setData(prev => prev.filter(l => !selectedIds.includes(String(l.id))));
          setSelectedIds([]);
        } catch (e) {
          toast.error('Có lỗi xảy ra khi xóa yêu cầu');
        }
      }
    });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  // Open Detail Drawer
  const handleOpenDetail = async (lead: any) => {
    setActiveLead(lead);
    setIsDetailOpen(true);
    setDetailTab('OVERVIEW');
    setVerifiedInfo({
      verifiedQuantity: lead.verifiedInfo?.verifiedQuantity || lead.quantity || '',
      verifiedBudget: lead.verifiedInfo?.verifiedBudget || lead.budget || '',
      verifiedDeliveryLocation: lead.verifiedInfo?.verifiedDeliveryLocation || lead.location || '',
      verifiedDeliveryDate: lead.verifiedInfo?.verifiedDeliveryDate || lead.timeline || '',
      verifiedNeedInvoice: Boolean(lead.verifiedInfo?.verifiedNeedInvoice),
      notes: lead.verifiedInfo?.notes || ''
    });

    // Mark as read if unread
    if (!lead.isRead) {
      try {
        await apiClient.patch(`/leads/${lead.id}`, { isRead: true });
        setData((prev) => prev.map((l) => (l.id === lead.id ? { ...l, isRead: true } : l)));
        setActiveLead((prev: any) => (prev ? { ...prev, isRead: true } : prev));
      } catch (e) {
        console.warn('Error marking read:', e);
      }
    }
  };

  // Quick Status Change
  const handleQuickStatusChange = async (lead: any, newStatus: string) => {
    if (newStatus === 'CLOSED') {
      setActiveLead(lead);
      setIsClosingModalOpen(true);
      return;
    }

    if (newStatus === 'PROCESSING' && !lead.assignee) {
      toast.error('Vui lòng phân công người phụ trách trước khi chuyển sang Đang xử lý');
      handleOpenDetail(lead);
      return;
    }

    try {
      const res = await apiClient.patch(`/leads/${lead.id}`, {
        status: newStatus,
        updatedBy: 'Admin'
      });
      toast.success(`Đã chuyển trạng thái sang: ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      setData((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l)));
      if (activeLead?.id === lead.id) {
        setActiveLead((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (e: any) {
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  // Quick Assignee Change
  const handleQuickAssignee = async (lead: any, assignee: string) => {
    try {
      await apiClient.patch(`/leads/${lead.id}`, {
        assignee,
        updatedBy: 'Admin'
      });
      toast.success(`Đã phân công cho: ${assignee}`);
      setData((prev) => prev.map((l) => (l.id === lead.id ? { ...l, assignee, status: l.status === 'NEW' ? 'ASSIGNED' : l.status } : l)));
      if (activeLead?.id === lead.id) {
        setActiveLead((prev: any) => ({ ...prev, assignee }));
      }
    } catch (e) {
      toast.error('Lỗi phân công');
    }
  };

  // Quick Priority Change
  const handleQuickPriorityChange = async (lead: any, newPriority: string) => {
    try {
      const res = await apiClient.patch(`/leads/${lead.id}`, {
        priority: newPriority,
        updatedBy: 'Admin'
      });
      const updatedLead = res.data || { ...lead, priority: newPriority };
      toast.success(`Đã đổi mức ưu tiên: ${PRIORITY_CONFIG[newPriority]?.label || newPriority}`);
      setData((prev) => prev.map((l) => (l.id === lead.id ? { ...l, priority: newPriority } : l)));
      if (activeLead?.id === lead.id) {
        setActiveLead((prev: any) => ({
          ...prev,
          priority: newPriority,
          auditLog: updatedLead.auditLog || prev.auditLog
        }));
      }
    } catch (e) {
      toast.error('Lỗi cập nhật mức ưu tiên');
    }
  };

  // Bulk Priority Change
  const handleBulkPriority = async (newPriority: string) => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          apiClient.patch(`/leads/${id}`, {
            priority: newPriority,
            updatedBy: 'Admin'
          })
        )
      );
      toast.success(`Đã cập nhật ưu tiên [${PRIORITY_CONFIG[newPriority]?.label || newPriority}] cho ${selectedIds.length} yêu cầu`);
      setData((prev) =>
        prev.map((l) => (selectedIds.includes(l.id) ? { ...l, priority: newPriority } : l))
      );
      setSelectedIds([]);
    } catch (e) {
      toast.error('Lỗi khi cập nhật hàng loạt mức ưu tiên');
    }
  };

  // Submit Activity
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;
    if (!newActivity.content.trim()) {
      toast.error('Vui lòng nhập nội dung hoạt động / ghi chú');
      return;
    }

    setIsSubmittingActivity(true);
    try {
      const res = await apiClient.patch(`/leads/${activeLead.id}`, {
        newActivity,
        updatedBy: 'Admin'
      });
      toast.success('Đã thêm hoạt động vào dòng thời gian');
      setActiveLead(res.data);
      setData((prev) => prev.map((l) => (l.id === activeLead.id ? res.data : l)));
      setNewActivity({
        type: 'NOTE',
        content: '',
        contactResult: 'CONNECTED',
        nextAction: '',
        nextActionDeadline: '',
        attachments: []
      });
    } catch (e) {
      toast.error('Lỗi khi thêm hoạt động');
    } finally {
      setIsSubmittingActivity(false);
    }
  };

  // Submit Quotation
  const handleAddQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;
    if (!newQuotation.value) {
      toast.error('Vui lòng nhập giá trị báo giá dự kiến');
      return;
    }

    setIsSubmittingQuote(true);
    try {
      const res = await apiClient.patch(`/leads/${activeLead.id}`, {
        newQuotation,
        status: 'WAITING_CUSTOMER', // Automatically set to waiting customer as per Section 6
        updatedBy: 'Admin'
      });
      toast.success('Đã lưu phiên bản báo giá và chuyển sang Chờ khách phản hồi');
      setActiveLead(res.data);
      setData((prev) => prev.map((l) => (l.id === activeLead.id ? res.data : l)));
      setNewQuotation({
        quoteCode: '',
        version: 'v' + ((res.data.quotations?.length || 0) + 1),
        value: '',
        validUntil: '',
        fileUrl: '',
        fileName: '',
        notes: ''
      });
    } catch (e) {
      toast.error('Lỗi khi tạo báo giá');
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  // Save Verified Information
  const handleSaveVerifiedInfo = async () => {
    if (!activeLead) return;
    try {
      const res = await apiClient.patch(`/leads/${activeLead.id}`, {
        verifiedInfo,
        updatedBy: 'Admin'
      });
      toast.success('Đã lưu thông tin xác minh');
      setActiveLead(res.data);
      setData((prev) => prev.map((l) => (l.id === activeLead.id ? res.data : l)));
    } catch (e) {
      toast.error('Lỗi khi lưu thông tin xác minh');
    }
  };

  // Close Lead Confirmation
  const handleConfirmClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    try {
      const res = await apiClient.patch(`/leads/${activeLead.id}`, {
        status: 'CLOSED',
        closingResult: closingForm.closingResult,
        closingNote: closingForm.closingNote,
        linkedOrderCode: closingForm.linkedOrderCode,
        orderValue: closingForm.orderValue ? Number(closingForm.orderValue) : null,
        updatedBy: 'Admin'
      });
      toast.success('Đã đóng yêu cầu với kết quả rõ ràng');
      setIsClosingModalOpen(false);
      setActiveLead(res.data);
      setData((prev) => prev.map((l) => (l.id === activeLead.id ? res.data : l)));
    } catch (e) {
      toast.error('Lỗi khi đóng yêu cầu');
    }
  };

  // Reopen Lead Confirmation
  const handleConfirmReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    try {
      const res = await apiClient.patch(`/leads/${activeLead.id}`, {
        status: 'PROCESSING',
        reopenReason: reopenReason || 'Mở lại để tiếp tục tư vấn',
        updatedBy: 'Admin'
      });
      toast.success('Đã mở lại yêu cầu và lưu vào lịch sử');
      setIsReopenModalOpen(false);
      setReopenReason('');
      setActiveLead(res.data);
      setData((prev) => prev.map((l) => (l.id === activeLead.id ? res.data : l)));
    } catch (e) {
      toast.error('Lỗi khi mở lại yêu cầu');
    }
  };

  // Delete Lead
  const handleDeleteLead = (leadId: number) => {
    confirm({
      title: 'Xóa yêu cầu tư vấn?',
      description: 'Hành động này sẽ xóa vĩnh viễn yêu cầu và toàn bộ nhật ký liên quan. Bạn có chắc chắn không?',
      variant: 'danger',
      confirmText: 'Xác nhận xóa',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/leads/${leadId}`);
          toast.success('Đã xóa yêu cầu thành công');
          setData((prev) => prev.filter((l) => l.id !== leadId));
          if (activeLead?.id === leadId) {
            setIsDetailOpen(false);
            setActiveLead(null);
          }
        } catch (e) {
          toast.error('Lỗi khi xóa yêu cầu');
        }
      }
    });
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (filteredLeads.length === 0) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }

    const exportRows = filteredLeads.map((l) => ({
      'Mã yêu cầu': l.requestCode || `REQ-${l.id}`,
      'Thời gian nhận': safeFormatDate(l.createdAt),
      'Họ tên khách hàng': l.customerName,
      'Công ty / Đơn vị': l.companyName || '',
      'Số điện thoại': l.phone,
      'Email': l.email || '',
      'Mục đích liên hệ': PURPOSE_CONFIG[l.purpose]?.label || l.productGroup || l.purpose,
      'Kênh ưu tiên': l.preferredChannel || 'Điện thoại',
      'Giờ tiện liên hệ': l.preferredTime || '',
      'Trạng thái xử lý': STATUS_CONFIG[l.status]?.label || l.status,
      'Mức ưu tiên': PRIORITY_CONFIG[l.priority]?.label || 'Bình thường',
      'Người phụ trách': l.assignee || 'Chưa phân công',
      'Quy mô (Số lượng)': l.quantity || l.details?.quantity || l.details?.giftQuantity || '',
      'Ngân sách': l.budget || l.details?.budgetRange || '',
      'Hẹn xử lý tiếp': l.nextFollowUpDate || '',
      'Liên hệ gần nhất': l.lastContactDate ? safeFormatDate(l.lastContactDate) : '',
      'Kết quả đóng': CLOSING_RESULTS[l.closingResult]?.label || l.closingResult || '',
      'Mã đơn hàng liên kết': l.linkedOrderCode || '',
      'Doanh thu đơn hàng (VNĐ)': l.orderValue || 0,
      'Nguồn': l.source || 'Website',
      'URL nguồn': l.sourceUrl || '',
      'Ghi chú ban đầu': l.notes || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Yeu_Cau_Khach_Hang');
    XLSX.writeFile(wb, `VINEX_YeuCau_KhachHang_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success(`Đã xuất ${exportRows.length} yêu cầu ra file Excel thành công!`);
  };

  return (
    <div className="h-full flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header Portal Injection */}
      <AdminHeaderPortal
        title="Quản Lý Yêu Cầu Khách Hàng"
        description="Quy trình khép kín: Tiếp nhận → Phân công → Báo giá & Chuyển đổi khách hàng"
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
              placeholder="Tìm Mã YC, Khách hàng, SĐT, Email..."
              className="pl-9 pr-4 py-2 w-[200px] sm:w-[260px] bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 dark:focus:ring-[#5865f2]/30 focus:border-[#5865f2]/40 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all shadow-xs"
            />
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLeads}
              disabled={isLoading}
              className="px-3 py-2 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất Excel</span>
            </button>
          </div>
        }
      />

      {/* 2. Permanent Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[4px] flex-shrink-0 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Filter className="w-3.5 h-3.5 text-[#5865f2]" />
            <span>Bộ Lọc:</span>
          </div>

          <div className="w-[170px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: 'ALL', label: 'Tất cả nhu cầu' },
                ...Object.entries(PURPOSE_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))
              ]}
              value={purposeFilter}
              onChange={(val) => {
                setPurposeFilter(val);
                setPage(0);
              }}
            />
          </div>

          <div className="w-[170px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))
              ]}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(0);
              }}
            />
          </div>

          <div className="w-[150px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: 'ALL', label: 'Mọi ưu tiên' },
                { value: 'URGENT', label: 'Khẩn cấp' },
                { value: 'HIGH', label: 'Cao' },
                { value: 'NORMAL', label: 'Bình thường' }
              ]}
              value={priorityFilter}
              onChange={(val) => {
                setPriorityFilter(val);
                setPage(0);
              }}
            />
          </div>

          <div className="w-[180px]">
            <CustomDropdown
              className="w-full"
              options={[
                { value: 'ALL', label: 'Mọi người phụ trách' },
                { value: 'UNASSIGNED', label: '-- Chưa phân công --' },
                ...staffList.map((s) => ({
                  value: s.fullName,
                  label: s.department ? `${s.fullName} (${s.department})` : s.fullName
                }))
              ]}
              value={assigneeFilter}
              onChange={(val) => {
                setAssigneeFilter(val);
                setPage(0);
              }}
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                setPurposeFilter('ALL');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setAssigneeFilter('ALL');
                setQuickFilter('ALL');
                setPage(0);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border border-rose-300 hover:border-rose-400 dark:border-rose-800/80 dark:hover:border-rose-700 bg-rose-50/60 hover:bg-rose-100/70 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5 shrink-0" />
              <span>Xóa bộ lọc ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'UNREAD', label: 'Chưa xem', badge: data.filter((l) => !l.isRead).length },
              { id: 'UNASSIGNED', label: 'Chưa phân công', badge: data.filter((l) => !l.assignee && l.status !== 'CLOSED').length },
              { id: 'OVERDUE', label: 'Quá hạn', badge: data.filter((l) => l.isFirstResponseOverdue || l.isFollowUpOverdue).length },
              { id: 'TODAY', label: 'Hôm nay' }
            ].map((p) => {
              const active = quickFilter === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setQuickFilter(p.id as any);
                    setPage(0);
                  }}
                  className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1 cursor-pointer border ${
                    active
                      ? 'bg-[#5865f2] border-[#5865f2] text-white shadow-xs'
                      : 'bg-gray-50 dark:bg-[#1a1b23] border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span>{p.label}</span>
                  {p.badge !== undefined && p.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-[4px] text-[10px] font-bold ${
                        active
                          ? 'bg-white text-[#5865f2]'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {p.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-xs font-semibold transition-colors border-0 cursor-pointer shadow-xs">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Ưu tiên ({selectedIds.length})</span>
                  <ChevronDown className="w-3 h-3 opacity-80" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 p-1.5 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 shadow-xl rounded-[4px] z-50">
                  <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Đổi ưu tiên {selectedIds.length} mục
                  </div>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                    <DropdownMenuItem
                      key={k}
                      onClick={() => handleBulkPriority(k)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-[4px] cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/70"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        k === 'URGENT' ? 'bg-rose-500' :
                        k === 'HIGH' ? 'bg-orange-500' :
                        'bg-slate-400'
                      }`} />
                      <span>{v.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-[4px] text-xs font-medium transition-colors border-0 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa {selectedIds.length} mục
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Collapsible Summary Card */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0 transition-all duration-300 shadow-xs">
        <div className={`p-4 ${isSummaryCollapsed ? 'pb-4' : 'sm:p-5 sm:pb-5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">Tổng Quan Yêu Cầu &amp; Chuyển Đổi</h3>
              {!isSummaryCollapsed && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{stats?.total ?? data.length} yêu cầu</span>
              )}
            </div>

            {isSummaryCollapsed && (
              <div className="flex-1 flex items-center justify-end px-6 gap-5">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-blue-600 dark:text-blue-400">{stats?.total ?? data.length} Tổng yêu cầu</span>
                  <span className="text-purple-600 dark:text-purple-400">{stats?.new ?? data.filter((l) => l.status === 'NEW').length} Mới tiếp nhận</span>
                  <span className="text-amber-600 dark:text-amber-400">{stats?.processing ?? data.filter((l) => l.status === 'PROCESSING' || l.status === 'WAITING_CUSTOMER').length} Đang tư vấn</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{data.filter((l) => l.closingResult === 'ORDER_CREATED').length} Đơn thành công</span>
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
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tổng yêu cầu</span>
                </div>
                <div className="text-2xl font-medium text-blue-700 dark:text-blue-400">
                  {stats?.total ?? data.length} <span className="text-xs font-normal text-gray-500">yêu cầu</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Mới tiếp nhận</span>
                </div>
                <div className="text-2xl font-medium text-purple-700 dark:text-purple-400">
                  {stats?.new ?? data.filter((l) => l.status === 'NEW').length} <span className="text-xs font-normal text-purple-600/80 dark:text-purple-400/80">cần phân công</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Đang tư vấn / Báo giá</span>
                </div>
                <div className="text-2xl font-medium text-amber-700 dark:text-amber-400">
                  {stats?.processing ?? data.filter((l) => l.status === 'PROCESSING' || l.status === 'WAITING_CUSTOMER').length} <span className="text-xs font-normal text-amber-600/80 dark:text-amber-400/80">yêu cầu</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-[4px]"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Chốt đơn thành công</span>
                </div>
                <div className="text-2xl font-medium text-emerald-700 dark:text-emerald-400">
                  {data.filter((l) => l.closingResult === 'ORDER_CREATED').length} <span className="text-xs font-normal text-gray-500">đơn</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Main Table Container */}
      <div className="flex-1 bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 flex flex-col min-h-0 overflow-hidden shadow-sm">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50/80 dark:bg-[#1a1b23]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 lg:px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs min-w-[150px] whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${
                          selectedIds.length === paginatedData.length && paginatedData.length > 0
                            ? 'bg-[#5865f2] border-[#5865f2]'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                        }`}
                        onClick={toggleSelectAll}
                      >
                        {selectedIds.length === paginatedData.length && paginatedData.length > 0 && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div
                        className="flex items-center cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide whitespace-nowrap"
                        onClick={() => handleSort('requestCode')}
                      >
                        Mã &amp; Thời Gian <SortIcon columnKey="requestCode" />
                      </div>
                    </div>
                  </th>
                  <th
                    className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[200px]"
                    onClick={() => handleSort('customerName')}
                  >
                    <div className="flex items-center">Khách Hàng <SortIcon columnKey="customerName" /></div>
                  </th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 select-none uppercase tracking-wide min-w-[180px]">
                    <div className="flex items-center">Liên Hệ</div>
                  </th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 select-none uppercase tracking-wide min-w-[170px]">
                    <div className="flex items-center">Nhu Cầu</div>
                  </th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 select-none uppercase tracking-wide min-w-[200px]">
                    <div className="flex items-center">Nội Dung Tóm Tắt</div>
                  </th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 select-none uppercase tracking-wide min-w-[140px]">
                    <div className="flex items-center">Quy Mô / Ngân Sách</div>
                  </th>
                  <th
                    className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[160px]"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">Trạng Thái <SortIcon columnKey="status" /></div>
                  </th>
                  <th
                    className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none uppercase tracking-wide min-w-[110px]"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center">Ưu Tiên <SortIcon columnKey="priority" /></div>
                  </th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 select-none uppercase tracking-wide w-[170px] min-w-[170px] max-w-[170px]">
                    <div className="flex items-center">Phụ Trách</div>
                  </th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs border-l border-gray-200 dark:border-gray-800 text-center w-16">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin text-[#5865f2] mb-4" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Đang tải danh sách yêu cầu...</h3>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
                          <FolderOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Không có yêu cầu nào</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Chưa có yêu cầu phù hợp với bộ lọc tìm kiếm.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setPurposeFilter('ALL');
                            setStatusFilter('ALL');
                            setPriorityFilter('ALL');
                            setAssigneeFilter('ALL');
                            setQuickFilter('ALL');
                            setPage(0);
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-sm font-medium transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" /> Đặt Lại Bộ Lọc
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((lead) => {
                  const purposeInfo = PURPOSE_CONFIG[lead.purpose] || PURPOSE_CONFIG['OTHER'];
                  const statusInfo = STATUS_CONFIG[lead.status] || STATUS_CONFIG['NEW'];
                  const priorityInfo = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG['NORMAL'];
                  const PurposeIcon = purposeInfo.icon;
                  const isSelected = selectedIds.includes(String(lead.id));

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-gray-50/75 dark:hover:bg-[#1a1b23]/50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                      } ${!lead.isRead ? 'font-medium' : ''}`}
                      onClick={() => handleOpenDetail(lead)}
                    >
                      {/* Checkbox & Request Code */}
                      <td className="px-4 lg:px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#5865f2] border-[#5865f2]'
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectRow(String(lead.id));
                            }}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              {!lead.isRead && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block shrink-0" title="Chưa xem"></span>
                              )}
                              <span className="font-mono font-semibold text-gray-900 dark:text-white text-xs">
                                {lead.requestCode || `REQ-${lead.id}`}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {safeFormatDate(lead.createdAt)}
                            </div>
                            {lead.isFirstResponseOverdue && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-[4px] text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-medium mt-1">
                                <AlertTriangle className="w-2.5 h-2.5" /> Quá hạn phản hồi (&gt;4h)
                              </span>
                            )}
                            {lead.isFollowUpOverdue && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-[4px] text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium mt-1">
                                <Clock className="w-2.5 h-2.5" /> Quá hạn hẹn gọi
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60">
                        <div className="font-medium text-gray-900 dark:text-white line-clamp-1 text-xs">
                          {lead.customerName}
                        </div>
                        {lead.companyName ? (
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                            <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{lead.companyName}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-gray-400 font-light">Cá nhân</div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 whitespace-nowrap">
                        {lead.phone && (
                          <div className="flex items-center gap-1 text-gray-800 dark:text-gray-200 text-xs">
                            <Phone className="w-3 h-3 text-[#5865f2] shrink-0" />
                            <span className="font-mono">{lead.phone}</span>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate max-w-[140px]">{lead.email}</span>
                          </div>
                        )}
                        {lead.preferredChannel && (
                          <span className="inline-block text-[10px] text-gray-400 mt-0.5">
                            Ưu tiên: {lead.preferredChannel}
                          </span>
                        )}
                      </td>

                      {/* Purpose */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold border ${purposeInfo.color}`}>
                          <PurposeIcon className="w-3 h-3 shrink-0" />
                          <span>{purposeInfo.label}</span>
                        </span>
                      </td>

                      {/* Summary */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 max-w-[200px]">
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed text-xs">
                          {lead.details?.productInterest || lead.sourceProduct || lead.notes || 'Không có mô tả'}
                        </p>
                      </td>

                      {/* Scale / Budget */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 whitespace-nowrap text-xs">
                        {(lead.quantity || lead.details?.quantity || lead.details?.giftQuantity) && (
                          <div className="text-gray-800 dark:text-gray-200 font-medium">
                            SL: {lead.quantity || lead.details?.quantity || lead.details?.giftQuantity} {lead.details?.unit || ''}
                          </div>
                        )}
                        {(lead.budget || lead.details?.budgetRange) && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                            NS: {lead.budget || lead.details?.budgetRange}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={`inline-flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold border cursor-pointer transition-all outline-none select-none shadow-2xs hover:opacity-90 ${statusInfo.badgeBg} ${statusInfo.color}`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{statusInfo.label}</span>
                            </span>
                            <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-52 p-1.5 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 shadow-xl rounded-[6px] z-50">
                            {Object.entries(STATUS_CONFIG).map(([k, v]) => {
                              const isCurrent = lead.status === k;
                              return (
                                <DropdownMenuItem
                                  key={k}
                                  onClick={() => handleQuickStatusChange(lead, k)}
                                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-[4px] cursor-pointer transition-colors ${
                                    isCurrent
                                      ? 'bg-gray-100 dark:bg-[#262930] font-semibold text-gray-900 dark:text-white'
                                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/70'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${
                                      k === 'NEW' ? 'bg-blue-500' :
                                      k === 'ASSIGNED' ? 'bg-indigo-500' :
                                      k === 'PROCESSING' ? 'bg-amber-500' :
                                      k === 'WAITING_CUSTOMER' ? 'bg-cyan-500' :
                                      k === 'WAITING_INTERNAL' ? 'bg-purple-500' :
                                      'bg-gray-400'
                                    }`} />
                                    <span>{v.label}</span>
                                  </div>
                                  {isCurrent && <Check className="w-3.5 h-3.5 text-[#5865f2]" />}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {lead.closingResult && lead.status === 'CLOSED' && (
                          <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                            {CLOSING_RESULTS[lead.closingResult]?.label || lead.closingResult}
                          </div>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={`inline-flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold border cursor-pointer transition-all outline-none select-none shadow-2xs hover:opacity-90 ${priorityInfo.color}`}
                          >
                            <span className="flex items-center gap-1.5">
                              <Flame className={`w-3 h-3 ${lead.priority === 'URGENT' ? 'text-rose-500' : lead.priority === 'HIGH' ? 'text-orange-500' : 'text-slate-400'}`} />
                              <span>{priorityInfo.label}</span>
                            </span>
                            <ChevronDown className="w-2.5 h-2.5 opacity-60 shrink-0" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-44 p-1.5 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 shadow-xl rounded-[4px] z-50">
                            <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              Đổi mức ưu tiên
                            </div>
                            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => {
                              const isCurrent = (lead.priority || 'NORMAL') === k;
                              return (
                                <DropdownMenuItem
                                  key={k}
                                  onClick={() => handleQuickPriorityChange(lead, k)}
                                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-[4px] cursor-pointer transition-colors ${
                                    isCurrent
                                      ? 'bg-gray-100 dark:bg-[#262930] font-semibold text-gray-900 dark:text-white'
                                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/70'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${
                                      k === 'URGENT' ? 'bg-rose-500' :
                                      k === 'HIGH' ? 'bg-orange-500' :
                                      'bg-slate-400'
                                    }`} />
                                    <span>{v.label}</span>
                                  </div>
                                  {isCurrent && <Check className="w-3.5 h-3.5 text-[#5865f2]" />}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>

                      {/* Assignee */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 whitespace-nowrap w-[170px] min-w-[170px] max-w-[170px]" onClick={(e) => e.stopPropagation()}>
                        <AssigneeDropdown
                          lead={lead}
                          staffList={staffList}
                          onAssign={handleQuickAssignee}
                          isAssignedTo={isAssignedTo}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 border-l border-gray-100 dark:border-gray-800/60 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center justify-center">
                          <ActionMenu
                            items={[
                              {
                                label: 'Xem chi tiết & Dòng thời gian',
                                icon: Eye,
                                onClick: () => handleOpenDetail(lead)
                              },
                              ...(lead.status !== 'CLOSED'
                                ? [
                                    {
                                      label: 'Đóng yêu cầu',
                                      icon: CheckCircle,
                                      onClick: () => {
                                        setActiveLead(lead);
                                        setClosingForm({
                                          closingResult: 'RESOLVED',
                                          closingNote: '',
                                          linkedOrderCode: '',
                                          orderValue: ''
                                        });
                                        setIsClosingModalOpen(true);
                                      }
                                    }
                                  ]
                                : [
                                    {
                                      label: 'Mở lại yêu cầu',
                                      icon: RefreshCw,
                                      onClick: () => {
                                        setActiveLead(lead);
                                        setIsReopenModalOpen(true);
                                      }
                                    }
                                  ]),
                              {
                                label: 'Xóa yêu cầu',
                                icon: Trash2,
                                variant: 'danger' as const,
                                separatorBefore: true,
                                onClick: () => handleDeleteLead(lead.id)
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

        {/* 52px Standard Pagination Footer */}
        <div className="px-4 py-3 bg-gray-50/50 dark:bg-[#1a1b23]/50 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>
              Hiển thị <strong className="text-gray-900 dark:text-white">{sortedLeads.length > 0 ? page * itemsPerPage + 1 : 0}</strong> -{' '}
              <strong className="text-gray-900 dark:text-white">{Math.min((page + 1) * itemsPerPage, sortedLeads.length)}</strong> trên tổng số{' '}
              <strong className="text-gray-900 dark:text-white">{sortedLeads.length}</strong> yêu cầu
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

      {/* SECTION 7: FULL DETAIL & WORKFLOW MODAL / DRAWER */}
      {isDetailOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white dark:bg-[#14151a] border-l border-gray-200 dark:border-gray-800 h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Top Bar */}
            <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#1a1b23]/50">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-bold text-[#5865f2] bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-[4px] border border-indigo-200 dark:border-indigo-800">
                  {activeLead.requestCode || `REQ-${activeLead.id}`}
                </span>
                <span className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold border ${STATUS_CONFIG[activeLead.status]?.badgeBg} ${STATUS_CONFIG[activeLead.status]?.color}`}>
                  {STATUS_CONFIG[activeLead.status]?.label || activeLead.status}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`px-2.5 py-1 rounded-[4px] text-[11px] font-semibold border cursor-pointer hover:opacity-85 transition-opacity flex items-center gap-1 shadow-2xs ${PRIORITY_CONFIG[activeLead.priority || 'NORMAL']?.color}`}
                  >
                    <Flame className={`w-3 h-3 ${activeLead.priority === 'URGENT' ? 'text-rose-500' : activeLead.priority === 'HIGH' ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span>Ưu tiên: {PRIORITY_CONFIG[activeLead.priority || 'NORMAL']?.label}</span>
                    <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-44 p-1.5 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 shadow-xl rounded-[4px] z-50">
                    <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Đổi mức ưu tiên
                    </div>
                    {Object.entries(PRIORITY_CONFIG).map(([k, v]) => {
                      const isCurrent = (activeLead.priority || 'NORMAL') === k;
                      return (
                        <DropdownMenuItem
                          key={k}
                          onClick={() => handleQuickPriorityChange(activeLead, k)}
                          className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-[4px] cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-gray-100 dark:bg-[#262930] font-semibold text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/70'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              k === 'URGENT' ? 'bg-rose-500' :
                              k === 'HIGH' ? 'bg-orange-500' :
                              'bg-slate-400'
                            }`} />
                            <span>{v.label}</span>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-[#5865f2]" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                {activeLead.status === 'CLOSED' ? (
                  <button
                    type="button"
                    onClick={() => setIsReopenModalOpen(true)}
                    className="px-3 py-1.5 rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Mở lại yêu cầu</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setClosingForm({
                        closingResult: 'RESOLVED',
                        closingNote: '',
                        linkedOrderCode: '',
                        orderValue: ''
                      });
                      setIsClosingModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Đóng yêu cầu</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 px-6 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold">
              {[
                { id: 'OVERVIEW', label: 'Tổng quan & Điều phối', icon: User },
                { id: 'ACTIVITIES', label: `Dòng thời gian & Note (${activeLead.activities?.length || 0})`, icon: MessageSquare },
                { id: 'QUOTATIONS', label: `Báo giá (${activeLead.quotations?.length || 0})`, icon: FileCheck },
                { id: 'AUDIT', label: `Nhật ký hệ thống (${activeLead.auditLog?.length || 0})`, icon: History }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = detailTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDetailTab(tab.id as any)}
                    className={`py-3.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                      active
                        ? 'border-[#5865f2] text-[#5865f2] dark:border-[#5865f2] dark:text-[#5865f2]'
                        : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: OVERVIEW */}
              {detailTab === 'OVERVIEW' && (
                <div className="space-y-6">
                  {/* Customer & Coordination Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left: Customer Info */}
                    <div className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#5865f2]" />
                          <span>Thông tin khách hàng</span>
                        </h4>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-gray-400" />
                          <span>Nguồn: {activeLead.source || 'Website - Trang Liên Hệ'}</span>
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>Họ và tên:</span>
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">{activeLead.customerName}</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-gray-400" />
                            <span>Doanh nghiệp:</span>
                          </span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{activeLead.companyName || 'Cá nhân'}</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>Số điện thoại:</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-gray-900 dark:text-white">{activeLead.phone || '---'}</span>
                            {activeLead.phone && (
                              <a
                                href={`tel:${activeLead.phone}`}
                                className="p-1 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/60 text-[#5865f2] dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                                title="Gọi điện"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>Email:</span>
                          </span>
                          <span className="font-mono text-gray-800 dark:text-gray-200">{activeLead.email || '---'}</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <Radio className="w-3.5 h-3.5 text-gray-400" />
                            <span>Kênh ưu tiên:</span>
                          </span>
                          <span className="font-medium text-[#5865f2] dark:text-[#7983f5]">{activeLead.preferredChannel || 'Điện thoại'}</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>Giờ tiện liên hệ:</span>
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">{activeLead.preferredTime || 'Hành chính'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Coordination & Assignment */}
                    <div className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-3.5 shadow-2xs">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5 text-[#5865f2]" />
                        <span>Điều phối & Phân công</span>
                      </h4>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-gray-500 dark:text-gray-400 mb-1 font-medium flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                            <span>Người phụ trách:</span>
                          </label>
                          <AssigneeDropdown
                            lead={activeLead}
                            staffList={staffList}
                            onAssign={handleQuickAssignee}
                            isAssignedTo={isAssignedTo}
                            className="!h-[36px]"
                          />
                        </div>

                        {/* Priority Selector */}
                        <div>
                          <label className="block text-gray-500 dark:text-gray-400 mb-1 font-medium flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-orange-500" />
                              <span>Mức độ ưu tiên xử lý:</span>
                            </span>
                            <span className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-[4px] border ${PRIORITY_CONFIG[activeLead.priority || 'NORMAL']?.color}`}>
                              {PRIORITY_CONFIG[activeLead.priority || 'NORMAL']?.label}
                            </span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'NORMAL', label: 'Bình thường', color: 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800', activeClass: 'bg-slate-100 dark:bg-slate-800 font-bold border-slate-400 ring-1 ring-slate-400' },
                              { id: 'HIGH', label: 'Ưu tiên Cao', color: 'border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/40', activeClass: 'bg-orange-100 dark:bg-orange-950/60 font-bold border-orange-400 text-orange-800 dark:text-orange-200 ring-1 ring-orange-400' },
                              { id: 'URGENT', label: 'Khẩn cấp', color: 'border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40', activeClass: 'bg-rose-100 dark:bg-rose-950/60 font-bold border-rose-400 text-rose-800 dark:text-rose-200 ring-1 ring-rose-400' }
                            ].map((p) => {
                              const isSelected = (activeLead.priority || 'NORMAL') === p.id;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => handleQuickPriorityChange(activeLead, p.id)}
                                  className={`py-2 px-2 rounded-[4px] border text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                    isSelected
                                      ? `${p.activeClass} shadow-xs`
                                      : `${p.color} bg-white dark:bg-[#14151a]`
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${
                                    p.id === 'URGENT' ? 'bg-rose-500' : p.id === 'HIGH' ? 'bg-orange-500' : 'bg-slate-400'
                                  }`} />
                                  <span>{p.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-500 dark:text-gray-400 mb-1 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>Hẹn xử lý tiếp:</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={activeLead.nextFollowUpDate || ''}
                            onChange={async (e) => {
                              const val = e.target.value;
                              await apiClient.patch(`/leads/${activeLead.id}`, { nextFollowUpDate: val });
                              setActiveLead((prev: any) => ({ ...prev, nextFollowUpDate: val }));
                              setData((prev) => prev.map((l) => (l.id === activeLead.id ? { ...l, nextFollowUpDate: val } : l)));
                              toast.success('Đã cập nhật lịch hẹn xử lý tiếp');
                            }}
                            className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#5865f2] transition-colors"
                          />
                        </div>

                        <div className="pt-1 flex items-center justify-between text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5 text-gray-400" />
                            <span>Liên hệ gần nhất:</span>
                          </span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {activeLead.lastContactDate ? safeFormatDate(activeLead.lastContactDate) : 'Chưa có tương tác'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Original Submission Details */}
                  <div className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#5865f2]" />
                        <span>Nội dung khách gửi ban đầu (Gốc)</span>
                      </h4>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{safeFormatDate(activeLead.createdAt)}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-[4px] bg-gray-50/70 dark:bg-[#14151a] border border-gray-200/60 dark:border-gray-800/80">
                        <span className="text-gray-500 dark:text-gray-400 mb-1 text-[11px] flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Nhu cầu / Mục đích</span>
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {PURPOSE_CONFIG[activeLead.purpose]?.label || activeLead.productGroup}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-[4px] bg-gray-50/70 dark:bg-[#14151a] border border-gray-200/60 dark:border-gray-800/80">
                        <span className="text-gray-500 dark:text-gray-400 mb-1 text-[11px] flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-amber-500" />
                          <span>Sản phẩm / Bộ quà</span>
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {activeLead.details?.productInterest || activeLead.sourceProduct || 'Cần tư vấn'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-[4px] bg-gray-50/70 dark:bg-[#14151a] border border-gray-200/60 dark:border-gray-800/80">
                        <span className="text-gray-500 dark:text-gray-400 mb-1 text-[11px] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          <span>Số lượng dự kiến</span>
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {activeLead.quantity || activeLead.details?.quantity || activeLead.details?.giftQuantity || 'Chưa rõ'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-[4px] bg-gray-50/70 dark:bg-[#14151a] border border-gray-200/60 dark:border-gray-800/80">
                        <span className="text-gray-500 dark:text-gray-400 mb-1 text-[11px] flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Ngân sách</span>
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {activeLead.budget || activeLead.details?.budgetRange || 'Chưa rõ'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-[4px] bg-gray-50/70 dark:bg-[#14151a] border border-gray-200/60 dark:border-gray-800/80">
                        <span className="text-gray-500 dark:text-gray-400 mb-1 text-[11px] flex items-center gap-1.5">
                          <CalendarClock className="w-3.5 h-3.5 text-rose-500" />
                          <span>Thời gian nhận</span>
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {activeLead.timeline || activeLead.details?.desiredDate || 'Theo tiến độ'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-[4px] bg-gray-50/70 dark:bg-[#14151a] border border-gray-200/60 dark:border-gray-800/80">
                        <span className="text-gray-500 dark:text-gray-400 mb-1 text-[11px] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          <span>Tùy chỉnh thương hiệu</span>
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {activeLead.customization || (Array.isArray(activeLead.details?.customization) ? activeLead.details.customization.join(', ') : 'Tiêu chuẩn')}
                        </span>
                      </div>
                    </div>

                    {/* Original notes */}
                    <div className="p-3.5 rounded-[4px] bg-gray-50/70 dark:bg-[#14151a] border border-gray-200/60 dark:border-gray-800/80 text-xs">
                      <span className="text-gray-500 dark:text-gray-400 font-medium mb-1 text-[11px] flex items-center gap-1.5">
                        <MessageSquareText className="w-3.5 h-3.5 text-gray-400" />
                        <span>Ghi chú & Lời nhắn của khách:</span>
                      </span>
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed pl-5">
                        {activeLead.notes || 'Không có ghi chú thêm'}
                      </p>
                    </div>

                    {/* Attachments from customer */}
                    {activeLead.attachments && activeLead.attachments.length > 0 && (
                      <div>
                        <span className="text-xs text-gray-400 mb-2 font-medium flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-[#5865f2]" />
                          <span>Tệp đính kèm khách gửi:</span>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeLead.attachments.map((att: any, idx: number) => (
                            <a
                              key={idx}
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-gray-50 dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 hover:border-[#5865f2] hover:text-[#5865f2] transition-colors"
                            >
                              <Paperclip className="w-3.5 h-3.5 text-[#5865f2]" />
                              <span className="max-w-[200px] truncate">{att.name}</span>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Verified Information Editor */}
                  <div className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#5865f2]" />
                          <span>Thông tin đã xác minh (Sau khi trao đổi với khách)</span>
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Nhân viên cập nhật thông tin chuẩn xác để chuẩn bị báo giá hoặc lên đơn
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveVerifiedInfo}
                        className="px-4 py-2 rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu xác minh</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          <span>Số lượng chốt:</span>
                        </label>
                        <input
                          type="text"
                          value={verifiedInfo.verifiedQuantity}
                          onChange={(e) => setVerifiedInfo((p) => ({ ...p, verifiedQuantity: e.target.value }))}
                          placeholder="VD: 250 hộp..."
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <CircleDollarSign className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Ngân sách chốt (VNĐ):</span>
                        </label>
                        <input
                          type="text"
                          value={verifiedInfo.verifiedBudget}
                          onChange={(e) => setVerifiedInfo((p) => ({ ...p, verifiedBudget: e.target.value }))}
                          placeholder="VD: 650.000đ/set..."
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>Địa điểm giao hàng cụ thể:</span>
                        </label>
                        <input
                          type="text"
                          value={verifiedInfo.verifiedDeliveryLocation}
                          onChange={(e) => setVerifiedInfo((p) => ({ ...p, verifiedDeliveryLocation: e.target.value }))}
                          placeholder="VD: Kho FPT, Quận Cầu Giấy, Hà Nội..."
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <CalendarCheck className="w-3.5 h-3.5 text-purple-500" />
                          <span>Ngày giao chốt:</span>
                        </label>
                        <input
                          type="date"
                          value={verifiedInfo.verifiedDeliveryDate}
                          onChange={(e) => setVerifiedInfo((p) => ({ ...p, verifiedDeliveryDate: e.target.value }))}
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVITIES & NOTES TIMELINE */}
              {detailTab === 'ACTIVITIES' && (
                <div className="space-y-6">
                  {/* Add New Activity Form */}
                  <form onSubmit={handleAddActivity} className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-4 shadow-2xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#5865f2]" />
                      <span>Ghi nhận hoạt động / Note nội bộ</span>
                    </h4>

                    {/* Activity Type Selector */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {[
                        { id: 'NOTE', label: 'Ghi chú nội bộ', icon: FileText, color: 'text-amber-500' },
                        { id: 'CALL', label: 'Cuộc gọi điện', icon: PhoneCall, color: 'text-emerald-500' },
                        { id: 'ZALO', label: 'Trao đổi Zalo', icon: MessageCircle, color: 'text-blue-500' },
                        { id: 'EMAIL', label: 'Gửi Email', icon: Mail, color: 'text-indigo-500' },
                        { id: 'MEETING', label: 'Cuộc họp trực tiếp', icon: Users, color: 'text-purple-500' }
                      ].map((t) => {
                        const TypeIcon = t.icon;
                        const isSelected = newActivity.type === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setNewActivity((p) => ({ ...p, type: t.id }))}
                            className={`px-3 py-1.5 rounded-[4px] border text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#5865f2] text-white border-[#5865f2] shadow-xs'
                                : 'bg-gray-50 dark:bg-[#14151a] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <TypeIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : t.color}`} />
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Contact Result (if CALL/ZALO) */}
                    {['CALL', 'ZALO', 'EMAIL', 'MEETING'].includes(newActivity.type) && (
                      <div className="relative z-20">
                        <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                          <span>Kết quả liên hệ:</span>
                        </label>
                        <CustomDropdown
                          className="w-full"
                          options={[
                            { value: 'CONNECTED', label: 'Đã trao đổi thành công', color: 'green' },
                            { value: 'NO_ANSWER', label: 'Không nghe máy / Cuộc gọi nhỡ', color: 'yellow' },
                            { value: 'BUSY', label: 'Máy bận / Thuê bao', color: 'gray' },
                            { value: 'WRONG_NUMBER', label: 'Sai số điện thoại', color: 'red' },
                            { value: 'RESCHEDULED', label: 'Khách hẹn liên hệ lại sau', color: 'blue' }
                          ]}
                          value={newActivity.contactResult}
                          onChange={(val) => setNewActivity((p) => ({ ...p, contactResult: val }))}
                          placeholder="Chọn kết quả liên hệ..."
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                        <span>Nội dung chi tiết:</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newActivity.content}
                        onChange={(e) => setNewActivity((p) => ({ ...p, content: e.target.value }))}
                        placeholder="Nội dung đã trao đổi, phản hồi của khách, lưu ý kỹ thuật..."
                        className="w-full bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <ArrowRightCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Việc tiếp theo cần làm:</span>
                        </label>
                        <input
                          type="text"
                          value={newActivity.nextAction}
                          onChange={(e) => setNewActivity((p) => ({ ...p, nextAction: e.target.value }))}
                          placeholder="VD: Gửi mẫu hộp, kiểm kho, gửi báo giá..."
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <CalendarClock className="w-3.5 h-3.5 text-gray-400" />
                          <span>Hạn hoàn thành việc tiếp theo:</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={newActivity.nextActionDeadline}
                          onChange={(e) => setNewActivity((p) => ({ ...p, nextActionDeadline: e.target.value }))}
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={isSubmittingActivity}
                        className="px-5 py-2 rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Lưu vào dòng thời gian</span>
                      </button>
                    </div>
                  </form>

                  {/* Activity Timeline List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#5865f2]" />
                      <span>Dòng thời gian hoạt động ({activeLead.activities?.length || 0})</span>
                    </h4>

                    {(!activeLead.activities || activeLead.activities.length === 0) ? (
                      <p className="text-xs text-gray-400 py-6 text-center">Chưa có hoạt động nào được ghi nhận</p>
                    ) : (
                      <div className="relative pl-7 space-y-4 border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-3.5 py-1">
                        {activeLead.activities.map((act: any) => {
                          const isCall = act.type === 'CALL';
                          const isZalo = act.type === 'ZALO';
                          const isEmail = act.type === 'EMAIL';
                          const isMeeting = act.type === 'MEETING';
                          const ActIcon = isCall ? PhoneCall : isZalo ? MessageCircle : isEmail ? Mail : isMeeting ? Users : FileText;
                          const dotColor = isCall ? 'bg-emerald-500' : isZalo ? 'bg-blue-500' : isEmail ? 'bg-indigo-500' : isMeeting ? 'bg-purple-500' : 'bg-amber-500';

                          return (
                            <div key={act.id} className="relative group">
                              <span className={`absolute -left-[37px] top-2 w-5 h-5 rounded-full ${dotColor} text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-[#14151a]`}>
                                <ActIcon className="w-2.5 h-2.5" />
                              </span>
                              <div className="p-4 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-2 shadow-2xs group-hover:border-[#5865f2]/40 transition-colors">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                                      <User className="w-3 h-3 text-gray-400" />
                                      {act.author}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-[#5865f2] dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                                      <ActIcon className="w-2.5 h-2.5" />
                                      {act.type}
                                    </span>
                                    {act.contactResult && (
                                      <span className="text-[10.5px] text-gray-500 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-gray-400" />
                                        <span>Kết quả: {act.contactResult}</span>
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    {safeFormatDate(act.createdAt)}
                                  </span>
                                </div>

                                <p className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                  {act.content}
                                </p>

                                {act.nextAction && (
                                  <div className="p-2.5 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-[11.5px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                      <CheckSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                      <span>Việc tiếp theo: <strong>{act.nextAction}</strong></span>
                                    </span>
                                    {act.nextActionDeadline && (
                                      <span className="text-[10.5px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                        <CalendarClock className="w-3 h-3" />
                                        <span>Hạn: {act.nextActionDeadline}</span>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: QUOTATIONS */}
              {detailTab === 'QUOTATIONS' && (
                <div className="space-y-6">
                  {/* Create Quotation Form */}
                  <form onSubmit={handleAddQuotation} className="p-5 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-4 shadow-2xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#5865f2]" />
                      <span>Tạo & Ghi nhận phiên bản báo giá</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <Barcode className="w-3.5 h-3.5 text-gray-400" />
                          <span>Mã báo giá:</span>
                        </label>
                        <input
                          type="text"
                          value={newQuotation.quoteCode}
                          onChange={(e) => setNewQuotation((p) => ({ ...p, quoteCode: e.target.value }))}
                          placeholder={`BG-${Date.now().toString().slice(-6)}`}
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-gray-400" />
                          <span>Phiên bản:</span>
                        </label>
                        <input
                          type="text"
                          value={newQuotation.version}
                          onChange={(e) => setNewQuotation((p) => ({ ...p, version: e.target.value }))}
                          placeholder="v1, v2..."
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Tổng giá trị dự kiến (VNĐ) *:</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={newQuotation.value}
                          onChange={(e) => setNewQuotation((p) => ({ ...p, value: e.target.value }))}
                          placeholder="VD: 45000000..."
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>Hạn hiệu lực báo giá:</span>
                        </label>
                        <input
                          type="date"
                          value={newQuotation.validUntil}
                          onChange={(e) => setNewQuotation((p) => ({ ...p, validUntil: e.target.value }))}
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                          <span>Tên file / Tài liệu đính kèm:</span>
                        </label>
                        <input
                          type="text"
                          value={newQuotation.fileName}
                          onChange={(e) => setNewQuotation((p) => ({ ...p, fileName: e.target.value }))}
                          placeholder="Bao_Gia_VINEX_QuaTet_FPT_v1.pdf"
                          className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <span>Ghi chú điều khoản / Chiết khấu:</span>
                      </label>
                      <textarea
                        rows={2}
                        value={newQuotation.notes}
                        onChange={(e) => setNewQuotation((p) => ({ ...p, notes: e.target.value }))}
                        placeholder="VD: Chiết khấu 15% cho đơn thanh toán 100%, freeship nội thành..."
                        className="w-full bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={isSubmittingQuote}
                        className="px-5 py-2 rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Lưu & Chuyển Chờ khách phản hồi</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Quotations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5 text-[#5865f2]" />
                      <span>Các phiên bản báo giá đã gửi ({activeLead.quotations?.length || 0})</span>
                    </h4>

                    {(!activeLead.quotations || activeLead.quotations.length === 0) ? (
                      <p className="text-xs text-gray-400 py-6 text-center">Chưa có bản báo giá nào được tạo</p>
                    ) : (
                      <div className="space-y-3">
                        {activeLead.quotations.map((q: any) => (
                          <div
                            key={q.id}
                            className="p-4 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-2xs hover:border-[#5865f2]/40 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                  <Receipt className="w-4 h-4 text-[#5865f2]" />
                                  <span>{q.quoteCode}</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-[4px] text-[10.5px] bg-indigo-50 dark:bg-indigo-950/60 text-[#5865f2] dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                                  {q.version}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span>Người gửi: {q.sentBy}</span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <span>Ngày: {safeFormatDate(q.sentAt)}</span>
                                </span>
                              </div>
                              {q.notes && (
                                <div className="text-xs text-gray-700 dark:text-gray-300 font-light mt-1 flex items-start gap-1">
                                  <FileText className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                                  <span>{q.notes}</span>
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                                <Coins className="w-4 h-4" />
                                <span>{Number(q.value).toLocaleString('vi-VN')} đ</span>
                              </div>
                              {q.validUntil && (
                                <div className="text-[10.5px] text-gray-400 flex items-center justify-end gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  <span>Hiệu lực: {q.validUntil}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIT LOG TIMELINE VIEW */}
              {detailTab === 'AUDIT' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-[#5865f2]" />
                      <span>Dòng thời gian nhật ký hệ thống ({activeLead.auditLog?.length || 0})</span>
                    </h4>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#5865f2]" />
                      <span>Tự động ghi vết sự kiện</span>
                    </span>
                  </div>

                  {(!activeLead.auditLog || activeLead.auditLog.length === 0) ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400 space-y-2">
                      <History className="w-8 h-8 opacity-40 text-gray-400" />
                      <p className="text-xs">Chưa có nhật ký thay đổi nào được ghi nhận</p>
                    </div>
                  ) : (
                    <div className="relative pl-7 space-y-5 border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-3.5 py-2">
                      {activeLead.auditLog.map((log: any, idx: number) => {
                        const detailStr = (log.details || '').toLowerCase();
                        const isAssign = detailStr.includes('phân công') || detailStr.includes('phụ trách');
                        const isClose = detailStr.includes('đóng') || detailStr.includes('giải quyết');
                        const isReopen = detailStr.includes('mở lại');
                        const isQuote = detailStr.includes('báo giá');
                        const isVerified = detailStr.includes('xác minh');
                        const isPriority = detailStr.includes('ưu tiên');

                        const NodeIcon = isPriority ? Flame : isAssign ? UserCheck : isClose ? CheckCircle : isReopen ? RefreshCw : isQuote ? Receipt : isVerified ? ShieldCheck : Activity;
                        const dotColor = isPriority ? 'bg-orange-500' : isAssign ? 'bg-blue-500' : isClose ? 'bg-emerald-500' : isReopen ? 'bg-purple-500' : isQuote ? 'bg-indigo-500' : isVerified ? 'bg-amber-500' : 'bg-[#5865f2]';
                        const badgeLabel = isPriority ? 'Mức ưu tiên' : isAssign ? 'Phân công' : isClose ? 'Đóng yêu cầu' : isReopen ? 'Mở lại' : isQuote ? 'Báo giá' : isVerified ? 'Xác minh' : 'Hệ thống';

                        return (
                          <div key={log.id || idx} className="relative group">
                            {/* Timeline Pin/Dot */}
                            <div className={`absolute -left-[39px] top-1.5 w-6 h-6 rounded-full ${dotColor} text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-[#14151a]`}>
                              <NodeIcon className="w-3 h-3" />
                            </div>

                            {/* Timeline Content Card */}
                            <div className="p-4 rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 space-y-2 shadow-2xs group-hover:border-[#5865f2]/40 transition-colors">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                                    <User className="w-3 h-3 text-[#5865f2]" />
                                    <span>{log.user || 'Hệ thống'}</span>
                                  </span>
                                  <span className="px-2 py-0.5 rounded-[4px] text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">
                                    {badgeLabel}
                                  </span>
                                </div>
                                <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span>{safeFormatDate(log.timestamp)}</span>
                                </span>
                              </div>

                              <div className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5 leading-relaxed">
                                <span className="text-gray-800 dark:text-gray-200 font-medium">{log.details}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CLOSING RESULT MODAL */}
      {isClosingModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#14151a] rounded-[4px] shadow-2xl p-6 border border-gray-200 dark:border-gray-800 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Đóng yêu cầu tư vấn / Bán hàng
              </h3>
              <button
                type="button"
                onClick={() => setIsClosingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmClose} className="space-y-4 text-xs">
              <div className="relative z-30">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Kết quả xử lý <span className="text-rose-500">*</span>:
                </label>
                <CustomDropdown
                  className="w-full"
                  options={Object.entries(CLOSING_RESULTS).map(([k, v]) => ({
                    value: k,
                    label: v.label,
                    color: v.isWon ? 'green' : 'gray'
                  }))}
                  value={closingForm.closingResult}
                  onChange={(val) => setClosingForm((p) => ({ ...p, closingResult: val }))}
                  placeholder="Chọn kết quả xử lý..."
                />
              </div>

              {/* Conditional if Won (Đã chuyển thành đơn hàng) */}
              {closingForm.closingResult === 'ORDER_CREATED' && (
                <div className="p-4 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700/80 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white pb-1.5 border-b border-gray-200/60 dark:border-gray-800">
                    <ShoppingCart className="w-3.5 h-3.5 text-[#5865f2]" />
                    <span>Thông tin đơn hàng liên kết</span>
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">
                      Mã đơn hàng liên kết <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={closingForm.linkedOrderCode}
                      onChange={(e) => setClosingForm((p) => ({ ...p, linkedOrderCode: e.target.value }))}
                      placeholder="VD: DH-2026-0042..."
                      className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">
                      Doanh thu đơn hàng thực tế (VNĐ) <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="number"
                      required
                      value={closingForm.orderValue}
                      onChange={(e) => setClosingForm((p) => ({ ...p, orderValue: e.target.value }))}
                      placeholder="VD: 35000000..."
                      className="w-full h-[36px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Reason / Note */}
              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Lý do chi tiết / Ghi chú khi đóng:</label>
                <textarea
                  rows={3}
                  value={closingForm.closingNote}
                  onChange={(e) => setClosingForm((p) => ({ ...p, closingNote: e.target.value }))}
                  placeholder="Ghi rõ lý do không đạt thỏa thuận, hoặc thông tin hoàn tất..."
                  className="w-full bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsClosingModalOpen(false)}
                  className="px-4 py-2 rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Xác nhận đóng yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REOPEN MODAL */}
      {isReopenModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#14151a] rounded-[4px] shadow-2xl p-6 border border-gray-200 dark:border-gray-800 space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Mở lại yêu cầu đã đóng
            </h3>
            <p className="text-xs text-gray-500">
              Yêu cầu sẽ được chuyển về trạng thái &quot;Đang xử lý&quot; và ghi nhận vào lịch sử mở lại.
            </p>

            <form onSubmit={handleConfirmReopen} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Lý do mở lại *:</label>
                <textarea
                  rows={3}
                  required
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="VD: Khách hàng liên hệ lại muốn xem thêm phương án quà tặng khác..."
                  className="w-full bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5865f2] transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReopenModalOpen(false)}
                  className="px-4 py-2 rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Xác nhận mở lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
