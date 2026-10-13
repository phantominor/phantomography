// pages/[...slug].js
// content/ 底下每個 Markdown 檔對應一個網址（去掉 .md），建置時全部產生成靜態頁

import ContentPage from '@/components/ContentPage';
import { getContentPageProps, getContentPaths } from '@/lib/pageProps';

export default ContentPage;

export async function getStaticPaths() {
  return { paths: getContentPaths(), fallback: false };
}

export async function getStaticProps({ params }) {
  return getContentPageProps(params.slug.join('/'));
}
