export const mockDashboardStats = {
  totalProducts: 16,
  activeProducts: 14,
  pendingProducts: 2,
  hiddenProducts: 0,
  totalCategories: 12,
  totalArticles: 6,
  publishedArticles: 5,
  draftArticles: 1,
  totalArticleViews: 4890,
  totalLeads: 48,
  pendingLeads: 8,
  processingLeads: 24,
  completedLeads: 16,
  leadsToday: 3,
  leadsThisWeek: 12,
  leadsThisMonth: 48,
  conversionRate: '33.3%',
  indexedSeoPages: 28,
  totalCustomers: 85
};

export const mockDashboardChartData = [
  { date: '19/09', leads: 4, views: 320 },
  { date: '20/09', leads: 6, views: 450 },
  { date: '21/09', leads: 9, views: 610 },
  { date: '22/09', leads: 5, views: 520 },
  { date: '23/09', leads: 11, views: 780 },
  { date: '24/09', leads: 8, views: 640 },
  { date: '25/09', leads: 14, views: 920 },
];

export const mockCategories = [
  // 4 Danh mục Sản phẩm chính (Cấp 1 - Tương ứng menu Header & Bộ lọc)
  { 
    id: 1, 
    name: 'Hạt điều tẩm vị', 
    parentId: null, 
    slug: 'hat-dieu-tam-vi', 
    type: 'Sản phẩm', 
    status: 'ACTIVE',
    description: 'Các dòng hạt điều Bình Phước rang giòn tẩm vị hảo hạng, chuẩn vị xuất khẩu',
    attributes: [
      { name: 'Quy cách', values: ['Hũ nắp nhôm 250g', 'Hộp quà cao cấp', 'Túi zip 500g'] },
      { name: 'Độ rang / Chế biến', values: ['Rang giòn tẩm vị', 'Rang củi gia truyền', 'Sấy thăng hoa'] },
      { name: 'Xuất xứ nguyên liệu', values: ['Bình Phước, Việt Nam'] },
      { name: 'Tiêu chuẩn', values: ['HACCP', 'ISO 22000', 'OCOP'] }
    ]
  },
  { 
    id: 2, 
    name: 'Trà và cà phê', 
    parentId: null, 
    slug: 'tra-va-ca-phe', 
    type: 'Sản phẩm', 
    status: 'ACTIVE',
    description: 'Trà Ô Long và cà phê nguyên chất thượng hạng từ vùng nguyên liệu tuyển chọn',
    attributes: [
      { name: 'Quy cách', values: ['Lon thiếc 150g', 'Túi zipper 250g', 'Hộp quà đôi'] },
      { name: 'Độ rang / Lên men', values: ['Medium Roast', 'Dark Roast', 'Lên men tự nhiên'] },
      { name: 'Vùng trồng', values: ['Cầu Đất - Lâm Đồng', 'Buôn Ma Thuột - Đắk Lắk'] }
    ]
  },
  { 
    id: 3, 
    name: 'Bánh kẹo', 
    parentId: null, 
    slug: 'banh-keo', 
    type: 'Sản phẩm', 
    status: 'ACTIVE',
    description: 'Bánh ngói hạnh nhân, kẹo hạt điều và granola dinh dưỡng từ nông sản sạch',
    attributes: [
      { name: 'Quy cách', values: ['Hộp giấy mỹ thuật 200g', 'Hũ nắp nhôm 300g'] },
      { name: 'Thành phần', values: ['Hạt điều', 'Yến mạch', 'Mật ong hoa nhãn', 'Không đường tinh luyện'] },
      { name: 'Hạn sử dụng', values: ['9 tháng', '12 tháng'] }
    ]
  },
  { 
    id: 4, 
    name: 'Nông sản sấy', 
    parentId: null, 
    slug: 'nong-san-say', 
    type: 'Sản phẩm', 
    status: 'ACTIVE',
    description: 'Trái cây sấy dẻo tự nhiên và nông sản sấy thăng hoa giữ trọn hương vị tươi ngon',
    attributes: [
      { name: 'Quy cách', values: ['Hũ 200g', 'Túi zip 500g', 'Khay hút chân không'] },
      { name: 'Công nghệ sấy', values: ['Sấy lạnh (Freeze-Drying)', 'Sấy dẻo nhiệt thấp'] },
      { name: 'Đặc tính', values: ['100% tự nhiên', 'Không chất bảo quản', 'Giàu chất xơ'] }
    ]
  },

  // Danh mục con (Cấp 2)
  { id: 11, name: 'Hạt điều trứng muối & phô mai', parentId: 1, slug: 'hat-dieu-trung-muoi-pho-mai', type: 'Sản phẩm', status: 'ACTIVE', description: 'Hũ nhôm cao cấp 250g, béo bùi giòn rụm' },
  { id: 12, name: 'Hạt điều vị cay Tomyum & Tứ Xuyên', parentId: 1, slug: 'hat-dieu-cay-tomyum-tu-xuyen', type: 'Sản phẩm', status: 'ACTIVE', description: 'Vị cay nồng kích thích vị giác' },
  { id: 13, name: 'Hạt điều rang củi Bình Phước W240', parentId: 1, slug: 'hat-dieu-rang-cui-binh-phuoc', type: 'Sản phẩm', status: 'ACTIVE', description: 'Rang củi thủ công giữ trọn vị mộc' },

  { id: 21, name: 'Trà Ô Long & Trà thảo mộc', parentId: 2, slug: 'tra-o-long-thao-moc', type: 'Sản phẩm', status: 'ACTIVE', description: 'Búp trà tươi tuyển chọn lên men tự nhiên' },
  { id: 22, name: 'Cà phê Robusta & Arabica rang mộc', parentId: 2, slug: 'ca-phe-robusta-arabica', type: 'Sản phẩm', status: 'ACTIVE', description: 'Hạt cà phê đậm đà thơm ngát' },

  { id: 31, name: 'Bánh ngói hạt điều hạnh nhân', parentId: 3, slug: 'banh-ngoi-hat-dieu', type: 'Sản phẩm', status: 'ACTIVE', description: 'Bánh ngói giòn tan thơm béo' },
  { id: 32, name: 'Granola hạt dinh dưỡng cao cấp', parentId: 3, slug: 'granola-hat-dinh-duong', type: 'Sản phẩm', status: 'ACTIVE', description: 'Yến mạch nướng mật ong và hạt tuyển chọn' },

  { id: 41, name: 'Trái cây sấy dẻo tự nhiên (Xoài, Dứa, Mít)', parentId: 4, slug: 'trai-cay-say-deo', type: 'Sản phẩm', status: 'ACTIVE', description: 'Xoài cát sấy dẻo công nghệ lạnh' },
  { id: 42, name: 'Nấm & Rau củ sấy thăng hoa', parentId: 4, slug: 'nam-rau-cu-say', type: 'Sản phẩm', status: 'ACTIVE', description: 'Giòn xốp tự nhiên, nguyên vẹn dưỡng chất' },

  // Danh mục Hộp quà tặng B2B
  { id: 50, name: 'Quà tặng doanh nghiệp', parentId: null, slug: 'qua-tang-doanh-nghiep', type: 'Sản phẩm', status: 'ACTIVE', description: 'Giải pháp quà tặng B2B đẳng cấp' },
  { id: 51, name: 'Hộp quà Tết Hoàng Gia', parentId: 50, slug: 'hop-qua-tet-hoang-gia', type: 'Sản phẩm', status: 'ACTIVE', description: 'Set quà cao cấp sơn mài & da' },
  { id: 52, name: 'Quà tặng theo yêu cầu (Custom B2B)', parentId: 50, slug: 'qua-tang-custom', type: 'Sản phẩm', status: 'ACTIVE', description: 'Khắc logo, thiết kế độc quyền' },
  
  // Danh mục Bài viết
  { id: 101, name: 'Tin tức VINEX', parentId: null, slug: 'tin-tuc-vinex', type: 'Bài viết', status: 'ACTIVE', description: 'Thông tin hoạt động và sự kiện VINEX' },
  { id: 102, name: 'Kiến thức nông sản', parentId: null, slug: 'kien-thuc-nong-san', type: 'Bài viết', status: 'ACTIVE', description: 'Bí quyết dinh dưỡng và nông sản sạch' },
  { id: 103, name: 'Kinh nghiệm quà tặng', parentId: null, slug: 'kinh-nghiem-qua-tang', type: 'Bài viết', status: 'ACTIVE', description: 'Cẩm nang chọn quà tặng đối tác doanh nghiệp' },
  { id: 104, name: 'Sự kiện & Hoạt động', parentId: null, slug: 'su-kien-hoat-dong', type: 'Bài viết', status: 'ACTIVE', description: 'Hội chợ, xúc tiến thương mại' },
  { id: 105, name: 'Quy trình sản xuất', parentId: null, slug: 'quy-trinh-san-xuat', type: 'Bài viết', status: 'ACTIVE', description: 'Tiêu chuẩn ISO, HACCP nhà máy' }
];

export const mockProducts = [
  {
    id: 1,
    productId: 'VNX-001',
    sku: 'VNX-CAS-EGG-250',
    name: 'Hạt điều vị trứng muối',
    slug: 'hat-dieu-vi-trung-muoi',
    segment: 'cao-cap',
    price: 98000,
    promotionalPrice: 88000,
    stockQuantity: 145,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 15,
    shortDescription: 'Béo bùi, đậm vị trứng muối',
    description: '<p>Hạt điều rang giòn tẩm vị trứng muối hảo hạng, béo ngậy chuẩn vị, đóng hũ nắp nhôm tiện lợi mang theo hoặc làm quà tặng.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Orchard nuts 1.png', '/images/product/Orchard nuts 2.png', '/value1.png'],
    categories: [{ id: 1, name: 'Hạt điều tẩm vị' }, { id: 11, name: 'Hạt điều trứng muối & phô mai' }],
    attributes: [{ name: 'Trọng lượng', value: '250g' }, { name: 'Quy cách', value: 'Hũ nắp nhôm sang trọng' }, { name: 'Độ rang / Chế biến', value: 'Rang giòn tẩm vị' }, { name: 'Hạn sử dụng', value: '12 tháng' }, { name: 'Xuất xứ', value: 'Bình Phước, Việt Nam' }],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    id: 2,
    productId: 'VNX-002',
    sku: 'VNX-CAS-TX-250',
    name: 'Hạt điều vị Tứ Xuyên',
    slug: 'hat-dieu-vi-tu-xuyen',
    segment: 'cao-cap',
    price: 98000,
    promotionalPrice: 88000,
    stockQuantity: 82,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 15,
    shortDescription: 'Cay thơm, đậm đà đặc trưng',
    description: '<p>Hạt điều vị Tứ Xuyên cay nồng thơm lừng từ ớt tiêu đặc trưng và hạt điều Bình Phước tuyển chọn.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Orchard nuts 2.png', '/images/product/Orchard nuts 3.png'],
    categories: [{ id: 1, name: 'Hạt điều tẩm vị' }, { id: 12, name: 'Hạt điều vị cay Tomyum & Tứ Xuyên' }],
    attributes: [{ name: 'Trọng lượng', value: '250g' }, { name: 'Quy cách', value: 'Hũ nắp nhôm sang trọng' }, { name: 'Độ rang / Chế biến', value: 'Cay nồng đặc trưng' }, { name: 'Xuất xứ', value: 'Bình Phước, Việt Nam' }],
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString()
  },
  {
    id: 3,
    productId: 'VNX-003',
    sku: 'VNX-CAS-TOM-250',
    name: 'Hạt điều vị Tomyum',
    slug: 'hat-dieu-vi-tomyum',
    segment: 'cao-cap',
    price: 98000,
    promotionalPrice: 88000,
    stockQuantity: 8,
    stockStatus: 'LOW_STOCK',
    lowStockThreshold: 10,
    shortDescription: 'Chua cay, thơm vị thảo mộc',
    description: '<p>Hạt điều tẩm gia vị Tomyum chua chua cay cay hài hòa, giòn rụm kích thích vị giác.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Orchard nuts 3.png', '/images/product/Orchard nuts 1.png'],
    categories: [{ id: 1, name: 'Hạt điều tẩm vị' }, { id: 12, name: 'Hạt điều vị cay Tomyum & Tứ Xuyên' }],
    attributes: [{ name: 'Trọng lượng', value: '250g' }, { name: 'Quy cách', value: 'Hũ nắp nhôm sang trọng' }, { name: 'Độ rang / Chế biến', value: 'Chua cay thảo mộc' }, { name: 'Hạn sử dụng', value: '12 tháng' }],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 4,
    productId: 'VNX-004',
    sku: 'VNX-CAS-RC-500',
    name: 'Hạt điều rang củi Bình Phước W240 Loại 1',
    slug: 'hat-dieu-rang-cui-binh-phuoc-w240',
    segment: 'cao-cap',
    price: 195000,
    promotionalPrice: 185000,
    stockQuantity: 210,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 20,
    shortDescription: 'Hạt điều rang củi thủ công giữ nguyên vỏ lụa, giòn rụm béo ngậy.',
    description: '<p>Đặc sản hạt điều rang củi Bình Phước tuyển chọn hạt to đều W240, rang củi gia truyền đậm chất mộc mạc.</p>',
    status: 'ACTIVE',
    images: ['/value1.png', '/section_nhan_dieu_trang.png'],
    categories: [{ id: 1, name: 'Hạt điều tẩm vị' }, { id: 13, name: 'Hạt điều rang củi Bình Phước W240' }],
    attributes: [{ name: 'Trọng lượng', value: '500g' }, { name: 'Quy cách', value: 'Hút chân không túi zip' }, { name: 'Tiêu chuẩn', value: 'W240 xuất khẩu' }, { name: 'Xuất xứ', value: 'Bình Phước, Việt Nam' }],
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString()
  },
  {
    id: 5,
    productId: 'VNX-005',
    sku: 'VNX-GIFT-TET-01',
    name: 'Hộp Quà Tết Tinh Hoa Nông Sản Việt',
    slug: 'hop-qua-tet-tinh-hoa-nong-san-viet',
    segment: 'cao-cap',
    price: 1250000,
    promotionalPrice: 1150000,
    stockQuantity: 35,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 10,
    shortDescription: 'Set quà Tết cao cấp gồm 6 dòng nông sản & hạt điều thượng hạng dành cho đối tác VIP.',
    description: '<p>Hộp quà thiết kế độc quyền chất liệu sơn mài / da cao cấp kết hợp hạt điều, trà Ô Long, cà phê đặc sản và trái cây sấy dẻo.</p>',
    status: 'ACTIVE',
    images: ['/value2.png', '/bg_section_lhqt.png'],
    categories: [{ id: 50, name: 'Quà tặng doanh nghiệp' }, { id: 51, name: 'Hộp quà Tết Hoàng Gia' }],
    attributes: [{ name: 'Chất liệu hộp', value: 'Gỗ bọc da ép kim logo' }, { name: 'Số món', value: '6 hũ quà + 1 hộp trà' }],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 6,
    productId: 'VNX-006',
    sku: 'VNX-TEA-OL-150',
    name: 'Trà ô long đặc biệt',
    slug: 'tra-o-long-dac-biet',
    segment: 'trung-cap',
    price: 145000,
    promotionalPrice: 135000,
    stockQuantity: 65,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 10,
    shortDescription: 'Trà ô long thượng hạng được hái thủ công, mang hương vị thanh tao, dịu nhẹ.',
    description: '<p>Búp trà ô long tuyển chọn từ cao nguyên, lên men tự nhiên, nước trà vàng óng thanh dịu.</p>',
    status: 'ACTIVE',
    images: ["/images/product/Tra' premium Essiora 1.png"],
    categories: [{ id: 2, name: 'Trà và cà phê' }, { id: 21, name: 'Trà Ô Long & Trà thảo mộc' }],
    attributes: [{ name: 'Trọng lượng', value: '150g' }, { name: 'Quy cách', value: 'Lon thiếc hút chân không' }, { name: 'Độ rang / Lên men', value: 'Lên men tự nhiên' }, { name: 'Xuất xứ', value: 'Cầu Đất, Lâm Đồng' }],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: 7,
    productId: 'VNX-007',
    sku: 'VNX-COF-ROB-250',
    name: 'Cà phê Robusta nguyên chất rang mộc',
    slug: 'ca-phe-rang-xay-nguyen-chat',
    segment: 'trung-cap',
    price: 120000,
    promotionalPrice: 110000,
    stockQuantity: 42,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 10,
    shortDescription: 'Cà phê Robusta nguyên chất, rang mộc giữ trọn hương vị đậm đà truyền thống.',
    description: '<p>Hạt cà phê Robusta tuyển chọn từ vùng đất đỏ bazan, rang mộc độ vừa, hương thơm nồng nàn vị đắng đằm.</p>',
    status: 'ACTIVE',
    images: ['/images/product/ca phe nguyen hat 1.png'],
    categories: [{ id: 2, name: 'Trà và cà phê' }, { id: 22, name: 'Cà phê Robusta & Arabica rang mộc' }],
    attributes: [{ name: 'Trọng lượng', value: '250g' }, { name: 'Quy cách', value: 'Túi van 1 chiều 250g' }, { name: 'Độ rang', value: 'Medium Roast' }, { name: 'Xuất xứ', value: 'Đắk Lắk, Việt Nam' }],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 8,
    productId: 'VNX-008',
    sku: 'VNX-FRU-MNG-200',
    name: 'Xoài sấy dẻo tự nhiên',
    slug: 'xoai-say-deo',
    segment: 'co-ban',
    price: 75000,
    promotionalPrice: 0,
    stockQuantity: 95,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 15,
    shortDescription: 'Xoài sấy dẻo tự nhiên, không tẩm đường, vị chua ngọt hài hòa.',
    description: '<p>Xoài cát chín mọng sấy dẻo công nghệ lạnh giữ nguyên màu vàng óng và vị ngọt thanh tự nhiên.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Xoai say deo 1.png'],
    categories: [{ id: 4, name: 'Nông sản sấy' }, { id: 41, name: 'Trái cây sấy dẻo tự nhiên (Xoài, Dứa, Mít)' }],
    attributes: [{ name: 'Trọng lượng', value: '200g' }, { name: 'Quy cách', value: 'Hũ nắp nhôm tiện lợi' }, { name: 'Công nghệ sấy', value: 'Sấy lạnh công nghệ cao' }, { name: 'Hạn dùng', value: '9 tháng' }],
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    productId: 'VNX-009',
    sku: 'VNX-BK-CAS-200',
    name: 'Bánh ngói hạt điều hạnh nhân mật ong',
    slug: 'banh-ngoi-hat-dieu-hanh-nhan',
    segment: 'cao-cap',
    price: 85000,
    promotionalPrice: 75000,
    stockQuantity: 120,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 15,
    shortDescription: 'Bánh ngói giòn rụm kết hợp hạt điều béo bùi và hạnh nhân nướng mật ong hoa nhãn.',
    description: '<p>Bánh ngói nướng thủ công với tỉ lệ hạt điều và hạnh nhân nguyên chất, ít ngọt, giòn tan thơm béo.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Orchard nuts 1.png', '/images/product/Collection 6.png'],
    categories: [{ id: 3, name: 'Bánh kẹo' }, { id: 31, name: 'Bánh ngói hạt điều hạnh nhân' }],
    attributes: [{ name: 'Trọng lượng', value: '200g' }, { name: 'Quy cách', value: 'Hộp giấy mỹ thuật cao cấp' }, { name: 'Thành phần', value: 'Hạt điều, hạnh nhân, mật ong' }, { name: 'Hạn dùng', value: '6 tháng' }],
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    productId: 'VNX-010',
    sku: 'VNX-FRU-MUSH-150',
    name: 'Nấm hương sấy thăng hoa giòn rụm',
    slug: 'nam-huong-say-thang-hoa',
    segment: 'cao-cap',
    price: 95000,
    promotionalPrice: 85000,
    stockQuantity: 60,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 10,
    shortDescription: 'Nấm hương tươi sấy giòn công nghệ sấy thăng hoa giữ nguyên dưỡng chất và vị ngọt tự nhiên.',
    description: '<p>Nấm tuyển chọn từ vùng trồng đạt chuẩn hữu cơ, sấy thăng hoa giòn xốp gia vị thảo mộc nhẹ nhàng.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Collection 7.png'],
    categories: [{ id: 4, name: 'Nông sản sấy' }, { id: 42, name: 'Nấm & Rau củ sấy thăng hoa' }],
    attributes: [{ name: 'Trọng lượng', value: '150g' }, { name: 'Quy cách', value: 'Hũ nắp nhôm cao cấp' }, { name: 'Công nghệ sấy', value: 'Sấy thăng hoa (Freeze-Drying)' }],
    createdAt: new Date().toISOString()
  }
];

export const mockArticles = [
  {
    id: 1,
    title: 'VINEX đồng hành cùng Miss World Vietnam Nâng tầm nông sản Việt',
    slug: 'vinex-miss-world-vietnam',
    category: 'Tin tức VINEX',
    author: 'Truyền thông VINEX',
    summary: 'Bộ quà tặng nông sản mang câu chuyện thương hiệu đến sự kiện.',
    content: `
      <p>VINEX tự hào đồng hành cùng cuộc thi Miss World Vietnam với tư cách là đơn vị tài trợ quà tặng nông sản cao cấp. Mỗi bộ quà tặng là một tác phẩm nghệ thuật gói trọn tinh hoa đất trời Việt Nam.</p>
      <h2>Bộ quà tặng nông sản đặc biệt dành riêng cho Miss World</h2>
      <p>Với tinh thần tôn vinh sắc đẹp và trí tuệ, VINEX mong muốn mang đến những sản phẩm hạt điều và nông sản chất lượng cao, góp phần quảng bá hình ảnh Việt Nam đến bạn bè quốc tế.</p>
      <div style="margin: 2rem 0; text-align: center;">
         <img src="/images/banner/b_miss_world_2026.png" alt="VINEX đồng hành Miss World Vietnam quà tặng nông sản" style="border-radius: 12px; max-width: 100%; box-shadow: 0 8px 24px rgba(0,0,0,0.1);" />
      </div>
      <h3>Sứ mệnh kết nối nông sản Việt ra thế giới</h3>
      <p>Hạt điều Bình Phước từ lâu đã khẳng định chất lượng số một toàn cầu nhờ thổ nhưỡng bazan màu mỡ. Thông qua sự kiện này, VINEX khẳng định vị thế thương hiệu nông sản Việt chuẩn quốc tế.</p>
    `,
    thumbnail: '/images/banner/b_miss_world_2026.png',
    views: 1248,
    status: 'PUBLISHED',
    metaTitle: 'VINEX Đồng Hành Miss World Vietnam | Quà Tặng Nông Sản',
    metaDescription: 'VINEX tài trợ bộ quà tặng nông sản tinh hoa trong khuôn khổ Miss World Vietnam, lan tỏa giá trị hạt điều Bình Phước đến bạn bè năm châu.',
    keyword: 'quà tặng nông sản',
    canonicalUrl: 'https://vinex.vn/tin-tuc/vinex-miss-world-vietnam',
    ogTitle: 'VINEX Đồng Hành Cùng Miss World Vietnam | Nông Sản Tinh Hoa',
    ogDescription: 'Chiêm ngưỡng bộ quà tặng hạt điều và nông sản đặc biệt được VINEX thiết kế riêng cho Miss World Vietnam.',
    ogImage: '/images/banner/b_miss_world_2026.png',
    robotsIndex: 'index',
    robotsFollow: 'follow',
    schemaType: 'NewsArticle',
    readingTime: '3 phút đọc',
    tags: 'Miss World, VINEX, quà tặng nông sản, hạt điều bình phước',
    faqSchema: true,
    publishedAt: '2026-09-17T08:00:00.000Z',
    createdAt: '2026-09-17T08:00:00.000Z'
  },
  {
    id: 2,
    title: '5 sai lầm khi chọn quà tặng doanh nghiệp',
    slug: '5-sai-lam-khi-chon-qua-tang-doanh-nghiep',
    category: 'Kinh nghiệm quà tặng',
    author: 'Chuyên gia VINEX',
    summary: 'Bài viết phân tích những rủi ro và sai lầm phổ biến khiến doanh nghiệp lãng phí chi phí khi tự chuẩn bị quà tặng đối tác, cùng giải pháp set quà nông sản cao cấp.',
    content: `
      <p>Quá trình lên kế hoạch và chuẩn bị quà tặng doanh nghiệp thường mất nhiều thời gian hơn dự kiến. Nhiều đơn vị lầm tưởng rằng chỉ cần chọn một món đồ có sẵn, in logo lên là xong. Tuy nhiên, đằng sau một bộ quà tặng ấn tượng là cả một quy trình thiết kế, sản xuất bao bì và quản lý chất lượng.</p>
      <h2>1. Không xác định rõ đối tượng nhận quà tặng doanh nghiệp</h2>
      <p>Một trong những sai lầm lớn nhất là chọn quà theo sở thích cá nhân thay vì nghiên cứu kỹ đối tượng nhận. Đối tác VIP cần bộ quà tinh tế, độc bản, trong khi quà tặng nhân viên cần tính ứng dụng cao.</p>
      <h2>2. Bỏ qua chất lượng và chất liệu của bao bì</h2>
      <p>Bao bì chiếm đến 50% cảm xúc của người nhận khi cầm món quà trên tay. Hộp giấy ọp ẹp sẽ làm giảm giá trị của sản phẩm bên trong dù chất lượng tốt đến đâu.</p>
      <h2>3. Đặt hàng quá sát ngày sự kiện</h2>
      <p>Cần ít nhất 3-4 tuần để xử lý thiết kế, làm mẫu mockup, in ấn và đóng gói hàng loạt nhằm tránh rủi ro thiếu hụt.</p>
      <h2>4. Quà tặng thiếu tính bản sắc và thông điệp thương hiệu</h2>
      <p>Món quà tặng doanh nghiệp thành công phải kể được câu chuyện trân trọng và gắn kết bền lâu.</p>
    `,
    thumbnail: '/images/news/article_gift_box.jpg',
    views: 386,
    status: 'PUBLISHED',
    metaTitle: '5 Sai Lầm Khi Chọn Quà Tặng Doanh Nghiệp | VINEX',
    metaDescription: 'Khám phá 5 sai lầm phổ biến khi làm quà tặng doanh nghiệp và bí quyết lựa chọn set quà nông sản cao cấp ghi dấu ấn với đối tác VIP.',
    keyword: 'quà tặng doanh nghiệp',
    canonicalUrl: 'https://vinex.vn/tin-tuc/5-sai-lam-khi-chon-qua-tang-doanh-nghiep',
    ogTitle: '5 Sai Lầm Cần Tránh Khi Chuẩn Bị Quà Tặng Doanh Nghiệp',
    ogDescription: 'Cẩm nang kinh nghiệm làm quà tặng đối tác chuẩn chỉnh, tiết kiệm ngân sách và nâng tầm đẳng cấp thương hiệu.',
    ogImage: '/images/news/article_gift_box.jpg',
    robotsIndex: 'index',
    robotsFollow: 'follow',
    schemaType: 'Article',
    readingTime: '5 phút đọc',
    tags: 'quà tặng doanh nghiệp, quà tết đối tác, hộp quà cao cấp, kinh nghiệm quà tặng',
    faqSchema: false,
    publishedAt: '2026-09-11T08:00:00.000Z',
    createdAt: '2026-09-11T08:00:00.000Z'
  },
  {
    id: 3,
    title: 'Bảo quản hạt điều trắng đúng cách',
    slug: 'bi-quyet-bao-quan-hat-dieu-trang',
    category: 'Kiến thức nông sản',
    author: 'Kỹ sư Nông nghiệp VINEX',
    summary: 'Hướng dẫn chi tiết cách bảo quản hạt điều trắng không bị ỉu, không hôi dầu, giữ nguyên hàm lượng dinh dưỡng và độ giòn bùi trong thời gian dài.',
    content: `
      <p>Nhân điều trắng (White Wholes - WW) luôn được săn đón bởi vị ngọt bùi và độ giòn đặc trưng. Tuy nhiên, nếu không biết cách bảo quản hạt điều đúng chuẩn, nhân điều rất dễ bị ỉu, ngả màu vàng ố hoặc xuất hiện mùi hôi dầu khó chịu.</p>
      <h2>1. Kẻ thù số 1: Độ ẩm và không khí làm hạt điều mất giòn</h2>
      <p>Hạt điều có đặc tính hút ẩm rất mạnh. Luôn đựng hạt điều trong hũ thủy tinh nắp kín có gioăng cao su hoặc túi zip nhôm hút chân không.</p>
      <h2>2. Tránh ánh nắng trực tiếp và nhiệt độ cao</h2>
      <p>Tia UV và nhiệt độ cao sẽ kích hoạt quá trình oxy hóa chất béo không bão hòa, khiến hạt điều bị hôi dầu. Hãy bảo quản ở nơi khô ráo, nhiệt độ dưới 25 độ C.</p>
      <h2>3. Sử dụng ngăn mát tủ lạnh để bảo quản hạt điều lâu dài</h2>
      <p>Nếu muốn lưu trữ trên 6 tháng, gói kín hạt điều và đặt vào ngăn mát tủ lạnh để giữ trọn độ giòn và dưỡng chất.</p>
    `,
    thumbnail: '/images/news/article_cashew_bowl.jpg',
    views: 524,
    status: 'PUBLISHED',
    metaTitle: 'Bí Quyết Bảo Quản Hạt Điều Giữ Trọn Độ Giòn | VINEX',
    metaDescription: 'Hướng dẫn cách bảo quản hạt điều trắng tại nhà đúng chuẩn: không bị ỉu, không hôi dầu, giữ nguyên dinh dưỡng và hương vị bùi ngậy.',
    keyword: 'bảo quản hạt điều',
    canonicalUrl: 'https://vinex.vn/tin-tuc/bi-quyet-bao-quan-hat-dieu-trang',
    ogTitle: 'Cách Bảo Quản Hạt Điều Giòn Ngon Không Bị Hôi Dầu',
    ogDescription: 'Mẹo đơn giản giúp bạn bảo quản hạt điều trắng thơm ngon như lúc mới rang suốt 12 tháng.',
    ogImage: '/images/news/article_cashew_bowl.jpg',
    robotsIndex: 'index',
    robotsFollow: 'follow',
    schemaType: 'Article',
    readingTime: '4 phút đọc',
    tags: 'bảo quản hạt điều, hạt điều trắng, kiến thức nông sản, hạt dinh dưỡng',
    faqSchema: false,
    publishedAt: '2026-09-17T08:00:00.000Z',
    createdAt: '2026-09-17T08:00:00.000Z'
  },
  {
    id: 4,
    title: 'Từ hạt điều thô đến nhân điều trắng',
    slug: 'quy-trinh-san-xuat-hat-dieu-xuat-khau',
    category: 'Quy trình sản xuất',
    author: 'Giám đốc Quản lý Chất lượng',
    summary: 'Khám phá hành trình đầy tỉ mỉ từ những hạt điều thô ngoài vườn cây đến nhân điều trắng tinh khiết đạt chuẩn quốc tế.',
    content: `
      <p>Để bóc tách được một hạt điều hoàn chỉnh, không sứt mẻ và giữ nguyên lớp nhân trắng muốt là sự kết hợp giữa máy móc hiện đại và công nhân lành nghề.</p>
      <h2>Hành trình 8 bước sản xuất hạt điều khép kín</h2>
      <p>Quy trình sản xuất hạt điều tại nhà máy VINEX bao gồm: 1. Thu hoạch & Phơi khô; 2. Hấp điều; 3. Cắt vỏ thô; 4. Sấy điều; 5. Bóc vỏ lụa; 6. Phân cỡ hạt (W240, W320); 7. Dò kim loại & Diệt khuẩn; 8. Đóng gói hút chân không.</p>
      <div style="margin: 2rem 0; text-align: center;">
         <img src="/images/news/article_raw_cashew.jpg" alt="Quy trình sản xuất hạt điều xuất khẩu VINEX" style="border-radius: 12px; max-width: 100%; box-shadow: 0 8px 24px rgba(0,0,0,0.1);" />
      </div>
      <h2>Tiêu chuẩn quốc tế HACCP & ISO 22000</h2>
      <p>Tất cả các khâu đều tuân thủ kiểm định khắt khe nhằm đảm bảo từng hạt điều đến tay người tiêu dùng đều đạt độ giòn bùi tự nhiên tuyệt hảo.</p>
    `,
    thumbnail: '/images/news/article_raw_cashew.jpg',
    views: 297,
    status: 'PUBLISHED',
    metaTitle: 'Từ Hạt Điều Thô Đến Nhân Điều Trắng Chuẩn Quốc Tế | VINEX',
    metaDescription: 'Tìm hiểu quy trình sản xuất hạt điều xuất khẩu 8 bước khép kín tại nhà máy VINEX Bình Phước đạt chứng nhận tiêu chuẩn HACCP & ISO 22000.',
    keyword: 'sản xuất hạt điều',
    canonicalUrl: 'https://vinex.vn/tin-tuc/quy-trinh-san-xuat-hat-dieu-xuat-khau',
    ogTitle: 'Quy Trình Sản Xuất Hạt Điều Xuất Khẩu Chuẩn Quốc Tế',
    ogDescription: 'Khám phá tiêu chuẩn nhà máy chế biến hạt điều VINEX Bình Phước hiện đại bậc nhất.',
    ogImage: '/images/news/article_raw_cashew.jpg',
    robotsIndex: 'index',
    robotsFollow: 'follow',
    schemaType: 'Article',
    readingTime: '6 phút đọc',
    tags: 'sản xuất hạt điều, tiêu chuẩn xuất khẩu, HACCP, ISO 22000, nông sản sạch',
    faqSchema: false,
    publishedAt: '2026-09-17T08:00:00.000Z',
    createdAt: '2026-09-17T08:00:00.000Z'
  }
];

export const mockLeads = [
  {
    id: 1,
    customerName: 'Nguyễn Văn Nam (Tập đoàn FPT)',
    phone: '0901234567',
    email: 'nam.nguyen@fpt.com.vn',
    location: 'Hà Nội',
    source: 'Website Form Báo Giá',
    assignee: 'Trần Minh (Trưởng phòng B2B)',
    projectType: 'Hộp quà Tết doanh nghiệp',
    budget: '150 - 200 triệu',
    timeline: 'Trước 15/12',
    priority: 'HIGH',
    needs: 'Khắc logo công ty lên nắp hộp gỗ, in thiệp chúc mừng, 300 suất quà VIP.',
    notes: 'Đã gửi file catalogue và báo giá chiết khấu 15%. Chờ khách chốt mẫu thiết kế.',
    status: 'PROCESSING',
    leadClassification: 'HOT',
    callNotes: 'Khách hàng rất thiện chí, yêu cầu nếm thử mẫu hạt điều tẩm vị và trà ô long.',
    chatNotes: 'Đã gửi mẫu qua chuyển phát nhanh.',
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    customerName: 'Trần Thị Thu (Công ty Dược Hậu Giang)',
    phone: '0987654321',
    email: 'thu.tran@dhgpharma.com.vn',
    location: 'TP.HCM',
    source: 'Hotline / Zalo',
    assignee: 'Lê Lan (Sale B2B)',
    projectType: 'Mua sỉ hạt điều & Nông sản',
    budget: '50 - 80 triệu',
    timeline: 'Trong tháng này',
    priority: 'MEDIUM',
    needs: 'Nhập hạt điều rang muối và hạt điều vị tỏi ớt hũ 250g cho hệ thống nội bộ.',
    notes: 'Khách yêu cầu hóa đơn VAT và chứng chỉ HACCP / ISO.',
    status: 'NEW',
    leadClassification: 'WARM',
    callNotes: 'Đã xác nhận nhu cầu số lượng 500 hũ.',
    chatNotes: 'Đã kết bạn Zalo gửi bảng thành phần dinh dưỡng.',
    followUpDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 3,
    customerName: 'Hoàng Đức Long (Ngân hàng Vietcombank CN Tây Hồ)',
    phone: '0912888999',
    email: 'long.hd@vietcombank.com.vn',
    location: 'Hà Nội',
    source: 'Giới thiệu đối tác',
    assignee: 'Trần Minh',
    projectType: 'Quà tri ân khách hàng VIP',
    budget: '80 - 120 triệu',
    timeline: 'Tuần tới',
    priority: 'HIGH',
    needs: 'Set quà tặng 4 hũ hạt điều cao cấp + trà ô long trong hộp nhung xanh ép kim.',
    notes: 'Đã ký hợp đồng nguyên tắc, đang sản xuất bao bì.',
    status: 'COMPLETED',
    leadClassification: 'HOT',
    callNotes: 'Hài lòng với mẫu demo.',
    chatNotes: 'Đã nhận cọc 50%.',
    followUpDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const mockCustomers = [
  {
    id: 1,
    fullName: 'Tập đoàn FPT',
    phoneNumber: '0901234567',
    email: 'nam.nguyen@fpt.com.vn',
    address: 'Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
    totalLeads: 2,
    totalSpent: 185000000,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString()
  },
  {
    id: 2,
    fullName: 'Vietcombank Tây Hồ',
    phoneNumber: '0912888999',
    email: 'long.hd@vietcombank.com.vn',
    address: 'Tây Hồ, Hà Nội',
    totalLeads: 3,
    totalSpent: 96000000,
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString()
  }
];

export const mockMedia = [
  { id: 'm1', url: '/images/product/Cashew1.png', name: 'Cashew_Pho_Mai.png', size: 245000, createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'm2', url: '/images/product/Cashew2.png', name: 'Cashew_Toi_Ot.png', size: 238000, createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'm3', url: '/images/product/Cashew3.png', name: 'Cashew_Mat_Ong.png', size: 251000, createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'm4', url: "/images/product/Tra' premium Essiora 1.png", name: 'Tra_O_Long.png', size: 310000, createdAt: new Date(Date.now() - 86400000 * 9).toISOString() },
  { id: 'm5', url: '/images/product/ca phe nguyen hat 1.png', name: 'Ca_Phe_Robusta.png', size: 289000, createdAt: new Date(Date.now() - 86400000 * 9).toISOString() },
  { id: 'm6', url: '/images/banner/b_miss_world_2026.png', name: 'Banner_MissWorld.png', size: 520000, createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: 'm7', url: '/value1.png', name: 'Hat_dieu_rang_cui_cover.png', size: 410000, createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 'm8', url: '/value2.png', name: 'Hop_qua_tet_tinh_hoa.png', size: 480000, createdAt: new Date(Date.now() - 86400000 * 7).toISOString() }
];

export const initialGlobalSettings = {
  siteName: "VINEX - Tinh Hoa Nông Sản Việt",
  siteUrl: "https://vinexgroup.vn",
  contactEmail: "info@vinexgroup.vn",
  hotline: "0988 888 888",
  zalo: "0988 888 888",
  facebook: "https://facebook.com/vinexgroup.vn",
  address: "Sảnh 2B Sun Grand City, 69B Thụy Khuê, Hà Nội & Khu 6 Bằng Doãn, Bằng Luân, Phú Thọ",
  globalMetaTitle: "VINEX - Nông sản Việt Nam cao cấp vươn tầm quốc tế",
  globalMetaDesc: "Hạt điều Bình Phước và nông sản chế biến sâu thượng hạng xuất khẩu toàn cầu.",
  googleAnalytics: "G-XXXXXXX",
  facebookPixel: ""
};

export const mockSettings = [
  {
    id: 1,
    key: "GLOBAL_SETTINGS",
    value: JSON.stringify(initialGlobalSettings),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockSeoPages = [
  {
    id: 1,
    title: 'Hạt Điều Rang Củi Bình Phước Cao Cấp Chuẩn Xuất Khẩu',
    slug: 'hat-dieu-rang-cui-binh-phuoc-chuan-xuat-khau',
    keyword: 'hạt điều rang củi bình phước',
    lsiKeywords: 'hạt điều rang củi, hạt điều giá sỉ, hạt điều w240 xuất khẩu, hạt điều vỏ lụa',
    content: '<p>VINEX cung cấp dòng hạt điều rang củi Bình Phước gia truyền giữ nguyên vỏ lụa, vị bùi béo tự nhiên, không hóa chất phụ gia.</p>',
    status: 'PUBLISHED',
    metaTitle: 'Hạt Điều Rang Củi Bình Phước Hảo Hạng | VINEX',
    metaDescription: 'Hạt điều rang củi Bình Phước tuyển chọn hạt to W240, rang củi gia truyền giòn rụm béo ngậy. Đặt sỉ & lẻ giá tốt nhất.',
    schemaType: 'Product',
    views: 3420,
    conversionRate: '4.8%',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 2,
    title: 'Giải Pháp Hộp Quà Tết Doanh Nghiệp Tinh Hoa Nông Sản 2026',
    slug: 'giai-phap-hop-qua-tet-doanh-nghiep-2026',
    keyword: 'hộp quà tết doanh nghiệp',
    lsiKeywords: 'quà tết cao cấp, set quà tết sang trọng, quà tặng đối tác vip, quà tết nông sản',
    content: '<p>Tổng hợp các mẫu hộp quà Tết doanh nghiệp sang trọng từ nông sản và hạt điều VINEX. Thiết kế độc quyền, khắc logo theo yêu cầu.</p>',
    status: 'PUBLISHED',
    metaTitle: 'Hộp Quà Tết Doanh Nghiệp 2026 Đẳng Cấp | VINEX',
    metaDescription: 'Set quà Tết nông sản cao cấp cho doanh nghiệp, chiết khấu hấp dẫn, khắc logo thương hiệu miễn phí.',
    schemaType: 'LocalBusiness',
    views: 2890,
    conversionRate: '6.2%',
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 3,
    title: 'Cà Phê Robusta Nguyên Chất Rang Mộc Vùng Cao Nguyên',
    slug: 'ca-phe-robusta-nguyen-chat-rang-moc',
    keyword: 'cà phê robusta rang mộc',
    lsiKeywords: 'cà phê nguyên chất, cà phê sạch, hạt cà phê bazan, cà phê b2b',
    content: '<p>Cà phê Robusta rang mộc thơm nồng, đậm đà chuẩn gu Việt. Thu hoạch từ cao nguyên đất đỏ bazan.</p>',
    status: 'DRAFT',
    metaTitle: 'Cà Phê Robusta Rang Mộc Nguyên Bản | VINEX',
    metaDescription: 'Khám phá hương vị cà phê Robusta rang mộc đặc sản cao nguyên Việt Nam từ thương hiệu VINEX.',
    schemaType: 'Product',
    views: 450,
    conversionRate: '2.1%',
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

