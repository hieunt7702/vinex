import { NextResponse } from 'next/server';
import { store } from '../store';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');

    const fromDate = fromStr ? new Date(fromStr) : null;
    const toDate = toStr ? new Date(toStr) : null;
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const leads = store?.leads || [];
    const products = store?.products || [];
    const articles = store?.articles || [];
    const customers = store?.customers || [];
    const staff = store?.staff || [];

    // Filter leads by date range if provided
    const filteredLeads = leads.filter((l: any) => {
      if (!l.createdAt) return true;
      const d = new Date(l.createdAt);
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    });

    // Lead metrics
    const totalLeads = filteredLeads.length;
    const newLeads = filteredLeads.filter((l: any) => l.status === 'NEW').length;
    const processingLeads = filteredLeads.filter((l: any) =>
      ['ASSIGNED', 'PROCESSING', 'WAITING_CUSTOMER', 'WAITING_INTERNAL'].includes(l.status)
    ).length;
    const closedLeads = filteredLeads.filter((l: any) => l.status === 'CLOSED').length;
    const wonLeads = filteredLeads.filter((l: any) =>
      l.status === 'CLOSED' && (l.closingResult === 'ORDER_CREATED' || l.closingResult === 'RESOLVED')
    ).length;
    const conversionRate = totalLeads > 0 ? `${Math.round((wonLeads / totalLeads) * 100)}%` : '0%';

    // Revenue calculation
    const totalRevenue = filteredLeads.reduce((sum: number, l: any) => {
      const val = Number(l.orderValue) || 0;
      return sum + val;
    }, 0);

    const urgentLeads = filteredLeads.filter((l: any) => l.priority === 'URGENT').length;
    const highLeads = filteredLeads.filter((l: any) => l.priority === 'HIGH').length;

    // Product metrics
    const totalProducts = products.length;
    const activeProducts = products.filter((p: any) => p.status === 'ACTIVE').length;
    const inStockProducts = products.filter((p: any) => p.stockStatus === 'IN_STOCK' || (p.stockQuantity > (p.lowStockThreshold || 5))).length;
    const lowStockProducts = products.filter((p: any) => (p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 10)) || p.stockStatus === 'LOW_STOCK').length;
    const outOfStockProducts = products.filter((p: any) => p.stockQuantity <= 0 || p.stockStatus === 'OUT_OF_STOCK').length;
    const totalInventoryStock = products.reduce((sum: number, p: any) => sum + (Number(p.stockQuantity) || 0), 0);

    // Article metrics
    const totalArticles = articles.length;
    const publishedArticles = articles.filter((a: any) => a.status === 'PUBLISHED').length;
    const draftArticles = articles.filter((a: any) => a.status === 'DRAFT').length;
    const totalArticleViews = articles.reduce((sum: number, a: any) => sum + (Number(a.views) || 0), 0);

    // Customers & Staff
    const totalCustomers = customers.length;
    const totalStaff = staff.length;
    const activeStaff = staff.filter((s: any) => s.status === 'ACTIVE').length;

    // Chart Data: Last 7 days
    const chartDays = 7;
    const chartData = Array.from({ length: chartDays }, (_, i) => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - (chartDays - 1 - i));
      const dateKey = targetDate.toISOString().slice(0, 10);
      const dayStr = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}`;

      const dayLeads = leads.filter((l: any) => {
        if (!l.createdAt) return false;
        const dStr = l.createdAt instanceof Date ? l.createdAt.toISOString() : String(l.createdAt);
        return dStr.startsWith(dateKey);
      });
      const dayRevenue = dayLeads.reduce((sum: number, l: any) => sum + (Number(l.orderValue) || 0), 0);

      return {
        date: dayStr,
        leads: dayLeads.length,
        revenue: Math.round(dayRevenue / 1000000), // in Millions VNĐ
        views: Math.max(15, Math.floor(totalArticleViews / 7) + (i * 4))
      };
    });

    // Recent Leads (sorted newest first)
    const sortedLeads = [...leads].sort((a: any, b: any) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    const recentLeads = sortedLeads.slice(0, 8);

    // Recent System Activity Feed
    const allActivities: any[] = [];
    leads.forEach((l: any) => {
      if (Array.isArray(l.auditLog)) {
        l.auditLog.forEach((log: any) => {
          allActivities.push({
            id: log.id,
            leadId: l.id,
            requestCode: l.requestCode,
            customerName: l.customerName,
            user: log.user,
            action: log.action,
            details: log.details,
            timestamp: log.timestamp || l.updatedAt || l.createdAt
          });
        });
      }
    });
    allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const recentActivities = allActivities.slice(0, 8);

    return NextResponse.json({
      stats: {
        totalLeads,
        newLeads,
        processingLeads,
        closedLeads,
        wonLeads,
        conversionRate,
        totalRevenue,
        urgentLeads,
        highLeads,
        totalProducts,
        activeProducts,
        inStockProducts,
        lowStockProducts,
        outOfStockProducts,
        totalInventoryStock,
        totalArticles,
        publishedArticles,
        draftArticles,
        totalArticleViews,
        totalCustomers,
        totalStaff,
        activeStaff
      },
      chartData,
      recentLeads,
      recentActivities
    });
  } catch (error: any) {
    console.error('Failed to get dashboard data:', error);
    return NextResponse.json({ message: 'Lỗi nạp dữ liệu dashboard' }, { status: 500 });
  }
}
