---
title: β-lactam
aliases: [beta-lactam, β-lactams, β-內醯胺類, 乙內醯胺類, Penicillin 類, Cephalosporin 類, Carbapenem 類, 頭孢菌素, 青黴素, 碳青黴烯]
description: Penicillin、cephalosporin、carbapenem、monobactam 與 β-lactamase 抑制劑。
updated: 2026-11-04
status: initial
---
## 總論（Overview）

### 機轉與抗藥性（Mechanism & Resistance）

#### 機轉

- **β-lactam 環**模擬細胞壁胜肽末端的 **D-Ala-D-Ala** → 與 **penicillin 結合蛋白（penicillin-binding protein, PBP）**的轉胜肽酶（transpeptidase）不可逆結合 → 胜肽聚醣（peptidoglycan）無法交聯 → 細胞壁變弱，加上自溶酶（autolysin）作用 → 菌體破裂。
    - **殺菌型（bactericidal）**，但只對**正在生長分裂**的細菌有效 → 和抑菌型藥物併用可能拮抗（理論上）。
    - **時間依賴型（time-dependent）**：療效取決於游離藥物濃度高於 MIC 的時間比例（**fT > MIC**），見[[#藥動與給藥（PK/PD & Dosing）|藥動與給藥]]。
- 本身**沒有細胞壁**或細胞壁特殊的病原**天生無效**：Mycoplasma、Chlamydia、Legionella、Rickettsia 等**非典型菌**（atypical）。
- 共同結構分四大類：penicillin（β-lactam + 五元噻唑環）、cephalosporin（+ 六元環）、carbapenem、monobactam（只有單一 β-lactam 環）。

#### 抗藥機制

| 機制 | 說明 | 代表 |
|---|---|---|
| **β-lactamase 水解** | 最重要的機制；打開 β-lactam 環 | ESBL、AmpC、carbapenemase |
| **PBP 改變** | 親和力下降 → 所有或部分 β-lactam 無效 | **MRSA（mecA → PBP2a）**、penicillin 抗藥肺炎鏈球菌（PRSP）、*E. faecium* |
| **孔蛋白（porin）減少** | 藥物進不了革蘭氏陰性菌外膜 | *Pseudomonas* 失去 **OprD** → **imipenem 抗藥** |
| **外排幫浦（efflux pump）** | 藥物被打出菌體 | *Pseudomonas*（MexAB-OprM） |

- 各抗藥菌的首選治療見[[感染科#重要抗藥性機制|感染科的抗藥性機制]]與本頁[[#抗藥菌的選藥（Resistant Organisms）|抗藥菌的選藥]]。

#### β-lactamase 分類（Ambler Classification）

| Ambler 分類 | 活性中心 | 代表酵素 | 能水解 | 能被誰抑制 |
|---|---|---|---|---|
| **A** | Serine | TEM、SHV、**CTX-M（ESBL）**、**KPC** | ESBL：penicillin + 第 3 代 cephalosporin；KPC：加上 carbapenem | 傳統 BLI（ESBL）；**avibactam、vaborbactam、relebactam**（KPC） |
| **B（MBL）** | **鋅離子（Zn²⁺）** | **NDM**、VIM、IMP | 幾乎所有 β-lactam（**aztreonam 例外**） | **現有 BLI 都抑制不了** |
| **C** | Serine | **AmpC** | Cephamycin、第 3 代 cephalosporin | Avibactam、relebactam、vaborbactam |
| **D** | Serine | **OXA-48**（腸內菌）、OXA-23（*Acinetobacter*） | Carbapenem（弱）、penicillin | **Avibactam**（OXA-48） |

:::exam
- **MBL 是金屬酶** → 用 EDTA 可抑制（實驗室表現型檢測的原理），所有現行 β-lactamase 抑制劑都無效。
- **Aztreonam 不被 MBL 水解**，但會被同株菌常共帶的 ESBL/AmpC 水解 → 臨床上用 **ceftazidime-avibactam + aztreonam**。
:::

#### β-lactamase 抑制劑（β-Lactamase Inhibitors, BLI）

| 抑制劑 | 搭配 | 抑制範圍 | 備註 |
|---|---|---|---|
| Clavulanate | Amoxicillin | A 類（含 ESBL） | **膽汁鬱積型肝炎**、腹瀉主要來自 clavulanate |
| Sulbactam | Ampicillin、cefoperazone | A 類 | 本身對 **_Acinetobacter_ 有抗菌活性** |
| Tazobactam | Piperacillin、ceftolozane | A 類 | |
| **Avibactam** | Ceftazidime、aztreonam | **A（含 KPC）、C、部分 D（OXA-48）** | 非 β-lactam 結構 |
| Vaborbactam | Meropenem | A（KPC）、C | 不抑制 OXA-48 |
| Relebactam | Imipenem | A（KPC）、C | 不抑制 OXA-48 |

- 傳統 BLI（clavulanate、sulbactam、tazobactam）**對 AmpC、carbapenemase 無效**。
- 試管內 ESBL 對 BLI 組合常顯示有效，但臨床療效不如 carbapenem（見 [[#抗藥菌的選藥（Resistant Organisms）|MERINO 試驗]]）。

### 藥動與給藥（PK/PD & Dosing）

#### PK/PD 目標

| 類別 | fT > MIC 目標（殺菌） | 備註 |
|---|---|---|
| Penicillin | 約 50% | |
| Cephalosporin | 約 60–70% | |
| Carbapenem | 約 40% | 有輕度抗生素後效應（PAE，對革蘭氏陰性菌） |

- **提高 fT > MIC 的方法**：縮短給藥間隔、**延長輸注（extended infusion，每劑滴 3–4 小時）**或**連續輸注（continuous infusion）**。
    - **BLING III（JAMA 2024）**：敗血症病人連續 vs 間歇輸注 β-lactam，90 天死亡率 **24.9% vs 26.8%**（未達統計顯著）；合併 BLING III 在內的統合分析顯示連續輸注可降低死亡率。
    - 適合延長輸注的情境：重症、MIC 偏高的菌（如 *Pseudomonas*）、擴大分布體積（敗血症、燒傷）。
- **腎功能調整**：絕大多數 β-lactam 經腎排除，要依 CrCl 調整。
    - **不需調整**：**Ceftriaxone**（膽汁 + 腎雙重排除）、**Oxacillin**（肝代謝）、Cefoperazone（膽汁排除；但 Brosym 的 sulbactam 在 CrCl < 30 要調整）。

#### 中樞神經穿透

- 腦膜**發炎時**大部分 β-lactam 才能進入腦脊髓液 → 腦膜炎要用**高劑量**。
- 可用於中樞感染：Penicillin G、Ampicillin、Oxacillin、**Ceftriaxone、Cefotaxime**、Ceftazidime、**Cefepime**、**Meropenem**。
- **不適合**：**Cefazolin**（穿透差 → MSSA 腦膜炎或腦膿瘍改用 Oxacillin）、第 2 代 cephalosporin、**Imipenem**（易引發癲癇）、Ertapenem。

### 過敏與交叉反應（Allergy & Cross-reactivity）

#### 過敏的類型

| 類型 | 機轉 | 時間 | 表現 | 之後能否再用 |
|---|---|---|---|---|
| **立即型** | **IgE（第 I 型）** | 給藥後 **:red[1 小時內]**（多數數分鐘） | 蕁麻疹、血管性水腫、支氣管痙攣、**過敏性休克（anaphylaxis）** | 皮膚測試或分級挑戰後評估；必要時**減敏（desensitization）** |
| 輕度延遲型 | T 細胞（第 IV 型） | 數天 | **斑丘疹（maculopapular exanthem）**，無黏膜、無器官侵犯 | 多可直接口服挑戰 |
| **嚴重延遲型（SCAR）** | T 細胞 | 1–8 週 | [[皮膚科#Stevens-Johnson Syndrome（SJS）/ Toxic Epidermal Necrolysis（TEN）\|SJS/TEN]]、[[皮膚科#Drug Reaction with Eosinophilia and Systemic Symptoms（DRESS）\|DRESS]]、AGEP | **終身禁用**該藥，**不做挑戰** |
| 器官特異性 | 第 II、III 型等 | 數天到數週 | 溶血性貧血、[[腎臟內科#急性間質性腎炎（AIN）\|急性間質性腎炎]]、藥物熱、血清病 | 一般避免同藥 |

- 自稱 penicillin 過敏的病人約 10%，但**真正過敏 :red[< 5%]**；IgE 過敏約 **50% 在 5 年、80% 在 10 年後消失**。
- **過敏標籤的代價**：被迫改用 vancomycin、fluoroquinolone、clindamycin → 療效較差、**SSI**、*C. difficile*、MRSA/VRE 增加。
- **去標籤（delabeling）**：
    - **PEN-FAST 評分**：**F**ive years（反應發生在 5 年內，2 分）、**A**naphylaxis/angioedema 或 **S**CAR（2 分）、**T**reatment required（當時需要治療，1 分）；**:red[< 3 分]為低風險**。
    - **PALACE 試驗（JAMA Intern Med 2023）**：PEN-FAST < 3 的病人**直接口服 amoxicillin 挑戰**，安全性不劣於先做皮膚測試。

#### 交叉反應

- 交叉反應主要來自**側鏈（R1 side chain）相同或相似**，不是 β-lactam 環本身。

| 已知過敏 | 換用 | 交叉反應率 | 說明 |
|---|---|---|---|
| Penicillin | Cephalosporin | **約 1–2%** | 舊說 10% 是早期 cephalosporin 製劑汙染 penicillin 的高估值 |
| Penicillin | **Cefazolin** | **極低** | **側鏈獨特** → 即使 penicillin 過敏性休克史，指引也允許直接使用（AAAAI 2022） |
| **Amoxicillin/Ampicillin** | **Cephalexin、Cefaclor、Cefadroxil** | 較高 | **R1 側鏈相同** → 避免 |
| Penicillin | Carbapenem | **< 1%** | 可直接使用 |
| Penicillin/cephalosporin | **Aztreonam** | 幾乎沒有 | **例外：Ceftazidime**（側鏈相同） |
| Ceftriaxone | Cefotaxime、Cefepime | 較高 | 側鏈相似 |

:::pitfall
- 病人說「penicillin 過敏」→ 不問清楚就改用 vancomycin + aztreonam 當 SSI 預防或 MSSA 治療 → 療效差、副作用多。先問**什麼藥、什麼反應、多久以前**；只是腸胃不適或很久以前的輕微疹子，通常不是過敏。
- 對 **ceftazidime** 過敏的病人改用 **aztreonam** → 兩者側鏈相同，仍可能過敏。
:::

### 共同副作用（Class Adverse Effects）

| 副作用 | 重點 | 好發藥物 |
|---|---|---|
| **過敏** | 最常見；見[[#過敏與交叉反應（Allergy & Cross-reactivity）\|過敏與交叉反應]] | 所有 |
| **神經毒性** | 抑制 GABA-A → 意識改變、肌躍症、**癲癇**、非抽搐性癲癇重積狀態（NCSE）；**腎功能差、劑量過高**時 | **Cefepime**、**Imipenem**、高劑量 Penicillin G |
| *[[感染科#C. difficile（Pseudomembranous colitis，偽膜性大腸炎）\|C. difficile]]* 感染 | 廣效藥物風險高 | 第 3、4 代 cephalosporin、carbapenem、Augmentin |
| **血球低下** | 長期（> 2 週）高劑量 → 嗜中性球低下；免疫性溶血 | Oxacillin、Ceftriaxone（溶血）、Piperacillin |
| [[腎臟內科#急性間質性腎炎（AIN）\|急性間質性腎炎]] | 發燒 + 皮疹 + 嗜酸性球 + 尿中白血球 | 經典是 methicillin（已不用）、Oxacillin |
| **肝毒性** | 膽汁鬱積型 | **Augmentin（clavulanate）**、Oxacillin、Ceftriaxone（膽泥） |
| **凝血異常 + disulfiram-like 反應** | **NMTT 側鏈** → 抑制維生素 K 依賴凝血因子 + 抑制乙醛脫氫酶 | **Cefoperazone（Brosym）**、Cefmetazole、Cefotetan |
| **Jarisch-Herxheimer 反應** | 治療梅毒、鉤端螺旋體病後 **24 小時內**發燒、寒顫、肌痛（螺旋體破裂釋放內毒素樣物質） | Penicillin（非過敏，**不必停藥**） |

:::pitfall
- 腎功能差的病人用 **cefepime** 後出現意識混亂 → 誤以為敗血症惡化或尿毒，加更多抗生素 → 其實是 **cefepime 神經毒性**；要想到、做腦波（NCSE）、減量或換藥，必要時透析。
- 用 **Brosym** 數天後 INR 升高、出血 → 漏掉 NMTT 側鏈的維生素 K 拮抗作用；長期使用或營養差的病人要追 PT/INR、補充維生素 K。
:::

## Penicillin 類（Penicillins）

:::compare[Penicillin 類涵蓋範圍]
| 類別 | 代表藥物 | GPC | Enterococcus | MSSA | GNR | Pseudomonas | 厭氧菌 |
|---|---|---|---|---|---|---|---|
| 天然 penicillin | Penicillin G/V | **✓**（Strep） | 部分 | ✗ | ✗ | ✗ | 口腔厭氧菌 |
| 抗葡萄球菌 penicillin | Oxacillin | ✓ | ✗ | **✓ 首選** | ✗ | ✗ | ✗ |
| Aminopenicillin | Ampicillin、Amoxicillin | ✓ | **✓（*E. faecalis*）** | ✗ | 部分（*E. coli*、*H. influenzae*） | ✗ | 部分 |
| Aminopenicillin + BLI | Augmentin、Curam、Unasyn | ✓ | ✓ | **✓** | ✓ | ✗ | **✓** |
| 抗綠膿桿菌 penicillin | Tazocin | ✓ | ✓ | ✓ | ✓ | **✓** | **✓** |
:::

### 天然 Penicillin（Natural Penicillins）

#### 藥物與劑型

| 藥物 | 給藥 | 特點 |
|---|---|---|
| **Penicillin G（水溶性，aqueous）** | IV，**每 4 小時**或連續輸注 | 半衰期短（約 30 分鐘）；鉀鹽每 100 萬單位含約 1.7 mEq K⁺ |
| **Benzathine penicillin G** | **只能 IM** | 長效（數週）；**誤打入血管 → 心跳停止、栓塞（Hoigne/Nicolau syndrome）** |
| Procaine penicillin G | IM | 中效；可能出現 procaine 引起的焦慮、幻覺（Hoigne syndrome） |
| Penicillin V | 口服 | 耐酸，吸收穩定 |

#### 適應症

- **[[感染科#Treponema pallidum（Syphilis，梅毒）|梅毒]]**：所有分期的**首選**。
    - 早期（一期、二期、早期潛伏）：**Benzathine penicillin G :red[240 萬單位 IM 單次]**。
    - 晚期潛伏或分期不明：**240 萬單位 IM 每週 1 次，共 :red[3 次]**。
    - **神經性梅毒**、眼梅毒、耳梅毒：**水溶性 Penicillin G :red[每天 1800–2400 萬單位]**（每 4 小時 300–400 萬單位或連續輸注），**10–14 天**。
    - **孕婦只能用 penicillin**：過敏也要**減敏後使用**（其他藥物無法預防先天性梅毒）。
- **A 群鏈球菌（GAS）**：[[耳鼻喉科#急性咽扁桃腺炎（Acute Pharyngotonsillitis）|咽扁桃腺炎]]（Penicillin V 或 Amoxicillin **10 天**）、**風濕熱次級預防**（Benzathine penicillin G 每 3–4 週 IM）。
    - GAS **從未出現 penicillin 抗藥**。
    - 壞死性筋膜炎、中毒性休克：Penicillin G **+ Clindamycin**（抑制毒素生成）。
- 其他首選：**Actinomyces**（長期治療）、**C. perfringens 氣性壞疽**（+ Clindamycin + 清創）、**鉤端螺旋體病**（重症）、對 penicillin 敏感的腦膜炎雙球菌、肺炎鏈球菌。

:::exam
- 梅毒治療後 24 小時內發燒、寒顫 → **Jarisch-Herxheimer 反應**，**不是**過敏，繼續治療、給退燒藥。
- 孕婦梅毒合併 penicillin 過敏 → **減敏後用 penicillin**，不能換藥。
:::

### 抗葡萄球菌 Penicillin（Anti-staphylococcal Penicillins）

- 代表藥物：**Oxacillin**（台灣靜脈注射主要用這個）；國外有 nafcillin、口服 dicloxacillin。
- 機轉特點：側鏈大、立體障礙 → **不被葡萄球菌 penicillinase 水解**。
- 適應症：**MSSA**（菌血症、心內膜炎、骨髓炎、**中樞感染**）。
    - MSSA 首選是 **Oxacillin 或 Cefazolin**；**Vancomycin 治療 MSSA 效果比較差**，培養出 MSSA 就要降階。
    - **Cefazolin vs Oxacillin**：菌血症療效相當，Cefazolin 給藥方便（每 8 小時）、副作用較少；但**中樞感染要用 Oxacillin**。
- 用法：**Oxacillin 2 g IV 每 4 小時**（嚴重感染）；**不需腎功能調整**。
- 副作用：**肝炎**（膽汁鬱積型）、**嗜中性球低下**（長期使用）、間質性腎炎、靜脈炎。
- 對 **MRSA、Enterococcus、GNR 無效**。

### Aminopenicillin（Ampicillin、Amoxicillin）

#### 適應症

- **Amoxicillin**（口服，吸收比 ampicillin 好）：
    - [[耳鼻喉科#急性中耳炎（Acute Otitis Media, AOM）|急性中耳炎]]：**首選高劑量 :red[80–90 mg/kg/day]**（克服肺炎鏈球菌 PBP 改變的中度抗藥）。
    - 鏈球菌咽炎、急性細菌性鼻竇炎、輕度社區型肺炎（無共病）。
    - [[消化內科#H. pylori|*H. pylori* 除菌]]的組成之一（penicillin 過敏 → 改 metronidazole）。
    - 萊姆病早期（孕婦、兒童）。
- **Ampicillin**（靜脈）：
    - **[[感染科#Enterococcus|*E. faecalis*]]**：**首選**；心內膜炎用 **Ampicillin + Ceftriaxone**（雙 β-lactam，避免 aminoglycoside 腎毒性）或 + Gentamicin。
    - **[[感染科#Listeria monocytogenes|*Listeria*]]**：**首選**（± Gentamicin）；**cephalosporin 天生無效** → 腦膜炎經驗治療在**新生兒、> 50 歲、免疫低下**要**加 Ampicillin**。
    - [[產科#Group B Streptococcus（GBS）預防|GBS 產時預防]]：Penicillin G 或 Ampicillin。
    - 新生兒敗血症經驗治療：Ampicillin + Gentamicin（或 + Cefotaxime）。

#### 用法與副作用

- Ampicillin：一般 1–2 g IV 每 6 小時；**腦膜炎、心內膜炎 :red[2 g 每 4 小時]**。
- **EBV 感染（[[感染科#EBV（Infectious Mononucleosis）|傳染性單核球症]]）服用後出現斑丘疹**：舊研究 80–100%、近年研究約 30%；**不是真正的過敏**，之後通常可以再用。
- 腹瀉、*C. difficile*。
- 對 **MSSA（產 penicillinase）、Klebsiella（天生產 SHV）無效**；台灣 *E. coli* 對 ampicillin 抗藥率高，**不適合單用於 GNR 經驗治療**。

:::pitfall
- 咽喉痛 + 發燒的青少年被當成鏈球菌咽炎開 amoxicillin → 全身起疹子 → 被貼上「penicillin 過敏」終身標籤；其實是 **EBV**，應先看有無**後頸淋巴結腫大、脾腫、非典型淋巴球**。
:::

### Aminopenicillin + β-Lactamase 抑制劑

| 藥物 | 給藥 | 主要適應症 |
|---|---|---|
| **Augmentin、Curam（Amoxicillin-clavulanate）** | 口服（IV 劑型台灣也有） | **動物咬傷（狗、貓 → *Pasteurella*）首選**、人咬傷、AOM 第二線（近 30 天用過 amoxicillin、合併結膜炎）、鼻竇炎、COPD 急性惡化、社區泌尿道感染、輕度皮膚軟組織感染 |
| **Unasyn（Ampicillin-sulbactam）** | IV | **吸入性肺炎**、腹腔與骨盆感染、糖尿病足、**_Acinetobacter_**（高劑量 sulbactam） |

- **Augmentin** 用法：成人 875/125 mg 口服每天 2 次，或 500/125 mg 每天 3 次；兒童 AOM 以 **amoxicillin 90 mg/kg/day** 計算（用 14:1 高比例劑型，減少 clavulanate 腹瀉）。
- **Unasyn** 用法：1.5–3 g IV 每 6 小時；**_Acinetobacter_ 用高劑量**（sulbactam 每天 :red[9 g]，IDSA 2023 建議 + 第二種有效藥物）。
- 涵蓋：**MSSA、厭氧菌（含 *B. fragilis*）、產 β-lactamase 的 *H. influenzae*、*Moraxella***。
- **不涵蓋**：**Pseudomonas、MRSA、ESBL/AmpC 腸內菌**（臨床上不可靠）。
- 副作用：**腹瀉**（clavulanate 劑量相關）、**膽汁鬱積型肝炎**（老人、長期使用；可在停藥後數週才出現）。

### 抗綠膿桿菌 Penicillin（Anti-pseudomonal Penicillins）

- 代表藥物：**Tazocin（Piperacillin-tazobactam）**。
- 涵蓋：**GPC（含 *E. faecalis*）+ GNR + _Pseudomonas_ + 厭氧菌** → 院內感染經驗治療的主力之一。
- 適應症：**院內肺炎（HAP/VAP）**、[[血液腫瘤科#Febrile Neutropenia|嗜中性球低下發燒]]、複雜性腹腔內感染、糖尿病足、院內泌尿道感染。
    - **不涵蓋 MRSA**（需要時加 Vancomycin）、**非典型菌**。
- 用法：**4.5 g IV 每 6 小時**；或 **4.5 g 每 8 小時、每劑延長輸注 :red[4 小時]**（*Pseudomonas*、重症）。
- **ESBL 菌血症不要用**：**MERINO 試驗（JAMA 2018）**，ceftriaxone 抗藥 *E. coli*/*Klebsiella* 菌血症用 piperacillin-tazobactam vs meropenem，30 天死亡率 **:red[12.3% vs 3.7%]**。
- **與 Vancomycin 併用的腎毒性**：觀察性研究顯示比 vancomycin + cefepime 高；但 **ACORN 試驗（JAMA 2023）**隨機分派後兩組急性腎損傷沒有差異，**cefepime 組反而神經功能障礙（譫妄、昏迷）較多**。
- 副作用：血小板功能異常、血球低下（長期）、低血鉀、*C. difficile*。

## Cephalosporin 類（Cephalosporins）

:::compare[各代 Cephalosporin 比較]
| 世代 | 代表藥物 | GPC | GNR | Pseudomonas | 厭氧菌 | 主要用途 |
|---|---|---|---|---|---|---|
| **第 1 代** | **Cefazolin**、Cephalexin（口服） | **強（MSSA、Strep）** | 弱（*E. coli*、*Proteus*、*Klebsiella* 部分） | ✗ | ✗ | **手術預防首選**、MSSA、皮膚軟組織感染 |
| 第 2 代 | Cefuroxime、Cefaclor | 中 | 加 *H. influenzae*、*Moraxella* | ✗ | ✗ | 呼吸道、泌尿道 |
| 第 2 代（cephamycin 與 oxacephem） | Cefoxitin、Cefmetazole、Flumarin | 中 | 中，**對 ESBL 較穩定** | ✗ | **✓** | 腹腔、骨盆感染、大腸手術預防 |
| **第 3 代** | **Ceftriaxone**、Cefotaxime | 強（含肺炎鏈球菌） | **強** | ✗ | ✗ | CAP、**腦膜炎**、腎盂腎炎、淋病 |
| 第 3 代（抗綠膿） | **Ceftazidime**、Brosym | **弱** | 強 | **✓** | Brosym 有 | *Pseudomonas*、類鼻疽 |
| **第 4 代** | **Cefepime** | 強 | 強，**對 AmpC 穩定** | **✓** | ✗ | 嗜中性球低下發燒、院內感染 |
| 第 5 代（抗 MRSA） | **Ceftaroline** | **含 MRSA** | 類似 ceftriaxone | ✗ | ✗ | 皮膚軟組織感染、CAP |
:::

:::mnemonic
- **Cephalosporin 不涵蓋 LAME**：**L**isteria、**A**typicals、**M**RSA（ceftaroline 除外）、**E**nterococcus。
- 世代越高 → 對 GNR 越強、對 GPC 越弱（**第 4 代例外**，GPC 與 GNR 都強）。
:::

### 第 1 代（First Generation）

- **Cefazolin**（IV）：
    - **[[外科概論#預防性抗生素|手術預防性抗生素]]首選**：**:red[2 g]**（體重 **≥ 120 kg 用 3 g**）、**切皮前 60 分鐘內**給；手術超過 **:red[4 小時]**或失血 > 1500 mL **追加一劑**；術後 24 小時內停藥。
    - **MSSA 感染**：菌血症、骨髓炎、皮膚軟組織感染；**2 g IV 每 8 小時**。
    - 皮膚軟組織感染（[[皮膚科#蜂窩性組織炎（Cellulitis）與丹毒（Erysipelas）|蜂窩性組織炎]]）、單純泌尿道感染。
    - **中樞穿透差** → 不能用於腦膜炎。
- **Cephalexin**（口服）：蜂窩性組織炎、鏈球菌咽炎（penicillin 輕度過敏者）、單純泌尿道感染；**與 amoxicillin 側鏈相同**。

### 第 2 代與 Cephamycin（Second Generation & Cephamycins）

| 藥物 | 給藥 | 特點與適應症 |
|---|---|---|
| **Cefuroxime** | IV、口服 | 呼吸道（鼻竇炎、中耳炎、輕度 CAP）、萊姆病；中樞穿透不足（不用於腦膜炎） |
| Cefaclor | 口服 | 兒童呼吸道感染；**血清病樣反應**（兒童較多） |
| **Cefoxitin**（cephamycin） | IV | **厭氧菌**；大腸直腸手術預防、[[婦科#骨盆腔炎（Pelvic Inflammatory Disease, PID）\|骨盆腔炎]]（+ Doxycycline） |
| **Cefmetazole**（cephamycin） | IV | 厭氧菌、腹腔感染、手術預防；**NMTT 側鏈** → 凝血異常、disulfiram-like 反應 |
| **Flumarin（Flomoxef）**（oxacephem） | IV | 台灣常用；腹腔、骨盆、泌尿道感染、手術預防；涵蓋厭氧菌 |

- **Cephamycin 與 oxacephem 對 ESBL 較穩定**（7-α-methoxy 結構），但**會被 AmpC 水解**；**不涵蓋 _Pseudomonas_、Enterococcus**。
- 用法（Cefmetazole、Flumarin）：每天 1–2 g 分 2 次，重症可增加到每天 4 g（依仿單）。
- **用於 ESBL 菌血症的證據不一**：
    - 日本多中心研究：無血液腫瘤、無嗜中性球低下的 ESBL *E. coli* 菌血症，cefmetazole/flomoxef 與 carbapenem 死亡率沒有差異。
    - **台灣長庚研究（Int J Antimicrob Agents 2015）**：ESBL *E. coli*/*Klebsiella* 菌血症以 flomoxef 為確定治療，敗血症相關死亡率 **27.3% vs 10.5%**（carbapenem），**flomoxef MIC 2–8 mg/L** 時特別差。
    - 台灣實務：病情穩定、MIC 低、感染源控制好時才考慮作為 carbapenem 的替代（carbapenem-sparing）。

### 第 3 代（Third Generation）

#### Ceftriaxone、Cefotaxime

- **Ceftriaxone**：半衰期長（約 8 小時）→ **每天 1 次**；**膽汁 + 腎雙重排除 → 不需腎功能調整**。
- 適應症：
    - [[胸腔內科#社區型肺炎（CAP）|社區型肺炎]]住院：**Ceftriaxone + macrolide**（或 + doxycycline）。
    - [[神經內科#細菌性腦膜炎|細菌性腦膜炎]]經驗治療：**:red[2 g IV 每 12 小時]** + **Vancomycin**（PRSP），必要時 + Ampicillin（Listeria）。
    - **[[感染科#N. gonorrhoeae（淋病雙球菌）|淋病]]**：**:red[500 mg IM 單次]**（體重 ≥ 150 kg 用 1 g；CDC 2020），並治療披衣菌。
    - [[腎臟內科#泌尿道感染（UTI）與腎盂腎炎|急性腎盂腎炎]]、[[肝膽胰外科#自發性細菌性腹膜炎（SBP）|自發性細菌性腹膜炎]]、傷寒、萊姆病（神經、心臟侵犯）、*E. faecalis* 心內膜炎（+ Ampicillin）。
    - 一般劑量：**1–2 g IV 每天 1 次**。
- 副作用：
    - **膽泥與假性膽結石（biliary pseudolithiasis）**：與鈣結合沉澱於膽囊，兒童較多，停藥後可消失。
    - **新生兒禁忌**：取代白蛋白上的膽紅素 → **核黃疸**；**≤ 28 天新生兒不可與含鈣靜脈輸液併用**（肺、腎沉澱致死）→ 新生兒改用 **Cefotaxime**。
    - 免疫性溶血性貧血（少見但嚴重）。
- 對 **ESBL、AmpC、Pseudomonas 無效**。

#### Ceftazidime 與 Brosym

- **Ceftazidime**：**抗 _Pseudomonas_**，但**對 GPC（MSSA、肺炎鏈球菌）弱**。
    - 適應症：*Pseudomonas* 感染、院內 GNR 感染、**類鼻疽（melioidosis，*Burkholderia pseudomallei*）**初期密集治療（Ceftazidime 或 Meropenem 至少 10–14 天 → TMP-SMX 根除期 3–6 個月）。
    - 類鼻疽在**台灣南部**颱風、豪雨後增加，見[[感染科#其他重要病原|感染科的其他重要病原]]。
    - 用法：**2 g IV 每 8 小時**。
- **Brosym（Cefoperazone-sulbactam）**：台灣常用。
    - 涵蓋 GNR、*Pseudomonas*、厭氧菌；**sulbactam 加上 _Acinetobacter_ 活性**。
    - 適應症：膽道感染（**經膽汁排除，膽汁濃度高**）、腹腔感染、院內 GNR 感染。
    - **NMTT 側鏈** → **凝血異常**（追 PT/INR、補維生素 K）、**disulfiram-like 反應**（禁酒）。
- 口服第 3 代（Cefixime、Cefdinir、Cefditoren）：兒童中耳炎、鼻竇炎、泌尿道感染；Cefixime 也可治淋病（第二線）。

### 第 4 代（Fourth Generation）

- **Cefepime**：GPC + GNR + **_Pseudomonas_**，**對 AmpC 穩定**（不易被誘導）。
- 適應症：**[[血液腫瘤科#Febrile Neutropenia|嗜中性球低下發燒]]經驗治療**、HAP/VAP、**AmpC 高風險菌**（*Enterobacter cloacae*、*Klebsiella aerogenes*、*Citrobacter freundii*）、院內腦膜炎（+ Vancomycin）。
- 用法：**2 g IV 每 8 小時**（*Pseudomonas*、嗜中性球低下）。
- **神經毒性**：**腎功能差未調整劑量**時最常見 → 意識改變、肌躍症、**NCSE**；見[[#共同副作用（Class Adverse Effects）|共同副作用]]。
- **ESBL**：試管內可能有效，但臨床上不建議作為確定治療。

### 抗 MRSA Cephalosporin（Anti-MRSA Cephalosporins）

- **Ceftaroline**：**唯一對 MRSA 有效的 cephalosporin 類（高親和力結合 PBP2a）**；GNR 涵蓋類似 ceftriaxone，**不涵蓋 _Pseudomonas_**。
- 適應症：急性細菌性皮膚軟組織感染、CAP；**MRSA 菌血症救援治療**（常與 daptomycin 併用）。
- 用法：600 mg IV 每 12 小時（嚴重感染每 8 小時）。
- 副作用：長期使用 → **嗜中性球低下**、Coombs 試驗陽性。
- 其他 MRSA 藥物見[[感染科#MRSA 治療|感染科的 MRSA 治療]]。

### 新型 Cephalosporin 與抑制劑組合（Novel Agents）

| 藥物 | 主要對象 | 不涵蓋 | 備註 |
|---|---|---|---|
| **Ceftazidime-avibactam** | **KPC、OXA-48 的 CRE**、DTR *Pseudomonas* | **MBL（NDM、VIM、IMP）**、*Acinetobacter* | 台灣 **2020/6/1** 起健保給付；MBL → **+ Aztreonam** |
| **Ceftolozane-tazobactam** | **DTR _Pseudomonas_**（多重抗藥綠膿桿菌） | Carbapenemase | 對 *Pseudomonas* 最強的 cephalosporin 之一 |
| **Cefiderocol** | **MBL 在內的 CRE**、CR *Acinetobacter*、*Stenotrophomonas* | | **鐵載體（siderophore）**「特洛伊木馬」：搭鐵離子運輸系統進入菌體；台灣 **2024** 年核准；CREDIBLE-CR 試驗中 *Acinetobacter* 感染死亡率反而較高 |

- **DTR（difficult-to-treat resistance）**：對所有第一線 β-lactam（含 carbapenem）與 fluoroquinolone 都抗藥。
- 選藥依**碳青黴烯酶種類**，見[[#抗藥菌的選藥（Resistant Organisms）|抗藥菌的選藥]]。

## Carbapenem 類（Carbapenems）

### 共同特點

- **最廣效的 β-lactam**：GPC、GNR、厭氧菌、**ESBL、AmpC 皆穩定**。
- **不涵蓋**：**MRSA**、***E. faecium***、***Stenotrophomonas maltophilia***（天生產 MBL L1）、非典型菌、碳青黴烯酶產生菌。
- 使用前想清楚：**carbapenem 是 CRE 的主要選擇壓力** → 確定菌種後要**降階**。

### 各藥比較

| 藥物 | 用法 | *Pseudomonas* | *Acinetobacter* | 特點 |
|---|---|---|---|---|
| **Tienam（Imipenem-cilastatin）** | 500 mg IV 每 6 小時 | ✓ | 部分 | **Cilastatin 抑制腎臟 dehydropeptidase-I**（避免 imipenem 被分解及腎毒性）；**癲癇風險最高**；*Pseudomonas* 失去 OprD 易抗藥 |
| **Mepem（Meropenem）** | **1 g IV 每 8 小時**；腦膜炎 **:red[2 g 每 8 小時]** | ✓ | 部分 | **腦膜炎可用**；癲癇風險較低；可延長輸注 |
| **Invanz（Ertapenem）** | **1 g IV 每天 1 次** | **✗** | **✗** | **不涵蓋 _Pseudomonas_、_Acinetobacter_、Enterococcus**；適合社區 ESBL 感染、**降階**、門診靜脈抗生素 |
| Doripenem | 500 mg IV 每 8 小時 | ✓ | 部分 | 呼吸器肺炎試驗死亡率較高，用得少 |

- 適應症：**ESBL 感染首選**（MERINO 試驗）、AmpC 菌重症、院內重症經驗治療、嗜中性球低下發燒（經驗或升階）、[[感染科#其他重要病原|類鼻疽]]、混合需氧與厭氧的嚴重腹腔感染。
- 新組合：
    - **Meropenem-vaborbactam**、**Imipenem-relebactam**：對 **KPC** 有效，**對 OXA-48、MBL 無效**。

### 副作用與交互作用

- **癲癇**：**Imipenem > Meropenem ≈ Ertapenem**；高危險群：腎功能不全、中樞神經疾病、高劑量。
- **與 Valproic acid 併用：:red[禁忌]** → carbapenem 使 valproate 血中濃度在 **24 小時內下降 60–100%**，且**增加劑量也拉不回來** → 癲癇發作；停 carbapenem 後要 1–2 週才恢復。
- *C. difficile*、念珠菌感染（破壞正常菌叢）。

:::pitfall
- 癲癇病人因院內感染開 **meropenem**，繼續吃 **valproate** → 數天內抽搐發作 → 不是癲癇控制變差，是**交互作用**；應換抗生素或暫時改用其他抗癲癇藥。
- 培養出 *Stenotrophomonas* 還在用 carbapenem → **天生抗藥**；應改 TMP-SMX。
:::

## Monobactam（Aztreonam）

- **只有單一 β-lactam 環** → **只涵蓋需氧 GNR（含 _Pseudomonas_）**，**完全不涵蓋 GPC、厭氧菌**。
- **與其他 β-lactam 幾乎沒有交叉過敏** → 嚴重 penicillin/cephalosporin 過敏者的 GNR 替代用藥（**ceftazidime 過敏除外**：側鏈相同）。
- **不被 MBL 水解**，但會被 ESBL、AmpC、KPC 水解 → **MBL（NDM）CRE：Ceftazidime-avibactam + Aztreonam**（avibactam 保護 aztreonam 不被 ESBL/AmpC 分解）。
    - Aztreonam-avibactam 單一製劑 2024 年在歐盟核准。
- 用法：1–2 g IV 每 8 小時；吸入劑型用於囊狀纖維化的 *Pseudomonas*。
- 腎毒性低，副作用少。

## 臨床選藥（Choosing a β-Lactam）

### 依菌種選藥（Pathogen-Directed Therapy）

| 菌種 | 首選 β-lactam | 備註 |
|---|---|---|
| *S. pyogenes*（GAS）、*S. agalactiae*（GBS） | Penicillin G/V、Amoxicillin | 從未抗藥；重症 + Clindamycin |
| *S. pneumoniae* | Penicillin G（敏感株）、Ceftriaxone | 腦膜炎 + Vancomycin 直到確認敏感 |
| **MSSA** | **Oxacillin、Cefazolin** | 培養確認後**從 vancomycin 降階** |
| MRSA | （β-lactam 中只有 Ceftaroline） | 見[[感染科#MRSA 治療\|MRSA 治療]] |
| ***E. faecalis*** | **Ampicillin** | 心內膜炎 + Ceftriaxone 或 Gentamicin |
| *E. faecium* | 多抗 ampicillin | 改 Vancomycin；VRE → Linezolid、Daptomycin |
| ***Listeria*** | **Ampicillin** | Cephalosporin **天生無效** |
| *Treponema pallidum* | **Penicillin G** | 孕婦過敏也要減敏 |
| *E. coli*、*Klebsiella*（非 ESBL） | Ceftriaxone、Cefazolin（泌尿道，依藥敏） | |
| **ESBL 腸內菌** | **Carbapenem** | 輕症泌尿道可依藥敏用口服藥；穩定病人可考慮 cephamycin |
| **AmpC 高風險菌** | **Cefepime**、Carbapenem | *E. cloacae*、*K. aerogenes*、*C. freundii*：避免 ceftriaxone |
| ***Pseudomonas*** | Tazocin、Ceftazidime、Cefepime、Meropenem | 重症延長輸注 |
| *Acinetobacter* | Unasyn（高劑量 sulbactam）、Brosym、carbapenem（敏感株） | CRAB 見下表 |
| 厭氧菌（*B. fragilis*） | Augmentin、Unasyn、Tazocin、Carbapenem、cephamycin | 第 3、4 代 cephalosporin 不涵蓋 |

### 抗藥菌的選藥（Resistant Organisms）

```mermaid 革蘭氏陰性腸內菌的 β-lactam 選藥
flowchart TD
    A([培養出腸內菌]):::start --> B{{"Ceftriaxone 抗藥？"}}
    B -->|否| C[Ceftriaxone 或依藥敏降階]:::key
    B -->|是| D{{"Carbapenem 抗藥？"}}
    D -->|否| E{{"AmpC 高風險菌？"}}
    E -->|是| F[Cefepime（MIC ≤ 2）或 Carbapenem]:::key
    E -->|否，ESBL| G[Carbapenem]:::key
    D -->|是，CRE| H{{"碳青黴烯酶種類？"}}
    H -->|KPC| I[Ceftazidime-avibactam、Meropenem-vaborbactam、Imipenem-relebactam]:::key
    H -->|OXA-48| J[Ceftazidime-avibactam]:::key
    H -->|MBL：NDM、VIM、IMP| K[Ceftazidime-avibactam + Aztreonam，或 Cefiderocol]:::danger
```

| 抗藥菌 | 首選 | 次選或併用 |
|---|---|---|
| **ESBL** | **Carbapenem**（Ertapenem 可用於非重症、降階） | 泌尿道感染依藥敏：Nitrofurantoin、TMP-SMX、Fluoroquinolone、Aminoglycoside |
| **AmpC** | Cefepime、Carbapenem | |
| **KPC CRE** | **Ceftazidime-avibactam**、Meropenem-vaborbactam、Imipenem-relebactam | 台灣已出現降低 ceftazidime-avibactam 敏感性的 PBP3 插入突變株，見[[感染科#重要抗藥性機制\|感染科]] |
| **OXA-48 CRE** | **Ceftazidime-avibactam** | Cefiderocol |
| **MBL CRE** | **Ceftazidime-avibactam + Aztreonam**、Cefiderocol | Colistin、Tigecycline（非 β-lactam） |
| **DTR _Pseudomonas_** | **Ceftolozane-tazobactam**、Ceftazidime-avibactam、Imipenem-relebactam、Cefiderocol | |
| **CRAB（_Acinetobacter_）** | **高劑量 Unasyn（sulbactam）+ 第二種藥** | Colistin、Tigecycline、Cefiderocol；sulbactam-durlobactam（國外） |

- 台灣 CRE（尤其 *K. pneumoniae*）的碳青黴烯酶以 **KPC** 最常見，**OXA-48 類、NDM** 逐年增加 → 送驗碳青黴烯酶種類再選藥。
- 細菌抗藥的機制與菌種，見[[感染科#Pseudomonas aeruginosa|*Pseudomonas*]]、[[感染科#Acinetobacter baumannii|*Acinetobacter*]]、[[感染科#腸內菌科（Enterobacteriaceae）|腸內菌科]]。

### 易混淆比較（Commonly Confused Coverage）

:::compare[誰涵蓋 Pseudomonas]
| 涵蓋 *Pseudomonas* | 不涵蓋 *Pseudomonas*（常被誤會） |
|---|---|
| **Tazocin**、**Ceftazidime**、**Cefepime**、Brosym、**Meropenem**、Tienam、Aztreonam、Ceftolozane-tazobactam、Ceftazidime-avibactam | **Ceftriaxone**、Cefotaxime、Augmentin、**Unasyn**、Cefazolin、Cefoxitin、Flumarin、**Ertapenem**、**Ceftaroline** |
:::

:::compare[誰涵蓋厭氧菌（B. fragilis）]
| 涵蓋 | 不涵蓋 |
|---|---|
| **Augmentin、Unasyn、Tazocin**、Brosym、**所有 carbapenem**、Cefoxitin、Cefmetazole、Flumarin | **Ceftriaxone、Ceftazidime、Cefepime**、Cefazolin、Aztreonam → 腹腔感染要**加 Metronidazole** |
:::

:::compare[Ceftriaxone vs Ceftazidime vs Cefepime]
| | Ceftriaxone | Ceftazidime | Cefepime |
|---|---|---|---|
| 世代 | 第 3 代 | 第 3 代 | 第 4 代 |
| GPC（MSSA、肺炎鏈球菌） | **強** | **弱** | 強 |
| *Pseudomonas* | ✗ | **✓** | **✓** |
| AmpC | 不穩定 | 不穩定 | **穩定** |
| 給藥 | **每天 1 次** | 每 8 小時 | 每 8–12 小時 |
| 腎功能調整 | **不需要** | 需要 | 需要（**否則神經毒性**） |
| 代表用途 | CAP、腦膜炎、腎盂腎炎、淋病 | *Pseudomonas*、類鼻疽 | 嗜中性球低下發燒、院內感染 |
:::

:::exam
- **Ertapenem** 是唯一**每天 1 次**的 carbapenem，但**不涵蓋 _Pseudomonas_、_Acinetobacter_、Enterococcus**。
- 腹腔感染用 **ceftriaxone、cefepime、ceftazidime** 時要**加 metronidazole**；用 Tazocin 或 carbapenem 則**不用**。
- **Ceftaroline** 是唯一涵蓋 MRSA 的 β-lactam；**Aztreonam** 是唯一和 penicillin 沒有交叉過敏的 β-lactam。
:::
