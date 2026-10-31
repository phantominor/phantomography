// lib/journal.js
// 逐篇筆記（content/journal/<YYYY>/<YYYYMMDD>-<slug>.md）：依日期排序的列表（::journal）、左側導覽、頁首資訊用的資料。

export const JOURNAL_TYPES = {
  lecture: '課程',
  talk: '講座',
  conference: '研討會',
  morning: '晨會',
  clinical: '臨床學習',
  report: '報告',
  self: '自主學習',
  discussion: '討論',
};

const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// 新的在前；同一天依時間
export function getJournalEntries(pages) {
  return pages
    .filter((p) => p.slug.startsWith('journal/'))
    .map((p) => {
      const fm = p.frontmatter;
      return {
        slug: p.slug,
        url: p.url,
        title: fm.title || p.slug.split('/').pop(),
        date: fm.date ? String(fm.date) : '',
        time: fm.time ? String(fm.time) : '',
        type: JOURNAL_TYPES[fm.type] || '',
        event: fm.event || '',
        speaker: asList(fm.speaker).join('、'),
        place: fm.place || '',
        tags: asList(fm.tags).map(String),
        integrated: fm.integrated !== false,
      };
    })
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}

// 左側導覽：依年份分組，項目前面加上月/日
export function getJournalNav(pages) {
  const sections = [];
  for (const e of getJournalEntries(pages)) {
    const year = e.date.slice(0, 4) || '未標日期';
    let section = sections.find((s) => s.title === year);
    if (!section) sections.push((section = { title: year, items: [] }));
    const md = e.date ? e.date.slice(5).replace('-', '/') + ' ' : '';
    section.items.push({ label: md + e.title, slug: e.slug });
  }
  return sections;
}
