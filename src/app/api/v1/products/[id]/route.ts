import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../../store';
import prisma from '@/lib/prisma';
import { getUniqueProductSlug } from '@/lib/serverSlugHelper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const numId = Number(decodedId);

  // 1. Try Prisma DB first
  if (process.env.DATABASE_URL) {
    try {
      const dbProd = await prisma.product.findFirst({
        where: {
          OR: [
            ...(!isNaN(numId) ? [{ id: numId }] : []),
            { slug: decodedId },
            { productId: decodedId }
          ]
        },
        include: { categories: true }
      });
      if (dbProd) {
        return NextResponse.json({
          ...dbProd,
          categoryIds: dbProd.categories.map((c: any) => c.id)
        });
      }
    } catch (e) {
      // Fallback to store
    }
  }

  // 2. Fallback to in-memory store
  const product = store?.products?.find((p: any) => 
    String(p.id) === decodedId || 
    (p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedId) ||
    (p.productId && p.productId.toLowerCase().trim() === decodedId)
  );

  if (!product) {
    return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const numId = Number(decodedId);

  try {
    const data = await request.json();
    let updatedProduct: any = null;

    // 1. Update in Prisma DB
    if (process.env.DATABASE_URL) {
      try {
        const existing = await prisma.product.findFirst({
          where: {
            OR: [
              ...(!isNaN(numId) ? [{ id: numId }] : []),
              { slug: decodedId },
              { productId: decodedId }
            ]
          }
        });

        if (existing) {
          let categorySet: any = undefined;
          if (Array.isArray(data.categoryIds)) {
            const numIds = data.categoryIds.map((cid: any) => Number(cid)).filter((n: number) => !isNaN(n));
            const validCats = await prisma.category.findMany({
              where: { id: { in: numIds } },
              select: { id: true }
            });
            categorySet = { set: validCats.map((c: any) => ({ id: c.id })) };
          }

          const { categoryIds, categories, id: _id, ...cleanData } = data;

          let resolvedSlug = cleanData.slug;
          if (resolvedSlug) {
            resolvedSlug = await getUniqueProductSlug(resolvedSlug, existing.id);
          }

          updatedProduct = await prisma.product.update({
            where: { id: existing.id },
            data: {
              ...(cleanData.name !== undefined ? { name: cleanData.name } : {}),
              ...(resolvedSlug !== undefined ? { slug: resolvedSlug } : {}),
              ...(cleanData.segment !== undefined ? { segment: cleanData.segment } : {}),
              ...(cleanData.price !== undefined ? { price: Number(cleanData.price) } : {}),
              ...(cleanData.promotionalPrice !== undefined ? { promotionalPrice: Number(cleanData.promotionalPrice) } : {}),
              ...(cleanData.stockQuantity !== undefined ? { stockQuantity: Number(cleanData.stockQuantity) } : {}),
              ...(cleanData.stockStatus !== undefined ? { stockStatus: cleanData.stockStatus } : {}),
              ...(cleanData.lowStockThreshold !== undefined ? { lowStockThreshold: Number(cleanData.lowStockThreshold) } : {}),
              ...(cleanData.shortDescription !== undefined ? { shortDescription: cleanData.shortDescription } : {}),
              ...(cleanData.description !== undefined ? { description: cleanData.description } : {}),
              ...(cleanData.status !== undefined ? { status: cleanData.status } : {}),
              ...(cleanData.images !== undefined ? { images: cleanData.images } : {}),
              ...(cleanData.attributes !== undefined ? { attributes: cleanData.attributes } : {}),
              ...(categorySet ? { categories: categorySet } : {})
            },
            include: { categories: true }
          });
        }
      } catch (dbErr) {
        console.error('Prisma product update error:', dbErr);
      }
    }

    // 2. Also update in-memory store
    if (store?.products) {
      const index = store.products.findIndex((p: any) => 
        String(p.id) === decodedId || 
        (p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedId) ||
        (p.productId && p.productId.toLowerCase().trim() === decodedId)
      );

      if (index !== -1) {
        store.products[index] = { 
          ...store.products[index], 
          ...data,
          ...(updatedProduct ? {
            ...updatedProduct,
            categoryIds: updatedProduct.categories?.map((c: any) => c.id) || data.categoryIds
          } : {})
        };
        savePersistedData();
      }
    }

    if (updatedProduct) {
      return NextResponse.json({
        ...updatedProduct,
        categoryIds: updatedProduct.categories?.map((c: any) => c.id) || []
      });
    }

    // Fallback response from store if DB was offline
    const storeProd = store?.products?.find((p: any) => 
      String(p.id) === decodedId || 
      (p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedId) ||
      (p.productId && p.productId.toLowerCase().trim() === decodedId)
    );

    if (storeProd) {
      return NextResponse.json(storeProd);
    }

    return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const numId = Number(decodedId);

  // 1. Delete in Prisma DB
  if (process.env.DATABASE_URL) {
    try {
      const existing = await prisma.product.findFirst({
        where: {
          OR: [
            ...(!isNaN(numId) ? [{ id: numId }] : []),
            { slug: decodedId },
            { productId: decodedId }
          ]
        }
      });
      if (existing) {
        await prisma.product.delete({ where: { id: existing.id } });
      }
    } catch (e) {
      console.error('Prisma product delete error:', e);
    }
  }

  // 2. Delete from in-memory store
  if (store?.products) {
    const index = store.products.findIndex((p: any) => 
      String(p.id) === decodedId || 
      (p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedId) ||
      (p.productId && p.productId.toLowerCase().trim() === decodedId)
    );

    if (index !== -1) {
      store.products.splice(index, 1);
      if (store.stats && store.stats.totalProducts > 0) store.stats.totalProducts--;
      savePersistedData();
    }
  }

  return NextResponse.json({ message: 'Xóa thành công' });
}
