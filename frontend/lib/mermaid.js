// lib/mermaid.js
// 在瀏覽器端把 .mermaid-chart 畫成流程圖。Mermaid 很大，只在頁面上真的有流程圖時才載入。
// 配色跟著深淺色模式（切換時重畫），並自動加上全站共用的節點樣式：
//   :::danger 危險/緊急（紅框紅字）、:::key 結論或重點（灰底粗框）、:::start 起點（反白）。
// 寫法慣例：判斷節點用六角形 {{"…？"}}（菱形放中文太佔空間，圓角框又跟一般方框太像）。

let mermaidPromise = null;
let counter = 0;

function loadMermaid() {
  if (!mermaidPromise) mermaidPromise = import('mermaid').then((m) => m.default);
  return mermaidPromise;
}

function isDark() {
  const set = document.documentElement.dataset.theme;
  if (set) return set === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function palette() {
  return isDark()
    ? { bg: '#1c1c1e', alt: '#2c2c2e', text: '#dedede', line: '#9e9e9e', border: '#a0a0a0', red: '#ff5c5c' }
    : { bg: '#ffffff', alt: '#f2f2f2', text: '#212121', line: '#757575', border: '#5f5f5f', red: '#dc2626' };
}

// 在第一行（flowchart TD 之類）之後插入共用 classDef
function withClassDefs(source, c) {
  const defs = [
    `classDef danger fill:${c.bg},stroke:${c.red},color:${c.red},stroke-width:1.6px`,
    `classDef key fill:${c.alt},stroke:${c.text},color:${c.text},stroke-width:1.6px`,
    `classDef start fill:${c.text},stroke:${c.text},color:${c.bg}`,
  ].join('\n');
  const [head, ...rest] = source.split('\n');
  return [head, defs, ...rest].join('\n');
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
}

export async function renderCharts(root) {
  const nodes = root ? [...root.querySelectorAll('.mermaid-chart')] : [];
  if (!nodes.length) return;
  const mermaid = await loadMermaid();
  if (document.fonts?.ready) await document.fonts.ready;
  const c = palette();
  const font = getComputedStyle(document.documentElement).getPropertyValue('--font-text').trim();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    fontFamily: font,
    themeVariables: {
      fontFamily: font,
      fontSize: '14px',
      background: c.bg,
      primaryColor: c.bg,
      primaryTextColor: c.text,
      primaryBorderColor: c.border,
      lineColor: c.line,
      secondaryColor: c.alt,
      tertiaryColor: c.bg,
      edgeLabelBackground: c.bg,
      clusterBkg: c.alt,
      clusterBorder: c.border,
    },
    look: 'classic', // 不要 neo 風格的陰影
    flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis', nodeSpacing: 28, rankSpacing: 36, padding: 10, wrappingWidth: 180 },
  });
  for (const el of nodes) {
    const source = el.dataset.source || '';
    try {
      const { svg } = await mermaid.render(`mermaid-${++counter}`, withClassDefs(source, c));
      el.innerHTML = svg;
      el.dataset.rendered = 'true';
    } catch {
      el.innerHTML = `<pre class="mermaid-error">${escapeHtml(source)}</pre>`;
    }
  }
}

// 深淺色切換時重畫（data-theme 改變或系統設定改變）
export function watchTheme(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', callback);
  return () => {
    observer.disconnect();
    media.removeEventListener('change', callback);
  };
}
