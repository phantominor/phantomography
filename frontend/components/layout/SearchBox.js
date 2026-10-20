// components/layout/SearchBox.js
// 全站搜尋：桌面版是標題列右側的搜尋框 + 下拉結果；手機版是圖示按鈕，點了開全螢幕搜尋。
// 索引（public/search-index.json，以 h2/h3 段落為單位）第一次使用時才載入。
// 比對方式：查詢字串以空白分成多個詞，每個詞都要出現在段落裡（不分大小寫），標題命中加權較高。
// 快捷鍵：「/」聚焦搜尋框，↑↓ 選擇、Enter 開啟、Esc 關閉。反白選單的「站內查詢」也從這裡打開。

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { LuSearch, LuX, LuArrowLeft } from 'react-icons/lu';
import { SITE_SEARCH_EVENT } from './SelectionMenu';
import SearchPreview from './SearchPreview';
import styles from './SearchBox.module.css';

const MAX_RESULTS = 30;
const SNIPPET_RADIUS = 36;

// 手機版點結果：交給 SiteLayout 開連結預覽面板
export const PEEK_EVENT = 'phantom:peek';

let indexPromise = null;
function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch('/search-index.json')
      .then((r) => r.json())
      .then((entries) => entries.map((e) => ({ ...e, hay: `${e.s} ${e.t} ${e.k || ''}`.toLowerCase(), title: e.s.toLowerCase(), page: e.p.toLowerCase() })))
      .catch(() => { indexPromise = null; return []; });
  }
  return indexPromise;
}

// 英文、數字組成的詞要從字首開始比對（避免「STEMI」命中 systemic），中文詞直接比對子字串
function matcher(term) {
  if (/^[a-z0-9]+$/.test(term)) {
    const re = new RegExp(`(^|[^a-z0-9])${term}`, 'g');
    return (s) => (s.match(re) || []).length;
  }
  return (s) => s.split(term).length - 1;
}

function search(index, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const counters = terms.map(matcher);
  const hits = [];
  for (const e of index) {
    let score = 0;
    let ok = true;
    for (const count of counters) {
      const inPage = count(e.page) > 0;
      const n = count(e.hay);
      if (!n && !inPage) { ok = false; break; }
      if (count(e.title)) score += 10;
      if (inPage) score += 3;
      score += Math.min(n, 5);
    }
    if (ok) hits.push({ e, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, MAX_RESULTS).map((h) => h.e);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 把查詢詞包上 <mark>（回傳 React 節點陣列，不用 innerHTML）
function highlight(text, terms) {
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

function snippet(text, terms) {
  const lower = text.toLowerCase();
  let at = -1;
  for (const term of terms) {
    at = lower.indexOf(term);
    if (at >= 0) break;
  }
  if (at < 0) return text.slice(0, SNIPPET_RADIUS * 2) + (text.length > SNIPPET_RADIUS * 2 ? '…' : '');
  const start = Math.max(0, at - SNIPPET_RADIUS);
  const end = Math.min(text.length, at + SNIPPET_RADIUS * 2);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

function Results({ results, terms, activeIndex, onPick, onHover, loading, query }) {
  if (loading) return <p className={styles.status}>載入索引中…</p>;
  if (!query.trim()) return <p className={styles.status}>輸入關鍵字搜尋全站筆記</p>;
  if (!results.length) return <p className={styles.status}>找不到符合的內容</p>;
  return (
    <ul className={`${styles.results} thin-scroll`} role="listbox">
      {results.map((r, i) => (
        <li key={`${r.u}#${r.i}`} role="option" aria-selected={i === activeIndex}>
          <button
            className={`${styles.result} ${i === activeIndex ? styles.resultActive : ''}`}
            onMouseEnter={() => onHover(i)}
            onClick={() => onPick(r)}
          >
            <span className={styles.resultPath}>
              {r.g && <span className={styles.tag}>{r.g}</span>}
              {r.c && <span className={styles.category}>{r.c}</span>}
              <span>{r.p}{r.s && ' / '}{r.s && highlight(r.s, terms)}</span>
            </span>
            {r.t && <span className={styles.resultText}>{highlight(snippet(r.t, terms), terms)}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false); // 桌面下拉
  const [mobileOpen, setMobileOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const ensureIndex = useCallback(() => {
    if (!index) loadIndex().then(setIndex);
  }, [index]);

  const terms = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);
  const results = useMemo(() => (index ? search(index, query) : []), [index, query]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  // 「/」聚焦搜尋
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      e.preventDefault();
      if (window.matchMedia('(min-width: 960px)').matches) inputRef.current?.focus();
      else setMobileOpen(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // 反白選單的「站內查詢」：帶入文字並打開搜尋
  useEffect(() => {
    const onSiteSearch = (e) => {
      setQuery(e.detail);
      ensureIndex();
      if (window.matchMedia('(min-width: 960px)').matches) {
        setOpen(true);
        inputRef.current?.focus();
      } else {
        setMobileOpen(true);
      }
    };
    window.addEventListener(SITE_SEARCH_EVENT, onSiteSearch);
    return () => window.removeEventListener(SITE_SEARCH_EVENT, onSiteSearch);
  }, [ensureIndex]);

  // 桌面：點外面關閉下拉
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (mobileOpen) {
      ensureIndex();
      setTimeout(() => mobileInputRef.current?.focus(), 0);
    }
  }, [mobileOpen, ensureIndex]);

  useEffect(() => {
    const close = () => { setOpen(false); setMobileOpen(false); };
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  const pick = (r, { preview = false } = {}) => {
    setOpen(false);
    setMobileOpen(false);
    inputRef.current?.blur();
    const href = r.i ? `${r.u}#${r.i}` : r.u;
    // 手機版：其他頁面的結果先開預覽面板（可再展開成完整頁面）；同一頁直接捲過去
    if (preview && r.u !== router.asPath.split('#')[0]) {
      window.dispatchEvent(new CustomEvent(PEEK_EVENT, { detail: href }));
      return;
    }
    router.push(href);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      pick(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setMobileOpen(false);
      e.currentTarget.blur();
    }
  };

  const resultProps = {
    results, terms, activeIndex, query, onPick: pick, onHover: setActiveIndex, loading: !index && query.trim() !== '',
  };

  return (
    <>
      <div className={styles.desktop} ref={wrapRef}>
        <div className={`${styles.field} ${open ? styles.fieldOpen : ''}`}>
          <LuSearch className={styles.fieldIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            placeholder="搜尋"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => { ensureIndex(); setOpen(true); }}
            onKeyDown={onKeyDown}
            aria-label="搜尋全站筆記"
          />
          {query && (
            <button className={styles.clear} onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="清除">
              <LuX />
            </button>
          )}
        </div>
        {open && (
          <div className={`${styles.dropdown} ${results.length ? styles.dropdownWide : ''}`}>
            <Results {...resultProps} />
            {results[activeIndex] && <SearchPreview entry={results[activeIndex]} terms={terms} />}
          </div>
        )}
      </div>

      <button className={styles.mobileBtn} onClick={() => setMobileOpen(true)} aria-label="搜尋">
        <LuSearch />
      </button>

      {mobileOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileHead}>
            <button className={styles.mobileIconBtn} onClick={() => setMobileOpen(false)} aria-label="關閉搜尋">
              <LuArrowLeft />
            </button>
            <input
              ref={mobileInputRef}
              className={styles.mobileInput}
              type="search"
              placeholder="搜尋"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="搜尋全站筆記"
            />
            {query && (
              <button className={styles.mobileIconBtn} onClick={() => { setQuery(''); mobileInputRef.current?.focus(); }} aria-label="清除">
                <LuX />
              </button>
            )}
          </div>
          <div className={styles.mobileBody}>
            <Results {...resultProps} onPick={(r) => pick(r, { preview: true })} />
          </div>
        </div>
      )}
    </>
  );
}
