/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    outputFileTracingRoot: __dirname,
    // 每個建置 worker 第一次渲染時要解析全站內容（逆連結表），內容變多後會超過預設的 60 秒
    staticPageGenerationTimeout: 300,
    // 搜尋索引檔名帶內容雜湊（scripts/build-search-index.mjs），內容不會變，可以讓瀏覽器長期快取
    async headers() {
        return [{ source: '/search/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }];
    },
};

module.exports = nextConfig;
