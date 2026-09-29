/**
 * VINEX Server-Side Response Cache
 *
 * Lightweight in-process cache for expensive read-only DB queries.
 * Eliminates redundant Prisma round-trips on Railway for high-read, low-write
 * data like product lists, categories, and articles.
 *
 * TTLs chosen conservatively — admin mutations call `invalidateCache()` to
 * purge stale data immediately on write.
 *
 * DO NOT cache anything sensitive (leads, customer PII, settings with secrets).
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

export const CACHE_TTL = {
  CATEGORIES: 120_000,  // 2 min — categories change rarely
  PRODUCTS:    30_000,  // 30 s  — products may change more often
  ARTICLES:    30_000,  // 30 s
  SETTINGS:   300_000,  // 5 min — settings almost never change
} as const;

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/**
 * Invalidate one or more cache keys (call after mutations).
 * Pass no arguments to clear everything.
 */
export function invalidateCache(...keys: string[]): void {
  if (keys.length === 0) {
    cache.clear();
  } else {
    keys.forEach((k) => cache.delete(k));
  }
}

export const CACHE_KEYS = {
  CATEGORIES_ALL:      'categories:all',
  CATEGORIES_PRODUCTS: 'categories:products',
  CATEGORIES_ARTICLES: 'categories:articles',
  PRODUCTS_PUBLIC:     'products:public',
  ARTICLES_PUBLIC:     'articles:public',
  SETTINGS_GLOBAL:     'settings:global',
} as const;
