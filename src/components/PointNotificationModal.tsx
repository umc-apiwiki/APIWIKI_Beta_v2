'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

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
      }, 2500); // Slightly faster auto-close
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-[360px] bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 16, stiffness: 240 }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                +
              </div>
              <div className="text-3xl font-semibold text-slate-900">+{points}</div>
              <div className="text-base text-slate-600 whitespace-pre-line">
                {message || '활동 포인트가 적립되었습니다.'}
              </div>
              <button
                onClick={onClose}
                className="mt-2 w-full rounded-lg bg-sky-600 hover:bg-sky-700 text-white py-2 text-sm font-medium transition-colors"
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
