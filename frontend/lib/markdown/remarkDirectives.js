// lib/markdown/remarkDirectives.js
// 自訂語法（remark-directive）：
//   行內  :red[文字]  :stage[二階]  :q[113-2 醫三 #24]
//   流程圖 ::chart{id="…"}（共用流程圖，見 lib/charts.js）
//   卡片  ::cards{of="…"}（總覽頁的卡片入口，見 lib/cards.js；of 省略時為目前頁面）
//   列表  ::journal（逐篇筆記依日期的列表與標籤篩選，見 lib/journal.js）
//   區塊  :::exam  :::mnemonic  :::compare  :::pitfall  :::verify  :::supplement  :::detail{title="…"}  :::source{from="…"}
// 不認得的行內語法（例如內文剛好出現「Na:K」）會還原成原本的文字。

import { visit } from 'unist-util-visit';
import { ICONS, CARD_ICONS } from './icons';
import { loadChart } from '../charts';
import { TAG_KINDS, tagKind } from '../../data/tags';

const CALLOUTS = {
  exam: '考點',
  mnemonic: '口訣',
  compare: '比較',
  pitfall: '陷阱',
  verify: '待查證',
  supplement: '補充',
};

const INLINE = {
  red: 'red',
  stage: 'stage-badge',
  q: 'exam-ref',
};

const html = (value) => ({ type: 'html', value });

function formatDate(value) {
  return value ? String(value).replace(/-/g, '/') : '';
}

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function cardHtml(card) {
  const icon = card.icon && CARD_ICONS[card.icon] ? `<span class="card-icon">${CARD_ICONS[card.icon]}</span>` : '';
  const desc = card.description ? `<span class="card-desc">${escapeHtml(card.description)}</span>` : '';
  const foot = card.exists
    ? (card.updated ? `<span class="card-date">更新於 ${formatDate(card.updated)}</span>` : '')
    : '<span class="card-date">尚未撰寫</span>';
  const body = `<span class="card-head">${icon}<span class="card-title">${escapeHtml(card.label)}</span></span>${desc}${foot}`;
  return card.exists
    ? `<a class="card" href="${escapeHtml(card.url)}">${body}</a>`
    : `<span class="card card-missing" aria-disabled="true">${body}</span>`;
}

// 沒有項目的分組不顯示；整個導覽區都還沒有項目時（例如逐篇筆記）不產生任何東西
function cardsHtml(groups) {
  const shown = groups.filter((g) => g.items.length);
  if (!shown.length) return '';
  return '<div class="cards">' + shown.map((g) => (
    (g.title ? `<div class="cards-group">${escapeHtml(g.title)}</div>` : '')
    + `<div class="cards-grid">${g.items.map(cardHtml).join('')}</div>`
  )).join('') + '</div>';
}

// 逐篇筆記列表：上方是標籤篩選（科別、性質各一排，兩排可以交叉；ContentPage 掛上點擊事件），下方依年份分組
function journalHtml(entries) {
  if (!entries.length) return '';
  const counts = {};
  for (const e of entries) for (const t of e.tags) counts[t] = (counts[t] || 0) + 1;
  const tags = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b, 'zh-Hant'));
  // 不在清單裡的標籤（建置時會警告）放「其他」，修好之前仍篩得到
  const rows = [...TAG_KINDS, { key: 'other', label: '其他' }]
    .map((k) => ({ ...k, tags: tags.filter((t) => (tagKind(t) || 'other') === k.key) }))
    .filter((k) => k.tags.length);
  const button = (t, kind) => `<button type="button" class="journal-tag" data-kind="${kind}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}<span class="journal-tag-count">${counts[t]}</span></button>`;
  const filter = rows.length
    ? '<div class="journal-filter">' + rows.map((k) => (
      `<div class="journal-filter-row"><span class="journal-filter-label">${k.label}</span>${k.tags.map((t) => button(t, k.key)).join('')}</div>`
    )).join('') + '</div>'
    : '';
  const years = [];
  for (const e of entries) {
    const year = e.date.slice(0, 4) || '未標日期';
    let y = years.find((g) => g.year === year);
    if (!y) years.push((y = { year, items: [] }));
    y.items.push(e);
  }
  const item = (e) => {
    const meta = [formatDate(e.date), e.type, e.event, e.speaker].filter(Boolean).map(escapeHtml).join(' · ');
    const tagList = e.tags.map((t) => `<span class="journal-item-tag">${escapeHtml(t)}</span>`).join('');
    return `<li class="journal-item" data-tags="${escapeHtml(JSON.stringify(e.tags))}">`
      + `<a class="journal-item-title" href="${escapeHtml(e.url)}">${escapeHtml(e.title)}</a>`
      + `<span class="journal-item-meta">${meta}${e.integrated ? '' : ' · <span class="journal-pending">尚未整合</span>'}</span>`
      + (tagList ? `<span class="journal-item-tags">${tagList}</span>` : '')
      + '</li>';
  };
  return '<div class="journal-list">' + filter + years.map((y) => (
    `<div class="journal-year">${escapeHtml(y.year)}</div><ul class="journal-items">${y.items.map(item).join('')}</ul>`
  )).join('') + '</div>';
}

// 把 :::name[標籤] 的標籤段落取出來（沒有就回傳 null）
function takeLabel(node) {
  const first = node.children[0];
  if (first && first.data && first.data.directiveLabel) {
    node.children.shift();
    return first.children;
  }
  return null;
}

export default function remarkDirectives({ sources = {}, cardsFor, journalEntries, warnings }) {
  return (tree) => {
    // ::journal：逐篇筆記列表
    visit(tree, 'leafDirective', (node, index, parent) => {
      if (node.name !== 'journal') return undefined;
      const value = journalHtml(journalEntries ? journalEntries() : []);
      parent.children.splice(index, 1, ...(value ? [html(value)] : []));
      return value ? index + 1 : index;
    });

    // ::cards{of="…"}：總覽頁的卡片入口
    visit(tree, 'leafDirective', (node, index, parent) => {
      if (node.name !== 'cards') return undefined;
      const of = node.attributes?.of;
      const groups = cardsFor ? cardsFor(of) : null;
      if (!groups) {
        warnings.push(`找不到卡片的導覽區：${of}`);
        parent.children.splice(index, 1);
        return index;
      }
      const value = cardsHtml(groups);
      parent.children.splice(index, 1, ...(value ? [html(value)] : []));
      return value ? index + 1 : index;
    });

    // ::chart{id="…"}：換成 content/_charts/<id>.mmd 的流程圖（等同直接寫 ```mermaid 圖標題）
    visit(tree, 'leafDirective', (node, index, parent) => {
      if (node.name !== 'chart') return undefined;
      const id = node.attributes?.id || '';
      const chart = loadChart(id);
      if (!chart) {
        warnings.push(`找不到流程圖：${id}`);
        parent.children.splice(index, 1, { type: 'paragraph', children: [{ type: 'text', value: `（找不到流程圖：${id}）` }] });
        return index + 1;
      }
      parent.children.splice(index, 1, { type: 'code', lang: 'mermaid', meta: chart.title || null, value: chart.source });
      return index + 1;
    });

    // ```mermaid 圖標題：先把標題（code 的 meta）存成屬性，rehype-raw 重新解析時才不會遺失
    visit(tree, 'code', (node) => {
      if (node.lang === 'mermaid' && node.meta) {
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, dataTitle: node.meta } };
      }
    });

    visit(tree, (node, index, parent) => {
      if (node.type === 'textDirective') {
        const cls = INLINE[node.name];
        if (cls) {
          node.data = { hName: 'span', hProperties: { className: [cls] } };
          return;
        }
        // 不是我們的語法：還原成文字
        const restored = [{ type: 'text', value: ':' + node.name }];
        if (node.children.length) restored.push({ type: 'text', value: '[' }, ...node.children, { type: 'text', value: ']' });
        parent.children.splice(index, 1, ...restored);
        return index + restored.length;
      }

      if (node.type === 'leafDirective') {
        parent.children.splice(index, 1, { type: 'paragraph', children: [{ type: 'text', value: '::' + node.name }] });
        return;
      }

      if (node.type !== 'containerDirective') return;
      const { name } = node;

      if (CALLOUTS[name]) {
        const label = takeLabel(node) || [{ type: 'text', value: CALLOUTS[name] }];
        node.data = { hName: 'div', hProperties: { className: ['callout', `callout-${name}`] } };
        node.children.unshift({
          type: 'paragraph',
          data: { hName: 'div', hProperties: { className: ['callout-title'] } },
          children: [html(ICONS[name]), ...label],
        });
        return;
      }

      if (name === 'detail') {
        const label = takeLabel(node) || [{ type: 'text', value: node.attributes?.title || '細節' }];
        node.data = { hName: 'details', hProperties: { className: ['detail'] } };
        node.children.unshift({
          type: 'paragraph',
          data: { hName: 'summary' },
          children: [html(ICONS.detail), ...label],
        });
        return;
      }

      if (name === 'source') {
        const id = node.attributes?.from;
        const src = sources[id];
        node.data = { hName: 'div', hProperties: { className: ['sourced'] } };
        if (!src) {
          warnings.push(`找不到來源：${id}`);
          node.children.push({
            type: 'paragraph',
            data: { hName: 'div', hProperties: { className: ['source-line', 'source-missing'] } },
            children: [html(ICONS.source), { type: 'text', value: `找不到來源 ${id || ''}` }],
          });
          return;
        }
        const text = [formatDate(src.date), src.event, src.speaker].filter(Boolean).join(' · ');
        node.children.push({
          type: 'paragraph',
          data: { hName: 'div', hProperties: { className: ['source-line'] } },
          children: [{
            type: 'link',
            url: src.url || '#',
            children: [html(ICONS.source), { type: 'text', value: text }],
          }],
        });
        return;
      }

      warnings.push(`不認得的區塊語法：:::${name}`);
    });
  };
}
