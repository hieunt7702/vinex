import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const categoriesData = [
  // Cấp 1 - Danh mục Sản phẩm
  { 
    id: 1, 
    name: 'Hạt điều tẩm vị', 
    parentId: null, 
    slug: 'hat-dieu-tam-vi', 
    type: 'Sản phẩm', 
    status: 'ACTIVE',
    description: 'Các dòng hạt điều Bình Phước rang giòn tẩm vị hảo hạng, chuẩn vị xuất khẩu',
    attributes: [
      { name: 'Quy cách', values: ['Hũ nắp nhôm 150g', 'Hũ nắp nhôm 250g', 'Hộp quà cao cấp', 'Túi zip 500g'] },
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
  { 
    id: 50, 
    name: 'Quà tặng doanh nghiệp', 
    parentId: null, 
    slug: 'qua-tang-doanh-nghiep', 
    type: 'Sản phẩm', 
    status: 'ACTIVE', 
    description: 'Giải pháp quà tặng B2B đẳng cấp cho đối tác và khách hàng',
    attributes: [
      { name: 'Chất liệu hộp', values: ['Sơn mài cao cấp', 'Gỗ bọc da', 'Hộp giấy mỹ thuật ép kim'] }
    ]
  },

  // Cấp 2 - Danh mục con
  { id: 11, name: 'Hạt điều trứng muối & phô mai', parentId: 1, slug: 'hat-dieu-trung-muoi-pho-mai', type: 'Sản phẩm', status: 'ACTIVE', description: 'Hũ nhôm cao cấp 150g - 250g, béo bùi giòn rụm' },
  { id: 12, name: 'Hạt điều vị cay Tomyum & Tứ Xuyên', parentId: 1, slug: 'hat-dieu-cay-tomyum-tu-xuyen', type: 'Sản phẩm', status: 'ACTIVE', description: 'Vị cay nồng kích thích vị giác' },
  { id: 13, name: 'Hạt điều rang củi Bình Phước W240', parentId: 1, slug: 'hat-dieu-rang-cui-binh-phuoc', type: 'Sản phẩm', status: 'ACTIVE', description: 'Rang củi thủ công giữ trọn vị mộc' },

  { id: 21, name: 'Trà Ô Long & Trà thảo mộc', parentId: 2, slug: 'tra-o-long-thao-moc', type: 'Sản phẩm', status: 'ACTIVE', description: 'Búp trà tươi tuyển chọn lên men tự nhiên' },
  { id: 22, name: 'Cà phê Robusta & Arabica rang mộc', parentId: 2, slug: 'ca-phe-robusta-arabica', type: 'Sản phẩm', status: 'ACTIVE', description: 'Hạt cà phê đậm đà thơm ngát' },

  { id: 31, name: 'Bánh ngói hạt điều hạnh nhân', parentId: 3, slug: 'banh-ngoi-hat-dieu', type: 'Sản phẩm', status: 'ACTIVE', description: 'Bánh ngói giòn tan thơm béo' },
  { id: 32, name: 'Granola hạt dinh dưỡng cao cấp', parentId: 3, slug: 'granola-hat-dinh-duong', type: 'Sản phẩm', status: 'ACTIVE', description: 'Yến mạch nướng mật ong và hạt tuyển chọn' },

  { id: 41, name: 'Trái cây sấy dẻo tự nhiên (Xoài, Dứa, Mít)', parentId: 4, slug: 'trai-cay-say-deo', type: 'Sản phẩm', status: 'ACTIVE', description: 'Xoài cát sấy dẻo công nghệ lạnh' },
  { id: 42, name: 'Nấm & Rau củ sấy thăng hoa', parentId: 4, slug: 'nam-rau-cu-say', type: 'Sản phẩm', status: 'ACTIVE', description: 'Giòn xốp tự nhiên, nguyên vẹn dưỡng chất' },

  { id: 51, name: 'Hộp quà Tết Hoàng Gia', parentId: 50, slug: 'hop-qua-tet-hoang-gia', type: 'Sản phẩm', status: 'ACTIVE', description: 'Set quà cao cấp sơn mài & da' },
  { id: 52, name: 'Quà tặng theo yêu cầu (Custom B2B)', parentId: 50, slug: 'qua-tang-custom', type: 'Sản phẩm', status: 'ACTIVE', description: 'Khắc logo, thiết kế độc quyền' },
  
  // Danh mục Bài viết
  { id: 101, name: 'Tin tức VINEX', parentId: null, slug: 'tin-tuc-vinex', type: 'Bài viết', status: 'ACTIVE', description: 'Thông tin hoạt động và sự kiện VINEX' },
  { id: 102, name: 'Kiến thức nông sản', parentId: null, slug: 'kien-thuc-nong-san', type: 'Bài viết', status: 'ACTIVE', description: 'Bí quyết dinh dưỡng và nông sản sạch' },
  { id: 103, name: 'Kinh nghiệm quà tặng', parentId: null, slug: 'kinh-nghiem-qua-tang', type: 'Bài viết', status: 'ACTIVE', description: 'Cẩm nang chọn quà tặng đối tác doanh nghiệp' },
  { id: 104, name: 'Sự kiện & Hoạt động', parentId: null, slug: 'su-kien-hoat-dong', type: 'Bài viết', status: 'ACTIVE', description: 'Hội chợ, xúc tiến thương mại' },
  { id: 105, name: 'Quy trình sản xuất', parentId: null, slug: 'quy-trinh-san-xuat', type: 'Bài viết', status: 'ACTIVE', description: 'Tiêu chuẩn ISO, HACCP nhà máy' }
];

const productsData = [
  {
    id: 1,
    productId: 'VNX-334',
    sku: 'VNX-CAS-PHOMAI-150',
    name: 'Hạt điều tẩm vị phô mai hũ 150g',
    slug: 'hat-dieu-tam-vi-phomai-hu-150g',
    segment: 'trung-cap',
    price: 150000,
    promotionalPrice: 120000,
    stockQuantity: 100,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 10,
    status: 'ACTIVE',
    shortDescription: 'Hạt điều tẩm vị phô mai hũ 150g – hạt điều giòn bùi, béo thơm kết hợp cùng vị phô mai đậm đà, thơm ngon khó cưỡng.',
    description: `<h1>Hạt Điều Tẩm Vị Phô Mai Hũ 150g – Giòn Bùi, Béo Thơm, Đậm Vị</h1><p><strong>Hạt điều tẩm vị phô mai 150g</strong> là món ăn vặt hấp dẫn dành cho những ai yêu thích vị béo bùi của hạt điều kết hợp cùng hương phô mai thơm ngon, đậm đà. Hạt điều được tuyển chọn, rang giòn và phủ lớp gia vị phô mai vừa miệng, tạo nên hương vị thơm béo và giòn ngon trong từng hạt.</p><h3>Điểm nổi bật</h3><ul><li><strong>Hạt điều giòn bùi:</strong> Hạt điều có vị béo tự nhiên, kết cấu giòn ngon, dễ ăn.</li><li><strong>Vị phô mai thơm béo:</strong> Lớp gia vị phô mai giúp tăng thêm độ thơm và đậm đà cho hạt điều.</li><li><strong>Đóng hũ 150g tiện lợi:</strong> Dễ bảo quản, dễ mang theo khi đi làm, đi học, du lịch hoặc dùng làm món ăn vặt tại nhà.</li><li><strong>Phù hợp nhiều dịp:</strong> Có thể dùng để ăn vặt, nhâm nhi cùng gia đình, tiếp khách hoặc làm quà tặng.</li></ul>`,
    images: ['/images/product/Cashew2.png', '/images/product/Cashew1.png'],
    categoryIds: [1, 11],
    attributes: [
      { name: 'Khối lượng', value: '150g' },
      { name: 'Hương vị', value: 'Phô mai béo thơm' },
      { name: 'Quy cách', value: 'Hũ nắp nhôm tiện lợi' },
      { name: 'Xuất xứ', value: 'Bình Phước, Việt Nam' }
    ]
  },
  {
    id: 2,
    productId: 'VNX-333',
    sku: 'VNX-CAS-PHOMAI-100',
    name: 'Hạt điều tẩm vị phô mai hũ 100g',
    slug: 'hat-dieu-tam-vi-phomai-hu-100g',
    segment: 'trung-cap',
    price: 110000,
    promotionalPrice: 95000,
    stockQuantity: 150,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 15,
    status: 'ACTIVE',
    shortDescription: 'Hạt điều tẩm vị phô mai hũ 100g nhỏ gọn, giòn rụm béo thơm, hoàn hảo cho những bữa phụ dinh dưỡng.',
    description: `<h1>Hạt Điều Tẩm Vị Phô Mai Hũ 100g – Nhỏ Gọn, Giòn Rụm</h1><p>Hạt điều tẩm vị phô mai hũ 100g là lựa chọn tiện lợi cho người dùng muốn trải nghiệm hương vị thơm béo đặc trưng của phô mai hảo hạng hòa quyện cùng hạt điều Bình Phước tuyển chọn.</p>`,
    images: ['/images/product/Cashew1.png', '/images/product/Cashew2.png'],
    categoryIds: [1, 11],
    attributes: [
      { name: 'Khối lượng', value: '100g' },
      { name: 'Hương vị', value: 'Phô mai béo thơm' },
      { name: 'Quy cách', value: 'Hũ nắp nhôm 100g' }
    ]
  },
  {
    id: 3,
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
    shortDescription: 'Béo bùi, đậm vị trứng muối hảo hạng',
    description: '<p>Hạt điều rang giòn tẩm vị trứng muối hảo hạng, béo ngậy chuẩn vị, đóng hũ nắp nhôm tiện lợi mang theo hoặc làm quà tặng.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Orchard nuts 1.png', '/images/product/Orchard nuts 2.png', '/value1.png'],
    categoryIds: [1, 11],
    attributes: [
      { name: 'Trọng lượng', value: '250g' },
      { name: 'Quy cách', value: 'Hũ nắp nhôm sang trọng' },
      { name: 'Độ rang / Chế biến', value: 'Rang giòn tẩm vị' },
      { name: 'Hạn sử dụng', value: '12 tháng' },
      { name: 'Xuất xứ', value: 'Bình Phước, Việt Nam' }
    ]
  },
  {
    id: 4,
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
    shortDescription: 'Cay thơm, đậm đà đặc trưng phong vị Tứ Xuyên',
    description: '<p>Hạt điều vị Tứ Xuyên cay nồng thơm lừng từ ớt tiêu đặc trưng và hạt điều Bình Phước tuyển chọn.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Orchard nuts 2.png', '/images/product/Orchard nuts 3.png'],
    categoryIds: [1, 12],
    attributes: [
      { name: 'Trọng lượng', value: '250g' },
      { name: 'Quy cách', value: 'Hũ nắp nhôm sang trọng' },
      { name: 'Độ rang / Chế biến', value: 'Cay nồng đặc trưng' },
      { name: 'Xuất xứ', value: 'Bình Phước, Việt Nam' }
    ]
  },
  {
    id: 5,
    productId: 'VNX-003',
    sku: 'VNX-CAS-TOM-250',
    name: 'Hạt điều vị Tomyum',
    slug: 'hat-dieu-vi-tomyum',
    segment: 'cao-cap',
    price: 98000,
    promotionalPrice: 88000,
    stockQuantity: 48,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 10,
    shortDescription: 'Chua cay, thơm vị thảo mộc Tomyum kích thích vị giác',
    description: '<p>Hạt điều tẩm gia vị Tomyum chua chua cay cay hài hòa, giòn rụm kích thích vị giác.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Orchard nuts 3.png', '/images/product/Orchard nuts 1.png'],
    categoryIds: [1, 12],
    attributes: [
      { name: 'Trọng lượng', value: '250g' },
      { name: 'Quy cách', value: 'Hũ nắp nhôm sang trọng' },
      { name: 'Độ rang / Chế biến', value: 'Chua cay thảo mộc' },
      { name: 'Hạn sử dụng', value: '12 tháng' }
    ]
  },
  {
    id: 6,
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
    categoryIds: [1, 13],
    attributes: [
      { name: 'Trọng lượng', value: '500g' },
      { name: 'Quy cách', value: 'Hút chân không túi zip' },
      { name: 'Tiêu chuẩn', value: 'W240 xuất khẩu' },
      { name: 'Xuất xứ', value: 'Bình Phước, Việt Nam' }
    ]
  },
  {
    id: 7,
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
    categoryIds: [50, 51],
    attributes: [
      { name: 'Chất liệu hộp', value: 'Gỗ bọc da ép kim logo' },
      { name: 'Số món', value: '6 hũ quà + 1 hộp trà' }
    ]
  },
  {
    id: 8,
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
    categoryIds: [2, 21],
    attributes: [
      { name: 'Trọng lượng', value: '150g' },
      { name: 'Quy cách', value: 'Lon thiếc hút chân không' },
      { name: 'Độ rang / Lên men', value: 'Lên men tự nhiên' },
      { name: 'Xuất xứ', value: 'Cầu Đất, Lâm Đồng' }
    ]
  },
  {
    id: 9,
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
    categoryIds: [2, 22],
    attributes: [
      { name: 'Trọng lượng', value: '250g' },
      { name: 'Quy cách', value: 'Túi van 1 chiều 250g' },
      { name: 'Độ rang', value: 'Medium Roast' },
      { name: 'Xuất xứ', value: 'Đắk Lắk, Việt Nam' }
    ]
  },
  {
    id: 10,
    productId: 'VNX-008',
    sku: 'VNX-FRU-MNG-200',
    name: 'Xoài sấy dẻo tự nhiên',
    slug: 'xoai-say-deo',
    segment: 'co-ban',
    price: 75000,
    promotionalPrice: 68000,
    stockQuantity: 95,
    stockStatus: 'IN_STOCK',
    lowStockThreshold: 15,
    shortDescription: 'Xoài sấy dẻo tự nhiên, không tẩm đường, vị chua ngọt hài hòa.',
    description: '<p>Xoài cát chín mọng sấy dẻo công nghệ lạnh giữ nguyên màu vàng óng và vị ngọt thanh tự nhiên.</p>',
    status: 'ACTIVE',
    images: ['/images/product/Xoai say deo 1.png'],
    categoryIds: [4, 41],
    attributes: [
      { name: 'Trọng lượng', value: '200g' },
      { name: 'Quy cách', value: 'Hũ nắp nhôm tiện lợi' },
      { name: 'Công nghệ sấy', value: 'Sấy lạnh công nghệ cao' },
      { name: 'Hạn dùng', value: '9 tháng' }
    ]
  },
  {
    id: 11,
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
    categoryIds: [3, 31],
    attributes: [
      { name: 'Trọng lượng', value: '200g' },
      { name: 'Quy cách', value: 'Hộp giấy mỹ thuật cao cấp' },
      { name: 'Thành phần', value: 'Hạt điều, hạnh nhân, mật ong' },
      { name: 'Hạn dùng', value: '6 tháng' }
    ]
  },
  {
    id: 12,
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
    categoryIds: [4, 42],
    attributes: [
      { name: 'Trọng lượng', value: '150g' },
      { name: 'Quy cách', value: 'Hũ nắp nhôm cao cấp' },
      { name: 'Công nghệ sấy', value: 'Sấy thăng hoa (Freeze-Drying)' }
    ]
  }
];

const articlesData = [
  {
    id: 1,
    title: 'VINEX đồng hành cùng Miss World Vietnam Nâng tầm nông sản Việt',
    slug: 'vinex-miss-world-vietnam',
    category: 'Tin tức VINEX',
    author: 'Truyền thông VINEX',
    summary: 'Bộ quà tặng nông sản mang câu chuyện thương hiệu đến sự kiện sắc đẹp quốc tế.',
    content: `<p>VINEX tự hào đồng hành cùng cuộc thi Miss World Vietnam với tư cách là đơn vị tài trợ quà tặng nông sản cao cấp. Mỗi bộ quà tặng là một tác phẩm nghệ thuật gói trọn tinh hoa đất trời Việt Nam.</p><h2>Bộ quà tặng nông sản đặc biệt dành riêng cho Miss World</h2><p>Với tinh thần tôn vinh sắc đẹp và trí tuệ, VINEX mong muốn mang đến những sản phẩm hạt điều và nông sản chất lượng cao, góp phần quảng bá hình ảnh Việt Nam đến bạn bè quốc tế.</p><div style="margin: 2rem 0; text-align: center;"><img src="/images/banner/b_miss_world_2026.png" alt="VINEX đồng hành Miss World Vietnam quà tặng nông sản" style="border-radius: 12px; max-width: 100%; box-shadow: 0 8px 24px rgba(0,0,0,0.1);" /></div><h3>Sứ mệnh kết nối nông sản Việt ra thế giới</h3><p>Hạt điều Bình Phước từ lâu đã khẳng định chất lượng số một toàn cầu nhờ thổ nhưỡng bazan màu mỡ. Thông qua sự kiện này, VINEX khẳng định vị thế thương hiệu nông sản Việt chuẩn quốc tế.</p>`,
    thumbnail: '/images/banner/b_miss_world_2026.png',
    views: 1248,
    status: 'PUBLISHED',
    metaTitle: 'VINEX Đồng Hành Miss World Vietnam | Quà Tặng Nông Sản',
    metaDescription: 'VINEX tài trợ bộ quà tặng nông sản tinh hoa trong khuôn khổ Miss World Vietnam, lan tỏa giá trị hạt điều Bình Phước đến bạn bè năm châu.',
    tags: 'Miss World, VINEX, quà tặng nông sản, hạt điều bình phước',
    publishedAt: '2026-09-17T08:00:00.000Z'
  },
  {
    id: 2,
    title: '5 sai lầm khi chọn quà tặng doanh nghiệp',
    slug: '5-sai-lam-khi-chon-qua-tang-doanh-nghiep',
    category: 'Kinh nghiệm quà tặng',
    author: 'Chuyên gia VINEX',
    summary: 'Bài viết phân tích những rủi ro và sai lầm phổ biến khiến doanh nghiệp lãng phí chi phí khi tự chuẩn bị quà tặng đối tác.',
    content: `<p>Quá trình lên kế hoạch và chuẩn bị quà tặng doanh nghiệp thường mất nhiều thời gian hơn dự kiến. Đằng sau một bộ quà tặng ấn tượng là cả một quy trình thiết kế, sản xuất bao bì và quản lý chất lượng khắt khe.</p><h2>1. Không xác định rõ đối tượng nhận quà</h2><p>Một trong những sai lầm lớn nhất là chọn quà theo sở thích cá nhân thay vì nghiên cứu kỹ đối tượng nhận.</p><h2>2. Bỏ qua chất lượng và chất liệu bao bì</h2><p>Bao bì chiếm 50% cảm xúc của người nhận khi cầm món quà trên tay.</p><h2>3. Đặt hàng quá sát ngày sự kiện</h2><p>Cần ít nhất 3-4 tuần để xử lý thiết kế, làm mockup và đóng gói hàng loạt.</p>`,
    thumbnail: '/images/news/article_gift_box.jpg',
    views: 386,
    status: 'PUBLISHED',
    metaTitle: '5 Sai Lầm Khi Chọn Quà Tặng Doanh Nghiệp | VINEX',
    metaDescription: 'Khám phá 5 sai lầm phổ biến khi làm quà tặng doanh nghiệp và bí quyết lựa chọn set quà nông sản cao cấp.',
    tags: 'quà tặng doanh nghiệp, quà tết đối tác, hộp quà cao cấp, kinh nghiệm quà tặng',
    publishedAt: '2026-09-11T08:00:00.000Z'
  },
  {
    id: 3,
    title: 'Bảo quản hạt điều trắng đúng cách',
    slug: 'bi-quyet-bao-quan-hat-dieu-trang',
    category: 'Kiến thức nông sản',
    author: 'Kỹ sư Nông nghiệp VINEX',
    summary: 'Hướng dẫn chi tiết cách bảo quản hạt điều trắng không bị ỉu, không hôi dầu, giữ nguyên hàm lượng dinh dưỡng.',
    content: `<p>Nhân điều trắng (White Wholes - WW) luôn được săn đón bởi vị ngọt bùi và độ giòn đặc trưng. Tuy nhiên, nếu không biết cách bảo quản đúng chuẩn, nhân điều rất dễ bị ỉu hoặc hôi dầu.</p><h2>1. Kẻ thù số 1: Độ ẩm và không khí</h2><p>Hạt điều hút ẩm rất nhanh. Luôn đựng hạt điều trong hũ kín có nắp nhôm hoặc túi zip nhôm hút chân không.</p><h2>2. Tránh ánh nắng trực tiếp</h2><p>Bảo quản hạt điều ở nơi khô ráo, nhiệt độ dưới 25 độ C.</p>`,
    thumbnail: '/images/news/article_cashew_bowl.jpg',
    views: 524,
    status: 'PUBLISHED',
    metaTitle: 'Bí Quyết Bảo Quản Hạt Điều Giữ Trọn Độ Giòn | VINEX',
    metaDescription: 'Hướng dẫn cách bảo quản hạt điều trắng tại nhà đúng chuẩn: không bị ỉu, không hôi dầu, giữ nguyên dinh dưỡng.',
    tags: 'bảo quản hạt điều, hạt điều trắng, kiến thức nông sản, hạt dinh dưỡng',
    publishedAt: '2026-09-17T08:00:00.000Z'
  },
  {
    id: 4,
    title: 'Từ hạt điều thô đến nhân điều trắng chuẩn quốc tế',
    slug: 'quy-trinh-san-xuat-hat-dieu-xuat-khau',
    category: 'Quy trình sản xuất',
    author: 'Giám đốc Quản lý Chất lượng',
    summary: 'Khám phá hành trình đầy tỉ mỉ từ những hạt điều thô ngoài vườn cây đến nhân điều trắng tinh khiết đạt chuẩn quốc tế.',
    content: `<p>Để bóc tách được một hạt điều hoàn chỉnh, không sứt mẻ và giữ nguyên lớp nhân trắng muốt là sự kết hợp giữa công nghệ hiện đại và sự khéo léo của người thợ.</p><h2>Hành trình 8 bước sản xuất khép kín</h2><p>Nhà máy VINEX tuân thủ 8 bước nghiêm ngặt: Phơi khô, hấp hạt, cắt vỏ, sấy chín, bóc vỏ lụa, phân loại kích cỡ hạt W240/W320, dò kim loại và đóng gói vô trùng.</p>`,
    thumbnail: '/images/news/article_raw_cashew.jpg',
    views: 297,
    status: 'PUBLISHED',
    metaTitle: 'Từ Hạt Điều Thô Đến Nhân Điều Trắng Chuẩn Quốc Tế | VINEX',
    metaDescription: 'Tìm hiểu quy trình sản xuất hạt điều xuất khẩu 8 bước khép kín tại nhà máy VINEX Bình Phước đạt chứng nhận HACCP & ISO 22000.',
    tags: 'sản xuất hạt điều, tiêu chuẩn xuất khẩu, HACCP, ISO 22000, nông sản sạch',
    publishedAt: '2026-09-17T08:00:00.000Z'
  }
];

const globalSettingsData = {
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

const leadsData = [
  {
    id: 1,
    customerName: 'Nguyễn Văn Nam (Tập đoàn FPT)',
    phone: '0901234567',
    email: 'nam.nguyen@fpt.com.vn',
    location: 'Hà Nội',
    source: 'Website Form Báo Giá',
    projectType: 'Hộp quà Tết doanh nghiệp',
    budget: '150 - 200 triệu',
    notes: 'Khắc logo công ty lên nắp hộp gỗ, in thiệp chúc mừng, 300 suất quà VIP.',
    status: 'PROCESSING'
  },
  {
    id: 2,
    customerName: 'Trần Thị Thu (Công ty Dược Hậu Giang)',
    phone: '0987654321',
    email: 'thu.tran@dhgpharma.com.vn',
    location: 'TP.HCM',
    source: 'Hotline / Zalo',
    projectType: 'Mua sỉ hạt điều & Nông sản',
    budget: '50 - 80 triệu',
    notes: 'Nhập hạt điều rang muối và hạt điều vị tỏi ớt hũ 250g.',
    status: 'PENDING'
  }
];

const customersData = [
  {
    id: 1,
    fullName: 'Nguyễn Văn Nam',
    phoneNumber: '0901234567',
    email: 'nam.nguyen@fpt.com.vn',
    address: 'Cầu Giấy, Hà Nội',
    totalOrders: 4
  },
  {
    id: 2,
    fullName: 'Trần Thị Thu',
    phoneNumber: '0987654321',
    email: 'thu.tran@dhgpharma.com.vn',
    address: 'Quận 1, TP.HCM',
    totalOrders: 2
  }
];

async function main() {
  console.log('--- VINEX DATABASE SEED STARTED ---');

  // ─── PRODUCTION DATA GUARD ────────────────────────────────────────────────
  // If we are connected to a REMOTE PostgreSQL (not localhost) and the DB already
  // has records, refuse to seed UNLESS the caller explicitly sets FORCE_SEED=true.
  // This is the last line of defense against accidental data wipes in production.
  const databaseUrl = process.env.DATABASE_URL || '';
  const isRemoteDb = databaseUrl && !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1');
  const forceSeed = process.env.FORCE_SEED === 'true';

  if (isRemoteDb && !forceSeed) {
    try {
      await prisma.$connect();
      const [productCount, articleCount, categoryCount] = await Promise.all([
        prisma.product.count(),
        prisma.article.count(),
        prisma.category.count(),
      ]);

      if (productCount > 0 || articleCount > 0 || categoryCount > 0) {
        console.log(`\n⛔  SEED ABORTED — Remote DB already has data:`);
        console.log(`   Products: ${productCount}, Articles: ${articleCount}, Categories: ${categoryCount}`);
        console.log(`   To force a full re-seed, run: FORCE_SEED=true pnpm run seed`);
        console.log(`   WARNING: Force re-seed uses upsert and does NOT delete user records.\n`);
        await prisma.$disconnect();
        process.exit(0);
      }

      console.log('[Seed] Remote DB is empty — proceeding with initial seed...');
    } catch (guardErr: any) {
      console.warn('[Seed] Could not run guard check:', guardErr?.message, '— proceeding...');
    }
  }

  // Try DB seeding if DATABASE_URL is available
  try {
    console.log('Checking database connection...');
    await prisma.$connect();
    console.log('Connected to PostgreSQL successfully.');

    // ─── SAFE UPSERT PATTERN ──────────────────────────────────────────────────
    // We use upsert (create-or-update) instead of deleteMany+create.
    // This means running this seed again NEVER deletes user-created records.
    // Only the initial seed data rows are created/updated; user additions are untouched.

    console.log('Upserting Categories (preserving existing)...');
    // Seed Parent Categories first
    const parentCats = categoriesData.filter(c => c.parentId === null);
    for (const c of parentCats) {
      await prisma.category.upsert({
        where: { id: c.id },
        update: {}, // NEVER overwrite existing category if already present!
        create: {
          id: c.id,
          name: c.name,
          slug: c.slug,
          type: c.type,
          status: c.status,
          description: c.description,
          attributes: c.attributes ? JSON.stringify(c.attributes) : undefined
        }
      });
    }

    // Seed Child Categories
    const childCats = categoriesData.filter(c => c.parentId !== null);
    for (const c of childCats) {
      await prisma.category.upsert({
        where: { id: c.id },
        update: {}, // NEVER overwrite existing category if already present!
        create: {
          id: c.id,
          parentId: c.parentId,
          name: c.name,
          slug: c.slug,
          type: c.type,
          status: c.status,
          description: c.description,
          attributes: c.attributes ? JSON.stringify(c.attributes) : undefined
        }
      });
    }

    console.log('Upserting Products (preserving existing)...');
    for (const p of productsData) {
      const { categoryIds, ...rest } = p;
      await prisma.product.upsert({
        where: { id: rest.id },
        update: {}, // NEVER overwrite existing user product edits!
        create: {
          id: rest.id,
          productId: rest.productId,
          sku: rest.sku,
          name: rest.name,
          slug: rest.slug,
          segment: rest.segment,
          price: rest.price,
          promotionalPrice: rest.promotionalPrice,
          stockQuantity: rest.stockQuantity,
          stockStatus: rest.stockStatus,
          lowStockThreshold: rest.lowStockThreshold,
          shortDescription: rest.shortDescription,
          description: rest.description,
          status: rest.status,
          images: rest.images,
          attributes: rest.attributes,
          categories: {
            connect: categoryIds.map(cid => ({ id: cid }))
          }
        }
      });
    }

    console.log('Upserting Articles (preserving existing)...');
    for (const a of articlesData) {
      await prisma.article.upsert({
        where: { id: a.id },
        update: {}, // NEVER overwrite existing user article edits!
        create: {
          id: a.id,
          title: a.title,
          slug: a.slug,
          category: a.category,
          author: a.author,
          summary: a.summary,
          content: a.content,
          thumbnail: a.thumbnail,
          views: a.views,
          status: a.status,
          tags: a.tags,
          metaTitle: a.metaTitle,
          metaDescription: a.metaDescription,
          publishedAt: a.publishedAt
        }
      });
    }

    console.log('Upserting Settings (preserving existing)...');
    await prisma.setting.upsert({
      where: { key: 'GLOBAL_SETTINGS' },
      update: {}, // NEVER overwrite existing settings!
      create: {
        key: 'GLOBAL_SETTINGS',
        value: JSON.stringify(globalSettingsData)
      }
    });

    console.log('Upserting Leads...');
    for (const l of leadsData) {
      await prisma.lead.upsert({
        where: { id: l.id },
        update: {},
        create: l
      });
    }

    console.log('Upserting Customers...');
    for (const c of customersData) {
      await prisma.customer.upsert({
        where: { id: c.id },
        update: {},
        create: c
      });
    }

    // ─── SYNCHRONIZE POSTGRESQL SERIAL SEQUENCES ─────────────────────────────
    // Vital: After seeding with explicit IDs, Postgres sequences must be advanced
    // to max(id) so subsequent auto-increment inserts will not collide or fail!
    console.log('Synchronizing PostgreSQL serial sequences...');
    const tables = ['Category', 'Product', 'Article', 'Lead', 'Customer', 'Setting', 'Media', 'SeoPage'];
    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(
          `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), coalesce(max(id), 1)) FROM "${table}";`
        );
      } catch (seqErr: any) {
        // Sequence may not exist or not PostgreSQL, ignore safely
      }
    }
    console.log('PostgreSQL sequences synchronized successfully! ✅');

    console.log('PostgreSQL database seeded safely (no user edits overwritten)!');
  } catch (dbErr) {
    console.warn('Note: Could not complete PostgreSQL seed directly (DB may be offline):', dbErr);
  } finally {
    await prisma.$disconnect();
  }

  console.log('--- VINEX DATABASE SEED FINISHED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
