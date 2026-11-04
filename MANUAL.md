# 操作手冊

我可以直接用的指令與操作。新增操作時 Claude 會同步更新。

## 筆記整理：/ingest

- 記筆記：
    - phantomajor 的 `/m/inbox` 表單，可附照片。
    - 或複製 `inbox/_template.md`，照範本填寫，範本本身不要改。
    - 或直接把筆記貼在對話裡。
- 說 `/ingest`，Claude 會整理成逐篇筆記，另外寫提案檔放在 `temp/proposals/`。
- 我先看逐篇筆記，沒問題就說一聲。
- 提案檔：要的項目留著，不要的刪掉，有意見寫在項目下方。改完說「套用提案」。

## 校閱：批註

- 在 .md 檔要改的那一行行尾寫：`<!-- 改：… -->`
- 累積一批後說「處理批註」。
- 不要把批註寫在表格的兩列之間，會把表格切斷。
- 只改一處的話，在 VS Code 選取那段文字，直接說要怎麼改。
- 一頁看完了就跟 Claude 說，Claude 會把它標成已校閱。

## 補連結：/relink

- 說 `/relink`，Claude 會全站補上各頁之間的連結。
- 時機到了 Claude 會主動問我要不要跑。

## 醫學周報

- 每週一早上約 6 點，周報會自動產出，並在 GitHub 開一個 PR。
- 讓周報上線：
    1. 在 GitHub 打開 Pull requests，點進 `weekly/<期別>`。
    2. 按 Merge pull request，再按 Confirm merge。
    3. 回本機跑 `git pull`。
- 手動做一期：說 `/weekly`。
- 對周報有意見：直接說，或用批註。
- 排程管理：https://claude.ai/code/routines/trig_017wAfVJFz7YjCRYmRtbQMBJ

## 上線與預覽

- Claude 只會 commit，不會 push。要讓網站更新，我自己跑 `git push`。
- 本機預覽：在 `frontend` 資料夾跑 `npm run dev`。

## 記錄檔

- `TODO.md`：待辦清單。
- `UPDATE.md`：異動記錄。
- `temp/proposals/`：等我回覆的提案。
