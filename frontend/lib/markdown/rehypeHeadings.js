// lib/markdown/rehypeHeadings.js
// h2~h4 產生錨點 id（規則與 lib/content.js 的 collectHeadings 相同）、
// h2「一、」h3「1.1」自動編號、加上段落連結圖示，並收集右側目錄（h2、h3）。
// 有其他頁面連到的段落，標題右側加逆連結按鈕（圖示 + 來源數，放在平常隱藏的段落連結圖示前面），
// 標題下方放收合的來源清單（展開由 SiteLayout 處理）。

import { visit, SKIP } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import GithubSlugger from 'github-slugger';
import { ICONS } from './icons';

const DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function toChineseNumeral(n) {
  if (n < 10) return DIGITS[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (tens === 1 ? '' : DIGITS[tens]) + '十' + DIGITS[ones];
}

const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const textNode = (value) => ({ type: 'text', value });

// 來源清單依來源頁分組
function backlinkList(entries) {
  const groups = new Map();
  for (const e of entries) {
    if (!groups.has(e.page)) groups.set(e.page, []);
    groups.get(e.page).push(e);
  }
  return el('div', { className: ['backlinks'], hidden: true }, [...groups].map(([page, list]) => el('div', { className: ['backlinks-group'] }, [
    el('div', { className: ['backlinks-page'] }, [textNode(page)]),
    el('ul', {}, list.map((e) => el('li', {}, [el('a', { className: ['wiki-link'], href: e.url }, [textNode(e.path.join(' › '))])]))),
  ])));
}

export default function rehypeHeadings({ toc, backlinks = {} }) {
  return (tree) => {
    const slugger = new GithubSlugger();
    let h2 = 0;
    let h3 = 0;
    visit(tree, 'element', (node, index, parent) => {
      const depth = { h2: 2, h3: 3, h4: 4 }[node.tagName];
      if (!depth) return;
      const text = toString(node).trim();
      const id = slugger.slug(text);
      node.properties.id = id;

      let num = '';
      if (depth === 2) {
        h2 += 1;
        h3 = 0;
        num = toChineseNumeral(h2) + '、';
      } else if (depth === 3) {
        h3 += 1;
        num = h2 ? `${h2}.${h3}` : String(h3);
      }
      if (num) {
        node.children.unshift({
          type: 'element', tagName: 'span', properties: { className: ['hnum'] }, children: [{ type: 'text', value: num }],
        });
        toc.push({ depth, id, text, num });
      }
      const entries = backlinks[id];
      const hasBacklinks = Boolean(entries?.length && parent);
      if (hasBacklinks) {
        node.children.push(el('button', {
          type: 'button',
          className: ['backlink-toggle'],
          ariaExpanded: 'false',
          ariaLabel: `${entries.length} 個段落連到這裡`,
          title: `${entries.length} 個段落連到這裡`,
        }, [{ type: 'raw', value: ICONS.backlink }, el('span', {}, [textNode(String(entries.length))])]));
      }
      node.children.push({
        type: 'element',
        tagName: 'a',
        properties: { className: ['anchor'], href: `#${id}`, ariaLabel: '段落連結' },
        children: [{ type: 'raw', value: ICONS.link }],
      });
      if (!hasBacklinks) return undefined;
      parent.children.splice(index + 1, 0, backlinkList(entries));
      return [SKIP, index + 2];
    });
  };
}
