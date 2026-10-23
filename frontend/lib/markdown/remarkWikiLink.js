// lib/markdown/remarkWikiLink.js
// Obsidian 相容的 wiki-link：[[頁面]]、[[頁面#標題]]、[[頁面#標題|顯示文字]]、[[#同頁標題]]
// 頁面可用 slug、中文標題或 aliases；找不到目標時渲染成失效樣式並記錄警告。

import { visit, SKIP } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';

export const WIKI_RE = /\[\[([^\]|#]*)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;

export function findHeading(headings, text) {
  const wanted = text.trim();
  const slug = new GithubSlugger().slug(wanted);
  return headings.find((h) => h.text === wanted || h.id === slug) || null;
}

export default function remarkWikiLink({ linkIndex, currentPage, warnings }) {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || !node.value.includes('[[')) return;
      const parts = [];
      let last = 0;
      for (const m of node.value.matchAll(WIKI_RE)) {
        const [raw, pageRef = '', headingRef, label] = m;
        if (m.index > last) parts.push({ type: 'text', value: node.value.slice(last, m.index) });
        last = m.index + raw.length;

        const page = pageRef.trim() ? linkIndex.get(pageRef.trim().toLowerCase()) : currentPage;
        const heading = page && headingRef ? findHeading(page.headings, headingRef) : null;
        const ok = page && (!headingRef || heading);
        const text = label || headingRef || page?.frontmatter.title || pageRef;

        if (!ok) {
          warnings.push(`失效連結：${raw}`);
          parts.push({
            type: 'emphasis', // 只借用節點型別，實際輸出由 hName 決定
            data: { hName: 'span', hProperties: { className: ['broken-link'], title: '找不到連結目標' } },
            children: [{ type: 'text', value: text }],
          });
          continue;
        }
        const samePage = page === currentPage;
        const url = (samePage ? '' : page.url) + (heading ? `#${heading.id}` : '');
        parts.push({
          type: 'link',
          url: url || page.url,
          data: { hProperties: { className: ['wiki-link'] } },
          children: [{ type: 'text', value: text }],
        });
      }
      if (!parts.length) return;
      if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
      parent.children.splice(index, 1, ...parts);
      return [SKIP, index + parts.length];
    });
  };
}
