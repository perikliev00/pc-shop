const fs = require('fs');
const path = require('path');

const VIEWS_DIR = path.join(process.cwd(), 'public', 'views');

const HAMBURGER_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

const TECH_ICON_SVG = '<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="#60a5fa" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/></svg>';

function getAllHtmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) return getAllHtmlFiles(fp);
    return fp.endsWith('.html') ? [fp] : [];
  });
}

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // 1) Replace any nav toggle inner content with a reliable inline SVG
  content = content.replace(
    /<button\s+class="nav-toggle"\s+id="mobile-nav-toggle">[\s\S]*?<\/button>/g,
    `<button class="nav-toggle" id="mobile-nav-toggle">${HAMBURGER_SVG}</button>`
  );

  // 2) Replace tech-icon emoji/question marks with inline SVG
  content = content.replace(
    /<div\s+class="floating-element\s+tech-icon">[\s\S]*?<\/div>/g,
    `<div class="floating-element tech-icon" aria-hidden="true">${TECH_ICON_SVG}</div>`
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed icons in', path.relative(process.cwd(), file));
}

function main() {
  if (!fs.existsSync(VIEWS_DIR)) {
    console.error('views directory not found');
    process.exit(1);
  }
  const files = getAllHtmlFiles(VIEWS_DIR);
  files.forEach(fixFile);
}

main();
