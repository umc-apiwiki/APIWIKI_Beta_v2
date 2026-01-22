// src/components/FeedbackModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PointNotificationModal from './PointNotificationModal';
import type { FeedbackType } from '@/types';
import styles from './FeedbackModal.module.css';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
}

const FEEDBACK_TYPES = [
    {
        type: 'error' as FeedbackType,
        label: '오류 제보',
        icon: '🐛',
        placeholder: '발견하신 오류나 버그를 자세히 설명해주세요...',
        color: '#ef4444',
    },
    {
        type: 'feature' as FeedbackType,
        label: '기능 제안',
        icon: '💡',
        placeholder: '추가되었으면 하는 기능을 제안해주세요...',
        color: '#2196F3',
    },
    {
        type: 'idea' as FeedbackType,
        label: '아이디어 공유',
        icon: '✨',
        placeholder: '서비스 개선을 위한 아이디어를 공유해주세요...',
        color: '#a855f7',
    },
];

export default function FeedbackModal({ isOpen, onClose, userId }: FeedbackModalProps) {
    const [selectedType, setSelectedType] = useState<FeedbackType>('error');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            setSelectedType('error');
            setContent('');
            setError('');
            setShowSuccess(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (content.length < 10) {
            setError('피드백 내용은 최소 10자 이상 입력해주세요');
            return;
        }

        if (content.length > 1000) {
            setError('피드백 내용은 최대 1000자까지 입력 가능합니다');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: selectedType, content, userId }),
            });

            const data = await response.json();

            if (data.success) {
                setShowSuccess(true);
                setContent('');
                
                // 포인트 모달 표시 (회원인 경우에만 5점)
                if (userId) {
                    setShowPointsModal(true);
                }

                setTimeout(() => {
                    setShowSuccess(false);
                    // 포인트 모달이 떠있으면 닫지 않고, 사용자가 직접 닫거나 타이머로 닫히게 둘 수 있지만, 
                    // 여기서는 모달이 닫히면서 부모 모달도 닫히는 흐름.
                    // 포인트 모달은 fixed overlay이므로 부모 모달 닫혀도 보임.
                    onClose();
                }, 2000);
            } else {
                setError(data.message || '피드백 제출에 실패했습니다');
            }
        } catch (err) {
            console.error('피드백 제출 오류:', err);
            setError('피드백 제출 중 오류가 발생했습니다');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedOption = FEEDBACK_TYPES.find((t) => t.type === selectedType)!;

    return (
        <>
            <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />
                    <motion.div 
                        className={`relative bg-white ${styles.modalContainer}`}
                        style={{ borderRadius: '20px' }}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className={`flex items-center justify-between ${styles.modalHeader}`}>
                            <h2 className={styles.modalTitle}>
                                피드백 보내기
                            </h2>
                            <motion.button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="닫기"
                            >
                                <svg className={styles.closeButton} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.modalForm}>
                            <div className="mb-6">
                                <label className={styles.typeLabel}>
                                    피드백 타입을 선택해주세요
                                </label>
                                <div className={styles.typeGrid}>
                                    {FEEDBACK_TYPES.map((option) => (
                                        <motion.button
                                            key={option.type}
                                            type="button"
                                            onClick={() => setSelectedType(option.type)}
                                            className={styles.typeButton}
                                            style={{
                                                borderColor: selectedType === option.type ? option.color : 'rgba(0, 0, 0, 0.1)',
                                                backgroundColor: selectedType === option.type ? `${option.color}15` : 'white'
                                            }}
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.div 
                                                className={styles.typeIcon}
                                                animate={{ 
                                                    scale: selectedType === option.type ? 1.1 : 1,
                                                    rotate: selectedType === option.type ? [0, -10, 10, 0] : 0
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {option.icon}
                                            </motion.div>
                                            <div className={styles.typeText}>
                                                {option.label}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="content" className={styles.contentLabel}>
                                    내용
                                </label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={selectedOption.placeholder}
                                    rows={8}
                                    className={styles.textarea}
                                    style={{
                                        borderColor: content.length >= 10 ? 'var(--primary-blue)' : 'rgba(0, 0, 0, 0.1)'
                                    }}
                                    required
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <span className={styles.charCount} style={{ color: 'var(--text-gray)' }}>
                                        최소 10자, 최대 1000자
                                    </span>
                                    <span
                                        className={`${styles.charCount} font-medium`}
                                        style={{
                                            color: content.length > 1000 ? '#ef4444' : content.length >= 10 ? '#22c55e' : 'var(--text-gray)'
                                        }}
                                    >
                                        {content.length} / 1000
                                    </span>
                                </div>
                            </div>
                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        className="mb-6 p-4 rounded-[12px]"
                                        style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <p className="text-[14px]" style={{ color: '#dc2626' }}>
                                            {error}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div 
                                        className="mb-6 p-4 rounded-[12px]"
                                        style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <p className="text-[14px] font-medium flex items-center gap-2" style={{ color: '#16a34a' }}>
                                            <span className="text-[20px]">✅</span>
                                            피드백이 성공적으로 제출되었습니다! 소중한 의견 감사합니다 🙏
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className={styles.buttonGroup}>
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    className={styles.cancelButton}
                                    style={{ 
                                        border: '2px solid rgba(0, 0, 0, 0.1)',
                                        color: 'var(--text-gray)',
                                        backgroundColor: 'white'
                                    }}
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    취소
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    className={`${styles.submitButton} text-white disabled:opacity-50 relative group`}
                                    style={{ 
                                        backgroundColor: 'var(--primary-blue)',
                                        boxShadow: 'var(--shadow-blue)',
                                        cursor: (isSubmitting || showSuccess || content.length < 10 || content.length > 1000) ? 'not-allowed' : 'pointer'
                                    }}
                                    disabled={isSubmitting || showSuccess || content.length < 10 || content.length > 1000}
                                    whileHover={{ scale: (isSubmitting || showSuccess || content.length < 10 || content.length > 1000) ? 1 : 1.02, y: (isSubmitting || showSuccess || content.length < 10 || content.length > 1000) ? 0 : -2 }}
                                    whileTap={{ scale: (isSubmitting || showSuccess || content.length < 10 || content.length > 1000) ? 1 : 0.98 }}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <motion.div 
                                                className={styles.spinner}
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            제출 중...
                                        </span>
                                    ) : showSuccess ? '제출 완료!' : '피드백 제출'}
                                    {(content.length < 10 && content.length > 0) && (
                                        <AnimatePresence>
                                            <motion.div
                                                className={styles.tooltip}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                            >
                                                최소 10자 이상 입력해주세요 ({content.length}/10)
                                                <div className={styles.tooltipArrow} />
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
            <PointNotificationModal
                isOpen={showPointsModal}
                onClose={() => setShowPointsModal(false)}
                points={3}
                message="피드백 제출 완료!"
            />
        </>
    );
}
