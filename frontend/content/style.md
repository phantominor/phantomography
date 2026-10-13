---
title: 樣式樣張
description: 筆記系統所有排版元素的展示頁，用來確認視覺設計
nav: clinical/diseases
noindex: true
updated: 2026-10-13
sampleSources:
  sample-grand-round:
    date: 2026-10-13
    event: 心臟內科 Grand Round（示範）
    speaker: 示範講者
---

這一頁集合了筆記會用到的所有排版元素，用來確認視覺設計。醫學內容僅為示範。

## 冠狀動脈疾病

### 急性冠心症（Acute Coronary Syndrome, ACS）

#### 定義

- ACS 包含三種：STEMI、NSTEMI、不穩定型心絞痛（Unstable Angina, UA）。
- 三者的共同機轉是**冠狀動脈斑塊破裂**合併血栓形成。

#### 診斷

- STEMI 心電圖標準：**兩個相鄰導程** J 點 ST 上升。
  - V2–V3 以外的導程：≥ 1 mm。
  - V2–V3：
    - 男性 ≥ 40 歲：≥ 2 mm。
    - 男性 < 40 歲：:red[≥ 2.5 mm]。
    - 女性：:red[≥ 1.5 mm]。
- 新發生的左束支傳導阻斷（LBBB）合併臨床症狀，視同 STEMI 處理。

#### 治療

- 發病 12 小時內的 STEMI 應接受再灌注治療。
- **Primary PCI** 為首選，door-to-balloon 時間 :red[≤ 90 分鐘]。
- 無法及時 PCI 時改用血栓溶解劑，door-to-needle 時間 ≤ 30 分鐘。

:::exam
STEMI 與 NSTEMI 的處置差異是常考題：STEMI 要盡快再灌注；NSTEMI 依風險分層決定侵入性治療的時機，**不使用血栓溶解劑**。
:::

:::compare[STEMI、NSTEMI、UA 比較]
| | STEMI | NSTEMI | UA |
|---|---|---|---|
| ST 上升 | 有 | 無 | 無 |
| Troponin 上升 | 有 | 有 | 無 |
| 血栓溶解劑 | 可用 | 不用 | 不用 |
:::

:::pitfall
下壁梗塞要想到合併**右心室梗塞**：病人依賴前負荷，給 nitrate 或 morphine 可能造成嚴重低血壓；低血壓時先給輸液。
:::

:::source{from="sample-grand-round"}
Sepsis、心搏過速、貧血的病人 troponin 上升很常見，多半是需氧與供氧失衡造成的 Type 2 MI，處理原則是矯正誘因，不需要例行安排心導管。
:::

:::detail{title="Type 2 MI 的常見誘因"}
- 心搏過速或過緩的心律不整。
- 嚴重貧血、低血氧、低血壓或休克。
- 冠狀動脈痙攣、冠狀動脈栓塞。
:::

### 心肌梗塞的心電圖定位

合併儲存格的表格直接寫 HTML：

<table>
  <thead>
    <tr><th>部位</th><th>導程</th><th>常見責任血管</th></tr>
  </thead>
  <tbody>
    <tr><td>中隔</td><td>V1–V2</td><td rowspan="2">LAD</td></tr>
    <tr><td>前壁</td><td>V3–V4</td></tr>
    <tr><td>側壁</td><td>I、aVL、V5–V6</td><td>LCx 或 LAD 的對角支</td></tr>
    <tr><td>下壁</td><td>II、III、aVF</td><td>RCA（約 80%），其餘為 LCx</td></tr>
    <tr><td>後壁</td><td>V1–V3 ST 下降、R 波變高</td><td>RCA 或 LCx</td></tr>
    <tr><td colspan="3">懷疑右心室梗塞時加做右側導程：V4R ST 上升 ≥ 1 mm</td></tr>
  </tbody>
</table>

![心電圖示意（圖說放在這裡，附來源與授權）](media/specimen/placeholder.svg "心電圖示意圖（自製）")

## 酸鹼與電解質

### 陰離子間隙（Anion Gap）

$$
AG = Na^+ - (Cl^- + HCO_3^-)
$$

- 正常值約 8–12 mEq/L，依各實驗室而異。
- 低白蛋白會讓 AG 被低估：校正 AG = AG + 2.5 × (4 − albumin)，albumin 單位為 g/dL。

:::mnemonic[MUDPILES：AG 上升的代謝性酸中毒]
Methanol、Uremia、DKA、Propylene glycol、Isoniazid 與 Iron、Lactic acidosis、Ethylene glycol、Salicylates
:::

:::verify
部分教科書已改用 GOLDMARK 取代 MUDPILES，國考採用哪一版待查證。
:::

## 其他元素

### 連結與標記

- 同頁連結：[[#急性冠心症（Acute Coronary Syndrome, ACS）|急性冠心症]]。
- 其他頁面：[[臨床醫學]]。
- 失效連結會顯示成這樣：[[不存在的頁面]]。
- 外部連結：[hikarimusic/TWMLE](https://hikarimusic.github.io/TWMLE/)。
- 階段徽章：告知後同意 :stage[二階]。
- 考古題出處（題庫匯入後啟用，此為示意）：:q[示範 #00]。
- 行內程式碼與數值：`HbA1c ≥ 6.5%`。

> 引用區塊：用在原文摘錄或指引原句。
