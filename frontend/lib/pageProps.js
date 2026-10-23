// lib/pageProps.js
// 內容頁共用的 getStaticProps 邏輯：找到 Markdown、渲染、決定所屬分頁與上一頁/下一頁

import { getAllPages, buildLinkIndex, getJournalSources, buildBacklinks, backlinkEntry } from './content';
import { renderMarkdown } from './markdown/render';
import { findHeading } from './markdown/remarkWikiLink';
import { getCards } from './cards';
import { locate, flattenNav } from '@/data/nav';

// 樣式樣張頁的示範逆連結：{ 本頁標題: ['來源頁#來源標題', …] }，來源要是真的頁面與段落，點了才開得了預覽
function sampleBacklinks(page, linkIndex) {
  const table = {};
  for (const [headingText, refs] of Object.entries(page.frontmatter.sampleBacklinks)) {
    const heading = findHeading(page.headings, headingText);
    if (!heading) continue;
    table[heading.id] = refs.flatMap((ref) => {
      const [pageRef, sourceHeading] = ref.split('#');
      const source = linkIndex.get(pageRef.trim().toLowerCase());
      const h = source && findHeading(source.headings, sourceHeading || '');
      return h ? [backlinkEntry(source, source.headings.indexOf(h))] : [];
    });
  }
  return table;
}

export async function getContentPageProps(slug) {
  const pages = getAllPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) return { notFound: true };

  // sampleSources 只給樣式樣張頁用：讓來源標註不必依賴真實的逐篇筆記
  const sources = { ...getJournalSources(pages), ...(page.frontmatter.sampleSources || {}) };
  const linkIndex = buildLinkIndex(pages);
  const backlinks = {
    ...(buildBacklinks(pages, linkIndex)[slug] || {}),
    ...(page.frontmatter.sampleBacklinks ? sampleBacklinks(page, linkIndex) : {}),
  };
  const { html, toc } = await renderMarkdown(page.content, {
    linkIndex,
    currentPage: page,
    sources,
    backlinks,
    cardsFor: (of = slug) => getCards(of, pages),
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
