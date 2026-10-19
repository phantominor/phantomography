// lib/pageData.js
// 在瀏覽器端讀取其他頁面渲染好的內容（Next.js 建置時產生的 /_next/data/<buildId>/<path>.json），
// 連結預覽面板與搜尋預覽共用，同一頁只抓一次。

const cache = new Map();

export async function fetchPageProps(pathname) {
  if (cache.has(pathname)) return cache.get(pathname);
  const buildId = window.__NEXT_DATA__?.buildId;
  const path = pathname === '/' ? '/index' : pathname.replace(/\/$/, '');
  const promise = fetch(`/_next/data/${buildId}${path}.json`)
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    })
    .then(({ pageProps }) => pageProps);
  cache.set(pathname, promise);
  promise.catch(() => cache.delete(pathname));
  return promise;
}

// 從整頁 HTML 取出某個 h2/h3 段落（到下一個 h2/h3 為止）；id 為空時取第一個標題之前的開頭段落
export function extractSection(html, id) {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const nodes = [...doc.body.firstElementChild.children];
  const isHeading = (n) => /^H[23]$/.test(n.tagName);
  let start = 0;
  if (id) {
    const i = nodes.findIndex((n) => n.id === id);
    if (i < 0) return '';
    start = i;
  }
  const out = [];
  for (let k = start; k < nodes.length; k++) {
    if (k > start && isHeading(nodes[k])) break;
    if (!id && isHeading(nodes[k])) break;
    out.push(nodes[k].outerHTML);
  }
  return out.join('');
}
