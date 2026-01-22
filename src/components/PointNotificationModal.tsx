'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import styles from './PointNotificationModal.module.css';

interface PointNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  message?: string;
}

export default function PointNotificationModal({ isOpen, onClose, points, message }: PointNotificationModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 16, stiffness: 240 }}
          >
            <div className={styles.content}>
              <div className={styles.iconCircle}>
                +
              </div>
              <div className={styles.points}>+{points}</div>
              <div className={styles.message}>
                {message || '활동 포인트가 적립되었습니다.'}
              </div>
              <button
                onClick={onClose}
                className={styles.button}
              >
                확인
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
