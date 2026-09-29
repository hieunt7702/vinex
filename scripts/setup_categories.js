const https = require('https');

const categoriesToEnsure = [
  { name: 'Bánh quy', slug: 'banh-quy', description: 'Các sản phẩm bánh quy cao cấp Petite Delights và Vinex' },
  { name: 'Bánh khác', slug: 'banh-khac', description: 'Thanh ngũ cốc gạo lứt và các loại bánh dinh dưỡng Petite Delights' },
  { name: 'Cacao', slug: 'cacao', description: 'Bột cacao nguyên chất cao cấp' },
  { name: 'Kẹo', slug: 'keo', description: 'Kẹo socola trái cây Medley và kẹo socola Delicia Sweets' },
  { name: 'Mứt sấy dẻo', slug: 'mut-say-deo', description: 'Mận và trái cây sấy dẻo tự nhiên Golden Grove' },
  { name: 'Sấy thăng hoa', slug: 'say-thang-hoa', description: 'Trái cây sấy thăng hoa công nghệ cao Golden Grove' },
  { name: 'Trà', slug: 'tra', description: 'Trà đen, trà xanh và trà hoa quả đặc sản Vinex' },
  { name: 'Cafe', slug: 'cafe', description: 'Cà phê nguyên chất, hòa tan và đặc sản Vinex' },
  { name: 'Hạt', slug: 'hat-dinh-duong', description: 'Hạt điều tẩm vị, hạnh nhân Orchard Nuts cao cấp' },
];

function fetchCategories() {
  return new Promise((resolve, reject) => {
    https.get('https://api.vinexgroup.vn/v1/categories', res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

function createCategory(cat) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: cat.name,
      slug: cat.slug,
      type: 'Sản phẩm',
      description: cat.description,
      status: 'ACTIVE'
    });
    const req = https.request('https://api.vinexgroup.vn/v1/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'x-user-id': '1',
        'x-user-role': 'ADMIN'
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve(body); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  const existing = await fetchCategories();
  console.log('Existing categories:', existing.map(c => ({ id: c.id, name: c.name, slug: c.slug })));
  const existingNames = new Set(existing.map(c => c.name));
  
  for (const cat of categoriesToEnsure) {
    if (!existingNames.has(cat.name)) {
      console.log('Creating category:', cat.name);
      const created = await createCategory(cat);
      console.log('Created:', created.id, created.name);
    }
  }

  const finalCats = await fetchCategories();
  console.log('\nFinal categories list on API:');
  finalCats.forEach(c => console.log('  ID ' + c.id + ': ' + c.name + ' (' + c.slug + ')'));
}

run().catch(console.error);
