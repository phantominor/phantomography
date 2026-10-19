// components/layout/ConfirmDialog.js
// 簡單的確認提示框：標題、說明、取消 / 確定。Esc 或點背景取消，打開時焦點放在確定按鈕。

import { useEffect, useRef } from 'react';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ title, message, confirmLabel = '確定', cancelLabel = '取消', onConfirm, onCancel }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className={styles.title}>{title}</h2>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>{cancelLabel}</button>
          <button ref={confirmRef} className={styles.confirm} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
