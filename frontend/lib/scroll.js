// lib/scroll.js
// 平滑捲動（尊重使用者的「減少動態效果」設定）

function behavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

// 找錨點目標：預覽面板與主頁面可能有同名的 id，所以限定在指定範圍內找
export function findAnchor(root, hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return null;
  return root.querySelector(`[id="${CSS.escape(id)}"]`);
}

// container 為空時捲動整頁（標題列的高度由 html 的 scroll-padding-top 處理）
export function smoothScrollTo(el, container) {
  if (!container) {
    el.scrollIntoView({ behavior: behavior(), block: 'start' });
    return;
  }
  const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 16;
  container.scrollTo({ top, behavior: behavior() });
}

// 目標段落短暫閃一下底色，讓視線知道跳到哪裡
export function flash(el) {
  el.classList.remove('flash-target');
  void el.offsetWidth; // 重新觸發動畫
  el.classList.add('flash-target');
}
