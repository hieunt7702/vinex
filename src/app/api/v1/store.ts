import dbJson from '@/data/db.json';

// ─── DATABASE_URL detection ──────────────────────────────────────────────────
// When DATABASE_URL is present (production/Railway), PostgreSQL is the source
// of truth for ALL business data. We NEVER pre-populate leads, products,
// articles, customers or categories from db.json to avoid "ghost data" that
// reappears on every new deployment.
//
// db.json is ONLY used as a fallback when DATABASE_URL is absent (local dev
// without Postgres).  Staff records are always loaded from db.json because they
// are used for in-memory auth even in production.
const HAS_DB = Boolean(process.env.DATABASE_URL);

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
  // When PostgreSQL is available, db.json is no longer the source of truth.
  // We only persist staff (for in-memory auth fallback) so that new staff
  // members created via the admin UI survive a server restart in dev mode.
  // In production, staff is also stored in PostgreSQL; this is just a safety net.
  if (typeof window === 'undefined') {
    try {
      if (!globalThis.__VINEX_STORE__) return;
      const fs = require('fs');
      const path = require('path');
      const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

      // Read current file so we preserve any fields we don't manage here
      let current: any = {};
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        current = JSON.parse(raw);
      } catch (_) {}

      const dataToSave = {
        ...current,
        // When no DB, persist everything. When DB is present, only save staff.
        ...(HAS_DB
          ? {}
          : {
              products: globalThis.__VINEX_STORE__.products || [],
              categories: globalThis.__VINEX_STORE__.categories || [],
              articles: globalThis.__VINEX_STORE__.articles || [],
              settings: globalThis.__VINEX_STORE__.settings || [],
              leads: globalThis.__VINEX_STORE__.leads || [],
              customers: globalThis.__VINEX_STORE__.customers || [],
            }),
        // Staff is always persisted (used for in-memory auth even with DB)
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
  // When DATABASE_URL is present, start with EMPTY arrays for all business
  // entities so that no stale db.json data ever "leaks" into the API response.
  // When DATABASE_URL is absent (local dev), load everything from db.json.
  globalThis.__VINEX_STORE__ = {
    products:   HAS_DB ? [] : (Array.isArray(persisted?.products)   ? persisted.products   : []),
    leads:      HAS_DB ? [] : (Array.isArray(persisted?.leads)      ? persisted.leads      : []),
    articles:   HAS_DB ? [] : (Array.isArray(persisted?.articles)   ? persisted.articles   : []),
    customers:  HAS_DB ? [] : (Array.isArray(persisted?.customers)  ? persisted.customers  : []),
    categories: HAS_DB ? [] : (Array.isArray(persisted?.categories) ? persisted.categories : []),
    media: [],
    seopages: [],
    settings: Array.isArray(persisted?.settings) ? persisted.settings : [],
    staff: Array.isArray(persisted?.staff) && persisted.staff.length > 0 ? persisted.staff : DEFAULT_STAFF,
    stats: {
      totalProducts: HAS_DB ? 0 : (persisted?.products?.length || 0),
      activeProducts: HAS_DB ? 0 : (persisted?.products?.filter((p: any) => p.status === 'ACTIVE').length || 0),
      pendingProducts: 0,
      hiddenProducts: 0,
      totalCategories: HAS_DB ? 0 : (persisted?.categories?.length || 0),
      totalArticles: HAS_DB ? 0 : (persisted?.articles?.length || 0),
      publishedArticles: HAS_DB ? 0 : (persisted?.articles?.filter((a: any) => a.status === 'PUBLISHED').length || 0),
      draftArticles: 0,
      totalArticleViews: 0,
      totalLeads: HAS_DB ? 0 : (persisted?.leads?.length || 0),
      pendingLeads: 0,
      processingLeads: 0,
      completedLeads: 0,
      leadsToday: 0,
      leadsThisWeek: 0,
      leadsThisMonth: 0,
      conversionRate: '0%',
      indexedSeoPages: 0,
      totalCustomers: HAS_DB ? 0 : (persisted?.customers?.length || 0)
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
