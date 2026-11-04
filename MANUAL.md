# 操作手冊

我可以直接用的指令與操作。新增操作時 Claude 會同步更新。

## 筆記整理：/ingest

- 記筆記（三選一）：
    - phantomajor 的 `/m/inbox` 表單，可附照片。
    - 複製 `inbox/_template.md`，照範本填寫，範本本身不要改。
    - 直接把筆記貼在對話裡。
- 流程：
    - 說 `/ingest` → Claude 整理成逐篇筆記 → 我看過，說沒問題
    - Claude 寫提案檔（`temp/proposals/`）→ 我留下要的、刪掉不要的、在項目下方寫意見 → 說「套用提案」

## 校閱：批註

- 流程：
    - 在 .md 要改的那一行行尾寫 `<!-- 改：… -->` → 累積一批 → 說「處理批註」
- 不要把批註寫在表格的兩列之間，會把表格切斷。
- 只改一處：在 VS Code 選取那段文字 → 直接說要怎麼改。
- 一頁看完 → 跟 Claude 說 → 標成已校閱。

## 補連結：/relink

- 說 `/relink` → Claude 全站補上各頁之間的連結。
- 時機到了 Claude 會主動問我要不要跑。

## 醫學周報

- 自動產出：
    - 每週一早上約 6 點自動產出 → GitHub 出現 `weekly/<期別>` 的 PR
- 讓周報上線：
    - GitHub 的 Pull requests → 點進 `weekly/<期別>` → Merge pull request → Confirm merge → 回本機跑 `git pull`
- 手動做一期：說 `/weekly`。
- 對周報有意見：直接說，或用批註。
- 排程管理：https://claude.ai/code/routines/trig_017wAfVJFz7YjCRYmRtbQMBJ

## 上線與預覽

- 讓網站更新：
    - Claude 改完並 commit → 我跑 `git push` → Vercel 自動部署
- 本機預覽：在 `frontend` 資料夾跑 `npm run dev`。

## 記錄檔

- `TODO.md`：待辦清單。
- `UPDATE.md`：異動記錄。
- `temp/proposals/`：等我回覆的提案。
