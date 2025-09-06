const fs = require('fs');
const path = require('path');

const VIEWS_DIR = path.join(process.cwd(), 'public', 'views');

function getAllHtmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) return getAllHtmlFiles(fp);
    return fp.endsWith('.html') ? [fp] : [];
  });
}

function replaceNavToggle(content) {
  return content.replace(
    /<button\s+class="nav-toggle"\s+id="mobile-nav-toggle">[\s\S]*?<\/button>/g,
    '<button class="nav-toggle" id="mobile-nav-toggle">☰</button>'
  );
}

function replaceTechIcons(content) {
  const icons = ['🖥️', '⚡', '💾', '🎮'];
  let index = 0;
  return content.replace(/<div\s+class="floating-element\s+tech-icon"[^>]*>[\s\S]*?<\/div>/g, () => {
    const emoji = icons[index % icons.length];
    index += 1;
    return `<div class="floating-element tech-icon">${emoji}</div>`;
  });
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  content = replaceNavToggle(content);
  content = replaceTechIcons(content);
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Reverted icons in', path.relative(process.cwd(), file));
  }
}

function main() {
  if (!fs.existsSync(VIEWS_DIR)) {
    console.error('views directory not found');
    process.exit(1);
  }
  const files = getAllHtmlFiles(VIEWS_DIR);
  files.forEach(processFile);
}

main();


