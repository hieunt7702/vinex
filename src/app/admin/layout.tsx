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
      <body className="min-h-screen h-full w-full antialiased tracking-tight text-gray-900 dark:text-gray-100 font-asana admin-wrapper">
        <ThemeProvider defaultTheme="system" storageKey="admin-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
