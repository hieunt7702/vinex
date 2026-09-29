import { NextResponse } from 'next/server';
import { store } from '../store';
import prisma from '@/lib/prisma';
import { handleCorsPreflight, getCorsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard — optimised for Railway / production
//
// KEY CHANGES:
// 1. Queries DB in parallel (Promise.all) instead of sequentially
// 2. Uses Prisma `_count` aggregations instead of loading all rows into JS
// 3. Falls back to in-memory store only when DATABASE_URL is absent
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const { searchParams } = new URL(request.url);
    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');

    const fromDate = fromStr ? new Date(fromStr) : null;
    const toDate = toStr ? (() => {
      const d = new Date(toStr);
      d.setHours(23, 59, 59, 999);
      return d;
    })() : null;

    const dateFilter = fromDate || toDate
      ? {
          createdAt: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: toDate } : {}),
          },
        }
      : {};

    if (process.env.DATABASE_URL) {
      // ── DB path: fetch aggregates in parallel ─────────────────────────────
      const [
        // Lead counts
        totalLeads,
        newLeads,
        processingLeads,
        closedLeads,
        wonLeads,
        urgentLeads,
        highLeads,
        // Product counts
        totalProducts,
        activeProducts,
        inStockProducts,
        lowStockProducts,
        outOfStockProducts,
        // Article counts
        totalArticles,
        publishedArticles,
        draftArticles,
        // Customer & staff
        totalCustomers,
        totalStaff,
        activeStaff,
        // Revenue sum
        revenueAgg,
        // For chart & recent lists
        recentLeadsRaw,
        chartLeadsRaw,
      ] = await Promise.all([
        // Leads
        prisma.lead.count({ where: dateFilter }),
        prisma.lead.count({ where: { ...dateFilter, status: 'NEW' } }),
        prisma.lead.count({
          where: {
            ...dateFilter,
            status: { in: ['ASSIGNED', 'PROCESSING', 'WAITING_CUSTOMER', 'WAITING_INTERNAL'] },
          },
        }),
        prisma.lead.count({ where: { ...dateFilter, status: 'CLOSED' } }),
        prisma.lead.count({
          where: {
            ...dateFilter,
            status: 'CLOSED',
            closingResult: { in: ['ORDER_CREATED', 'RESOLVED'] },
          },
        }),
        prisma.lead.count({ where: { ...dateFilter, priority: 'URGENT' } }),
        prisma.lead.count({ where: { ...dateFilter, priority: 'HIGH' } }),
        // Products
        prisma.product.count({}),
        prisma.product.count({ where: { status: 'ACTIVE' } }),
        prisma.product.count({ where: { stockStatus: 'IN_STOCK' } }),
        prisma.product.count({ where: { stockStatus: 'LOW_STOCK' } }),
        prisma.product.count({ where: { stockStatus: 'OUT_OF_STOCK' } }),
        // Articles
        prisma.article.count({}),
        prisma.article.count({ where: { status: 'PUBLISHED' } }),
        prisma.article.count({ where: { status: 'DRAFT' } }),
        // Customers (staff lives only in in-memory store, not in Prisma DB)
        prisma.customer.count({}),
        Promise.resolve((store?.staff || []).length),
        Promise.resolve((store?.staff || []).filter((s: any) => s.status === 'ACTIVE').length),
        // Revenue aggregate
        prisma.lead.aggregate({
          _sum: { orderValue: true },
          where: dateFilter,
        }),
        // Recent leads (last 8)
        prisma.lead.findMany({
          where: dateFilter,
          orderBy: { createdAt: 'desc' },
          take: 8,
          select: {
            id: true, requestCode: true, customerName: true, companyName: true,
            phone: true, status: true, priority: true, purpose: true,
            productGroup: true, createdAt: true, assignee: true,
          },
        }),
        // Last 7 days leads for chart
        prisma.lead.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          select: { createdAt: true, orderValue: true },
        }),
      ]);

      const totalRevenue = Number(revenueAgg._sum?.orderValue ?? 0);
      const conversionRate = totalLeads > 0
        ? `${Math.round((wonLeads / totalLeads) * 100)}%`
        : '0%';

      // Chart data: last 7 days
      const chartData = Array.from({ length: 7 }, (_, i) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - (6 - i));
        const dateKey = targetDate.toISOString().slice(0, 10);
        const dayStr = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}`;

        const dayLeads = chartLeadsRaw.filter((l: any) => {
          const dStr = l.createdAt instanceof Date
            ? l.createdAt.toISOString()
            : String(l.createdAt);
          return dStr.startsWith(dateKey);
        });
        const dayRevenue = dayLeads.reduce(
          (sum: number, l: any) => sum + (Number(l.orderValue) || 0),
          0,
        );

        return {
          date: dayStr,
          leads: dayLeads.length,
          revenue: Math.round(dayRevenue / 1_000_000),
          views: 0,
        };
      });

      return NextResponse.json(
        {
          stats: {
            totalLeads, newLeads, processingLeads, closedLeads, wonLeads,
            conversionRate, totalRevenue, urgentLeads, highLeads,
            totalProducts, activeProducts, inStockProducts, lowStockProducts,
            outOfStockProducts, totalInventoryStock: 0,
            totalArticles, publishedArticles, draftArticles, totalArticleViews: 0,
            totalCustomers, totalStaff, activeStaff,
          },
          chartData,
          recentLeads: recentLeadsRaw,
          recentActivities: [],
        },
        { headers: corsHeaders },
      );
    }

    // ── In-memory store fallback (dev / no DB) ────────────────────────────────
    const leads    = store?.leads    || [];
    const products = store?.products || [];
    const articles = store?.articles || [];
    const customers = store?.customers || [];
    const staff    = store?.staff    || [];

    const filteredLeads = leads.filter((l: any) => {
      if (!l.createdAt) return true;
      const d = new Date(l.createdAt);
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    });

    const totalLeads       = filteredLeads.length;
    const newLeads         = filteredLeads.filter((l: any) => l.status === 'NEW').length;
    const processingLeads  = filteredLeads.filter((l: any) =>
      ['ASSIGNED', 'PROCESSING', 'WAITING_CUSTOMER', 'WAITING_INTERNAL'].includes(l.status),
    ).length;
    const closedLeads      = filteredLeads.filter((l: any) => l.status === 'CLOSED').length;
    const wonLeads         = filteredLeads.filter((l: any) =>
      l.status === 'CLOSED' && ['ORDER_CREATED', 'RESOLVED'].includes(l.closingResult),
    ).length;
    const conversionRate   = totalLeads > 0 ? `${Math.round((wonLeads / totalLeads) * 100)}%` : '0%';
    const totalRevenue     = filteredLeads.reduce((s: number, l: any) => s + (Number(l.orderValue) || 0), 0);
    const urgentLeads      = filteredLeads.filter((l: any) => l.priority === 'URGENT').length;
    const highLeads        = filteredLeads.filter((l: any) => l.priority === 'HIGH').length;

    const totalProducts    = products.length;
    const activeProducts   = products.filter((p: any) => p.status === 'ACTIVE').length;
    const inStockProducts  = products.filter((p: any) =>
      p.stockStatus === 'IN_STOCK' || p.stockQuantity > (p.lowStockThreshold || 5),
    ).length;
    const lowStockProducts = products.filter((p: any) =>
      (p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 10)) ||
      p.stockStatus === 'LOW_STOCK',
    ).length;
    const outOfStockProducts = products.filter((p: any) =>
      p.stockQuantity <= 0 || p.stockStatus === 'OUT_OF_STOCK',
    ).length;
    const totalInventoryStock = products.reduce(
      (s: number, p: any) => s + (Number(p.stockQuantity) || 0), 0,
    );

    const totalArticles    = articles.length;
    const publishedArticles = articles.filter((a: any) => a.status === 'PUBLISHED').length;
    const draftArticles    = articles.filter((a: any) => a.status === 'DRAFT').length;
    const totalArticleViews = articles.reduce(
      (s: number, a: any) => s + (Number(a.views) || 0), 0,
    );

    const totalCustomers = customers.length;
    const totalStaff     = staff.length;
    const activeStaff    = staff.filter((s: any) => s.status === 'ACTIVE').length;

    const chartData = Array.from({ length: 7 }, (_, i) => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - (6 - i));
      const dateKey = targetDate.toISOString().slice(0, 10);
      const dayStr = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
      const dayLeads = leads.filter((l: any) => {
        if (!l.createdAt) return false;
        const dStr = l.createdAt instanceof Date ? l.createdAt.toISOString() : String(l.createdAt);
        return dStr.startsWith(dateKey);
      });
      const dayRevenue = dayLeads.reduce((s: number, l: any) => s + (Number(l.orderValue) || 0), 0);
      return {
        date: dayStr,
        leads: dayLeads.length,
        revenue: Math.round(dayRevenue / 1_000_000),
        views: Math.max(15, Math.floor(totalArticleViews / 7) + i * 4),
      };
    });

    const sortedLeads = [...leads].sort((a: any, b: any) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    );
    const recentLeads = sortedLeads.slice(0, 8);

    const allActivities: any[] = [];
    leads.forEach((l: any) => {
      if (!Array.isArray(l.auditLog)) return;
      l.auditLog.forEach((log: any) => {
        allActivities.push({
          id: log.id, leadId: l.id, requestCode: l.requestCode,
          customerName: l.customerName, user: log.user, action: log.action,
          details: log.details, timestamp: log.timestamp || l.updatedAt || l.createdAt,
        });
      });
    });
    allActivities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return NextResponse.json(
      {
        stats: {
          totalLeads, newLeads, processingLeads, closedLeads, wonLeads,
          conversionRate, totalRevenue, urgentLeads, highLeads,
          totalProducts, activeProducts, inStockProducts, lowStockProducts,
          outOfStockProducts, totalInventoryStock,
          totalArticles, publishedArticles, draftArticles, totalArticleViews,
          totalCustomers, totalStaff, activeStaff,
        },
        chartData,
        recentLeads,
        recentActivities: allActivities.slice(0, 8),
      },
      { headers: corsHeaders },
    );
  } catch (error: any) {
    console.error('Failed to get dashboard data:', error);
    return NextResponse.json(
      { message: 'Lỗi nạp dữ liệu dashboard' },
      { status: 500, headers: corsHeaders },
    );
  }
}
