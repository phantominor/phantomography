// data/tags.js
// 逐篇筆記的標籤只有兩種，都是固定清單；疾病、藥物、檢查這類主題詞不當標籤（交給全站搜尋與 wiki-link）。
//   科別：基礎醫學與諸病微精的頁名（data/nav.js），跟著導覽自動更新
//   性質：下面這份清單，要新增先跟使用者確認
// 建置時遇到不在清單裡的標籤會在 console 警告（lib/pageProps.js），/journal 的篩選列依這兩種分排。
import { SIDE_NAV } from './nav';

export const SUBJECT_TAGS = [...SIDE_NAV.basic, ...SIDE_NAV['clinical/diseases']]
  .flatMap((section) => section.items.map((item) => item.label));

export const NATURE_TAGS = ['指引更新', '臨床技巧', '考點', '病例', '法規', '個人經驗'];

export const TAG_KINDS = [
  { key: 'subject', label: '科別' },
  { key: 'nature', label: '性質' },
];

export function tagKind(tag) {
  if (SUBJECT_TAGS.includes(tag)) return 'subject';
  if (NATURE_TAGS.includes(tag)) return 'nature';
  return null;
}
