// lib/markdown/remarkAnnotations.js
// 校閱批註：內文裡的 HTML 註解 <!-- 改：… --> 是使用者留給 Claude 的修改指示。
// 建置時從輸出移除（不進 HTML 原始碼），並在 console 列出尚未處理的批註，處理完由 Claude 刪掉。

import { visit } from 'unist-util-visit';

export const ANNOTATION_RE = /<!--([\s\S]*?)-->/g;

export default function remarkAnnotations({ warnings }) {
  return (tree) => {
    visit(tree, 'html', (node, index, parent) => {
      if (!node.value.includes('<!--')) return;
      for (const m of node.value.matchAll(ANNOTATION_RE)) {
        const line = node.position?.start.line;
        warnings.push(`未處理批註${line ? `（第 ${line} 行）` : ''}：${m[1].trim().replace(/\s+/g, ' ')}`);
      }
      const rest = node.value.replace(ANNOTATION_RE, '');
      if (rest.trim()) {
        node.value = rest;
      } else if (parent && index != null) {
        parent.children.splice(index, 1);
        return index;
      }
    });
  };
}
