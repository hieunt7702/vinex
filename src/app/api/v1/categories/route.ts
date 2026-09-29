import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';
import { getUniqueCategorySlug } from '@/lib/serverSlugHelper';
import { handleCorsPreflight } from '@/lib/cors';
import {
  getCached, setCached, invalidateCache,
  CACHE_KEYS, CACHE_TTL,
} from '@/lib/serverCache';

// ─────────────────────────────────────────────────────────────────────────────
// Categories route — optimised for Railway
//
// KEY PERF: In-process server cache (2 min TTL) eliminates redundant DB
// round-trips. Admin mutations call invalidateCache() to purge stale data.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Short-lived CDN/browser cache — allows edge caching without staleness risk
const PUBLIC_CACHE_HEADER  = 'public, max-age=30, stale-while-revalidate=60';
const PRIVATE_CACHE_HEADER = 'no-store';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET() {
  // Serve from in-process cache if still fresh
  const cached = getCached<any[]>(CACHE_KEYS.CATEGORIES_ALL);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'Cache-Control': PUBLIC_CACHE_HEADER, 'X-Cache': 'HIT' },
    });
  }

  if (process.env.DATABASE_URL) {
    try {
      const dbCats = await prisma.category.findMany({
        orderBy: { id: 'asc' },
        select: {
          id: true, name: true, slug: true, type: true,
          parentId: true, description: true, status: true,
          isPinned: true, attributes: true,
        },
      });
      setCached(CACHE_KEYS.CATEGORIES_ALL, dbCats, CACHE_TTL.CATEGORIES);
      return NextResponse.json(dbCats, {
        headers: { 'Cache-Control': PUBLIC_CACHE_HEADER, 'X-Cache': 'MISS' },
      });
    } catch {
      // fall through to store
    }
  }

  return NextResponse.json(store.categories, {
    headers: { 'Cache-Control': PRIVATE_CACHE_HEADER },
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let createdCategory: any = null;

    if (process.env.DATABASE_URL) {
      try {
        const genSlug = await getUniqueCategorySlug(data.slug || data.name || 'danh-muc');
        createdCategory = await prisma.category.create({
          data: {
            name: data.name,
            slug: genSlug,
            type: data.type || 'Sản phẩm',
            parentId: data.parentId ? Number(data.parentId) : null,
            description: data.description || '',
            status: data.status || 'ACTIVE',
            attributes: data.attributes
              ? typeof data.attributes === 'string'
                ? JSON.parse(data.attributes)
                : data.attributes
              : undefined,
          },
        });
        // Invalidate category cache on write
        invalidateCache(CACHE_KEYS.CATEGORIES_ALL, CACHE_KEYS.CATEGORIES_PRODUCTS, CACHE_KEYS.CATEGORIES_ARTICLES);
      } catch (dbErr) {
        console.error('Prisma category create error (fallback to store):', dbErr);
      }
    }

    const finalCategory = createdCategory || {
      ...data,
      id:
        store.categories.length > 0
          ? Math.max(...store.categories.map((c) => Number(c.id) || 0)) + 1
          : 1,
      status: data.status || 'ACTIVE',
    };

    store.categories.push(finalCategory);
    savePersistedData();

    return NextResponse.json(finalCategory, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
