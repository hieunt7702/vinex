# CẨM NANG CẤU HÌNH BIẾN MÔI TRƯỜNG & TRIỂN KHAI VINEX LÊN RAILWAY

**Tên miền chính thức:** `https://vinexgroup.vn`  
**Tên miền phụ API:** `https://api.vinexgroup.vn`  
**DNS & Bảo mật CDN:** Cloudflare  
**Nền tảng Cloud:** Railway (Next.js 16 Full-Stack Engine)  
**Cập nhật lần cuối:** 2026

---

## I. TỔNG HỢP DANH SÁCH BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

Khi tạo Service trên **Railway**, bạn vào tab **Variables** ➔ chọn **RAW Editor** và dán toàn bộ cấu hình bên dưới vào:

```env
# ==============================================================================
# 1. CẤU HÌNH HỆ THỐNG CỐT LÕI (CORE PRODUCTION)
# ==============================================================================
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1

# ==============================================================================
# 2. ĐỊNH DANH DOMAIN & ĐƯỜNG DẪN API (NETWORKING & SEO)
# ==============================================================================
NEXT_PUBLIC_SITE_URL=https://vinexgroup.vn
# Có thể dùng đường dẫn tương đối /api/v1 hoặc subdomain chính thức:
NEXT_PUBLIC_API_URL=https://api.vinexgroup.vn/v1

# ==============================================================================
# 3. TỐI ƯU HÓA QUÁ TRÌNH BUILD (NIXPACKS & PNPM ENGINE)
# ==============================================================================
NIXPACKS_PNPM_VERSION=9.15.9

# ==============================================================================
# 4. KẾT NỐI DATABASE POSTGRESQL (NẾU KÍCH HOẠT DATABASE TRÊN RAILWAY)
# ==============================================================================
DATABASE_URL=${{Postgres.DATABASE_URL}}
POSTGRES_USER=${{Postgres.POSTGRES_USER}}
POSTGRES_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
POSTGRES_DB=${{Postgres.POSTGRES_DB}}
POSTGRES_PORT=${{Postgres.POSTGRES_PORT}}

# ==============================================================================
# 5. BẢO MẬT & TÀI KHOẢN QUẢN TRỊ (ADMIN SECURITY)
# ==============================================================================
JWT_SECRET=vinex_production_secret_key_2026_super_secure
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin

# ==============================================================================
# 6. MARKETING & PHÂN TÍCH TRUY CẬP (ANALYTICS & TRACKING - TÙY CHỌN)
# ==============================================================================
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_FB_PIXEL=
```

---

## II. HƯỚNG DẪN KẾT NỐI CLOUDFLARE CHO TÊN MIỀN `vinexgroup.vn`

Cloudflare mang lại cho bạn:
- Tự động nén và tăng tốc website (CDN toàn cầu, truy cập siêu nhanh).
- Chống tấn công DDoS và ẩn IP gốc của máy chủ.
- Hỗ trợ **CNAME Flattening** (cho phép trỏ cả tên miền gốc `@` dạng CNAME về Railway cực kỳ mượt mà).

### Bước 1: Thêm Website vào Cloudflare
1. Đăng ký/Đăng nhập tài khoản tại **[dash.cloudflare.com](https://dash.cloudflare.com)**.
2. Bấm **+ Add a Domain** (hoặc **Add a Site**).
3. Nhập tên miền: `vinexgroup.vn` ➔ Chọn gói **Free** (Miễn phí) ➔ Bấm **Continue**.
4. Cloudflare sẽ quét các bản ghi DNS hiện có. Bấm **Continue**.
5. Cloudflare cung cấp **2 địa chỉ Nameserver** (ví dụ: `amy.ns.cloudflare.com` và `todd.ns.cloudflare.com`).

### Bước 2: Đổi Nameserver tại Nhà đăng ký tên miền (Mắt Bão, P.A, Tenten...)
1. Đăng nhập vào trang quản lý nơi bạn mua tên miền `vinexgroup.vn`.
2. Tìm mục **Quản lý Nameserver / Cặp máy chủ tên miền**.
3. Chọn chế độ **Sử dụng Nameserver tùy chỉnh (Custom Nameservers)**.
4. Xóa các nameserver cũ và dán 2 Nameserver của Cloudflare vào.
5. Bấm **Lưu / Cập nhật**. *(Đợi 5 - 30 phút để Cloudflare kích hoạt tên miền thành công)*.

### Bước 3: Cấu hình Bắt buộc: Chế độ SSL/TLS trên Cloudflare
> [!IMPORTANT]
> **CỰC KỲ QUAN TRỌNG ĐỂ TRÁNH LỖI VÒNG LẶP CHUYỂN HƯỚNG (ERR_TOO_MANY_REDIRECTS):**
> 1. Trong Dashboard Cloudflare của `vinexgroup.vn`, vào menu bên trái chọn **SSL/TLS**.
> 2. Tại mục **Overview**, chọn chế độ mã hóa: **Full (strict)** hoặc **Full**.
> 3. **TUYỆT ĐỐI KHÔNG CHỌN** chế độ `Flexible` (vì Railway bắt buộc chạy HTTPS ở backend, nếu để Flexible sẽ gây xung đột chuyển hướng vô tận).
> 4. Vào mục **Edge Certificates** (trong menu SSL/TLS) ➔ Bật nút: **Always Use HTTPS**.

---

## III. CẤU HÌNH TÊN MIỀN PHỤ API (`api.vinexgroup.vn`)

Dự án đã được tích hợp sẵn bộ định tuyến thông minh trong `src/proxy.ts` và bộ header CORS chuẩn trong `next.config.ts`.
Bạn **không cần tạo thêm server mới**, chỉ cần cấu hình trên cùng một Service Next.js trên Railway!

### Các Endpoint của `api.vinexgroup.vn`:
- `https://api.vinexgroup.vn/` ➔ Trả về JSON trạng thái hệ thống: `{"name":"VINEX High-End Agriculture API","status":"online",...}`.
- `https://api.vinexgroup.vn/v1/products` (hoặc `/api/v1/products`) ➔ Danh sách sản phẩm (đã sắp xếp mới nhất lên đầu).
- `https://api.vinexgroup.vn/v1/articles` ➔ Danh sách tin tức / bài viết truyền thông.
- `https://api.vinexgroup.vn/v1/categories` ➔ Cây danh mục nông sản & quà tặng.
- `https://api.vinexgroup.vn/v1/leads` ➔ Tiếp nhận báo giá và thông tin khách hàng B2B.

---

## IV. BẢNG CẤU HÌNH DNS TRÊN CLOUDFLARE CHO CẢ WEBSITE VÀ API

Trong Cloudflare, vào menu **DNS** ➔ **Records** ➔ Bấm **Add record** và thêm các bản ghi sau:

| Loại (Type) | Tên (Name) | Mục tiêu / Giá trị (Target / Content) | Proxy status | Mục đích |
|:---:|:---:|:---:|:---:|---|
| **CNAME** | `@` | Domain do Railway cấp (VD: `xxxx.up.railway.app`) | **Proxied** (Đám mây cam) | Trang chủ `https://vinexgroup.vn` |
| **CNAME** | `www` | Domain do Railway cấp (VD: `xxxx.up.railway.app`) | **Proxied** (Đám mây cam) | Tên miền phụ `https://www.vinexgroup.vn` |
| **CNAME** | `api` | Domain do Railway cấp (VD: `xxxx.up.railway.app`) | **Proxied** (Đám mây cam) | **Tên miền phụ API `https://api.vinexgroup.vn`** |

> [!TIP]
> **Lưu ý trong lần đầu Railway xác thực:**
> Khi mới bấm **Add Custom Domain** trên Railway:
> - Nếu Railway báo *"DNS verification pending"*, bạn có thể chuyển tạm thời cột Proxy status của bản ghi đó trên Cloudflare sang **DNS only** (Đám mây xám) trong 2 phút để Railway verify xong chứng chỉ SSL.
> - Sau khi Railway hiện dấu tích xanh **Active**, bạn bấm bật lại thành **Proxied** (Đám mây cam) để tận hưởng toàn bộ tính năng bảo vệ và CDN của Cloudflare!

---

## V. CÁC BƯỚC THAO TÁC TRÊN RAILWAY

1. **Đẩy code mới nhất lên GitHub:**
   ```bash
   git push origin master
   ```

2. **Thêm Custom Domains trên Railway:**
   - Vào Service `vinex` trên Railway ➔ chọn tab **Settings**.
   - Kéo xuống mục **Networking** ➔ **Custom Domains** ➔ Bấm **+ Custom Domain**.
   - Thêm lần lượt 3 domain:
     1. `vinexgroup.vn`
     2. `www.vinexgroup.vn`
     3. `api.vinexgroup.vn`
   - Mỗi domain sẽ được Railway cấp endpoint riêng (hoặc chung dạng `xxxx.up.railway.app`), hãy copy giá trị này dán vào Cloudflare DNS như bảng ở **Mục IV**.

---

## VI. KIỂM TRA & NGHIỆM THU HỆ THỐNG

Sau khi Cloudflare cập nhật:
1. 🌐 **Website chính:** Truy cập `https://vinexgroup.vn` (có biểu tượng ổ khóa SSL xanh).
2. 🚀 **Hệ thống API riêng:**
   - Kiểm tra status: `https://api.vinexgroup.vn/`
   - Lấy sản phẩm: `https://api.vinexgroup.vn/v1/products`
   - Lấy bài viết: `https://api.vinexgroup.vn/v1/articles`
3. ⚙️ **Trang quản trị CMS:** `https://vinexgroup.vn/admin` *(Đăng nhập `admin` / `admin`)*.