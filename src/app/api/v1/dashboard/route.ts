import { NextResponse } from 'next/server';
import { store } from '../store';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const [
        totalProducts,
        activeProducts,
        pendingProducts,
        hiddenProducts,
        totalArticles,
        publishedArticles,
        draftArticles,
        totalLeads,
        pendingLeads,
        processingLeads,
        completedLeads,
        recentLeads,
        articleViewSum
      ] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { status: 'ACTIVE' } }),
        prisma.product.count({ where: { status: 'PENDING' } }),
        prisma.product.count({ where: { status: 'HIDDEN' } }),
        prisma.article.count(),
        prisma.article.count({ where: { status: 'PUBLISHED' } }),
        prisma.article.count({ where: { status: 'DRAFT' } }),
        prisma.lead.count(),
        prisma.lead.count({ where: { status: { in: ['NEW', 'PENDING'] } } }),
        prisma.lead.count({ where: { status: { in: ['PROCESSING', 'CONSULTING'] } } }),
        prisma.lead.count({ where: { status: 'COMPLETED' } }),
        prisma.lead.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
        prisma.article.aggregate({ _sum: { views: true } })
      ]);

      const totalArticleViews = articleViewSum._sum.views || 0;

      const computedStats = {
        totalProducts,
        activeProducts,
        pendingProducts,
        hiddenProducts,
        totalArticles,
        publishedArticles,
        draftArticles,
        totalArticleViews,
        totalLeads,
        pendingLeads,
        processingLeads,
        completedLeads,
        conversionRate: totalLeads > 0 ? `${Math.round((completedLeads / totalLeads) * 100)}%` : '0%'
      };

      const chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
        return {
          date: dayStr,
          leads: recentLeads.filter((l: any) => l.createdAt && new Date(l.createdAt).toISOString().startsWith(d.toISOString().slice(0, 10))).length,
          views: Math.floor(totalArticleViews / 7) || 0
        };
      });

      return NextResponse.json({
        stats: computedStats,
        chartData,
        recentLeads
      });
    } catch (dbErr) {
      console.warn('Dashboard DB query fallback:', dbErr);
    }
  }

  // Fallback to in-memory store
  const totalProducts = store?.products?.length || 0;
  const activeProducts = store?.products?.filter(p => p.status === 'ACTIVE').length || 0;
  const pendingProducts = store?.products?.filter(p => p.status === 'PENDING').length || 0;
  const hiddenProducts = store?.products?.filter(p => p.status === 'HIDDEN').length || 0;

  const totalArticles = store?.articles?.length || 0;
  const publishedArticles = store?.articles?.filter(a => a.status === 'PUBLISHED').length || 0;
  const draftArticles = store?.articles?.filter(a => a.status === 'DRAFT').length || 0;
  const totalArticleViews = store?.articles?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

  const totalLeads = store?.leads?.length || 0;
  const pendingLeads = store?.leads?.filter(l => l.status === 'NEW' || l.status === 'PENDING').length || 0;
  const processingLeads = store?.leads?.filter(l => l.status === 'PROCESSING' || l.status === 'CONSULTING').length || 0;
  const completedLeads = store?.leads?.filter(l => l.status === 'COMPLETED').length || 0;

  const computedStats = {
    ...store?.stats,
    totalProducts,
    activeProducts,
    pendingProducts,
    hiddenProducts,
    totalArticles,
    publishedArticles,
    draftArticles,
    totalArticleViews,
    totalLeads,
    pendingLeads,
    processingLeads,
    completedLeads
  };

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    return {
      date: dayStr,
      leads: store?.leads?.filter((l: any) => l.createdAt && l.createdAt.startsWith(d.toISOString().slice(0, 10))).length || 0,
      views: Math.floor(totalArticleViews / 7) || 0
    };
  });

  return NextResponse.json({
    stats: computedStats,
    chartData,
    recentLeads: store?.leads?.slice(0, 10) || []
  });
}
