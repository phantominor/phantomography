// lib/markdown/render.js
// Markdown → HTML 的完整流程（建置時執行）。回傳 HTML、右側目錄與警告（失效連結、找不到來源等）。

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkWikiLink from './remarkWikiLink';
import remarkDirectives from './remarkDirectives';
import rehypeHeadings from './rehypeHeadings';
import rehypeElements from './rehypeElements';

export async function renderMarkdown(markdown, { linkIndex, currentPage, sources, backlinks, cardsFor, journalEntries }) {
  const toc = [];
  const warnings = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm, { singleTilde: false }) // 「3 ~ 5」這類單一波浪號不當刪除線
    .use(remarkCjkFriendly) // 「**…（…）**的」這類緊貼全形標點與中文的粗體才會生效
    .use(remarkDirective)
    .use(remarkMath)
    .use(remarkWikiLink, { linkIndex, currentPage, warnings })
    .use(remarkDirectives, { sources, cardsFor, journalEntries, warnings })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // 讓 Markdown 裡手寫的 HTML（合併儲存格的表格）生效
    .use(rehypeKatex)
    .use(rehypeHeadings, { toc, backlinks })
    .use(rehypeElements)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  if (warnings.length && currentPage) {
    console.warn(`[content] ${currentPage.slug || 'index'}:\n  ` + warnings.join('\n  '));
  }
  return { html: String(file), toc, warnings };
}
