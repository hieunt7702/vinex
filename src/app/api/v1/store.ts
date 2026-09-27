import { mockProducts, mockLeads, mockArticles, mockCustomers, mockCategories, mockDashboardStats, mockMedia, mockSeoPages, mockSettings } from '@/admin-utils/mockData';

// In-memory data store for VINEX administration
export const store = {
  products: [...mockProducts],
  leads: [...mockLeads],
  articles: [...mockArticles],
  customers: [...mockCustomers],
  categories: [...mockCategories],
  media: [...mockMedia],
  seopages: [...mockSeoPages],
  settings: [...mockSettings],
  stats: { ...mockDashboardStats },
};

