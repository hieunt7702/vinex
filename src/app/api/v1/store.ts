// ─────────────────────────────────────────────────────────────────────────────
// VINEX In-Memory Store
//
// PURPOSE: Provides a lightweight fallback data layer for local development
// when DATABASE_URL is absent. In production (Railway / any env with
// DATABASE_URL set), PostgreSQL is the ONLY source of truth and this store
// is initialised with empty arrays so stale data never leaks.
//
// IMPORTANT: This file must NEVER use a static `import` for db.json.
// Turbopack/webpack would bundle the JSON file into the build artifact,
// causing: (a) invalid-JSON build errors, (b) ghost data on every deploy.
// All file I/O is done via dynamic require() which is server-runtime only.
// ─────────────────────────────────────────────────────────────────────────────

// DATABASE_URL presence = we have a real PostgreSQL → ignore local file store
const HAS_DB = Boolean(process.env.DATABASE_URL);

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── File helpers (server runtime only, never called at build time) ───────────

function readDbFile(): any {
  // Only runs on Node.js server process, never during Turbopack/webpack build
  if (typeof window !== 'undefined') return null;
  try {
    const fs   = require('fs')  as typeof import('fs');
    const path = require('path') as typeof import('path');
    const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (_) {
    // db.json missing or corrupt — that's fine, we default to empty arrays
  }
  return null;
}

export function savePersistedData() {
  // In production (HAS_DB), PostgreSQL owns the data. We only persist the
  // staff list so that admin accounts survive a server restart in local dev.
  if (typeof window !== 'undefined') return;
  try {
    if (!globalThis.__VINEX_STORE__) return;
    const fs   = require('fs')  as typeof import('fs');
    const path = require('path') as typeof import('path');
    const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

    const existing = readDbFile() ?? {};

    const dataToSave = HAS_DB
      // Production: only keep staff for local-auth fallback
      ? { ...existing, staff: globalThis.__VINEX_STORE__.staff || [] }
      // Local dev: persist everything
      : {
          products:   globalThis.__VINEX_STORE__.products   || [],
          categories: globalThis.__VINEX_STORE__.categories || [],
          articles:   globalThis.__VINEX_STORE__.articles   || [],
          settings:   globalThis.__VINEX_STORE__.settings   || [],
          leads:      globalThis.__VINEX_STORE__.leads      || [],
          customers:  globalThis.__VINEX_STORE__.customers  || [],
          staff:      globalThis.__VINEX_STORE__.staff      || [],
        };

    fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[store] Failed to write db.json:', e);
  }
}

// ─── Default admin account (always available as last-resort auth fallback) ───

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
      canManageStaff: true,
    },
    lastLogin: null,
    createdAt: '2026-01-01T08:00:00.000Z',
  },
];

// ─── Store initialisation ─────────────────────────────────────────────────────

if (!globalThis.__VINEX_STORE__) {
  // Read local file only in dev without a DB.
  // In production we start with empty arrays — data comes from PostgreSQL.
  const persisted = HAS_DB ? null : readDbFile();

  const staffFromFile: any[] =
    Array.isArray(persisted?.staff) && persisted.staff.length > 0
      ? persisted.staff
      : DEFAULT_STAFF;

  globalThis.__VINEX_STORE__ = {
    // Business entities: always empty when DB is present
    products:   HAS_DB ? [] : (Array.isArray(persisted?.products)   ? persisted.products   : []),
    leads:      HAS_DB ? [] : (Array.isArray(persisted?.leads)      ? persisted.leads      : []),
    articles:   HAS_DB ? [] : (Array.isArray(persisted?.articles)   ? persisted.articles   : []),
    customers:  HAS_DB ? [] : (Array.isArray(persisted?.customers)  ? persisted.customers  : []),
    categories: HAS_DB ? [] : (Array.isArray(persisted?.categories) ? persisted.categories : []),
    // Non-DB entities
    media:      [],
    seopages:   [],
    settings:   Array.isArray(persisted?.settings) ? persisted.settings : [],
    staff:      staffFromFile,
    stats: {
      totalProducts:     HAS_DB ? 0 : (persisted?.products?.length || 0),
      activeProducts:    HAS_DB ? 0 : (persisted?.products?.filter((p: any) => p.status === 'ACTIVE').length || 0),
      pendingProducts:   0,
      hiddenProducts:    0,
      totalCategories:   HAS_DB ? 0 : (persisted?.categories?.length || 0),
      totalArticles:     HAS_DB ? 0 : (persisted?.articles?.length || 0),
      publishedArticles: HAS_DB ? 0 : (persisted?.articles?.filter((a: any) => a.status === 'PUBLISHED').length || 0),
      draftArticles:     0,
      totalArticleViews: 0,
      totalLeads:        HAS_DB ? 0 : (persisted?.leads?.length || 0),
      pendingLeads:      0,
      processingLeads:   0,
      completedLeads:    0,
      leadsToday:        0,
      leadsThisWeek:     0,
      leadsThisMonth:    0,
      conversionRate:    '0%',
      indexedSeoPages:   0,
      totalCustomers:    HAS_DB ? 0 : (persisted?.customers?.length || 0),
    },
  };
}

// Ensure staff list is never completely empty (safety net for cold starts)
if (
  !globalThis.__VINEX_STORE__.staff ||
  globalThis.__VINEX_STORE__.staff.length === 0
) {
  const latestFile = readDbFile();
  globalThis.__VINEX_STORE__.staff =
    Array.isArray(latestFile?.staff) && latestFile.staff.length > 0
      ? latestFile.staff
      : DEFAULT_STAFF;
}

export const store = globalThis.__VINEX_STORE__;
