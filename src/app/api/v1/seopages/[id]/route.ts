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
  const pageId = parseInt(id, 10);
  
  if (process.env.DATABASE_URL) {
    try {
      const dbPage = await prisma.seoPage.findFirst({
        where: {
          OR: [
            ...(!isNaN(pageId) ? [{ id: pageId }] : []),
            { slug: id }
          ]
        }
      });
      if (dbPage) return NextResponse.json(dbPage);
    } catch (e) {
      // fallback
    }
  }

  const page = store?.seopages?.find(p => (!isNaN(pageId) && p.id === pageId) || p.slug === id);
  if (!page) {
    return NextResponse.json({ message: 'Trang SEO không tồn tại' }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = parseInt(id, 10);

  try {
    const data = await request.json();
    let updatedPage: any = null;

    if (process.env.DATABASE_URL) {
      try {
        const existing = await prisma.seoPage.findFirst({
          where: {
            OR: [
              ...(!isNaN(pageId) ? [{ id: pageId }] : []),
              { slug: id }
            ]
          }
        });

        if (existing) {
          const { id: _id, ...cleanData } = data;
          updatedPage = await prisma.seoPage.update({
            where: { id: existing.id },
            data: {
              ...(cleanData.title !== undefined ? { title: cleanData.title } : {}),
              ...(cleanData.slug !== undefined ? { slug: cleanData.slug } : {}),
              ...(cleanData.keyword !== undefined ? { keyword: cleanData.keyword } : {}),
              ...(cleanData.content !== undefined ? { content: cleanData.content } : {}),
              ...(cleanData.status !== undefined ? { status: cleanData.status } : {}),
              ...(cleanData.metaTitle !== undefined ? { metaTitle: cleanData.metaTitle } : {}),
              ...(cleanData.metaDescription !== undefined ? { metaDescription: cleanData.metaDescription } : {}),
              ...(cleanData.views !== undefined ? { views: Number(cleanData.views) } : {})
            }
          });
        }
      } catch (dbErr) {
        console.error('Prisma seoPage update error:', dbErr);
      }
    }

    if (store?.seopages) {
      const index = store.seopages.findIndex(p => (!isNaN(pageId) && p.id === pageId) || p.slug === id);
      if (index !== -1) {
        store.seopages[index] = { 
          ...store.seopages[index], 
          ...data,
          ...(updatedPage || {}),
          updatedAt: new Date().toISOString()
        };
        savePersistedData();
      }
    }

    if (updatedPage) return NextResponse.json(updatedPage);
    const fallback = store?.seopages?.find(p => (!isNaN(pageId) && p.id === pageId) || p.slug === id);
    if (fallback) return NextResponse.json(fallback);

    return NextResponse.json({ message: 'Trang SEO không tồn tại' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = parseInt(id, 10);

  if (process.env.DATABASE_URL) {
    try {
      const existing = await prisma.seoPage.findFirst({
        where: {
          OR: [
            ...(!isNaN(pageId) ? [{ id: pageId }] : []),
            { slug: id }
          ]
        }
      });
      if (existing) {
        await prisma.seoPage.delete({ where: { id: existing.id } });
      }
    } catch (e) {
      console.error('Prisma seoPage delete error:', e);
    }
  }

  if (store?.seopages) {
    const index = store.seopages.findIndex(p => (!isNaN(pageId) && p.id === pageId) || p.slug === id);
    if (index !== -1) {
      store.seopages.splice(index, 1);
      savePersistedData();
    }
  }

  return NextResponse.json({ message: 'Xóa trang SEO thành công' });
}
