/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const dirs = [
  'src/components/sections',
  'src/components/gift-sections'
];

dirs.forEach(dir => {
  const fullDir = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullDir)) return;
  const files = fs.readdirSync(fullDir);
  
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(fullDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace section paddings
      let newContent = content.replace(/className="([^"]*)py-(24|28|32|36)([^"]*)"/g, 'className="$1py-16 lg:py-20$3"');
      
      // Replace text-vinex-black in headings (text-3xl / text-4xl) to text-vinex-teal
      if (!newContent.includes('bg-vinex-black') && !newContent.includes('bg-vinex-blue')) {
        newContent = newContent.replace(/(<h[23][^>]*className="[^"]*)text-vinex-black([^"]*"[^>]*>)([^<]*)(<\/h[23]>)/g, (match, p1, p2, p3, p4) => {
           // We add the gold line under the heading as well
           // The structure is roughly: <h2 className="...text-vinex-teal...">Title</h2>\n<div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
           // Only add if it doesn't already have one immediately following.
           return p1 + 'text-vinex-teal' + p2 + p3 + p4 + '\n          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>';
        });
      }

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated ' + file);
      }
    }
  });
});
