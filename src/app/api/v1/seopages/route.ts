import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const dbPages = await prisma.seoPage.findMany({
        orderBy: { id: 'desc' }
      });
      if (dbPages && dbPages.length > 0) {
        return NextResponse.json(dbPages);
      }
    } catch (e) {
      // fallback
    }
  }
  return NextResponse.json(store?.seopages || []);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let createdPage: any = null;

    if (process.env.DATABASE_URL) {
      try {
        const genSlug = data.slug || `trang-seo-${Date.now()}`;
        createdPage = await prisma.seoPage.create({
          data: {
            title: data.title || 'Trang SEO mới',
            slug: genSlug,
            keyword: data.keyword || '',
            content: data.content || '',
            status: data.status || 'ACTIVE',
            metaTitle: data.metaTitle || data.title || '',
            metaDescription: data.metaDescription || '',
            views: Number(data.views) || 0
          }
        });
      } catch (dbErr) {
        console.error('Prisma seoPage create error:', dbErr);
      }
    }

    const finalPage = createdPage || {
      ...data,
      id: store?.seopages?.length ? Math.max(...store.seopages.map(p => Number(p.id) || 0)) + 1 : 1,
      views: data.views || 0,
      updatedAt: new Date().toISOString()
    };

    if (store?.seopages) {
      store.seopages.unshift(finalPage);
      savePersistedData();
    }
    
    return NextResponse.json(finalPage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
