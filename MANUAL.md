# 操作手冊

我（使用者）自己的操作手冊：跟 Claude 討論後定下來、我可以直接使用的指令、說法與操作步驟都整理在這裡。之後新增了操作方式，Claude 會一併更新這份手冊。

## 快速對照

| 我想做的事 | 怎麼說或怎麼做 |
|---|---|
| 整理收件匣與 inbox 的筆記 | `/ingest`（或「整理 inbox」） |
| 回覆整合提案後套用 | 改好 `temp/proposals/` 的提案檔，說「套用提案」 |
| 全站補連結 | `/relink`（或「整合連結」） |
| 手動做一期周報 | `/weekly`（或「做周報」） |
| 上線自動周報 | GitHub 上把 `weekly/<期別>` 的 PR 按 Merge |
| 校閱時留修改意見 | 在 .md 行尾寫 `<!-- 改：… -->`，累積後說「處理批註」 |
| 單一處小修改 | 在 VS Code 選取那段文字，直接跟 Claude 說要怎麼改 |
| 讓網站更新 | `git push`（Claude 只 commit、不 push） |

## 一、記筆記與整理（/ingest）

### 記筆記

兩種方式擇一：

1. **phantomajor 的 `/m/inbox` 表單**（平常用，可附照片）：內容先存在 Supabase，等 `/ingest` 抓下來。
2. **直接放檔案進 `inbox/`**：複製 `inbox/_template.md`、檔名隨意，填好 frontmatter（`date`、`type`、`event` 必填；`time`、`speaker`、`place` 選填），筆記寫在「筆記」底下。
    - 範本本身不要改、不要刪。
    - 速記、重點、查到的資料、心得都寫在一起，不用分區；心得標明是（講者）還是（我）的觀點，查到的資料附網址。
    - 病人資料可以先照記，整理時會去識別化（只針對病人；講者、地點、醫院可以公開）。
    - 也可以直接把筆記貼在對話裡，說「整理這篇筆記」。

### 跑 /ingest 之後

1. Claude 先抓收件匣（`npm run pull-inbox`），再把每篇整理成逐篇筆記，存在 `content/journal/<年>/`；標題、標籤由 Claude 決定。
2. 要改哪些知識頁，寫成提案檔 `temp/proposals/<檔名>.md`；心得的草稿也放在提案檔，確認後才放進筆記。
3. **我看逐篇筆記**：沒問題就說一聲，inbox 原檔才會刪。
4. **我回覆提案檔**：
    - 要的項目留著，不要的直接刪掉，有意見寫在該項目下方；也可以在對話中回答。
    - 回覆完說「套用提案」，Claude 改知識頁、刪提案檔。
5. 提案檔還沒回覆時，Claude 每次對話都會提醒。

## 二、校閱頁面

### 批註（主要方式）

1. 在 VS Code 打開要改的 .md 檔，在要改的那一行**行尾**寫：
    ```
    - 第二線：ANA、抗平滑肌抗體、IgG。 <!-- 改：補上 anti-LKM1 -->
    ```
    新增、刪除、修改、提問都可以寫。
2. 累積一批後說「**處理批註**」。Claude 會找出全站批註、逐條處理並刪掉；看不懂的先留著，在回覆裡問我。
3. 注意事項：
    - 寫在行尾最安全；如果要自己獨立一行，在條列中要縮排，**不要插在表格的兩列之間**（會把表格切成兩段）。
    - 網頁、HTML 原始碼、搜尋都看不到批註；每次建置時終端機會列出「未處理批註」與行號。

### 選取文字（單一小修改）

在 VS Code 選取一段文字，直接說「這段改成……」；Claude 會收到檔名與行號。

### 校閱完一頁

- 告訴 Claude 這頁校閱完了，Claude 會刪掉 frontmatter 的 `status: initial`，`updated` 改成當天。
- 紅字、粗體可以順便增刪：
    - 紅字只用於特別重要、難記的數值與切點。
    - 粗體只加在關鍵詞本身，不整句加粗。

### 圖片

- Claude 會主動找開放授權圖。
- 我手邊有好圖、或想指定某處要圖時，直接把圖給 Claude 並說明放在哪。

## 三、補連結（/relink）

- 說 `/relink`，Claude 會整頁讀過全站，補上各頁之間該有的 wiki-link（基礎與臨床、各分類之間、知識頁連到逐篇筆記）。
- 完成一個分類、開始新分類前、或逐篇筆記新增約 10 篇時，Claude 會主動問要不要跑；不想跑就說先不要，下次再問。

## 四、醫學周報

### 自動排程

- 每週一台北時間早上約 6 點，雲端排程自動產出上一週的周報，推到 GitHub 分支 `weekly/<期別>`，並對 `main` 開 PR。
- 排程管理頁：https://claude.ai/code/routines/trig_017wAfVJFz7YjCRYmRtbQMBJ（也可以在 Claude Code 用 `/schedule` 查看或修改）。

### 上線（Merge PR）

1. 到 GitHub 的 phantominor/phantomography → **Pull requests**，打開 `weekly/<期別>` 那個 PR。
2. 在 **Files changed** 看內容；想先看渲染效果，PR 頁面上若有 Vercel 的 Preview 連結可以點開。
3. 沒問題就按 **Merge pull request** → **Confirm merge**；Vercel 會自動部署，幾分鐘後上線。
4. 合併後可以按 **Delete branch** 刪掉分支。
5. 回到本機跑 `git pull`，讓本機也有這期周報（不然下次本機 commit 會和遠端分岔）。

有問題的話先不要 Merge，把意見告訴 Claude（或直接在 PR 上改）。

### 手動做一期

說 `/weekly`（或「做周報」「這週的醫學周報」），Claude 會做上一個完整週；指定週可以說「做 10/21 那週的周報」。周報不經我審核，直接寫成正式檔並 commit。

### 給周報意見

讀完直接說想改哪裡，或用批註；Claude 會照改，累積的評語會整理成新版藍圖。

## 五、本機開發與上線

```bash
cd frontend
npm run dev      # 本機預覽（http://localhost:3000），改了內容要重開才會更新搜尋索引
npm run build    # 正式建置，會列出失效連結與未處理批註
```

- Claude 每次改完都會自己 commit，但**不會 push**；要讓網站更新，我自己在專案根目錄跑 `git push`，Vercel 會自動部署到 https://phantomography.vercel.app 。
- 樣式樣張在網站的 `/style` 頁。

## 六、記錄檔

- `TODO.md`：待辦清單；Claude 每則回覆結尾都會列出未完成項目。
- `UPDATE.md`：每次異動的記錄。
- `temp/proposals/`：等我回覆的整合提案。
- `temp/weekly-followups.md`：周報下期要追的事件。
