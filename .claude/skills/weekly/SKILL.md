---
name: weekly
description: 產出一期醫學周報（談資週報）：蒐集上一週醫學生、住院醫師聊得起來的醫界話題（研究、指引與新藥、台灣與國際醫界人物事件、正反觀點、醫學史、論壇熱議），每則先寫背景知識、再寫成敘述性的說明文並標證據強度，連回醫學筆記；不經使用者審核，直接寫進 content/weekly/、建置檢查、commit。使用者說 /weekly、「做周報」、「這週的醫學周報」，或雲端排程每週觸發時使用。
---

# /weekly：一期醫學周報

規格以藍圖 `frontend/blueprints/weekly_v4.md` 為準（整合 v1–v3 與兩輪評分；新版本出來就看新版）。檔案位置、frontmatter、期別在 v1 §3–§5。

## 1. 算期別

```bash
cd frontend && node scripts/weekly-period.mjs            # 上一個完整週
cd frontend && node scripts/weekly-period.mjs 2026-10-21 # 指定某一週
```

- 用輸出的 `issue`、`start`、`end`、`date`、`file`、`title`，**不要自己判斷今天幾號**（雲端主機是 UTC）。
- `file` 已存在：這期做過了，停下來告訴使用者，不覆寫。

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

- 依新奇度（這週才有）、和醫學生與住院醫師日常的相關度（值班、考試、選科、職涯）、話題性、可信度挑。
- 份量照 v4 §2：10–14 則；話題類每週最多 5 則，敏感事件（性騷擾刑案、醫師猝逝）也要收；不寫短訊。
- 先看 `temp/weekly-followups.md`：清單上的事件有後續就收進本期。

## 4. 撰寫

- 直接寫成正式檔 `file`（frontmatter 照 v1 §3），不寫草稿、不放 `:::review`、不放評分欄。
- 每則照 v4 §3：新聞標題式 h3 → `::::news{subjects="…" evidence="…" source="…" date="…" url="…"}` → 導言 → `:::background` → h4 小標分段 → 「出處：」。
- 查證深度照 v4 §4：讀者會追問的細節先查好；台灣現況（許可證、適應症、健保）用食藥署與健保署開放資料查，寫肯定句；縣市規定查代表縣市。
- 每期一則對話照 v4 §5（`:::dialogue`，角色每週換、語氣套用角色性格，交代試驗是誰做的，結尾小互動）；用過的角色記在 v4 §5 的清單。
- 人名與追蹤照 v4 §6；後續刊出時，在舊期那則最後補一行「後續：…」連到新的一期。
- `evidence` 只用 `lib/weekly.js` 的 `EVIDENCE_LEVELS`；`subjects` 只用 `data/tags.js` 的科別，醫學史、論壇可以不寫。
- 只讀到摘要時寫「依摘要」；不確定、又查不到的說法刪掉，不包 `:::verify` 上線。
- 文字規範同知識頁：紅字只標必背數字、不用斜體、中英文之間空一格、斜線用半形 `/`。不轉貼原文段落。

## 5. 檢查

1. 逐則對照來源：每個數字、每個說法、每個人名與單位都能在讀過的原文裡找到；憑記憶補的（例如人名的中文寫法、作者所屬機構）一律刪掉或改成原文寫法。
2. `cd frontend && npm run build`（記憶體不夠時用 `npx next dev` 開該期頁面），看失效連結、清單外的 subjects 與 evidence、沒有原文連結的消息。

## 6. 整合到知識頁

- 已改變臨床建議、且和既有知識頁相關的消息，直接改知識頁：相關段落加一句，末尾加「詳見 [[<期別檔名>#<則標題>|醫學周報 YYYY 第 N 週]]」。
- 和知識頁現有內容衝突時，保留原內容、加註新證據，並在回報裡說明。

## 7. 收尾

- 更新 `temp/weekly-followups.md`、記 `UPDATE.md`、commit（不 push）。
- 回報：各分段則數、頭條、對話那則、改了哪些知識頁、新增或結束的追蹤事件。使用者想改哪裡就直接改，評語累積後出新版藍圖。
- 雲端排程時推到新分支 `weekly/<issue>` 並開 PR（合併即上線）。
