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
  isFeatured?: boolean;
  publishedAt?: string;
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
  hotline: '0966 967 966',
  zalo: '0966 967 966',
  facebook: 'https://facebook.com/vinexgroup.vn',
  address: 'Sảnh 2B Sun Grand City, 69B Thụy Khuê, Hà Nội & Khu 6 Bằng Doãn, Bằng Luân, Phú Thọ',
  globalMetaTitle: 'VINEX - Nông sản Việt Nam cao cấp vươn tầm quốc tế',
  globalMetaDesc: 'Hạt điều Bình Phước và nông sản chế biến sâu thượng hạng xuất khẩu toàn cầu.',
  googleAnalytics: 'G-XXXXXXX',
  facebookPixel: ''
};
