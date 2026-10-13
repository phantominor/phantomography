// lib/markdown/rehypeHeadings.js
// h2~h4 產生錨點 id（規則與 lib/content.js 的 collectHeadings 相同）、
// h2「一、」h3「1.1」自動編號、加上段落連結圖示，並收集右側目錄（h2、h3）。

import { visit } from 'unist-util-visit';
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

export default function rehypeHeadings({ toc }) {
  return (tree) => {
    const slugger = new GithubSlugger();
    let h2 = 0;
    let h3 = 0;
    visit(tree, 'element', (node) => {
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
      node.children.push({
        type: 'element',
        tagName: 'a',
        properties: { className: ['anchor'], href: `#${id}`, ariaLabel: '段落連結' },
        children: [{ type: 'raw', value: ICONS.link }],
      });
    });
  };
}
