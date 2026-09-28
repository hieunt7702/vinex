import { 
  ShoppingBag, Building2, Gift, Store, HelpCircle, Handshake, MessageSquare 
} from 'lucide-react';

export type InquiryPurpose = 
  | 'BUY_PRODUCT'
  | 'CORPORATE_GIFT'
  | 'PERSONAL_GIFT'
  | 'WHOLESALE'
  | 'SUPPORT'
  | 'PARTNERSHIP'
  | 'OTHER';

export interface PurposeDefinition {
  id: InquiryPurpose;
  title: string;
  shortDesc: string;
  icon: any;
  color: string;
  badgeClass: string;
  defaultPriority: 'NORMAL' | 'HIGH' | 'URGENT';
}

export const PURPOSE_DEFINITIONS: PurposeDefinition[] = [
  {
    id: 'BUY_PRODUCT',
    title: 'Mua sản phẩm',
    shortDesc: 'Đặt mua hạt điều, trà, cà phê & nông sản cao cấp',
    icon: ShoppingBag,
    color: 'text-emerald-700 dark:text-emerald-300',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    defaultPriority: 'NORMAL'
  },
  {
    id: 'CORPORATE_GIFT',
    title: 'Quà tặng doanh nghiệp',
    shortDesc: 'Set quà Tết, tri ân đối tác & sự kiện kèm in ấn logo',
    icon: Building2,
    color: 'text-amber-800 dark:text-amber-300',
    badgeClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    defaultPriority: 'HIGH'
  },
  {
    id: 'PERSONAL_GIFT',
    title: 'Quà tặng cá nhân',
    shortDesc: 'Hộp quà biếu người thân, gia đình & đối tác cá nhân',
    icon: Gift,
    color: 'text-rose-700 dark:text-rose-300',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    defaultPriority: 'NORMAL'
  },
  {
    id: 'WHOLESALE',
    title: 'Mua sỉ / Đại lý / Phân phối',
    shortDesc: 'Chính sách chiết khấu phân phối, đại lý & cung ứng lớn',
    icon: Store,
    color: 'text-blue-700 dark:text-blue-300',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    defaultPriority: 'HIGH'
  },
  {
    id: 'SUPPORT',
    title: 'Hỗ trợ đơn hàng / Sản phẩm',
    shortDesc: 'Xử lý giao nhận, đổi trả, bảo hành & giải đáp thắc mắc',
    icon: HelpCircle,
    color: 'text-purple-700 dark:text-purple-300',
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    defaultPriority: 'HIGH'
  },
  {
    id: 'PARTNERSHIP',
    title: 'Hợp tác kinh doanh',
    shortDesc: 'Cung ứng vùng trồng, OEM/ODM gia công & liên kết',
    icon: Handshake,
    color: 'text-teal-700 dark:text-teal-300',
    badgeClass: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    defaultPriority: 'NORMAL'
  },
  {
    id: 'OTHER',
    title: 'Liên hệ khác',
    shortDesc: 'Để lại lời nhắn và yêu cầu trao đổi trực tiếp',
    icon: MessageSquare,
    color: 'text-gray-700 dark:text-gray-300',
    badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    defaultPriority: 'NORMAL'
  }
];

export const PURPOSE_MAP = Object.fromEntries(
  PURPOSE_DEFINITIONS.map((p) => [p.id, p])
);

export const PURPOSE_CONFIG: Record<string, { label: string; icon: any; color: string; badgeClass: string }> = Object.fromEntries(
  PURPOSE_DEFINITIONS.map((p) => [
    p.id,
    { label: p.title, icon: p.icon, color: p.color, badgeClass: p.badgeClass }
  ])
);

// Dịp tặng quà
export const OCCASION_OPTIONS = [
  'Quà Tết doanh nghiệp',
  'Tri ân đối tác & Khách hàng VIP',
  'Sự kiện, Hội nghị & Kỷ niệm thành lập',
  'Quà tặng cán bộ nhân viên',
  'Quà tặng cá nhân & Gia đình',
  'Sinh nhật / Kỷ niệm',
  'Dịp khác'
];

// Số lượng dự kiến
export const QUANTITY_OPTIONS = [
  '< 50 set / hộp',
  '50 - 100 set / hộp',
  '100 - 500 set / hộp',
  '500 - 1.000 set / hộp',
  '1.000 - 5.000 set / hộp',
  '> 5.000 set / hộp (Đơn hàng lớn)',
  'Chưa xác định, cần tư vấn'
];

// Ngân sách mỗi phần
export const BUDGET_PER_ITEM_OPTIONS = [
  '< 300.000đ / set',
  '300.000đ - 500.000đ / set',
  '500.000đ - 1.000.000đ / set',
  '1.000.000đ - 2.000.000đ / set',
  '> 2.000.000đ / set (Cao cấp VIP)',
  'Thương lượng theo số lượng',
  'Chưa xác định, cần tư vấn'
];

// Tổng ngân sách
export const BUDGET_TOTAL_OPTIONS = [
  '< 20 triệu VNĐ',
  '20 - 50 triệu VNĐ',
  '50 - 100 triệu VNĐ',
  '100 - 300 triệu VNĐ',
  '> 300 triệu VNĐ',
  'Chưa xác định, cần tư vấn'
];

// Tùy chỉnh thương hiệu
export const BRANDING_OPTIONS = [
  'In / Ép kim logo doanh nghiệp',
  'Ruy băng thương hiệu riêng',
  'Thiệp chúc mừng / Thư ngỏ riêng',
  'Thiết kế bao bì hộp quà độc quyền',
  'Túi quà giấy riêng',
  'Khác (trao đổi trực tiếp)'
];

// Phương án giao hàng
export const DELIVERY_PLAN_OPTIONS = [
  'Một địa điểm tập trung',
  'Nhiều địa điểm (Giao tận tay người nhận)',
  'Chưa rõ / Cần tư vấn'
];

// Cần hóa đơn VAT
export const INVOICE_OPTIONS = [
  'Có (Cần xuất hóa đơn VAT)',
  'Không cần',
  'Chưa xác định'
];

// Loại hình kinh doanh (Mua sỉ / Đại lý)
export const BUSINESS_TYPE_OPTIONS = [
  'Cửa hàng / Chuỗi bán lẻ thực phẩm',
  'Nhà phân phối cấp tỉnh / Khu vực',
  'Kênh Thương mại điện tử / Bán lẻ Online',
  'Doanh nghiệp xuất khẩu nông sản',
  'Khác'
];

// Nhóm vấn đề (Hỗ trợ đơn hàng)
export const ISSUE_CATEGORY_OPTIONS = [
  'Giao hàng chậm / Sai địa chỉ',
  'Thiếu hàng / Sai chủng loại sản phẩm',
  'Chất lượng sản phẩm / Bao bì móp vỡ',
  'Đổi trả hàng / Hoàn tiền',
  'Hóa đơn & Chứng từ thanh toán',
  'Vấn đề khác'
];

// Hình thức hợp tác
export const PARTNERSHIP_TYPE_OPTIONS = [
  'Phân phối & Bán chéo sản phẩm',
  'Cung ứng nguyên liệu nông sản & Bao bì cao cấp',
  'Gia công OEM / ODM thương hiệu riêng',
  'Truyền thông, Sự kiện & Tài trợ',
  'Khác'
];

// Đơn vị tính
export const UNIT_OPTIONS = [
  { value: 'hộp', label: 'Hộp' },
  { value: 'gói', label: 'Gói' },
  { value: 'hũ', label: 'Hũ' },
  { value: 'kg', label: 'Kg' },
  { value: 'thùng', label: 'Thùng' },
  { value: 'set', label: 'Set' }
];

// Nhóm sản phẩm quan tâm chung
export const PRODUCT_GROUPS = [
  'Hộp quà Tết & Set quà doanh nghiệp',
  'Hạt điều tẩm vị & Hạt dinh dưỡng',
  'Trà Ô Long, Cà phê & Thảo mộc',
  'Bánh ngói, Kẹo & Granola dinh dưỡng',
  'Trái cây sấy & Nông sản sấy dẻo',
  'Gia công sản phẩm theo yêu cầu (OEM/ODM)',
  'Nông sản xuất khẩu & Tiêu chuẩn cao'
];

// Trạng thái xử lý (Status)
export const STATUS_CONFIG: Record<string, { label: string; color: string; badgeBg: string }> = {
  'NEW': { label: 'Mới tiếp nhận', color: 'text-blue-700 dark:text-blue-300', badgeBg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800' },
  'ASSIGNED': { label: 'Đã phân công', color: 'text-indigo-700 dark:text-indigo-300', badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800' },
  'PROCESSING': { label: 'Đang xử lý / Tư vấn', color: 'text-amber-700 dark:text-amber-300', badgeBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800' },
  'WAITING_CUSTOMER': { label: 'Chờ khách phản hồi', color: 'text-cyan-700 dark:text-cyan-300', badgeBg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800' },
  'WAITING_INTERNAL': { label: 'Chờ xử lý nội bộ', color: 'text-purple-700 dark:text-purple-300', badgeBg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800' },
  'CLOSED': { label: 'Đã đóng', color: 'text-gray-700 dark:text-gray-300', badgeBg: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700' },
};

// Kết quả khi đóng (Closing Results)
export const CLOSING_RESULTS: Record<string, { label: string; isWon?: boolean }> = {
  'RESOLVED': { label: 'Đã giải quyết, tư vấn xong', isWon: true },
  'ORDER_CREATED': { label: 'Đã chuyển thành đơn hàng', isWon: true },
  'NO_NEED': { label: 'Khách chưa có nhu cầu', isWon: false },
  'DISAGREED': { label: 'Không đạt thỏa thuận (giá/sản phẩm/thời gian)', isWon: false },
  'UNREACHABLE': { label: 'Không liên hệ được', isWon: false },
  'CANCELLED': { label: 'Khách chủ động hủy yêu cầu', isWon: false },
  'DUPLICATE': { label: 'Trùng yêu cầu khác', isWon: false },
  'SPAM': { label: 'Spam / Không hợp lệ', isWon: false },
};

// Mức ưu tiên (Priority)
export const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  'URGENT': { label: 'Khẩn', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300' },
  'HIGH': { label: 'Cao', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 border-orange-300' },
  'NORMAL': { label: 'Bình thường', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200' },
};

// Nhân viên phụ trách (Assignees)
export const ASSIGNEES = [
  'Nguyễn Thảo (Trưởng nhóm B2B)',
  'Trần Hoàng (Chuyên viên Nông sản)',
  'Lê Mai (Chuyên viên Quà tặng Doanh nghiệp)',
  'Phạm Tuấn (Chuyên viên Đại lý & Phân phối)',
  'Đỗ Trang (Bộ phận CSKH & Hỗ trợ)',
  'Hoàng Nam (Bộ phận Kế toán & Báo giá)'
];
