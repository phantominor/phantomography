// components/ContentPage.js
// 單一筆記頁：頁名（frontmatter.title）+ 渲染好的 Markdown，外面套全站版面。
// 逐篇筆記另外顯示日期、活動、講者、標籤，以及頁尾的「整合到哪些段落」；醫學周報顯示涵蓋期間、則數與科別。

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { renderCharts, watchTheme } from '@/lib/mermaid';
import SiteLayout from './layout/SiteLayout';

const SITE_NAME = 'Phantomography';
const SITE_URL = 'https://phantomography.vercel.app';

const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// 逐篇筆記列表（::journal）與醫學周報列表（::weekly）的標籤篩選：點標籤只顯示含該標籤的文章，再點一次取消；網址 ?tag=… 可直接帶入
function setupJournalFilter(root) {
  const list = root?.querySelector('.journal-list');
  if (!list) return undefined;
  // 每一種（科別、性質）最多選一個，不同種之間是「且」
  const selected = {};
  const apply = () => {
    const picked = Object.values(selected).filter(Boolean);
    list.querySelectorAll('.journal-tag').forEach((b) => b.classList.toggle('active', selected[b.dataset.kind] === b.dataset.tag));
    list.querySelectorAll('.journal-items').forEach((ul) => {
      let shown = 0;
      ul.querySelectorAll('.journal-item').forEach((li) => {
        const tags = JSON.parse(li.dataset.tags || '[]');
        const hit = picked.every((t) => tags.includes(t));
        li.hidden = !hit;
        if (hit) shown += 1;
      });
      ul.hidden = !shown;
      ul.previousElementSibling.hidden = !shown;
    });
  };
  const fromUrl = new URLSearchParams(window.location.search).get('tag');
  const urlBtn = fromUrl && [...list.querySelectorAll('.journal-tag')].find((b) => b.dataset.tag === fromUrl);
  if (urlBtn) selected[urlBtn.dataset.kind] = fromUrl;
  apply();
  const onClick = (e) => {
    const btn = e.target.closest('.journal-tag');
    if (!btn) return;
    const { kind, tag } = btn.dataset;
    selected[kind] = selected[kind] === tag ? null : tag;
    apply();
  };
  list.addEventListener('click', onClick);
  return () => list.removeEventListener('click', onClick);
}

function JournalMeta({ frontmatter, journal }) {
  const when = [frontmatter.date && String(frontmatter.date).replace(/-/g, '/'), frontmatter.time].filter(Boolean).join(' ');
  const parts = [when, journal.type, frontmatter.event, asList(frontmatter.speaker).join('、'), frontmatter.place].filter(Boolean);
  const tags = asList(frontmatter.tags);
  return (
    <div className="page-meta journal-meta">
      {parts.join(' · ')}
      {frontmatter.integrated === false && <> · <span className="journal-pending">尚未整合</span></>}
      {tags.length > 0 && (
        <span className="journal-meta-tags">
          {tags.map((t) => <Link key={t} href={`/journal?tag=${encodeURIComponent(t)}`} className="journal-item-tag">{t}</Link>)}
        </span>
      )}
    </div>
  );
}

function WeeklyMeta({ weekly }) {
  return (
    <div className="page-meta journal-meta">
      {[weekly.period && `涵蓋 ${weekly.period}`, `${weekly.count} 則`].filter(Boolean).join(' · ')}
      {weekly.subjects.length > 0 && (
        <span className="journal-meta-tags">
          {weekly.subjects.map((t) => <Link key={t} href={`/weekly?tag=${encodeURIComponent(t)}`} className="journal-item-tag">{t}</Link>)}
        </span>
      )}
    </div>
  );
}

export default function ContentPage({ slug, frontmatter, html, toc, tab, navKey, existing, autoNav, journal, weekly, prev, next }) {
  const title = frontmatter.title ? `${frontmatter.title} | ${SITE_NAME}` : SITE_NAME;
  const description = frontmatter.description || 'Phantom 的醫學筆記：醫師國考一階、二階核心重點整理';
  const articleRef = useRef(null);

  // 內文有流程圖時才載入 Mermaid 繪圖；深淺色切換時重畫
  useEffect(() => {
    if (!html.includes('mermaid-chart')) return undefined;
    renderCharts(articleRef.current);
    return watchTheme(() => renderCharts(articleRef.current));
  }, [html]);

  useEffect(() => setupJournalFilter(articleRef.current), [html]);

  return (
    <SiteLayout
      title={frontmatter.title}
      tab={tab}
      navKey={navKey}
      currentSlug={slug}
      existing={existing}
      autoNav={autoNav}
      toc={toc}
      prev={prev}
      next={next}
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/${slug}`} />
        {frontmatter.noindex && <meta name="robots" content="noindex" />}
      </Head>
      {frontmatter.title && <h1 className="page-title">{frontmatter.title}</h1>}
      {journal && <JournalMeta frontmatter={frontmatter} journal={journal} />}
      {weekly && <WeeklyMeta weekly={weekly} />}
      {(frontmatter.updated || frontmatter.status === 'initial') && (
        <div className="page-meta">
          {frontmatter.updated && <>更新於 {String(frontmatter.updated).replace(/-/g, '/')}</>}
          {frontmatter.updated && frontmatter.status === 'initial' && ' · '}
          {frontmatter.status === 'initial' && '初版，尚待校閱'}
        </div>
      )}
      {frontmatter.credit && (
        <div className="page-credit">
          內容來源：
          <a href={frontmatter.credit.url} target="_blank" rel="noopener noreferrer">{frontmatter.credit.name}</a>
        </div>
      )}
      <article ref={articleRef} className="note" dangerouslySetInnerHTML={{ __html: html }} />
      {journal && journal.linked.length > 0 && (
        <section className="journal-linked">
          <div className="journal-linked-title">已整合至</div>
          <ul>
            {journal.linked.map((l) => (
              <li key={l.url}><Link href={l.url}>{[l.page, ...l.path].join(' › ')}</Link></li>
            ))}
          </ul>
        </section>
      )}
    </SiteLayout>
  );
}
