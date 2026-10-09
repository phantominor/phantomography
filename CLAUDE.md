# CLAUDE.md

本檔為 phantomography 專案根目錄總覽文件，提供 Claude Code 在此 repo 工作時的架構與慣例說明。

## 專案是什麼

phantomography 是 [phantominor](https://github.com/phantominor/phantominor)（"Phantom's Haven"）的醫學筆記系統。原本規劃放在 phantominor 的 `pages/m`（M for Medicine），改成獨立專案：phantominor 首頁 A–Z 導覽的 `M` 按鈕直接外連到本站。

姊妹專案 [phantomajor](https://github.com/phantominor/phantomajor) 是同樣模式（從 phantominor 拆出、共用 Supabase），架構與慣例可以參考它。

**目前狀態**：只有專案骨架與一個「建置中」首頁，筆記系統的功能、資料模型、是否需要登入都還沒設計。

## 開發指令

```bash
cd frontend
npm run dev      # 本機開發伺服器 (next dev)
npm run build    # 正式建置 (next build)
npm run start    # 啟動建置後的伺服器
npm run lint     # next lint
```

- 沒有測試指令／測試框架。
- 環境變數在 `frontend/.env.local`（不進版控）：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`——跟 phantominor 是**同一個 Supabase 專案**，數值直接沿用。
- 部署在 Vercel（預期網址 `https://phantomography.vercel.app`，phantominor 首頁 M 按鈕連的就是這個網址；若實際網域不同，記得回頭改 phantominor 的 `frontend/pages/index.js`）。之後若加入 Google OAuth 登入，要到 Supabase Dashboard → Authentication → URL Configuration → Redirect URLs 加上本站網域。
- SQL 遷移檔（`backend/supabase/**/*.sql`）**沒有自動執行機制**，是純粹的變更歷史記錄，要套用必須手動貼到 Supabase SQL Editor 執行。命名慣例：`backend/supabase/<子系統>/<子系統>_<序號>_<說明>.sql`。新表建議用 `m_` 前綴，延續 phantominor「M = Medicine」的字母對應，避免跟同一個 Supabase 專案裡其他站的表撞名。

## 整體架構

```
/
├── backend/supabase/     # 純 SQL 遷移歷史，無後端服務
├── frontend/              # 唯一的可執行專案：Next.js 15 (Pages Router) + React 19
│   └── blueprints/        # 設計藍圖，版本化（<name>_v<N>.md）
├── temp/                  # 草稿，非程式碼
└── trash/                 # 廢棄但保留備查的舊檔
```

- 路徑別名：`@/*` → `frontend/`。
- 樣式：純 CSS Modules，不用 Tailwind；優先使用 `styles/variables/base.css` 的品牌 tokens（從 phantominor 複製過來的暖棕色系）。
- `lib/supabase.js`：Supabase browser client 單例。

## 開發規則

沿用 phantominor 的開發規則（見 phantominor 的 CLAUDE.md「開發規則」）：

1. 只做被要求的事、手術式修改、不順手重構。
2. **每次異動都要記錄進 `UPDATE.md`**：最上方（`<!-- UPDATE.md -->` 之後）依 `[YYYY/MM/DD]` + `- **標題**: 簡述` 格式倒序補一筆；第二層以下細項不用粗體，全文不用斜體。
3. 設計藍圖放 `frontend/blueprints/`，有實質進展就新增 `_v(N+1).md`，不覆寫舊版。
4. 日期邏輯一律用本地時間拼字串，不要用 `toISOString()` 取日期部分（UTC+8 時區地雷）。
