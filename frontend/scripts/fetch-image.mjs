// scripts/fetch-image.mjs
// 從開放授權圖庫找圖、下載、轉 WebP 存進 public/media/，並印出圖說要用的出處字串。
//
// Wikimedia Commons（照片、示意圖、組織切片、影像、心電圖都有，第一優先）
//   node scripts/fetch-image.mjs search <關鍵字> [數量]
//       列出結果：檔名、尺寸、授權（不能用的標 ✗）
//   node scripts/fetch-image.mjs info "<File:檔名>"
//       印尺寸與出處字串（決定裁切範圍用）
//   node scripts/fetch-image.mjs get "<File:檔名>" <輸出檔，相對 public/，例如 media/commons/koplik-spots.webp> [--crop=左,上,寬,高]
//       下載長邊 1200 px 的版本，裁切座標以下載後的圖為準
//
// Open-i（NIH，PubMed Central 論文圖片：病例照片、影像、心電圖、病理）
//   node scripts/fetch-image.mjs openi <關鍵字> [數量]
//       列出結果：圖片網址、圖說摘要、期刊與授權（授權由 Europe PMC 查詢，查不到或非 CC 的標 ✗）
//
// Openverse（彙整 Flickr、Wellcome Collection、博物館等開放圖庫的搜尋引擎）
//   node scripts/fetch-image.mjs openverse <關鍵字> [數量]
//       列出結果：授權、作者、來源、圖片網址、原始頁面
//
// 其他來源（Open-i、Openverse 的結果，或 DermNet 等）
//   node scripts/fetch-image.mjs url <圖片網址> <輸出檔> --license=<授權> [--crop=…]
//       只下載轉檔；出處照列表印出的字串（或自行確認後）手寫進圖說
//
// 授權：公眾領域、CC0、各種 CC 都可用（本站確定永不商業化，NC 可用）；ND（禁止改作）只能整張縮放轉檔，不能裁切。
// 不用自動化抓取被網站明確阻擋的來源（例如 Radiopaedia），也不偽裝瀏覽器繞過阻擋。

import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const COMMONS = 'https://commons.wikimedia.org/w/api.php';
const UA = 'phantomography/0.1 (medical notes; https://phantomography.vercel.app)';
const MAX_EDGE = 1200; // 內文欄寬約 700 px，1200 已足夠高解析螢幕

const stripHtml = (s = '') => s.replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s*\(?[\w.+-]+@[\w-]+\.[\w.]+\)?/g, '') // 作者欄位裡的 email 不放進圖說
  .replace(/\s+/g, ' ').trim();
const allowed = (license) => /^(public domain|pd|cc0|cc[ -]by)/i.test(license);
const noDerivs = (license) => /\bnd\b/i.test(license.replace(/-/g, ' '));
const cut = (s = '', n = 70) => (s.length > n ? `${s.slice(0, n)}…` : s);

// 各站都可能限流（429）：依 Retry-After 或遞增秒數重試
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
const getJson = async (url) => (await get(url)).json();

// ── Wikimedia Commons ──
const commonsApi = (params) => getJson(`${COMMONS}?${new URLSearchParams({ format: 'json', ...params })}`);
const IIPROP = { prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiextmetadatafilter: 'LicenseShortName|Artist|Credit' };

function describe(page) {
  const ii = page.imageinfo?.[0];
  const m = ii?.extmetadata || {};
  const license = stripHtml(m.LicenseShortName?.value) || '未知';
  const author = stripHtml(m.Artist?.value) || stripHtml(m.Credit?.value) || '未知作者';
  return { title: page.title, ii, license, author, ok: allowed(license), pageUrl: ii?.descriptionurl };
}
// 圖說的出處段：「作者，授權，來源 | 網址」（rehypeElements 會把網址變成連結）
const commonsCredit = (d) => `${d.author}，${d.license}，Wikimedia Commons | ${d.pageUrl}`;

// ── Open-i + Europe PMC 授權 ──
async function pmcLicense(pmcid) {
  const q = new URLSearchParams({ query: `PMCID:PMC${pmcid}`, format: 'json', resultType: 'core' });
  const r = (await getJson(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?${q}`)).resultList?.result?.[0];
  return r?.license ? r.license.toUpperCase().replace(/^CC /, 'CC ') : '';
}

const [cmd, arg, out, ...rest] = process.argv.slice(2);
const flags = [out, ...rest].filter((f) => f?.startsWith('--'));
const flag = (name) => flags.find((f) => f.startsWith(`--${name}=`))?.split('=').slice(1).join('=');

async function save(buf, dest, crop) {
  let img = sharp(buf).rotate();
  if (crop) {
    const [left, top, w, h] = crop.split(',').map(Number);
    img = img.extract({ left, top, width: w, height: h });
  }
  img = img.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 });
  const file = path.join(ROOT, 'public', dest);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const info = await img.toFile(file);
  console.log(`已存 ${dest}（${info.width} x ${info.height}，${Math.round(info.size / 1024)} KB）`);
}

function refuseCropIfNd(license) {
  if (flag('crop') && noDerivs(license)) {
    console.error(`✗ ${license} 禁止改作，不能裁切，請整張使用`);
    process.exit(1);
  }
}

if (cmd === 'search' && arg) {
  const data = await commonsApi({ action: 'query', generator: 'search', gsrnamespace: 6, gsrsearch: arg, gsrlimit: out || 15, ...IIPROP });
  for (const p of Object.values(data.query?.pages || {}).sort((a, b) => a.index - b.index)) {
    const d = describe(p);
    console.log(`${d.ok ? '✓' : '✗'} ${d.title}  ${d.ii?.width}x${d.ii?.height}  ${d.license}  ${cut(d.author, 40)}`);
  }
} else if ((cmd === 'get' || cmd === 'info') && arg) {
  const data = await commonsApi({ action: 'query', titles: arg, iiurlwidth: MAX_EDGE, ...IIPROP });
  const page = Object.values(data.query?.pages || {})[0];
  if (!page?.imageinfo) throw new Error(`找不到 ${arg}`);
  const d = describe(page);
  if (!d.ok) {
    console.error(`✗ 授權不允許：${d.license}`);
    process.exit(1);
  }
  const buf = Buffer.from(await (await get(d.ii.thumburl || d.ii.url)).arrayBuffer());
  if (cmd === 'info') {
    const { width, height } = await sharp(buf).metadata();
    console.log(`${width} x ${height}`);
  } else {
    if (!out || out.startsWith('--')) throw new Error('缺輸出檔');
    refuseCropIfNd(d.license);
    await save(buf, out, flag('crop'));
  }
  console.log(commonsCredit(d));
} else if (cmd === 'openi' && arg) {
  const q = new URLSearchParams({ query: arg, m: 1, n: out || 10, it: 'xg,ph,ct,mri,x,u,m,p,c,g' });
  const data = await getJson(`https://openi.nlm.nih.gov/api/search?${q}`);
  for (const r of data.list || []) {
    const license = await pmcLicense(r.pmcid);
    const ok = allowed(license);
    const year = r.journal_date?.year || '';
    const authors = (r.authors || '').split(',')[0] + ((r.authors || '').includes(',') ? ' 等' : '');
    console.log(`${ok ? '✓' : '✗'} ${license || '授權不明'}  ${cut(r.title, 60)}`);
    console.log(`   圖：${cut(stripHtml(r.image?.caption), 90)}`);
    console.log(`   網址：https://openi.nlm.nih.gov${r.imgLarge}`);
    const who = [authors.trim(), `${(r.journal_abbr || '').trim()} ${year}`.trim()].filter(Boolean).join('，');
    if (ok) console.log(`   出處：${who}，${license} | https://pmc.ncbi.nlm.nih.gov/articles/PMC${r.pmcid}/`);
  }
} else if (cmd === 'openverse' && arg) {
  const q = new URLSearchParams({ q: arg, page_size: out || 10 });
  const data = await getJson(`https://api.openverse.org/v1/images/?${q}`);
  for (const r of data.results || []) {
    const license = r.license === 'pdm' || r.license === 'cc0' ? (r.license === 'pdm' ? 'Public domain' : 'CC0') : `CC ${r.license.toUpperCase()} ${r.license_version || ''}`.trim();
    console.log(`✓ ${license}  ${cut(r.title, 60)}  （${r.source}）`);
    console.log(`   網址：${r.url}`);
    console.log(`   出處：${stripHtml(r.creator || '未知作者')}，${license}，${r.source} | ${r.foreign_landing_url}`);
  }
} else if (cmd === 'url' && arg && out && !out.startsWith('--')) {
  const license = flag('license');
  if (!license) throw new Error('請用 --license=<授權> 註明授權（ND 不能裁切）');
  if (!allowed(license)) {
    console.error(`✗ 授權不允許：${license}`);
    process.exit(1);
  }
  refuseCropIfNd(license);
  await save(Buffer.from(await (await get(arg)).arrayBuffer()), out, flag('crop'));
} else {
  console.error('用法：search | info | get（Commons）、openi、openverse、url <圖片網址> <輸出檔> --license=… [--crop=左,上,寬,高]');
  process.exit(1);
}
