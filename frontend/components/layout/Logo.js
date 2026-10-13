// components/layout/Logo.js
// 站徽：幽靈輪廓（Phantom）+ 心電圖線（Medicine）。主體用 currentColor、心電圖線用底色，深淺色模式自動反轉

export default function Logo({ size = 28, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
      <polyline
        points="5.2 12.6 8.4 12.6 9.9 9.4 12 15.8 13.6 10.8 15 12.6 18.8 12.6"
        fill="none"
        stroke="var(--color-bg)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
