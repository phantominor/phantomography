// components/layout/Toc.js
// 本頁目錄（h2、h3），配色仿 TWMLE：目前段落藍色、之前的段落灰色、之後的段落黑色

import { useEffect, useState } from 'react';
import styles from './Toc.module.css';

export default function Toc({ toc, drawer = false, onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) + 24;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = 0;
      toc.forEach((item, i) => {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= offset) current = i;
      });
      setActiveIndex(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [toc]);

  const stateClass = (i) => {
    if (i === activeIndex) return styles.active;
    return i < activeIndex ? styles.past : '';
  };

  return (
    <nav className={`${styles.toc} ${drawer ? styles.drawer : ''}`} aria-label="本頁目錄">
      {!drawer && <div className={styles.title}>本頁目錄</div>}
      <ul>
        {toc.map((item, i) => (
          <li key={item.id} className={item.depth === 3 ? styles.h3 : styles.h2}>
            <a href={`#${item.id}`} className={stateClass(i)} onClick={onNavigate}>
              <span className={styles.num}>{item.num}</span>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
