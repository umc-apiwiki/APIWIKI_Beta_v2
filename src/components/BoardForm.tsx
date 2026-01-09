// src/components/BoardForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
                if (result.error?.includes('작성자 이름')) {
                    // 서버가 비회원(작성자 이름 필)으로 인식함 -> 현재 세션이 만료/무효함
                    alert('보안 업데이트로 인해 로그아웃되었습니다. 다시 로그인해주세요.');
                    window.location.reload(); // 강제 새로고침으로 세션 상태 동기화
                    throw new Error('재로그인이 필요합니다.');
                }
                throw new Error(result.error || '게시글 작성에 실패했습니다');
            }

            // 성공 시 게시판 목록으로 이동
            alert('게시글이 작성되었습니다!');
            router.push(`/boards/${type}`);
            if (onCancel) onCancel();
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
                            // 로그인 모달을 띄우는 편이 좋지만, 여기서는 라우팅하거나 상위 컴포넌트에서 제어해야 함.
                            // 일단 간단하게 알림 후 메인으로 이동하거나 로그인 페이지로 유도
                             alert('로그인이 필요합니다.');
                             router.push('/');
                        }}
                        className="px-6 py-2 bg-[#2196F3] text-white rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors"
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
                            className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] py-3 rounded-xl font-bold text-white bg-[#2196F3] hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? '작성 중...' : '작성하기'}
                        </button>
                    </div>
                </>
            )}
        </form>
    );
}
