import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../../store';
import prisma from '@/lib/prisma';
import { getUniqueArticleSlug } from '@/lib/serverSlugHelper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const articleId = parseInt(decodedId, 10);

  if (process.env.DATABASE_URL) {
    try {
      const dbArticle = await prisma.article.findFirst({
        where: {
          OR: [
            ...(!isNaN(articleId) ? [{ id: articleId }] : []),
            { slug: decodedId }
          ]
        }
      });
      if (dbArticle) {
        return NextResponse.json(dbArticle);
      }
    } catch (e) {
      // fallback
    }
  }
  
  const article = store?.articles?.find(a => 
    (!isNaN(articleId) && a.id === articleId) || 
    String(a.id) === decodedId || 
    (a.slug && a.slug.toLowerCase().trim() === decodedId)
  );

  if (!article) {
    return NextResponse.json({ message: 'Tin tức không tồn tại' }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const articleId = parseInt(decodedId, 10);

  try {
    const data = await request.json();
    let updatedArticle: any = null;

    if (process.env.DATABASE_URL) {
      try {
        const existing = await prisma.article.findFirst({
          where: {
            OR: [
              ...(!isNaN(articleId) ? [{ id: articleId }] : []),
              { slug: decodedId }
            ]
          }
        });

        if (existing) {
          const { id: _id, ...cleanData } = data;

          let resolvedSlug = cleanData.slug;
          if (resolvedSlug) {
            resolvedSlug = await getUniqueArticleSlug(resolvedSlug, existing.id);
          }

          updatedArticle = await prisma.article.update({
            where: { id: existing.id },
            data: {
              ...(cleanData.title !== undefined ? { title: cleanData.title } : {}),
              ...(resolvedSlug !== undefined ? { slug: resolvedSlug } : {}),
              ...(cleanData.category !== undefined ? { category: cleanData.category } : {}),
              ...(cleanData.author !== undefined ? { author: cleanData.author } : {}),
              ...(cleanData.summary !== undefined ? { summary: cleanData.summary } : {}),
              ...(cleanData.content !== undefined ? { content: cleanData.content } : {}),
              ...(cleanData.thumbnail !== undefined ? { thumbnail: cleanData.thumbnail || cleanData.coverImg } : {}),
              ...(cleanData.views !== undefined ? { views: Number(cleanData.views) || 0 } : {}),
              ...(cleanData.status !== undefined ? { status: cleanData.status } : {}),
              ...(cleanData.isFeatured !== undefined ? { isFeatured: Boolean(cleanData.isFeatured) } : {}),
              ...(cleanData.tags !== undefined ? { tags: typeof cleanData.tags === 'string' ? cleanData.tags : (Array.isArray(cleanData.tags) ? cleanData.tags.join(', ') : '') } : {}),
              ...(cleanData.publishedAt !== undefined ? { publishedAt: cleanData.publishedAt } : {}),
            }
          });
        }
      } catch (dbErr) {
        console.warn('Prisma article update notice:', dbErr);
      }
    }

    if (store?.articles) {
      const index = store.articles.findIndex(a => 
        (!isNaN(articleId) && a.id === articleId) || 
        String(a.id) === decodedId || 
        (a.slug && a.slug.toLowerCase().trim() === decodedId)
      );

      if (index !== -1) {
        store.articles[index] = { 
          ...store.articles[index], 
          ...data,
          ...(updatedArticle || {})
        };
        savePersistedData();
      }
    }

    if (updatedArticle) {
      return NextResponse.json(updatedArticle);
    }

    const storeArt = store?.articles?.find(a => 
      (!isNaN(articleId) && a.id === articleId) || 
      String(a.id) === decodedId || 
      (a.slug && a.slug.toLowerCase().trim() === decodedId)
    );

    if (storeArt) {
      return NextResponse.json(storeArt);
    }

    return NextResponse.json({ message: 'Tin tức không tồn tại' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const articleId = parseInt(decodedId, 10);

  if (process.env.DATABASE_URL) {
    try {
      const existing = await prisma.article.findFirst({
        where: {
          OR: [
            ...(!isNaN(articleId) ? [{ id: articleId }] : []),
            { slug: decodedId }
          ]
        }
      });
      if (existing) {
        await prisma.article.delete({ where: { id: existing.id } });
      }
    } catch (e) {
      console.warn('Prisma article delete notice:', e);
    }
  }
  
  if (store?.articles) {
    const index = store.articles.findIndex(a => 
      (!isNaN(articleId) && a.id === articleId) || 
      String(a.id) === decodedId || 
      (a.slug && a.slug.toLowerCase().trim() === decodedId)
    );

    if (index !== -1) {
      const deleted = store.articles.splice(index, 1)[0];
      if (store.stats) {
        store.stats.totalArticles = Math.max(0, store.stats.totalArticles - 1);
        if (deleted?.status === 'PUBLISHED') {
          store.stats.publishedArticles = Math.max(0, store.stats.publishedArticles - 1);
        }
      }
      savePersistedData();
    }
  }

  return NextResponse.json({ message: 'Xóa thành công' });
}
