---
name: weekly
description: 產出一期醫學周報（談資週報）：蒐集上一週醫學生、住院醫師聊得起來的醫界話題（研究、指引與新藥、台灣與國際醫界人物事件、正反觀點、醫學史、論壇熱議），每則先寫背景知識、再寫成敘述性的說明文並標證據強度，連回醫學筆記；草稿放 temp/proposals/，使用者說「周報上線」才移進 content/weekly/。使用者說 /weekly、「做周報」、「這週的醫學周報」，或雲端排程每週觸發時使用。
---

# /weekly：一期醫學周報

分段、來源與論壇規則以藍圖 `frontend/blueprints/weekly_v2.md` 為準；條目寫法、份量與評分欄以 `weekly_v3.md` 為準（新版本出來就看新版）。

## 1. 算期別

```bash
cd frontend && node scripts/weekly-period.mjs            # 上一個完整週
cd frontend && node scripts/weekly-period.mjs 2026-10-21 # 指定某一週
```

- 用輸出的 `issue`、`start`、`end`、`date`、`file`、`title`，**不要自己判斷今天幾號**（雲端主機是 UTC）。
- `file` 或草稿 `temp/proposals/weekly-<issue>.md` 已存在：這期做過了，停下來告訴使用者，不覆寫。

## 2. 蒐集

- 只收發表日落在 `start`–`end` 的消息（指引、新聞稿以發布日為準；論文以線上發表日為準，紙本刊出日不算）。
- 期刊用官方提供給程式讀的管道，不抓文章頁、不偽裝瀏覽器：
    - 目錄：各期刊 RSS（NEJM `https://www.nejm.org/action/showFeed?type=etoc&feed=rss&jc=nejm`、Lancet `https://www.thelancet.com/rssfeed/lancet_online.xml`、Nature Medicine `https://www.nature.com/nm.rss`、JAMA `https://jamanetwork.com/rss/site_3/67.xml` 等）。
    - 摘要與數字：PubMed E-utilities，`esearch.fcgi?db=pubmed&term=<關鍵字>+AND+N+Engl+J+Med[ta]&datetype=edat&mindate=<start>&maxdate=<end>` 找 PMID，再 `efetch.fcgi?db=pubmed&id=<PMID>&rettype=abstract&retmode=text` 讀摘要（不要開 pubmed.ncbi.nlm.nih.gov 網頁，會跳 CAPTCHA）。開放取用全文用 Europe PMC REST API。
    - `url` 寫 `https://doi.org/<DOI>`。
- 官方：FDA、WHO、疾管署新聞稿列表（`https://www.cdc.gov.tw/Bulletin/List/MmgtpeidAR5Ooai4-fgHzQ`）、衛福部、健保署、食藥署。
- 台灣醫界與國際醫界：用網路搜尋找本週的醫院、醫師、健保、醫糾、醫界人物新聞，再打開原始報導讀過；STAT News、Retraction Watch 看國際事件。Google News RSS 被 robots.txt 禁止，不用。
- 正反觀點：找本週有正反雙方公開表態的議題（學會草案、政策爭議），雙方論點都要有原文出處。
- 醫學史：本週日期的醫學人物生日、重大發現週年，用 Wikipedia API（`/api/rest_v1/page/summary/<title>` 或 `w/api.php?action=query&prop=extracts`）核對日期與事蹟。
- 論壇：見藍圖 §5。Dcard 擋程式存取、A-Pen 條款禁止爬蟲與未經同意轉載，都不抓；使用者貼來的連結或內容才收。PTT 用站內搜尋 `https://www.ptt.cc/bbs/Gossiping/search?q=<關鍵字>+recommend:20`（加 cookie `over18=1`），以文章網址的 Unix 時間篩出本期範圍；文章與推文都要讀過才寫摘要。
- **每一則都要實際讀過來源**，記下原文標題、發表日、網址與關鍵數字。讀不到的不寫，常識性的補充也要找到出處（例如 Wikipedia），不憑記憶補。

## 3. 篩選

- 依「談資」評分挑：新奇度（這週才有）、和醫學生與住院醫師日常的相關度（值班、考試、選科、職涯）、話題性（一句話能不能引起興趣）、可信度（證據強度、來源層級）。
- 本週頭條 1 則；其餘分段各 1–5 則，整期 5–10 分鐘讀完；沒有內容的分段整段不寫。

## 4. 撰寫

- 先寫成草稿 `temp/proposals/weekly-<issue>.md`（不是 `file`），frontmatter 照 v1 藍圖 §3，frontmatter 後面接一段 HTML 註解的審核說明（照前一期草稿的寫法），h2 依 v2 藍圖 §2 的順序與名稱。
- 每則一個 h3，照 v3 藍圖 §2 的結構寫：新聞標題式的標題 → `::::news{subjects="…" evidence="…" source="…" date="…" url="…"}` → 導言 → `:::background` 背景知識 → h4 小標分段的敘述 → 「出處：」。
  - 背景知識寫專科知識，也寫導火線、時空背景、相關情勢；新藥、新政策要查台灣現況。
  - 語調正式、敘述性；數字多用表格；機轉與藥物作用位置一定配圖（先找開放授權的論文圖）；關鍵處粗體。
  - 每期挑一則用學長姐對話寫。
  - `evidence` 只用 `lib/weekly.js` 的 `EVIDENCE_LEVELS`；`subjects` 只用 `data/tags.js` 的科別，醫學史、論壇可以不寫。
  - 疾病、藥物、檢查第一次出現就連到知識頁，連得到才連。
  - 每則下方放評分欄（`> 評分｜題材：　背景：　可讀性：　篇幅：　專業深度：　話題性：　整體：` 與 `> 評語：`）。
- 份量：約 6–8 則、10 分鐘讀完，寧可少而深，不寫兩三句的短訊；論壇只收能寫出評析的 1–2 則。
- 涉及具名人物、爭議、醫糾、刑案的條目，在 `:::news` 裡加 `:::review` 寫要使用者確認什麼（外層改 `::::news`）；論壇段開頭放一個 `:::review`。
- 刑案被告的名字照報導寫時要在 `:::review` 註明、由使用者決定；偵查中、沒有起訴的人不寫全名；不帶出可識別病人的資訊。
- 只讀到摘要時寫「依摘要」；不確定的包 `:::verify`。
- 文字規範同知識頁：紅字只標必背數字、不用斜體、中英文之間空一格、斜線用半形 `/`。不轉貼原文段落。

## 5. 檢查

1. 逐則對照來源：每個數字、每個說法都能在讀過的原文裡找到；找不到的刪掉或包 `:::verify`。
2. 上線後 `cd frontend && npm run build`（記憶體不夠時用 `npx next dev` 開該期頁面），看失效連結、清單外的 subjects 與 evidence、沒有原文連結的消息；草稿階段可以暫時複製到 `file` 檢查，檢查完刪掉。

## 6. 整合到知識頁

- 已改變臨床建議、且和既有知識頁相關的消息，寫在草稿最後的 HTML 註解「整合到知識頁」，格式同 `/ingest` 的提案：哪一頁哪一段、插入什麼文字；插入的段落末尾加「詳見 [[<期別檔名>#<則標題>|…]]（醫學周報）」。衝突寫進「衝突（需要你決定）」。沒有就寫「本期沒有」。

## 7. 收尾與上線

1. 草稿完成：記進 `UPDATE.md`、commit（不 push），回報草稿路徑、各分段則數、頭條、待審核條目、依摘要的項目、要改的知識頁。雲端排程時推到新分支 `weekly/<issue>`、開 PR，由使用者在 PR 裡改草稿。
2. 使用者在草稿裡改完、說「周報上線」：讀使用者的修改與回覆，照著改；刪掉審核說明、`:::review` 區塊、評分欄與「整合到知識頁」註解；移到 `file`；套用知識頁修改；build 檢查；記 `UPDATE.md`、commit。
