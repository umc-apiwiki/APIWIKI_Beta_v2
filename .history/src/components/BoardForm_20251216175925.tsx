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
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '게시글 작성에 실패했습니다');
            }

            // 성공 시 게시판 목록으로 이동
            router.push(`/boards/${type}`);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {!isAuthenticated && (
                <div>
                    <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-2">
                        작성자 이름 *
                    </label>
                    <input
                        id="author_name"
                        name="author_name"
                        type="text"
                        value={formData.author_name}
                        onChange={handleChange}
                        required={!isAuthenticated}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="이름을 입력하세요"
                    />
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    제목 *
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="제목을 입력하세요"
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    내용 *
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="내용을 입력하세요"
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? '작성 중...' : '작성하기'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        취소
                    </button>
                )}
            </div>
        </form>
    );
}
