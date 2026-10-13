// components/layout/ThemeToggle.js
// 深色模式切換：預設跟隨系統，按下後以 data-theme 覆寫並記在 localStorage（初始值由 _document 的腳本在繪製前套用）

import { useEffect, useState } from 'react';
import { LuSun, LuMoon } from 'react-icons/lu';

function effectiveTheme() {
  const set = document.documentElement.dataset.theme;
  if (set) return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle({ className }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => { setTheme(effectiveTheme()); }, []);

  const toggle = () => {
    const nextTheme = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    try { localStorage.setItem('theme', nextTheme); } catch {}
    setTheme(nextTheme);
  };

  return (
    <button className={className} onClick={toggle} aria-label={theme === 'dark' ? '切換為淺色模式' : '切換為深色模式'}>
      {theme === 'dark' ? <LuSun /> : <LuMoon />}
    </button>
  );
}
