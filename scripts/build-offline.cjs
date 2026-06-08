// Build a self-contained offline HTML file with all assets inlined
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Inline CSS
html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/([^"]+)">/g, (match, href) => {
  const cssPath = path.join(distDir, href);
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf-8');
    return `<style>${css}</style>`;
  }
  return match;
});

// Inline JS
html = html.replace(/<script type="module" crossorigin src="\.\/([^"]+)"><\/script>/g, (match, href) => {
  const jsPath = path.join(distDir, href);
  if (fs.existsSync(jsPath)) {
    const js = fs.readFileSync(jsPath, 'utf-8');
    return `<script type="module">${js}</script>`;
  }
  return match;
});

// Remove external manifest link (not needed offline)
html = html.replace(/<link rel="manifest" href="[^"]+">\s*/g, '');

// Remove SW registration (not needed for offline file)
html = html.replace(/<script>\s*if \('serviceWorker' in navigator\)[\s\S]*?<\/script>/, '');

fs.writeFileSync(path.join(distDir, 'offline.html'), html);
const sizeKB = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`Offline HTML created: ${sizeKB} KB`);
