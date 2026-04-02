const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

walkDir('app', (filePath) => {
  if (filePath.endsWith('page.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/import\s+\{\s*Navbar\s*\}\s+from\s+[\"']@\/components\/layout\/navbar[\"'];?\r?\n/g, '');
    content = content.replace(/\s*<Navbar\s*\/>\r?\n/g, '');
    content = content.replace(/<footer className=\"border-t border-gray-[^\"]+\">.*?<\/footer>/gs, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
