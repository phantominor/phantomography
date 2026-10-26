// scripts/process-photo.mjs
// /ingest 處理收件匣照片用：裁切、縮到長邊 1600 px、轉 WebP，存進 public/media/。
//   node scripts/process-photo.mjs <輸入檔> --info
//       印出原圖尺寸（決定裁切範圍用）
//   node scripts/process-photo.mjs <輸入檔> <輸出檔，相對 public/，例如 media/journal/2026/20261022-type2-mi-1.webp> [--crop=左,上,寬,高]
//       裁切座標以原圖像素為單位；不給 --crop 就整張使用

import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MAX_EDGE = 1600;

const [input, output, ...flags] = process.argv.slice(2);
if (!input || !output) {
  console.error('用法：node scripts/process-photo.mjs <輸入檔> --info | <輸出檔> [--crop=左,上,寬,高]');
  process.exit(1);
}

// EXIF 方向先轉正，之後的尺寸與裁切座標都以轉正後的圖為準
const source = () => sharp(input).rotate();

if (output === '--info') {
  const { info } = await source().toBuffer({ resolveWithObject: true });
  console.log(`${info.width} x ${info.height}`);
  process.exit(0);
}

let img = sharp(await source().toBuffer());
const crop = flags.find((f) => f.startsWith('--crop='));
if (crop) {
  const [left, top, width, height] = crop.slice(7).split(',').map(Number);
  img = img.extract({ left, top, width, height });
}
img = img.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 });

const dest = path.join(ROOT, 'public', output);
fs.mkdirSync(path.dirname(dest), { recursive: true });
const info = await img.toFile(dest);
console.log(`public/${output}　${info.width} x ${info.height}，${(info.size / 1024).toFixed(0)} KB`);
