// components/layout/MobileNav.js
// 手機抽屜的多層導覽（仿 Material for MkDocs）：大分頁 → 分類 → 分組 → 頁面 → 本頁目錄，逐層進入、左上箭頭返回。
// 打開時直接停在目前頁面所在的那一層；目前頁面那一列右側有「本頁目錄」按鈕。

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { LuX, LuArrowLeft, LuChevronRight, LuTableOfContents } from 'react-icons/lu';
import { buildNavTree } from '@/data/nav';
import Logo from './Logo';
import Toc from './Toc';
import styles from './MobileNav.module.css';

const isFolder = (node) => Array.isArray(node.children) && node.children.length > 0;

// 從根節點找到 slug 的路徑（含目標本身）
function findPath(node, slug, trail = []) {
  const here = [...trail, node];
  if (node.slug === slug && node.key !== 'root') return here;
  for (const child of node.children || []) {
    const found = findPath(child, slug, here);
    if (found) return found;
  }
  return null;
}

function initialStack(tree, slug) {
  const path = findPath(tree, slug);
  if (!path) return [tree];
  const target = path[path.length - 1];
  return isFolder(target) ? path : path.slice(0, -1);
}

export default function MobileNav({ currentSlug, existing, autoNav, toc, onClose }) {
  const tree = useMemo(() => buildNavTree(autoNav), [autoNav]);
  const currentPath = useMemo(() => findPath(tree, currentSlug) || [], [tree, currentSlug]);
  const [stack, setStack] = useState(() => initialStack(tree, currentSlug));
  const [showToc, setShowToc] = useState(false);

  const panel = stack[stack.length - 1];
  const isRoot = panel.key === 'root';
  const onPath = (node) => currentPath.includes(node);
  const hasToc = toc.length > 0;
  const currentInTree = currentPath.length > 0;

  const openToc = () => setShowToc(true);

  const renderLeaf = (node) => {
    if (!node.slug || !existing.includes(node.slug)) {
      return (
        <li key={node.key} className={styles.row}>
          <span className={styles.disabled}>{node.label}</span>
          <span className={styles.hint}>{node.slug ? '尚未建立' : '尚無頁面'}</span>
        </li>
      );
    }
    const active = node.slug === currentSlug;
    return (
      <li key={node.key} className={styles.row}>
        <Link href={'/' + node.slug} className={`${styles.link} ${active ? styles.active : ''}`} onClick={onClose}>
          {node.label}
        </Link>
        {active && hasToc && (
          <button className={styles.tocBtn} onClick={openToc} aria-label="本頁目錄">
            <LuTableOfContents />
          </button>
        )}
      </li>
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.drawer} thin-scroll`} onClick={(e) => e.stopPropagation()}>
        {showToc ? (
          <div key="toc" className={styles.panel}>
            <div className={styles.head}>
              <button className={styles.iconBtn} onClick={() => setShowToc(false)} aria-label="返回選單">
                <LuArrowLeft />
              </button>
              <span className={styles.headTitle}>本頁目錄</span>
            </div>
            <Toc toc={toc} drawer onNavigate={onClose} />
          </div>
        ) : (
          <div key={panel.key} className={styles.panel}>
            {isRoot ? (
              <div className={styles.rootHead}>
                <button className={`${styles.iconBtn} ${styles.close}`} onClick={onClose} aria-label="關閉選單">
                  <LuX />
                </button>
                <Link href="/" className={styles.rootBrand} onClick={onClose}>
                  <Logo size={44} />
                  <span>Phantomography</span>
                </Link>
              </div>
            ) : (
              <div className={styles.head}>
                <button className={styles.iconBtn} onClick={() => setStack(stack.slice(0, -1))} aria-label="返回上一層">
                  <LuArrowLeft />
                </button>
                <span className={styles.headTitle}>{panel.label}</span>
              </div>
            )}

            <ul className={styles.list}>
              {isRoot && hasToc && !currentInTree && (
                <li className={styles.row}>
                  <button className={`${styles.link} ${styles.active}`} onClick={openToc}>本頁目錄</button>
                  <span className={styles.tocBtnStatic}><LuTableOfContents /></span>
                </li>
              )}
              {!isRoot && panel.slug && existing.includes(panel.slug) && renderLeaf({ ...panel, key: `${panel.key}:overview`, label: '總覽' })}
              {panel.children.map((child) => (isFolder(child) ? (
                <li key={child.key} className={styles.row}>
                  <button className={`${styles.link} ${onPath(child) ? styles.active : ''}`} onClick={() => setStack([...stack, child])}>
                    {child.label}
                  </button>
                  <LuChevronRight className={styles.chevron} />
                </li>
              ) : renderLeaf(child)))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
