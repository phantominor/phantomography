// data/nav.js
// 上方分頁與左側導覽的結構。slug 對應 content/ 底下的檔案路徑（去掉 .md，index.md 對應資料夾本身）；
// 檔案還不存在的項目在導覽中會以灰字顯示、不可點。icon 是總覽頁卡片用的圖示名稱（見 lib/markdown/icons.js 的 CARD_ICONS）。
//
// 左側導覽以「導覽區」為單位：基礎醫學、逐篇筆記、醫學周報各一區；臨床醫學的八種切入方式各自獨立成一區，
// 所以諸病微精的頂層（醫學三~六）與基礎醫學的頂層（醫學一~二）位階相同。

export const CLINICAL_CATEGORIES = [
  { key: 'clinical/diseases', label: '諸病微精', slug: 'clinical/diseases', icon: 'stethoscope' },
  { key: 'clinical/complaints', label: '病患主訴', slug: 'clinical/complaints', icon: 'complaint' },
  { key: 'clinical/tests', label: '檢查檢驗', slug: 'clinical/tests', icon: 'microscope' },
  { key: 'clinical/treatments', label: '治療處置', slug: 'clinical/treatments', icon: 'pill' },
  { key: 'clinical/skills', label: '臨床技能', slug: 'clinical/skills', icon: 'hand' },
  { key: 'clinical/general', label: '臨床通論', slug: 'clinical/general', icon: 'compass' },
  { key: 'clinical/oncall', label: '值班要點', slug: 'clinical/oncall', icon: 'siren' },
  { key: 'clinical/cases', label: '案例回顧', slug: 'clinical/cases', icon: 'folder' },
];

// 首頁由標題列的 Logo 連結，不另設分頁
export const TABS = [
  { key: 'basic', label: '基礎醫學', slug: 'basic', icon: 'dna' },
  { key: 'clinical', label: '臨床醫學', slug: 'clinical', icon: 'hospital', children: CLINICAL_CATEGORIES },
  { key: 'journal', label: '逐篇筆記', slug: 'journal', icon: 'notebook' },
  { key: 'weekly', label: '醫學周報', slug: 'weekly', icon: 'newspaper' },
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
  'clinical/complaints': [
    {
      title: '症狀與徵象',
      items: [
        page('全身症狀', 'clinical/complaints/general'),
        page('心血管', 'clinical/complaints/cardiovascular'),
        page('呼吸', 'clinical/complaints/respiratory'),
        page('消化', 'clinical/complaints/gastrointestinal'),
        page('腎泌尿', 'clinical/complaints/renal-urologic'),
        page('神經', 'clinical/complaints/neurologic'),
        page('精神', 'clinical/complaints/psychiatric'),
        page('肌肉骨骼', 'clinical/complaints/musculoskeletal'),
        page('皮膚', 'clinical/complaints/skin'),
        page('五官', 'clinical/complaints/heent'),
        page('內分泌', 'clinical/complaints/endocrine'),
        page('婦產', 'clinical/complaints/obgyn'),
        page('小兒', 'clinical/complaints/pediatric'),
      ],
    },
    {
      title: '異常檢驗值與影像',
      items: [
        page('血液異常', 'clinical/complaints/blood'),
        page('電解質與酸鹼', 'clinical/complaints/electrolytes-acid-base'),
        page('生化異常', 'clinical/complaints/chemistry'),
        page('偶發病灶', 'clinical/complaints/incidental-findings'),
      ],
    },
  ],
  'clinical/tests': [],
  // 前 12 組是藥物治療（依藥理分類），後 7 組是非藥物治療
  'clinical/treatments': [
    {
      title: '抗微生物藥物',
      items: [
        page('β-lactam', 'clinical/treatments/beta-lactams'),
        page('其他抗細菌藥物', 'clinical/treatments/other-antibacterials'),
        page('抗結核藥物', 'clinical/treatments/antituberculosis'),
        page('抗病毒藥物', 'clinical/treatments/antivirals'),
        page('抗黴菌藥物', 'clinical/treatments/antifungals'),
        page('抗寄生蟲藥物', 'clinical/treatments/antiparasitics'),
      ],
    },
    {
      title: '心血管藥物',
      items: [
        page('降血壓藥物', 'clinical/treatments/antihypertensives'),
        page('抗心律不整藥物', 'clinical/treatments/antiarrhythmics'),
        page('心衰竭藥物', 'clinical/treatments/heart-failure-drugs'),
        page('抗心絞痛與血管擴張劑', 'clinical/treatments/antianginals'),
        page('升壓劑與強心劑', 'clinical/treatments/vasopressors-inotropes'),
      ],
    },
    {
      title: '血液藥物',
      items: [
        page('抗血小板藥物', 'clinical/treatments/antiplatelets'),
        page('抗凝血藥物', 'clinical/treatments/anticoagulants'),
        page('溶栓藥物', 'clinical/treatments/thrombolytics'),
        page('止血與造血藥物', 'clinical/treatments/hemostatics-hematinics'),
      ],
    },
    {
      title: '代謝與內分泌藥物',
      items: [
        page('降血糖藥物', 'clinical/treatments/antidiabetics'),
        page('降血脂藥物', 'clinical/treatments/lipid-lowering'),
        page('甲狀腺與副甲狀腺藥物', 'clinical/treatments/thyroid-parathyroid-drugs'),
        page('類固醇', 'clinical/treatments/corticosteroids'),
        page('性荷爾蒙與避孕', 'clinical/treatments/sex-hormones-contraception'),
        page('骨質疏鬆藥物', 'clinical/treatments/osteoporosis-drugs'),
      ],
    },
    {
      title: '呼吸道藥物',
      items: [
        page('氣喘與 COPD 吸入藥物', 'clinical/treatments/inhaled-therapy'),
        page('止咳化痰與抗組織胺', 'clinical/treatments/antitussives-antihistamines'),
      ],
    },
    {
      title: '消化道藥物',
      items: [
        page('制酸與黏膜保護', 'clinical/treatments/acid-suppression'),
        page('止吐與促腸胃蠕動', 'clinical/treatments/antiemetics-prokinetics'),
        page('瀉劑與止瀉', 'clinical/treatments/laxatives-antidiarrheals'),
        page('IBD 與肝膽藥物', 'clinical/treatments/ibd-hepatobiliary-drugs'),
      ],
    },
    {
      title: '腎泌尿藥物',
      items: [
        page('利尿劑', 'clinical/treatments/diuretics'),
        page('泌尿道藥物', 'clinical/treatments/urologic-drugs'),
      ],
    },
    {
      title: '神經藥物',
      items: [
        page('抗癲癇藥物', 'clinical/treatments/antiseizure'),
        page('巴金森藥物', 'clinical/treatments/antiparkinson'),
        page('失智藥物', 'clinical/treatments/dementia-drugs'),
        page('偏頭痛藥物', 'clinical/treatments/migraine-drugs'),
        page('肌肉鬆弛劑', 'clinical/treatments/muscle-relaxants'),
      ],
    },
    {
      title: '精神藥物',
      items: [
        page('抗憂鬱劑', 'clinical/treatments/antidepressants'),
        page('抗精神病藥物', 'clinical/treatments/antipsychotics'),
        page('情緒穩定劑', 'clinical/treatments/mood-stabilizers'),
        page('鎮靜安眠藥', 'clinical/treatments/sedative-hypnotics'),
        page('ADHD 與成癮治療', 'clinical/treatments/adhd-addiction-drugs'),
      ],
    },
    {
      title: '止痛與麻醉藥物',
      items: [
        page('NSAID 與 acetaminophen', 'clinical/treatments/nsaids-acetaminophen'),
        page('鴉片類', 'clinical/treatments/opioids'),
        page('全身麻醉藥', 'clinical/treatments/general-anesthetics'),
        page('局部麻醉藥', 'clinical/treatments/local-anesthetics'),
        page('神經肌肉阻斷劑', 'clinical/treatments/neuromuscular-blockers'),
      ],
    },
    {
      title: '免疫與腫瘤藥物',
      items: [
        page('免疫抑制劑', 'clinical/treatments/immunosuppressants'),
        page('生物製劑', 'clinical/treatments/biologics'),
        page('化學治療', 'clinical/treatments/chemotherapy'),
        page('標靶治療', 'clinical/treatments/targeted-therapy'),
        page('免疫檢查點抑制劑', 'clinical/treatments/immune-checkpoint-inhibitors'),
      ],
    },
    {
      title: '特殊用藥',
      items: [
        page('特殊族群用藥', 'clinical/treatments/special-populations'),
        page('中毒與解毒劑', 'clinical/treatments/antidotes'),
        page('疫苗', 'clinical/treatments/vaccines'),
      ],
    },
    {
      title: '輸液與輸血',
      items: [
        page('輸液治療', 'clinical/treatments/fluid-therapy'),
        page('電解質補充', 'clinical/treatments/electrolyte-replacement'),
        page('輸血與血品', 'clinical/treatments/transfusion'),
      ],
    },
    {
      title: '營養支持',
      items: [
        page('腸道營養', 'clinical/treatments/enteral-nutrition'),
        page('靜脈營養', 'clinical/treatments/parenteral-nutrition'),
      ],
    },
    {
      title: '呼吸支持',
      items: [
        page('氧氣治療', 'clinical/treatments/oxygen-therapy'),
        page('非侵襲性通氣', 'clinical/treatments/noninvasive-ventilation'),
        page('機械通氣', 'clinical/treatments/mechanical-ventilation'),
      ],
    },
    {
      title: '器官支持',
      items: [
        page('腎臟替代療法', 'clinical/treatments/renal-replacement-therapy'),
        page('ECMO 與機械循環輔助', 'clinical/treatments/ecmo-mcs'),
      ],
    },
    {
      title: '介入治療',
      items: [
        page('心血管介入', 'clinical/treatments/cardiovascular-intervention'),
        page('放射介入', 'clinical/treatments/interventional-radiology'),
        page('內視鏡治療', 'clinical/treatments/therapeutic-endoscopy'),
      ],
    },
    {
      title: '放射與核醫治療',
      items: [
        page('放射治療', 'clinical/treatments/radiotherapy'),
        page('核醫治療', 'clinical/treatments/nuclear-medicine-therapy'),
      ],
    },
    {
      title: '復健',
      items: [
        page('物理治療與運動處方', 'clinical/treatments/physical-therapy'),
        page('職能與語言治療', 'clinical/treatments/occupational-speech-therapy'),
      ],
    },
  ],
  'clinical/skills': [],
  'clinical/general': [],
  'clinical/oncall': [],
  'clinical/cases': [],
  // 逐篇筆記、醫學周報依日期自動產生（lib/journal.js、lib/weekly.js），由頁面資料的 autoNav 傳入，這裡留空
  journal: [],
  weekly: [],
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
export function buildNavTree(autoNav = {}) {
  const sectionsOf = (navKey) => (autoNav[navKey] || SIDE_NAV[navKey] || []).map((section) => ({
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
      { key: 'journal', label: '逐篇筆記', slug: 'journal', children: sectionsOf('journal') },
      { key: 'weekly', label: '醫學周報', slug: 'weekly', children: sectionsOf('weekly') },
    ],
  };
}
