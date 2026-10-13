// components/layout/ClinicalTab.js
// 「臨床醫學」分頁：點擊展開八選一的下拉選單；選定後分頁文字顯示「臨床醫學 / 目前分類」

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { LuChevronDown, LuCheck } from 'react-icons/lu';
import styles from './SiteLayout.module.css';

export default function ClinicalTab({ tab, active, navKey }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const current = tab.children.find((c) => c.key === navKey);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  return (
    <div className={styles.tabMenuWrap} ref={wrapRef}>
      <button
        className={`${styles.tab} ${active ? styles.tabActive : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {tab.label}
        {active && current && (
          <>
            <span className={styles.tabSep}>/</span>
            {current.label}
          </>
        )}
        <LuChevronDown className={`${styles.tabChevron} ${open ? styles.tabChevronOpen : ''}`} />
      </button>
      {open && (
        <div className={styles.tabMenu} role="menu">
          <Link href={'/' + tab.slug} className={`${styles.tabMenuItem} ${active && !current ? styles.tabMenuCurrent : ''}`} role="menuitem">
            總覽
          </Link>
          <div className={styles.tabMenuDivider} />
          {tab.children.map((c) => (
            <Link
              key={c.key}
              href={'/' + c.slug}
              className={`${styles.tabMenuItem} ${c.key === navKey ? styles.tabMenuCurrent : ''}`}
              role="menuitem"
            >
              {c.label}
              {c.key === navKey && <LuCheck />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
