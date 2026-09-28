import prisma from '@/lib/prisma';
import { store } from '@/app/api/v1/store';
import { getApiUrl } from '@/lib/apiConfig';
import { normalizeImageUrl, sortArticlesNewestFirst, formatArticleDate } from '@/lib/imageUtils';
import type { PublicProduct, PublicCategory, PublicArticle, GlobalSettings } from '@/lib/types';
import { defaultGlobalSettings } from '@/lib/types';

export type { PublicProduct, PublicCategory, PublicArticle, GlobalSettings };
export { defaultGlobalSettings };

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: db.json must NEVER be statically imported here.
// Turbopack bundles ALL static imports at build time → build crash + ghost data.
// Use dynamic require() at runtime only (server-side, never during build).
// ─────────────────────────────────────────────────────────────────────────────
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
    : (p.img ? [p.img] : ['/images/product/Cashew1.png']);
  const images = rawImages.map((img: any) => normalizeImageUrl(img, '/images/product/Cashew1.png')).filter(Boolean);
  const firstImg = images[0] || '/images/product/Cashew1.png';

  const categoryName = p.categories?.[0]?.name 
    || p.category 
    || (typeof p.categoryName === 'string' ? p.categoryName : 'Nông sản VINEX');

  return {
    id: p.id,
    name: p.name || 'Sản phẩm VINEX',
    slug: p.slug || `san-pham-${p.id}`,
    category: categoryName,
    status: p.status === 'ACTIVE' || p.status === 'Sẵn sàng cung ứng' ? 'Sẵn sàng cung ứng' : (p.status || 'Sẵn sàng cung ứng'),
    desc: p.shortDescription || p.desc || '',
    img: firstImg,
    images: images.length > 0 ? images : [firstImg],
    price: typeof p.price === 'number' ? p.price : 98000,
    promotionalPrice: p.promotionalPrice,
    description: p.description || '',
    attributes: Array.isArray(p.attributes) ? p.attributes : []
  };
}

export async function getPublicSettings(): Promise<GlobalSettings> {
  // 1. Try Prisma
  if (process.env.DATABASE_URL) {
    try {
      const setting = await prisma.setting.findUnique({
        where: { key: 'GLOBAL_SETTINGS' }
      });
      if (setting?.value) {
        const parsed = JSON.parse(setting.value);
        return { ...defaultGlobalSettings, ...parsed };
      }
    } catch (_) {
      // fallback
    }
  }

  // 2. Try in-memory store or local db.json (dev only)
  const localDb = getLocalDbData();
  const settingsList = store?.settings?.length ? store.settings : (localDb?.settings || []);
  const found = settingsList.find((s: any) => s && s.key === 'GLOBAL_SETTINGS');
  if (found && found.value) {
    const parsed = typeof found.value === 'string' ? JSON.parse(found.value) : found.value;
    return { ...defaultGlobalSettings, ...parsed };
  }

  // 3. Fallback to API if available
  try {
    const res = await fetch(getApiUrl('/settings'), { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (data ? [data] : []));
      const foundSetting = list.find((s: any) => s && s.key === 'GLOBAL_SETTINGS');
      if (foundSetting && foundSetting.value) {
        const parsed = typeof foundSetting.value === 'string' ? JSON.parse(foundSetting.value) : foundSetting.value;
        return { ...defaultGlobalSettings, ...parsed };
      }
    }
  } catch (_) {
    // Ignore fetch error
  }

  return defaultGlobalSettings;
}

export async function getPublicCategories(type?: 'Sản phẩm' | 'Bài viết'): Promise<PublicCategory[]> {
  let list: any[] = [];

  // 1. Try Prisma
  if (process.env.DATABASE_URL) {
    try {
      const cats = await prisma.category.findMany({
        where: type ? { type, status: 'ACTIVE' } : { status: 'ACTIVE' },
        orderBy: { id: 'asc' }
      });
      if (cats && cats.length > 0) {
        return cats.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          type: c.type,
          parentId: c.parentId,
          description: c.description || ''
        }));
      }
    } catch (_) {
      // fallback
    }
  }

  // 2. Try store or local db.json (dev only)
  const localDb = getLocalDbData();
  list = (store?.categories?.length ? store.categories : (localDb?.categories || []));

  if (list && list.length > 0) {
    if (type) {
      return list.filter((c: any) => c.type === type);
    }
    return list;
  }

  // 3. Fallback to API
  try {
    const res = await fetch(getApiUrl('/categories'), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const apiList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      if (apiList.length > 0) {
        return type ? apiList.filter((c: any) => c.type === type) : apiList;
      }
    }
  } catch (_) {
    // Ignore
  }

  return [];
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  // 1. Try Prisma
  if (process.env.DATABASE_URL) {
    try {
      const dbProds = await prisma.product.findMany({
        where: {
          OR: [
            { status: 'ACTIVE' },
            { status: 'Sẵn sàng cung ứng' }
          ]
        },
        include: { categories: true },
        orderBy: { id: 'asc' }
      });
      if (dbProds && dbProds.length > 0) {
        return dbProds.map(formatRawProduct);
      }
    } catch (_) {
      // continue to fallback
    }
  }

  // 2. Try store or local db.json (dev only)
  const localDb = getLocalDbData();
  const list = (store?.products?.length ? store.products : (localDb?.products || []));
  if (list && list.length > 0) {
    return list
      .filter((p: any) => p.status === 'ACTIVE' || !p.status || p.status === 'active' || p.status === 'Sẵn sàng cung ứng')
      .map(formatRawProduct);
  }

  // 3. Fallback to API
  try {
    const res = await fetch(getApiUrl('/products'), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const apiList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      if (apiList.length > 0) {
        return apiList
          .filter((p: any) => p.status === 'ACTIVE' || !p.status || p.status === 'active' || p.status === 'Sẵn sàng cung ứng')
          .map(formatRawProduct);
      }
    }
  } catch (_) {
    // Ignore
  }

  return [];
}

export async function getProductBySlug(slug: string): Promise<PublicProduct | undefined> {
  const normalizedSlug = decodeURIComponent(slug || '').toLowerCase().trim();
  if (!normalizedSlug) return undefined;

  // 1. Try direct Prisma query
  if (process.env.DATABASE_URL) {
    try {
      const dbProd = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: normalizedSlug },
            { slug: { equals: normalizedSlug, mode: 'insensitive' } },
            { productId: { equals: normalizedSlug, mode: 'insensitive' } }
          ]
        },
        include: { categories: true }
      });
      if (dbProd) {
        return formatRawProduct(dbProd);
      }
    } catch (_) {
      // fallback
    }
  }

  // 2. Retrieve all products from memory store or db.json
  const allProducts = await getPublicProducts();
  if (allProducts.length === 0) {
    return undefined;
  }

  // Match 1: Exact slug match
  let found = allProducts.find(p => {
    const pSlug = decodeURIComponent(p.slug || '').toLowerCase().trim();
    return pSlug === normalizedSlug;
  });

  // Match 2: Base slug match (ignoring weight suffixes like -100g, -150g, -250g, -500g)
  if (!found) {
    const cleanSlug = normalizedSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
    found = allProducts.find(p => {
      const pSlug = decodeURIComponent(p.slug || '').toLowerCase().trim();
      const cleanPSlug = pSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
      return cleanPSlug === cleanSlug || pSlug.startsWith(cleanSlug) || cleanSlug.startsWith(pSlug);
    });
  }

  // Match 3: ID or ProductId match
  if (!found) {
    found = allProducts.find(p => {
      return String(p.id) === normalizedSlug;
    });
  }

  // Match 4: Substring / keyword match
  if (!found) {
    const slugParts = normalizedSlug.split('-').filter(part => part.length > 2);
    found = allProducts.find(p => {
      const pSlug = decodeURIComponent(p.slug || '').toLowerCase().trim();
      const pName = (p.name || '').toLowerCase();
      return slugParts.some(part => pSlug.includes(part) || pName.includes(part));
    });
  }

  // Match 5: Fallback to first product in catalog (never 404)
  if (!found && allProducts.length > 0) {
    if (normalizedSlug.includes('dieu') || normalizedSlug.includes('cashew')) {
      found = allProducts.find(p => (p.name || '').toLowerCase().includes('điều')) || allProducts[0];
    } else if (normalizedSlug.includes('tra') || normalizedSlug.includes('tea')) {
      found = allProducts.find(p => (p.name || '').toLowerCase().includes('trà')) || allProducts[0];
    } else if (normalizedSlug.includes('ca-phe') || normalizedSlug.includes('coffee')) {
      found = allProducts.find(p => (p.name || '').toLowerCase().includes('cà phê')) || allProducts[0];
    } else {
      found = allProducts[0];
    }
  }

  return found;
}

export async function getPublicArticles(): Promise<PublicArticle[]> {
  // 1. Try Prisma
  if (process.env.DATABASE_URL) {
    try {
      const dbArticles = await prisma.article.findMany({
        where: {
          OR: [
            { status: 'PUBLISHED' },
            { status: 'published' }
          ]
        },
        orderBy: [
          { publishedAt: 'desc' },
          { id: 'desc' }
        ]
      });
      if (dbArticles && dbArticles.length > 0) {
        const mapped = dbArticles.map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          desc: a.summary || '',
          category: a.category || 'Tin tức VINEX',
          author: a.author || 'Truyền thông VINEX',
          date: formatArticleDate(a.publishedAt || a.createdAt),
          views: Number(a.views ?? 0) || 0,
          badge: a.isFeatured ? 'NỔI BẬT' : (a.category || 'TIN TỨC'),
          coverImg: normalizeImageUrl((a as any).thumbnail || (a as any).coverImg, '/images/banner/b_miss_world_2026.png'),
          content: a.content || '',
          tags: typeof a.tags === 'string' ? a.tags.split(',').map((t: string) => t.trim()) : (Array.isArray(a.tags) ? a.tags : []),
          isFeatured: Boolean(a.isFeatured),
          publishedAt: a.publishedAt || a.createdAt?.toISOString?.() || ''
        }));
        return sortArticlesNewestFirst(mapped);
      }
    } catch (_) {
      // fallback
    }
  }

  // 2. Try store or db.json (dev only)
  const localDb = getLocalDbData();
  const list = (store?.articles?.length ? store.articles : (localDb?.articles || []));
  if (list && list.length > 0) {
    const published = list.filter((a: any) => a.status === 'PUBLISHED' || !a.status || a.status === 'published');
    const mapped = published.map((a: any) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      desc: a.summary || a.desc || '',
      category: a.category || 'Tin tức VINEX',
      author: a.author || 'Truyền thông VINEX',
      date: formatArticleDate(a.publishedAt || a.createdAt || a.date),
      views: Number(a.views ?? 0) || 0,
      badge: a.isFeatured ? 'NỔI BẬT' : (a.category || 'TIN TỨC'),
      coverImg: normalizeImageUrl(a.thumbnail || a.coverImg, '/images/banner/b_miss_world_2026.png'),
      content: a.content || '',
      tags: Array.isArray(a.tags) ? a.tags : (typeof a.tags === 'string' ? a.tags.split(',').map((t: string) => t.trim()) : []),
      isFeatured: Boolean(a.isFeatured),
      publishedAt: a.publishedAt || a.createdAt || ''
    }));
    return sortArticlesNewestFirst(mapped);
  }

  return [];
}

export async function getArticleBySlug(slug: string): Promise<PublicArticle | undefined> {
  const normalizedSlug = decodeURIComponent(slug || '').toLowerCase().trim();
  if (!normalizedSlug) return undefined;

  // 1. Try Prisma
  if (process.env.DATABASE_URL) {
    try {
      const a = await prisma.article.findFirst({
        where: {
          OR: [
            { slug: normalizedSlug },
            { slug: { equals: normalizedSlug, mode: 'insensitive' } }
          ]
        }
      });
      if (a) {
        return {
          id: a.id,
          title: a.title,
          slug: a.slug,
          desc: a.summary || '',
          category: a.category || 'Tin tức VINEX',
          author: a.author || 'Truyền thông VINEX',
          date: formatArticleDate(a.publishedAt || a.createdAt),
          views: Number(a.views ?? 0) || 0,
          badge: a.isFeatured ? 'NỔI BẬT' : (a.category || 'TIN TỨC'),
          coverImg: normalizeImageUrl((a as any).thumbnail || (a as any).coverImg, '/images/banner/b_miss_world_2026.png'),
          content: a.content || '',
          tags: typeof a.tags === 'string' ? a.tags.split(',').map((t: string) => t.trim()) : [],
          isFeatured: Boolean(a.isFeatured),
          publishedAt: a.publishedAt || a.createdAt?.toISOString?.() || ''
        };
      }
    } catch (_) {
      // fallback
    }
  }

  // 2. Try store/db.json (dev only)
  const allArticles = await getPublicArticles();
  const found = allArticles.find(a => {
    const aSlug = decodeURIComponent(a.slug || '').toLowerCase().trim();
    return aSlug === normalizedSlug || aSlug.includes(normalizedSlug) || normalizedSlug.includes(aSlug);
  });

  return found || allArticles[0];
}
