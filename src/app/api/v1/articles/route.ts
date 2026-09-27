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
    let createdArticle: any = null;

    if (process.env.DATABASE_URL) {
      try {
        const genSlug = data.slug || `bai-viet-${Date.now()}`;
        createdArticle = await prisma.article.create({
          data: {
            title: data.title,
            slug: genSlug,
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
        console.error('Prisma article create error (fallback to store):', dbErr);
      }
    }

    const finalArticle = createdArticle || {
      ...data,
      id: store.articles.length > 0 ? Math.max(...store.articles.map(a => Number(a.id) || 0)) + 1 : 1,
      isFeatured: Boolean(data.isFeatured),
      createdAt: new Date().toISOString()
    };

    store.articles.unshift(finalArticle);
    savePersistedData();

    if (store.stats) {
      store.stats.totalArticles++;
      if (finalArticle.status === 'PUBLISHED') store.stats.publishedArticles++;
    }
    
    return NextResponse.json(finalArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
