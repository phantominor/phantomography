// lib/markdown/rehypeElements.js
// 表格包一層（手機可橫向捲動）、圖片路徑加上 MEDIA_BASE_URL 並把有 title 的圖片轉成圖說、外部連結開新分頁、
// ```mermaid 程式碼區塊（```mermaid 後面接的文字是圖標題）轉成流程圖占位元素（實際繪圖在瀏覽器端，見 lib/mermaid.js）

import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
import { ICONS } from './icons';

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

      // ```mermaid 標題 → 標題列 + 流程圖占位元素（標題在建置時就輸出，可被搜尋；圖在瀏覽器端畫）
      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code'
        && String(node.children[0].properties?.className || '').includes('language-mermaid')) {
        const code = node.children[0];
        const source = code.children.map((c) => c.value || '').join('').trim();
        const title = String(code.properties?.dataTitle || '').trim(); // remarkDirectives 存進來的圖標題
        const children = [];
        if (title) {
          children.push({
            type: 'element',
            tagName: 'div',
            properties: { className: ['mermaid-title'] },
            children: [...fromHtml(ICONS.chart, { fragment: true }).children, { type: 'text', value: title }],
          });
        }
        children.push({
          type: 'element',
          tagName: 'div',
          properties: { className: ['mermaid-chart'], dataSource: source },
          children: [{ type: 'element', tagName: 'p', properties: { className: ['mermaid-loading'] }, children: [{ type: 'text', value: '流程圖載入中…' }] }],
        });
        parent.children[index] = { type: 'element', tagName: 'figure', properties: { className: ['mermaid-block'] }, children };
        return;
      }

      if (node.tagName === 'img') {
        const src = String(node.properties.src || '');
        if (src.startsWith('media/')) node.properties.src = MEDIA_BASE + src.slice('media/'.length);
        node.properties.loading = 'lazy';
        return;
      }

      // 段落裡只有一張圖：轉成 <figure>，title 當圖說
      // title 可寫成「說明 | 出處 | 網址」：出處以小字接在說明後面，有網址就變成連結
      if (node.tagName === 'p') {
        const kids = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
        if (kids.length === 1 && kids[0].tagName === 'img') {
          const img = kids[0];
          const caption = img.properties.title;
          delete img.properties.title;
          node.tagName = 'figure';
          node.children = [img];
          if (caption) node.children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: captionChildren(String(caption)) });
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

function captionChildren(caption) {
  const [text, credit, url] = caption.split(' | ').map((s) => s.trim());
  const children = [{ type: 'text', value: text }];
  if (!credit) return children;
  const creditNode = url
    ? { type: 'element', tagName: 'a', properties: { href: url, target: '_blank', rel: 'noopener noreferrer' }, children: [{ type: 'text', value: credit }] }
    : { type: 'text', value: credit };
  children.push({ type: 'element', tagName: 'span', properties: { className: ['fig-credit'] }, children: [{ type: 'text', value: '圖：' }, creditNode] });
  return children;
}
