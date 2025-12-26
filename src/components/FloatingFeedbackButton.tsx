// src/components/FloatingFeedbackButton.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import FeedbackModal from './FeedbackModal';
import { useAuth } from '@/hooks/useAuth';

export default function FloatingFeedbackButton() {
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const { user } = useAuth();

    return (
        <>
            <motion.button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-[1500]"
                style={{
                    backgroundColor: 'rgba(33, 150, 243, 0.85)',
                    boxShadow: '0 2px 12px rgba(33, 150, 243, 0.25)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ 
                    scale: 1.08,
                    backgroundColor: 'rgba(33, 150, 243, 1)',
                    boxShadow: '0 4px 16px rgba(33, 150, 243, 0.35)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <motion.div
                    animate={{ 
                        rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{ 
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 5
                    }}
                >
                    <Image 
                        src="/f7_exclamationmark-bubble-fill.svg" 
                        alt="Feedback" 
                        width={24} 
                        height={24}
                        style={{ filter: 'brightness(0) invert(1)' }}
                    />
                </motion.div>
            </motion.button>

            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                userId={user?.id}
            />
        </>
    );
}
