---
name: weekly
description: 產出一期醫學周報：從各大期刊、指引、官方新聞稿與醫療時事蒐集上一週的醫學消息，依性質分段寫成短摘要與 1–3 則深入解讀，連回醫學筆記，存進 content/weekly/。使用者說 /weekly、「做周報」、「這週的醫學周報」，或雲端排程每週觸發時使用。
---

# /weekly：一期醫學周報

格式、分段、來源規則以藍圖 `frontend/blueprints/weekly_v1.md` 為準（新版本出來就看新版）。

## 1. 算期別

```bash
cd frontend && node scripts/weekly-period.mjs            # 上一個完整週
cd frontend && node scripts/weekly-period.mjs 2026-10-21 # 指定某一週
```

- 用輸出的 `issue`、`start`、`end`、`date`、`file`、`title`，**不要自己判斷今天幾號**（雲端主機是 UTC）。
- `file` 已存在：這期做過了，停下來告訴使用者，不覆寫。

## 2. 蒐集

- 只收發表日落在 `start`–`end` 的消息（指引、新聞稿以發布日為準）。
- 依藍圖 §4 的來源逐一看：期刊目錄與 RSS、PubMed、WHO/CDC/FDA/EMA、衛福部與各署新聞稿、醫藥新聞。
- 期刊用官方提供給程式讀的管道，不抓網頁、不偽裝瀏覽器：
    - 目錄：各期刊 RSS（NEJM `https://www.nejm.org/action/showFeed?type=etoc&feed=rss&jc=nejm`、Lancet `https://www.thelancet.com/rssfeed/lancet_online.xml`、Nature Medicine `https://www.nature.com/nm.rss`、JAMA `https://jamanetwork.com/rss/site_3/67.xml` 等）。
    - 摘要與數字：PubMed E-utilities，`esearch.fcgi?db=pubmed&term=<關鍵字>+AND+N+Engl+J+Med[ta]&datetype=edat&mindate=<start>&maxdate=<end>` 找 PMID，再 `efetch.fcgi?db=pubmed&id=<PMID>&rettype=abstract&retmode=text` 讀摘要（不要開 pubmed.ncbi.nlm.nih.gov 網頁，會跳 CAPTCHA）。開放取用全文用 Europe PMC REST API。
    - `url` 寫 `https://doi.org/<DOI>`。
- **每一則都要實際打開來源頁面讀過**，記下原文標題、發表日、網址與關鍵數字。讀不到的不寫，不憑記憶補。
- 同一件事有多個來源時，以原始出處為主（論文 > 學會 > 新聞）。

## 3. 篩選

- 每期約 8–15 則，不湊數；沒有內容的分段整段不寫。
- 優先：會改變臨床做法、國考或台灣臨床常碰到、影響大的公衛政策、重大安全警訊。
- 挑 1–3 則放「本週焦點」深入解讀；焦點裡的不在下面分段重複列。
- 「病例與專題」：1 個病例分析、1 個疾病專題，見藍圖 §4。
    - 使用者提供當週的 NEJM Resident Briefing（或其他電子報）內容時，以它的教學主題為準，在內文註明取材自哪一期。
    - 沒有提供時，自行從開放來源找相似的實證內容（開放取用的病例報告、回顧文章、新指引的重點），或這段整段不寫；不要等使用者。
    - 期刊文章頁會擋自動存取（NEJM、Lancet、Nature 403），用上面的 RSS 與 E-utilities 讀摘要；只有摘要時內文寫「依摘要」，摘要也沒有的數字包 `:::verify`，不從記憶補。

## 4. 撰寫

- 檔案照 `file`，frontmatter 照藍圖 §3，h2 依藍圖 §2 的分段順序。
- 每則一個 h3（標題講清楚發現了什麼，不只寫試驗名稱），內容包 `:::news{subjects="…" source="…" date="…" url="…"}`：
  - `subjects` 1–2 個，只用 `frontend/data/tags.js` 的科別。
  - 短摘要 3–5 個條列：研究設計與對象、主要結果（數字照原文）、對臨床的意義（標明已改變建議或仍只是研究結果）。
  - 第一次出現的疾病、藥物、檢查連到知識頁（`[[心臟內科#心衰竭|心衰竭]]`），連得到才連。
- 深入解讀：研究設計 → 主要結果 → 限制 → 對臨床的意義（和既有知識頁、台灣現況的差異）。
- 只讀到摘要時，在內文寫「依摘要」；不確定的包 `:::verify`。
- `:::news` 裡面還要放 `:::verify` 等區塊時，外層改用四個冒號 `::::news{…}` … `::::`。
- 文字規範同知識頁：條列為主、紅字只標必背數字、不用斜體、中英文之間空一格。
- 不轉貼原文段落、不複製圖表。

## 5. 檢查

1. `cd frontend && npm run build`，看失效連結、不在科別清單的 subjects、沒有原文連結的消息。
2. 再對一次每則的日期都在 `start`–`end` 內、網址打得開。

## 6. 整合提案

- 已改變臨床建議、且和既有知識頁相關的消息（新指引、健保給付、核准或下市），寫 `temp/proposals/weekly-<issue>.md`，格式同 `/ingest` 的提案檔：哪一頁哪一段、插入什麼文字；插入的段落末尾加「詳見 [[<檔名>#<則標題>|…]]（醫學周報）」。
- 和既有知識頁衝突的寫進「衝突（需要你決定）」。
- 只是研究結果的不提案。

## 7. 收尾

1. 記進 `UPDATE.md`、commit（不 push）。雲端排程時推到新分支 `weekly/<issue>`，PR 說明列出各分段則數、焦點標題、提案檔路徑，由使用者看過後合併。
2. 回報：檔案路徑、各分段則數、焦點標題、讀不到全文而依摘要的項目、提案檔。
