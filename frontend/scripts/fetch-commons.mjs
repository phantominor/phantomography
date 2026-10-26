// scripts/fetch-commons.mjs
// 從 Wikimedia Commons 找圖、下載、轉 WebP 存進 public/media/，並印出圖說要用的出處字串。
//   node scripts/fetch-commons.mjs search <關鍵字> [數量]
//       列出搜尋結果：檔名、尺寸、授權（不能用的授權會標 ✗）
//   node scripts/fetch-commons.mjs get "<File:檔名>" <輸出檔，相對 public/，例如 media/commons/koplik-spots.webp> [--crop=左,上,寬,高]
//       下載長邊 1200 px 的版本，裁切座標以下載後的圖為準；授權不在允許清單內就拒絕
//   node scripts/fetch-commons.mjs info "<File:檔名>"
//       只印尺寸與出處字串（決定裁切範圍用）
//   node scripts/fetch-commons.mjs url <圖片網址> <輸出檔> [--crop=…]
//       Commons 以外的來源（DermNet 等）：只下載轉檔，授權與出處自行確認後手寫進圖說
// 允許的授權：公眾領域、CC0、各種 CC（網站確定永不商業化，NC 可用）；ND 不能裁切，只能整張縮放轉檔

import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'phantomography/0.1 (medical notes; https://phantomography.vercel.app)';
const MAX_EDGE = 1200; // 內文欄寬約 700 px，1200 已足夠高解析螢幕

const stripHtml = (s = '') => s.replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s*\(?[\w.+-]+@[\w-]+\.[\w.]+\)?/g, '') // 作者欄位裡的 email 不放進圖說
  .replace(/\s+/g, ' ').trim();
const allowed = (license) => /^(public domain|pd|cc0|cc by)/i.test(license);
const noDerivs = (license) => /\bnd\b/i.test(license.replace(/-/g, ' '));

// Commons 會限流（429）：依 Retry-After 或遞增秒數重試
async function get(url) {
  for (let n = 1; n <= 6; n++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status !== 429) {
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return res;
    }
    const wait = Number(res.headers.get('retry-after')) || 10 * n;
    console.error(`限流，等 ${wait} 秒`);
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
  throw new Error(`一直被限流：${url}`);
}

async function api(params) {
  return (await get(`${API}?${new URLSearchParams({ format: 'json', ...params })}`)).json();
}

const IIPROP = { prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiextmetadatafilter: 'LicenseShortName|Artist|Credit' };

function describe(page) {
  const ii = page.imageinfo?.[0];
  const m = ii?.extmetadata || {};
  const license = stripHtml(m.LicenseShortName?.value) || '未知';
  const author = stripHtml(m.Artist?.value) || stripHtml(m.Credit?.value) || '未知作者';
  return { title: page.title, ii, license, author, ok: allowed(license), pageUrl: ii?.descriptionurl };
}

// 圖說的出處段：「作者，授權，Wikimedia Commons | 檔案頁網址」（rehypeElements 會把網址變成連結）
const credit = (d) => `${d.author}，${d.license}，Wikimedia Commons | ${d.pageUrl}`;

const [cmd, arg, out, ...flags] = process.argv.slice(2);

if (cmd === 'search' && arg) {
  const data = await api({ action: 'query', generator: 'search', gsrnamespace: 6, gsrsearch: arg, gsrlimit: out || 15, ...IIPROP });
  const pages = Object.values(data.query?.pages || {}).sort((a, b) => a.index - b.index);
  for (const p of pages) {
    const d = describe(p);
    console.log(`${d.ok ? '✓' : '✗'} ${d.title}  ${d.ii?.width}x${d.ii?.height}  ${d.license}  ${d.author.slice(0, 40)}`);
  }
} else if ((cmd === 'get' || cmd === 'info') && arg) {
  const data = await api({ action: 'query', titles: arg, iiurlwidth: MAX_EDGE, ...IIPROP });
  const page = Object.values(data.query?.pages || {})[0];
  if (!page?.imageinfo) throw new Error(`找不到 ${arg}`);
  const d = describe(page);
  if (!d.ok) {
    console.error(`✗ 授權不允許：${d.license}`);
    process.exit(1);
  }
  const src = d.ii.thumburl || d.ii.url;
  const buf = Buffer.from(await (await get(src)).arrayBuffer());
  const { width, height } = await sharp(buf).metadata();
  if (cmd === 'info') {
    console.log(`${width} x ${height}`);
    console.log(credit(d));
    process.exit(0);
  }
  if (!out) throw new Error('缺輸出檔');
  const crop = flags.find((f) => f.startsWith('--crop='));
  if (crop && noDerivs(d.license)) {
    console.error(`✗ ${d.license} 禁止改作，不能裁切，請整張使用`);
    process.exit(1);
  }
  await save(buf, out, crop);
  console.log(credit(d));
} else if (cmd === 'url' && arg && out) {
  await save(Buffer.from(await (await get(arg)).arrayBuffer()), out, flags.find((f) => f.startsWith('--crop=')));
  console.log('授權與出處請到來源網站確認後手寫進圖說');
} else {
  console.error('用法：search <關鍵字> [數量] | info "<File:檔名>" | get "<File:檔名>" <輸出檔> [--crop=左,上,寬,高] | url <圖片網址> <輸出檔> [--crop=…]');
  process.exit(1);
}

async function save(buf, out, crop) {
  let img = sharp(buf).rotate();
  if (crop) {
    const [left, top, w, h] = crop.slice(7).split(',').map(Number);
    img = img.extract({ left, top, width: w, height: h });
  }
  img = img.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 });
  const dest = path.join(ROOT, 'public', out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const info = await img.toFile(dest);
  console.log(`已存 ${out}（${info.width} x ${info.height}，${Math.round(info.size / 1024)} KB）`);
}
