# BẢNG BÁO GIÁ & QUYẾT TOÁN CHI TIẾT DỰ ÁN HỆ THỐNG VINEX
**NỀN TẢNG WEBSITE THƯƠNG HIỆU & HỆ THỐNG QUẢN TRỊ DOANH NGHIỆP TOÀN DIỆN (VINEX PLATFORM)**

---

- **Đơn vị phát triển / Thực hiện:** Đội ngũ Kỹ thuật & Phát triển Phần mềm
- **Dự án:** Xây dựng Hệ sinh thái Website Thương mại & Hệ thống Quản trị Doanh nghiệp VINEX (ODEC)
- **Ngày lập báo cáo:** 28/09/2026
- **Tính chất tài liệu:** Báo cáo chi tiết toàn bộ hạng mục kỹ thuật (Frontend, Admin UI, Backend API), các khoản chi phí phát sinh bên phát triển tự bỏ tiền túi chi trả trước và phụ lục 03 đợt thay đổi giao diện theo yêu cầu.

---

## I. TỔNG HỢP CHI PHÍ DỰ ÁN & CÁC KHOẢN TIỀN TÚI ĐÃ CHI TRẢ TRƯỚC

| STT | Khoản mục chi phí | Quy cách / Phạm vi công việc | Đơn giá / Thành tiền | Trạng thái thanh toán & Đối soát |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **Chi phí Hợp đồng Gốc (Phát triển Hệ thống)** | Trọn gói nền tảng Website Frontend + Toàn bộ Hệ Quản trị Admin Dashboard + Hệ thống Backend API + Database | **23.000.000 VNĐ** | Chi phí cam kết triển khai ban đầu |
| **2** | **Email Tên Miền Doanh Nghiệp (1 Năm)** | Hệ thống hòm thư tên miền riêng cho cán bộ/nhân viên doanh nghiệp, cấu hình bản ghi bảo mật DNS (MX, SPF, DKIM, DMARC) | **1.570.800 VNĐ** / năm | **Bên phát triển tự bỏ tiền túi thanh toán trước 1 năm** *(Khách hàng CHƯA hoàn trả, cần thanh toán lại)* |
| **3** | **Chi phí Hạ tầng Server & Database Railway (PaaS)** | Duy trì Server Container Node.js, Database Cloud PostgreSQL/MySQL, Băng thông mạng quốc tế, Tự động cấp chứng chỉ bảo mật SSL/HTTPS | **134.342 VNĐ** / tháng *(Tính từ 27/09/2026)* | **Bên phát triển tự bỏ tiền túi thẻ cá nhân thanh toán trước** *(Khách hàng CHƯA hoàn trả, cần thanh toán định kỳ)* |
| **4** | **Chi phí 03 Đợt Thay đổi Giao diện (UI Redesign) theo yêu cầu** | • **Đợt 1**: Thay đổi thiết kế giao diện (UI) theo yêu cầu của khách hàng.<br>• **Đợt 2**: Tiếp tục thay đổi UI theo yêu cầu mới của khách hàng nhưng khách xem lại vẫn không ưng ý.<br>• **Đợt 3**: Đập đi xây lại & Refactor lại toàn bộ hệ thống từ đầu theo phong cách **Liquid Glass** cao cấp. | *(Ghi nhận khối lượng thực hiện)* | 03 đợt điều chỉnh UI chuyên sâu ngoài phạm vi cam kết ban đầu *(Xem chi tiết tại Mục IV)* |
| **5** | **Chi phí Làm thêm ngoài giờ (OT - Overtime)** | Đội ngũ kỹ thuật làm việc tăng cường ban đêm, ca đêm và các ngày nghỉ cuối tuần để kịp tiến độ và hỗ trợ xử lý các yêu cầu gấp từ khách hàng | *(Chưa tính)* | Ghi nhận thời gian OT thực tế, thống nhất phụ phí nghiệm thu sau |
| **6** | **Chi phí Token AI Render & Sản sinh Visual Assets** | Chi phí tài nguyên tính toán GPU/API mô hình Generative AI để tạo ảnh sản phẩm, mockup bao bì, banner visual truyền thông | *(Chưa tính)* | Thống kê số lượng lượt render thực tế và đối soát thanh toán sau |

---

## II. CHI TIẾT TOÀN BỘ CÔNG VIỆC TRÊN HỆ THỐNG ĐÃ & ĐANG LÀM

Hệ thống VINEX là một nền tảng phức hợp quy mô lớn, bao gồm 3 trụ cột kỹ thuật cốt lõi: **Website Client tương tác cao**, **Hệ thống Quản trị Admin Dashboard chuyên sâu** và **Hệ thống Backend RESTful API đa phân hệ**.

---

### 1. Phân Hệ Backend RESTful API & Cơ Sở Dữ Liệu Chuyên Sâu

Hệ thống API được thiết kế theo chuẩn **RESTful Kiến trúc đa tầng (Multi-tier Architecture)** trên nền tảng Next.js Server Components / Route Handlers, tích hợp xử lý giao dịch cơ sở dữ liệu, kiểm soát tính toàn vẹn và phân quyền bảo mật chặt chẽ:

#### A. Nhóm API Quản trị Sản phẩm & Tồn kho (`/api/products`):
* `GET /api/products`: API truy xuất danh sách sản phẩm hỗ trợ phân trang (Pagination), tìm kiếm đa năng theo Tên sản phẩm, Mã sản phẩm, SKU; lọc kết hợp theo Phân khúc (`segment`), Trạng thái mở bán (`status`), Tình trạng kho hàng (`stockStatus`).
* `GET /api/products/[id]`: API lấy chi tiết thông tin sản phẩm, danh sách hình ảnh CDN, danh mục gán kèm và thông số thuộc tính kỹ thuật.
* `POST /api/products`: API khởi tạo sản phẩm mới. Tự động sinh mã sản phẩm chuẩn hóa (`VNX-xxx`), sinh SKU nội bộ, tự động phân tích và tạo đường dẫn tĩnh (Slug) chuẩn SEO, ràng buộc liên kết đa danh mục.
* `PATCH /api/products/[id]`: API cập nhật thông tin sản phẩm. **Đặc biệt tích hợp Cơ chế Khóa phiên bản Lạc quan (Optimistic Concurrency Control / Versioning Check)**: Ngăn chặn xung đột ghi đè dữ liệu khi nhiều quản trị viên cùng sửa một sản phẩm tại cùng một thời điểm. Trả về mã lỗi `409 Conflict` và payload so sánh khi phát hiện dữ liệu trên server đã bị người khác thay đổi trước đó.
* `DELETE /api/products/[id]`: API xóa sản phẩm an toàn, giải phóng liên kết bảng trung gian.
* `DELETE /api/products/bulk`: API tiếp nhận danh sách `ids[]` để xóa hàng loạt sản phẩm trong một giao dịch đơn (Database Transaction).

#### B. Nhóm API Quản trị Tin tức & Bài viết Chuẩn SEO (`/api/articles`):
* `GET /api/articles`: API lấy danh sách bài viết hỗ trợ phân trang, lọc theo chuyên mục bài viết, trạng thái (`PUBLISHED` / `DRAFT`), tìm kiếm tiêu đề và nội dung.
* `GET /api/articles/[id]`: API truy xuất nội dung chi tiết bài viết, cấu trúc HTML bài viết, thẻ meta SEO, số lượt xem và nhật ký phiên bản.
* `POST /api/articles`: API tạo bài viết mới. Xử lý chuẩn hóa định dạng ảnh thumbnail, sinh slug tiếng Việt không dấu tự động, ghi nhận tác giả và thời gian tạo.
* `PATCH /api/articles/[id]`: API cập nhật bài viết, lưu lịch sử sửa đổi, tự động cập nhật thời gian xuất bản khi đổi trạng thái sang `PUBLISHED`, kiểm tra xung đột phiên bản `version`.
* `PATCH /api/articles/bulk-status`: API tối ưu hiệu năng cho phép Xuất bản hoặc Chuyển về Bản nháp đồng loạt cho hàng chục bài viết được chọn cùng lúc.
* `DELETE /api/articles/[id]` & Xóa hàng loạt: Giải phóng tài nguyên và cập nhật lại bộ đếm chuyên mục.

#### C. Nhóm API Quản trị Leads & Yêu Cầu Tư Vấn (`/api/leads`):
* `POST /api/leads` (Public Endpoint): API nhận dữ liệu từ các form đăng ký tư vấn trên Website Client. Kiểm tra dữ liệu đầu vào (Validation regex cho SĐT, Email), mã hóa phòng chống tấn công chèn mã độc (XSS/Injection), tự động gắn cờ nguồn tiếp nhận.
* `GET /api/leads`: API nội bộ cho Admin truy xuất danh sách yêu cầu tư vấn, lọc theo trạng thái xử lý (`PENDING`, `CONTACTED`, `RESOLVED`, `CANCELLED`), lọc theo nhân sự được phân công.
* `PATCH /api/leads/[id]`: API cập nhật trạng thái tư vấn, gán nhân viên phụ trách (`assignedToStaffId`), ghi chú tiến trình tư vấn và lịch sử chăm sóc.
* `DELETE /api/leads/[id]`: API xóa yêu cầu tư vấn khỏi danh sách quản lý.

#### D. Nhóm API Quản trị Hồ Sơ Khách Hàng (`/api/customers`):
* `GET /api/customers`: API lấy danh bạ khách hàng/đối tác doanh nghiệp, hỗ trợ tìm kiếm đa trường (Tên, Số điện thoại, Email), lọc theo Khu vực địa lý (`address`) và Phân loại nhu cầu (`requestType`).
* `POST /api/customers`: API tạo hồ sơ khách hàng mới cùng các tệp hợp đồng/tài liệu đính kèm.
* `PATCH /api/customers/[id]`: API cập nhật thông tin đối tác, ghi chú lịch sử giao dịch và tài liệu liên quan.
* `DELETE /api/customers/[id]`: API xóa hồ sơ khách hàng đơn lẻ hoặc xóa hàng loạt.

#### E. Nhóm API Phân Quyền & Quản Lý Nhân Sự Nội Bộ (`/api/staff`):
* `GET /api/staff`: API lấy danh sách tài khoản nội bộ kèm vai trò phân quyền (`ADMIN`, `MANAGER`, `EDITOR`, `STAFF`) và trạng thái kích hoạt.
* `POST /api/staff`: API khởi tạo tài khoản nhân viên mới, mã hóa mật khẩu bảo mật một chiều (Argon2 / BCrypt), kiểm tra trùng lặp email/username.
* `PATCH /api/staff/[id]`: API điều chỉnh chức vụ, thay đổi vai trò, khóa hoặc mở khóa tài khoản nhân viên tức thì.
* `DELETE /api/staff/[id]`: API vô hiệu hóa hoặc xóa nhân viên khỏi hệ sinh thái nội bộ.

#### F. Nhóm API Cây Danh Mục Nhiều Cấp (`/api/categories`):
* `GET /api/categories`: API truy xuất toàn bộ cấu trúc cây danh mục mẹ - con (Hierarchical Category Tree), hỗ trợ truy xuất theo cấp bậc phục vụ render Menu đa cấp phía Client và Dropdown lọc phía Admin.
* `POST /api/categories`: API tạo danh mục mới, gán danh mục cha (`parentId`), kiểm tra vòng lặp danh mục hợp lệ.
* `PATCH /api/categories/[id]` & `DELETE /api/categories/[id]`: Cập nhật và xóa danh mục, tự động kiểm tra ràng buộc với các sản phẩm đang thuộc danh mục.

#### G. Nhóm API Upload Tệp Tin & Đa Phương Tiện (`/api/upload`):
* `POST /api/upload`: API xử lý upload tệp tin hình ảnh/tài liệu (Multipart/form-data). Kiểm tra dung lượng tệp tin (tối đa 10MB), xác thực định dạng ảnh hợp lệ (JPG, PNG, WebP, SVG), tự động nén kích thước và sinh URL CDN lưu trữ vĩnh viễn.

#### H. Nhóm API Xác Thực & Bảo Mật Hệ Thống (`/api/auth`):
* `POST /api/auth/login`: Xác thực đăng nhập quản trị viên, sinh mã JWT Token có chữ ký bảo mật, thiết lập cookie an toàn `HttpOnly, SameSite=Lax`.
* Middleware xác thực tự động chạy ở tầng Edge Runtime, chặn mọi truy cập trái phép vào các endpoint `/admin/*` và `/api/admin/*`.

---

### 2. Phân Hệ Giao Diện Quản Trị Hệ Thống Toàn Diện (VINEX Admin Portal UI)

Giao diện Quản trị được thiết kế theo tiêu chuẩn hệ thống thiết kế doanh nghiệp hiện đại (**Enterprise Design System**), đồng bộ hoàn toàn giữa **Dark Mode** (nền `#14151a`, card `#1a1b23`) và **Light Mode** (nền trắng `#ffffff`, card `#fafafa`):
* **Hệ Quy Chuẩn Design System Tokens:**
  * Mã màu định danh thương hiệu Admin: **Indigo Discord `#5865f2`** (sắc nét, tinh tế, độ tương phản cao đạt chuẩn accessibility WCAG AA).
  * Bo góc đồng bộ toàn hệ sinh thái: Tiêu chuẩn **`rounded-[4px]`** áp dụng nghiêm ngặt cho toàn bộ nút bấm (Button), ô nhập liệu (Input), bảng dữ liệu (Table), hộp thoại (Dialog) và thẻ thống kê (Card).
  * Hiệu ứng viền & nền: Sử dụng đường viền siêu mảnh `border-gray-200 dark:border-gray-800` tạo chiều sâu thị giác.

* **Chi Tiết Các Màn Hình Quản Trị Đã Triển Khai:**

  1. **Màn Hình Quản Lý Sản Phẩm (`/admin/products`):**
     * Thanh tìm kiếm linh hoạt trên Header Portal tìm kiếm theo Tên, Mã SP, SKU.
     * Bộ lọc thường trực 3 cấp: Lọc trạng thái mở bán, lọc tình trạng tồn kho, lọc phân khúc sản phẩm.
     * Lưới 4 thẻ KPI động: Tổng tồn kho, Sản phẩm đang bán, Cảnh báo sắp hết hàng, Cảnh báo hết hàng.
     * Bảng dữ liệu sản phẩm đa cột: Checkbox chọn hàng loạt, ảnh thumbnail có viền bảo vệ, mã SKU, phân cấp danh mục, số lượng kho kèm cảnh báo màu, giá niêm yết/giá khuyến mãi, badge trạng thái.
     * Drawer thêm/sửa sản phẩm trượt từ bên phải: Form chia tab khoa học (Thông tin chung, Giá & Kho, Hình ảnh kéo thả, Thuộc tính mở rộng, Cấu hình SEO xem trước kết quả Google).
     * Modal giải quyết xung đột ghi đè phiên bản: Hiển thị giao diện so sánh trực quan giữa dữ liệu trên máy người dùng và dữ liệu mới nhất trên server khi có người khác vừa cập nhật.

  2. **Màn Hình Quản Lý Tin Tức & Bài Viết (`/admin/articles`):**
     * Bộ lọc chuyên mục động lấy tự động từ database, lọc trạng thái Xuất bản / Bản nháp.
     * Thống kê KPI: Tổng số bài viết, Số bài đã xuất bản, Số bản nháp đang biên tập, Tổng lượt người đọc.
     * Bảng bài viết hiển thị ảnh đại diện, tiêu đề bài viết, danh mục gán kèm, ngày đăng, trạng thái badge màu rõ nét.
     * Bộ nút hành động hàng loạt: Xuất bản hàng loạt, Ẩn về bản nháp hàng loạt, Xóa hàng loạt an toàn.
     * Drawer biên tập bài viết: Trình soạn thảo văn bản phong phú (Rich Text), công cụ tối ưu SEO On-page trực tiếp (đo độ dài ký tự tiêu đề, thẻ mô tả chuẩn thuật toán Google).

  3. **Màn Hình Quản Lý Leads & Yêu Cầu Tư Vấn (`/admin/leads`):**
     * Bảng tiếp nhận yêu cầu liên hệ, cuộc gọi tư vấn, đơn hàng quà tặng doanh nghiệp B2B.
     * Dropdown chọn nhân sự phụ trách: **Cố định chiều rộng cột để không bị nhảy layout khi chọn tên dài; tự động Focus chuột vào ô tìm kiếm nhân viên ngay khi vừa click mở dropdown**.
     * Badge quy trình xử lý trực quan: Mới tiếp nhận, Đang tư vấn, Báo giá, Hoàn tất, Hủy bỏ.
     * Drawer xem chi tiết yêu cầu trượt bên phải hiển thị đầy đủ thông tin khách, nội dung nhu cầu, tệp đính kèm.
     * Modal đóng hồ sơ tư vấn: Thiết kế đồng bộ chuẩn form, tự động chọn sẵn phương án *"Đã giải quyết, tư vấn xong"*.

  4. **Màn Hình Quản Lý Khách Hàng (`/admin/customers`):**
     * Quản lý hồ sơ đối tác doanh nghiệp, khách mua sỉ, doanh nghiệp đặt set quà.
     * Bộ lọc thường trực theo Khu vực địa lý (Tỉnh/Thành phố) và Phân loại nhu cầu trọng tâm.
     * Hệ thống 4 thẻ thống kê trực quan: Tổng khách hàng tiếp nhận (Xanh dương), Khu vực ghi nhận (Xanh lá), Đầy đủ email liên hệ (Hổ phách), Nhu cầu nổi bật nhất (Chàm `#5865f2`).
     * Checkbox chọn hàng loạt màu `#5865f2`, Avatar khách hàng lấy ký tự đầu đồng bộ màu sắc.
     * Badge loại yêu cầu bo góc `rounded-[4px]`, không còn màu xanh cũ lệch tông.
     * Drawer cập nhật hồ sơ khách hàng đầy đủ các trường thông tin đối tác và hình ảnh hợp đồng.

  5. **Màn Hình Quản Lý Nhân Sự & Phân Quyền (`/admin/staff`):**
     * Danh sách nhân sự nội bộ, phân quyền vai trò (`Admin`, `Manager`, `Editor`, `Staff`).
     * Form thêm mới nhân viên được chuyển đổi hoàn toàn sang **Drawer trượt từ bên phải** đồng bộ trải nghiệm với toàn hệ thống.
     * Công tắc chuyển đổi kích hoạt / khóa tài khoản nhân viên nhanh chóng.

  6. **Màn Hình Quản Lý Danh Mục (`/admin/categories`):**
     * Trực quan hóa cấu trúc danh mục nhiều cấp, hỗ trợ kiểm tra thứ tự sắp xếp và liên kết slug chuẩn SEO.

  7. **Hệ Thống Thành Phần Dùng Chung (Reusable UI Components):**
     * `CustomDropdown`: Thành phần chọn lựa cao cấp có tính toán vị trí hiển thị (tự động bung lên trên nếu gần đáy trang), tích hợp ô tìm kiếm lọc nhanh danh sách.
     * `ActionMenu`: Nút menu 3 chấm nhỏ gọn với hiệu ứng dropdown xuất hiện mượt mà, hỗ trợ phân cách và đổi màu nút hành động nguy hiểm.
     * `ImageUploader`: Hỗ trợ tải nhiều ảnh cùng lúc, hiển thị thanh tiến trình, preview ảnh sắc nét và nút xóa nhanh.
     * `AdminHeaderPortal`: Kỹ thuật React Portal tiêm thanh tìm kiếm và các nút thao tác lên thanh Header chính của Admin, tạo sự liền mạch tuyệt đối.

---

### 3. Phân Hệ Frontend Khách Hàng (Client Public Website)

Giao diện người dùng công khai được xây dựng theo phong cách **Liquid Glassmorphism & Organic Botanical**, đem lại cảm giác cao cấp, sang trọng chuẩn thương hiệu nông sản xuất khẩu chất lượng cao:
* **Trang Chủ (Homepage):**
  * Hero Banner chuyển động mượt mà giới thiệu thương hiệu và các dòng sản phẩm chủ lực.
  * Phân đoạn câu chuyện thương hiệu ODEC & VINEX, định hướng nông sản hữu cơ bền vững.
  * Bộ sưu tập sản phẩm nổi bật và các set quà tặng doanh nghiệp tiêu biểu.
  * Khối chứng nhận tiêu chuẩn chất lượng (HACCP, ISO, kiểm định xuất khẩu).
  * Form đăng ký nhận tin và tư vấn nhanh tối ưu tỷ lệ chuyển đổi (CRO).
* **Trang Sản Phẩm & Chi Tiết Sản Phẩm (`/san-pham`, `/san-pham/[slug]`):**
  * Lọc đa tiêu chí theo phân khúc (Cao cấp, Tiêu chuẩn) và từng danh mục nông sản.
  * Gallery ảnh sản phẩm nhiều góc chụp có tính năng zoom chi tiết.
  * Hiển thị bảng giá bán sỉ/lẻ, thông số dinh dưỡng, hạn sử dụng, quy cách đóng gói.
  * Nút "Đăng ký tư vấn / Báo giá B2B" tự động chuyển thông tin về hệ thống Admin Leads.
* **Trang Tin Tức & Kiến Thức (`/tin-tuc`, `/tin-tuc/[slug]`):**
  * Giao diện tạp chí bài viết chuẩn SEO, bố cục bài viết nổi bật, chia chuyên mục rõ ràng.
  * Mục lục tự động điều hướng theo các tiêu đề H2/H3 trong bài, khối bài viết liên quan.
* **Trang Doanh Nghiệp & Năng Lực Sản Xuất (`/ve-chung-toi`):**
  * Giới thiệu vùng nguyên liệu, quy trình chế biến, công nghệ sấy và dây chuyền đóng gói đạt chuẩn xuất khẩu.
* **Trang Liên Hệ & Đối Tác (`/lien-he`):**
  * Form tiếp nhận nhu cầu tư vấn doanh nghiệp với đầy đủ trường thông tin và cơ chế xác thực dữ liệu tức thì.
* **Thanh Điều Hướng Kính Mờ (Liquid Glass Dock Header):**
  * Thanh Menu nổi bo góc mềm mại, hiệu ứng khúc xạ thủy tinh cao cấp, hỗ trợ chuyển đổi Dark/Light mode tức thì.
* **Chân Trang (Footer) Chuẩn Thương Hiệu:**
  * Đồng bộ logo chính thức của VINEX, liên kết điều hướng thông tin pháp lý và mạng xã hội.

---

### 4. Tối Ưu Hóa Kỹ Thuật, SEO & Bảo Mật

* **SEO On-page & Tốc Độ:**
  * Cấu trúc thẻ tiêu đề chuẩn Semantic HTML5 (`h1` duy nhất, phân cấp `h2` - `h6` mạch lạc).
  * Tự động sinh `sitemap.xml`, `robots.txt`, thẻ OpenGraph, Twitter Card chuẩn chia sẻ Facebook, Zalo, LinkedIn.
  * Bộ giải thuật xử lý Slug tiếng Việt chuẩn hóa (`serverSlugHelper`), loại bỏ 100% lỗi ký tự có dấu khi render URL.
  * Tối ưu nén ảnh thế hệ mới (Next Image WebP), tối ưu hóa First Contentful Paint (FCP) dưới 1.2s.
* **Bảo Mật Hệ Thống:**
  * Mã hóa mật khẩu bảo mật một chiều, bảo vệ toàn bộ API nội bộ bằng Middleware kiểm tra Token.
  * Lọc dữ liệu đầu vào chống tấn công XSS, SQL Injection và ngăn chặn CSRF.

---

## III. BẢNG KÊ CÁC KHOẢN CHI PHÍ BÊN LÀM PHẢI TỰ BỎ TIỀN TÚI CHI TRẢ TRƯỚC (CẦN HOÀN TRẢ)

Trong quá trình triển khai hệ thống, để đảm bảo dự án vận hành liên tục và đúng tiến độ cam kết, **bên phát triển đã chủ động tự bỏ tiền túi chi trả trước các khoản phí hạ tầng và dịch vụ bên thứ ba**. Phía khách hàng **CHƯA thanh toán / CHƯA hoàn trả** các khoản này:

| STT | Dịch vụ chi trả | Nhà cung cấp / Đơn vị | Chu kỳ tính phí | Đơn giá chi trả (VNĐ) | Tình trạng thanh toán | Ghi chú & Trách nhiệm |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| **1** | **Hệ thống Email Tên Miền Doanh Nghiệp** | Nhà cung cấp dịch vụ Email Doanh nghiệp | 1 Năm (12 tháng) | **1.570.800** | **Bên phát triển tự bỏ tiền túi chi trả trước 1 năm** | Khách hàng **CHƯA thanh toán hoàn trả**. Khoản này đã được kích hoạt, cấu hình đầy đủ bản ghi MX, SPF, DKIM, DMARC và bàn giao sử dụng. Cần hoàn trả lại cho bên làm. |
| **2** | **Hạ tầng Server & Database Railway (PaaS)** | Railway Corporation (Hoa Kỳ) | Hàng tháng (Theo chu kỳ) | **134.342** / tháng | **Bên phát triển tự bỏ tiền túi quẹt thẻ tín dụng cá nhân** | Khách hàng **CHƯA thanh toán hoàn trả**. Thời gian bắt đầu tính phí hạ tầng từ ngày **27/09/2026**. Cần thanh toán hoàn trả định kỳ hàng tháng theo hóa đơn thực tế. |

---

## IV. PHỤ LỤC: 03 ĐỢT THAY ĐỔI & ĐẠI TU GIAO DIỆN (UI REDESIGN) THEO YÊU CẦU

Trong quá trình nghiệm thu từng phần, phía khách hàng đã đưa ra **03 đợt yêu cầu thay đổi toàn bộ thiết kế giao diện (Pure UI/UX Redesign)** theo sở thích thẩm mỹ cá nhân và định hướng lại nhận diện. **Toàn bộ 03 đợt thay đổi này là thay đổi về mặt giao diện (UI Styling & Visual Components), hoàn toàn không xuất phát từ lỗi kỹ thuật hay lỗi logic nghiệp vụ của hệ thống ban đầu**:

### 1. Đợt Thay Đổi UI Thứ Nhất: Thay Đổi Giao Diện Theo Yêu Cầu Của Khách Hàng
* **Bối cảnh & Yêu cầu:** Khách hàng đưa ra định hướng thiết kế và yêu cầu thay đổi lại giao diện so với bản dự thảo ban đầu (thay đổi cấu trúc bố cục trang, vị trí các khối nội dung, màu sắc nhận diện, cập nhật logo mới ở chân trang Footer, tinh chỉnh thanh Navigation Menu).
* **Khối lượng UI đã thực hiện:**
  * Đội ngũ kỹ thuật đã bám sát và triển khai toàn bộ các thay đổi giao diện theo đúng mô tả và chỉ đạo từ phía khách hàng.
  * Tinh chỉnh lại toàn bộ hệ thống cột điều hướng chân trang, tích hợp logo mới (`logo_footer.png`), xử lý lỗi hiển thị trên thiết bị di động và tối ưu thanh điều hướng nổi.

### 2. Đợt Thay Đổi UI Thứ Hai: Tiếp Tục Thay Đổi Giao Diện Theo Yêu Cầu Mới Của Khách Hàng (Khách Hàng Xem Lại Vẫn Không Ưng)
* **Bối cảnh & Yêu cầu:** Sau khi bàn giao bản giao diện Đợt 1, khách hàng thay đổi ý định thẩm mỹ và tiếp tục yêu cầu chỉnh sửa, thay đổi lại phong cách giao diện một lần nữa (thay đổi cách hiển thị bảng danh sách, chuyển đổi hình thức form thêm mới, thay đổi cách tương tác với dropdown và modal).
* **Khối lượng UI đã thực hiện:**
  * Đội ngũ kỹ thuật tiếp tục thực hiện đầy đủ khối lượng công việc theo yêu cầu Đợt 2: Khóa cố định chiều rộng cột người phụ trách tránh xô lệch bảng; tinh chỉnh dropdown tự động focus ô tìm kiếm nhân viên; chuyển toàn bộ form thêm mới sang dạng Drawer trượt mượt mà từ cạnh phải; loại bỏ khối Card cấu trúc phân cấp (Hierarchy Card); thiết kế lại Modal đóng hồ sơ tư vấn.
  * **Kết quả nghiệm thu:** Mặc dù đội ngũ đã hoàn thành 100% đúng theo yêu cầu Đợt 2, **tuy nhiên sau khi trải nghiệm thực tế, phía khách hàng xem lại vẫn cảm thấy không ưng ý (vẫn không ưng)** và nhận thấy phong cách này chưa đạt tới độ sang trọng mong muốn, tiếp tục yêu cầu chuyển hướng sang một phong cách thiết kế hoàn toàn mới.

### 3. Đợt Thay Đổi UI Thứ Ba: Đập Đi Xây Lại & Refactor Lại Toàn Bộ Hệ Thống Từ Đầu Theo Phong Cách Liquid Glass
* **Bối cảnh & Yêu cầu:** Để đáp ứng tiêu chuẩn thẩm mỹ cao cấp nhất mà khách hàng hướng tới, hai bên thống nhất quyết định: **Refactor lại toàn bộ hệ sinh thái giao diện từ đầu theo phong cách Kính Lỏng (Liquid Glassmorphism kết hợp Botanical Organic sang trọng)**.
* **Khối lượng UI đã thực hiện (Khối lượng công việc khổng lồ):**
  * **Xây dựng bộ Design System Tokens Liquid Glass hoàn toàn mới:** Ứng dụng công nghệ xử lý kính lỏng với hiệu ứng làm mờ quang học đa tầng (`backdrop-blur(24px) saturate(140%)`), viền kính thủy tinh siêu mỏng (`border: 1px solid rgba(255, 255, 255, 0.45)`), lớp ánh kim quang học bề mặt (`inset 0 1.5px 2px rgba(255, 255, 255, 0.7)`), phối màu ngọc bích Deep Teal (`#074751` & `#0D5962`), Warm Ivory (`#FAF8F2`), Accent Gold (`#F2B719`) và Sage Botanical (`#5C7B6C`).
  * **Đại tu toàn diện Client Website:** Thiết kế lại toàn bộ thanh điều hướng Liquid Glass Dock Header nổi cao cấp, Hero Banner khúc xạ ánh sáng, hệ thống thẻ Card sản phẩm kính mờ, các khối tin tức và chân trang Footer chuẩn nhận diện.
  * **Refactor toàn diện hệ thống Admin Portal:** Đồng bộ màu sắc chủ đạo sang tông Indigo Discord `#5865f2`, bo góc chuẩn hóa `rounded-[4px]`, thiết kế lại hệ thống lưới 4 thẻ thống kê KPI phản quang (Xanh dương, Xanh lá, Hổ phách, Chàm), chuẩn hóa toàn bộ Checkbox, Badge loại yêu cầu, bảng biểu dữ liệu và Drawer trượt chi tiết, đảm bảo giao diện sắc nét, hài hòa 100% ở cả 2 chế độ Dark Mode và Light Mode.

---

## V. CÁC HẠNG MỤC PHÁT SINH NGOÀI HỢP ĐỒNG GỐC CẦN NGHIỆM THU

1. **Chi phí Làm thêm ngoài giờ (OT - Overtime):**
   * Đội ngũ kỹ thuật đã làm việc ngoài giờ hành chính, làm việc vào ban đêm và các ngày thứ 7, Chủ nhật liên tục theo yêu cầu của khách hàng để kịp tiến độ và thực hiện gấp các đợt đại tu giao diện.
   * *Trạng thái:* Tạm thời ghi nhận khối lượng công việc, chưa tính vào tổng tiền, sẽ đối soát thời gian làm việc thực tế để hai bên thống nhất phụ phí hợp lý.
2. **Chi phí Token AI Render Hình ảnh Visual:**
   * Chi phí sử dụng tài nguyên API mô hình Generative AI để tạo các hình ảnh truyền thông thương hiệu, ảnh sản phẩm nông sản, mockup bao bì sản phẩm phục vụ hiển thị trên hệ thống.
   * *Trạng thái:* Tạm thời ghi nhận khối lượng lượt render, chưa tính vào tổng tiền, sẽ đối soát bảng thống kê tài nguyên thực tế để thanh toán.

---

## VI. BẢNG QUYẾT TOÁN TỔNG HỢP & ĐIỀU KHOẢN THANH TOÁN

### 1. Bảng Quyết Toán Chi Phí:

| STT | Nội dung thanh toán | Đơn giá / Thành tiền (VNĐ) | Phân loại | Tình trạng |
| :---: | :--- | :---: | :---: | :--- |
| **A** | **Chi phí Hợp đồng Gốc Phát triển Hệ thống** | **23.000.000** | Chi phí dự án gốc | Theo tiến độ hợp đồng |
| **B** | **Hoàn trả tiền Email Doanh nghiệp (1 năm)** | **1.570.800** | Tiền túi bên làm ứng trước | **Cần thanh toán hoàn trả ngay** |
| **C** | **Hoàn trả tiền Server Railway (Tính từ 27/09/2026)** | **134.342** / tháng | Tiền túi bên làm ứng trước | **Cần thanh toán hoàn trả theo tháng** |
| **D** | **Chi phí 03 Đợt Sửa Đổi Giao Diện Theo Yêu Cầu** *(Đợt 1 theo yêu cầu, Đợt 2 theo yêu cầu nhưng vẫn không ưng, Đợt 3 refactor toàn bộ theo Liquid Glass)* | *(Chờ thống nhất)* | Phát sinh thay đổi UI | Nghiệm thu theo khối lượng thực tế |
| **E** | **Chi phí Làm thêm ngoài giờ (OT)** | *(Chưa tính)* | Chi phí tăng cường tiến độ | Đối soát giờ làm thực tế |
| **F** | **Chi phí Token AI Render Ảnh** | *(Chưa tính)* | Chi phí tài nguyên bên thứ 3 | Đối soát hạn mức thực tế |

### 2. Điều Khoản Thanh Toán & Hoàn Trả:
* **Đối với các khoản bên phát triển đã tự bỏ tiền túi chi trả trước (Mục B và Mục C):**
  * Khoản tiền Email tên miền **1.570.800 VNĐ** bên phát triển đã thanh toán trọn gói 1 năm bằng tài khoản cá nhân, đề nghị quý khách hàng thanh toán hoàn trả lại toàn bộ trong đợt thanh toán liền kề.
  * Khoản chi phí duy trì Server Railway **134.342 VNĐ / tháng** được tính từ ngày **27/09/2026**, khách hàng sẽ thanh toán hoàn trả định kỳ hàng tháng cho bên phát triển theo bảng kê đối soát thẻ quốc tế.
* **Đối với Hợp đồng gốc (23.000.000 VNĐ):**
  * Thanh toán theo đúng các mốc điều khoản bàn giao và nghiệm thu đã thỏa thuận trong hợp đồng.
* **Đối với các khoản phát sinh (Sửa UI 3 đợt, OT, Token AI):**
  * Hai bên sẽ tổ chức buổi đối soát và thống nhất mức phụ phí hợp lý dựa trên bảng kê khối lượng công việc thực tế đã hoàn thành xuất sắc trong tài liệu này.

---

*Tài liệu này được lập bằng văn bản kỹ thuật chính thức, phản ánh trung thực, đầy đủ và minh bạch mọi khía cạnh công việc và chi phí của dự án VINEX.*
