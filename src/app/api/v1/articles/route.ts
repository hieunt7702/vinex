import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';
import { sortArticlesNewestFirst } from '@/lib/imageUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const dbArticles = await prisma.article.findMany({
        orderBy: { id: 'desc' }
      });
      if (dbArticles && dbArticles.length > 0) {
        const sorted = sortArticlesNewestFirst(dbArticles);
        return NextResponse.json(sorted, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        });
      }
    } catch (e) {
      // Fallback
    }
  }

  const sorted = sortArticlesNewestFirst(store.articles);
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
      isFeatured: Boolean(data.isFeatured),
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
            isFeatured: Boolean(data.isFeatured),
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
