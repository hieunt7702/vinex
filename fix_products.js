const fs = require('fs');

// 1. Update src/app/[locale]/san-pham/page.tsx
let pageContent = fs.readFileSync('src/app/[locale]/san-pham/page.tsx', 'utf8');
pageContent = pageContent.replace('import Image from \'next/image\';', 'import Image from \'next/image\';\nimport { products } from \'@/data/products\';');
pageContent = pageContent.replace(/const DUMMY_PRODUCTS = \[[\s\S]*?\];\n/, '');
pageContent = pageContent.replace(/DUMMY_PRODUCTS/g, 'products');
pageContent = pageContent.replace(/Hạt điều và sản phẩm từ hạt/g, 'Hạt & sản phẩm từ hạt');
pageContent = pageContent.replace(/Trà, thảo mộc, cà phê/g, 'Trà & cà phê');
pageContent = pageContent.replace(/Bánh, bánh quy, kẹo/g, 'Bánh & kẹo');
pageContent = pageContent.replace(/Trái cây sấy, mận sấy/g, 'Nông sản chế biến');
pageContent = pageContent.replace('<aside className="w-full md:w-[240px] shrink-0">', '<aside className="w-full md:w-[240px] shrink-0 sticky top-32">');
fs.writeFileSync('src/app/[locale]/san-pham/page.tsx', pageContent);

// 2. Update src/app/[locale]/san-pham/[slug]/page.tsx
let slugContent = fs.readFileSync('src/app/[locale]/san-pham/[slug]/page.tsx', 'utf8');
slugContent = slugContent.replace('import Image from \'next/image\';', 'import Image from \'next/image\';\nimport { products } from \'@/data/products\';');
slugContent = slugContent.replace('const { slug } = await params;', 'const { slug } = await params;\n  const product = products.find(p => p.slug === slug) || products[0];');
slugContent = slugContent.replace(/slug\.replace\(\/-\/g, ' '\)/g, 'product.name');
slugContent = slugContent.replace(/<span className=\"text-vinex-charcoal\">{slug}<\/span>/g, '<span className=\"text-vinex-charcoal\">{product.name}</span>');
slugContent = slugContent.replace(/alt={slug}/g, 'alt={product.name}');
slugContent = slugContent.replace(/src=\"\/images\/product\/Bao bi hat dieu sieu thi 1\.png\"/g, 'src={product.img}');
slugContent = slugContent.replace(/src={\`\/images\/product\/Bao bi hat dieu sieu thi 1\.png\`}/g, 'src={product.img}');
fs.writeFileSync('src/app/[locale]/san-pham/[slug]/page.tsx', slugContent);
