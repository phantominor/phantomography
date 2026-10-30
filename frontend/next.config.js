/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    outputFileTracingRoot: __dirname,
    // 每個建置 worker 第一次渲染時要解析全站內容（逆連結表），內容變多後會超過預設的 60 秒
    staticPageGenerationTimeout: 300,
};

module.exports = nextConfig;
