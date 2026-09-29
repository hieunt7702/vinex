"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ProductCategoryItem {
  id: number | string;
  name: string;
  slug: string;
  type?: string;
  parentId?: number | null;
  description?: string;
  attributes?: { name: string; values: string[] }[];
}

// 4 default main categories — shown immediately while fetching
export const DEFAULT_PRODUCT_CATEGORIES: ProductCategoryItem[] = [
  { id: 1, name: 'Hạt điều tẩm vị', slug: 'hat-dieu-tam-vi' },
  { id: 2, name: 'Trà và cà phê', slug: 'tra-va-ca-phe' },
  { id: 3, name: 'Bánh kẹo', slug: 'banh-keo' },
  { id: 4, name: 'Nông sản sấy', slug: 'nong-san-say' },
];

// ─── Module-level in-memory dedup ────────────────────────────────────────────
// Shared across all hook instances — only ONE network request in flight at once.
let memoryCategoriesCache: ProductCategoryItem[] | null = null;
let pendingFetch: Promise<ProductCategoryItem[]> | null = null;
const CACHE_MAX_AGE_MS = 60_000; // 1 min client-side cache
let lastFetchedAt = 0;
// ─────────────────────────────────────────────────────────────────────────────

function getLocalStorage(): ProductCategoryItem[] | null {
  try {
    const stored = localStorage.getItem('vinex_product_categories_cache');
    if (!stored) return null;
    const { data, ts } = JSON.parse(stored);
    if (Date.now() - ts < CACHE_MAX_AGE_MS && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveLocalStorage(data: ProductCategoryItem[]) {
  try {
    localStorage.setItem(
      'vinex_product_categories_cache',
      JSON.stringify({ data, ts: Date.now() }),
    );
  } catch {
    // ignore quota errors
  }
}

async function fetchCategoriesFromApi(): Promise<ProductCategoryItem[]> {
  // Use relative /api/v1 — same origin, no DNS/TLS overhead
  const res = await fetch('/api/v1/categories', {
    // 30s browser-level cache — avoids redundant XHR on navigation
    cache: 'default',
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`categories ${res.status}`);
  const data = await res.json();
  const list: any[] = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

  const prodCats = list.filter((c: any) => (!c.type || c.type === 'Sản phẩm') && !c.parentId);
  const filtered = prodCats.length > 0
    ? prodCats
    : list.filter((c: any) => !c.type || c.type === 'Sản phẩm');

  const mainCats = filtered.filter(
    (c: any) =>
      !c.slug?.includes('hop-qua') &&
      !c.slug?.includes('bo-qua') &&
      !c.slug?.includes('qua-tang') &&
      c.id !== 50 &&
      c.id !== 40,
  );
  const finalCats = mainCats.length > 0 ? mainCats : filtered;

  return finalCats.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug || `cat-${c.id}`,
    type: c.type || 'Sản phẩm',
    parentId: c.parentId,
    description: c.description,
    attributes: c.attributes || [],
  }));
}

export function useProductCategories() {
  const [categories, setCategories] = useState<ProductCategoryItem[]>(() => {
    // Priority: in-memory cache → localStorage → defaults
    if (memoryCategoriesCache && memoryCategoriesCache.length > 0) {
      return memoryCategoriesCache;
    }
    if (typeof window !== 'undefined') {
      const ls = getLocalStorage();
      if (ls) {
        memoryCategoriesCache = ls;
        return ls;
      }
    }
    return DEFAULT_PRODUCT_CATEGORIES;
  });

  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  const fetchCategories = useCallback(async (force = false) => {
    // Skip if cache is fresh and not forced
    if (!force && Date.now() - lastFetchedAt < CACHE_MAX_AGE_MS && memoryCategoriesCache) {
      return;
    }

    // Dedup: if a request is already in-flight, await the same promise
    if (!pendingFetch) {
      pendingFetch = fetchCategoriesFromApi().finally(() => {
        pendingFetch = null;
      });
    }

    setIsLoading(true);
    try {
      const result = await pendingFetch!;
      lastFetchedAt = Date.now();
      memoryCategoriesCache = result;
      saveLocalStorage(result);
      if (mountedRef.current) {
        setCategories(result);
      }
    } catch (err) {
      console.warn('Could not fetch categories:', err);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchCategories();

    const handleUpdate = () => fetchCategories(true);
    window.addEventListener('vinex_categories_updated', handleUpdate);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('vinex_categories_updated', handleUpdate);
    };
  }, [fetchCategories]);

  return { categories, isLoading, refresh: () => fetchCategories(true) };
}
