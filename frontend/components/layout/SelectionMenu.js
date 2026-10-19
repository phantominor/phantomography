// components/layout/SelectionMenu.js
// 反白內文時跳出的小工具列：拷貝、站內查詢、網頁搜尋。
// 只在筆記內文（含頁名、預覽面板）裡反白才出現；桌面版顯示在反白文字上方，
// 觸控裝置顯示在下方（上方留給系統原生的選取選單）。

import { useCallback, useEffect, useRef, useState } from 'react';
import { LuCopy, LuCheck, LuSearch, LuGlobe } from 'react-icons/lu';
import styles from './SelectionMenu.module.css';

const SCOPE = '.note, .page-title';
const MAX_QUERY = 80;
const GAP = 8;

// 讓 SearchBox 接手「站內查詢」
export const SITE_SEARCH_EVENT = 'phantom:site-search';

function currentSelection() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const text = sel.toString().replace(/\s+/g, ' ').trim();
  if (!text) return null;
  const range = sel.getRangeAt(0);
  const node = range.commonAncestorContainer;
  const el = node.nodeType === 1 ? node : node.parentElement;
  if (!el?.closest(SCOPE)) return null;
  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;
  return { text, rect };
}

export default function SelectionMenu() {
  const [sel, setSel] = useState(null);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const timer = useRef(null);

  const update = useCallback(() => {
    clearTimeout(timer.current);
    // 等選取穩定（拖曳中、雙擊選字）再顯示
    timer.current = setTimeout(() => {
      setSel(currentSelection());
      setCopied(false);
    }, 120);
  }, []);

  useEffect(() => {
    const onScroll = () => { if (sel) setSel(currentSelection()); };
    document.addEventListener('selectionchange', update);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('selectionchange', update);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      clearTimeout(timer.current);
    };
  }, [update, sel]);

  if (!sel) return null;

  const touch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const { rect, text } = sel;
  const width = menuRef.current?.offsetWidth || 260;
  const height = menuRef.current?.offsetHeight || 40;
  const left = Math.min(Math.max(8, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 8);
  const above = rect.top - height - GAP;
  const below = rect.bottom + GAP + (touch ? 24 : 0); // 觸控時避開選取把手
  const top = !touch && above > 64 ? above : Math.min(below, window.innerHeight - height - 8);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      document.execCommand('copy');
    }
    setCopied(true);
    setTimeout(() => setSel(null), 700);
  };

  const siteSearch = () => {
    window.dispatchEvent(new CustomEvent(SITE_SEARCH_EVENT, { detail: text.slice(0, MAX_QUERY) }));
    window.getSelection()?.removeAllRanges();
    setSel(null);
  };

  const webSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(text.slice(0, 200))}`, '_blank', 'noopener');
    setSel(null);
  };

  return (
    <div
      ref={menuRef}
      className={styles.menu}
      style={{ left, top }}
      role="toolbar"
      aria-label="反白文字工具"
      onMouseDown={(e) => e.preventDefault()} // 保留反白
    >
      <button className={styles.item} onClick={copy}>
        {copied ? <LuCheck /> : <LuCopy />}
        <span>{copied ? '已拷貝' : '拷貝'}</span>
      </button>
      <button className={styles.item} onClick={siteSearch}>
        <LuSearch />
        <span>站內查詢</span>
      </button>
      <button className={styles.item} onClick={webSearch}>
        <LuGlobe />
        <span>網頁搜尋</span>
      </button>
    </div>
  );
}
