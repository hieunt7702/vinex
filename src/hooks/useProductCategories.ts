"use client";

import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '@/lib/apiConfig';

export interface ProductCategoryItem {
  id: number | string;
  name: string;
  slug: string;
  type?: string;
  parentId?: number | null;
  description?: string;
  attributes?: { name: string; values: string[] }[];
}

// 4 default main categories matching admin and user navigation
export const DEFAULT_PRODUCT_CATEGORIES: ProductCategoryItem[] = [
  { id: 1, name: 'Hạt điều tẩm vị', slug: 'hat-dieu-tam-vi' },
  { id: 2, name: 'Trà và cà phê', slug: 'tra-va-ca-phe' },
  { id: 3, name: 'Bánh kẹo', slug: 'banh-keo' },
  { id: 4, name: 'Nông sản sấy', slug: 'nong-san-say' },
];

let memoryCategoriesCache: ProductCategoryItem[] | null = null;

export function useProductCategories() {
  const [categories, setCategories] = useState<ProductCategoryItem[]>(() => {
    if (memoryCategoriesCache && memoryCategoriesCache.length > 0) {
      return memoryCategoriesCache;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('vinex_product_categories_cache');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            memoryCategoriesCache = parsed;
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached product categories', e);
      }
    }
    return DEFAULT_PRODUCT_CATEGORIES;
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(getApiUrl('/categories'), { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const list: any[] = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      
      // Filter root product categories (parentId is null, type === 'Sản phẩm')
      const prodCats = list.filter((c: any) => (!c.type || c.type === 'Sản phẩm') && !c.parentId);
      const filtered = prodCats.length > 0 
        ? prodCats 
        : list.filter((c: any) => !c.type || c.type === 'Sản phẩm');

      if (filtered.length > 0) {
        // Exclude B2B gift packaging from food products dropdown if separate
        const mainCats = filtered.filter((c: any) => 
          !c.slug?.includes('hop-qua') && !c.slug?.includes('bo-qua') && !c.slug?.includes('qua-tang') && c.id !== 50 && c.id !== 40
        );
        const finalCats = mainCats.length > 0 ? mainCats : filtered;
        const mapped: ProductCategoryItem[] = finalCats.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || `cat-${c.id}`,
          type: c.type || 'Sản phẩm',
          parentId: c.parentId,
          description: c.description,
          attributes: c.attributes || []
        }));

        setCategories(mapped);
        memoryCategoriesCache = mapped;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('vinex_product_categories_cache', JSON.stringify(mapped));
          } catch (e) {
            // Ignore storage quota errors
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    const handleUpdate = () => {
      fetchCategories();
    };

    window.addEventListener('vinex_categories_updated', handleUpdate);
    return () => {
      window.removeEventListener('vinex_categories_updated', handleUpdate);
    };
  }, [fetchCategories]);

  return { categories, isLoading, refresh: fetchCategories };
}
