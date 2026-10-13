// pages/index.js
// 首頁，內容來自 content/index.md

import ContentPage from '@/components/ContentPage';
import { getContentPageProps } from '@/lib/pageProps';

export default ContentPage;

export async function getStaticProps() {
  return getContentPageProps('');
}
