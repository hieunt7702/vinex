import { store } from '@/app/api/v1/store';
import { products as staticProducts } from '@/data/products';
import { articles as staticArticles } from '@/data/articles';

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

export function getPublicSettings(): GlobalSettings {
  if (store.settings && Array.isArray(store.settings)) {
    const found = store.settings.find((s: any) => s && s.key === 'GLOBAL_SETTINGS');
    if (found && found.value) {
      try {
        const parsed = typeof found.value === 'string' ? JSON.parse(found.value) : found.value;
        return { ...defaultGlobalSettings, ...parsed };
      } catch (e) {
        console.error('Failed to parse public settings', e);
      }
    }
  }
  return defaultGlobalSettings;
}

export function getPublicCategories(type?: 'Sản phẩm' | 'Bài viết'): PublicCategory[] {
  if (store.categories && store.categories.length > 0) {
    if (type) {
      return store.categories.filter((c: any) => c.type === type);
    }
    return store.categories;
  }
  return [];
}

export function getPublicProducts(): PublicProduct[] {
  if (store.products && store.products.length > 0) {
    return [...store.products]
      .filter((p: any) => p.status === 'ACTIVE')
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
        category: p.categories?.[0]?.name || p.category || 'Nông sản VINEX',
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
  return staticProducts.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    status: p.status,
    desc: p.desc,
    img: p.img,
    images: [p.img]
  }));
}

export function getProductBySlug(slug: string): PublicProduct | undefined {
  const all = getPublicProducts();
  const found = all.find(p => p.slug === slug);
  if (found) return found;

  const staticFound = staticProducts.find(p => p.slug === slug);
  if (staticFound) {
    return {
      id: staticFound.id,
      name: staticFound.name,
      slug: staticFound.slug,
      category: staticFound.category,
      status: staticFound.status,
      desc: staticFound.desc,
      img: staticFound.img
    };
  }
  return undefined;
}

export function getPublicArticles(): PublicArticle[] {
  if (store.articles && store.articles.length > 0) {
    return [...store.articles]
      .filter((a: any) => a.status === 'PUBLISHED')
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
  return staticArticles.map((a: any) => ({
    id: a.slug,
    title: a.title,
    slug: a.slug,
    desc: a.desc,
    category: a.category,
    author: a.author,
    date: a.date,
    views: a.views,
    badge: a.badge,
    bg: a.bg,
    coverImg: a.coverImg,
    content: a.content,
    tags: a.tags
  }));
}

export function getArticleBySlug(slug: string): PublicArticle | undefined {
  const all = getPublicArticles();
  const found = all.find(a => a.slug === slug || (slug === 'vinex-miss-world' && a.slug.startsWith('vinex-miss-world')));
  if (found) return found;

  const staticFound = staticArticles.find(a => a.slug === slug);
  if (staticFound) {
    return {
      id: staticFound.slug,
      title: staticFound.title,
      slug: staticFound.slug,
      desc: staticFound.desc,
      category: staticFound.category,
      author: staticFound.author,
      date: staticFound.date,
      views: staticFound.views,
      badge: staticFound.badge,
      bg: staticFound.bg,
      coverImg: staticFound.coverImg,
      content: staticFound.content,
      tags: staticFound.tags
    };
  }
  return undefined;
}

