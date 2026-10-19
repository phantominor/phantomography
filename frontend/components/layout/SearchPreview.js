// components/layout/SearchPreview.js
// 搜尋結果的渲染預覽（桌面版下拉右側）：顯示該段落實際的排版（表格、粗體、紅字、流程圖），
// 搜尋詞以 <mark> 標出，並自動捲到第一個符合處。內容取自頁面資料，同一頁只抓一次。

import { useEffect, useRef, useState } from 'react';
import { fetchPageProps, extractSection } from '@/lib/pageData';
import { renderCharts } from '@/lib/mermaid';
import styles from './SearchBox.module.css';

// 在 DOM 裡把搜尋詞包上 <mark>（略過流程圖與公式）
function highlight(root, terms) {
  if (!terms.length) return;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest('.mermaid-chart, .katex, mark') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  for (const node of texts) {
    if (!re.test(node.nodeValue)) continue;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    node.nodeValue.split(re).forEach((part, i) => {
      if (!part) return;
      if (i % 2) {
        const mark = document.createElement('mark');
        mark.textContent = part;
        frag.appendChild(mark);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    });
    node.parentNode.replaceChild(frag, node);
  }
}

export default function SearchPreview({ entry, terms }) {
  const [html, setHtml] = useState(null);
  const boxRef = useRef(null);
  const termKey = terms.join(' ');

  useEffect(() => {
    let cancelled = false;
    setHtml(null);
    fetchPageProps(entry.u)
      .then((data) => { if (!cancelled) setHtml(extractSection(data.html, entry.i) || ''); })
      .catch(() => { if (!cancelled) setHtml(''); });
    return () => { cancelled = true; };
  }, [entry.u, entry.i]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || html === null) return;
    const article = box.querySelector('.note');
    if (!article) return;
    article.innerHTML = html;
    // 拿掉 id，避免跟主頁面同名的錨點互相干擾（目錄、同頁跳轉）
    article.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    highlight(article, terms);
    const scrollToMark = () => {
      const mark = article.querySelector('mark');
      box.scrollTop = mark ? mark.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 48 : 0;
    };
    scrollToMark();
    if (html.includes('mermaid-chart')) renderCharts(article).then(scrollToMark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, termKey]);

  return (
    <div ref={boxRef} className={`${styles.preview} thin-scroll`} aria-label="搜尋結果預覽">
      <div className={styles.previewHead}>{entry.p}{entry.s && ` / ${entry.s}`}</div>
      {html === null && <p className={styles.status}>載入預覽中…</p>}
      {html === '' && <p className={styles.status}>無法顯示預覽</p>}
      <article className={`note ${styles.previewNote}`} />
    </div>
  );
}
