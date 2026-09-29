import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';
import { getUniqueProductSlug } from '@/lib/serverSlugHelper';
import { getUserFromRequest } from '@/lib/auditHelper';
import { handleCorsPreflight } from '@/lib/cors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

// Minimal category select to avoid loading unused relation data
const CATEGORY_SELECT = {
  categories: {
    select: { id: true, name: true, slug: true },
  },
} as const;

const NO_CACHE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

export async function GET(request: Request) {
  try {
    const url  = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const id   = url.searchParams.get('id');

    // ── DB path ────────────────────────────────────────────────────────────
    if (process.env.DATABASE_URL) {
      try {
        if (slug) {
          const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
          const cleanSlug   = decodedSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
          const dbProd = await prisma.product.findFirst({
            where: {
              OR: [
                { slug: decodedSlug },
                { slug: { equals: decodedSlug, mode: 'insensitive' } },
                { slug: { startsWith: cleanSlug, mode: 'insensitive' } },
              ],
            },
            include: CATEGORY_SELECT,
          });
          if (dbProd) {
            return NextResponse.json(
              { ...dbProd, categoryIds: dbProd.categories.map((c: any) => c.id) },
              { headers: NO_CACHE },
            );
          }
          return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
        }

        if (id) {
          const numId  = Number(id);
          const dbProd = await prisma.product.findFirst({
            where: {
              OR: [
                ...(isNaN(numId) ? [] : [{ id: numId }]),
                { productId: id },
              ],
            },
            include: CATEGORY_SELECT,
          });
          if (dbProd) {
            return NextResponse.json(
              { ...dbProd, categoryIds: dbProd.categories.map((c: any) => c.id) },
              { headers: NO_CACHE },
            );
          }
          return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
        }

        // List all — only load columns needed by admin; skip heavy text columns
        const dbProds = await prisma.product.findMany({
          include: CATEGORY_SELECT,
          orderBy: { id: 'desc' },
        });
        return NextResponse.json(
          dbProds.map((p: any) => ({
            ...p,
            categoryIds: p.categories.map((c: any) => c.id),
          })),
          { headers: NO_CACHE },
        );
      } catch {
        // fall through to store
      }
    }

    // ── In-memory store fallback ─────────────────────────────────────────
    if (slug) {
      const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
      const cleanSlug   = decodedSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
      let product = store.products.find(
        (p) => p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedSlug,
      );
      if (!product) {
        product = store.products.find((p) => {
          const pSlug = decodeURIComponent(p.slug || '').toLowerCase().trim();
          const cleanPSlug = pSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
          return cleanPSlug === cleanSlug || pSlug.startsWith(cleanSlug);
        });
      }
      if (product) return NextResponse.json(product);
      return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    if (id) {
      const decodedId = decodeURIComponent(id).toLowerCase().trim();
      const product = store.products.find(
        (p) =>
          String(p.id) === decodedId ||
          (p.productId && p.productId.toLowerCase().trim() === decodedId),
      );
      if (product) return NextResponse.json(product);
      return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    const sorted = [...store.products].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (diff !== 0) return diff;
      }
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
    return NextResponse.json(sorted, { headers: NO_CACHE });
  } catch {
    return NextResponse.json([...store.products]);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let createdProduct: any = null;

    if (process.env.DATABASE_URL) {
      try {
        // Validate category IDs in a single query
        let categoryConnect: any = undefined;
        if (Array.isArray(data.categoryIds) && data.categoryIds.length > 0) {
          const numIds = data.categoryIds
            .map((cid: any) => Number(cid))
            .filter((n: number) => !isNaN(n));
          if (numIds.length > 0) {
            const validCats = await prisma.category.findMany({
              where: { id: { in: numIds } },
              select: { id: true },
            });
            if (validCats.length > 0) {
              categoryConnect = { connect: validCats.map((c: any) => ({ id: c.id })) };
            }
          }
        }

        const genSlug      = await getUniqueProductSlug(data.slug || data.name || 'san-pham');
        const genSku       = data.sku ? data.sku.trim() : `VNX-SKU-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        const genProductId = data.productId ? data.productId.trim() : `VNX-${Date.now().toString().slice(-4)}-${Math.floor(10 + Math.random() * 90)}`;

        createdProduct = await prisma.product.create({
          data: {
            productId:        genProductId,
            sku:              genSku,
            name:             data.name,
            slug:             genSlug,
            segment:          data.segment || 'cao-cap',
            price:            data.price !== undefined ? Number(data.price) : 0,
            promotionalPrice: data.promotionalPrice !== undefined ? Number(data.promotionalPrice) : 0,
            stockQuantity:    data.stockQuantity !== undefined ? Number(data.stockQuantity) : 100,
            stockStatus:      data.stockStatus || 'IN_STOCK',
            lowStockThreshold: data.lowStockThreshold !== undefined ? Number(data.lowStockThreshold) : 10,
            shortDescription: data.shortDescription || '',
            description:      data.description || '',
            status:           data.status || 'ACTIVE',
            images:           Array.isArray(data.images) ? data.images : (data.img ? [data.img] : []),
            attributes:       Array.isArray(data.attributes) ? data.attributes : [],
            categories:       categoryConnect,
          },
          include: CATEGORY_SELECT,
        });
      } catch (dbErr) {
        console.error('Prisma DB product create error (fallback to store):', dbErr);
      }
    }

    const user   = getUserFromRequest(request, data);
    const nowIso = new Date().toISOString();

    const finalProduct = createdProduct
      ? {
          ...createdProduct,
          createdBy: user,
          updatedBy: user,
          version: 1,
          createdAt: nowIso,
          updatedAt: nowIso,
          categoryIds: createdProduct.categories?.map((c: any) => c.id) || data.categoryIds || [],
        }
      : {
          ...data,
          id: store.products.length > 0
            ? Math.max(...store.products.map((p) => Number(p.id) || 0)) + 1
            : 1,
          status: data.status || 'ACTIVE',
          createdBy: user,
          updatedBy: user,
          version: 1,
          createdAt: nowIso,
          updatedAt: nowIso,
        };

    store.products.unshift(finalProduct);
    savePersistedData();

    if (store.stats) {
      store.stats.totalProducts++;
      if (finalProduct.status === 'ACTIVE') store.stats.activeProducts++;
    }

    return NextResponse.json(finalProduct, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
