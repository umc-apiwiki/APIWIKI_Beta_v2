'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ModalBase.module.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function ModalBase({ isOpen, onClose, title, children }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={title} className={styles.dialogContainer}>
        <div className={styles.dialog}>
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <button onClick={onClose} className={styles.closeButton}>
              닫기
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
