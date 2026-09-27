import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    // 1. Try Prisma DB first
    if (process.env.DATABASE_URL) {
      try {
        if (slug) {
          const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
          const cleanSlug = decodedSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
          const dbProd = await prisma.product.findFirst({
            where: {
              OR: [
                { slug: decodedSlug },
                { slug: { equals: decodedSlug, mode: 'insensitive' } },
                { slug: { startsWith: cleanSlug, mode: 'insensitive' } }
              ]
            },
            include: { categories: true }
          });
          if (dbProd) {
            return NextResponse.json({
              ...dbProd,
              categoryIds: dbProd.categories.map(c => c.id)
            });
          }
        } else if (id) {
          const numId = Number(id);
          const dbProd = await prisma.product.findFirst({
            where: {
              OR: [
                ...(isNaN(numId) ? [] : [{ id: numId }]),
                { productId: id }
              ]
            },
            include: { categories: true }
          });
          if (dbProd) {
            return NextResponse.json({
              ...dbProd,
              categoryIds: dbProd.categories.map(c => c.id)
            });
          }
        } else {
          const dbProds = await prisma.product.findMany({
            include: { categories: true },
            orderBy: { id: 'asc' }
          });
          if (dbProds && dbProds.length > 0) {
            return NextResponse.json(dbProds.map(p => ({
              ...p,
              categoryIds: p.categories.map(c => c.id)
            })));
          }
        }
      } catch (dbErr) {
        // Fallback to store
      }
    }

    // 2. Fallback to in-memory store & db.json
    if (slug) {
      const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
      const cleanSlug = decodedSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
      let product = store.products.find(p => 
        p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedSlug
      );
      if (!product) {
        product = store.products.find(p => {
          const pSlug = decodeURIComponent(p.slug || '').toLowerCase().trim();
          const cleanPSlug = pSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
          return cleanPSlug === cleanSlug || pSlug.startsWith(cleanSlug);
        });
      }
      if (product) {
        return NextResponse.json(product);
      }
      return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    if (id) {
      const decodedId = decodeURIComponent(id).toLowerCase().trim();
      const product = store.products.find(p => 
        String(p.id) === decodedId || 
        (p.productId && p.productId.toLowerCase().trim() === decodedId)
      );
      if (product) {
        return NextResponse.json(product);
      }
      return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    const sorted = [...store.products].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (diff !== 0) return diff;
      }
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
    return NextResponse.json(sorted);
  } catch (err) {
    return NextResponse.json([...store.products]);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newId = store.products.length > 0 ? Math.max(...store.products.map(p => Number(p.id) || 0)) + 1 : 1;
    const newProduct = {
      ...data,
      id: newId,
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    // Try Prisma DB save
    if (process.env.DATABASE_URL) {
      try {
        await prisma.product.create({
          data: {
            id: newId,
            productId: data.productId || `VNX-${newId}`,
            sku: data.sku || `VNX-SKU-${newId}`,
            name: data.name,
            slug: data.slug || `san-pham-${newId}`,
            segment: data.segment || 'cao-cap',
            price: Number(data.price) || 0,
            promotionalPrice: Number(data.promotionalPrice) || 0,
            stockQuantity: Number(data.stockQuantity) || 100,
            stockStatus: data.stockStatus || 'IN_STOCK',
            lowStockThreshold: Number(data.lowStockThreshold) || 10,
            shortDescription: data.shortDescription || '',
            description: data.description || '',
            status: data.status || 'ACTIVE',
            images: data.images || [],
            attributes: data.attributes || [],
            categories: Array.isArray(data.categoryIds) && data.categoryIds.length > 0
              ? { connect: data.categoryIds.map((cid: number) => ({ id: Number(cid) })) }
              : undefined
          }
        });
      } catch (dbErr) {
        console.warn('Prisma DB product create error (fallback to store):', dbErr);
      }
    }

    store.products.push(newProduct);
    savePersistedData();
    
    // update stats
    if (store.stats) {
      store.stats.totalProducts++;
      store.stats.activeProducts++;
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
