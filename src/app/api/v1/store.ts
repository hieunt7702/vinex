import { mockProducts, mockLeads, mockArticles, mockCustomers, mockCategories, mockDashboardStats } from '@/admin-utils/mockData';

// Simple in-memory store that resets on server restart
export const store = {
  products: [...mockProducts],
  leads: [...mockLeads],
  articles: [...mockArticles],
  customers: [...mockCustomers],
  categories: [...mockCategories],
  stats: { ...mockDashboardStats },
};
