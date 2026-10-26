// scripts/pull-inbox.mjs
// 從 phantomajor 的逐篇筆記收件匣（/m/inbox，Supabase 的 m_inbox 系列表）抓下待整理的筆記，
// 寫成 inbox/<YYYYMMDD>-<HHmm>-<id 前 6 碼>.md（格式同 inbox/_template.md），照片存到同名資料夾，
// 全部寫入成功才從 Supabase 刪除那一篇。中途失敗就不刪，下次重抓會覆寫同名檔案。
// 用法：npm run pull-inbox（/ingest 的第一步）。
// 需要 .env.local 的 NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY、M_INGEST_SECRET；
// 讀取走只接受密語的函式（phantomajor backend/supabase/m/m_02_ingest_functions.sql），不用登入。

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const INBOX = path.resolve(ROOT, '..', 'inbox');

process.loadEnvFile(path.join(ROOT, '.env.local'));
const { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey, M_INGEST_SECRET: secret } = process.env;
if (!url || !anonKey || !secret) {
  console.error('[pull-inbox] .env.local 缺少 NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY 或 M_INGEST_SECRET');
  process.exit(1);
}

// 直接打 PostgREST 的 RPC 端點（supabase-js 在 Node 20 會要求 WebSocket，這裡用不到）
async function rpc(name, args) {
  const res = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_secret: secret, ...args }),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`${name}：${data?.message || res.status}`);
  return data;
}

const pad2 = (n) => String(n).padStart(2, '0');
const yaml = (v) => JSON.stringify(v); // JSON 字串就是合法的 YAML 字串

const SECTIONS = [
  ['quick_notes', '速記'],
  ['key_points', '重點'],
  ['research', '查閱資料'],
  ['reflections', '心得'],
];

function toMarkdown(note, base, photoFiles) {
  const fm = [
    '---',
    `date: ${note.event_date}`,
    note.event_time ? `time: "${note.event_time.slice(0, 5)}"` : null,
    `type: ${note.event_type}`,
    `event: ${yaml(note.event_name)}`,
    note.speakers?.length ? `speaker: [${note.speakers.map(yaml).join(', ')}]` : null,
    note.place ? `place: ${yaml(note.place)}` : null,
    `source: ${yaml(`phantomajor /m/inbox（${note.id}）`)}`,
    '---',
  ].filter(Boolean);
  const body = SECTIONS.map(([key, label]) => `## ${label}\n\n${(note[key] || '').trim()}\n`);
  if (photoFiles.length) {
    body.push('## 照片\n\n內文的 [圖 N] 標記對應下列照片。\n\n'
      + photoFiles.map((p) => `- 圖 ${p.no}：\`inbox/${base}/${p.file}\`${p.caption ? `　${p.caption}` : ''}`).join('\n') + '\n');
  }
  return fm.join('\n') + '\n\n' + body.join('\n');
}

const EXT = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' };

let notes;
try {
  notes = await rpc('m_inbox_pull');
} catch (e) {
  console.error(`[pull-inbox] 讀取收件匣失敗（密語錯誤或 SQL 尚未執行？）：${e.message}`);
  process.exit(1);
}
if (!notes.length) {
  console.log('[pull-inbox] 收件匣是空的');
  process.exit(0);
}

fs.mkdirSync(INBOX, { recursive: true });
let ok = 0;
for (const note of notes) {
  const time = note.event_time ? note.event_time.slice(0, 5).replace(':', '') : '0000';
  const base = `${note.event_date.replace(/-/g, '')}-${time}-${note.id.slice(0, 6)}`;
  try {
    const photoFiles = [];
    if (note.photos.length) {
      const dir = path.join(INBOX, base);
      fs.mkdirSync(dir, { recursive: true });
      for (const p of note.photos) {
        const photo = await rpc('m_inbox_photo', { p_photo_id: p.id });
        if (!photo) throw new Error(`找不到照片 ${p.id}`);
        const file = `${pad2(p.sort_order)}.${EXT[photo.mime] || 'jpg'}`;
        fs.writeFileSync(path.join(dir, file), Buffer.from(photo.data_base64, 'base64'));
        photoFiles.push({ no: p.sort_order, file, caption: p.caption });
      }
    }
    fs.writeFileSync(path.join(INBOX, `${base}.md`), toMarkdown(note, base, photoFiles));
    await rpc('m_inbox_delete', { p_id: note.id });
    ok += 1;
    console.log(`[pull-inbox] inbox/${base}.md　${note.event_name}${photoFiles.length ? `（照片 ${photoFiles.length} 張）` : ''}`);
  } catch (e) {
    console.error(`[pull-inbox] ${note.event_name} 失敗，沒有從 Supabase 刪除：${e.message}`);
  }
}
console.log(`[pull-inbox] 完成 ${ok} / ${notes.length} 篇`);
if (ok < notes.length) process.exit(1);
