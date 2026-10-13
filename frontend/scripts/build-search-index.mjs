// scripts/build-search-index.mjs
// 從 content/ 的 Markdown 產生全站搜尋索引 public/search-index.json（以 h2/h3 段落為單位）。
// 由 npm 的 predev / prebuild 自動執行；開發中改了內容要重開 dev server 才會更新索引。
// 標題錨點規則必須與 lib/content.js 的 collectHeadings、lib/markdown/rehypeHeadings.js 相同。

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import GithubSlugger from 'github-slugger';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUT = path.join(ROOT, 'public', 'search-index.json');

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

// 與 lib/content.js 的 mdastText 相同
function mdastText(node) {
  if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'inlineMath') return node.value;
  return (node.children || []).map(mdastText).join('');
}

// 段落內文：手寫 HTML（表格）去掉標籤，表格儲存格以空白分隔
function blockText(node) {
  if (node.type === 'html') return node.value.replace(/<[^>]+>/g, ' ');
  if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'inlineMath' || node.type === 'math') return node.value;
  const sep = ['table', 'tableRow', 'list', 'listItem', 'containerDirective'].includes(node.type) ? ' ' : '';
  return (node.children || []).map(blockText).join(sep);
}

const parser = unified().use(remarkParse).use(remarkGfm, { singleTilde: false }).use(remarkCjkFriendly).use(remarkDirective).use(remarkMath);
const entries = [];

for (const file of walk(CONTENT_DIR)) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  if (data.draft || data.noindex) continue;
  const url = fileToUrl(file);
  const pageTitle = data.title || '';
  const tree = parser.parse(content);
  const slugger = new GithubSlugger();

  let current = { p: pageTitle, u: url, s: '', i: '', t: [] };
  const flush = () => {
    const text = current.t.join(' ').replace(/\s+/g, ' ').trim();
    if (current.s || text) entries.push({ p: current.p, u: current.u, s: current.s, i: current.i, t: text });
  };

  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth >= 2 && node.depth <= 4) {
      const text = mdastText(node).trim();
      const id = slugger.slug(text);
      if (node.depth <= 3) {
        flush();
        current = { p: pageTitle, u: url, s: text, i: id, t: [] };
      } else {
        current.t.push(text);
      }
      continue;
    }
    current.t.push(blockText(node));
  }
  flush();
}

fs.writeFileSync(OUT, JSON.stringify(entries));
console.log(`[search] ${entries.length} 個段落 → public/search-index.json（${(fs.statSync(OUT).size / 1024).toFixed(0)} KB）`);
