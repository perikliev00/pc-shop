const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function decodeWithBom(buffer) {
  // UTF-8 BOM
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return buffer.toString('utf8', 3);
  }
  // UTF-16 LE BOM
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    return buffer.toString('utf16le', 2);
  }
  // UTF-16 BE BOM
  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    // Convert BE → LE by swapping bytes
    const swapped = Buffer.alloc(buffer.length - 2);
    for (let i = 2; i < buffer.length; i += 2) {
      swapped[i - 2] = buffer[i + 1];
      swapped[i - 1] = buffer[i];
    }
    return swapped.toString('utf16le');
  }
  // Default assume UTF-8
  return buffer.toString('utf8');
}

function restoreFile(filePath) {
  try {
    if (!filePath.endsWith('.html')) return;

    const raw = fs.readFileSync(filePath);
    let content = decodeWithBom(raw);

    // Clean obvious corruption artifacts without touching real content
    content = content
      // Remove stray bullets that were inserted between characters
      .replace(/•/g, '')
      // Fix double replacement char sequences for copyright symbol
      .replace(/��/g, '©')
      .replace(/\uFFFD\uFFFD/g, '©');

    if (!content.endsWith('\n')) content += '\n';
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    console.log(`Restored (UTF-8): ${path.relative(process.cwd(), filePath)}`);
  } catch (err) {
    console.error(`Failed to restore ${filePath}:`, err.message);
  }
}

function main() {
  const viewsDir = path.join(process.cwd(), 'public', 'views');
  if (!fs.existsSync(viewsDir)) {
    console.error('views directory not found:', viewsDir);
    process.exit(1);
  }
  const files = walk(viewsDir).filter((p) => p.endsWith('.html'));
  files.forEach(restoreFile);
}

main();


