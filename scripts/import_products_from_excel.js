/**
 * VINEX Production Import Script (Refactored)
 *
 * Quy chuẩn:
 * 1. KHÔNG thêm "Số thứ tự" vào attributes.
 * 2. Thuộc tính chuẩn dạng { name: string, value: string } để hiển thị chuẩn xác trên Admin Form.
 * 3. Sản phẩm chưa có giá (hoặc "Đang cập nhật"): KHÔNG nhập giá (price: null), KHÔNG thêm "Giá trước thuế" / "Giá sau thuế" vào attributes.
 * 4. Xóa sạch các sản phẩm cũ trên API và import lại toàn bộ 95 sản phẩm sạch sẽ, không trùng lặp.
 */

const XLSX = require('xlsx');
const https = require('https');
const path = require('path');

const API_BASE = 'https://api.vinexgroup.vn/v1';
const EXCEL_PATH = path.join(__dirname, '..', 'sanpham.xlsx');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function formatExcelDate(val) {
  if (!val) return '';
  if (typeof val === 'number') {
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
  return String(val).trim();
}

function formatCurrency(val) {
  if (typeof val === 'number') {
    return Math.round(val).toLocaleString('vi-VN') + ' đ';
  }
  if (!val || String(val).trim().toLowerCase().includes('cập nhật')) {
    return '';
  }
  return String(val).trim();
}

function requestJson(urlStr, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Accept': 'application/json',
        'x-user-id': '1',
        'x-user-username': 'admin',
        'x-user-fullname': 'Administrator',
        'x-user-role': 'ADMIN',
      },
    };

    if (data) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = https.request(options, res => {
      let resBody = '';
      res.on('data', chunk => { resBody += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(resBody) });
        } catch {
          resolve({ status: res.statusCode, data: resBody });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('Request timed out (30s)')));
    if (data) req.write(data);
    req.end();
  });
}

const CATEGORY_CODE_MAP = {
  'Bánh quy':       'BQ',
  'Bánh khác':      'BK',
  'Cacao':          'CC',
  'Kẹo':            'KEO',
  'Mứt sấy dẻo':   'MSD',
  'Sấy thăng hoa':  'STH',
  'Trà':            'TRA',
  'Cafe':           'CF',
  'Hạt':            'HAT',
};

// ─── Main Routine ─────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 VINEX REFACTORED IMPORTER');
  console.log('   - Không thêm Số thứ tự vào thông số');
  console.log('   - Sản phẩm chưa có giá: Không nhập giá & không nhập thuộc tính giá');
  console.log('   - Thuộc tính chuẩn { name, value } cho Form Admin');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Fetch current categories from API
  console.log('📡 Đang đồng bộ danh mục từ API...');
  const catRes = await requestJson(`${API_BASE}/categories`);
  if (catRes.status !== 200 || !Array.isArray(catRes.data)) {
    throw new Error(`Không thể lấy danh mục từ API: status ${catRes.status}`);
  }

  const categoryMap = new Map();
  catRes.data.forEach(c => {
    categoryMap.set(c.name.trim().toLowerCase(), c.id);
  });
  console.log(`✅ Đã tải ${catRes.data.length} danh mục:`);
  catRes.data.forEach(c => console.log(`   - ID ${c.id}: ${c.name} (${c.slug})`));

  // 2. Fetch existing products and clean them
  console.log('\n🔍 Đang kiểm tra các sản phẩm hiện có trên hệ thống...');
  const existingProdsRes = await requestJson(`${API_BASE}/products`);
  if (existingProdsRes.status === 200 && Array.isArray(existingProdsRes.data) && existingProdsRes.data.length > 0) {
    console.log(`🗑️ Đang dọn dẹp ${existingProdsRes.data.length} sản phẩm cũ để nhập lại mới hoàn toàn...`);
    for (let i = 0; i < existingProdsRes.data.length; i++) {
      const prod = existingProdsRes.data[i];
      try {
        await requestJson(`${API_BASE}/products/${prod.id}`, 'DELETE');
        process.stdout.write(`\r   Xóa: ${i + 1}/${existingProdsRes.data.length}`);
      } catch (err) {
        console.warn(`   Không thể xóa ID ${prod.id}: ${err.message}`);
      }
      await sleep(50);
    }
    console.log('\n✅ Đã dọn dẹp dữ liệu cũ xong.');
  } else {
    console.log('✅ Hệ thống hiện chưa có sản phẩm cũ.');
  }

  // 3. Parse Excel file
  console.log('\n📂 Đang đọc dữ liệu từ:', EXCEL_PATH);
  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

  let lastCategory = '';
  let lastStt = 0;
  let variantIndex = 1;
  const products = [];

  for (let i = 15; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || row[0] === 'STT') continue;

    // Check section header like '1. Bánh quy'
    if (row[0] && typeof row[0] === 'string' && /^\d+\.\s+/.test(row[0].trim())) {
      lastCategory = row[0].trim().replace(/^\d+\.\s+/, '');
      continue;
    }

    // Stop at footer notes
    if (row[0] && typeof row[0] === 'string' && (
      row[0].includes('Ghi chú') || 
      row[0].includes('THÔNG TIN') || 
      row[0].includes('Giá áp dụng') || 
      row[0].includes('Điều kiện') || 
      row[0].includes('Nơi nhận') || 
      row[0].includes('Công ty')
    )) {
      break;
    }

    const stt = row[0];
    const cat = (row[2] || lastCategory || '').trim();
    const name = (row[3] || '').trim();

    if (!name) continue;

    let isVariant = false;
    if (typeof stt === 'number') {
      lastStt = stt;
      variantIndex = 1;
    } else {
      isVariant = true;
      variantIndex++;
    }

    const currentStt = lastStt;
    const catCode = CATEGORY_CODE_MAP[cat] || 'SP';
    const sku = isVariant 
      ? `VNX-${catCode}-${String(currentStt).padStart(3, '0')}-V${variantIndex}`
      : `VNX-${catCode}-${String(currentStt).padStart(3, '0')}`;

    const weight = row[4] ? String(row[4]).trim() : '';
    const packaging = row[5] ? String(row[5]).trim() : '';
    const unit = row[6] ? String(row[6]).trim() : '';
    const rawPriceBeforeTax = row[7];
    const rawPriceAfterTax = row[8];
    const rawReleaseDate = row[9];

    // Xác định sản phẩm có giá hay chưa
    const hasValidPrice = typeof rawPriceAfterTax === 'number' && rawPriceAfterTax > 0;
    const price = hasValidPrice ? Math.round(rawPriceAfterTax) : null;
    const formattedPriceBeforeTax = formatCurrency(rawPriceBeforeTax);
    const formattedPriceAfterTax = formatCurrency(rawPriceAfterTax);
    const formattedReleaseDate = formatExcelDate(rawReleaseDate);

    // Find category ID
    const catId = categoryMap.get(cat.toLowerCase());
    const categoryIds = catId ? [catId] : [];

    const slug = toSlug(name);
    const productId = `VNX-P${String(products.length + 1).padStart(3, '0')}`;

    // Short Description
    const shortDescParts = [];
    if (weight) shortDescParts.push(`Trọng lượng: ${weight}`);
    if (packaging) shortDescParts.push(`Quy cách: ${packaging}`);
    if (unit) shortDescParts.push(`ĐVT: ${unit}`);
    if (hasValidPrice && formattedPriceBeforeTax) {
      shortDescParts.push(`Giá trước thuế: ${formattedPriceBeforeTax}`);
    }
    if (formattedReleaseDate) {
      shortDescParts.push(`Kế hoạch ra hàng: ${formattedReleaseDate}`);
    }
    const shortDescription = shortDescParts.join(' | ');

    // Rich HTML Description
    const description = `
<div class="vinex-product-sheet">
  <p class="product-intro"><strong>${name}</strong> là sản phẩm nông sản chế biến cao cấp thuộc thương hiệu <strong>VINEX</strong>, được sản xuất và kiểm soát nghiêm ngặt theo tiêu chuẩn xuất khẩu quốc tế.</p>
  
  <table class="product-specs-table" style="width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 12px;">
    <tbody>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 8px 12px; font-weight: 600; color: #074751; width: 35%;">Phân loại sản phẩm</td>
        <td style="padding: 8px 12px;">${cat}</td>
      </tr>
      ${weight ? `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 8px 12px; font-weight: 600; color: #074751;">Trọng lượng</td>
        <td style="padding: 8px 12px;">${weight}</td>
      </tr>` : ''}
      ${packaging ? `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 8px 12px; font-weight: 600; color: #074751;">Quy cách đóng gói</td>
        <td style="padding: 8px 12px;">${packaging}</td>
      </tr>` : ''}
      ${unit ? `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 8px 12px; font-weight: 600; color: #074751;">Đơn vị tính</td>
        <td style="padding: 8px 12px;">${unit}</td>
      </tr>` : ''}
      ${hasValidPrice ? `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 8px 12px; font-weight: 600; color: #074751;">Giá trước thuế</td>
        <td style="padding: 8px 12px;">${formattedPriceBeforeTax}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 8px 12px; font-weight: 600; color: #074751;">Giá sau thuế (VAT)</td>
        <td style="padding: 8px 12px; font-weight: 700; color: #d97706;">${formattedPriceAfterTax}</td>
      </tr>` : `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 8px 12px; font-weight: 600; color: #074751;">Giá bán niêm yết</td>
        <td style="padding: 8px 12px; font-weight: 600; color: #92400e; font-style: italic;">Liên hệ báo giá (Đang cập nhật)</td>
      </tr>`}
      ${formattedReleaseDate ? `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 8px 12px; font-weight: 600; color: #074751;">Kế hoạch ra hàng</td>
        <td style="padding: 8px 12px;">${formattedReleaseDate}</td>
      </tr>` : ''}
    </tbody>
  </table>

  <p class="product-policy" style="font-size: 0.9em; color: #6b7280; font-style: italic;">
    * Áp dụng theo Bảng báo giá chính thức của Công ty Cổ phần Xuất Nhập khẩu và Thương mại Vinex có hiệu lực từ ngày 01/10/2026.
    Chính sách chiết khấu, khuyến mại và giao hàng thực hiện theo hợp đồng hoặc quy chế bán hàng của VINEX.
  </p>
</div>`.trim();

    // ─── ATTRIBUTES LIST ───────────────────────────────────────────────────────
    // KHÔNG thêm "Số thứ tự" vào thông số!
    // Format { name, value } để Admin Form map chính xác vào input value!
    const attributes = [];
    if (cat)       attributes.push({ name: 'Phân loại', value: cat });
    if (weight)    attributes.push({ name: 'Trọng lượng', value: weight });
    if (packaging) attributes.push({ name: 'Quy cách đóng gói', value: packaging });
    if (unit)      attributes.push({ name: 'Đơn vị tính', value: unit });

    // Chỉ thêm thuộc tính giá nếu sản phẩm ĐÃ CÓ GIÁ
    if (hasValidPrice) {
      if (formattedPriceBeforeTax) attributes.push({ name: 'Giá trước thuế', value: formattedPriceBeforeTax });
      if (formattedPriceAfterTax)  attributes.push({ name: 'Giá sau thuế', value: formattedPriceAfterTax });
    }

    if (formattedReleaseDate) attributes.push({ name: 'Thời gian ra hàng', value: formattedReleaseDate });

    products.push({
      index: products.length + 1,
      stt: currentStt,
      sku,
      productId,
      name,
      slug,
      segment: 'cao-cap',
      price: price, // null nếu chưa có giá
      promotionalPrice: 0,
      stockQuantity: 100,
      stockStatus: 'IN_STOCK',
      lowStockThreshold: 10,
      shortDescription,
      description,
      status: 'ACTIVE',
      images: [], // Để trống per user request
      categoryIds,
      attributes,
      _hasPrice: hasValidPrice,
    });
  }

  console.log(`\n📋 Đã phân tích ${products.length} sản phẩm.`);
  const unpriced = products.filter(p => !p._hasPrice);
  console.log(`   - Sản phẩm có giá:    ${products.length - unpriced.length}`);
  console.log(`   - Sản phẩm chưa giá:  ${unpriced.length} (Ví dụ: ${unpriced.map(u => u.name).join(', ')})`);
  console.log('───────────────────────────────────────────────────────────────');

  // Preview mẫu thuộc tính của sản phẩm đầu tiên
  console.log('\n🔍 Kiểm tra mẫu thuộc tính của sản phẩm #1:');
  console.log(JSON.stringify(products[0].attributes, null, 2));

  // 4. Import each product via API
  console.log('\n🚀 Bắt đầu import vào API https://api.vinexgroup.vn/v1/products...\n');

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const progress = `[${String(i + 1).padStart(2, '0')}/${products.length}]`;
    const priceDisplay = p._hasPrice ? `${p.price?.toLocaleString('vi-VN')}đ` : 'Chưa có giá';
    process.stdout.write(`${progress} ${p.sku} | ${p.name.substring(0, 45).padEnd(45, ' ')} (${priceDisplay}) -> `);

    let retries = 3;
    let ok = false;

    while (retries > 0 && !ok) {
      try {
        const payload = {
          name: p.name,
          slug: p.slug,
          productId: p.productId,
          sku: p.sku,
          segment: p.segment,
          price: p.price,
          promotionalPrice: p.promotionalPrice,
          stockQuantity: p.stockQuantity,
          stockStatus: p.stockStatus,
          lowStockThreshold: p.lowStockThreshold,
          shortDescription: p.shortDescription,
          description: p.description,
          status: p.status,
          images: p.images,
          categoryIds: p.categoryIds,
          attributes: p.attributes,
        };

        const res = await requestJson(`${API_BASE}/products`, 'POST', payload);

        if (res.status === 201 || res.status === 200) {
          successCount++;
          console.log(`✅ OK (ID: ${res.data?.id})`);
          ok = true;
        } else {
          retries--;
          if (retries === 0) {
            failCount++;
            const msg = res.data?.message || JSON.stringify(res.data).substring(0, 60);
            console.log(`❌ Lỗi ${res.status}: ${msg}`);
            errors.push({ stt: p.stt, name: p.name, error: msg });
          } else {
            await sleep(500);
          }
        }
      } catch (err) {
        retries--;
        if (retries === 0) {
          failCount++;
          console.log(`❌ Network error: ${err.message}`);
          errors.push({ stt: p.stt, name: p.name, error: err.message });
        } else {
          await sleep(500);
        }
      }
    }

    await sleep(150);
  }

  // 5. Verification
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🏁 KẾT QUẢ IMPORT SẢN PHẨM HOÀN TẤT:');
  console.log(`   - Tổng sản phẩm:  ${products.length}`);
  console.log(`   - Thành công:     ${successCount}`);
  console.log(`   - Thất bại:       ${failCount}`);

  if (errors.length > 0) {
    console.log('\n⚠️ Chi tiết lỗi:');
    errors.forEach(e => console.log(`   - [STT ${e.stt}] ${e.name}: ${e.error}`));
  }

  // Check remote count and inspect sample
  console.log('\n🔍 Đang kiểm tra lại sản phẩm trên API...');
  const verifyRes = await requestJson(`${API_BASE}/products`);
  if (verifyRes.status === 200 && Array.isArray(verifyRes.data)) {
    console.log(`🎉 Xác nhận: Hệ thống hiện có ${verifyRes.data.length} sản phẩm hoạt động!`);
    if (verifyRes.data.length > 0) {
      const sample = verifyRes.data[0];
      console.log(`\n📦 Mẫu sản phẩm đã lưu (ID: ${sample.id}, ${sample.name}):`);
      console.log('   Price:', sample.price);
      console.log('   Attributes:', JSON.stringify(sample.attributes, null, 2));
    }
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Fatal error during import:', err);
  process.exit(1);
});
