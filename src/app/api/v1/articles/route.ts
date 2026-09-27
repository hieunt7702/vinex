import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';

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
  if (process.env.DATABASE_URL) {
    try {
      const dbArticles = await prisma.article.findMany({
        orderBy: { id: 'desc' }
      });
      if (dbArticles && dbArticles.length > 0) {
        return NextResponse.json(dbArticles, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        });
      }
    } catch (e) {
      // Fallback
    }
  }

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
    const newId = store.articles.length > 0 ? Math.max(...store.articles.map(a => Number(a.id) || 0)) + 1 : 1;
    const newArticle = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };

    if (process.env.DATABASE_URL) {
      try {
        await prisma.article.create({
          data: {
            id: newId,
            title: data.title,
            slug: data.slug || `bai-viet-${newId}`,
            category: data.category || 'Tin tức VINEX',
            author: data.author || 'Truyền thông VINEX',
            summary: data.summary || '',
            content: data.content || '',
            thumbnail: data.thumbnail || data.coverImg || '',
            views: Number(data.views) || 0,
            status: data.status || 'PUBLISHED',
            tags: typeof data.tags === 'string' ? data.tags : (Array.isArray(data.tags) ? data.tags.join(', ') : ''),
            publishedAt: data.publishedAt || new Date().toISOString()
          }
        });
      } catch (dbErr) {
        console.warn('Prisma article create error (fallback to store):', dbErr);
      }
    }

    store.articles.push(newArticle);
    savePersistedData();

    if (store.stats) {
      store.stats.totalArticles++;
      if (newArticle.status === 'PUBLISHED') store.stats.publishedArticles++;
    }
    
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
