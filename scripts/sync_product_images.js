const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'images', 'product');

// Map of canonical/requested names to source files
const copies = [
  // Xoai say deo
  { dest: 'Xoai say deo 1.png', src: 'xoài sấy dẻo.png' },
  { dest: 'xoai-say-deo.png', src: 'xoài sấy dẻo.png' },
  { dest: 'xoai say deo 1.png', src: 'xoài sấy dẻo.png' },
  // Tra
  { dest: "Tra' premium Essiora 1.png", src: 'Trà premium Essiora 1.png' },
  { dest: 'Tra 1.png', src: 'Trà premium Essiora 1.png' },
  { dest: 'tra-1.png', src: 'Trà premium Essiora 1.png' },
  { dest: "Tra' premium Essiora 2.png", src: 'Trà premium Essiora 2.png' },
  { dest: 'Tra 2.png', src: 'Trà premium Essiora 2.png' },
  { dest: 'tra-2.png', src: 'Trà premium Essiora 2.png' },
  // Banh keo
  { dest: 'banh nguyen cam 1.png', src: 'Premium petite delights.png' },
  { dest: 'banh nguyen cam 2.png', src: 'kẹo Delicia.png' },
  // Nam huong
  { dest: 'Nam huong 1.png', src: 'Nấm sấy nguyên vị.png' },
  { dest: 'Nam huong 2.png', src: 'Nấm sấy tỏi ớt.png' },
  // Trai cay say
  { dest: 'Mit say 1.png', src: 'sầu riêng sấy.png' },
  { dest: 'Chuoi say 1.png', src: 'Chanh leo sấy dẻo.png' },
  { dest: 'Thap cam say 1.png', src: 'Đủ đủ sấy dẻo.png' },
];

copies.forEach(({ dest, src }) => {
  const srcPath = path.join(dir, src);
  const destPath = path.join(dir, dest);
  if (!fs.existsSync(srcPath)) {
    console.error('Source not found:', src);
    return;
  }
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log('Created copy:', dest, '<-', src);
  } else {
    console.log('Already exists:', dest);
  }
});
console.log('Product image sync completed successfully!');
