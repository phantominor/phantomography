// lib/pageProps.js
// 內容頁共用的 getStaticProps 邏輯：找到 Markdown、渲染、決定所屬分頁與上一頁/下一頁

import { getAllPages, buildLinkIndex, getJournalSources } from './content';
import { renderMarkdown } from './markdown/render';
import { locate, flattenNav } from '@/data/nav';

export async function getContentPageProps(slug) {
  const pages = getAllPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) return { notFound: true };

  // sampleSources 只給樣式樣張頁用：讓來源標註不必依賴真實的逐篇筆記
  const sources = { ...getJournalSources(pages), ...(page.frontmatter.sampleSources || {}) };
  const { html, toc } = await renderMarkdown(page.content, {
    linkIndex: buildLinkIndex(pages),
    currentPage: page,
    sources,
  });

  const { tab, navKey } = locate(slug, page.frontmatter.nav);
  const existing = pages.map((p) => p.slug);
  const flat = flattenNav(navKey).filter((i) => existing.includes(i.slug));
  const i = flat.findIndex((item) => item.slug === slug);

  return {
    props: {
      slug,
      frontmatter: page.frontmatter,
      html,
      toc,
      tab,
      navKey,
      existing,
      prev: i > 0 ? flat[i - 1] : null,
      next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null,
    },
  };
}

export function getContentPaths() {
  return getAllPages()
    .filter((p) => p.slug !== '')
    .map((p) => ({ params: { slug: p.slug.split('/') } }));
}
