// lib/charts.js
// 共用流程圖：content/_charts/<id>.mmd，內文用 ::chart{id="<id>"} 嵌入（同一張圖可放在多個頁面，只維護一份）。
// 檔案第一行可寫「%% title: 圖標題」，其餘是 Mermaid 原始碼。只在建置時執行。

import fs from 'fs';
import path from 'path';

export const CHARTS_DIR = path.join(process.cwd(), 'content', '_charts');

export function parseChart(text) {
  const lines = text.replace(/\r\n/g, '\n').trim().split('\n');
  const m = lines[0]?.match(/^%%\s*title:\s*(.+)$/);
  return { title: m ? m[1].trim() : '', source: (m ? lines.slice(1) : lines).join('\n').trim() };
}

export function loadChart(id, dir = CHARTS_DIR) {
  const file = path.join(dir, `${id}.mmd`);
  if (!/^[a-z0-9-]+$/.test(id) || !fs.existsSync(file)) return null;
  return parseChart(fs.readFileSync(file, 'utf8'));
}
