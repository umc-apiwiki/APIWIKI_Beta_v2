// src/app/boards/[type]/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/permissions';
import CommentSection from '@/components/CommentSection';
import type { Board, BoardType } from '@/types';

const BOARD_TITLES: Record<BoardType, string> = {
    inquiry: '문의 게시판',
    qna: 'Q&A 게시판',
    free: '자유 게시판',
};

export default function BoardDetailPage({ params }: { params: { type: BoardType; id: string } }) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBoard();
    }, [params.id]);

    const fetchBoard = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/boards/${params.id}`);
            const result = await response.json();

            if (response.ok) {
                setBoard(result.data);
            } else {
                alert('게시글을 찾을 수 없습니다');
                router.push(`/boards/${params.type}`);
            }
        } catch (err) {
            console.error('게시글 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('게시글을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/boards/${params.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || '삭제에 실패했습니다');
            }

            alert('게시글이 삭제되었습니다');
            router.push(`/boards/${params.type}`);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const canDelete = () => {
        if (!isAuthenticated || !board) return false;
        return board.author_id === user?.id || isAdmin(user);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">로딩 중...</div>
            </div>
        );
    }

    if (!board) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href={`/boards/${params.type}`} className="text-sm text-gray-600 hover:text-gray-900">
                        ← {BOARD_TITLES[params.type]}
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-8 mb-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{board.title}</h1>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                                <span className="font-medium">{board.author?.name || board.author_name}</span>
                                {board.author?.grade && (
                                    <span className="text-xs text-gray-500">({board.author.grade})</span>
                                )}
                                <span>{new Date(board.created_at).toLocaleString('ko-KR')}</span>
                            </div>
                            {canDelete() && (
                                <button
                                    onClick={handleDelete}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{board.content}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-8">
                    <CommentSection boardId={params.id} />
                </div>
            </div>
        </div>
    );
}
