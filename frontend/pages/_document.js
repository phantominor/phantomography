// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

// 在畫面繪製前套用使用者選過的深淺色，避免載入時閃一下
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}`;

export default function Document() {
  return (
    <Html lang="zh-TW">
      <Head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&family=Roboto+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
