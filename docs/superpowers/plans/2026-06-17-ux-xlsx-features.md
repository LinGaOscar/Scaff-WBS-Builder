# UX 優化 + XLSX 匯出 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 WBS Builder 加入全部展開/收合、狀態統計、搜尋+狀態篩選、XLSX 匯出四個功能。

**Architecture:** 所有修改集中於 `index.html`。前三個功能改動 Header HTML、Stats HTML、CSS 與 render()；XLSX 匯出另需內嵌 SheetJS 函式庫（約 1MB）至 `<script>` 標籤。

**Tech Stack:** 純 HTML / CSS / Vanilla JS；XLSX 匯出使用 SheetJS (xlsx.full.min.js) inline bundle。

---

## 檔案修改範圍

- **Modify:** `index.html` — 唯一檔案，所有任務皆修改此檔
- **Modify:** `CLAUDE.md` — Task 5 更新文件

---

## Task 1：全部展開 / 收合按鈕

**Files:**
- Modify: `index.html:309-317`（Header HTML）
- Modify: `index.html:912 附近`（CRUD 函式區）

- [ ] **Step 1：在 Header 新增兩個按鈕**

找到：
```html
    <button class="btn btn-accent" onclick="toggleTpl()">📋 模板</button>
    <div class="sep"></div>
    <button class="btn btn-green" onclick="addRoot()">＋ 新增群組</button>
```
替換為：
```html
    <button class="btn btn-accent" onclick="toggleTpl()">📋 模板</button>
    <div class="sep"></div>
    <button class="btn btn-muted" onclick="expandAll()">⊞ 全展開</button>
    <button class="btn btn-muted" onclick="collapseAll()">⊟ 全收合</button>
    <div class="sep"></div>
    <button class="btn btn-green" onclick="addRoot()">＋ 新增群組</button>
```

- [ ] **Step 2：在 `// ── CRUD ──` 前新增兩個函式**

找到：
```js
// ── CRUD ──
function addRoot() {
```
在此區塊**前**插入：
```js
// ── Expand / Collapse All ──
function expandAll() {
  collapsed = {};
  render();
}

function collapseAll() {
  allFlat(tree).forEach(n => { if (n.children.length) collapsed[n.id] = true; });
  render();
}

```

- [ ] **Step 3：開啟瀏覽器確認**

```bash
open index.html
```

驗證：Header 出現「⊞ 全展開」和「⊟ 全收合」按鈕；點擊後樹狀結構正確展開/收合。

- [ ] **Step 4：Commit**

```bash
git add index.html
git commit -m "feat: 新增全部展開/收合按鈕"
```

---

## Task 2：狀態統計（Stats 列新增完成格）

**Files:**
- Modify: `index.html:339-343`（Stats HTML）
- Modify: `index.html:788-793`（render() Stats 區段）

- [ ] **Step 1：在 Stats HTML 新增完成格**

找到：
```html
  <div id="stats">
    <div><span class="stat-val" id="s-total">0</span> 工作項目</div>
    <div><span class="stat-val" id="s-roots">0</span> 主要群組</div>
    <div><span class="stat-val" id="s-depth">0</span> 最大層級</div>
  </div>
```
替換為：
```html
  <div id="stats">
    <div><span class="stat-val" id="s-total">0</span> 工作項目</div>
    <div><span class="stat-val" id="s-roots">0</span> 主要群組</div>
    <div><span class="stat-val" id="s-depth">0</span> 最大層級</div>
    <div><span class="stat-val" id="s-done">0/0（0%）</span> 完成</div>
  </div>
```

- [ ] **Step 2：在 render() Stats 區段新增完成統計**

找到：
```js
  // Stats
  const allNodes = allFlat(tree);
  document.getElementById('s-total').textContent = allNodes.length;
  document.getElementById('s-roots').textContent = tree.length;
  const maxDepth = allNodes.length ? Math.max(...allNodes.map(n => n.level)) + 1 : 0;
  document.getElementById('s-depth').textContent = maxDepth;
```
替換為：
```js
  // Stats
  const allNodes = allFlat(tree);
  document.getElementById('s-total').textContent = allNodes.length;
  document.getElementById('s-roots').textContent = tree.length;
  const maxDepth = allNodes.length ? Math.max(...allNodes.map(n => n.level)) + 1 : 0;
  document.getElementById('s-depth').textContent = maxDepth;
  const doneCount = allNodes.filter(n => n.status === 'done').length;
  const pct = allNodes.length ? Math.round(doneCount / allNodes.length * 100) : 0;
  document.getElementById('s-done').textContent = `${doneCount}/${allNodes.length}（${pct}%）`;
```

- [ ] **Step 3：開啟瀏覽器確認**

```bash
open index.html
```

驗證：Stats 列出現「完成 0/X（0%）」；將節點狀態切換為「完成」後，數字即時更新。

- [ ] **Step 4：Commit**

```bash
git add index.html
git commit -m "feat: Stats 列加入完成進度統計"
```

---

## Task 3：搜尋 + 狀態篩選

**Files:**
- Modify: `index.html`（`<style>` 區塊、全域狀態、Header HTML、render() 過濾邏輯）

- [ ] **Step 1：新增全域狀態**

找到（Task 1 新增後應在此之後）：
```js
let dropPosition = null;  // 'before' | 'child'
```
在此行**後**插入：
```js
let filterText   = '';    // 搜尋關鍵字（已 toLowerCase）
let filterStatus = 'all'; // 'all' | 'not-started' | 'in-progress' | 'done'
```

- [ ] **Step 2：新增 CSS**

在 `</style>` 前插入：
```css
  /* ── Filter ── */
  #filter-input {
    padding: 6px 10px; border-radius: 7px;
    border: 1px solid var(--border2); background: var(--surface);
    color: var(--text); font-size: 13px; font-family: inherit;
    width: 160px; outline: none; transition: border-color 0.15s;
  }
  #filter-input:focus { border-color: var(--accent); }
  #filter-input::placeholder { color: var(--muted); }
  #filter-status {
    padding: 6px 8px; border-radius: 7px;
    border: 1px solid var(--border2); background: var(--surface);
    color: var(--text); font-size: 13px; font-family: inherit;
    cursor: pointer; outline: none;
  }

  @media (max-width: 640px) {
    #filter-input  { width: 100%; }
    #filter-status { width: 100%; }
  }
```

- [ ] **Step 3：在 Header 最前方新增搜尋元件**

找到：
```html
  <div id="header-actions">
    <button class="btn btn-accent" onclick="toggleTpl()">📋 模板</button>
```
替換為：
```html
  <div id="header-actions">
    <input id="filter-input" type="text" placeholder="🔍 搜尋節點…"
      oninput="filterText=this.value.toLowerCase();render()">
    <select id="filter-status" onchange="filterStatus=this.value;render()">
      <option value="all">全部狀態</option>
      <option value="not-started">未開始</option>
      <option value="in-progress">進行中</option>
      <option value="done">完成</option>
    </select>
    <div class="sep"></div>
    <button class="btn btn-accent" onclick="toggleTpl()">📋 模板</button>
```

- [ ] **Step 4：在 render() 的節點迴圈加入過濾邏輯**

在 `render()` 的 `vis.forEach(node => {` 迴圈內，找到建立 `row` 的程式碼段末尾 — 緊接在 `row.draggable = true;` 這行**後**插入：

```js
      // Filter
      const textMatch   = !filterText || node.title.toLowerCase().includes(filterText);
      const statusMatch = filterStatus === 'all' || (node.status || 'not-started') === filterStatus;
      const isMatch     = textMatch && statusMatch;
```

然後找到 `treeEl.appendChild(notesRow);` 這行**後**插入：

```js
      // Apply filter dimming to row and notesRow
      row.style.opacity       = isMatch ? '1' : '0.25';
      row.style.pointerEvents = isMatch ? ''  : 'none';
      notesRow.style.opacity       = isMatch ? '1' : '0.25';
      notesRow.style.pointerEvents = isMatch ? ''  : 'none';
```

- [ ] **Step 5：套用模板/匯入時重置篩選**

在 `applyTemplate` 函式內，找到：
```js
  collapsed = {};
  expandedNotes = {};
```
替換為：
```js
  collapsed = {};
  expandedNotes = {};
  filterText = ''; filterStatus = 'all';
  const fi = document.getElementById('filter-input');
  const fs = document.getElementById('filter-status');
  if (fi) fi.value = '';
  if (fs) fs.value = 'all';
```

同樣在 `handleImport` 的 `collapsed = {}; expandedNotes = {};` 後加入：
```js
      filterText = ''; filterStatus = 'all';
      const fi = document.getElementById('filter-input');
      const fs = document.getElementById('filter-status');
      if (fi) fi.value = '';
      if (fs) fs.value = 'all';
```

- [ ] **Step 6：開啟瀏覽器確認**

```bash
open index.html
```

驗證：
- 輸入關鍵字後，不符合的節點變半透明、不可互動，符合的保留清晰
- 切換狀態篩選後，只有對應狀態節點清晰
- 清空搜尋框 + 切回「全部狀態」後恢復正常
- 套用模板後搜尋框自動清空

- [ ] **Step 7：Commit**

```bash
git add index.html
git commit -m "feat: 新增關鍵字搜尋與狀態篩選"
```

---

## Task 4：XLSX 匯出（SheetJS inline）

**Files:**
- Modify: `index.html`（新增 SheetJS `<script>`、新增 `exportXLSX()`、新增 Header 按鈕）

- [ ] **Step 1：下載 SheetJS**

```bash
curl -sL "https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js" -o /tmp/xlsx.full.min.js
wc -c /tmp/xlsx.full.min.js
```

預期：檔案約 900KB-1.1MB（若下載失敗請重試）。

- [ ] **Step 2：將 SheetJS inline 嵌入 HTML**

在 `index.html` 的 `<script>` 主程式標籤**前**（即 `// ── State ──` 所在的 `<script>` 標籤前）插入 SheetJS 內容，使用 Python：

```bash
python3 - <<'EOF'
import re

with open('/tmp/xlsx.full.min.js', 'r', encoding='utf-8') as f:
    xlsx_content = f.read()

with open('/Users/oscarlin/Documents/GitHub/Scaff-WBS-Builder/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 在主 <script> 標籤（const LEVEL_COLORS 所在）前插入 SheetJS
marker = '<script>\nconst LEVEL_COLORS'
xlsx_tag = f'<script>\n/* SheetJS xlsx.full.min.js */\n{xlsx_content}\n</script>\n'
html = html.replace(marker, xlsx_tag + marker, 1)

with open('/Users/oscarlin/Documents/GitHub/Scaff-WBS-Builder/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Done')
EOF
```

確認插入成功：
```bash
grep -c "SheetJS" /Users/oscarlin/Documents/GitHub/Scaff-WBS-Builder/index.html
```
預期輸出：`1`

- [ ] **Step 3：新增 `exportXLSX()` 函式**

在 `exportCSV` 函式**後**（`// ── Import ──` 或 `function importJSON` 前）插入：

```js
function exportXLSX() {
  const nums = numbering(tree);
  const rows = [['編號','層級','工作項目','負責人','開始日期','結束日期','狀態']];
  const walk = (nodes, level=0) => nodes.forEach(n => {
    rows.push([nums[n.id], level+1, n.title, n.owner||'', n.startDate||'', n.endDate||'', STATUS_LABEL[n.status||'not-started']]);
    walk(n.children, level+1);
  });
  walk(tree);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = rows[0].map((_, i) => ({
    wch: Math.max(...rows.map(r => String(r[i]||'').length)) + 2
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'WBS');
  XLSX.writeFile(wb, 'wbs.xlsx');
  showToast('XLSX 已匯出');
}
```

- [ ] **Step 4：在 Header 新增 XLSX 按鈕**

找到：
```html
    <button class="btn btn-muted" onclick="exportCSV()">⬇ CSV/Excel</button>
```
替換為：
```html
    <button class="btn btn-muted" onclick="exportCSV()">⬇ CSV</button>
    <button class="btn btn-muted" onclick="exportXLSX()">⬇ XLSX</button>
```

- [ ] **Step 5：開啟瀏覽器確認**

```bash
open index.html
```

驗證：點擊「⬇ XLSX」下載 `wbs.xlsx`；用 Excel 或 Numbers 開啟確認欄位正確、欄寬自動調整、狀態欄顯示中文。

- [ ] **Step 6：Commit**

```bash
git add index.html
git commit -m "feat: 新增 XLSX 匯出（SheetJS inline）"
```

---

## Task 5：CLAUDE.md 更新

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1：全域狀態新增 filterText / filterStatus**

找到：
```js
let expandedNotes = {};     // { [nodeId]: boolean }，備註列展開狀態
let dropPosition = null;    // 'before' | 'child'，dragover 時更新
```
替換為：
```js
let expandedNotes = {};     // { [nodeId]: boolean }，備註列展開狀態
let dropPosition = null;    // 'before' | 'child'，dragover 時更新
let filterText   = '';      // 搜尋關鍵字（已 toLowerCase）
let filterStatus = 'all';   // 'all' | 'not-started' | 'in-progress' | 'done'
```

- [ ] **Step 2：函式表新增三個函式**

在函式表末尾（`subtreeDepth` 之後）新增：

```
| `expandAll()` | 展開所有節點（`collapsed = {}`） |
| `collapseAll()` | 收合所有有子節點的節點 |
| `exportXLSX()` | 匯出 XLSX（需要 SheetJS inline bundle） |
```

- [ ] **Step 3：更新第 3 階段功能表**

找到：
```markdown
## 第 3 階段（選用）

XLSX 匯出（SheetJS inline bundle）、列印 PDF 樣式、甘特圖 SVG 預覽。
```
替換為：
```markdown
## 第 3 階段

- XLSX 匯出（SheetJS inline bundle）✓
- 列印 PDF 樣式（選用）
- 甘特圖 SVG 預覽（選用）
```

- [ ] **Step 4：Commit**

```bash
git add CLAUDE.md
git commit -m "docs: 更新 CLAUDE.md（filter 狀態、新函式、第 3 階段）"
```
