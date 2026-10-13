// components/layout/PeekPanel.js
// Notion 式的連結預覽：點到其他頁面的 wiki-link 時先在這裡看內容，不離開目前頁面。
// 桌面版從右側滑出；手機版（< 960px）從下方彈出，按住頂端往下拉可以關閉。
// 內容取自 Next.js 建置時產生的頁面資料（/_next/data/<buildId>/<path>.json）。

import { useCallback, useEffect, useRef, useState } from 'react';
import { LuX, LuMaximize2 } from 'react-icons/lu';
import { findAnchor, smoothScrollTo, flash } from '@/lib/scroll';
import styles from './PeekPanel.module.css';

const cache = new Map();

async function fetchPageProps(pathname) {
  if (cache.has(pathname)) return cache.get(pathname);
  const buildId = window.__NEXT_DATA__?.buildId;
  const path = pathname === '/' ? '/index' : pathname.replace(/\/$/, '');
  const res = await fetch(`/_next/data/${buildId}${path}.json`);
  if (!res.ok) throw new Error(String(res.status));
  const { pageProps } = await res.json();
  cache.set(pathname, pageProps);
  return pageProps;
}

const CLOSE_DRAG_DISTANCE = 100;
const ANIMATION_MS = 220;

export default function PeekPanel({ href, onClose, onExpand }) {
  const [shown, setShown] = useState(false);
  const [state, setState] = useState({ status: 'loading', data: null });
  const [dragY, setDragY] = useState(0);
  const dragStart = useRef(null);
  const panelRef = useRef(null);
  const bodyRef = useRef(null);

  const url = new URL(href, 'http://x');
  const { pathname, hash } = url;

  // 進場動畫
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = useCallback(() => {
    setShown(false);
    setTimeout(onClose, ANIMATION_MS);
  }, [onClose]);

  // 載入目標頁面
  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null });
    fetchPageProps(pathname)
      .then((data) => { if (!cancelled) setState({ status: 'ready', data }); })
      .catch(() => { if (!cancelled) setState({ status: 'error', data: null }); });
    return () => { cancelled = true; };
  }, [pathname]);

  // 內容載入後捲到目標段落
  useEffect(() => {
    if (state.status !== 'ready' || !bodyRef.current) return;
    const body = bodyRef.current;
    const el = hash ? findAnchor(body, hash) : null;
    if (el) {
      body.scrollTop = 0;
      smoothScrollTo(el, body);
      flash(el);
    } else {
      body.scrollTop = 0;
    }
  }, [state, hash]);

  // Esc 關閉；桌面版點面板外面關閉（點的是另一個 wiki-link 則交給外層換內容）
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onDown = (e) => {
      if (!window.matchMedia('(min-width: 960px)').matches) return;
      if (panelRef.current?.contains(e.target) || e.target.closest?.('a.wiki-link')) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [close]);

  // 手機版：按住頂端往下拉關閉
  const onPointerDown = (e) => {
    if (e.target.closest('button')) return;
    dragStart.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (dragStart.current === null) return;
    setDragY(Math.max(0, e.clientY - dragStart.current));
  };
  const onPointerUp = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (dragY > CLOSE_DRAG_DISTANCE) close();
    else setDragY(0);
  };

  const data = state.data;
  const title = data?.frontmatter?.title || '';
  const dragging = dragStart.current !== null;

  return (
    <>
      <div className={`${styles.overlay} ${shown ? styles.overlayShown : ''}`} onClick={close} />
      <aside
        ref={panelRef}
        className={`${styles.panel} ${shown ? styles.shown : ''} ${dragging ? styles.dragging : ''}`}
        style={dragY ? { transform: `translateY(${dragY}px)` } : undefined}
        aria-label="連結預覽"
      >
        <div
          className={styles.head}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className={styles.grip} aria-hidden />
          <div className={styles.headRow}>
            <button className={styles.iconBtn} onClick={close} aria-label="關閉預覽"><LuX /></button>
            <span className={styles.headTitle}>{title}</span>
            <button className={styles.iconBtn} onClick={() => onExpand(href, title)} aria-label="開啟完整頁面" title="開啟完整頁面">
              <LuMaximize2 />
            </button>
          </div>
        </div>
        <div ref={bodyRef} className={styles.body} data-peek-body>
          {state.status === 'loading' && <p className={styles.status}>載入中…</p>}
          {state.status === 'error' && <p className={styles.status}>無法載入這個頁面</p>}
          {state.status === 'ready' && (
            <>
              {title && <h1 className="page-title">{title}</h1>}
              <article className="note" dangerouslySetInnerHTML={{ __html: data.html }} />
            </>
          )}
        </div>
      </aside>
    </>
  );
}
