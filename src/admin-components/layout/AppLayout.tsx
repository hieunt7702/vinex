"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import {
  LayoutGrid,
  Users,
  FileText,
  Settings,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  Command,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Building2,
  ShieldCheck,
  FolderKanban,
  Image as ImageIcon,
  Tags,
  Star,
  Briefcase,
  FileSearch,
  Handshake
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useAuthStore } from '@/admin-features/auth/stores/useAuthStore';
import { useAdminHeaderStore } from '@/admin-stores/useAdminHeaderStore';
import { ConfirmProvider } from '@/hooks/useConfirm';

const navigation = [
  { name: 'Tổng quan', href: '/admin', icon: LayoutGrid },
  { name: 'Khách hàng', href: '/admin/customers', icon: Users },
  { name: 'Yêu cầu tư vấn (Lead)', href: '/admin/leads', icon: MessageSquare },
  { name: 'Sản phẩm', href: '/admin/products', icon: Star },
  { name: 'Tin tức', href: '/admin/articles', icon: FileText },
  { name: 'Thư viện Media', href: '/admin/media', icon: ImageIcon },
  { name: 'Danh mục & Bộ lọc', href: '/admin/categories', icon: Tags },
];

const systemNav = [
  { name: 'Cài đặt hệ thống', href: '/admin/settings', icon: Settings },
];

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const location = { pathname: usePathname() };
  const { logout, user } = useAuthStore();
  const title = useAdminHeaderStore((s) => s.title);
  const description = useAdminHeaderStore((s) => s.description);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const allNavItems = [...navigation, ...systemNav];
  const currentNavItem = allNavItems.find((item) =>
    item.href === '/admin'
      ? location.pathname === '/admin'
      : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
  );
  const NavIcon = currentNavItem?.icon || LayoutGrid;

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const noScrollPages = ['/admin/units', '/admin/products', '/admin/projects', '/admin/leads', '/admin/supervisions', '/admin/articles', '/admin/seo', '/admin/categories', '/admin/testimonials', '/admin/customers', '/admin/operations'];
  const isNoScroll = noScrollPages.includes(location.pathname);

  return (
    <ConfirmProvider>
      <div className="flex h-screen bg-[#f4f5f7] dark:bg-[#0b0c10] text-[#111827] dark:text-[#f3f4f6] overflow-hidden admin-wrapper">
        <aside className={`${isSidebarCollapsed ? 'w-[68px]' : 'w-[230px] lg:w-[260px]'} flex-shrink-0 bg-white dark:bg-[#1e1f24] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-200`}>

          {/* Header / Logo */}
          <div className={`h-[72px] flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-5'} border-b border-gray-100 dark:border-gray-800`}>
            {!isSidebarCollapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[4px] bg-[#5865f2] text-white flex items-center justify-center shrink-0">
                    <Command strokeWidth={2} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-base leading-tight text-[#5865f2] dark:text-[#a59ffd] tracking-tight truncate">VINEX ADMIN</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">Quản lý hệ thống</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2a2d36]"
                  title="Thu gọn menu"
                >
                  <PanelLeftClose className="w-[18px] h-[18px]" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="w-10 h-10 rounded-[6px] bg-[#5865f2] text-white flex items-center justify-center cursor-pointer hover:bg-[#4752c4] transition-colors"
                title="Mở rộng menu (VINEX ADMIN)"
              >
                <Command strokeWidth={2} className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Scrollable Navigation */}
          <OverlayScrollbarsComponent element="nav" defer className="flex-1 px-2.5 py-4 space-y-0.5">

            {!isSidebarCollapsed && (
              <div className="px-3 pb-2">
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nghiệp vụ chính</span>
              </div>
            )}

            {navigation.map((item) => {
              const isActive =
                (item.href === '/admin' && location.pathname === '/admin') ||
                (item.href !== '/admin' && (location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={isSidebarCollapsed ? item.name : undefined}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} rounded-[4px] text-[14px] transition-all duration-150 ${isActive
                    ? 'bg-[#5865f2]/10 dark:bg-[#5865f2]/10 text-[#5865f2] dark:text-[#5865f2] font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2d36] hover:text-gray-900 dark:hover:text-white font-medium'
                    }`}
                >
                  <item.icon strokeWidth={2} className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#5865f2]' : 'text-gray-400 dark:text-gray-500'}`} />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="truncate">{item.name}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5865f2] shrink-0"></div>}
                    </>
                  )}
                </Link>
              );
            })}

            {!isSidebarCollapsed && (
              <div className="px-3 pb-2 pt-5">
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Hệ thống</span>
              </div>
            )}

            {systemNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={isSidebarCollapsed ? item.name : undefined}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} rounded-[4px] text-[14px] transition-all duration-150 ${isActive
                    ? 'bg-[#5865f2]/10 dark:bg-[#5865f2]/10 text-[#5865f2] dark:text-[#5865f2] font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2d36] hover:text-gray-900 dark:hover:text-white font-medium'
                    }`}
                >
                  <item.icon strokeWidth={2} className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#5865f2]' : 'text-gray-400 dark:text-gray-500'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </OverlayScrollbarsComponent>

          {/* User Profile */}
          <div className={`${isSidebarCollapsed ? 'p-2.5 flex flex-col items-center gap-2' : 'px-4 py-3'} border-t border-gray-100 dark:border-gray-800`}>
            {isSidebarCollapsed ? (
              <>
                <div className="w-8 h-8 rounded-full bg-[#5865f2]/10 border border-[#5865f2]/30 flex items-center justify-center font-bold text-[#5865f2] text-xs" title={user?.username || 'Administrator'}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-amber-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-[#2a2d36] rounded-[4px] transition-colors cursor-pointer"
                  title={mounted ? (resolvedTheme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối') : 'Chuyển chế độ'}
                >
                  {mounted ? (
                    resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <div className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => logout()}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[4px] transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#5865f2]/10 border border-[#5865f2]/30 flex items-center justify-center font-bold text-[#5865f2] text-xs shrink-0">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                      {user ? user.username : 'Loading...'}
                    </span>
                    <span className="text-[11px] text-gray-400 truncate">Administrator</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={toggleTheme}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-amber-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-[#2a2d36] rounded-[4px] transition-colors cursor-pointer"
                    title={mounted ? (resolvedTheme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối') : 'Chuyển chế độ'}
                  >
                    {mounted ? (
                      resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <div className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => logout()}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[4px] transition-colors cursor-pointer"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#fbfbfa] dark:bg-[#0b0c10]">
          {/* Header */}
          <header className="h-[72px] flex items-center justify-between px-4 sm:px-5 lg:px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] transition-colors duration-300 shrink-0">
            {/* Left: Section Icon from Menu, Title & Description */}
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="p-1.5 rounded-[4px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#262930] transition-colors cursor-pointer shrink-0"
                  title="Mở rộng menu điều hướng"
                >
                  <PanelLeftOpen className="w-[18px] h-[18px]" />
                </button>
              )}
              <div className="w-10 h-10 rounded-[6px] bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-xs text-[#5865f2] dark:text-[#a59ffd]">
                <NavIcon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight truncate tracking-tight">
                  {title}
                </h1>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 font-normal">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Search Box, Action Buttons & Header Theme Toggle */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <div id="admin-header-actions-portal" className="flex items-center gap-2 sm:gap-2.5 shrink-0" />
              
              <div className="h-5 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block mx-0.5" />

              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-[6px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1b23] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252830] hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-xs cursor-pointer group shrink-0"
                title={mounted ? (resolvedTheme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối') : 'Chuyển giao diện'}
                aria-label="Đổi giao diện Sáng / Tối"
              >
                {mounted ? (
                  resolvedTheme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
                  ) : (
                    <Moon className="w-4 h-4 text-blue-500 group-hover:-rotate-12 transition-transform duration-300" />
                  )
                ) : (
                  <div className="w-4 h-4" />
                )}
              </button>
            </div>
          </header>

          {/* Main Area */}
          <div className={`flex-1 flex flex-col relative bg-[#fbfbfa] dark:bg-[#0b0c10] ${isNoScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            <div className={`flex flex-col p-3.5 sm:p-4 md:p-5 lg:p-6 w-full ${isNoScroll ? 'h-full overflow-hidden' : 'min-h-min h-full'}`}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </ConfirmProvider>
  );
}
