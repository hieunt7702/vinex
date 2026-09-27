import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

function loadPersistedData() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load db.json:', e);
  }
  return null;
}

export function savePersistedData() {
  try {
    if (!globalThis.__VINEX_STORE__) return;
    const dataToSave = {
      products: globalThis.__VINEX_STORE__.products || [],
      categories: globalThis.__VINEX_STORE__.categories || [],
      articles: globalThis.__VINEX_STORE__.articles || [],
      settings: globalThis.__VINEX_STORE__.settings || [],
      leads: globalThis.__VINEX_STORE__.leads || [],
      customers: globalThis.__VINEX_STORE__.customers || [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed to write db.json:', e);
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
    stats: any;
  } | undefined;
}

const persisted = loadPersistedData();

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

export const store = globalThis.__VINEX_STORE__;
