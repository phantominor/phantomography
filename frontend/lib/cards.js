// lib/cards.js
// 總覽頁的卡片入口（::cards{of="…"}）：依 data/nav.js 的結構列出下一層。
// 描述取各頁 frontmatter 的 description；更新日期取該頁與底下所有頁面中最新的 updated；尚未建立的頁面顯示灰卡。

import { TABS, CLINICAL_CATEGORIES, SIDE_NAV } from '@/data/nav';

// of：'' 為首頁（三個大分頁）、'clinical' 為八種切入方式，其他是 SIDE_NAV 的導覽區（依分組列出）
function groupsOf(of) {
  if (of === '') return [{ title: null, items: TABS }];
  if (of === 'clinical') return [{ title: null, items: CLINICAL_CATEGORIES }];
  if (!SIDE_NAV[of]) return null;
  return SIDE_NAV[of].map((section) => ({ title: section.title, items: section.items }));
}

function latestUpdated(slug, pages) {
  const dates = pages
    .filter((p) => p.slug === slug || p.slug.startsWith(slug + '/'))
    .map((p) => p.frontmatter.updated)
    .filter(Boolean)
    .map(String);
  return dates.length ? dates.sort().pop() : null;
}

export function getCards(of, pages) {
  const groups = groupsOf(of);
  if (!groups) return null;
  return groups.map(({ title, items }) => ({
    title,
    items: items.map((item) => {
      const page = pages.find((p) => p.slug === item.slug);
      return {
        label: item.label,
        url: '/' + item.slug,
        icon: item.icon || null,
        description: page?.frontmatter.description || null,
        updated: page ? latestUpdated(item.slug, pages) : null,
        exists: Boolean(page),
      };
    }),
  }));
}
