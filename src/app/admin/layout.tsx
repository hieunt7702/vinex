/**
 * Admin Layout
 * Bao gồm Header và Footer dành cho admin dashboard.
 * Admin pages bên trong dùng 'use client' riêng.
 */


import { ThemeProvider } from '@/admin-components/ThemeProvider';
import type { Metadata } from 'next';
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Panel | VINEX",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen h-full w-full antialiased tracking-tight bg-[#f4f5f7] dark:bg-[#0b0c10] text-[#111827] dark:text-[#f3f4f6] font-asana admin-wrapper">
        <ThemeProvider defaultTheme="system" storageKey="admin-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
