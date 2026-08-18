import fs from 'fs';
import path from 'path';

// If sharp or canvas is available, render PNGs; otherwise create SVG-based PNG placeholder or use sharp
async function main() {
  const publicIconsDir = path.resolve('public/icons');
  if (!fs.existsSync(publicIconsDir)) {
    fs.mkdirSync(publicIconsDir, { recursive: true });
  }

  const svgContent = fs.readFileSync(path.resolve('public/favicon.svg'), 'utf-8');
  fs.writeFileSync(path.join(publicIconsDir, 'icon.svg'), svgContent);
  fs.writeFileSync(path.join(publicIconsDir, 'icon-192x192.svg'), svgContent);
  fs.writeFileSync(path.join(publicIconsDir, 'icon-512x512.svg'), svgContent);
  fs.writeFileSync(path.join(publicIconsDir, 'icon-maskable-512x512.svg'), svgContent);
  
  console.log('PWA SVG icons generated in public/icons');
}

main().catch(console.error);
