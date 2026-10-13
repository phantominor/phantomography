# CLAUDE.md

本檔為 phantomography 專案根目錄總覽文件，提供 Claude Code 在此 repo 工作時的架構與慣例說明。

## 專案是什麼

phantomography 是 [phantominor](https://github.com/phantominor/phantominor)（"Phantom's Haven"）的醫學筆記系統。原本規劃放在 phantominor 的 `pages/m`（M for Medicine），改成獨立專案：phantominor 首頁 A–Z 導覽的 `M` 按鈕直接外連到本站。

姊妹專案 [phantomajor](https://github.com/phantominor/phantomajor) 是同樣模式（從 phantominor 拆出、共用 Supabase），架構與慣例可以參考它。

**目前狀態**：設計藍圖見 `frontend/blueprints/notes-system_v3.md`（最新版）（資訊架構、內容語法、視覺規範、分期都以藍圖為準）。第一期的版面與渲染流程已完成；諸病微精 33 頁匯入自同學的 TWMLE 筆記（經同意，每頁 frontmatter 的 `credit` 註明出處），其他分類尚未撰寫；樣式樣張在 `/style`。純靜態網站、無登入、無資料庫，所有新增都在本地與 Claude 協作完成。

## 開發指令

```bash
cd frontend
npm run dev      # 本機開發伺服器 (next dev)
npm run build    # 正式建置 (next build)
npm run start    # 啟動建置後的伺服器
npm run lint     # next lint
```

- 沒有測試指令／測試框架。
- `predev`／`prebuild` 會先跑 `scripts/build-search-index.mjs` 產生搜尋索引 `public/search-index.json`（不進版控）；dev 中改了內容要重開 dev server 索引才會更新。
- 環境變數在 `frontend/.env.local`（不進版控）：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`——跟 phantominor 是**同一個 Supabase 專案**，數值直接沿用。
- 部署在 Vercel（預期網址 `https://phantomography.vercel.app`，phantominor 首頁 M 按鈕連的就是這個網址；若實際網域不同，記得回頭改 phantominor 的 `frontend/pages/index.js`）。之後若加入 Google OAuth 登入，要到 Supabase Dashboard → Authentication → URL Configuration → Redirect URLs 加上本站網域。
- SQL 遷移檔（`backend/supabase/**/*.sql`）**沒有自動執行機制**，是純粹的變更歷史記錄，要套用必須手動貼到 Supabase SQL Editor 執行。命名慣例：`backend/supabase/<子系統>/<子系統>_<序號>_<說明>.sql`。新表建議用 `m_` 前綴，延續 phantominor「M = Medicine」的字母對應，避免跟同一個 Supabase 專案裡其他站的表撞名。

## 整體架構

```
/
├── backend/supabase/     # 純 SQL 遷移歷史，無後端服務
├── frontend/              # 唯一的可執行專案：Next.js 15 (Pages Router) + React 19
│   ├── content/           # 所有筆記 Markdown；路徑去掉 .md 就是網址（index.md 對應資料夾本身）
│   ├── lib/content.js     # 掃描 content/、建立索引（標題、aliases、標題錨點）
│   ├── lib/markdown/      # unified 渲染流程：wiki-link、自訂區塊、標題編號、表格/圖片處理
│   ├── data/nav.js        # 上方分頁與左側導覽結構（尚未建立的頁面顯示灰字）
│   ├── components/layout/ # 全站版面（三欄、目錄、深色模式）
│   └── blueprints/        # 設計藍圖，版本化（<name>_v<N>.md）
├── inbox/                 # 使用者丟進來待整理的原始筆記，不進版控
├── temp/                  # 草稿，非程式碼
└── trash/                 # 廢棄但保留備查的舊檔
```

- 路徑別名：`@/*` → `frontend/`。
- 樣式：純 CSS Modules，不用 Tailwind；tokens 在 `styles/variables/base.css`（黑白灰，比照 TWMLE，含深色模式；不再沿用 phantominor 的暖棕色）。筆記內文是 `dangerouslySetInnerHTML` 產生的，樣式集中在全域的 `styles/note.css`（`.note` 底下）。
- 建置時 console 會列出失效連結與找不到的來源，新增內容後要看一下。
- `lib/supabase.js`：Supabase browser client 單例，目前沒有使用。

## 開發規則

沿用 phantominor 的開發規則（見 phantominor 的 CLAUDE.md「開發規則」）：

1. 只做被要求的事、手術式修改、不順手重構。
2. **每次異動都要記錄進 `UPDATE.md`**：最上方（`<!-- UPDATE.md -->` 之後）依 `[YYYY/MM/DD]` + `- **標題**: 簡述` 格式倒序補一筆；第二層以下細項不用粗體，全文不用斜體。
3. 設計藍圖放 `frontend/blueprints/`，有實質進展就新增 `_v(N+1).md`，不覆寫舊版。
4. 日期邏輯一律用本地時間拼字串，不要用 `toISOString()` 取日期部分（UTC+8 時區地雷）。
