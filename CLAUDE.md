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
- `predev`／`prebuild` 會先跑 `scripts/build-search-index.mjs` 產生搜尋索引 `public/search-index.json`（不進版控）；dev 中改了內容要重開 dev server 索引才會更新。`prebuild` 另外跑 `scripts/build-sitemap.mjs` 產生 `public/sitemap.xml` 與 `robots.txt`（同樣不進版控，`noindex`／`draft` 頁不列入）。
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
├── TODO.md              # 待辦清單（完成就刪，記錄寫進 UPDATE.md）
├── .claude/skills/ingest/ # /ingest：inbox → 逐篇筆記 → 整合提案的完整流程
├── .claude/skills/relink/ # /relink：定期全站掃描、補上各頁之間的 wiki-link
├── inbox/                 # 使用者丟進來待整理的原始筆記，不進版控（只有 _template.md 進版控，不可刪）
├── temp/                  # 草稿，非程式碼；temp/proposals/ 是等使用者回覆的整合提案
└── trash/                 # 廢棄但保留備查的舊檔
```

- 路徑別名：`@/*` → `frontend/`。
- 樣式：純 CSS Modules，不用 Tailwind；tokens 在 `styles/variables/base.css`（黑白灰，比照 TWMLE，含深色模式；不再沿用 phantominor 的暖棕色）。筆記內文是 `dangerouslySetInnerHTML` 產生的，樣式集中在全域的 `styles/note.css`（`.note` 底下）。
- 建置時 console 會列出失效連結與找不到的來源，新增內容後要看一下。
- 流程圖：內文寫 ```mermaid 圖標題 區塊（圖標題會顯示在圖上方，也會進搜尋索引；`lib/markdown/rehypeElements.js` 轉成占位元素，`lib/mermaid.js` 在瀏覽器端繪製）。可用的共用節點樣式：`:::danger`（緊急）、`:::key`（結論）、`:::start`（起點）；判斷節點用六角形 `{{"…？"}}`，同一層盡量不超過 4 個節點。標籤裡的 `<`、`>` 要寫成 `#60;`、`#62;`。要在多頁出現的流程圖（例如單一疾病的處置流程）存成 `content/_charts/<id>.mmd`（第一行 `%% title: 圖標題`），內文用 `::chart{id="<id>"}` 嵌入；從症狀出發的檢查流程只放在病患主訴，其他頁用連結。
- 逆連結：建置時由 `lib/content.js` 的 `buildBacklinks` 掃描全站跨頁、指到段落的 wiki-link，被連到的標題旁自動出現來源清單，不用手動維護。
- 跨頁連結：不預先留指向尚未建立頁面的連結；一批新頁面寫完後跑 `/relink` 全站讀一次補連結（`.claude/skills/relink/SKILL.md`）。沒有直接提到詞彙的獨立討論也可以在段落末尾加一行「詳見 [[…]]」；太瑣碎、不整合進知識頁的內容留在逐篇筆記，從知識頁用「詳見」連出去。
- 總覽頁卡片：`::cards`（或 `::cards{of="<導覽區>"}`）依 `data/nav.js` 產生下一層卡片；描述取各頁 frontmatter 的 `description`，圖示取 `nav.js` 的 `icon`（對應 `lib/markdown/icons.js` 的 `CARD_ICONS`）。
- 逐篇筆記：`content/journal/<YYYY>/<YYYYMMDD>-<slug>.md`，列表（`::journal`，含標籤篩選）與左側導覽依 frontmatter `date` 自動產生（`lib/journal.js`），不用改 `nav.js`；頁尾「已整合至」由建置時掃描全站 `:::source{from="<檔名>"}` 產生。Claude 依速記補寫的內容包 `:::supplement`。
- `lib/supabase.js`：Supabase browser client 單例，目前沒有使用。

## 新增逐篇筆記（/ingest）

使用者平常在 phantomajor 的 `/m/inbox` 用表單記筆記（可附照片，暫存在 Supabase），也可以照 `inbox/_template.md` 直接放檔案進 `inbox/`，然後說 `/ingest`。完整步驟見 `.claude/skills/ingest/SKILL.md`。重點：

- 第一步跑 `npm run pull-inbox`（`scripts/pull-inbox.mjs`）：用 `.env.local` 的 `M_INGEST_SECRET` 呼叫 phantomajor 的密語函式，把收件匣寫成 inbox 檔（照片存同名資料夾），寫入成功才從 Supabase 刪除。設計見 phantomajor 的 `frontend/blueprints/m/m_v1.md`。
- 照片用 `scripts/process-photo.mjs` 裁切、轉 WebP（長邊 1600 px）存進 `public/media/journal/<YYYY>/`，依 `[圖 N]` 標記放進筆記；病人可辨識資訊裁掉或不用。

- 整理成逐篇筆記（前三種內容條列、心得寫敘述文、補寫內容包 `:::supplement`），標籤由 Claude 下，沿用既有標籤。
- 要改哪些知識頁寫成提案檔 `temp/proposals/<檔名>.md`，等使用者回覆才改；套用後刪提案檔。
- 使用者確認逐篇筆記後，刪除 inbox 原檔。
- 去識別化只針對病人（姓名、病歷號、可辨識特徵與影像）；講者、地點、醫院可以公開。
- **每次對話開始時先看 `temp/proposals/`，有未回覆的提案就提醒使用者回答**（回覆結尾的「還沒做」也要列出）。

## 開發規則

沿用 phantominor 的開發規則（見 phantominor 的 CLAUDE.md「開發規則」）：

1. 只做被要求的事、手術式修改、不順手重構。
2. **每次異動都要記錄進 `UPDATE.md`**：最上方（`<!-- UPDATE.md -->` 之後）依 `[YYYY/MM/DD]` + `- **標題**: 簡述` 格式倒序補一筆；第二層以下細項不用粗體，全文不用斜體。
3. 設計藍圖放 `frontend/blueprints/`，有實質進展就新增 `_v(N+1).md`，不覆寫舊版。
4. 日期邏輯一律用本地時間拼字串，不要用 `toISOString()` 取日期部分（UTC+8 時區地雷）。
