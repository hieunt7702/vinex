import dbJson from '@/data/db.json';

function loadPersistedData() {
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      // Fallback to imported json
    }
  }
  return dbJson;
}

export function savePersistedData() {
  if (typeof window === 'undefined') {
    try {
      if (!globalThis.__VINEX_STORE__) return;
      const fs = require('fs');
      const path = require('path');
      const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
      const dataToSave = {
        products: globalThis.__VINEX_STORE__.products || [],
        categories: globalThis.__VINEX_STORE__.categories || [],
        articles: globalThis.__VINEX_STORE__.articles || [],
        settings: globalThis.__VINEX_STORE__.settings || [],
        leads: globalThis.__VINEX_STORE__.leads || [],
        customers: globalThis.__VINEX_STORE__.customers || [],
        staff: globalThis.__VINEX_STORE__.staff || [],
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed to write db.json:', e);
    }
  }
}

declare global {
  var __VINEX_STORE__: {
    products: any[];
    leads: any[];
    articles: any[];
    customers: any[];
    categories: any[];
    media: any[];
    seopages: any[];
    settings: any[];
    staff: any[];
    stats: any;
  } | undefined;
}

const persisted = loadPersistedData() || dbJson;

const DEFAULT_STAFF = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    fullName: 'Quản trị viên Hệ thống',
    email: 'admin@vinex.vn',
    phone: '0901234567',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Ban Điều Hành',
    permissions: {
      products: true,
      articles: true,
      categories: true,
      media: true,
      leads: true,
      canDelete: true,
      canManageStaff: true
    },
    lastLogin: '2026-09-28T09:30:00.000Z',
    createdAt: '2026-01-01T08:00:00.000Z'
  }
];

if (!globalThis.__VINEX_STORE__) {
  globalThis.__VINEX_STORE__ = {
    products: Array.isArray(persisted?.products) ? persisted.products : [],
    leads: Array.isArray(persisted?.leads) ? persisted.leads : [],
    articles: Array.isArray(persisted?.articles) ? persisted.articles : [],
    customers: Array.isArray(persisted?.customers) ? persisted.customers : [],
    categories: Array.isArray(persisted?.categories) ? persisted.categories : [],
    media: [],
    seopages: [],
    settings: Array.isArray(persisted?.settings) ? persisted.settings : [],
    staff: Array.isArray(persisted?.staff) && persisted.staff.length > 0 ? persisted.staff : DEFAULT_STAFF,
    stats: {
      totalProducts: persisted?.products?.length || 0,
      activeProducts: persisted?.products?.filter((p: any) => p.status === 'ACTIVE').length || 0,
      pendingProducts: 0,
      hiddenProducts: 0,
      totalCategories: persisted?.categories?.length || 0,
      totalArticles: persisted?.articles?.length || 0,
      publishedArticles: persisted?.articles?.filter((a: any) => a.status === 'PUBLISHED').length || 0,
      draftArticles: 0,
      totalArticleViews: 0,
      totalLeads: persisted?.leads?.length || 0,
      pendingLeads: 0,
      processingLeads: 0,
      completedLeads: 0,
      leadsToday: 0,
      leadsThisWeek: 0,
      leadsThisMonth: 0,
      conversionRate: '0%',
      indexedSeoPages: 0,
      totalCustomers: persisted?.customers?.length || 0
    },
  };
}

if (!globalThis.__VINEX_STORE__.staff || globalThis.__VINEX_STORE__.staff.length <= 1) {
  const latestDb = loadPersistedData();
  if (latestDb?.staff && latestDb.staff.length > 0) {
    globalThis.__VINEX_STORE__.staff = latestDb.staff;
  } else {
    globalThis.__VINEX_STORE__.staff = Array.isArray(persisted?.staff) && persisted.staff.length > 0 ? persisted.staff : DEFAULT_STAFF;
  }
}

export const store = globalThis.__VINEX_STORE__;
