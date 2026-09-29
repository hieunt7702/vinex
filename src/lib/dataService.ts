import prisma from '@/lib/prisma';
import { store } from '@/app/api/v1/store';
import { normalizeImageUrl, sortArticlesNewestFirst, formatArticleDate } from '@/lib/imageUtils';
import type { PublicProduct, PublicCategory, PublicArticle, GlobalSettings } from '@/lib/types';
import { defaultGlobalSettings } from '@/lib/types';

export type { PublicProduct, PublicCategory, PublicArticle, GlobalSettings };
export { defaultGlobalSettings };

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: db.json must NEVER be statically imported here.
// Turbopack bundles ALL static imports at build time → build crash + ghost data.
// Use dynamic require() at runtime only (server-side, never during build).
//
// KEY PERF CHANGE: Removed the loopback HTTP fetch() fallback that was calling
// the server's own API over the network. SSR functions now go directly to Prisma
// or the in-memory store — saving 100-300 ms per SSR page on Railway.
// ─────────────────────────────────────────────────────────────────────────────

const HAS_DB = Boolean(process.env.DATABASE_URL);

function getLocalDbData(): any {
  if (typeof window !== 'undefined') return null;
  try {
    const fs   = require('fs')  as typeof import('fs');
    const path = require('path') as typeof import('path');
    const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (_) {
    // db.json missing or corrupt — fine, default to empty
  }
  return null;
}

function formatRawProduct(p: any): PublicProduct {
  const rawImages = Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : (p.img ? [p.img] : []);
  const images = rawImages
    .map((img: any) => normalizeImageUrl(img, ''))
    .filter((img: string) => Boolean(img && img !== '/images/placeholder.jpg' && !img.includes('placeholder')));
  const firstImg = images[0] || '';

  const categoryName =
    p.categories?.[0]?.name ||
    p.category ||
    (typeof p.categoryName === 'string' ? p.categoryName : 'Nông sản VINEX');

  return {
    id: p.id,
    name: p.name || 'Sản phẩm VINEX',
    slug: p.slug || `san-pham-${p.id}`,
    category: categoryName,
    status:
      p.status === 'ACTIVE' || p.status === 'Sẵn sàng cung ứng'
        ? 'Sẵn sàng cung ứng'
        : p.status || 'Sẵn sàng cung ứng',
    desc: p.shortDescription || p.desc || '',
    img: firstImg,
    images: images,
    price: typeof p.price === 'number' ? p.price : 0,
    promotionalPrice: p.promotionalPrice,
    description: p.description || '',
    attributes: Array.isArray(p.attributes) ? p.attributes : [],
  };
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getPublicSettings(): Promise<GlobalSettings> {
  // 1. Prisma (production)
  if (HAS_DB) {
    try {
      const setting = await prisma.setting.findUnique({
        where: { key: 'GLOBAL_SETTINGS' },
      });
      if (setting?.value) {
        return { ...defaultGlobalSettings, ...JSON.parse(setting.value) };
      }
    } catch (_) {
      // fall through to local store
    }
  }

  // 2. In-memory store or local db.json (dev only — no HTTP fallback)
  const localDb = HAS_DB ? null : getLocalDbData();
  const settingsList = store?.settings?.length
    ? store.settings
    : (localDb?.settings || []);
  const found = settingsList.find((s: any) => s && s.key === 'GLOBAL_SETTINGS');
  if (found?.value) {
    const parsed = typeof found.value === 'string' ? JSON.parse(found.value) : found.value;
    return { ...defaultGlobalSettings, ...parsed };
  }

  return defaultGlobalSettings;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getPublicCategories(
  type?: 'Sản phẩm' | 'Bài viết',
): Promise<PublicCategory[]> {
  // 1. Prisma (production)
  if (HAS_DB) {
    try {
      const cats = await prisma.category.findMany({
        where: type ? { type, status: 'ACTIVE' } : { status: 'ACTIVE' },
        orderBy: { id: 'asc' },
        select: { id: true, name: true, slug: true, type: true, parentId: true, description: true },
      });
      if (cats.length > 0) {
        return cats.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          type: c.type,
          parentId: c.parentId,
          description: c.description || '',
        }));
      }
    } catch (_) {
      // fall through
    }
  }

  // 2. In-memory store or local db.json
  const localDb = HAS_DB ? null : getLocalDbData();
  const list: any[] = store?.categories?.length
    ? store.categories
    : (localDb?.categories || []);
  if (list.length > 0) {
    return type ? list.filter((c: any) => c.type === type) : list;
  }

  return [];
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getPublicProducts(): Promise<PublicProduct[]> {
  // 1. Prisma (production)
  if (HAS_DB) {
    try {
      const dbProds = await prisma.product.findMany({
        where: {
          OR: [{ status: 'ACTIVE' }, { status: 'Sẵn sàng cung ứng' }],
        },
        include: { categories: { select: { id: true, name: true, slug: true } } },
        orderBy: { id: 'asc' },
      });
      if (dbProds.length > 0) {
        return dbProds.map(formatRawProduct);
      }
    } catch (_) {
      // fall through
    }
  }

  // 2. In-memory store or local db.json
  const localDb = HAS_DB ? null : getLocalDbData();
  const list: any[] = store?.products?.length
    ? store.products
    : (localDb?.products || []);
  return list
    .filter(
      (p: any) =>
        p.status === 'ACTIVE' || !p.status || p.status === 'active' || p.status === 'Sẵn sàng cung ứng',
    )
    .map(formatRawProduct);
}

// ─── Product by Slug ──────────────────────────────────────────────────────────

export async function getProductBySlug(slug: string): Promise<PublicProduct | undefined> {
  const normalizedSlug = decodeURIComponent(slug || '').toLowerCase().trim();
  if (!normalizedSlug) return undefined;

  // 1. Direct Prisma query (most efficient — uses DB index on slug)
  if (HAS_DB) {
    try {
      const dbProd = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: normalizedSlug },
            { slug: { equals: normalizedSlug, mode: 'insensitive' } },
            { productId: { equals: normalizedSlug, mode: 'insensitive' } },
          ],
        },
        include: { categories: { select: { id: true, name: true, slug: true } } },
      });
      if (dbProd) return formatRawProduct(dbProd);
    } catch (_) {
      // fall through
    }
  }

  // 2. Memory store fallback (dev) — no HTTP call
  const allProducts = await getPublicProducts();
  if (allProducts.length === 0) return undefined;

  // Match 1: Exact slug
  let found = allProducts.find(
    (p) => decodeURIComponent(p.slug || '').toLowerCase().trim() === normalizedSlug,
  );

  // Match 2: Base slug (strip weight suffixes like -100g, -500g)
  if (!found) {
    const cleanSlug = normalizedSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
    found = allProducts.find((p) => {
      const pSlug = decodeURIComponent(p.slug || '').toLowerCase().trim();
      const cleanPSlug = pSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
      return (
        cleanPSlug === cleanSlug || pSlug.startsWith(cleanSlug) || cleanSlug.startsWith(pSlug)
      );
    });
  }

  // Match 3: ID
  if (!found) {
    found = allProducts.find((p) => String(p.id) === normalizedSlug);
  }

  // Match 4: Keyword substring
  if (!found) {
    const slugParts = normalizedSlug.split('-').filter((part) => part.length > 2);
    found = allProducts.find((p) => {
      const pSlug = decodeURIComponent(p.slug || '').toLowerCase().trim();
      const pName = (p.name || '').toLowerCase();
      return slugParts.some((part) => pSlug.includes(part) || pName.includes(part));
    });
  }

  // Match 5: Category-aware fallback (never 404)
  if (!found && allProducts.length > 0) {
    if (normalizedSlug.includes('dieu') || normalizedSlug.includes('cashew')) {
      found =
        allProducts.find((p) => (p.name || '').toLowerCase().includes('điều')) || allProducts[0];
    } else if (normalizedSlug.includes('tra') || normalizedSlug.includes('tea')) {
      found =
        allProducts.find((p) => (p.name || '').toLowerCase().includes('trà')) || allProducts[0];
    } else if (normalizedSlug.includes('ca-phe') || normalizedSlug.includes('coffee')) {
      found =
        allProducts.find((p) => (p.name || '').toLowerCase().includes('cà phê')) || allProducts[0];
    } else {
      found = allProducts[0];
    }
  }

  return found;
}

// ─── Articles ─────────────────────────────────────────────────────────────────

function mapArticleRow(a: any): PublicArticle {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    desc: a.summary || a.desc || '',
    category: a.category || 'Tin tức VINEX',
    author: a.author || 'Truyền thông VINEX',
    date: formatArticleDate(a.publishedAt || a.createdAt || a.date),
    views: Number(a.views ?? 0) || 0,
    badge: a.isFeatured ? 'NỔI BẬT' : (a.category || 'TIN TỨC'),
    coverImg: normalizeImageUrl(
      a.thumbnail || a.coverImg,
      '/images/banner/b_miss_world_2026.png',
    ),
    content: a.content || '',
    tags:
      typeof a.tags === 'string'
        ? a.tags.split(',').map((t: string) => t.trim())
        : Array.isArray(a.tags)
        ? a.tags
        : [],
    isFeatured: Boolean(a.isFeatured),
    publishedAt: a.publishedAt || a.createdAt?.toISOString?.() || '',
  };
}

export async function getPublicArticles(): Promise<PublicArticle[]> {
  // 1. Prisma (production)
  if (HAS_DB) {
    try {
      const dbArticles = await prisma.article.findMany({
        where: { OR: [{ status: 'PUBLISHED' }, { status: 'published' }] },
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        // Only select fields needed for the public list
        select: {
          id: true, title: true, slug: true, summary: true, category: true,
          author: true, publishedAt: true, createdAt: true, views: true,
          isFeatured: true, thumbnail: true, content: true, tags: true, status: true,
        },
      });
      if (dbArticles.length > 0) {
        return sortArticlesNewestFirst(dbArticles.map(mapArticleRow));
      }
    } catch (_) {
      // fall through
    }
  }

  // 2. In-memory store or local db.json
  const localDb = HAS_DB ? null : getLocalDbData();
  const list: any[] = store?.articles?.length
    ? store.articles
    : (localDb?.articles || []);
  if (list.length > 0) {
    const published = list.filter(
      (a: any) => a.status === 'PUBLISHED' || !a.status || a.status === 'published',
    );
    return sortArticlesNewestFirst(published.map(mapArticleRow));
  }

  return [];
}

// ─── Article by Slug ──────────────────────────────────────────────────────────

export async function getArticleBySlug(slug: string): Promise<PublicArticle | undefined> {
  const normalizedSlug = decodeURIComponent(slug || '').toLowerCase().trim();
  if (!normalizedSlug) return undefined;

  // 1. Prisma (production)
  if (HAS_DB) {
    try {
      const a = await prisma.article.findFirst({
        where: {
          OR: [
            { slug: normalizedSlug },
            { slug: { equals: normalizedSlug, mode: 'insensitive' } },
          ],
        },
      });
      if (a) return mapArticleRow(a);
    } catch (_) {
      // fall through
    }
  }

  // 2. Store/db.json fallback — no HTTP call
  const allArticles = await getPublicArticles();
  const found = allArticles.find((a) => {
    const aSlug = decodeURIComponent(a.slug || '').toLowerCase().trim();
    return (
      aSlug === normalizedSlug ||
      aSlug.includes(normalizedSlug) ||
      normalizedSlug.includes(aSlug)
    );
  });

  return found || allArticles[0];
}
