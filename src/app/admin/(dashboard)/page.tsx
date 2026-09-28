"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package, Newspaper, Globe, EyeOff, Eye,
  CalendarDays, X, Activity, MessageSquare, Clock, TrendingUp, TrendingDown,
  FileText, BarChart2, ChevronLeft, ChevronRight, CheckCircle2,
  Sparkles, RefreshCw, DollarSign, Coins, Users, ArrowUpRight,
  ArrowRight, ExternalLink, Filter, Inbox, Check, AlertCircle, Layers
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/admin-components/ui/popover';
import { Calendar } from '@/admin-components/ui/calendar';
import { vi } from 'date-fns/locale';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { safeFormatDate } from '@/admin-utils/dateUtils';
import { DateRange } from 'react-day-picker';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import apiClient from '@/admin-lib/apiClient';
import { AdminHeaderPortal } from '@/admin-components/layout/AdminHeaderPortal';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants/inquiryConstants';
import { toast } from 'sonner';

const PRESETS = [
  { label: 'Hôm nay', getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Hôm qua', getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
  { label: 'Tuần này', getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
  { label: 'Tháng này', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: 'Năm nay', getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
  { label: 'Tất cả', getValue: () => undefined },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(PRESETS[3].getValue()); // Default: Tháng này
  const [activePreset, setActivePreset] = useState<string>('Tháng này');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>([]);
  const [chartTab, setChartTab] = useState<'all' | 'leads' | 'revenue' | 'views'>('all');

  const [recentLeadsData, setRecentLeadsData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Pagination for Recent Leads
  const [leadPage, setLeadPage] = useState(0);
  const leadsPerPage = 5;
  const totalLeadPages = Math.ceil(recentLeadsData.length / leadsPerPage) || 1;
  const currentLeads = recentLeadsData.slice(leadPage * leadsPerPage, (leadPage + 1) * leadsPerPage);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (dateRange?.from) {
        params.from = format(dateRange.from, 'yyyy-MM-dd');
      }
      if (dateRange?.to) {
        params.to = format(dateRange.to, 'yyyy-MM-dd');
      }
      const res = await apiClient.get('/dashboard', { params });
      setStats(res.data.stats);
      setChartData(res.data.chartData || []);
      setRecentLeadsData(res.data.recentLeads || []);
      setRecentActivities(res.data.recentActivities || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu bảng điều khiển');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.label);
    setDateRange(preset.getValue());
    setIsDatePickerOpen(false);
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    setActivePreset('');
  };

  const getDateRangeLabel = () => {
    if (activePreset) return activePreset;
    if (dateRange?.from) {
      if (!dateRange.to) return format(dateRange.from, 'dd/MM/yyyy');
      if (dateRange.to.getTime() === dateRange.from.getTime()) {
        return format(dateRange.from, 'dd/MM/yyyy');
      }
      return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`;
    }
    return 'Tất cả thời gian';
  };

  // Pie Chart Data based on actual leads
  const pieData = [
    { name: 'Mới tiếp nhận', value: stats?.newLeads || 0, color: '#f59e0b' },
    { name: 'Đang tư vấn / Báo giá', value: stats?.processingLeads || 0, color: '#074751' },
    { name: 'Chốt đơn thành công', value: stats?.wonLeads || 0, color: '#10b981' },
    { name: 'Đã đóng / Khác', value: Math.max(0, (stats?.closedLeads || 0) - (stats?.wonLeads || 0)), color: '#94a3b8' }
  ].filter(d => d.value > 0);

  if (pieData.length === 0) {
    pieData.push({ name: 'Chưa có dữ liệu', value: 1, color: '#e2e8f0' });
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200 min-h-[calc(100vh-64px)] pb-10">
      
      {/* 1. Header Portal Sync with Admin Bar */}
      <AdminHeaderPortal
        title="Hệ Thống Quản Trị VINEX"
        description="Nông sản Việt cao cấp & Quà tặng doanh nghiệp"
        actions={
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Refresh Button */}
            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              title="Làm mới dữ liệu"
              className="w-8 h-8 rounded-[4px] bg-white hover:bg-gray-50 dark:bg-[#14151a] dark:hover:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-[#074751] transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#074751]' : ''}`} />
            </button>

            {/* Date Range Popover */}
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger className="flex items-center gap-2 px-2.5 sm:px-3 h-8 bg-white hover:bg-gray-50 dark:bg-[#14151a] dark:hover:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 hover:border-[#074751]/50 rounded-[4px] text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors shadow-2xs cursor-pointer">
                <CalendarDays className="w-3.5 h-3.5 text-[#074751] dark:text-teal-400 shrink-0" />
                <span className="text-left font-medium text-xs">{getDateRangeLabel()}</span>
                {dateRange?.from && (
                  <span
                    className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-[2px] transition-colors ml-0.5 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDateRange(undefined);
                      setActivePreset('Tất cả');
                    }}
                    title="Xóa lọc ngày"
                  >
                    <X className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 shadow-lg rounded-[4px] overflow-hidden z-50">
                <div className="flex">
                  <div className="flex flex-col p-2 border-r border-gray-100 dark:border-gray-800 min-w-[130px] bg-gray-50/50 dark:bg-[#1a1b23]/50">
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 px-2">Lọc nhanh</p>
                    {PRESETS.map((preset) => {
                      const isActive = activePreset === preset.label || (preset.label === 'Tất cả' && !dateRange?.from && !activePreset);
                      return (
                        <button
                          key={preset.label}
                          onClick={() => handlePresetClick(preset)}
                          className={`text-left px-2.5 py-1.5 rounded-[4px] text-xs transition-colors cursor-pointer mb-0.5 font-medium ${
                            isActive
                              ? 'bg-[#074751] text-white'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                  <Calendar mode="range" selected={dateRange} onSelect={handleCalendarSelect} numberOfMonths={2} className="p-3" locale={vi} />
                </div>
              </PopoverContent>
            </Popover>

            <Link
              href="/admin/leads"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 h-8 bg-[#074751] hover:bg-[#0d5962] text-white rounded-[4px] text-xs font-medium transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              <span>Xem Leads</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        }
      />

      {/* 2. Compact Overview Summary Bar */}
      <div className="rounded-[4px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] p-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-teal-50 dark:bg-teal-950/50 text-[#074751] dark:text-teal-300 flex items-center justify-center border border-teal-200/60 dark:border-teal-800/60 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                Tổng Quan Hoạt Động Doanh Nghiệp VINEX
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Kỳ báo cáo: <strong className="text-gray-800 dark:text-gray-200">{getDateRangeLabel()}</strong> • Cập nhật tự động theo thời gian thực
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="px-2.5 py-1 rounded-[4px] bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/50 flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">Doanh thu chốt:</span>
              <strong className="text-[#074751] dark:text-teal-300 font-bold">
                {stats?.totalRevenue ? `${(stats.totalRevenue / 1000000).toLocaleString('vi-VN')} tr` : '0 đ'}
              </strong>
            </div>
            <div className="px-2.5 py-1 rounded-[4px] bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">Yêu cầu B2B:</span>
              <strong className="text-blue-700 dark:text-blue-300 font-bold">{stats?.totalLeads || 0}</strong>
            </div>
            <div className="px-2.5 py-1 rounded-[4px] bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">Tỷ lệ chốt:</span>
              <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{stats?.conversionRate || '0%'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary Metric Cards (4 Cards - Small Border Radius) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Doanh Thu Chốt Đơn */}
        <div className="rounded-[4px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 p-4 shadow-xs hover:border-[#074751]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Doanh Thu Chốt Đơn</span>
            <div className="w-7 h-7 rounded-[4px] flex items-center justify-center bg-teal-50 dark:bg-teal-950/50 text-[#074751] dark:text-teal-300 border border-teal-200/50">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isLoading ? '...' : (stats?.totalRevenue ? `${Number(stats.totalRevenue).toLocaleString('vi-VN')} đ` : '0 đ')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span>{stats?.wonLeads || 0} đơn thành công</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{stats?.conversionRate || '0%'} chốt</span>
          </div>
        </div>

        {/* Card 2: Yêu Cầu Báo Giá (Leads) */}
        <div className="rounded-[4px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 p-4 shadow-xs hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Yêu Cầu Báo Giá (Leads)</span>
            <div className="w-7 h-7 rounded-[4px] flex items-center justify-center bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50">
              <Inbox className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isLoading ? '...' : (stats?.totalLeads || 0)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span>{stats?.newLeads || 0} mới • {stats?.processingLeads || 0} đang tư vấn</span>
            {stats?.urgentLeads > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold">{stats.urgentLeads} khẩn</span>
            ) : (
              <span className="text-blue-600 dark:text-blue-400 font-medium">{stats?.highLeads || 0} ưu tiên cao</span>
            )}
          </div>
        </div>

        {/* Card 3: Sản Phẩm & Kho Hàng */}
        <div className="rounded-[4px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 p-4 shadow-xs hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Sản Phẩm & Kho Hàng</span>
            <div className="w-7 h-7 rounded-[4px] flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isLoading ? '...' : (stats?.totalProducts || 0)} <span className="text-xs font-normal text-gray-500">SKU</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span>{stats?.totalInventoryStock?.toLocaleString('vi-VN') || 0} tồn kho</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats?.activeProducts || 0} đang cung ứng</span>
          </div>
        </div>

        {/* Card 4: Đội Ngũ & Truyền Thông */}
        <div className="rounded-[4px] bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 p-4 shadow-xs hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Đội Ngũ & Truyền Thông</span>
            <div className="w-7 h-7 rounded-[4px] flex items-center justify-center bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/50">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isLoading ? '...' : (stats?.totalStaff || 0)} <span className="text-xs font-normal text-gray-500">nhân sự</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span>{stats?.publishedArticles || 0} bài viết</span>
            <span className="text-purple-600 dark:text-purple-400 font-medium">{(stats?.totalArticleViews || 0).toLocaleString('vi-VN')} views</span>
          </div>
        </div>

      </div>

      {/* 4. Sub-Metrics Deep Dive Row (Small Border Radius) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">

        {/* Module 1: Leads & Customers */}
        <div className="bg-white dark:bg-[#14151a] rounded-[4px] p-4 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-teal-50 dark:bg-teal-950/50 text-[#074751] dark:text-teal-300 flex items-center justify-center border border-teal-200/50">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white">Xử Lý Yêu Cầu & Báo Giá</h4>
              </div>
              <Link href="/admin/leads" className="text-xs font-medium text-[#074751] dark:text-teal-300 hover:underline flex items-center gap-1">
                Xem tất cả <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-amber-500" />
                  Mới tiếp nhận (Chờ phân công)
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{stats?.newLeads || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-blue-500" />
                  Đang tư vấn / Báo giá / Gặp khách
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{stats?.processingLeads || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-emerald-500" />
                  Đã chuyển thành đơn hàng thành công
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{stats?.wonLeads || 0}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 flex justify-between items-center">
            <span>Tổng khách hàng liên hệ:</span>
            <strong className="text-gray-900 dark:text-white">{stats?.totalCustomers || stats?.totalLeads || 0} đối tác</strong>
          </div>
        </div>

        {/* Module 2: Products & Inventory */}
        <div className="bg-white dark:bg-[#14151a] rounded-[4px] p-4 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-emerald-200/50">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white">Kho Hàng & Nông Sản</h4>
              </div>
              <Link href="/admin/products" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Xem tất cả <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-emerald-500" />
                  Sản phẩm đang hiển thị (Active)
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{stats?.activeProducts || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-amber-500" />
                  Sản phẩm sắp hết hàng (Low Stock)
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{stats?.lowStockProducts || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-rose-500" />
                  Hết hàng hoặc tạm ẩn
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{stats?.outOfStockProducts || 0}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 flex justify-between items-center">
            <span>Tổng tồn kho khả dụng:</span>
            <strong className="text-gray-900 dark:text-white">{stats?.totalInventoryStock?.toLocaleString('vi-VN') || 0} đơn vị</strong>
          </div>
        </div>

        {/* Module 3: Content, News & Staff */}
        <div className="bg-white dark:bg-[#14151a] rounded-[4px] p-4 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 flex items-center justify-center border border-purple-200/50">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white">Nội Dung & Vận Hành</h4>
              </div>
              <Link href="/admin/articles" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                Xem tất cả <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-orange-500" />
                  Bài viết đã xuất bản
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{stats?.publishedArticles || 0} / {stats?.totalArticles || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-gray-400" />
                  Bản nháp đang biên tập
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{stats?.draftArticles || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-[4px] bg-gray-50/70 dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-teal-500" />
                  Nhân sự quản trị & vận hành
                </span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{stats?.activeStaff || 0} nhân sự</span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 flex justify-between items-center">
            <span>Tổng lượt xem tin tức:</span>
            <strong className="text-gray-900 dark:text-white">{(stats?.totalArticleViews || 0).toLocaleString('vi-VN')} lượt</strong>
          </div>
        </div>

      </div>

      {/* 5. Main Analytics Section: Chart & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">

        {/* Left: Recharts Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 p-4 flex flex-col h-[390px] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Xu Hướng Nhu Cầu & Tương Tác</span>
                <span className="text-[11px] font-normal text-gray-400">({chartData.length} mốc gần nhất)</span>
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Biến động lượng yêu cầu báo giá B2B, doanh thu ước tính và lượt tiếp cận.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-0.5 rounded-[4px] bg-gray-100 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 text-xs shrink-0">
              <button
                onClick={() => setChartTab('all')}
                className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors cursor-pointer text-xs ${
                  chartTab === 'all'
                    ? 'bg-[#074751] text-white shadow-2xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Tổng hợp
              </button>
              <button
                onClick={() => setChartTab('leads')}
                className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors cursor-pointer text-xs ${
                  chartTab === 'leads'
                    ? 'bg-[#074751] text-white shadow-2xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Leads B2B
              </button>
              <button
                onClick={() => setChartTab('revenue')}
                className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors cursor-pointer text-xs ${
                  chartTab === 'revenue'
                    ? 'bg-[#074751] text-white shadow-2xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Doanh thu
              </button>
              <button
                onClick={() => setChartTab('views')}
                className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors cursor-pointer text-xs ${
                  chartTab === 'views'
                    ? 'bg-[#074751] text-white shadow-2xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Lượt xem
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative min-h-0 min-w-0">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                Đang tải dữ liệu biểu đồ...
              </div>
            ) : chartData.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <BarChart2 className="w-7 h-7 text-gray-300 dark:text-gray-600 mb-1.5" />
                <p className="text-xs">Chưa có dữ liệu biểu đồ trong khoảng thời gian này</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#074751" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#074751" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gradientViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:stroke-gray-800" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} width={35} />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-[#1a1b23] p-2.5 rounded-[4px] border border-gray-200 dark:border-gray-700 shadow-md min-w-[160px]">
                            <p className="text-[11px] font-bold text-gray-900 dark:text-white mb-1.5 border-b pb-1 dark:border-gray-700">
                              Ngày {label}
                            </p>
                            <div className="space-y-1">
                              {payload.map((entry: any, index: number) => {
                                const isRevenue = entry.dataKey === 'revenue';
                                const isLeads = entry.dataKey === 'leads';
                                const labelName = isRevenue ? 'Doanh thu' : isLeads ? 'Yêu cầu B2B' : 'Lượt xem';
                                const displayValue = isRevenue ? `${entry.value} tr VNĐ` : entry.value;
                                return (
                                  <div key={index} className="flex items-center justify-between text-xs gap-3">
                                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                      <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: entry.stroke }} />
                                      {labelName}:
                                    </span>
                                    <strong className="font-semibold text-gray-900 dark:text-white">{displayValue}</strong>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {(chartTab === 'all' || chartTab === 'leads') && (
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stroke="#074751"
                      strokeWidth={2}
                      fill="url(#gradientLeads)"
                      activeDot={{ r: 4, fill: '#074751', stroke: '#fff', strokeWidth: 1.5 }}
                    />
                  )}

                  {(chartTab === 'all' || chartTab === 'revenue') && (
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#D4AF37"
                      strokeWidth={2}
                      fill="url(#gradientRevenue)"
                      activeDot={{ r: 4, fill: '#D4AF37', stroke: '#fff', strokeWidth: 1.5 }}
                    />
                  )}

                  {(chartTab === 'views') && (
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#0284c7"
                      strokeWidth={1.5}
                      fill="url(#gradientViews)"
                      activeDot={{ r: 3.5, fill: '#0284c7' }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right: Lead Status Distribution (Donut Chart - Small Border Radius) */}
        <div className="bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between h-[390px] shadow-xs">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
              Phân Bổ Trạng Thái Yêu Cầu
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Tỷ lệ giải quyết các đầu việc trong quy trình tư vấn B2B.
            </p>
          </div>

          <div className="flex-1 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-[#1a1b23] px-2.5 py-1 rounded-[4px] border border-gray-200 dark:border-gray-700 shadow-md text-xs font-semibold">
                          {payload[0].name}: {payload[0].value}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Total count in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Tổng Leads</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{stats?.totalLeads || 0}</span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="space-y-1.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]">{item.name}</span>
                </div>
                <strong className="font-semibold text-gray-900 dark:text-white">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Dual Table Section: Recent Leads & Live Activity Feed (Small Border Radius) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">

        {/* Left (2 Cols): Recent Leads Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 flex flex-col shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[4px] bg-teal-50 dark:bg-teal-950/60 text-[#074751] dark:text-teal-300 flex items-center justify-center border border-teal-200/50">
                <MessageSquare className="w-3 h-3" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                  Yêu Cầu Báo Giá Gần Nhất
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLeadPage(p => Math.max(0, p - 1))}
                  disabled={leadPage === 0}
                  className="w-6 h-6 flex items-center justify-center rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-gray-500 px-1">{leadPage + 1}/{totalLeadPages}</span>
                <button
                  onClick={() => setLeadPage(p => Math.min(totalLeadPages - 1, p + 1))}
                  disabled={leadPage >= totalLeadPages - 1}
                  className="w-6 h-6 flex items-center justify-center rounded-[4px] border border-gray-200 dark:border-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <Link
                href="/admin/leads"
                className="text-xs font-medium text-[#074751] dark:text-teal-300 hover:underline px-2 py-0.5 rounded-[4px] hover:bg-teal-50/50 dark:hover:bg-teal-950/30 transition-colors ml-1"
              >
                Xem tất cả →
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/70 dark:bg-[#1a1b23]/70 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Khách Hàng / Mã</th>
                  <th className="py-2.5 px-3 font-semibold">Nhu Cầu</th>
                  <th className="py-2.5 px-3 font-semibold">Ưu Tiên</th>
                  <th className="py-2.5 px-3 font-semibold">Trạng Thái</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Giá Trị / Ngày</th>
                  <th className="py-2.5 px-3 font-semibold text-center w-10">Xem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {currentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                      Chưa có yêu cầu báo giá nào trong hệ thống
                    </td>
                  </tr>
                ) : (
                  currentLeads.map((lead: any) => {
                    const statusInfo = STATUS_CONFIG[lead.status] || { label: lead.status, color: 'text-gray-600', badgeBg: 'bg-gray-100 border-gray-200' };
                    const priorityInfo = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG['NORMAL'];

                    return (
                      <tr key={lead.id} className="hover:bg-gray-50/70 dark:hover:bg-[#1a1b23]/50 transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <span>{lead.customerName}</span>
                            {lead.companyName && (
                              <span className="text-[10px] text-gray-400 font-normal truncate max-w-[120px]">({lead.companyName})</span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            {lead.requestCode || `LEAD-${lead.id}`}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[130px] block font-medium">
                            {lead.projectType || lead.purpose || 'Tư vấn nông sản'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {lead.quantity || lead.details?.quantity || 'Chưa định lượng'}
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center px-1.5 py-0.2 rounded-[4px] text-[10px] font-semibold border ${priorityInfo.color}`}>
                            {priorityInfo.label}
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium border ${statusInfo.badgeBg} ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="font-bold text-gray-900 dark:text-white text-[11px]">
                            {lead.orderValue ? `${Number(lead.orderValue).toLocaleString('vi-VN')} đ` : 'Chưa định giá'}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {safeFormatDate(lead.createdAt, 'dd/MM/yyyy')}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <Link
                            href={`/admin/leads?id=${lead.id}`}
                            className="w-6 h-6 inline-flex items-center justify-center rounded-[4px] bg-gray-100 hover:bg-[#074751] hover:text-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                            title="Xem chi tiết lead"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (1 Col): Live System Activity Feed */}
        <div className="bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 flex flex-col shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[4px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center border border-purple-200/50">
                <Activity className="w-3 h-3" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                Nhật Ký Hoạt Động Mới
              </h3>
            </div>
            <span className="w-2 h-2 rounded-[2px] bg-emerald-500 animate-pulse" title="Thời gian thực" />
          </div>

          <div className="p-3.5 flex-1 overflow-y-auto max-h-[320px] space-y-3 custom-scrollbar">
            {recentActivities.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                Chưa có nhật ký hoạt động nào
              </div>
            ) : (
              recentActivities.map((act: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-[2px] bg-[#074751] dark:bg-teal-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-semibold text-gray-900 dark:text-white truncate">
                        {act.action}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {safeFormatDate(act.timestamp, 'HH:mm dd/MM')}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-[11px] line-clamp-2 leading-relaxed">
                      {act.details}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400">
                      <span className="font-medium text-teal-700 dark:text-teal-300">@{act.user}</span>
                      {act.requestCode && (
                        <span>• <span className="font-mono">{act.requestCode}</span></span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-gray-50/50 dark:bg-[#1a1b23]/50 border-t border-gray-100 dark:border-gray-800 text-center">
            <Link
              href="/admin/leads"
              className="text-xs font-medium text-[#074751] dark:text-teal-300 hover:underline"
            >
              Xem toàn bộ lịch sử tư vấn →
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
