// lib/content.js
// 讀取 content/ 底下的 Markdown，建立全站索引（網址、標題、別名、標題錨點），
// 供動態路由與 wiki-link 解析使用。只在建置時（getStaticProps/getStaticPaths）執行。

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
import { WIKI_RE, findHeading } from './markdown/remarkWikiLink';

export const CONTENT_DIR = path.join(process.cwd(), 'content');

const isProd = process.env.NODE_ENV === 'production';

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

// content/basic/index.md → 'basic'；content/clinical/diseases/cardiology.md → 'clinical/diseases/cardiology'
function fileToSlug(file) {
  const rel = path.relative(CONTENT_DIR, file).replace(/\\/g, '/').replace(/\.md$/, '');
  return rel === 'index' ? '' : rel.replace(/\/index$/, '');
}

// mdast 節點的純文字（標題錨點用，需與 rehype 階段的 hast-util-to-string 結果一致）
function mdastText(node) {
  if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'inlineMath') return node.value;
  return (node.children || []).map(mdastText).join('');
}

// 依出現順序替 h2~h4 產生錨點 id；render 階段用同一套規則，兩邊才會對得上
function parseMarkdown(markdown) {
  return unified().use(remarkParse).use(remarkGfm, { singleTilde: false }).use(remarkCjkFriendly).use(remarkDirective).use(remarkMath).parse(markdown);
}

export function collectHeadings(markdown) {
  const tree = parseMarkdown(markdown);
  const slugger = new GithubSlugger();
  const headings = [];
  const visit = (node) => {
    if (node.type === 'heading' && node.depth >= 2 && node.depth <= 4) {
      const text = mdastText(node).trim();
      headings.push({ depth: node.depth, text, id: slugger.slug(text) });
    }
    (node.children || []).forEach(visit);
  };
  visit(tree);
  return headings;
}

// YAML 的 `date: 2026-10-13` 會被解析成 UTC 午夜的 Date，所以取 UTC 的年月日才是原本寫的日期
function normalizeFrontmatter(value) {
  if (value instanceof Date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
  }
  if (Array.isArray(value)) return value.map(normalizeFrontmatter);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeFrontmatter(v)]));
  }
  return value;
}

let cache = null;

export function getAllPages() {
  if (cache && isProd) return cache;
  const pages = walk(CONTENT_DIR).map((file) => {
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    const slug = fileToSlug(file);
    return {
      slug,
      url: '/' + slug,
      file,
      frontmatter: normalizeFrontmatter(data),
      content,
      headings: collectHeadings(content),
    };
  }).filter((p) => !(isProd && p.frontmatter.draft));
  cache = pages;
  return pages;
}

export function getPageBySlug(slug) {
  return getAllPages().find((p) => p.slug === slug) || null;
}

// wiki-link 解析表：slug、標題、別名都能當連結目標
export function buildLinkIndex(pages = getAllPages()) {
  const byKey = new Map();
  for (const p of pages) {
    const keys = [p.slug, p.slug.split('/').pop(), p.frontmatter.title, ...(p.frontmatter.aliases || [])];
    for (const k of keys) {
      if (k && !byKey.has(String(k).toLowerCase())) byKey.set(String(k).toLowerCase(), p);
    }
  }
  return byKey;
}

// 逐篇筆記的來源資料（:::source{from="…"} 用），id 為檔名
export function getJournalSources(pages = getAllPages()) {
  const sources = {};
  for (const p of pages) {
    if (!p.slug.startsWith('journal/')) continue;
    const id = p.slug.split('/').pop();
    const { date, event, speaker, title } = p.frontmatter;
    sources[id] = { date, event: event || title, speaker: Array.isArray(speaker) ? speaker.join('、') : speaker, url: p.url };
  }
  return sources;
}

// 段落標題的層級路徑，例如「急性腹痛 › 依位置的鑑別診斷」：該標題加上它的上一層標題
function headingPath(headings, index) {
  const path = [headings[index]];
  for (let k = index - 1; k >= 0 && path.length < 2; k--) {
    if (headings[k].depth < path[0].depth) path.unshift(headings[k]);
  }
  return path.map((h) => h.text);
}

// 逆連結的一筆來源：來源頁的某個段落
export function backlinkEntry(page, headingIndex) {
  const h = page.headings[headingIndex];
  return { url: `${page.url}#${h.id}`, page: page.frontmatter.title || page.slug, path: headingPath(page.headings, headingIndex) };
}

let backlinkCache = null;

// 逆連結表：{ 目標 slug: { 目標段落 id: [來源段落…] } }。只收「指到段落」的跨頁 wiki-link，
// 同頁連結、只指到頁面的連結、noindex 頁（樣式樣張）發出的連結都不算；同一個來源段落只記一次
export function buildBacklinks(pages = getAllPages(), linkIndex = buildLinkIndex(pages)) {
  if (backlinkCache && isProd) return backlinkCache;
  const table = {};
  for (const source of pages) {
    if (source.frontmatter.noindex) continue;
    let hi = -1;
    const visit = (node) => {
      if (node.type === 'heading' && node.depth >= 2 && node.depth <= 4) hi += 1;
      if (node.type === 'text' && hi >= 0 && node.value.includes('[[')) {
        for (const [, pageRef = '', headingRef] of node.value.matchAll(WIKI_RE)) {
          if (!pageRef.trim() || !headingRef) continue;
          const target = linkIndex.get(pageRef.trim().toLowerCase());
          if (!target || target === source) continue;
          const heading = findHeading(target.headings, headingRef);
          if (!heading) continue;
          const entry = backlinkEntry(source, hi);
          const list = ((table[target.slug] ||= {})[heading.id] ||= []);
          if (!list.some((e) => e.url === entry.url)) list.push(entry);
        }
      }
      (node.children || []).forEach(visit);
    };
    visit(parseMarkdown(source.content));
  }
  backlinkCache = table;
  return table;
}

let sourceUsageCache = null;

// 逐篇筆記被整合到哪些段落：掃描全站的 :::source{from="<id>"}，{ 逐篇筆記 id: [來源標註所在段落…] }
export function buildSourceUsage(pages = getAllPages()) {
  if (sourceUsageCache && isProd) return sourceUsageCache;
  const table = {};
  for (const page of pages) {
    if (page.frontmatter.noindex || page.slug.startsWith('journal/')) continue;
    let hi = -1;
    const visit = (node) => {
      if (node.type === 'heading' && node.depth >= 2 && node.depth <= 4) hi += 1;
      if (node.type === 'containerDirective' && node.name === 'source' && node.attributes?.from) {
        const entry = hi >= 0 ? backlinkEntry(page, hi) : { url: page.url, page: page.frontmatter.title || page.slug, path: [] };
        const list = (table[node.attributes.from] ||= []);
        if (!list.some((e) => e.url === entry.url)) list.push(entry);
      }
      (node.children || []).forEach(visit);
    };
    visit(parseMarkdown(page.content));
  }
  sourceUsageCache = table;
  return table;
}
