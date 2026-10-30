---
name: weekly
description: 產出一期醫學周報（談資週報）：蒐集上一週醫學生、住院醫師聊得起來的醫界話題（研究、指引與新藥、台灣與國際醫界人物事件、正反觀點、醫學史、論壇熱議），每則寫重點與「可以聊什麼」並標證據強度，連回醫學筆記，存進 content/weekly/。使用者說 /weekly、「做周報」、「這週的醫學周報」，或雲端排程每週觸發時使用。
---

# /weekly：一期醫學周報

定位、分段、條目格式、來源與論壇規則以藍圖 `frontend/blueprints/weekly_v2.md` 為準（新版本出來就看新版）。

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
- 論壇：見藍圖 §5。PTT 用站內搜尋 `https://www.ptt.cc/bbs/Gossiping/search?q=<關鍵字>+recommend:20`（加 cookie `over18=1`），以文章網址的 Unix 時間篩出本期範圍；文章與推文都要讀過才寫摘要。
- **每一則都要實際讀過來源**，記下原文標題、發表日、網址與關鍵數字。讀不到的不寫，常識性的補充也要找到出處（例如 Wikipedia），不憑記憶補。

## 3. 篩選

- 依「談資」評分挑：新奇度（這週才有）、和醫學生與住院醫師日常的相關度（值班、考試、選科、職涯）、話題性（一句話能不能引起興趣）、可信度（證據強度、來源層級）。
- 本週頭條 1 則；其餘分段各 1–5 則，整期 5–10 分鐘讀完；沒有內容的分段整段不寫。

## 4. 撰寫

- 檔案照 `file`，frontmatter 照 v1 藍圖 §3，h2 依 v2 藍圖 §2 的順序與名稱。
- 每則一個 h3（標題講清楚發生了什麼），內容包 `:::news{subjects="…" evidence="…" source="…" date="…" url="…"}`：
  - 第一條 `**重點**：` 一句話；第二條 `**可以聊什麼**：`（臨床更新改 `**對值班的影響**：`）；之後細節 1–4 條。
  - `evidence` 只用 `lib/weekly.js` 的 `EVIDENCE_LEVELS`；`subjects` 只用 `data/tags.js` 的科別，醫學史、論壇可以不寫。
  - 第一次出現的疾病、藥物、檢查連到知識頁，連得到才連。
- 涉及具名人物、爭議、醫糾、刑案的條目，在 `:::news` 裡加 `:::review` 寫要使用者確認什麼（外層改 `::::news`）；論壇段開頭放一個 `:::review`。
- 刑案被告、病人不寫全名；不帶出可識別病人的資訊。
- 只讀到摘要時寫「依摘要」；不確定的包 `:::verify`。
- 文字規範同知識頁：條列為主、紅字只標必背數字、不用斜體、中英文之間空一格、斜線用半形 `/`。不轉貼原文段落。

## 5. 檢查

1. 逐則對照來源：每個數字、每個說法都能在讀過的原文裡找到；找不到的刪掉或包 `:::verify`。
2. `cd frontend && npm run build`（記憶體不夠時用 `npx next dev` 開該期頁面），看失效連結、清單外的 subjects 與 evidence、沒有原文連結的消息、待審核則數。

## 6. 審核與整合提案

- 回報待審核條目，使用者在對話中逐條說留、刪、改；確認後刪掉 `:::review` 區塊。
- 已改變臨床建議、且和既有知識頁相關的消息，寫 `temp/proposals/weekly-<issue>.md`，格式同 `/ingest` 的提案檔；插入的段落末尾加「詳見 [[<檔名>#<則標題>|…]]（醫學周報）」。衝突寫進「衝突（需要你決定）」。

## 7. 收尾

1. 記進 `UPDATE.md`、commit（不 push）。雲端排程時推到新分支 `weekly/<issue>`，PR 說明列出各分段則數、頭條、待審核條目、提案檔路徑，由使用者看過後合併。
2. 回報：檔案路徑、各分段則數、頭條、待審核條目、依摘要的項目、提案檔。
