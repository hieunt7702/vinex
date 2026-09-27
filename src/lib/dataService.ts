import { getApiUrl } from '@/lib/apiConfig';

export interface PublicProduct {
  id: number | string;
  name: string;
  slug: string;
  category: string;
  status: string;
  desc: string;
  img: string;
  images?: string[];
  price?: number;
  promotionalPrice?: number;
  description?: string;
  attributes?: { name: string; value: string }[];
}

export interface PublicCategory {
  id: number | string;
  name: string;
  slug: string;
  type: string;
  parentId?: number | null;
  description?: string;
}

export interface PublicArticle {
  id: number | string;
  title: string;
  slug: string;
  desc: string;
  category: string;
  author: string;
  date: string;
  views: number;
  badge: string;
  bg?: string;
  coverImg: string;
  content: string;
  tags?: string[];
}

export interface GlobalSettings {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  hotline: string;
  zalo: string;
  facebook: string;
  address?: string;
  globalMetaTitle: string;
  globalMetaDesc: string;
  googleAnalytics: string;
  facebookPixel: string;
}

export const defaultGlobalSettings: GlobalSettings = {
  siteName: 'VINEX - Tinh Hoa Nông Sản Việt',
  siteUrl: 'https://vinexgroup.vn',
  contactEmail: 'info@vinexgroup.vn',
  hotline: '0988 888 888',
  zalo: '0988 888 888',
  facebook: 'https://facebook.com/vinexgroup.vn',
  address: 'Sảnh 2B Sun Grand City, 69B Thụy Khuê, Hà Nội & Khu 6 Bằng Doãn, Bằng Luân, Phú Thọ',
  globalMetaTitle: 'VINEX - Nông sản Việt Nam cao cấp vươn tầm quốc tế',
  globalMetaDesc: 'Hạt điều Bình Phước và nông sản chế biến sâu thượng hạng xuất khẩu toàn cầu.',
  googleAnalytics: 'G-XXXXXXX',
  facebookPixel: ''
};

export async function getPublicSettings(): Promise<GlobalSettings> {
  try {
    const res = await fetch(getApiUrl('/settings'), { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (data ? [data] : []));
      const found = list.find((s: any) => s && s.key === 'GLOBAL_SETTINGS');
      if (found && found.value) {
        const parsed = typeof found.value === 'string' ? JSON.parse(found.value) : found.value;
        return { ...defaultGlobalSettings, ...parsed };
      }
    }
  } catch (e) {
    console.warn('API getPublicSettings failed:', e);
  }

  return defaultGlobalSettings;
}

export async function getPublicCategories(type?: 'Sản phẩm' | 'Bài viết'): Promise<PublicCategory[]> {
  try {
    const res = await fetch(getApiUrl('/categories'), { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      if (list.length > 0) {
        if (type) {
          return list.filter((c: any) => c.type === type);
        }
        return list;
      }
    }
  } catch (e) {
    console.warn('API getPublicCategories failed:', e);
  }

  return [];
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  try {
    const res = await fetch(getApiUrl('/products'), { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      if (list.length > 0) {
        return list
          .filter((p: any) => p.status === 'ACTIVE' || !p.status || p.status === 'active' || p.status === 'Sẵn sàng cung ứng')
          .sort((a: any, b: any) => {
            if (a.createdAt && b.createdAt) {
              const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              if (diff !== 0) return diff;
            }
            return (Number(b.id) || 0) - (Number(a.id) || 0);
          })
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.categories?.[0]?.name || p.category || (typeof p.categoryName === 'string' ? p.categoryName : 'Nông sản VINEX'),
            status: 'Sẵn sàng cung ứng',
            desc: p.shortDescription || p.desc || '',
            img: (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.img || '/images/placeholder.jpg')),
            images: (Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.img ? [p.img] : [])),
            price: p.price,
            promotionalPrice: p.promotionalPrice,
            description: p.description,
            attributes: p.attributes || []
          }));
      }
    }
  } catch (e) {
    console.warn('API getPublicProducts failed:', e);
  }

  return [];
}

export async function getProductBySlug(slug: string): Promise<PublicProduct | undefined> {
  const normalizedSlug = decodeURIComponent(slug || '').toLowerCase().trim();

  try {
    const res = await fetch(getApiUrl('/products'), { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      
      // 1. Match exact slug
      let found = list.find((p: any) => {
        const pSlug = decodeURIComponent(p.slug || '').toLowerCase().trim();
        return pSlug === normalizedSlug;
      });

      // 2. Match base slug (e.g. hat-dieu-tam-vi-phomai-hu-100g matches hat-dieu-tam-vi-phomai-hu-150g)
      if (!found) {
        const cleanSlug = normalizedSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
        found = list.find((p: any) => {
          const pSlug = decodeURIComponent(p.slug || '').toLowerCase().trim();
          const cleanPSlug = pSlug.replace(/-\d+g$/i, '').replace(/-\d+$/i, '');
          return cleanPSlug === cleanSlug || pSlug.startsWith(cleanSlug) || String(p.id) === normalizedSlug;
        });
      }

      if (found) {
        return {
          id: found.id,
          name: found.name,
          slug: found.slug,
          category: found.categories?.[0]?.name || found.category || (typeof found.categoryName === 'string' ? found.categoryName : 'Nông sản VINEX'),
          status: 'Sẵn sàng cung ứng',
          desc: found.shortDescription || found.desc || '',
          img: (Array.isArray(found.images) && found.images.length > 0 ? found.images[0] : (found.img || '/images/placeholder.jpg')),
          images: (Array.isArray(found.images) && found.images.length > 0 ? found.images : (found.img ? [found.img] : [])),
          price: found.price,
          promotionalPrice: found.promotionalPrice,
          description: found.description,
          attributes: found.attributes || []
        };
      }
    }
  } catch (e) {
    console.error('API getProductBySlug failed:', e);
  }

  return undefined;
}

export async function getPublicArticles(): Promise<PublicArticle[]> {
  try {
    const res = await fetch(getApiUrl('/articles'), { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      if (list.length > 0) {
        return list
          .filter((a: any) => a.status === 'PUBLISHED' || !a.status || a.status === 'published')
          .sort((a: any, b: any) => {
            const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
            const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
            if (timeA && timeB && timeA !== timeB) return timeB - timeA;
            return (Number(b.id) || 0) - (Number(a.id) || 0);
          })
          .map((a: any) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            desc: a.summary || a.desc || '',
            category: a.category || 'Tin tức VINEX',
            author: a.author || 'Truyền thông VINEX',
            date: a.publishedAt ? (() => {
              const d = new Date(a.publishedAt);
              return isNaN(d.getTime()) ? (a.date || 'Gần đây') : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            })() : (a.date || 'Gần đây'),
            views: a.views || 0,
            badge: a.category || 'NỔI BẬT',
            coverImg: (typeof a.thumbnail === 'string' && a.thumbnail) ? a.thumbnail : (a.coverImg || '/images/placeholder.jpg'),
            content: a.content || '',
            tags: Array.isArray(a.tags) ? a.tags : (typeof a.tags === 'string' && a.tags ? a.tags.split(',').map((t: string) => t.trim()) : [])
          }));
      }
    }
  } catch (e) {
    console.warn('API getPublicArticles failed:', e);
  }

  return [];
}

export async function getArticleBySlug(slug: string): Promise<PublicArticle | undefined> {
  const normalizedSlug = decodeURIComponent(slug || '').toLowerCase().trim();

  try {
    const res = await fetch(getApiUrl('/articles'), { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      const found = list.find((a: any) => {
        const aSlug = decodeURIComponent(a.slug || '').toLowerCase().trim();
        return aSlug === normalizedSlug || (normalizedSlug === 'vinex-miss-world' && aSlug.startsWith('vinex-miss-world'));
      });
      if (found) {
        return {
          id: found.id,
          title: found.title,
          slug: found.slug,
          desc: found.summary || found.desc || '',
          category: found.category || 'Tin tức VINEX',
          author: found.author || 'Truyền thông VINEX',
          date: found.publishedAt ? (() => {
            const d = new Date(found.publishedAt);
            return isNaN(d.getTime()) ? (found.date || 'Gần đây') : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
          })() : (found.date || 'Gần đây'),
          views: found.views || 0,
          badge: found.category || 'NỔI BẬT',
          coverImg: (typeof found.thumbnail === 'string' && found.thumbnail) ? found.thumbnail : (found.coverImg || '/images/placeholder.jpg'),
          content: found.content || '',
          tags: Array.isArray(found.tags) ? found.tags : (typeof found.tags === 'string' && found.tags ? found.tags.split(',').map((t: string) => t.trim()) : [])
        };
      }
    }
  } catch (e) {
    console.warn('API getArticleBySlug failed:', e);
  }

  return undefined;
}
