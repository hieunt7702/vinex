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
      const dbCats = await prisma.category.findMany({
        orderBy: { id: 'asc' }
      });
      if (dbCats && dbCats.length > 0) {
        return NextResponse.json(dbCats, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        });
      }
    } catch (e) {
      // Fallback to store
    }
  }

  return NextResponse.json(store.categories, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let createdCategory: any = null;

    if (process.env.DATABASE_URL) {
      try {
        const genSlug = data.slug || `danh-muc-${Date.now()}`;
        createdCategory = await prisma.category.create({
          data: {
            name: data.name,
            slug: genSlug,
            type: data.type || 'Sản phẩm',
            parentId: data.parentId ? Number(data.parentId) : null,
            description: data.description || '',
            status: data.status || 'ACTIVE',
            attributes: data.attributes ? (typeof data.attributes === 'string' ? JSON.parse(data.attributes) : data.attributes) : undefined
          }
        });
      } catch (dbErr) {
        console.error('Prisma category create error (fallback to store):', dbErr);
      }
    }

    const finalCategory = createdCategory || {
      ...data,
      id: store.categories.length > 0 ? Math.max(...store.categories.map(c => Number(c.id) || 0)) + 1 : 1,
      status: data.status || 'ACTIVE'
    };

    store.categories.push(finalCategory);
    savePersistedData();
    
    return NextResponse.json(finalCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
