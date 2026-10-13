// data/nav.js
// 上方分頁與左側導覽的結構。slug 對應 content/ 底下的檔案路徑（去掉 .md，index.md 對應資料夾本身）；
// 檔案還不存在的項目在導覽中會以灰字顯示、不可點。
//
// 左側導覽以「導覽區」為單位：基礎醫學、逐篇筆記各一區；臨床醫學的八種切入方式各自獨立成一區，
// 所以諸病微精的頂層（醫學三~六）與基礎醫學的頂層（醫學一~二）位階相同。

export const CLINICAL_CATEGORIES = [
  { key: 'clinical/diseases', label: '諸病微精', slug: 'clinical/diseases' },
  { key: 'clinical/complaints', label: '病患主訴', slug: 'clinical/complaints' },
  { key: 'clinical/tests', label: '檢查檢驗', slug: 'clinical/tests' },
  { key: 'clinical/treatments', label: '治療處置', slug: 'clinical/treatments' },
  { key: 'clinical/skills', label: '臨床技能', slug: 'clinical/skills' },
  { key: 'clinical/general', label: '臨床通論', slug: 'clinical/general' },
  { key: 'clinical/oncall', label: '值班要點', slug: 'clinical/oncall' },
  { key: 'clinical/cases', label: '案例回顧', slug: 'clinical/cases' },
];

// 首頁由標題列的 Logo 連結，不另設分頁
export const TABS = [
  { key: 'basic', label: '基礎醫學', slug: 'basic' },
  { key: 'clinical', label: '臨床醫學', slug: 'clinical', children: CLINICAL_CATEGORIES },
  { key: 'journal', label: '逐篇筆記', slug: 'journal' },
];

const page = (label, slug) => ({ label, slug });

export const SIDE_NAV = {
  basic: [
    {
      title: '醫學一',
      items: [
        page('解剖學', 'basic/anatomy'),
        page('組織學', 'basic/histology'),
        page('胚胎學', 'basic/embryology'),
        page('生理學', 'basic/physiology'),
        page('生物化學', 'basic/biochemistry'),
      ],
    },
    {
      title: '醫學二',
      items: [
        page('微生物學', 'basic/microbiology'),
        page('免疫學', 'basic/immunology'),
        page('寄生蟲學', 'basic/parasitology'),
        page('藥理學', 'basic/pharmacology'),
        page('病理學', 'basic/pathology'),
        page('公共衛生', 'basic/public-health'),
      ],
    },
  ],

  // 臨床醫學總覽頁：列出八種切入方式
  clinical: [
    { title: '臨床醫學', items: CLINICAL_CATEGORIES.map((c) => page(c.label, c.slug)) },
  ],

  'clinical/diseases': [
    {
      title: '醫學三',
      items: [
        page('心臟內科', 'clinical/diseases/cardiology'),
        page('消化內科', 'clinical/diseases/gastroenterology'),
        page('腎臟內科', 'clinical/diseases/nephrology'),
        page('免疫風濕科', 'clinical/diseases/rheumatology'),
        page('血液腫瘤科', 'clinical/diseases/hematology-oncology'),
        page('胸腔內科', 'clinical/diseases/pulmonology'),
        page('代謝內分泌科', 'clinical/diseases/endocrinology'),
        page('感染科', 'clinical/diseases/infectious-disease'),
        page('家庭醫學科', 'clinical/diseases/family-medicine'),
      ],
    },
    {
      title: '醫學四',
      items: [
        page('小兒科', 'clinical/diseases/pediatrics'),
        page('皮膚科', 'clinical/diseases/dermatology'),
        page('神經內科', 'clinical/diseases/neurology'),
        page('精神科', 'clinical/diseases/psychiatry'),
      ],
    },
    {
      title: '醫學五',
      items: [
        page('外科概論', 'clinical/diseases/surgery-principles'),
        page('神經外科', 'clinical/diseases/neurosurgery'),
        page('整形外科', 'clinical/diseases/plastic-surgery'),
        page('心血管外科', 'clinical/diseases/cardiovascular-surgery'),
        page('胸腔外科', 'clinical/diseases/thoracic-surgery'),
        page('胃小腸外科', 'clinical/diseases/gi-surgery'),
        page('肝膽胰外科', 'clinical/diseases/hpb-surgery'),
        page('內分泌外科', 'clinical/diseases/endocrine-surgery'),
        page('乳房外科', 'clinical/diseases/breast-surgery'),
        page('小兒外科', 'clinical/diseases/pediatric-surgery'),
        page('大腸直腸外科', 'clinical/diseases/colorectal-surgery'),
        page('骨科', 'clinical/diseases/orthopedics'),
        page('泌尿科', 'clinical/diseases/urology'),
      ],
    },
    {
      title: '醫學六',
      items: [
        page('麻醉科', 'clinical/diseases/anesthesiology'),
        page('眼科', 'clinical/diseases/ophthalmology'),
        page('耳鼻喉科', 'clinical/diseases/otolaryngology'),
        page('產科', 'clinical/diseases/obstetrics'),
        page('婦科', 'clinical/diseases/gynecology'),
        page('生殖內分泌科', 'clinical/diseases/reproductive-endocrinology'),
        page('復健科', 'clinical/diseases/rehabilitation'),
      ],
    },
  ],
  'clinical/complaints': [],
  'clinical/tests': [],
  'clinical/treatments': [
    { title: '藥物治療', items: [] },
    { title: '非藥物治療', items: [] },
  ],
  'clinical/skills': [],
  'clinical/general': [],
  'clinical/oncall': [],
  'clinical/cases': [],
  journal: [],
};

// 頁面所屬的上方分頁與左側導覽區。frontmatter 的 nav 可覆寫（例如樣式樣張頁）
export function locate(slug, frontmatterNav) {
  const target = frontmatterNav || slug;
  const category = CLINICAL_CATEGORIES.find((c) => target === c.slug || target.startsWith(c.slug + '/'));
  if (category) return { tab: 'clinical', navKey: category.key };
  const tab = TABS.find((t) => t.slug && (target === t.slug || target.startsWith(t.slug + '/')));
  if (tab) return { tab: tab.key, navKey: tab.key };
  return { tab: 'home', navKey: null };
}

// 依導覽順序攤平某個導覽區的所有頁面（上一頁/下一頁用）
export function flattenNav(navKey) {
  return (SIDE_NAV[navKey] || []).flatMap((section) => section.items);
}

// 手機抽屜的多層導覽樹（仿 Material）：大分頁 → （臨床醫學的八個分類）→ 分組 → 頁面。
// 節點：{ key, label, slug?, children? }；有 slug 的資料夾節點表示它有自己的總覽頁
export function buildNavTree() {
  const sectionsOf = (navKey) => (SIDE_NAV[navKey] || []).map((section) => ({
    key: `${navKey}:${section.title}`,
    label: section.title,
    children: section.items.map((item) => ({ key: item.slug, label: item.label, slug: item.slug })),
  }));
  return {
    key: 'root',
    label: 'Phantomography',
    slug: '',
    children: [
      { key: 'basic', label: '基礎醫學', slug: 'basic', children: sectionsOf('basic') },
      {
        key: 'clinical',
        label: '臨床醫學',
        slug: 'clinical',
        children: CLINICAL_CATEGORIES.map((c) => ({ key: c.key, label: c.label, slug: c.slug, children: sectionsOf(c.key) })),
      },
      { key: 'journal', label: '逐篇筆記', slug: 'journal', children: [] },
    ],
  };
}
