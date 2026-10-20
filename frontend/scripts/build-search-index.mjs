// scripts/build-search-index.mjs
// 從 content/ 的 Markdown 產生全站搜尋索引 public/search-index.json（以 h2/h3 段落為單位）。
// 欄位：p 頁名、u 網址、s 段落標題、i 錨點、t 內文、k 連結目標關鍵字（只比對不顯示）、g 大分頁標籤、c 臨床分類。
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
const CHARTS_DIR = path.join(CONTENT_DIR, '_charts');

// 共用流程圖（格式同 lib/charts.js）
function loadChart(id) {
  const file = path.join(CHARTS_DIR, `${id}.mmd`);
  if (!/^[a-z0-9-]+$/.test(id) || !fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').trim().split('\n');
  const m = lines[0]?.match(/^%%\s*title:\s*(.+)$/);
  return { meta: m ? m[1].trim() : '', value: (m ? lines.slice(1) : lines).join('\n') };
}

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

// Mermaid 流程圖：圖標題 + 節點與連線上的文字（["…"]、{{"…"}}、("…")、|"…"|）
function mermaidText(node) {
  const labels = [...node.value.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
  const text = [node.meta || '', ...labels].join(' ');
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/#60;/g, '<')
    .replace(/#62;/g, '>');
}

// 段落內文：手寫 HTML（表格）去掉標籤，表格儲存格以空白分隔
function blockText(node) {
  if (node.type === 'code') return node.lang === 'mermaid' ? mermaidText(node) : node.value;
  if (node.type === 'leafDirective' && node.name === 'chart') {
    const chart = loadChart(node.attributes?.id || '');
    return chart ? mermaidText(chart) : '';
  }
  if (node.type === 'html') return node.value.replace(/<[^>]+>/g, ' ');
  if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'inlineMath' || node.type === 'math') return node.value;
  const sep = ['table', 'tableRow', 'list', 'listItem', 'containerDirective'].includes(node.type) ? ' ' : '';
  return (node.children || []).map(blockText).join(sep);
}

// 頁面位置標籤：大分頁（基醫、臨醫、隨筆）+ 臨床醫學的分類
const CLINICAL = {
  diseases: '諸病微精', complaints: '病患主訴', tests: '檢查檢驗', treatments: '治療處置',
  skills: '臨床技能', general: '臨床通論', oncall: '值班要點', cases: '案例回顧',
};
function locationOf(url) {
  const [, top, sub] = url.split('/');
  if (top === 'basic') return { tag: '基醫', cat: '' };
  if (top === 'clinical') return { tag: '臨醫', cat: CLINICAL[sub] || '' };
  if (top === 'journal') return { tag: '隨筆', cat: '' };
  return { tag: '', cat: '' };
}

// [[頁面#標題|文字]] → 顯示文字；連結目標（頁名、標題，常含英文全名與縮寫）另存成只用來比對的關鍵字
const WIKI_RE = /\[\[([^\]|#]*)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
function stripWikiLinks(text, keywords) {
  return text.replace(WIKI_RE, (_, page = '', heading = '', label = '') => {
    if (page.trim()) keywords.add(page.trim());
    if (heading.trim()) keywords.add(heading.trim());
    return label || heading || page;
  });
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

  const { tag, cat } = locationOf(url);
  let current = { p: pageTitle, u: url, s: '', i: '', t: [] };
  const flush = () => {
    const keywords = new Set();
    const text = stripWikiLinks(current.t.join(' '), keywords).replace(/\s+/g, ' ').trim();
    const k = [...keywords].join(' ');
    if (current.s || text) entries.push({ p: current.p, u: current.u, s: stripWikiLinks(current.s, keywords), i: current.i, t: text, k, g: tag, c: cat });
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
