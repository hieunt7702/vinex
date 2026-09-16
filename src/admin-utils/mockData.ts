export const mockDashboardStats = {
  totalUnits: 0,
  totalProducts: 45,
  totalLeads: 128,
  totalSupervisions: 0,
  totalArticles: 42,
  activeProducts: 40,
  pendingProducts: 5,
  hiddenProducts: 0,
  pendingLeads: 12,
  processingLeads: 45,
  leadsToday: 5,
  leadsThisWeek: 28,
  leadsThisMonth: 105,
  conversionRate: '15.5%',
  publishedArticles: 38,
  indexedSeoPages: 45,
  processingProjects: 0,
  totalCustomers: 560
};

export const mockDashboardChartData = [
  { date: '01/06', leads: 5, products: 1 },
  { date: '02/06', leads: 8, products: 0 },
  { date: '03/06', leads: 12, products: 2 },
  { date: '04/06', leads: 7, products: 1 },
  { date: '05/06', leads: 15, products: 3 },
  { date: '06/06', leads: 10, products: 0 },
  { date: '07/06', leads: 22, products: 4 },
];

export const mockCategories = [
  { id: 1, name: 'Hạt điều rang muối', parentId: null, slug: 'hat-dieu-rang-muoi' },
  { id: 2, name: 'Hạt điều vị', parentId: null, slug: 'hat-dieu-vi' },
  { id: 3, name: 'Hộp quà Tết', parentId: null, slug: 'hop-qua-tet' },
  { id: 4, name: 'Quà tặng doanh nghiệp', parentId: null, slug: 'qua-tang-doanh-nghiep' }
];

export const mockProducts = [
  {
    id: 1,
    productId: 'SP001',
    name: 'Hạt Điều Rang Muối Bình Phước Loại A Cối 500g',
    slug: 'hat-dieu-rang-muoi-binh-phuoc-loai-a-coi-500g',
    segment: 'cao-cap',
    price: 185000,
    promotionalPrice: 175000,
    unitId: null,
    shortDescription: 'Hạt điều nguyên hạt loại A (W240) rang củi thủ công, giòn rụm, đậm vị.',
    description: '<p>Hạt điều Bình Phước loại 1 ngon nhất...</p>',
    status: 'ACTIVE',
    images: [],
    categories: [{ id: 1, name: 'Hạt điều rang muối' }],
    attributes: [{ name: 'Trọng lượng', value: '500g' }, { name: 'Quy cách', value: 'Hũ nhựa nắp nhôm' }],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 2,
    productId: 'SP002',
    name: 'Hộp Quà Tết Tinh Hoa Việt',
    slug: 'hop-qua-tet-tinh-hoa-viet',
    segment: 'cao-cap',
    price: 1250000,
    promotionalPrice: 1150000,
    unitId: null,
    shortDescription: 'Set hộp quà tặng doanh nghiệp sang trọng với 6 loại hạt dinh dưỡng cao cấp.',
    description: '<p>Hộp quà thiết kế theo bộ nhận diện độc quyền...</p>',
    status: 'ACTIVE',
    images: [],
    categories: [{ id: 3, name: 'Hộp quà Tết' }, { id: 4, name: 'Quà tặng doanh nghiệp' }],
    attributes: [{ name: 'Thiết kế', value: 'Hộp gỗ bọc da cao cấp' }],
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString()
  },
  {
    id: 3,
    productId: 'SP003',
    name: 'Hạt Điều Tỏi Ớt 250g',
    slug: 'hat-dieu-toi-ot-250g',
    segment: 'co-ban',
    price: 85000,
    promotionalPrice: 0,
    unitId: null,
    shortDescription: 'Hạt điều rang tỏi ớt cay cay mặn ngọt cực cuốn.',
    description: '<p>Snack hạt điều vị tỏi ớt thơm ngon, dễ ăn...</p>',
    status: 'PENDING',
    images: [],
    categories: [{ id: 2, name: 'Hạt điều vị' }],
    attributes: [{ name: 'Trọng lượng', value: '250g' }],
    createdAt: new Date().toISOString()
  }
];

export const mockLeads = [
  {
    id: 1,
    customerName: 'Nguyễn Văn Nam',
    phone: '0901234567',
    email: 'nam.nguyen@example.com',
    location: 'Hà Nội',
    source: 'Website Form',
    assignee: 'Sale Minh',
    projectType: 'Quà doanh nghiệp',
    budget: '50-100tr',
    timeline: '1-tuan',
    priority: 'HIGH',
    needs: 'In logo công ty lên hộp quà',
    notes: 'Khách hàng cần đặt 500 phần quà Tết cho đối tác.',
    status: 'NEW', 
    leadClassification: 'HOT',
    callNotes: 'Đã gọi trao đổi sơ bộ, khách khá gấp.',
    chatNotes: 'Đã gửi qua Zalo các mẫu thiết kế.',
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    customerName: 'Trần Thị Thu',
    phone: '0987654321',
    email: 'thu.tran@example.com',
    location: 'TP.HCM',
    source: 'Facebook Ads',
    assignee: 'Sale Lan',
    projectType: 'Mua sỉ',
    budget: '10-50tr',
    timeline: 'trong-thang',
    priority: 'MEDIUM',
    needs: 'Nhập hạt điều về bán Tết',
    notes: 'Cần gửi mẫu dùng thử trước.',
    status: 'CONSULTING',
    leadClassification: 'WARM',
    callNotes: 'Đang lên đơn gửi mẫu thử cho khách.',
    chatNotes: '',
    followUpDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const mockArticles = [
  {
    id: 1,
    title: '5 Lợi Ích Của Hạt Điều Đối Với Sức Khỏe',
    slug: '5-loi-ich-cua-hat-dieu-doi-voi-suc-khoe',
    category: 'Sức khỏe',
    author: 'Chuyên gia Dinh dưỡng',
    summary: 'Hạt điều không chỉ là món ăn vặt ngon miệng mà còn mang lại vô số lợi ích cho tim mạch, trí não...',
    content: '<p>Nội dung chi tiết của bài viết...</p>',
    thumbnail: 'https://images.unsplash.com/photo-1599507593362-50fa53ed1b40?q=80&w=600&auto=format&fit=crop',
    views: 1250,
    status: 'PUBLISHED',
    metaTitle: '5 Lợi Ích Của Hạt Điều Đối Với Sức Khỏe | VINEX',
    metaDescription: 'Khám phá 5 lợi ích sức khỏe tuyệt vời từ hạt điều.',
    keyword: 'lợi ích hạt điều, sức khỏe',
    faqSchema: true,
    publishedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 16).toISOString()
  },
  {
    id: 2,
    title: 'Xu hướng quà Tết doanh nghiệp 2026',
    slug: 'xu-huong-qua-tet-doanh-nghiep-2026',
    category: 'Góc doanh nghiệp',
    author: 'Admin',
    summary: 'Năm 2026, quà Tết thiên hướng về nông sản tốt cho sức khỏe đang lên ngôi...',
    content: '<p>Nội dung chi tiết của bài viết...</p>',
    thumbnail: '',
    views: 840,
    status: 'PUBLISHED',
    metaTitle: 'Xu Hướng Quà Tết Doanh Nghiệp 2026 | VINEX',
    metaDescription: 'Lựa chọn bộ quà Tết tối ưu ngân sách cho doanh nghiệp.',
    keyword: 'quà tết 2026, quà doanh nghiệp',
    faqSchema: false,
    publishedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 22).toISOString()
  }
];

export const mockCustomers = [
  {
    id: 1,
    fullName: 'Nguyễn Văn Nam',
    phoneNumber: '0901234567',
    email: 'nam.nguyen@example.com',
    address: 'Hà Nội',
    totalLeads: 2,
    totalSpent: 125000000,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    fullName: 'Trần Thị Thu',
    phoneNumber: '0987654321',
    email: 'thu.tran@example.com',
    address: 'Hồ Chí Minh',
    totalLeads: 1,
    totalSpent: 1500000,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const mockSettings = {
  storeName: "VINEX - Nông sản Việt Nam",
  address: "Phước Long, Bình Phước",
  phone: "0988 888 888",
  zalo: "0988 888 888",
  email: "contact@vinex.vn"
};
