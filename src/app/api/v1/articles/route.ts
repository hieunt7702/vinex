import { NextResponse } from 'next/server';
import { store } from '../store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

export async function GET() {
  const sorted = [...store.articles].sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    if (timeA && timeB && timeA !== timeB) return timeB - timeA;
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });
  return NextResponse.json(sorted, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newArticle = {
      ...data,
      id: store.articles.length > 0 ? Math.max(...store.articles.map(a => Number(a.id) || 0)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    store.articles.push(newArticle);
    store.stats.totalArticles++;
    if (newArticle.status === 'PUBLISHED') store.stats.publishedArticles++;
    
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
