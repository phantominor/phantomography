// lib/markdown/rehypeElements.js
// 表格包一層（手機可橫向捲動）、圖片路徑加上 MEDIA_BASE_URL 並把有 title 的圖片轉成圖說、外部連結開新分頁

import { visit } from 'unist-util-visit';

const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '/media/';

export default function rehypeElements() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'table' && !parent?.properties?.className?.includes('table-wrap')) {
        parent.children[index] = {
          type: 'element', tagName: 'div', properties: { className: ['table-wrap'] }, children: [node],
        };
        return;
      }

      if (node.tagName === 'img') {
        const src = String(node.properties.src || '');
        if (src.startsWith('media/')) node.properties.src = MEDIA_BASE + src.slice('media/'.length);
        node.properties.loading = 'lazy';
        return;
      }

      // 段落裡只有一張圖：轉成 <figure>，title 當圖說
      if (node.tagName === 'p') {
        const kids = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
        if (kids.length === 1 && kids[0].tagName === 'img') {
          const img = kids[0];
          const caption = img.properties.title;
          delete img.properties.title;
          node.tagName = 'figure';
          node.children = [img];
          if (caption) node.children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] });
        }
        return;
      }

      if (node.tagName === 'a' && /^https?:\/\//.test(String(node.properties.href || ''))) {
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
      }
    });
  };
}
