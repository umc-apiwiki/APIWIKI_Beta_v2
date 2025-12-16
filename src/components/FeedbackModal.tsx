// src/components/FeedbackModal.tsx
// 피드백 제출 모달 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
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
        color: 'red',
    },
    {
        type: 'feature' as FeedbackType,
        label: '기능 제안',
        icon: '💡',
        placeholder: '추가되었으면 하는 기능을 제안해주세요...',
        color: 'blue',
    },
    {
        type: 'idea' as FeedbackType,
        label: '아이디어 공유',
        icon: '✨',
        placeholder: '서비스 개선을 위한 아이디어를 공유해주세요...',
        color: 'purple',
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

    if (!isOpen) return null;

    const selectedOption = FEEDBACK_TYPES.find((t) => t.type === selectedType)!;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 배경 오버레이 */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* 모달 컨텐츠 */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">피드백 보내기</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="닫기"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 폼 */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* 피드백 타입 선택 */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            피드백 타입을 선택해주세요
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {FEEDBACK_TYPES.map((option) => (
                                <button
                                    key={option.type}
                                    type="button"
                                    onClick={() => setSelectedType(option.type)}
                                    className={`
                    p-4 rounded-lg border-2 transition-all
                    ${selectedType === option.type
                                            ? `border-${option.color}-500 bg-${option.color}-50`
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                  `}
                                >
                                    <div className="text-3xl mb-2">{option.icon}</div>
                                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 내용 입력 */}
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            내용
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={selectedOption.placeholder}
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            required
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">최소 10자, 최대 1000자</span>
                            <span
                                className={`text-xs ${content.length > 1000
                                        ? 'text-red-600'
                                        : content.length >= 10
                                            ? 'text-green-600'
                                            : 'text-gray-500'
                                    }`}
                            >
                                {content.length} / 1000
                            </span>
                        </div>
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* 버튼 */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || content.length < 10 || content.length > 1000}
                        >
                            {isSubmitting ? '제출 중...' : '피드백 제출'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
