// components/layout/SideNav.js
// 左側導覽（仿 TWMLE）：分組標題 + 頁面清單，預設全部展開、分組可收合；尚未建立的頁面以灰字顯示。
// 手機版改用 MobileNav 的多層抽屜。

import Link from 'next/link';
import { useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';
import { SIDE_NAV } from '@/data/nav';
import styles from './SideNav.module.css';

function Item({ item, currentSlug, existing }) {
  if (!existing.includes(item.slug)) {
    return <li><span className={styles.disabled} title="尚未建立">{item.label}</span></li>;
  }
  const active = item.slug === currentSlug;
  return (
    <li>
      <Link href={'/' + item.slug} className={`${styles.link} ${active ? styles.active : ''}`}>
        {item.label}
      </Link>
    </li>
  );
}

function Section({ section, currentSlug, existing }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.section}>
      <button className={styles.sectionTitle} onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{section.title}</span>
        <LuChevronRight className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>
      {open && (section.items.length ? (
        <ul className={styles.list}>
          {section.items.map((item) => (
            <Item key={item.slug} item={item} currentSlug={currentSlug} existing={existing} />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>尚無頁面</p>
      ))}
    </div>
  );
}

export default function SideNav({ navKey, currentSlug, existing, journalNav = [] }) {
  const sections = navKey === 'journal' ? journalNav : SIDE_NAV[navKey] || [];
  if (!sections.length) return <p className={styles.empty}>尚無頁面</p>;
  return (
    <nav className={styles.nav} aria-label="本區導覽">
      {sections.map((section) => (
        <Section key={section.title} section={section} currentSlug={currentSlug} existing={existing} />
      ))}
    </nav>
  );
}
