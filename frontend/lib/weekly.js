// lib/weekly.js
// 醫學周報（content/weekly/<YYYY>/<YYYY>-w<WW>.md）：依期別排序的列表（::weekly）、左側導覽、頁首資訊用的資料。
// 每期內文的 h2 是性質分段（WEEKLY_KINDS，沒有內容的分段不寫）；每則消息包在 :::news{subjects="…" source="…" date="…" url="…"} 裡。

export const WEEKLY_KINDS = ['本週焦點', '新研究', '新指引', '藥物與器材', '公衛與政策', '疫情', '時事', '新發現', '病例與專題'];

const NEWS_RE = /^:::news\{([^}]*)\}/gm;
const ATTR_RE = /(\w+)="([^"]*)"/g;
const H2_RE = /^## (.+)$/gm;

export function newsAttrs(raw) {
  const attrs = {};
  for (const [, k, v] of raw.matchAll(ATTR_RE)) attrs[k] = v;
  return attrs;
}

export const splitSubjects = (v) => String(v || '').split(/[,、]/).map((s) => s.trim()).filter(Boolean);

// 一期周報裡出現的科別（各則消息 subjects 的聯集）與則數
function scanIssue(content) {
  const subjects = new Set();
  let count = 0;
  for (const [, raw] of content.matchAll(NEWS_RE)) {
    count += 1;
    splitSubjects(newsAttrs(raw).subjects).forEach((s) => subjects.add(s));
  }
  const kinds = [...content.matchAll(H2_RE)].map((m) => m[1].trim()).filter((h) => WEEKLY_KINDS.includes(h));
  return { subjects: [...subjects], count, kinds };
}

// 新的在前
export function getWeeklyEntries(pages) {
  return pages
    .filter((p) => p.slug.startsWith('weekly/'))
    .map((p) => {
      const fm = p.frontmatter;
      const { subjects, count, kinds } = scanIssue(p.content);
      return {
        slug: p.slug,
        url: p.url,
        title: fm.title || p.slug.split('/').pop(),
        issue: fm.issue ? String(fm.issue) : '',
        date: fm.date ? String(fm.date) : '',
        start: fm.start ? String(fm.start) : '',
        end: fm.end ? String(fm.end) : '',
        tags: subjects,
        kinds,
        count,
      };
    })
    .sort((a, b) => b.issue.localeCompare(a.issue));
}

// 「10/19–10/25」
export function periodLabel(start, end) {
  const md = (d) => String(d).slice(5).replace('-', '/');
  return start && end ? `${md(start)}–${md(end)}` : '';
}

// 左側導覽：依年份分組，項目是「第 44 週 10/19–10/25」
export function getWeeklyNav(pages) {
  const sections = [];
  for (const e of getWeeklyEntries(pages)) {
    const year = e.issue.slice(0, 4) || '未標期別';
    let section = sections.find((s) => s.title === year);
    if (!section) sections.push((section = { title: year, items: [] }));
    const week = e.issue.split('-W')[1];
    section.items.push({ label: [week ? `第 ${Number(week)} 週` : e.title, periodLabel(e.start, e.end)].filter(Boolean).join(' '), slug: e.slug });
  }
  return sections;
}
