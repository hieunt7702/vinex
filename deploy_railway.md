# CẨM NANG CẤU HÌNH BIẾN MÔI TRƯỜNG & TRIỂN KHAI VINEX LÊN RAILWAY

**Tên miền chính thức:** `https://vinexgroup.vn`  
**Nền tảng:** Railway (Next.js 16 Full-Stack Engine)  
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
NEXT_PUBLIC_API_URL=/api/v1

# ==============================================================================
# 3. TỐI ƯU HÓA QUÁ TRÌNH BUILD (NIXPACKS & PNPM ENGINE)
# ==============================================================================
NIXPACKS_PNPM_VERSION=9.15.9

# ==============================================================================
# 4. KẾT NỐI DATABASE POSTGRESQL (NẾU KÍCH HOẠT DATABASE TRÊN RAILWAY)
# ==============================================================================
# Nếu bạn tạo Database PostgreSQL trên Railway, liên kết biến bằng cú pháp sau:
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

## II. BẢNG GIẢI THÍCH CHI TIẾT TỪNG BIẾN

| Tên biến (Key) | Giá trị khuyến nghị | Bắt buộc | Mục đích & Chi tiết kỹ thuật |
|---|---|:---:|---|
| `NODE_ENV` | `production` | **Bắt buộc** | Kích hoạt chế độ Production của Next.js (bật cache, minify code, tắt debug). |
| `PORT` | `3000` | **Bắt buộc** | Cổng lắng nghe của Node.js server. Railway sẽ tự động map port này ra Internet. |
| `HOSTNAME` | `0.0.0.0` | **Bắt buộc** | Đảm bảo Next.js lắng nghe trên toàn bộ network interface của container Docker Railway. |
| `NEXT_PUBLIC_SITE_URL` | `https://vinexgroup.vn` | **Bắt buộc** | Định danh URL gốc website cho SEO, Open Graph (chia sẻ Facebook/Zalo), Canonical link và Sitemap. |
| `NEXT_PUBLIC_API_URL` | `/api/v1` | **Bắt buộc** | Đường dẫn API tương đối. Giữ nguyên `/api/v1` để trình duyệt gọi trực tiếp cùng domain, **không bao giờ bị lỗi CORS**. |
| `NIXPACKS_PNPM_VERSION` | `9.15.9` | Khuyên dùng | Chỉ định chính xác phiên bản `pnpm` của dự án để Railway cài đặt đồng bộ với `pnpm-lock.yaml`. |
| `NEXT_TELEMETRY_DISABLED`| `1` | Khuyên dùng | Tắt việc gửi dữ liệu thống kê ngầm về Vercel, giúp tăng tốc độ build thêm 15-20%. |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Tùy chọn | Chuỗi kết nối đến PostgreSQL. Nếu bạn thêm Database trên Railway, biến này tự động đồng bộ. |
| `JWT_SECRET` | Chuỗi ký tự ngẫu nhiên | Khuyên dùng | Khóa bí mật dùng để ký và xác thực token JWT khi đăng nhập trang Admin. |
| `ADMIN_USERNAME` | `admin` | Tùy chọn | Tên đăng nhập mặc định vào trang quản trị (`/admin`). |
| `ADMIN_PASSWORD` | `admin` | Tùy chọn | Mật khẩu đăng nhập mặc định vào trang quản trị (`/admin`). |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Tùy chọn | Mã đo lường Google Analytics 4 (thay bằng mã thực tế khi website chạy). |

---

## III. QUY TRÌNH TRIỂN KHAI TỪNG BƯỚC LÊN RAILWAY

### Bước 1: Đẩy toàn bộ code mới nhất lên GitHub
Mở Terminal tại thư mục dự án và chạy:
```bash
git push origin master
```
*(Nếu trình duyệt bật cửa sổ yêu cầu đăng nhập GitHub, xác thực với tài khoản `hieunt7702`)*.

---

### Bước 2: Tạo Project trên Railway & Kết nối Repo
1. Truy cập **[railway.com](https://railway.com)** ➔ Đăng nhập bằng tài khoản GitHub `hieunt7702`.
2. Bấm nút **+ New Project** (màu tím).
3. Chọn **Deploy from GitHub repo**.
4. Chọn repository **`hieunt7702/vinex`**.
5. Bấm **Deploy Now**.
   - Railway sẽ tự động nhận diện file `railway.json` và cấu hình build `pnpm run build` đã chuẩn bị sẵn.

---

### Bước 3: Dán biến môi trường vào Service
1. Nhấp vào ô Service `vinex` vừa tạo trên màn hình Canvas.
2. Chuyển sang tab **Variables** ở menu phía trên.
3. Nhấp vào nút **RAW Editor** (biểu tượng code bên góc phải).
4. Sao chép toàn bộ nội dung trong mục **I** ở trên và dán vào.
5. Bấm **Save**. Railway sẽ tự động trigger một lượt Build mới áp dụng toàn bộ các biến này.

---

### Bước 4: (Tùy chọn) Thêm Database PostgreSQL trên Railway
1. Tại màn hình dự án, bấm nút **+ New** ở góc trên cùng bên phải.
2. Chọn **Database** ➔ Chọn **Add PostgreSQL**.
3. Railway khởi tạo database chỉ trong 5 giây.
4. Bấm lại vào Service `vinex` ➔ tab **Variables** ➔ bấm **Add Reference** ➔ chọn `${{Postgres.DATABASE_URL}}`.

---

### Bước 5: Cấu hình Tên miền riêng `vinexgroup.vn` trên Railway
1. Trong Service `vinex`, chọn tab **Settings**.
2. Kéo xuống mục **Networking** ➔ chọn **+ Custom Domain**.
3. Nhập domain thứ nhất: `vinexgroup.vn` ➔ Bấm **Add**.
4. Bấm tiếp **+ Custom Domain** và nhập thêm: `www.vinexgroup.vn` ➔ Bấm **Add**.
5. Railway sẽ hiển thị bảng DNS Records cần trỏ:
   - Với `www`: Cung cấp 1 địa chỉ CNAME (ví dụ: `xxxx.up.railway.app`).
   - Với `@`: Cung cấp 1 địa chỉ IP (A Record) hoặc CNAME ALIAS.

---

### Bước 6: Trỏ DNS tại Nhà cung cấp tên miền của bạn
Đăng nhập vào trang quản trị tên miền nơi bạn đăng ký `vinexgroup.vn` (Mắt Bão, P.A Việt Nam, Tenten, Cloudflare...):

Thêm 2 bản ghi sau:

| Loại bản ghi (Type) | Tên host / Name | Giá trị (Value) | TTL |
|---|---|---|---|
| **CNAME** | `www` | Giá trị CNAME do Railway cấp (ví dụ: `xxxx.up.railway.app`) | 300 (hoặc Auto) |
| **A** | `@` (hoặc để trống) | Địa chỉ IP do Railway cung cấp | 300 (hoặc Auto) |

> [!TIP]
> **Nếu bạn dùng Cloudflare:**
> Chỉ cần tạo 2 bản ghi CNAME cho cả `@` và `www` trỏ về domain Railway, Cloudflare tự động kích hoạt CNAME Flattening và bảo vệ chống DDoS miễn phí.

---

### Bước 7: Kiểm tra & Nghiệm thu
Sau khoảng 5 - 15 phút để DNS toàn cầu cập nhật:
1. **Chứng chỉ bảo mật SSL**: Railway tự động cấp SSL HTTPS xanh (`Let's Encrypt`) hoàn toàn miễn phí.
2. Kiểm tra các đường dẫn hoạt động:
   - 🌐 **Trang chủ**: `https://vinexgroup.vn`
   - 📦 **Sản phẩm (Sắp xếp mới nhất lên đầu)**: `https://vinexgroup.vn/san-pham`
   - 📰 **Tin tức truyền thông**: `https://vinexgroup.vn/tin-tuc`
   - ⚙️ **Trang quản trị Admin**: `https://vinexgroup.vn/admin` *(Đăng nhập: `admin` / `admin`)*.