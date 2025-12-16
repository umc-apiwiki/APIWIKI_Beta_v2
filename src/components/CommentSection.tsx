// src/components/CommentSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/permissions';
import type { Comment, CommentSubmissionPayload } from '@/types';

interface CommentSectionProps {
    boardId: string;
}

export default function CommentSection({ boardId }: CommentSectionProps) {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<CommentSubmissionPayload>({
        board_id: boardId,
        content: '',
        author_name: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComments();
    }, [boardId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/comments?board_id=${boardId}`);
            const result = await response.json();

            if (response.ok) {
                setComments(result.data || []);
            }
        } catch (err) {
            console.error('댓글 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.content.trim()) {
            setError('댓글 내용을 입력해주세요');
            return;
        }

        if (!isAuthenticated && !formData.author_name?.trim()) {
            setError('작성자 이름을 입력해주세요');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '댓글 작성에 실패했습니다');
            }

            // 성공 시 폼 초기화 및 댓글 목록 새로고침
            setFormData({ board_id: boardId, content: '', author_name: '' });
            await fetchComments();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('댓글을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || '댓글 삭제에 실패했습니다');
            }

            await fetchComments();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const canDeleteComment = (comment: Comment) => {
        if (!isAuthenticated) return false;
        return comment.author_id === user?.id || isAdmin(user);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">댓글 ({comments.length})</h3>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {!isAuthenticated && (
                    <input
                        type="text"
                        value={formData.author_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                        placeholder="이름"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                )}

                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="댓글을 입력하세요"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? '작성 중...' : '댓글 작성'}
                </button>
            </form>

            {/* 댓글 목록 */}
            {loading ? (
                <div className="text-center text-gray-500">로딩 중...</div>
            ) : comments.length === 0 ? (
                <div className="text-center text-gray-500 py-8">첫 댓글을 작성해보세요</div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <span className="font-medium text-gray-900">
                                        {comment.author?.name || comment.author_name}
                                    </span>
                                    {comment.author?.grade && (
                                        <span className="ml-2 text-xs text-gray-500">({comment.author.grade})</span>
                                    )}
                                    <span className="ml-3 text-sm text-gray-500">
                                        {new Date(comment.created_at).toLocaleString('ko-KR')}
                                    </span>
                                </div>
                                {canDeleteComment(comment) && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
