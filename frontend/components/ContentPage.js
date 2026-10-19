// components/ContentPage.js
// 單一筆記頁：頁名（frontmatter.title）+ 渲染好的 Markdown，外面套全站版面

import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { renderCharts, watchTheme } from '@/lib/mermaid';
import SiteLayout from './layout/SiteLayout';

const SITE_NAME = 'Phantomography';
const SITE_URL = 'https://phantomography.vercel.app';

export default function ContentPage({ slug, frontmatter, html, toc, tab, navKey, existing, prev, next }) {
  const title = frontmatter.title ? `${frontmatter.title} | ${SITE_NAME}` : SITE_NAME;
  const description = frontmatter.description || 'Phantom 的醫學筆記：醫師國考一階、二階核心重點整理';
  const articleRef = useRef(null);

  // 內文有流程圖時才載入 Mermaid 繪圖；深淺色切換時重畫
  useEffect(() => {
    if (!html.includes('mermaid-chart')) return undefined;
    renderCharts(articleRef.current);
    return watchTheme(() => renderCharts(articleRef.current));
  }, [html]);

  return (
    <SiteLayout
      title={frontmatter.title}
      tab={tab}
      navKey={navKey}
      currentSlug={slug}
      existing={existing}
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
    </SiteLayout>
  );
}
