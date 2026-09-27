import { NextResponse } from 'next/server';
import { store } from '../store';
import { mockDashboardChartData } from '@/admin-utils/mockData';

export async function GET() {
  // Compute real-time stats from store
  const totalProducts = store.products.length;
  const activeProducts = store.products.filter(p => p.status === 'ACTIVE').length;
  const pendingProducts = store.products.filter(p => p.status === 'PENDING').length;
  const hiddenProducts = store.products.filter(p => p.status === 'HIDDEN').length;

  const totalArticles = store.articles.length;
  const publishedArticles = store.articles.filter(a => a.status === 'PUBLISHED').length;
  const draftArticles = store.articles.filter(a => a.status === 'DRAFT').length;
  const totalArticleViews = store.articles.reduce((acc, curr) => acc + (curr.views || 0), 0);

  const totalLeads = store.leads.length;
  const pendingLeads = store.leads.filter(l => l.status === 'NEW' || l.status === 'PENDING').length;
  const processingLeads = store.leads.filter(l => l.status === 'PROCESSING' || l.status === 'CONSULTING').length;
  const completedLeads = store.leads.filter(l => l.status === 'COMPLETED').length;

  const computedStats = {
    ...store.stats,
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

  return NextResponse.json({
    stats: computedStats,
    chartData: mockDashboardChartData,
    recentLeads: store.leads.slice(0, 10)
  });
}
