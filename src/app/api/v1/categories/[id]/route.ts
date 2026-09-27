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
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const categoryId = parseInt(decodedId, 10);

  if (process.env.DATABASE_URL) {
    try {
      const dbCat = await prisma.category.findFirst({
        where: {
          OR: [
            ...(!isNaN(categoryId) ? [{ id: categoryId }] : []),
            { slug: decodedId }
          ]
        }
      });
      if (dbCat) {
        return NextResponse.json(dbCat);
      }
    } catch (e) {
      // Fallback to store
    }
  }

  const category = store?.categories?.find(c => 
    (!isNaN(categoryId) && c.id === categoryId) || 
    String(c.id) === decodedId || 
    c.slug === decodedId
  );

  if (!category) {
    return NextResponse.json({ message: 'Danh mục không tồn tại' }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const categoryId = parseInt(decodedId, 10);
  
  try {
    const data = await request.json();
    let updatedCategory: any = null;

    if (process.env.DATABASE_URL) {
      try {
        const existing = await prisma.category.findFirst({
          where: {
            OR: [
              ...(!isNaN(categoryId) ? [{ id: categoryId }] : []),
              { slug: decodedId }
            ]
          }
        });

        if (existing) {
          const { id: _id, ...cleanData } = data;
          updatedCategory = await prisma.category.update({
            where: { id: existing.id },
            data: {
              ...(cleanData.name !== undefined ? { name: cleanData.name } : {}),
              ...(cleanData.slug !== undefined ? { slug: cleanData.slug } : {}),
              ...(cleanData.type !== undefined ? { type: cleanData.type } : {}),
              ...(cleanData.parentId !== undefined ? { parentId: cleanData.parentId ? Number(cleanData.parentId) : null } : {}),
              ...(cleanData.description !== undefined ? { description: cleanData.description } : {}),
              ...(cleanData.status !== undefined ? { status: cleanData.status } : {}),
              ...(cleanData.isPinned !== undefined ? { isPinned: Boolean(cleanData.isPinned) } : {}),
              ...(cleanData.attributes !== undefined ? { attributes: typeof cleanData.attributes === 'string' ? JSON.parse(cleanData.attributes) : cleanData.attributes } : {})
            }
          });
        }
      } catch (dbErr) {
        console.error('Prisma category update error:', dbErr);
      }
    }

    if (store?.categories) {
      const index = store.categories.findIndex(c => 
        (!isNaN(categoryId) && c.id === categoryId) || 
        String(c.id) === decodedId || 
        c.slug === decodedId
      );

      if (index !== -1) {
        store.categories[index] = { ...store.categories[index], ...data, ...(updatedCategory || {}) };
        savePersistedData();
      }
    }

    if (updatedCategory) {
      return NextResponse.json(updatedCategory);
    }

    const storeCat = store?.categories?.find(c => 
      (!isNaN(categoryId) && c.id === categoryId) || 
      String(c.id) === decodedId || 
      c.slug === decodedId
    );

    if (storeCat) {
      return NextResponse.json(storeCat);
    }

    return NextResponse.json({ message: 'Danh mục không tồn tại' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const categoryId = parseInt(decodedId, 10);

  if (process.env.DATABASE_URL) {
    try {
      const existing = await prisma.category.findFirst({
        where: {
          OR: [
            ...(!isNaN(categoryId) ? [{ id: categoryId }] : []),
            { slug: decodedId }
          ]
        }
      });
      if (existing) {
        await prisma.category.delete({ where: { id: existing.id } });
      }
    } catch (e) {
      console.error('Prisma category delete error:', e);
    }
  }

  let deletedId = categoryId;
  if (store?.categories) {
    const index = store.categories.findIndex(c => 
      (!isNaN(categoryId) && c.id === categoryId) || 
      String(c.id) === decodedId || 
      c.slug === decodedId
    );

    if (index !== -1) {
      const deleted = store.categories.splice(index, 1)[0];
      deletedId = deleted?.id || categoryId;
      savePersistedData();
    }
  }

  return NextResponse.json({ message: 'Xóa thành công', id: deletedId });
}
