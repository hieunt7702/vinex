import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
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

  // Generate dynamic chart data for the last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    return {
      date: dayStr,
      leads: store.leads.filter((l: any) => l.createdAt && l.createdAt.startsWith(d.toISOString().slice(0, 10))).length,
      views: Math.floor(totalArticleViews / 7) || 0
    };
  });

  return NextResponse.json({
    stats: computedStats,
    chartData,
    recentLeads: store.leads.slice(0, 10)
  });
}
