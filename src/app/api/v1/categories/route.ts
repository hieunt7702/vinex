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
    const newId = store.categories.length > 0 ? Math.max(...store.categories.map(c => Number(c.id) || 0)) + 1 : 1;
    const newCategory = {
      ...data,
      id: newId,
      status: data.status || 'ACTIVE'
    };

    if (process.env.DATABASE_URL) {
      try {
        await prisma.category.create({
          data: {
            id: newId,
            name: data.name,
            slug: data.slug || `danh-muc-${newId}`,
            type: data.type || 'Sản phẩm',
            parentId: data.parentId ? Number(data.parentId) : null,
            description: data.description || '',
            status: data.status || 'ACTIVE',
            attributes: data.attributes ? JSON.stringify(data.attributes) : undefined
          }
        });
      } catch (dbErr) {
        console.warn('Prisma category create error (fallback to store):', dbErr);
      }
    }

    store.categories.push(newCategory);
    savePersistedData();
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
