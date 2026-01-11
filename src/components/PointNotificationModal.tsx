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
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
            <motion.div
                className="relative bg-white/10 backdrop-blur-2xl px-12 py-10 rounded-[30px] shadow-2xl flex flex-col items-center justify-center gap-6 border border-white/40 pointer-events-auto overflow-hidden"
                style={{
                     boxShadow: '0 20px 60px -10px rgba(0,0,0,0.3)',
                }}
                initial={{ scale: 0.5, opacity: 0, y: 50, rotateX: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 50, rotateX: -20 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
            >
                {/* Background decorative glowing orbs */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/30 rounded-full blur-[50px] -translate-x-10 -translate-y-10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-[50px] translate-x-10 translate-y-10 pointer-events-none" />

                <motion.div
                    className="relative z-10 text-[80px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500 drop-shadow-lg"
                    style={{ textShadow: '0 4px 20px rgba(251, 191, 36, 0.4)' }}
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                >
                    +{points}
                </motion.div>
                
                <div className="relative z-10 text-center space-y-2">
                    <motion.div 
                        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Points Earned!
                    </motion.div>
                    <motion.p 
                        className="text-gray-500 font-medium text-lg whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {message || '활동 포인트가 적립되었습니다.'}
                    </motion.p>
                </div>

                {/* Shimmer effect overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                    initial={{ x: '-150%' }}
                    animate={{ x: '150%' }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                />
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
