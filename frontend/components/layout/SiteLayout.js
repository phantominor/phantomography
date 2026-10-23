// components/layout/SiteLayout.js
// 全站版面（仿 TWMLE）：頂部列 + 文字分頁 + 左側導覽 / 內文 / 右側目錄 三欄，窄螢幕改成抽屜選單。
// 另外負責：同頁錨點平滑捲動、跨頁 wiki-link 的預覽面板、跳轉後的「返回原處」（同頁跳轉與從預覽展開都有）。

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import {
  LuMenu, LuX, LuGithub, LuHouse, LuArrowUp, LuChevronLeft, LuChevronRight, LuCornerUpLeft,
} from 'react-icons/lu';
import { TABS, SIDE_NAV } from '@/data/nav';
import { findAnchor, smoothScrollTo, flash } from '@/lib/scroll';
import SideNav from './SideNav';
import Toc from './Toc';
import ThemeToggle from './ThemeToggle';
import ClinicalTab from './ClinicalTab';
import PeekPanel from './PeekPanel';
import MobileNav from './MobileNav';
import SearchBox, { PEEK_EVENT } from './SearchBox';
import Logo from './Logo';
import SelectionMenu from './SelectionMenu';
import ConfirmDialog from './ConfirmDialog';
import styles from './SiteLayout.module.css';

const GITHUB_URL = 'https://github.com/phantominor/phantomography';
// 本站是 phantominor 個人網站 A–Z 導覽中的 M（Medicine）；回主站一律先跳確認框
const HAVEN_URL = 'https://phantominor.vercel.app';
const RETURN_KEY = 'peekReturn';
const RESTORE_KEY = 'restoreScroll';

function readSession(key) {
  try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
}
function writeSession(key, value) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function SiteLayout({ title, tab, navKey, currentSlug, existing, toc = [], prev, next, children }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showToTop, setShowToTop] = useState(false);
  const [peekHref, setPeekHref] = useState(null);
  const [returnTo, setReturnTo] = useState(null);
  const [anchorReturnY, setAnchorReturnY] = useState(null);
  const [confirmHaven, setConfirmHaven] = useState(false);

  // 頂部陰影；回到頂部按鈕在往上捲動時出現（同 TWMLE）
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 0);
      setShowToTop(y > 400 && y < lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 換頁：關閉抽屜與預覽；若是「返回原處」則捲回原本的位置
  useEffect(() => {
    const onStart = () => {
      setDrawerOpen(false);
      setPeekHref(null);
      setAnchorReturnY(null);
    };
    const onDone = () => {
      const y = readSession(RESTORE_KEY);
      if (y !== null) {
        writeSession(RESTORE_KEY, null);
        setTimeout(() => window.scrollTo(0, y), 0);
      }
    };
    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onDone);
    return () => {
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onDone);
    };
  }, [router.events]);

  // 「返回原處」提示：從 sessionStorage 讀，回到原頁面時自動消失
  useEffect(() => {
    const saved = readSession(RETURN_KEY);
    if (saved && saved.url.split('#')[0] === router.asPath.split('#')[0]) {
      writeSession(RETURN_KEY, null);
      setReturnTo(null);
    } else {
      setReturnTo(saved);
    }
  }, [router.asPath]);

  // 連結點擊：同頁錨點平滑捲動；跨頁 wiki-link 開預覽
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // 標題旁的逆連結按鈕：展開／收合標題下方的來源清單
      const toggle = e.target.closest?.('.backlink-toggle');
      if (toggle) {
        const list = toggle.closest('h2, h3, h4')?.nextElementSibling;
        if (list?.classList.contains('backlinks')) {
          list.hidden = !list.hidden;
          toggle.setAttribute('aria-expanded', String(!list.hidden));
        }
        return;
      }

      const a = e.target.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      const peekBody = a.closest('[data-peek-body]');

      if (href.startsWith('#')) {
        const el = findAnchor(peekBody || document, href);
        if (!el) return;
        e.preventDefault();
        // 內文裡的同頁連結（不含目錄與標題旁的段落連結）記下跳轉前的位置
        if (!peekBody && a.closest('.note') && !a.classList.contains('anchor')) setAnchorReturnY(window.scrollY);
        smoothScrollTo(el, peekBody);
        flash(el);
        if (!peekBody) window.history.replaceState(window.history.state, '', href);
        return;
      }

      // 總覽頁的卡片：站內換頁
      if (a.classList.contains('card')) {
        e.preventDefault();
        Router.push(href);
        return;
      }

      if (!a.classList.contains('wiki-link')) return;
      const url = new URL(a.href);
      e.preventDefault();
      if (url.pathname === window.location.pathname) {
        // 預覽裡連回目前頁面：關掉預覽，直接捲到該段落
        setPeekHref(null);
        const el = url.hash && findAnchor(document, url.hash);
        if (el) {
          setAnchorReturnY(window.scrollY);
          smoothScrollTo(el);
          flash(el);
        }
        return;
      }
      setPeekHref(url.pathname + url.hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // 手機版搜尋結果：開連結預覽面板
  useEffect(() => {
    const onPeek = (e) => setPeekHref(e.detail);
    window.addEventListener(PEEK_EVENT, onPeek);
    return () => window.removeEventListener(PEEK_EVENT, onPeek);
  }, []);

  const closePeek = useCallback(() => setPeekHref(null), []);

  const expandPeek = useCallback((href) => {
    const origin = { url: router.asPath, title: title || 'Phantomography', scrollY: window.scrollY };
    writeSession(RETURN_KEY, origin);
    setReturnTo(origin);
    router.push(href);
  }, [router, title]);

  const goBack = () => {
    writeSession(RESTORE_KEY, returnTo.scrollY);
    writeSession(RETURN_KEY, null);
    setReturnTo(null);
    router.push(returnTo.url.split('#')[0]);
  };

  const dismissReturn = () => {
    writeSession(RETURN_KEY, null);
    setReturnTo(null);
  };

  const goBackAnchor = () => {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: anchorReturnY, behavior: smooth ? 'smooth' : 'auto' });
    setAnchorReturnY(null);
  };

  const hasSideNav = navKey && SIDE_NAV[navKey];

  return (
    <div className={styles.site}>
      <header className={`${styles.header} ${scrolled ? styles.headerShadow : ''}`}>
        <div className={styles.headerInner}>
          <button className={styles.menuBtn} onClick={() => setDrawerOpen(true)} aria-label="開啟選單">
            <LuMenu />
          </button>
          <Link href="/" className={styles.brand} aria-label="回到首頁">
            <Logo size={28} />
            <span className={styles.brandText}>Phantomography</span>
          </Link>
          <div className={styles.headerActions}>
            <SearchBox />
            <ThemeToggle className={styles.iconBtn} />
            <button className={styles.iconBtn} onClick={() => setConfirmHaven(true)} aria-label="回到 Phantom's Haven" title="回到 Phantom's Haven">
              <LuHouse />
            </button>
            <a href={GITHUB_URL} className={styles.iconBtn} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <LuGithub />
            </a>
          </div>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="主要分類">
        <div className={styles.tabsInner}>
          {TABS.map((t) => (t.children ? (
            <ClinicalTab key={t.key} tab={t} active={t.key === tab} navKey={navKey} />
          ) : (
            <Link key={t.key} href={'/' + t.slug} className={`${styles.tab} ${t.key === tab ? styles.tabActive : ''}`}>
              {t.label}
            </Link>
          )))}
        </div>
      </nav>

      <div className={styles.body}>
        <aside className={`${styles.left} thin-scroll`}>
          {hasSideNav && <SideNav navKey={navKey} currentSlug={currentSlug} existing={existing} />}
        </aside>

        <main className={styles.content}>
          {children}

          {(prev || next) && (
            <nav className={styles.pager} aria-label="上一頁/下一頁">
              {prev ? (
                <Link href={'/' + prev.slug} className={styles.pagerLink}>
                  <LuChevronLeft />
                  <span><small>上一頁</small>{prev.label}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link href={'/' + next.slug} className={`${styles.pagerLink} ${styles.pagerNext}`}>
                  <span><small>下一頁</small>{next.label}</span>
                  <LuChevronRight />
                </Link>
              )}
            </nav>
          )}
        </main>

        <aside className={`${styles.right} thin-scroll`}>
          {toc.length > 0 && <Toc toc={toc} />}
        </aside>
      </div>

      <footer className={styles.footer}>
        Part of <a href={HAVEN_URL} onClick={(e) => { e.preventDefault(); setConfirmHaven(true); }}>Phantom&apos;s Haven</a> · Copywrong © 2026 Phantominor · Content licensed under{' '}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>
      </footer>

      <button
        className={`${styles.toTop} ${showToTop ? styles.toTopVisible : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <LuArrowUp />
        回到頂部
      </button>

      {(returnTo || anchorReturnY !== null) && (
        <div className={styles.returnStack}>
          {anchorReturnY !== null && (
            <div className={styles.returnChip}>
              <button className={styles.returnMain} onClick={goBackAnchor}>
                <LuCornerUpLeft />
                <span>返回原處</span>
              </button>
              <button className={styles.returnClose} onClick={() => setAnchorReturnY(null)} aria-label="不用返回">
                <LuX />
              </button>
            </div>
          )}
          {returnTo && (
            <div className={styles.returnChip}>
              <button className={styles.returnMain} onClick={goBack}>
                <LuCornerUpLeft />
                <span>返回「{returnTo.title}」</span>
              </button>
              <button className={styles.returnClose} onClick={dismissReturn} aria-label="不用返回">
                <LuX />
              </button>
            </div>
          )}
        </div>
      )}

      <SelectionMenu />

      {confirmHaven && (
        <ConfirmDialog
          title="回到 Phantominor 首頁？"
          message="將離開 Phantomography，前往 Phantom's Haven 主站。"
          confirmLabel="前往"
          onConfirm={() => { window.location.href = HAVEN_URL; }}
          onCancel={() => setConfirmHaven(false)}
        />
      )}

      {peekHref && <PeekPanel key="peek" href={peekHref} onClose={closePeek} onExpand={expandPeek} />}

      {drawerOpen && (
        <MobileNav currentSlug={currentSlug} existing={existing} toc={toc} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
}
