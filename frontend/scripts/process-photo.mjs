// scripts/process-photo.mjs
// /ingest 處理收件匣照片用：透視校正或旋轉、裁切、縮到長邊 1600 px、轉 WebP，存進 public/media/。
//   node scripts/process-photo.mjs <輸入檔> --info [--perspective=…] [--rotate=度]
//       印出原圖尺寸（決定座標用）；加 --perspective、--rotate 就印處理後的尺寸（決定接著的 --crop）
//   node scripts/process-photo.mjs <輸入檔> <輸出檔，相對 public/，例如 media/journal/2026/20261022-type2-mi-1.webp> [選項]
//       --perspective=左上x,左上y,右上x,右上y,右下x,右下y,左下x,左下y
//           斜拍的投影片、白板：給四個角（原圖像素），拉成正面的長方形，四角以外的背景一併去掉
//       --rotate=度     順時針為正（-3.5 就是逆時針 3.5 度），扶正歪掉的畫面，轉出來的空角補白
//       --crop=左,上,寬,高  像素座標；有 --perspective、--rotate 時是處理後那張圖的座標
//       處理順序：透視校正 → 旋轉 → 裁切；都不給就整張使用

import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MAX_EDGE = 1600;

const [input, output, ...flags] = process.argv.slice(2);
if (!input || !output) {
  console.error('用法：node scripts/process-photo.mjs <輸入檔> --info | <輸出檔> [--perspective=8 個座標] [--rotate=度] [--crop=左,上,寬,高]');
  process.exit(1);
}
const numbers = (name, count) => {
  const v = flags.find((f) => f.startsWith(`--${name}=`))?.slice(name.length + 3);
  if (v === undefined) return null;
  const list = v.split(',').map(Number);
  if (list.length !== count || list.some((n) => !Number.isFinite(n))) {
    console.error(`--${name} 要給 ${count} 個數字`);
    process.exit(1);
  }
  return list;
};
const perspective = numbers('perspective', 8);
const rotate = numbers('rotate', 1)?.[0];
const crop = numbers('crop', 4);

// 解 8 元一次聯立（高斯消去），求把 from 四點對到 to 四點的投影轉換
function homography(from, to) {
  const A = [];
  for (let i = 0; i < 4; i += 1) {
    const [x, y] = from[i];
    const [u, v] = to[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c += 1) {
    let p = c;
    for (let r = c + 1; r < 8; r += 1) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 8; r += 1) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 9; k += 1) A[r][k] -= f * A[c][k];
    }
  }
  return A.map((row, i) => row[8] / row[i]);
}

// 透視校正：輸出寬高取四邊形對邊較長的那條，輸出的每一點反推回原圖做雙線性取樣
async function warp(buffer, pts) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const quad = [[pts[0], pts[1]], [pts[2], pts[3]], [pts[4], pts[5]], [pts[6], pts[7]]];
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const W = Math.round(Math.max(dist(quad[0], quad[1]), dist(quad[3], quad[2])));
  const H = Math.round(Math.max(dist(quad[0], quad[3]), dist(quad[1], quad[2])));
  const [a, b, c, d, e, f, g, h] = homography([[0, 0], [W - 1, 0], [W - 1, H - 1], [0, H - 1]], quad);
  const { width: sw, height: sh } = info;
  const out = Buffer.alloc(W * H * 3, 255);
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const z = g * x + h * y + 1;
      const sx = (a * x + b * y + c) / z;
      const sy = (d * x + e * y + f) / z;
      if (sx < 0 || sy < 0 || sx > sw - 1 || sy > sh - 1) continue;
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const x1 = Math.min(x0 + 1, sw - 1);
      const y1 = Math.min(y0 + 1, sh - 1);
      const fx = sx - x0;
      const fy = sy - y0;
      for (let k = 0; k < 3; k += 1) {
        const top = data[(y0 * sw + x0) * 3 + k] * (1 - fx) + data[(y0 * sw + x1) * 3 + k] * fx;
        const bottom = data[(y1 * sw + x0) * 3 + k] * (1 - fx) + data[(y1 * sw + x1) * 3 + k] * fx;
        out[(y * W + x) * 3 + k] = Math.round(top * (1 - fy) + bottom * fy);
      }
    }
  }
  return sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}

// EXIF 方向先轉正，之後的尺寸與座標都以轉正後的圖為準
let buffer = await sharp(input).rotate().toBuffer();
if (perspective) buffer = await warp(buffer, perspective);
if (rotate) buffer = await sharp(buffer).rotate(rotate, { background: '#ffffff' }).toBuffer();

if (output === '--info') {
  const { width, height } = await sharp(buffer).metadata();
  console.log(`${width} x ${height}`);
  process.exit(0);
}

let img = sharp(buffer);
if (crop) {
  const [left, top, width, height] = crop;
  img = img.extract({ left, top, width, height });
}
img = img.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 });

const dest = path.join(ROOT, 'public', output);
fs.mkdirSync(path.dirname(dest), { recursive: true });
const info = await img.toFile(dest);
console.log(`public/${output}　${info.width} x ${info.height}，${(info.size / 1024).toFixed(0)} KB`);
