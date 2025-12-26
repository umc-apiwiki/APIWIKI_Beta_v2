// src/components/FeedbackModal.tsx
// 피드백 제출 모달 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FeedbackType } from '@/types';

// ============================================
// Props 타입
// ============================================

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
}

// ============================================
// 피드백 타입 옵션
// ============================================

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

// ============================================
// 컴포넌트
// ============================================

export default function FeedbackModal({ isOpen, onClose, userId }: FeedbackModalProps) {
    const [selectedType, setSelectedType] = useState<FeedbackType>('error');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // 모달이 열릴 때 폼 초기화
    useEffect(() => {
        if (isOpen) {
            setSelectedType('error');
            setContent('');
            setError('');
        }
    }, [isOpen]);

    // 피드백 제출
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 유효성 검사
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: selectedType,
                    content,
                    userId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // 성공 토스트 (간단한 alert로 대체, 추후 toast 라이브러리 사용)
                alert(data.message || '피드백이 제출되었습니다!');
                onClose();
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
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    {/* 배경 오버레이 */}
                    <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />

                    {/* 모달 컨텐츠 */}
                    <motion.div 
                        className="relative bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        style={{ borderRadius: '20px' }}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* 헤더 */}
                        <div className="flex items-center justify-between p-8 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                            <h2 className="text-[32px] font-bold" style={{ color: 'var(--text-dark)' }}>
                                피드백 보내기
                            </h2>
                            <motion.button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="닫기"
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* 폼 */}
                        <form onSubmit={handleSubmit} className="p-8">
                            {/* 피드백 타입 선택 */}
                            <div className="mb-8">
                                <label className="block text-[16px] font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>
                                    피드백 타입을 선택해주세요
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {FEEDBACK_TYPES.map((option) => (
                                        <motion.button
                                            key={option.type}
                                            type="button"
                                            onClick={() => setSelectedType(option.type)}
                                            className="p-5 rounded-[15px] border-2 transition-all"
                                            style={{
                                                borderColor: selectedType === option.type ? option.color : 'rgba(0, 0, 0, 0.1)',
                                                backgroundColor: selectedType === option.type ? `${option.color}15` : 'white'
                                            }}
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.div 
                                                className="text-[40px] mb-2"
                                                animate={{ 
                                                    scale: selectedType === option.type ? 1.1 : 1,
                                                    rotate: selectedType === option.type ? [0, -10, 10, 0] : 0
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {option.icon}
                                            </motion.div>
                                            <div className="text-[14px] font-medium" style={{ color: 'var(--text-dark)' }}>
                                                {option.label}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* 내용 입력 */}
                            <div className="mb-6">
                                <label htmlFor="content" className="block text-[16px] font-semibold mb-3" style={{ color: 'var(--text-dark)' }}>
                                    내용
                                </label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={selectedOption.placeholder}
                                    rows={8}
                                    className="w-full px-5 py-4 border-2 rounded-[15px] focus:outline-none resize-none transition-all text-[15px]"
                                    style={{
                                        borderColor: content.length >= 10 ? 'var(--primary-blue)' : 'rgba(0, 0, 0, 0.1)',
                                        color: 'var(--text-dark)'
                                    }}
                                    required
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-[13px]" style={{ color: 'var(--text-gray)' }}>
                                        최소 10자, 최대 1000자
                                    </span>
                                    <span
                                        className="text-[13px] font-medium"
                                        style={{
                                            color: content.length > 1000
                                                ? '#ef4444'
                                                : content.length >= 10
                                                    ? '#22c55e'
                                                    : 'var(--text-gray)'
                                        }}
                                    >
                                        {content.length} / 1000
                                    </span>
                                </div>
                            </div>

                            {/* 에러 메시지 */}
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

                            {/* 버튼 */}
                            <div className="flex gap-4">
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-[15px] font-semibold text-[16px] transition-colors"
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
                                    className="flex-1 px-6 py-4 rounded-[15px] text-white font-semibold text-[16px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ 
                                        backgroundColor: 'var(--primary-blue)',
                                        boxShadow: 'var(--shadow-blue)'
                                    }}
                                    disabled={isSubmitting || content.length < 10 || content.length > 1000}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                >
                                    {isSubmitting ? '제출 중...' : '피드백 제출'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
