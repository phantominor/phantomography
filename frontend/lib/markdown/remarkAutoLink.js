// lib/markdown/remarkAutoLink.js
// 自動連結：內文提到治療處置、檢查檢驗、臨床技能頁登記的詞（frontmatter autolink）時，自動連到那一段。
// 每個 h2 段落裡同一個目標只連第一次；連結、標題、程式碼、流程圖、區塊標題裡不連；不連到目前這一頁。
// 輸出和 wiki-link 一樣會開預覽面板，另加 auto-link 樣式（內文色 + 虛線底線），和手動連結區分。

const SKIP_TYPES = new Set(['link', 'linkReference', 'heading', 'inlineCode', 'code', 'html', 'math', 'inlineMath', 'image']);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default function remarkAutoLink({ terms = [], currentPage, related }) {
  const usable = terms.filter((t) => t.slug !== currentPage?.slug);
  if (!usable.length) return () => {};
  const byTerm = new Map();
  for (const t of usable) {
    const key = t.term.toLowerCase();
    if (!byTerm.has(key)) byTerm.set(key, []);
    byTerm.get(key).push(t);
  }
  // 英數字詞前後不能緊接英數字或連字號（Ceftazidime 不會連到 Ceftazidime-avibactam 的一部分）
  const re = new RegExp(`(?<![A-Za-z0-9-])(?:${[...byTerm.keys()].map((k) => escapeRe(usable.find((t) => t.term.toLowerCase() === k).term)).join('|')})(?![A-Za-z0-9-])`, 'gi');

  return (tree) => {
    let seen = new Set();
    const walk = (node) => {
      if (node.type === 'heading' && node.depth === 2) seen = new Set();
      if (SKIP_TYPES.has(node.type) || node.data?.directiveLabel) return;
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type !== 'text') {
          walk(child);
          continue;
        }
        const parts = [];
        let last = 0;
        re.lastIndex = 0;
        for (const m of child.value.matchAll(re)) {
          const targets = byTerm.get(m[0].toLowerCase());
          const main = targets[0];
          if (seen.has(main.url)) continue;
          seen.add(main.url);
          if (m.index > last) parts.push({ type: 'text', value: child.value.slice(last, m.index) });
          last = m.index + m[0].length;
          const tabs = related ? related(main, m[0], targets.slice(1)) : [];
          parts.push({
            type: 'link',
            url: main.url,
            data: { hProperties: { className: ['wiki-link', 'auto-link'], ...(tabs.length > 1 ? { dataPeek: JSON.stringify(tabs) } : {}) } },
            children: [{ type: 'text', value: m[0] }],
          });
        }
        if (!parts.length) continue;
        if (last < child.value.length) parts.push({ type: 'text', value: child.value.slice(last) });
        node.children.splice(i, 1, ...parts);
        i += parts.length - 1;
      }
    };
    walk(tree);
  };
}
