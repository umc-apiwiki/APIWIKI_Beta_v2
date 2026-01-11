// src/components/BoardForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PointNotificationModal from './PointNotificationModal';
import { useAuth } from '@/hooks/useAuth';
import type { BoardSubmissionPayload, BoardType } from '@/types';

interface BoardFormProps {
    type: BoardType;
    onCancel?: () => void;
}

export default function BoardForm({ type, onCancel }: BoardFormProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [formData, setFormData] = useState<BoardSubmissionPayload>({
        type,
        title: '',
        content: '',
        author_name: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showPointsModal, setShowPointsModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 유효성 검사
        if (!formData.title.trim() || !formData.content.trim()) {
            setError('제목과 내용을 입력해주세요');
            return;
        }

        if (!isAuthenticated && !formData.author_name?.trim()) {
            setError('작성자 이름을 입력해주세요');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/boards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 인증 정보를 포함하여 서버 세션 확인 가능하도록 설정
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.requiresAuth || response.status === 401) {
                    // 로그인이 필요한 경우
                    alert('로그인이 필요합니다. 다시 로그인해주세요.');
                    window.location.reload();
                    throw new Error('로그인이 필요합니다.');
                }
                throw new Error(result.error || '게시글 작성에 실패했습니다');
            }

            // 성공 시 알림 모달 표시 및 지연 이동
            setShowPointsModal(true);

            // 데이터 갱신을 위해 미리 리프레시 호출
            router.refresh();

            // 모달을 볼 시간을 준 후 이동
            setTimeout(() => {
                router.push(`/boards/${type}`);
                if (onCancel) onCancel();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ... (rest of the component logic)

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium mb-4 text-lg">게시글을 작성하려면 로그인이 필요합니다.</p>
                     <button
                        type="button"
                        onClick={() => {
                             alert('로그인이 필요합니다.');
                             router.push('/');
                        }}
                        className="px-4 py-2 rounded-md bg-[#0c4a6e] text-white text-sm font-semibold shadow-sm hover:bg-[#0a3b56] transition-colors"
                    >
                        로그인 하러 가기
                    </button>
                </div>
            ) : (
                <>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                            제목
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-transparent outline-none transition-all"
                            placeholder="제목을 입력하세요"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">
                            내용
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={12}
                            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-transparent outline-none transition-all resize-none"
                            placeholder="내용을 입력하세요"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1 py-3 rounded-md border border-gray-200 text-sm font-semibold text-[#0c4a6e] bg-white hover:border-sky-400 transition-colors disabled:opacity-60"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] py-3 rounded-md bg-[#0c4a6e] text-white text-sm font-semibold shadow-sm hover:bg-[#0a3b56] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? '작성 중...' : '작성하기'}
                        </button>
                    </div>
                </>
            )}
        <PointNotificationModal
                isOpen={showPointsModal}
                onClose={() => setShowPointsModal(false)}
                points={2}
                message="게시글 작성 완료!"
            />
        </form>
    );
}
