/**
 * Helper chuẩn hóa chuỗi tiếng Việt thành URL Slug thân thiện SEO
 * VD: "5 Lợi ích sức khỏe của hạt điều" -> "5-loi-ich-suc-khoe-cua-hat-dieu"
 */
export const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ các dấu phụ tiếng Việt
    .replace(/[đĐ]/g, 'd')           // Chuyển đ -> d
    .replace(/([^0-9a-z-\s])/g, '')   // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, '-')            // Thay khoảng trắng bằng gạch ngang
    .replace(/-+/g, '-')             // Rút gọn các gạch ngang liên tiếp
    .replace(/^-+/, '')              // Xóa gạch ngang đầu
    .replace(/-+$/, '');             // Xóa gạch ngang cuối
};
