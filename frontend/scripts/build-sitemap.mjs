// scripts/build-sitemap.mjs
// 從 content/ 產生 public/sitemap.xml 與 public/robots.txt，由 npm 的 prebuild 自動執行。
// draft、noindex 的頁面不列入；lastmod 取 frontmatter 的 updated（沒有就省略）。

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://phantomography.vercel.app';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const PUBLIC_DIR = path.join(ROOT, 'public');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

function fileToUrl(file) {
  const rel = path.relative(CONTENT_DIR, file).replace(/\\/g, '/').replace(/\.md$/, '');
  if (rel === 'index') return '/';
  return '/' + rel.replace(/\/index$/, '');
}

// gray-matter 會把 2026-10-13 解析成 UTC 的 Date，用 UTC 欄位取回原本的日期
function dateString(value) {
  if (value instanceof Date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
  }
  return value ? String(value) : '';
}

const urls = [];
for (const file of walk(CONTENT_DIR)) {
  const { data } = matter(fs.readFileSync(file, 'utf8'));
  if (data.draft || data.noindex) continue;
  const lastmod = dateString(data.updated);
  urls.push({ loc: SITE_URL + fileToUrl(file), lastmod });
}
urls.sort((a, b) => a.loc.localeCompare(b.loc));

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`[sitemap] ${urls.length} 頁 → public/sitemap.xml`);
