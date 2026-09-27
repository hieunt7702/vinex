import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../../store';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id, 10);

  if (process.env.DATABASE_URL) {
    try {
      const dbArticle = await prisma.article.findFirst({
        where: {
          OR: [
            ...(!isNaN(articleId) ? [{ id: articleId }] : []),
            { slug: id }
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
  
  const article = store.articles.find(a => 
    (!isNaN(articleId) && a.id === articleId) || 
    String(a.id) === String(id) || 
    a.slug === id
  );

  if (!article) {
    return NextResponse.json({ message: 'Tin tức không tồn tại' }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  
  const index = store.articles.findIndex(a => 
    (!isNaN(articleId) && a.id === articleId) || 
    String(a.id) === String(id) || 
    a.slug === id
  );

  if (index === -1 && !process.env.DATABASE_URL) {
    return NextResponse.json({ message: 'Tin tức không tồn tại' }, { status: 404 });
  }

  try {
    const data = await request.json();

    if (process.env.DATABASE_URL && !isNaN(articleId)) {
      try {
        await prisma.article.update({
          where: { id: articleId },
          data: {
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.slug !== undefined ? { slug: data.slug } : {}),
            ...(data.category !== undefined ? { category: data.category } : {}),
            ...(data.author !== undefined ? { author: data.author } : {}),
            ...(data.summary !== undefined ? { summary: data.summary } : {}),
            ...(data.content !== undefined ? { content: data.content } : {}),
            ...(data.thumbnail !== undefined ? { thumbnail: data.thumbnail } : {}),
            ...(data.views !== undefined ? { views: Number(data.views) || 0 } : {}),
            ...(data.status !== undefined ? { status: data.status } : {}),
            ...(data.isFeatured !== undefined ? { isFeatured: Boolean(data.isFeatured) } : {}),
            ...(data.publishedAt !== undefined ? { publishedAt: data.publishedAt } : {}),
          }
        });
      } catch (dbErr) {
        console.warn('Prisma article update notice:', dbErr);
      }
    }

    if (index !== -1) {
      store.articles[index] = { 
        ...store.articles[index], 
        ...data,
        ...(data.isFeatured !== undefined ? { isFeatured: Boolean(data.isFeatured) } : {})
      };
      savePersistedData();
      return NextResponse.json(store.articles[index]);
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id, 10);

  if (process.env.DATABASE_URL && !isNaN(articleId)) {
    try {
      await prisma.article.delete({ where: { id: articleId } });
    } catch (e) {
      console.warn('Prisma article delete notice:', e);
    }
  }
  
  const index = store.articles.findIndex(a => 
    (!isNaN(articleId) && a.id === articleId) || 
    String(a.id) === String(id) || 
    a.slug === id
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

  return NextResponse.json({ message: 'Xóa thành công' });
}
