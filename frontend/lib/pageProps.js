// lib/pageProps.js
// 內容頁共用的 getStaticProps 邏輯：找到 Markdown、渲染、決定所屬分頁與上一頁/下一頁

import { getAllPages, buildLinkIndex, getJournalSources, buildBacklinks, buildSourceUsage, backlinkEntry, buildAutolinkTerms, AUTOLINK_SOURCES } from './content';
import { renderMarkdown } from './markdown/render';
import { findHeading } from './markdown/remarkWikiLink';
import { getCards } from './cards';
import { getJournalEntries, getJournalNav, JOURNAL_TYPES } from './journal';
import { getWeeklyEntries, getWeeklyNav, periodLabel } from './weekly';
import { locate, flattenNav } from '@/data/nav';
import { tagKind, SUBJECT_TAGS } from '@/data/tags';

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


const MAX_TABS = 5;
const isTopicPage = (slug) => AUTOLINK_SOURCES.some((s) => slug.startsWith(s));

// 一詞多連的預覽頁籤：第一個是連結本身的目標，其餘依序是
// 1. 同一個詞登記在其他專論頁的段落（autolink 詞重複）；2. 連結文字剛好是某個 autolink 詞；
// 3. 目標是疾病等一般段落時，治療處置、檢查檢驗、臨床技能頁裡連到這一段的段落（取自逆連結）。
// 不列目前這一頁；只有一個目標時回傳長度 1（不加頁籤）
function relatedTabs({ currentSlug, terms, backlinks }) {
  const byText = new Map();
  for (const t of terms) {
    const k = t.term.toLowerCase();
    if (!byText.has(k)) byText.set(k, []);
    byText.get(k).push(t);
  }
  return (main, text, extras = []) => {
    const tabs = [{ href: main.url, page: main.page, heading: main.heading }];
    const add = (slug, href, page, heading) => {
      if (slug === currentSlug || tabs.some((t) => t.href === href)) return;
      tabs.push({ href, page, heading });
    };
    for (const t of extras) add(t.slug, t.url, t.page, t.heading);
    for (const t of byText.get(String(text).toLowerCase()) || []) add(t.slug, t.url, t.page, t.heading);
    if (main.id && !isTopicPage(main.slug)) {
      for (const e of backlinks[main.slug]?.[main.id] || []) {
        const slug = e.url.split('#')[0].slice(1);
        if (isTopicPage(slug)) add(slug, e.url, e.page, e.path.join(' › '));
      }
    }
    return tabs.slice(0, MAX_TABS);
  };
}

export async function getContentPageProps(slug) {
  const pages = getAllPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) return { notFound: true };

  // sampleSources 只給樣式樣張頁用：讓來源標註不必依賴真實的逐篇筆記
  const sources = { ...getJournalSources(pages), ...(page.frontmatter.sampleSources || {}) };
  const linkIndex = buildLinkIndex(pages);
  const allBacklinks = buildBacklinks(pages, linkIndex);
  const autolinkTerms = page.frontmatter.noindex ? [] : buildAutolinkTerms(pages);
  const related = relatedTabs({ currentSlug: slug, terms: autolinkTerms, backlinks: allBacklinks });
  const backlinks = {
    ...(allBacklinks[slug] || {}),
    ...(page.frontmatter.sampleBacklinks ? sampleBacklinks(page, linkIndex) : {}),
  };
  const { html, toc } = await renderMarkdown(page.content, {
    linkIndex,
    currentPage: page,
    sources,
    backlinks,
    cardsFor: (of = slug) => getCards(of, pages),
    journalEntries: () => getJournalEntries(pages),
    weeklyEntries: () => getWeeklyEntries(pages),
    autolinkTerms,
    related,
  });

  // 逐篇筆記、醫學周報的導覽依日期自動產生（全站都要：手機抽屜也列得出來）
  const autoNav = { journal: getJournalNav(pages), weekly: getWeeklyNav(pages) };
  const journal = slug.startsWith('journal/')
    ? { type: JOURNAL_TYPES[page.frontmatter.type] || null, linked: buildSourceUsage(pages)[slug.split('/').pop()] || [] }
    : null;
  if (journal) {
    // 標籤只能用固定清單（data/tags.js），打錯字或另造的同義詞在這裡抓出來
    const unknown = [].concat(page.frontmatter.tags || []).map(String).filter((t) => !tagKind(t));
    if (unknown.length) console.warn(`[content] ${slug}:
  不在標籤清單裡的標籤：${unknown.join('、')}（見 data/tags.js）`);
  }

  let weekly = null;
  if (slug.startsWith('weekly/') && slug.split('/').length === 3) {
    const entry = getWeeklyEntries([page])[0];
    weekly = { period: periodLabel(entry.start, entry.end), count: entry.count, subjects: entry.tags };
    // 科別只能用固定清單裡的科別頁名
    const unknown = entry.tags.filter((t) => !SUBJECT_TAGS.includes(t));
    if (unknown.length) console.warn(`[content] ${slug}:
  不在科別清單裡的 subjects：${unknown.join('、')}（見 data/tags.js）`);
    if (entry.badEvidence.length) console.warn(`[content] ${slug}:
  不在清單裡的證據標籤 evidence：${entry.badEvidence.join('、')}（見 lib/weekly.js 的 EVIDENCE_LEVELS）`);
    if (entry.pendingReview) console.warn(`[content] ${slug}:
  還有 ${entry.pendingReview} 則 :::review 待審核`);
  }

  const { tab, navKey } = locate(slug, page.frontmatter.nav);
  const existing = pages.map((p) => p.slug);
  const navItems = autoNav[navKey] ? autoNav[navKey].flatMap((s) => s.items) : flattenNav(navKey);
  const flat = navItems.filter((i) => existing.includes(i.slug));
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
      autoNav,
      journal,
      weekly,
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
