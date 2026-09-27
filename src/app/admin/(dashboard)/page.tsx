"use client";
import React, { useState, useEffect } from 'react';
import {
  Package, ShieldCheck, Newspaper, Globe, EyeOff, Eye,
  CalendarDays, X, Activity, MessageSquare, Clock, TrendingUp, TrendingDown, MoreHorizontal, FileText, BarChart2, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Sparkles
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

const PRESETS = [
  { label: 'Hôm nay', getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Hôm qua', getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
  { label: 'Tuần này', getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
  { label: 'Tháng này', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: 'Năm nay', getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
  { label: 'Tất cả', getValue: () => undefined },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(PRESETS[0].getValue());
  const [activePreset, setActivePreset] = useState<string>('Hôm nay');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>([]);
  const [chartTab, setChartTab] = useState('overview');

  const [recentLeadsData, setRecentLeadsData] = useState<any[]>([]);

  // Pagination for Leads
  const [leadPage, setLeadPage] = useState(0);
  const leadsPerPage = 5;
  const totalLeadPages = Math.ceil(recentLeadsData.length / leadsPerPage) || 1;
  const currentLeads = recentLeadsData.slice(leadPage * leadsPerPage, (leadPage + 1) * leadsPerPage);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/dashboard');
      setStats(res.data.stats);
      setChartData(res.data.chartData);
      setRecentLeadsData(res.data.recentLeads || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const MetricCard = ({ title, value, icon: Icon, trend, isPositive, baseColor }: any) => {
    const bgClass = baseColor === 'blue' ? 'bg-[#5865f2]/10 text-[#5865f2] dark:bg-[#5865f2]/20' :
      baseColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
        baseColor === 'rose' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' :
          'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';

    return (
      <div className="relative overflow-hidden rounded-[4px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 p-5 flex flex-col shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center ${bgClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-[4px] text-[11px] font-medium ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{isLoading ? '...' : value}</p>
        </div>
      </div>
    );
  };

  const SubMetricCard = ({ title, icon: Icon, data, baseColor }: any) => {
    const bgClass = baseColor === 'blue' ? 'bg-[#5865f2]/10 text-[#5865f2] dark:bg-[#5865f2]/20' :
      baseColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
        'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';

    return (
      <div className="bg-white dark:bg-[#1a1b23] rounded-[4px] p-5 border border-gray-200 dark:border-gray-800 flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 ${bgClass}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h4 className="text-[14px] font-semibold text-gray-900 dark:text-white">{title}</h4>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {data.map((item: any, i: number) => {
            const ItemIcon = item.icon;
            return (
              <div key={i} className="flex justify-between items-center group/item p-1 -mx-1 rounded-[4px] hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-[4px] flex items-center justify-center bg-gray-50 dark:bg-[#14151a] border border-gray-100 dark:border-gray-800">
                    <ItemIcon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                  </div>
                  <span className="text-[13px] font-normal text-gray-600 dark:text-gray-400">{item.label}</span>
                </div>
                <span className="text-[14px] font-medium text-gray-900 dark:text-white">{isLoading ? '-' : item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Dynamic Pie Chart Data based on actual leads
  const pieData = [
    { name: 'Chờ xử lý / Mới', value: stats?.pendingLeads || 0, color: '#f59e0b' },
    { name: 'Đang tư vấn / Báo giá', value: stats?.processingLeads || 0, color: '#3b82f6' },
    { name: 'Hoàn tất / Đã chốt', value: stats?.completedLeads || 0, color: '#10b981' }
  ].filter(d => d.value > 0);

  if (pieData.length === 0) {
    pieData.push({ name: 'Chưa có yêu cầu', value: 1, color: '#e5e7eb' });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[calc(100vh-64px)] pb-8 bg-gray-50/50 dark:bg-[#0b0c10] transition-colors">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Tổng quan Hệ thống VINEX
          </h2>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
            Trung tâm quản trị Nông sản cao cấp, Hạt điều xuất khẩu & Quà tặng doanh nghiệp.
          </p>
        </div>

        {/* Modern Date Picker */}
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger className="flex items-center gap-2 px-3 h-9 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262930] transition-all focus:outline-none shadow-sm cursor-pointer">
            <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="min-w-[120px] text-left">{getDateRangeLabel()}</span>
            {dateRange?.from && (
              <span className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-[4px] transition-colors ml-1" onClick={(e) => { e.stopPropagation(); setDateRange(undefined); }}>
                <X className="w-3.5 h-3.5 text-gray-400" />
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 shadow-sm rounded-[4px] overflow-hidden font-asana">
            <div className="flex">
              <div className="flex flex-col p-2 border-r border-gray-100 dark:border-gray-800 min-w-[140px] bg-gray-50/50 dark:bg-[#14151a]">
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2 px-2 mt-1">Lọc nhanh</p>
                {PRESETS.map((preset) => {
                  const isActive = activePreset === preset.label || (preset.label === 'Tất cả' && !dateRange?.from && !activePreset);
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetClick(preset)}
                      className={`text-left px-3 py-2 rounded-[4px] text-sm transition-all cursor-pointer mb-0.5 ${isActive ? 'bg-[#5865f2]/10 text-[#5865f2] font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-normal'}`}
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
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="Sản Phẩm Nông Sản" value={stats?.totalProducts || 0} icon={Package} trend="+15% tháng này" isPositive={true} baseColor="blue" />
        <MetricCard title="Yêu Cầu Báo Giá (B2B)" value={stats?.totalLeads || 0} icon={MessageSquare} trend="+28% tuần này" isPositive={true} baseColor="emerald" />
        <MetricCard title="Lượt Tiếp Cận / Xem" value={(stats?.totalArticleViews || 0).toLocaleString()} icon={Eye} trend="+34% tháng này" isPositive={true} baseColor="rose" />
        <MetricCard title="Bài Viết & Truyền Thông" value={stats?.totalArticles || 0} icon={Newspaper} trend="Đã xuất bản" isPositive={true} baseColor="amber" />
      </div>

      {/* Sub Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SubMetricCard
          title="Chi tiết Sản phẩm VINEX" icon={Package} baseColor="blue"
          data={[
            { label: 'Đang cung ứng', value: stats?.activeProducts || 0, icon: CheckCircle2, iconColor: 'text-emerald-500' },
            { label: 'Chờ cập nhật / duyệt', value: stats?.pendingProducts || 0, icon: Clock, iconColor: 'text-amber-500' },
            { label: 'Tạm ẩn khỏi web', value: stats?.hiddenProducts || 0, icon: EyeOff, iconColor: 'text-gray-400' }
          ]}
        />
        <SubMetricCard
          title="Chi tiết Yêu cầu Báo giá" icon={MessageSquare} baseColor="emerald"
          data={[
            { label: 'Chờ xử lý / Mới', value: stats?.pendingLeads || 0, icon: Activity, iconColor: 'text-amber-500' },
            { label: 'Đang tư vấn / Báo giá', value: stats?.processingLeads || 0, icon: TrendingUp, iconColor: 'text-blue-500' },
            { label: 'Đã hoàn tất / Ký hợp đồng', value: stats?.completedLeads || 0, icon: CheckCircle2, iconColor: 'text-emerald-500' }
          ]}
        />
        <SubMetricCard
          title="Chi tiết Nội dung & SEO" icon={FileText} baseColor="amber"
          data={[
            { label: 'Bài viết đã xuất bản', value: `${stats?.publishedArticles || 0} / ${stats?.totalArticles || 0}`, icon: Newspaper, iconColor: 'text-orange-500' },
            { label: 'Bản nháp đang soạn', value: stats?.draftArticles || 0, icon: FileText, iconColor: 'text-gray-400' },
            { label: 'Trang SEO đã index', value: stats?.indexedSeoPages || 0, icon: Globe, iconColor: 'text-emerald-500' }
          ]}
        />
      </div>

      {/* Main Content Grid: Chart & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left Area: Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] rounded-[4px] border border-gray-200 dark:border-gray-800 p-5 flex flex-col h-[400px] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Biểu đồ Tương tác & Nhu cầu</h3>
              <p className="text-[13px] font-normal text-gray-500 dark:text-gray-400 mt-0.5">So sánh lượng Yêu cầu báo giá và Lượt tiếp cận theo thời gian.</p>
            </div>
            <div className="flex bg-gray-50 dark:bg-[#14151a] p-1 rounded-[4px] border border-gray-100 dark:border-gray-800">
              <button onClick={() => setChartTab('overview')} className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-all cursor-pointer ${chartTab === 'overview' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                Tổng quan
              </button>
              <button onClick={() => setChartTab('leads')} className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-all cursor-pointer ${chartTab === 'leads' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                Báo giá
              </button>
              <button onClick={() => setChartTab('views')} className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-all cursor-pointer ${chartTab === 'views' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                Lượt xem
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative min-h-0 min-w-0">
            {!isLoading && (!Array.isArray(chartData) || chartData.length === 0) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-3 border border-gray-100 dark:border-gray-800">
                  <BarChart2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Chưa có dữ liệu biểu đồ</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5865f2" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#5865f2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 400 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 400 }} width={40} />
                  <RechartsTooltip
                    cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-[#262930] p-3 rounded-[4px] border border-gray-200 dark:border-gray-700 shadow-sm min-w-[150px]">
                            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</p>
                            <div className="space-y-2">
                              {payload.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                    <span className="text-[13px] font-normal text-gray-600 dark:text-gray-300">{entry.name === 'leads' ? 'Yêu cầu B2B' : 'Lượt xem'}</span>
                                  </div>
                                  <span className="text-[13px] font-medium text-gray-900 dark:text-white">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {(chartTab === 'overview' || chartTab === 'leads') && (
                    <Area type="monotone" dataKey="leads" name="leads" stroke="#10b981" strokeWidth={2} fill="url(#colorLeads)" activeDot={{ r: 4, strokeWidth: 0, fill: '#10b981' }} />
                  )}
                  {(chartTab === 'overview' || chartTab === 'views') && (
                    <Area type="monotone" dataKey="views" name="views" stroke="#5865f2" strokeWidth={2} fill="url(#colorViews)" activeDot={{ r: 4, strokeWidth: 0, fill: '#5865f2' }} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Area: Pie Chart & Recent Leads */}
        <div className="flex flex-col gap-5 h-[400px]">

          {/* Pie Chart */}
          <div className="bg-white dark:bg-[#1a1b23] rounded-[4px] border border-gray-200 dark:border-gray-800 p-5 flex flex-col flex-shrink-0 h-[190px] shadow-sm">
            <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-1">Tỷ lệ Trạng thái Yêu cầu</h3>
            <div className="flex-1 flex items-center min-h-0 relative">
              <div className="w-1/2 h-full relative min-h-0 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
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
                            <div className="bg-white dark:bg-[#262930] px-2 py-1.5 rounded-[4px] border border-gray-200 dark:border-gray-700 shadow-sm text-xs font-medium text-gray-800 dark:text-gray-200 z-50">
                              {payload[0].name}: {payload[0].value}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Total overlay in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalLeads || 0}</span>
                </div>
              </div>

              {/* Custom Legend */}
              <div className="w-1/2 flex flex-col justify-center gap-2 pl-3 border-l border-gray-100 dark:border-gray-800">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: item.color }}></span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400">{item.name}</span>
                      <span className="text-[12px] font-medium text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Paginated Recent Leads */}
          <div className="bg-white dark:bg-[#1a1b23] rounded-[4px] border border-gray-200 dark:border-gray-800 flex flex-col flex-1 min-h-0 overflow-hidden relative shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white">Yêu cầu báo giá mới nhất</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLeadPage(p => Math.max(0, p - 1))}
                  disabled={leadPage === 0}
                  className="w-6 h-6 flex items-center justify-center rounded-[4px] bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-40 transition-colors cursor-pointer border border-gray-100 dark:border-gray-700"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400 w-6 text-center">{leadPage + 1}/{totalLeadPages}</span>
                <button
                  onClick={() => setLeadPage(p => Math.min(totalLeadPages - 1, p + 1))}
                  disabled={leadPage === totalLeadPages - 1}
                  className="w-6 h-6 flex items-center justify-center rounded-[4px] bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-40 transition-colors cursor-pointer border border-gray-100 dark:border-gray-700"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5">
              <div className="flex flex-col gap-0.5">
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="p-2.5 rounded-[4px] border border-gray-50 dark:border-gray-800 animate-pulse flex gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-[4px] w-1/2"></div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-[4px] w-3/4"></div>
                      </div>
                    </div>
                  ))
                ) : currentLeads.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <Clock className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-[13px] font-normal">Chưa có yêu cầu báo giá nào</p>
                  </div>
                ) : (
                  currentLeads.map((lead) => (
                    <div key={lead.id} className="p-2.5 rounded-[4px] hover:bg-gray-50 dark:hover:bg-[#262930] transition-colors flex gap-2.5 items-center cursor-pointer border border-transparent">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-semibold text-sm shrink-0 border border-emerald-100 dark:border-emerald-900/30">
                        {lead.customerName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="text-[13px] font-medium text-gray-900 dark:text-white truncate pr-2">{lead.customerName}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] flex-shrink-0 font-medium ${
                            lead.status === 'PENDING' || lead.status === 'NEW' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                            lead.status === 'PROCESSING' || lead.status === 'CONSULTING' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                            'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {lead.status === 'PENDING' || lead.status === 'NEW' ? 'Chờ xử lý' :
                             lead.status === 'PROCESSING' || lead.status === 'CONSULTING' ? 'Đang tư vấn' : 'Hoàn tất'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-[12px] font-normal text-gray-500 dark:text-gray-400 truncate">
                            {lead.projectType} • {lead.location}
                          </p>
                          <p className="text-[11px] font-normal text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                            {safeFormatDate(lead.createdAt, 'dd/MM', '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
