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
// KEY DESIGN GOALS:
// 1. Fully resilient — safe wrappers on every query so single DB failures never crash the page
// 2. Parallel execution for high throughput
// 3. Fallback to in-memory store if DB is offline
// 4. Never return HTTP 500 to the admin dashboard UI
// ─────────────────────────────────────────────────────────────────────────────

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    console.warn('[Dashboard API] Query warning (using fallback):', err?.message || err);
    return fallback;
  }
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const { searchParams } = new URL(request.url);
    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');

    let fromDate: Date | null = null;
    if (fromStr) {
      const d = new Date(fromStr);
      if (!isNaN(d.getTime())) fromDate = d;
    }

    let toDate: Date | null = null;
    if (toStr) {
      const d = new Date(toStr);
      if (!isNaN(d.getTime())) {
        d.setHours(23, 59, 59, 999);
        toDate = d;
      }
    }

    const dateFilter = fromDate || toDate
      ? {
          createdAt: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: toDate } : {}),
          },
        }
      : {};

    if (process.env.DATABASE_URL) {
      try {
        // Parallel queries using safeQuery to prevent any single failure from cascading
        const [
          totalLeads,
          newLeads,
          processingLeads,
          closedLeads,
          wonLeads,
          urgentLeads,
          highLeads,
          totalProducts,
          activeProducts,
          inStockProducts,
          lowStockProducts,
          outOfStockProducts,
          inventoryAgg,
          totalArticles,
          publishedArticles,
          draftArticles,
          articleViewsAgg,
          totalCustomers,
          totalStaff,
          activeStaff,
          revenueAgg,
          recentLeadsRaw,
          chartLeadsRaw,
        ] = await Promise.all([
          // Leads
          safeQuery(() => prisma.lead.count({ where: dateFilter }), 0),
          safeQuery(() => prisma.lead.count({ where: { ...dateFilter, status: 'NEW' } }), 0),
          safeQuery(() => prisma.lead.count({
            where: {
              ...dateFilter,
              status: { in: ['ASSIGNED', 'PROCESSING', 'WAITING_CUSTOMER', 'WAITING_INTERNAL'] },
            },
          }), 0),
          safeQuery(() => prisma.lead.count({ where: { ...dateFilter, status: 'CLOSED' } }), 0),
          safeQuery(() => prisma.lead.count({
            where: {
              ...dateFilter,
              status: 'CLOSED',
              closingResult: { in: ['ORDER_CREATED', 'RESOLVED'] },
            },
          }), 0),
          safeQuery(() => prisma.lead.count({ where: { ...dateFilter, priority: 'URGENT' } }), 0),
          safeQuery(() => prisma.lead.count({ where: { ...dateFilter, priority: 'HIGH' } }), 0),
          // Products
          safeQuery(() => prisma.product.count({}), 0),
          safeQuery(() => prisma.product.count({ where: { status: 'ACTIVE' } }), 0),
          safeQuery(() => prisma.product.count({ where: { stockStatus: 'IN_STOCK' } }), 0),
          safeQuery(() => prisma.product.count({ where: { stockStatus: 'LOW_STOCK' } }), 0),
          safeQuery(() => prisma.product.count({ where: { stockStatus: 'OUT_OF_STOCK' } }), 0),
          safeQuery(() => prisma.product.aggregate({ _sum: { stockQuantity: true } }), { _sum: { stockQuantity: 0 } }),
          // Articles
          safeQuery(() => prisma.article.count({}), 0),
          safeQuery(() => prisma.article.count({ where: { status: 'PUBLISHED' } }), 0),
          safeQuery(() => prisma.article.count({ where: { status: 'DRAFT' } }), 0),
          safeQuery(() => prisma.article.aggregate({ _sum: { views: true } }), { _sum: { views: 0 } }),
          // Customers & Staff
          safeQuery(() => prisma.customer.count({}), 0),
          Promise.resolve((store?.staff || []).length || 1),
          Promise.resolve((store?.staff || []).filter((s: any) => s.status === 'ACTIVE').length || 1),
          // Revenue aggregate
          safeQuery(() => prisma.lead.aggregate({
            _sum: { orderValue: true },
            where: dateFilter,
          }), { _sum: { orderValue: 0 } }),
          // Recent leads (last 8)
          safeQuery(
            () => prisma.lead.findMany({
              where: dateFilter,
              orderBy: { createdAt: 'desc' },
              take: 8,
              select: {
                id: true, requestCode: true, customerName: true, companyName: true,
                phone: true, status: true, priority: true, purpose: true,
                productGroup: true, createdAt: true, assignee: true,
                orderValue: true, auditLog: true,
              },
            }),
            []
          ),
          // Last 7 days leads for chart
          safeQuery(
            () => prisma.lead.findMany({
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
              },
              select: { createdAt: true, orderValue: true },
            }),
            []
          ),
        ]);

        const totalRevenue = Number(revenueAgg?._sum?.orderValue ?? 0);
        const totalInventoryStock = Number(inventoryAgg?._sum?.stockQuantity ?? 0);
        const totalArticleViews = Number(articleViewsAgg?._sum?.views ?? 0);
        const conversionRate = totalLeads > 0
          ? `${Math.round((wonLeads / totalLeads) * 100)}%`
          : '0%';

        // Chart data: last 7 days
        const chartData = Array.from({ length: 7 }, (_, i) => {
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() - (6 - i));
          const dateKey = targetDate.toISOString().slice(0, 10);
          const dayStr = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}`;

          const dayLeads = (chartLeadsRaw || []).filter((l: any) => {
            if (!l?.createdAt) return false;
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
            views: Math.max(15, Math.floor(totalArticleViews / 7) + i * 4),
          };
        });

        // Recent System Activity Feed extracted from lead audit logs
        const allActivities: any[] = [];
        (recentLeadsRaw || []).forEach((l: any) => {
          if (!Array.isArray(l.auditLog)) return;
          l.auditLog.forEach((log: any) => {
            allActivities.push({
              id: log.id || `audit_${Date.now()}_${Math.random()}`,
              leadId: l.id,
              requestCode: l.requestCode,
              customerName: l.customerName,
              user: log.user || 'Hệ thống',
              action: log.action || 'Cập nhật',
              details: log.details || '',
              timestamp: log.timestamp || l.updatedAt || l.createdAt,
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
            recentLeads: recentLeadsRaw || [],
            recentActivities: allActivities.slice(0, 8),
          },
          { headers: corsHeaders },
        );
      } catch (dbErr) {
        console.error('[Dashboard API] DB block error, falling back to in-memory store:', dbErr);
        // Fall through to in-memory store fallback below
      }
    }

    // ── In-memory store fallback (dev / no DB / DB failure) ────────────────────
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
    const totalStaff     = staff.length || 1;
    const activeStaff    = staff.filter((s: any) => s.status === 'ACTIVE').length || 1;

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
    console.error('Failed to get dashboard data (emergency fallback):', error);
    return NextResponse.json(
      {
        stats: {
          totalLeads: 0, newLeads: 0, processingLeads: 0, closedLeads: 0, wonLeads: 0,
          conversionRate: '0%', totalRevenue: 0, urgentLeads: 0, highLeads: 0,
          totalProducts: 0, activeProducts: 0, inStockProducts: 0, lowStockProducts: 0,
          outOfStockProducts: 0, totalInventoryStock: 0,
          totalArticles: 0, publishedArticles: 0, draftArticles: 0, totalArticleViews: 0,
          totalCustomers: 0, totalStaff: 1, activeStaff: 1,
        },
        chartData: Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            date: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
            leads: 0,
            revenue: 0,
            views: 0,
          };
        }),
        recentLeads: [],
        recentActivities: [],
      },
      { status: 200, headers: corsHeaders },
    );
  }
}
